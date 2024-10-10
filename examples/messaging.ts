import { PlanetScaleMessagingStream } from '../src/PlanetScaleMessagingStream';
import { env } from './_common/env';

/**
 * @todo Set DB config in .env file
 */
const DB_CONFIG = {
    host: env.PLANETSCALE_HOST,
    database: env.PLANETSCALE_DATABASE,
    username: env.PLANETSCALE_USERNAME,
    password: env.PLANETSCALE_PASSWORD,
};

/**
 * @todo Enter Vitess Messaging config values
 */
const TABLE_NAME = '';
const TABLE_PRIMARY_KEY = 'id';
const READ_DURATION_MS = 20 * 1000;

/**
 * Run stream
 */
try {
    const messenger = new PlanetScaleMessagingStream({
        db_config: DB_CONFIG,
        table_name: TABLE_NAME,
        table_primary_key: TABLE_PRIMARY_KEY,
    });

    const stream = messenger.stream({
        read_duration_ms: READ_DURATION_MS,
    });

    console.log('[ MESSAGING STREAM STARTED ]');

    for await (const { messages, error } of stream) {
        console.log('\nmessages:');
        console.dir(messages, { depth: null });

        if (error) console.error('\n[ ERROR ]:', error);

        // Acknowledge messages
        const ids = messages.map(r => r.id);
        void messenger.ack(ids).then(({ n }) => console.info(`acknowledged ${n} message(s)`));
    }

    process.exit();
} catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
}
