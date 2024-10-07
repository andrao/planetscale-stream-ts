// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file psdbconnect.proto (package psdbconnect.v1alpha1, syntax proto3)
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
import { QueryResult } from './query_pb.js';
import { RPCError } from './vtrpc_pb.js';

/**
 * enumcheck:exhaustive
 *
 * @generated from enum psdbconnect.v1alpha1.TabletType
 */
export enum TabletType {
    /**
     * REPLICA replicates from primary. It is used to serve live traffic.
     * A REPLICA can be promoted to PRIMARY. A demoted PRIMARY will go to REPLICA.
     *
     * @generated from enum value: replica = 0;
     */
    replica = 0,

    /**
     * PRIMARY is the primary server for the shard. Only PRIMARY allows DMLs.
     *
     * @generated from enum value: primary = 1;
     */
    primary = 1,

    /**
     * BATCH is used to serve traffic for
     * long-running jobs. It is a separate type from REPLICA so
     * long-running queries don't affect web-like traffic.
     *
     * @generated from enum value: batch = 2;
     */
    batch = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(TabletType)
proto3.util.setEnumType(TabletType, 'psdbconnect.v1alpha1.TabletType', [
    { no: 0, name: 'replica' },
    { no: 1, name: 'primary' },
    { no: 2, name: 'batch' },
]);

/**
 * SyncRequest sets up the Sync session for a specific table in a keyspace, shard.
 *
 * @generated from message psdbconnect.v1alpha1.SyncRequest
 */
export class SyncRequest extends Message<SyncRequest> {
    /**
     * The table name to Sync
     *
     * @generated from field: string table_name = 1;
     */
    tableName = '';

    /**
     * Any known state of the table from the last time a sync was run.
     *
     * @generated from field: psdbconnect.v1alpha1.TableCursor cursor = 2;
     */
    cursor?: TableCursor;

    /**
     * Tablet to stream data from
     *
     * @generated from field: psdbconnect.v1alpha1.TabletType tablet_type = 3;
     */
    tabletType = TabletType.replica;

    /**
     * If true, any new data inserted into the table in table_name will be sent in the Sync session.
     *
     * @generated from field: bool include_inserts = 4;
     */
    includeInserts = false;

    /**
     * If true, any updates to data in the table in table_name will be sent in the Sync session.
     *
     * @generated from field: bool include_updates = 5;
     */
    includeUpdates = false;

    /**
     * If true, any deletes to data in the table in table_name will be sent in the Sync session.
     *
     * @generated from field: bool include_deletes = 6;
     */
    includeDeletes = false;

    /**
     * A list of columns to include in the data from the table, an empty array means all columns.
     * If a column is referenced here that isn't in the table's schema, the SyncRequest will fail.
     *
     * @generated from field: repeated string columns = 7;
     */
    columns: string[] = [];

    /**
     * if specified, these cells are used to pick source tablets from.
     * defaults to the cell of the vtgate serving the VStream API.
     *
     * @generated from field: repeated string cells = 8;
     */
    cells: string[] = [];

    constructor(data?: PartialMessage<SyncRequest>) {
        super();
        proto3.util.initPartial(data, this);
    }

