//
//Copyright 2019 The Vitess Authors.
//
//Licensed under the Apache License, Version 2.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at
//
//http://www.apache.org/licenses/LICENSE-2.0
//
//Unless required by applicable law or agreed to in writing, software
//distributed under the License is distributed on an "AS IS" BASIS,
//WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//See the License for the specific language governing permissions and
//limitations under the License.

// This package contains a shared time data structure

// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file vttime.proto (package vttime, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
    Message,
    proto3,
    protoInt64,
    type BinaryReadOptions,
    type FieldList,
    type JsonReadOptions,
    type JsonValue,
    type PartialMessage,
    type PlainMessage,
} from '@bufbuild/protobuf';

/**
 * Time represents a time stamp in nanoseconds. In go, use logutil library
 * to convert times.
 *
 * @generated from message vttime.Time
 */
export class Time extends Message<Time> {
    /**
     * @generated from field: int64 seconds = 1;
     */
    seconds = protoInt64.zero;

    /**
     * @generated from field: int32 nanoseconds = 2;
     */
    nanoseconds = 0;

    constructor(data?: PartialMessage<Time>) {
        super();
        proto3.util.initPartial(data, this);
    }

    static readonly runtime: typeof proto3 = proto3;
    static readonly typeName = 'vttime.Time';
    static readonly fields: FieldList = proto3.util.newFieldList(() => [
        { no: 1, name: 'seconds', kind: 'scalar', T: 3 /* ScalarType.INT64 */ },
        { no: 2, name: 'nanoseconds', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
    ]);

    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Time {
        return new Time().fromBinary(bytes, options);
    }

    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Time {
        return new Time().fromJson(jsonValue, options);
    }

    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Time {
        return new Time().fromJsonString(jsonString, options);
    }

    static equals(
        a: Time | PlainMessage<Time> | undefined,
        b: Time | PlainMessage<Time> | undefined,
    ): boolean {
        return proto3.util.equals(Time, a, b);
    }
}

/**
 * @generated from message vttime.Duration
 */
export class Duration extends Message<Duration> {
    /**
     * @generated from field: int64 seconds = 1;
     */
    seconds = protoInt64.zero;

    /**
     * @generated from field: int32 nanos = 2;
     */
    nanos = 0;

    constructor(data?: PartialMessage<Duration>) {
        super();
        proto3.util.initPartial(data, this);
    }

    static readonly runtime: typeof proto3 = proto3;
    static readonly typeName = 'vttime.Duration';
    static readonly fields: FieldList = proto3.util.newFieldList(() => [
        { no: 1, name: 'seconds', kind: 'scalar', T: 3 /* ScalarType.INT64 */ },
        { no: 2, name: 'nanos', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
    ]);

    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Duration {
        return new Duration().fromBinary(bytes, options);
    }

    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Duration {
        return new Duration().fromJson(jsonValue, options);
    }

    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Duration {
        return new Duration().fromJsonString(jsonString, options);
    }

    static equals(
        a: Duration | PlainMessage<Duration> | undefined,
        b: Duration | PlainMessage<Duration> | undefined,
    ): boolean {
        return proto3.util.equals(Duration, a, b);
    }
}
