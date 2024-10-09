# planetscale-stream-ts

[![npm version](https://badge.fury.io/js/planetscale-stream-ts.svg)](https://badge.fury.io/js/planetscale-stream-ts)
![build](https://github.com/andrao/planetscale-stream-ts/workflows/CI/badge.svg)

This package exports two classes for streaming data from a PlanetScale database:

-   `PlanetScaleMessagingStream`: For reading a [Vitess Messaging](https://vitess.io/docs/20.0/reference/features/messaging/) stream
-   `PlanetScaleVStream`: For reading a Vitess [VStream](https://vitess.io/docs/20.0/reference/vreplication/vstream/) (change data capture) stream

---

-   [PlanetScaleMessagingStream](#planetscalemessagingstream)
    -   [Parameters](#parameters)
        -   [Constructor](#constructor)
        -   [Method: `stream()`](#method-stream)
        -   [Method: `ack()`](#method-ack)
    -   [Usage](#usage)
-   [PlanetScaleVStream](#planetscalevstream)
    -   [Parameters](#parameters-1)
        -   [Constructor](#constructor-1)
        -   [Method: `stream()`](#method-stream-1)
    -   [Determining the starting cursor](#determining-the-starting-cursor)
    -   [Usage](#usage-1)
-   [Using the examples](#using-the-examples)

---

# PlanetScaleMessagingStream

Offers a method, `stream()`, which returns an async iterable for consuming messages from a Vitess Messaging stream.

Note that messages need to be [acknowledged](https://vitess.io/docs/20.0/reference/features/messaging/#acknowledging-messages), otherwise they will be redelivered. Use the `ack()` method to acknowledge messages.

This class uses PlanetScale’s [psdb gRPC API](https://github.com/planetscale/psdb/tree/main/proto-src/psdb), which is a slimmed down version of the Vitess [queryservice](https://github.com/vitessio/vitess/blob/main/proto/queryservice.proto). It’s an alpha API, without much documentation, whose purpose I’m unsure of, and which has not been publicized in any real way, so use with caution.

See the Vitess documentation for more information on Vitess Messaging, including instructions on how to create a messaging table:

-   [Features: Vitess Messaging](https://vitess.io/docs/20.0/reference/features/messaging)

## Parameters

### Constructor

| Parameter            | Description                                                   |
| :------------------- | :------------------------------------------------------------ |
| `db_config`          | Database connection config                                    |
| `db_config.host`     | PlanetScale host                                              |
| `db_config.database` | PlanetScale database name                                     |
| `db_config.username` | PlanetScale branch username                                   |
| `db_config.password` | PlanetScale branch password                                   |
| `table_name`         | The name of the messaging table from which to stream messages |
| `table_primary_key`  | The name of the primary key field in the messaging table      |

### Method: `stream()`

The `stream()` method uses named parameters:

| Parameter          | Description                                                                               |
| :----------------- | :---------------------------------------------------------------------------------------- |
| `read_duration_ms` | _(Optional)_ The duration for which the stream will be read. Omit to stream indefinitely. |

### Method: `ack()`

The `ack()` method uses one positional parameter:

| Parameter | Description                                            |
| :-------- | :----------------------------------------------------- |
| `keys`    | An array of message primary key values to acknowledge. |

## Usage

```ts
import { PlanetScaleMessagingStream } from 'planetscale-stream-ts';

const messenger = new PlanetScaleMessagingStream({
    db_config: {
        host: 'aws.connect.psdb.cloud',
        database: 'my_db',
        username: 'my_user',
        password: '<secret>',
    },
    table_name: 'my_message',
    primary_key: 'id',
});

const stream = messenger.stream({ read_duration_ms: 30 * 1000 });

for await (const { messages } of stream) {
    // Log out messages
    console.dir(messages, { depth: null });

    // Acknowledge messages using primary key values
    const keys = messages.map(r => r.id);
    void messenger.ack(keys);
}
```

## Example

<video src='https://github.com/user-attachments/assets/85a82b4c-0f78-4960-a1a7-ec4c591ec6b5' width=360></video>

---

# PlanetScaleVStream

Offers a method, `stream()`, which returns an async iterable for consuming messages from a Vitess VStream.

This class uses the [psdbconnect gRPC API](https://github.com/planetscale/psdb/tree/main/proto-src/psdbconnect), which is used for e.g. the [Connect Airbyte adapter](https://github.com/planetscale/airbyte-source/tree/main). This API is in alpha, so use with caution.

See the Vitess documentation for more information on VStream:

-   [Concepts: VStream](https://vitess.io/docs/20.0/concepts/vstream/)
-   [Reference: VStream](https://vitess.io/docs/20.0/reference/vreplication/vstream/)
-   [Reference: Life of a Stream](https://vitess.io/docs/20.0/reference/vreplication/internal/life-of-a-stream/)
-   [Reference: VStream Skew Minimization](https://vitess.io/docs/20.0/reference/vreplication/internal/vstream-skew-detection/)
-   [Reference: VStream API and Resharding](https://vitess.io/docs/20.0/reference/vreplication/internal/vstream-stream-migration/)

## Parameters

### Constructor

Note that this `db_config` includes a `use_replica` boolean.

| Parameter               | Description                                        |
| :---------------------- | :------------------------------------------------- |
| `db_config`             | Database connection config                         |
| `db_config.host`        | PlanetScale host                                   |
| `db_config.database`    | PlanetScale database name                          |
| `db_config.username`    | PlanetScale branch username                        |
| `db_config.password`    | PlanetScale branch password                        |
| `db_config.use_replica` | Whether to use the branch replica                  |
| `table_name`            | The name of the table from which to stream changes |

### Method: `stream()`

The `stream()` method uses named parameters:

| Parameter          | Description                                                                               |
| :----------------- | :---------------------------------------------------------------------------------------- |
| `starting_cursor`  | The table cursor to start streaming at.                                                   |
| `read_duration_ms` | _(Optional)_ The duration for which the stream will be read. Omit to stream indefinitely. |
| `stop_position`    | _(Optional)_ The vgtid position at which to stop.                                         |

## Determining the starting cursor

The `TableCursor` encodes the keyspace, shard, and [GTID](https://dev.mysql.com/doc/refman/8.4/en/replication-gtids-concepts.html) position from which the stream will begin.

| Parameter  | Description                                    |
| :--------- | :--------------------------------------------- |
| `keyspace` | The keyspace from which to stream changes      |
| `shard`    | The shard from which to stream changes         |
| `position` | The GTID position from which to stream changes |

The `position` parameter has two special values:

-   `undefined`: Stream will start from the start of the binlog
-   `"current"`: Stream will start from the current moment

Keyspace and shard values can be found by querying the database:

-   `show keyspaces`: Lists keyspaces
-   `show vitess_shards`: Lists shards in each keyspace, using format `{keyspace}/{shard}`

## Usage

```ts
import { PlanetScaleVStream, TableCursor } from 'planetscale-stream-ts';

const vstream = new PlanetScaleVStream({
    db_config: {
        host: 'aws.connect.psdb.cloud',
        database: 'my_db',
        username: 'my_user',
        password: '<secret>',
        use_replica: true,
    },
    table_name: 'my_table',
});

const stream = vstream.stream({
    starting_cursor: new TableCursor({
        keyspace: 'my_keyspace',
        shard: '-',
        position: 'current',
    }),
    read_duration_ms: 30 * 1000,
});

for await (const { cursor, inserts, updates, deletes } of stream) {
    // Log out stream cursor position (GTID)
    console.log('streamed up to:', cursor?.position);

    // Log out changes
    console.dir({ mod: 'INSERTS', data: inserts }, { depth: null });
    console.dir({ mod: 'UPDATES', data: updates }, { depth: null });
    console.dir({ mod: 'DELETES', data: deletes }, { depth: null });
}
```

## Example

<video src='https://github.com/user-attachments/assets/7a08a4aa-86ff-46e2-a3f3-43be94dda14b' width=360></video>

---

# Using the examples

This repository includes two example scripts, one for each class, in the _examples/_ folder.

Before running an example, copy the _.env.example_ file to _.env_ and set the correct environment variables. Both of the examples additionally require some configuration values to be set in the files themselves, indicated by the `@todo` comments.

After running `pnpm install`, run the examples using the scripts in _package.json_:

-   `pnpm run messaging` runs the PlanetScale Messaging example
    -   See _examples/messaging.ts_
-   `pnpm run vstream` runs the PlanetScale VStream example
    -   See _examples/vstream.ts_

See the Example sections in the documentation above for screencaps of behaviour.

---

# Protocol buffers

## Sources

The _psdb.proto_ and _psdbconnect.proto_ files in the _proto/_ directory have been copied in from the [planetscale/psdb](https://github.com/planetscale/psdb/tree/main/proto-src) repository.

The rest of the _.proto_ files come from the [Vitess](https://github.com/vitessio/vitess/tree/main/proto) project.

## Conversion to TypeScript

TypeScript equivalents are generated using the [_@bufbuild/protoc-gen-es_](https://www.npmjs.com/package/@bufbuild/protoc-gen-es) package and the [_@connectrpc/protoc-gen-connect-es_](https://www.npmjs.com/package/@connectrpc/protoc-gen-connect-es) plugin. Code generation is configured in _buf.yaml_ and _buf.gen.yaml,_ and generated code is saved to _src/generated_.

Run `pnpm run generate` to regenerate _src/generated._

## API clients

gRPC API clients for the two PlanetScale APIs are created using [_@connectrpc/connect_](https://www.npmjs.com/package/@connectrpc/connect) and [_@connectrpc/connect-node_](https://www.npmjs.com/package/@connectrpc/connect-node) packages in this repository's _src/clients_ directory.
