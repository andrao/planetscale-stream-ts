import type { QueryResult } from '../../generated/query_pb';
import { parseVitessRecord } from './parseVitessRecord';
import { proto3ToRows } from './proto3ToRows';
import { queryResultToRecords } from './queryResultToRecords';

/**
 * @description Parses a query result into JS records
 */
export function parseQueryResult({ result }: { result: Pick<QueryResult, 'fields' | 'rows'> }) {
    const { fields, rows } = result;
    const table = fields[0]?.table ?? null;

    const values_arrays = proto3ToRows({ fields, rows });
    const records = queryResultToRecords({ fields, rows: values_arrays });

    return {
        table,
        rows: records.map(r => parseVitessRecord(r)),
        records,
    };
}
