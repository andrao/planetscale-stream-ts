import { parseQueryResult } from './_common/parseQueryResult';
import {
    createPsdbV1Alpha1DatabaseClient,
    type DatabaseClient,
    type PlanetScaleDatabaseConnectConfig,
} from './clients/createPsdbV1Alpha1DatabaseClient';
import {
    CloseSessionRequest,
    CreateSessionRequest,
    ExecuteRequest,
    type Session,
} from './generated/psdb_pb';
import { BindVariable, Type, Value, type Field } from './generated/query_pb';

interface IPlanetScaleMessagingStreamConstructor<PK extends string> {
    /**
     * @description PlanetScale database config
     */
    db_config: PlanetScaleDatabaseConnectConfig;

    /**
     * @description Messaging table name from which to stream
     */
    table_name: string;

    /**
     * @description The primary key of the messaging table
     */
    table_primary_key: PK;
}

/**
 * @class PlanetScaleMessagingStream
 * @description Vitess Messaging interface for a PlanetScale database
 */
export class PlanetScaleMessagingStream<PK extends string> {
    readonly db_config: IPlanetScaleMessagingStreamConstructor<PK>['db_config'];
    readonly table_name: IPlanetScaleMessagingStreamConstructor<PK>['table_name'];
    readonly table_primary_key: IPlanetScaleMessagingStreamConstructor<PK>['table_primary_key'];

    private client: DatabaseClient | undefined;
    private primary_key_field: Field | undefined;

    constructor({
        db_config,
        table_name,
        table_primary_key,
    }: IPlanetScaleMessagingStreamConstructor<PK>) {
        this.db_config = db_config;
        this.table_name = table_name;
        this.table_primary_key = table_primary_key;

        if (!table_name)
            throw new Error(`PlanetScaleMessagingStream ERROR: table_name must be defined`);
        if (!table_primary_key)
            throw new Error(`PlanetScaleMessagingStream ERROR: table_primary_key must be defined`);
    }

    private getClient() {
        if (this.client) return this.client;

        const client = createPsdbV1Alpha1DatabaseClient({ db_config: this.db_config });
        this.client = client;

        return client;
    }

    private async initSession() {
        const client = this.getClient();

        // Create session
        const { session } = await client.createSession(new CreateSessionRequest());
        if (!session) throw new Error('initSession() ERROR: no session');

        // Set client workload
        await client.execute(new ExecuteRequest({ query: 'set WORKLOAD=OLAP;', session: session }));

        // Close session on SIGINT
        process.on('SIGINT', () => {
            void closeSession({ client, session }).then(() => process.exit());
        });

        return { client, session };
    }

    /**
     * @method stream
     * @description Stream messages from a Vitess Messaging table
     * @param options
     * @param options.read_duration_ms - Amount of time to run stream
     */
    async *stream(options?: { read_duration_ms: number }) {
        /**
         * Get stream
         */
        const { client, session } = await this.initSession();
        const stream = client.streamExecute(
            new ExecuteRequest({
                query: `stream * from ${this.table_name}`,
                session,
            }),
            { timeoutMs: options?.read_duration_ms },
        );

        /**
         * Stream messages
         */
        try {
            let fields: Array<Field> | null = null;

            for await (const res of stream) {
                const { result } = res;
                const { rows: result_rows, fields: result_fields } = result ?? {};

                // Set fields in state
                if (result_fields?.length) {
                    fields = result_fields;

                    // Set primary key field
                    this.primary_key_field = fields.find(f => f.name === this.table_primary_key);
                    if (!this.primary_key_field)
                        throw new Error(`primary key field "${this.table_primary_key}" not found`);
                }

                // Parse & yield rows response
                if (result_rows?.length) {
                    if (!fields) throw new Error(`fields not available`);

                    // Parse response
                    const response = parseQueryResult({ result: { fields, rows: result_rows } });

                    yield {
                        /**
                         * @property raw_response
                         * @description The raw response from the `stream * from {table_name}` query
                         */
                        raw_response: res,

                        /**
                         * @property messages
                         * @description The emitted messages
                         */
                        messages: response.rows as Array<
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            { [K in PK]: string | number } & Record<string, any>
                        >,
                    };
                }
            }
        } catch (error) {
            console.error('PlanetScaleMessagingStream.stream() [ ERROR ]', error);
        } finally {
            // Close session
            await closeSession({ client, session });
        }
    }

    /**
     * @method ack
     * @description Acknowledges Vitess Messaging messages
     */
    async ack(keys: Array<number | string>) {
        /**
         * Get primary key field type, encode values
         */
        const { primary_key_field } = this;
        if (!primary_key_field)
            throw new Error(
                `PlanetScaleMessagingStream.ack() [ ERROR ] must run .stream() and receive field data before calling .ack()`,
            );

        const key_values = keys.map(
            k =>
                new Value({
                    type: primary_key_field.type,
                    value: new Uint8Array(Buffer.from(k.toString(10), 'ascii')),
                }),
        );

        /**
         * Update DB to invalidate
         */
        const client = this.getClient();

        const invalidate_result = await client.execute(
            new ExecuteRequest({
                query: [
                    `update ${this.table_name} set`,
                    `time_acked = UNIX_TIMESTAMP(NOW(6)) * 1000000000,`,
                    `time_next = null`,
                    `where ${this.table_primary_key} in ::keys and time_acked is null`,
                ].join(' '),
                bindVariables: {
                    keys: new BindVariable({ type: Type.TUPLE, values: key_values }),
                },
            }),
        );

        /**
         * Handle response, error
         */
        if (invalidate_result.error) {
            console.error(
                'PlanetScaleMessagingStream.ack() [ ERROR ]',
                invalidate_result.error.message,
            );

            throw new Error(invalidate_result.error.message);
        }

        return {
            n: Number(invalidate_result.result?.rowsAffected ?? 0),
        };
    }
}

/**
 * @description Closes a PlanetScale DB session
 */
async function closeSession({
    client,
    session,
}: {
    client: DatabaseClient;
    session: Session | undefined;
}) {
    if (!session) return;

    try {
        await client.closeSession(new CloseSessionRequest({ session }));
        console.log(`PlanetScaleMessagingStream [ INFO ] closed session`);
    } catch (error) {
        console.error('PlanetScaleMessagingStream closeSession() [ ERROR ]', error);
        throw error;
    }
}
