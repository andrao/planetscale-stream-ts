// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file data.proto (package psdb.data.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from '@bufbuild/protobuf';

/**
 * enumcheck:exhaustive
 *
 * @generated from enum psdb.data.v1.Role
 */
export enum Role {
    /**
     * @generated from enum value: reader = 0;
     */
    reader = 0,

    /**
     * @generated from enum value: writer = 1;
     */
    writer = 1,

    /**
     * @generated from enum value: readwriter = 2;
     */
    readwriter = 2,

    /**
     * @generated from enum value: admin = 3;
     */
    admin = 3,
}
// Retrieve enum metadata with: proto3.getEnumType(Role)
proto3.util.setEnumType(Role, 'psdb.data.v1.Role', [
    { no: 0, name: 'reader' },
    { no: 1, name: 'writer' },
    { no: 2, name: 'readwriter' },
    { no: 3, name: 'admin' },
]);
