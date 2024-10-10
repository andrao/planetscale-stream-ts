import type { PromiseClient } from '@connectrpc/connect';
import {
    createPsdbConnectV1Alpha1Client,
    type PlanetScaleConnectConfig,
} from '../clients/createPsdbConnectV1Alpha1Client';
import type { Connect } from '../generated/psdbconnect_connect';
import { SyncRequest, TabletType, type TableCursor } from '../generated/psdbconnect_pb';
import { parseResponse } from './parseResponse';

export { TableCursor } from '../generated/psdbconnect_pb';

interface IPlanetScaleVStreamConstructor {
    /**
     * @description PlanetScale database config
     */
    db_config: PlanetScaleConnectConfig;

    /**
     * @description Table name to stream
     */
    table_name: string;
}

/**
 * @class PlanetScaleVStream
 * @description VStream interface for a PlanetScale database
 */
export class PlanetScaleVStream {
    readonly db_config: IPlanetScaleVStreamConstructor['db_config'];
    readonly table_name: IPlanetScaleVStreamConstructor['table_name'];

    private client: PromiseClient<typeof Connect>;

    constructor({ db_config, table_name }: IPlanetScaleVStreamConstructor) {
        this.db_config = db_config;
        this.table_name = table_name;
        this.client = createPsdbConnectV1Alpha1Client({ db_config });

        if (!table_name) throw new Error(`PlanetScaleVStream ERROR: table_name must be defined`);
    }

    /**
     * @method stream
     * @description Stream messages from the Vitess VStream
     * @param options
     * @param options.read_duration_ms - Amount of time to run stream
     * @param options.stop_position - The vgtid position at which to stop
     * @param options.table_cursor - The table cursor to start streaming at
     */
    async *stream(options: {
        read_duration_ms?: number;
        stop_position?: string;
        starting_cursor: TableCursor;
    }) {
        const { read_duration_ms, stop_position, starting_cursor } = options;

        const request = new SyncRequest({
            tableName: this.table_name,
            cursor: starting_cursor,
            tabletType: this.db_config.use_replica ? TabletType.replica : TabletType.primary,
            includeInserts: true,
            includeUpdates: true,
            includeDeletes: true,
            columns: [],
        });

        // Init stream, and iterate through results
        try {
            const stream = this.client.sync(request, { timeoutMs: read_duration_ms });

            for await (const res of stream) {
                const { cursor, inserts, updates, deletes } = parseResponse(res);

                yield {
                    /**
                     * @property raw_response
                     * @description The raw response from the sync stream
                     */
                    raw_response: res,

                    /**
                     * @property cursor
                     * @description The cursor position up to which changes have been streamed
                     */
                    cursor,

                    /**
                     * @property inserts
                     * @description The inserts from the sync stream
                     */
                    inserts,

                    /**
                     * @property updates
                     * @description The updates from the sync stream
                     */
                    updates,

                    /**
                     * @property deletes
                     * @description The deletes from the sync stream
                     */
                    deletes,
                };

                // Stop if stop_position reached
                if (stop_position && cursor?.position === stop_position) break;
            }
        } catch (error) {
            console.error('stream() [ ERROR ]', error);
            console.error(`stream() [ ERROR ] REQUEST:`, request.toJson());

            throw error;
        }
    }
}
