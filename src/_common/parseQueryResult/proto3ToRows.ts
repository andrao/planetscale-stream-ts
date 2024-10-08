import { Type, type Field, type Row } from '../../generated/query_pb';

export interface Value {
    typ: number;
    val: Uint8Array;
}

const NULL: Value = { typ: Type.NULL_TYPE, val: new Uint8Array(0) };

/**
 * @description Converts proto3 rows to an array of Value arrays
 * @see https://github.com/vitessio/vitess/blob/v20.0.2/go/sqltypes/proto3.go#L83
 */
export function proto3ToRows({
    fields,
    rows,
}: {
    fields: Array<Field>;
    rows: Array<Row>;
}): Array<Array<Value>> {
    return rows.map(row => makeRowTrusted(fields, row));
}

/**
 * @description Converts a *querypb.Row to []Value based on the types in fields
 * @see https://github.com/vitessio/vitess/blob/v20.0.2/go/sqltypes/result.go#L279
 */
function makeRowTrusted(fields: Array<Field>, row: Row): Array<Value> {
    const sql_row = new Array<Value>(row.lengths.length);
    let offset = 0;

    for (let i = 0; i < row.lengths.length; i++) {
        const length = Number(row.lengths[i]);
        if (length < 0) {
            continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        sql_row[i] = makeTrusted(fields[i]!.type, row.values.subarray(offset, offset + length));
        offset += length;
    }

    return sql_row;
}

/**
 * @description Creates a new Value based on the type
 * @see https://github.com/vitessio/vitess/blob/v20.0.2/go/sqltypes/value.go#L129
 */
function makeTrusted(typ: Type, val: Uint8Array): Value {
    if (typ === Type.NULL_TYPE) return NULL;

    return { typ, val };
}
