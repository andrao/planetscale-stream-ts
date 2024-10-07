import {
    type DeletedRow,
    type SyncResponse,
    type UpdatedRow,
} from '../__generated__/psdbconnect_pb';
import { type QueryResult } from '../__generated__/query_pb';
import { parseQueryResult } from '../_common/parseQueryResult';

/**
 * @description Parses the response from the PlanetScale sync stream
 */
export function parseResponse(res: SyncResponse) {
    const { cursor, deletes: res_deletes, updates: res_updates, result: res_inserts } = res;

    return {
        cursor,
        inserts: parseInserts(res_inserts),
        updates: parseUpdates(res_updates),
        deletes: parseDeletes(res_deletes),
    };
}

function parseInserts(inserts: Array<QueryResult>) {
    return inserts
        .map(insert => {
            const response = parseQueryResult({ result: insert });
            if (!response.table) {
                console.warn(`sync() [ WARNING ] INSERT: No table found in query result`);
                return;
            }

            const { table, rows } = response;

            return rows.map(row => ({ table, row }));
        })
        .filter(x => x !== undefined)
        .flat();
}

function parseUpdates(updates: Array<UpdatedRow>) {
    return updates
        .map(update => {
            const { before: update_before, after: update_after } = update;

            const before = update_before ? parseQueryResult({ result: update_before }) : null;
            const after = update_after ? parseQueryResult({ result: update_after }) : null;

            const n = Math.max(before?.rows.length ?? 0, after?.rows.length ?? 0);

            const results: Array<{
                table: string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                before: Record<string, any> | undefined;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                after: Record<string, any> | undefined;
            }> = [];

            for (let i = 0; i < n; i++) {
                const before_row = before?.rows[i];
                const after_row = after?.rows[i];

                if (before && !before.table)
                    console.warn(
                        `sync() [ WARNING ] UPDATE/before: No table found in query result`,
                    );
                if (after && !after.table)
                    console.warn(`sync() [ WARNING ] UPDATE/after: No table found in query result`);

                const table = before?.table ?? after?.table;
                if (!table) continue;

                results.push({
                    table,
                    before: before_row,
                    after: after_row,
                });
            }

            return results;
        })
        .flat();
}

function parseDeletes(deletes: Array<DeletedRow>) {
    return deletes
        .map(d => d.result)
        .filter(d => d !== undefined)
        .map(result => {
            const response = parseQueryResult({ result });
            if (!response.table) {
                console.warn(`sync() [ WARNING ] DELETE: No table found in query result`);
                return;
            }

            const { table, rows } = response;

            return rows.map(row => ({ table, row }));
        })
        .filter(x => x !== undefined)
        .flat();
}
