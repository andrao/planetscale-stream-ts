import { type Field } from '../../__generated__/query_pb';
import { parseValue } from './parseValue';
import type { Value } from './proto3ToRows';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface Result {
    fields: Array<Field>;
    rows: Array<Array<Value>>;
}

/**
 * @description Converts proto3 query result to an array of records
 * @see https://github.com/planetscale/airbyte-source/blob/v1.32.0/cmd/internal/types.go#L134
 */
export function queryResultToRecords(qr: Result) {
    const data: Array<Record<string, Value>> = [];
    const columns: Array<string> = qr.fields.map(field => field.name);

    for (const row of qr.rows) {
        const record: Record<string, Value> = {};
        for (let idx = 0; idx < row.length; idx++) {
            if (idx < columns.length) {
                const col = columns[idx]!;

                record[col] = parseValue(row[idx]!, qr.fields[idx]!.type.toString());
            }
        }
        data.push(record);
    }

    return data;
}
