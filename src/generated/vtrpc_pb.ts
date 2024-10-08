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

// This file contains useful data structures for RPCs in Vitess.

// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file vtrpc.proto (package vtrpc, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
    Message,
    proto3,
    type BinaryReadOptions,
    type FieldList,
    type JsonReadOptions,
    type JsonValue,
    type PartialMessage,
    type PlainMessage,
} from '@bufbuild/protobuf';

/**
 * Code represents canonical error codes. The names, numbers and comments
 * must match the ones defined by grpc (0-16):
 *   https://godoc.org/google.golang.org/grpc/codes.
 * 17+ are custom codes
 *
 * @generated from enum vtrpc.Code
 */
export enum Code {
    /**
     * OK is returned on success.
     *
     * @generated from enum value: OK = 0;
     */
    OK = 0,

    /**
     * CANCELED indicates the operation was cancelled (typically by the caller).
     *
     * @generated from enum value: CANCELED = 1;
     */
    CANCELED = 1,

    /**
     * UNKNOWN error. An example of where this error may be returned is
     * if a Status value received from another address space belongs to
     * an error-space that is not known in this address space. Also
     * errors raised by APIs that do not return enough error information
     * may be converted to this error.
     *
     * @generated from enum value: UNKNOWN = 2;
     */
    UNKNOWN = 2,

    /**
     * INVALID_ARGUMENT indicates client specified an invalid argument.
     * Note that this differs from FAILED_PRECONDITION. It indicates arguments
     * that are problematic regardless of the state of the system
     * (e.g., a malformed file name).
     *
     * @generated from enum value: INVALID_ARGUMENT = 3;
     */
    INVALID_ARGUMENT = 3,

    /**
     * DEADLINE_EXCEEDED means operation expired before completion.
     * For operations that change the state of the system, this error may be
     * returned even if the operation has completed successfully. For
     * example, a successful response from a server could have been delayed
     * long enough for the deadline to expire.
     *
     * @generated from enum value: DEADLINE_EXCEEDED = 4;
     */
    DEADLINE_EXCEEDED = 4,

    /**
     * NOT_FOUND means some requested entity (e.g., file or directory) was
     * not found.
     *
     * @generated from enum value: NOT_FOUND = 5;
     */
    NOT_FOUND = 5,

    /**
     * ALREADY_EXISTS means an attempt to create an entity failed because one
     * already exists.
     *
     * @generated from enum value: ALREADY_EXISTS = 6;
     */
    ALREADY_EXISTS = 6,

    /**
     * PERMISSION_DENIED indicates the caller does not have permission to
     * execute the specified operation. It must not be used for rejections
     * caused by exhausting some resource (use RESOURCE_EXHAUSTED
     * instead for those errors).  It must not be
     * used if the caller cannot be identified (use Unauthenticated
     * instead for those errors).
     *
     * @generated from enum value: PERMISSION_DENIED = 7;
     */
    PERMISSION_DENIED = 7,

    /**
     * RESOURCE_EXHAUSTED indicates some resource has been exhausted, perhaps
     * a per-user quota, or perhaps the entire file system is out of space.
     *
     * @generated from enum value: RESOURCE_EXHAUSTED = 8;
     */
    RESOURCE_EXHAUSTED = 8,

    /**
     * FAILED_PRECONDITION indicates operation was rejected because the
     * system is not in a state required for the operation's execution.
     * For example, directory to be deleted may be non-empty, an rmdir
     * operation is applied to a non-directory, etc.
     *
     * A litmus test that may help a service implementor in deciding
     * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
     *  (a) Use UNAVAILABLE if the client can retry just the failing call.
     *  (b) Use ABORTED if the client should retry at a higher-level
     *      (e.g., restarting a read-modify-write sequence).
     *  (c) Use FAILED_PRECONDITION if the client should not retry until
     *      the system state has been explicitly fixed.  E.g., if an "rmdir"
     *      fails because the directory is non-empty, FAILED_PRECONDITION
     *      should be returned since the client should not retry unless
     *      they have first fixed up the directory by deleting files from it.
     *  (d) Use FAILED_PRECONDITION if the client performs conditional
     *      REST Get/Update/Delete on a resource and the resource on the
     *      server does not match the condition. E.g., conflicting
     *      read-modify-write on the same resource.
     *
     * @generated from enum value: FAILED_PRECONDITION = 9;
     */
    FAILED_PRECONDITION = 9,

