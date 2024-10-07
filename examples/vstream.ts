/* eslint-disable import/no-extraneous-dependencies */
import chalk from 'chalk';
import { TableCursor } from '../src/__generated__/psdbconnect_pb';
import { PlanetScaleVStream } from '../src/PlanetScaleVStream';
import { env } from './_env';

/**
 * @todo Set DB config in .env file
 */
const DB_CONFIG = {
    host: env.PLANETSCALE_HOST,
    database: env.PLANETSCALE_DATABASE,
    username: env.PLANETSCALE_USERNAME,
    password: env.PLANETSCALE_PASSWORD,
    use_replica: false,
};

/**
 * @todo Enter VStream config values
 * @comment Use `current` for position to stream from the current point in time
 */
const TABLE_NAME = '';
const KEYSPACE = '';
const SHARD = '-';
const POSITION = 'current';
const STOP_POSITION: string | undefined = undefined;
const READ_DURATION_MS = 20 * 1000;

/**
 * Run stream
 */
try {
    const vstream = new PlanetScaleVStream({
        db_config: DB_CONFIG,
        table_name: TABLE_NAME,
    });

    const stream = vstream.stream({
        starting_cursor: new TableCursor({
            keyspace: KEYSPACE,
            shard: SHARD,
            position: POSITION,
        }),
        stop_position: STOP_POSITION,
        read_duration_ms: READ_DURATION_MS,
    });

    console.log('[ VSTREAM STARTED ]');

    for await (const { cursor, inserts, updates, deletes } of stream) {
        console.log(chalk.grey('-->', cursor?.position));

        for (const insert of inserts) console.log(chalk.green('[ INSERT ]\n'), insert);
        for (const update of updates) console.log(chalk.blue('[ UPDATE ]\n'), update);
        for (const del of deletes) console.log(chalk.red('[ DELETE ]\n'), del);
    }

    process.exit();
} catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
}
