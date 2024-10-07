import { createPromiseClient, type PromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { Connect } from '../__generated__/psdbconnect_connect';

/**
 * @description Configures a PlanetScale database connection
 * @see https://github.com/planetscale/airbyte-source/blob/v1.32.0/cmd/internal/planetscale_connection.go#L14
 */
export interface PlanetScaleConnectConfig {
    host: string;
    database: string;
    username: string;
    password: string;
    use_replica: boolean;
}

/**
 * @description Creates a psdbconnect.v1alpha1.Connect client for a PlanetScale database
 */
export function createPsdbConnectV1Alpha1Client({
    db_config,
}: {
    db_config: PlanetScaleConnectConfig;
}): PromiseClient<typeof Connect> {
    /**
     * Define the gRPC transport
     * @see https://github.com/planetscale/airbyte-source/blob/v1.32.0/cmd/internal/planetscale_edge_database.go#L240-L247
     */
    const transport = createGrpcTransport({
        baseUrl: `https://${db_config.host}`,
        httpVersion: '2',
        nodeOptions: { rejectUnauthorized: true },
        interceptors: [
            /**
             * Auth-header interceptor implementation
             * @see https://github.com/planetscale/psdb/blob/6848e728f6e7df7d69ff0b53d00309e2656db064/core/client/client.go#L42-L47
             *
             * - Auth is auth.NewBasicAuth
             *   @see https://github.com/planetscale/airbyte-source/blob/v1.32.0/cmd/internal/planetscale_edge_database.go#L245
             * - auth.Type() value is "Basic"
             *   @see https://github.com/planetscale/psdb/blob/6848e728f6e7df7d69ff0b53d00309e2656db064/auth/auth.go#L26
             * - Basic auth uses base64 encoding of `username:password`
             *   @see https://github.com/planetscale/psdb/blob/6848e728f6e7df7d69ff0b53d00309e2656db064/auth/auth.go#L59-L65
             */
            next => async req => {
                req.header.set(
                    'Authorization',
                    `Basic ${Buffer.from(`${db_config.username}:${db_config.password}`).toString('base64')}`,
                );

                return await next(req);
            },
        ],
    });

    /**
     * Create Connect client
     */
    return createPromiseClient(Connect, transport);
}