    /**
     * ABORTED indicates the operation was aborted, typically due to a
     * concurrency issue like sequencer check failures, transaction aborts,
     * etc.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION,
     * ABORTED, and UNAVAILABLE.
     *
     * @generated from enum value: ABORTED = 10;
     */
    ABORTED = 10,

    /**
     * OUT_OF_RANGE means operation was attempted past the valid range.
     * E.g., seeking or reading past end of file.
     *
     * Unlike INVALID_ARGUMENT, this error indicates a problem that may
     * be fixed if the system state changes. For example, a 32-bit file
     * system will generate INVALID_ARGUMENT if asked to read at an
     * offset that is not in the range [0,2^32-1], but it will generate
     * OUT_OF_RANGE if asked to read from an offset past the current
     * file size.
     *
     * There is a fair bit of overlap between FAILED_PRECONDITION and
     * OUT_OF_RANGE.  We recommend using OUT_OF_RANGE (the more specific
     * error) when it applies so that callers who are iterating through
     * a space can easily look for an OUT_OF_RANGE error to detect when
     * they are done.
     *
     * @generated from enum value: OUT_OF_RANGE = 11;
     */
    OUT_OF_RANGE = 11,

    /**
     * UNIMPLEMENTED indicates operation is not implemented or not
     * supported/enabled in this service.
     *
     * @generated from enum value: UNIMPLEMENTED = 12;
     */
    UNIMPLEMENTED = 12,

    /**
     * INTERNAL errors. Means some invariants expected by underlying
     * system has been broken.  If you see one of these errors,
     * something is very broken.
     *
     * @generated from enum value: INTERNAL = 13;
     */
    INTERNAL = 13,

    /**
     * UNAVAILABLE indicates the service is currently unavailable.
     * This is a most likely a transient condition and may be corrected
     * by retrying with a backoff.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION,
     * ABORTED, and UNAVAILABLE.
     *
     * @generated from enum value: UNAVAILABLE = 14;
     */
    UNAVAILABLE = 14,

    /**
     * DATA_LOSS indicates unrecoverable data loss or corruption.
     *
     * @generated from enum value: DATA_LOSS = 15;
     */
    DATA_LOSS = 15,

    /**
     * UNAUTHENTICATED indicates the request does not have valid
     * authentication credentials for the operation.
     *
     * @generated from enum value: UNAUTHENTICATED = 16;
     */
    UNAUTHENTICATED = 16,

    /**
     * CLUSTER_EVENT indicates that a cluster operation might be in effect
     *
     * @generated from enum value: CLUSTER_EVENT = 17;
     */
    CLUSTER_EVENT = 17,

    /**
     * Topo server connection is read-only
     *
     * @generated from enum value: READ_ONLY = 18;
     */
    READ_ONLY = 18,
}
// Retrieve enum metadata with: proto3.getEnumType(Code)
proto3.util.setEnumType(Code, 'vtrpc.Code', [
    { no: 0, name: 'OK' },
    { no: 1, name: 'CANCELED' },
    { no: 2, name: 'UNKNOWN' },
    { no: 3, name: 'INVALID_ARGUMENT' },
    { no: 4, name: 'DEADLINE_EXCEEDED' },
    { no: 5, name: 'NOT_FOUND' },
    { no: 6, name: 'ALREADY_EXISTS' },
    { no: 7, name: 'PERMISSION_DENIED' },
    { no: 8, name: 'RESOURCE_EXHAUSTED' },
    { no: 9, name: 'FAILED_PRECONDITION' },
    { no: 10, name: 'ABORTED' },
    { no: 11, name: 'OUT_OF_RANGE' },
    { no: 12, name: 'UNIMPLEMENTED' },
    { no: 13, name: 'INTERNAL' },
    { no: 14, name: 'UNAVAILABLE' },
    { no: 15, name: 'DATA_LOSS' },
    { no: 16, name: 'UNAUTHENTICATED' },
    { no: 17, name: 'CLUSTER_EVENT' },
    { no: 18, name: 'READ_ONLY' },
]);

