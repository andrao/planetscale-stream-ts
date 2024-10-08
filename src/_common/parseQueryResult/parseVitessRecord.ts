import { Type } from '../../generated/query_pb';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description Parses a Vitess record into a JSON-compatible object
 */
export function parseVitessRecord(
    record: Record<string, { typ: number; val: Uint8Array | undefined } | undefined>,
): Record<string, any> {
    const parsed_record: Record<string, any> = {};

    for (const [key, value] of Object.entries(record)) {
        if (value?.val === undefined) {
            parsed_record[key] = null;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            parsed_record[key] = decodeVitessValue(value.typ, value.val);
        }
    }

    return parsed_record;
}

/**
 * @description Decodes a Vitess value based on its type
 */
function decodeVitessValue(typ: Type, val: Uint8Array): any {
    switch (typ) {
        case Type.NULL_TYPE:
            return null;
        case Type.INT8:
        case Type.UINT8:
        case Type.INT16:
        case Type.UINT16:
        case Type.INT24:
        case Type.UINT24:
        case Type.INT32:
        case Type.UINT32:
        case Type.INT64:
        case Type.UINT64:
            return parseInt(Buffer.from(val).toString('ascii'), 10);
        case Type.FLOAT32:
        case Type.FLOAT64:
            return parseFloat(Buffer.from(val).toString('ascii'));
        case Type.TIMESTAMP:
        case Type.DATE:
        case Type.TIME:
        case Type.DATETIME:
        case Type.YEAR:
            return new Date(Buffer.from(val).toString('ascii'));
        case Type.DECIMAL:
            return Buffer.from(val).toString('ascii');
        case Type.TEXT:
        case Type.BLOB:
        case Type.VARCHAR:
        case Type.VARBINARY:
        case Type.CHAR:
        case Type.BINARY:
        case Type.BIT:
        case Type.ENUM:
        case Type.SET:
            return Buffer.from(val).toString('utf8');
        case Type.GEOMETRY:
            return Buffer.from(val).toString('hex');
        case Type.JSON:
            return JSON.parse(Buffer.from(val).toString('utf8'));
        case Type.EXPRESSION:
        case Type.TUPLE:
        case Type.HEXNUM:
        case Type.HEXVAL:
        case Type.BITNUM:
            return Buffer.from(val).toString('hex');
        default:
            console.warn(`Unknown Vitess type: ${Type[typ]}`);
            return Buffer.from(val).toString('hex');
    }
}