    static readonly runtime: typeof proto3 = proto3;
    static readonly typeName = 'psdbconnect.v1alpha1.SyncRequest';
    static readonly fields: FieldList = proto3.util.newFieldList(() => [
        { no: 1, name: 'table_name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
        { no: 2, name: 'cursor', kind: 'message', T: TableCursor },
        { no: 3, name: 'tablet_type', kind: 'enum', T: proto3.getEnumType(TabletType) },
        { no: 4, name: 'include_inserts', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
        { no: 5, name: 'include_updates', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
        { no: 6, name: 'include_deletes', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
        { no: 7, name: 'columns', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true },
        { no: 8, name: 'cells', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true },
    ]);

    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SyncRequest {
        return new SyncRequest().fromBinary(bytes, options);
    }

    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SyncRequest {
        return new SyncRequest().fromJson(jsonValue, options);
    }

    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SyncRequest {
        return new SyncRequest().fromJsonString(jsonString, options);
    }

    static equals(
        a: SyncRequest | PlainMessage<SyncRequest> | undefined,
        b: SyncRequest | PlainMessage<SyncRequest> | undefined,
    ): boolean {
        return proto3.util.equals(SyncRequest, a, b);
    }
}

/**
 * DeletedRow denotes a row that is deleted from the table referenced in the SyncRequest
 *
 * @generated from message psdbconnect.v1alpha1.DeletedRow
 */
export class DeletedRow extends Message<DeletedRow> {
    /**
     * This result will contain only the primary keys from the deleted row.
     *
     * @generated from field: query.QueryResult result = 1;
     */
    result?: QueryResult;

    constructor(data?: PartialMessage<DeletedRow>) {
        super();
        proto3.util.initPartial(data, this);
    }

    static readonly runtime: typeof proto3 = proto3;
    static readonly typeName = 'psdbconnect.v1alpha1.DeletedRow';
    static readonly fields: FieldList = proto3.util.newFieldList(() => [
        { no: 1, name: 'result', kind: 'message', T: QueryResult },
    ]);

    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeletedRow {
        return new DeletedRow().fromBinary(bytes, options);
    }

    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeletedRow {
        return new DeletedRow().fromJson(jsonValue, options);
    }

    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeletedRow {
        return new DeletedRow().fromJsonString(jsonString, options);
    }

    static equals(
        a: DeletedRow | PlainMessage<DeletedRow> | undefined,
        b: DeletedRow | PlainMessage<DeletedRow> | undefined,
    ): boolean {
        return proto3.util.equals(DeletedRow, a, b);
    }
}

/**
 * Updated denotes a row that is updated in the table referenced in the SyncRequest
 *
 * @generated from message psdbconnect.v1alpha1.UpdatedRow
 */
export class UpdatedRow extends Message<UpdatedRow> {
    /**
     * All values of the table before the update was made.
     *
     * @generated from field: query.QueryResult before = 1;
     */
    before?: QueryResult;

    /**
     * All values of the table ater the update was made.
     *
     * @generated from field: query.QueryResult after = 2;
     */
    after?: QueryResult;

    constructor(data?: PartialMessage<UpdatedRow>) {
        super();
        proto3.util.initPartial(data, this);
    }

    static readonly runtime: typeof proto3 = proto3;
    static readonly typeName = 'psdbconnect.v1alpha1.UpdatedRow';
    static readonly fields: FieldList = proto3.util.newFieldList(() => [
        { no: 1, name: 'before', kind: 'message', T: QueryResult },
        { no: 2, name: 'after', kind: 'message', T: QueryResult },
    ]);

    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdatedRow {
        return new UpdatedRow().fromBinary(bytes, options);
    }

    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdatedRow {
        return new UpdatedRow().fromJson(jsonValue, options);
    }

    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdatedRow {
        return new UpdatedRow().fromJsonString(jsonString, options);
    }

    static equals(
        a: UpdatedRow | PlainMessage<UpdatedRow> | undefined,
        b: UpdatedRow | PlainMessage<UpdatedRow> | undefined,
    ): boolean {
        return proto3.util.equals(UpdatedRow, a, b);
    }
}

/**
 * SyncResponse denotes a response to the SyncRequest
 *
 * @generated from message psdbconnect.v1alpha1.SyncResponse
 */
export class SyncResponse extends Message<SyncResponse> {
    /**
     * An array of rows that denote inserts into the table.
     *
     * @generated from field: repeated query.QueryResult result = 1;
     */
    result: QueryResult[] = [];

    /**
     * A state object to use that denotes the current state of the SyncResponse.
     *
     * @generated from field: psdbconnect.v1alpha1.TableCursor cursor = 2;
     */
    cursor?: TableCursor;

    /**
     * Any errors encountered in streaming data from the table.
     *
     * @generated from field: vtrpc.RPCError error = 3;
     */
    error?: RPCError;

    /**
     * An array of rows that denote deletes from the table.
     *
     * @generated from field: repeated psdbconnect.v1alpha1.DeletedRow deletes = 4;
     */
    deletes: DeletedRow[] = [];

    /**
     * An array of rows that denote updates to the table.
     *
     * @generated from field: repeated psdbconnect.v1alpha1.UpdatedRow updates = 5;
     */
    updates: UpdatedRow[] = [];

    constructor(data?: PartialMessage<SyncResponse>) {
        super();
        proto3.util.initPartial(data, this);
    }

    static readonly runtime: typeof proto3 = proto3;
    static readonly typeName = 'psdbconnect.v1alpha1.SyncResponse';
    static readonly fields: FieldList = proto3.util.newFieldList(() => [
        { no: 1, name: 'result', kind: 'message', T: QueryResult, repeated: true },
        { no: 2, name: 'cursor', kind: 'message', T: TableCursor },
        { no: 3, name: 'error', kind: 'message', T: RPCError },
        { no: 4, name: 'deletes', kind: 'message', T: DeletedRow, repeated: true },
        { no: 5, name: 'updates', kind: 'message', T: UpdatedRow, repeated: true },
    ]);

    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SyncResponse {
        return new SyncResponse().fromBinary(bytes, options);
    }

    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SyncResponse {
        return new SyncResponse().fromJson(jsonValue, options);
    }

    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SyncResponse {
        return new SyncResponse().fromJsonString(jsonString, options);
    }

    static equals(
        a: SyncResponse | PlainMessage<SyncResponse> | undefined,
        b: SyncResponse | PlainMessage<SyncResponse> | undefined,
    ): boolean {
        return proto3.util.equals(SyncResponse, a, b);
    }
}

/**
 * TableCursor denotes state of a Sync request to a table.
 * This type can be round-tripped in a SyncRequest to pickup where the last Sync session left off.
 *
 * @generated from message psdbconnect.v1alpha1.TableCursor
 */
export class TableCursor extends Message<TableCursor> {
    /**
     * The shard to sync data from.
     *
     * @generated from field: string shard = 1;
     */
    shard = '';

    /**
     * Keyspace within a shard where the table resides.
     *
     * @generated from field: string keyspace = 2;
     */
    keyspace = '';

    /**
     * Any known vgtid positions from the last a previous session.
     * If this value is empty, the Sync request is treated as a request to
     * download all data within a table in a shard.
     * If this value is invalid, i.e. incorrect format or the binlogs have been purged,
     * the SyncRequest will fail.
     *
     * @generated from field: string position = 3;
     */
    position = '';

    /**
     * Any known last known primary key values from the a previous session.
     *
     * @generated from field: query.QueryResult last_known_pk = 4;
     */
    lastKnownPk?: QueryResult;

    constructor(data?: PartialMessage<TableCursor>) {
        super();
        proto3.util.initPartial(data, this);
    }

    static readonly runtime: typeof proto3 = proto3;
    static readonly typeName = 'psdbconnect.v1alpha1.TableCursor';
    static readonly fields: FieldList = proto3.util.newFieldList(() => [
        { no: 1, name: 'shard', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
        { no: 2, name: 'keyspace', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
        { no: 3, name: 'position', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
        { no: 4, name: 'last_known_pk', kind: 'message', T: QueryResult },
    ]);

    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TableCursor {
        return new TableCursor().fromBinary(bytes, options);
    }

    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TableCursor {
        return new TableCursor().fromJson(jsonValue, options);
    }

    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TableCursor {
        return new TableCursor().fromJsonString(jsonString, options);
    }

    static equals(
        a: TableCursor | PlainMessage<TableCursor> | undefined,
        b: TableCursor | PlainMessage<TableCursor> | undefined,
    ): boolean {
        return proto3.util.equals(TableCursor, a, b);
    }
}