/**
 * CallerID is passed along RPCs to identify the originating client
 * for a request. It is not meant to be secure, but only
 * informational.  The client can put whatever info they want in these
 * fields, and they will be trusted by the servers. The fields will
 * just be used for logging purposes, and to easily find a client.
 * VtGate propagates it to VtTablet, and VtTablet may use this
 * information for monitoring purposes, to display on dashboards, or
 * for denying access to tables during a migration.
 *
 * @generated from message vtrpc.CallerID
 */
export class CallerID extends Message<CallerID> {
    /**
     * principal is the effective user identifier. It is usually filled in
     * with whoever made the request to the appserver, if the request
     * came from an automated job or another system component.
     * If the request comes directly from the Internet, or if the Vitess client
     * takes action on its own accord, it is okay for this field to be absent.
     *
     * @generated from field: string principal = 1;
     */
    principal = '';

    /**
     * component describes the running process of the effective caller.
     * It can for instance be the hostname:port of the servlet initiating the
     * database call, or the container engine ID used by the servlet.
     *
     * @generated from field: string component = 2;
     */
    component = '';

    /**
     * subcomponent describes a component inisde the immediate caller which
     * is responsible for generating is request. Suggested values are a
     * servlet name or an API endpoint name.
     *
     * @generated from field: string subcomponent = 3;
     */
    subcomponent = '';

    /**
     * set of security groups that should be assigned to this caller.
     *
     * @generated from field: repeated string groups = 4;
     */
    groups: string[] = [];

    constructor(data?: PartialMessage<CallerID>) {
        super();
        proto3.util.initPartial(data, this);
    }

    static readonly runtime: typeof proto3 = proto3;
    static readonly typeName = 'vtrpc.CallerID';
    static readonly fields: FieldList = proto3.util.newFieldList(() => [
        { no: 1, name: 'principal', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
        { no: 2, name: 'component', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
        { no: 3, name: 'subcomponent', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
        { no: 4, name: 'groups', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true },
    ]);

    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CallerID {
        return new CallerID().fromBinary(bytes, options);
    }

    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CallerID {
        return new CallerID().fromJson(jsonValue, options);
    }

    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CallerID {
        return new CallerID().fromJsonString(jsonString, options);
    }

    static equals(
        a: CallerID | PlainMessage<CallerID> | undefined,
        b: CallerID | PlainMessage<CallerID> | undefined,
    ): boolean {
        return proto3.util.equals(CallerID, a, b);
    }
}

/**
 * RPCError is an application-level error structure returned by
 * VtTablet (and passed along by VtGate if appropriate).
 * We use this so the clients don't have to parse the error messages,
 * but instead can depend on the value of the code.
 *
 * @generated from message vtrpc.RPCError
 */
export class RPCError extends Message<RPCError> {
    /**
     * @generated from field: string message = 2;
     */
    message = '';

    /**
     * @generated from field: vtrpc.Code code = 3;
     */
    code = Code.OK;

    constructor(data?: PartialMessage<RPCError>) {
        super();
        proto3.util.initPartial(data, this);
    }

    static readonly runtime: typeof proto3 = proto3;
    static readonly typeName = 'vtrpc.RPCError';
    static readonly fields: FieldList = proto3.util.newFieldList(() => [
        { no: 2, name: 'message', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
        { no: 3, name: 'code', kind: 'enum', T: proto3.getEnumType(Code) },
    ]);

    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RPCError {
        return new RPCError().fromBinary(bytes, options);
    }

    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RPCError {
        return new RPCError().fromJson(jsonValue, options);
    }

    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RPCError {
        return new RPCError().fromJsonString(jsonString, options);
    }

    static equals(
        a: RPCError | PlainMessage<RPCError> | undefined,
        b: RPCError | PlainMessage<RPCError> | undefined,
    ): boolean {
        return proto3.util.equals(RPCError, a, b);
    }
}
