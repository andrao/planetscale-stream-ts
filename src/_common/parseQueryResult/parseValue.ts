import type { Value } from './proto3ToRows';

/**
 * @description Parses a value based on its column type
 * @see https://github.com/planetscale/airbyte-source/blob/v1.32.0/cmd/internal/types.go#L156
 */
export function parseValue(val: Value, type: string): Value {
    if (type.startsWith('enum')) {
        const values = parseEnumOrSetValues(type);
        return mapEnumValue(val, values);
    } else if (type.startsWith('set')) {
        const values = parseEnumOrSetValues(type);
        return mapSetValue(val, values);
    }

    return val;
}

/**
 * @description Parses enum or set column type and returns an array of values
 * @param type The column type string (e.g., "ENUM('a','b','c')" or "SET('a','b','c')")
 * @see https://github.com/planetscale/airbyte-source/blob/v1.32.0/cmd/internal/types.go#L170
 */
function parseEnumOrSetValues(type: string): Array<string> {
    const values: Array<string> = [];
    const regex = /\((.+)\)/;
    const match = type.match(regex);

    if (match) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const content = match[1]!;

        // Split values by comma and trim whitespace and leading/trailing single quotes
        values.push(...content.split(',').map(v => v.trim().replace(/^'|'$/g, '')));
    }

    return values;
}

/**
 * @description Maps a SET value to its string representation
 * @param value The SET value
 * @param values The array of possible SET values
 * @returns The mapped Value
 * @see https://github.com/planetscale/airbyte-source/blob/v1.32.0/cmd/internal/types.go#L184
 */
function mapSetValue(value: Value, values: Array<string>): Value {
    const parsed_value = new TextDecoder().decode(value.val);
    const parsed_int = parseInt(parsed_value, 10);

    // If value is not an integer, we just return the original value
    if (isNaN(parsed_int)) {
        return value;
    }

    const mapped_values: Array<string> = [];

    // SET mapping is stored as a binary value, e.g. 1001
    const binary = parsed_int.toString(2).padStart(values.length, '0');

    // If the bit is ON, that means the value at that index is included in the SET
    for (let i = 0; i < binary.length; i++) {
        if (binary[i] === '1') {
            // Bytes are in reverse order, the first bit represents the last value in the SET
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mapped_values.unshift(values[binary.length - 1 - i]!);
        }
    }

    // If we can't find the values, just return the original value
    if (mapped_values.length === 0) {
        return value;
    }

    return {
        typ: value.typ,
        val: new TextEncoder().encode(mapped_values.join(',')),
    };
}

/**
 * @description Maps an ENUM value to its string representation
 * @param value The ENUM value
 * @param values The array of possible ENUM values
 * @returns The mapped Value
 */
function mapEnumValue(value: Value, values: Array<string>): Value {
    const parsed_value = new TextDecoder().decode(value.val);
    const index = parseInt(parsed_value, 10);

    if (isNaN(index)) {
        return value;
    }

    if (index === 0) {
        return {
            typ: value.typ,
            val: new TextEncoder().encode(''),
        };
    }

    if (index > 0 && index <= values.length) {
        return {
            typ: value.typ,
            val: new TextEncoder().encode(values[index - 1]),
        };
    }

    return value;
}
