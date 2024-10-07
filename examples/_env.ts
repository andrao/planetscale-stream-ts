/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import { createEnv } from '@t3-oss/env-nextjs';
import { parse } from 'dotenv';
import { z } from 'zod';

const ENV_FILE = path.resolve(import.meta.dirname, '../.env');
const ENV_CONTENT = fs.existsSync(ENV_FILE) ? parse(fs.readFileSync(ENV_FILE, 'utf8')) : {};

/**
 * @description Env vars from .env file
 */
const ENV_FILE_VARS = {
    PLANETSCALE_HOST: z.string(),
    PLANETSCALE_DATABASE: z.string(),
    PLANETSCALE_USERNAME: z.string(),
    PLANETSCALE_PASSWORD: z.string(),
};

/**
 * @const env
 * @description Environment variables for the NextJS app
 * @see https://vercel.com/docs/projects/environment-variables/system-environment-variables for default Vercel env vars
 */
export const env = createEnv({
    server: {
        ...ENV_FILE_VARS,

        NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    },

    /**
     * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
     */
    runtimeEnv: {
        // Consume env vars from process.env
        ...Object.keys(ENV_CONTENT).map(key => ({ [key]: process.env[key] })),
        // Overwrite them with those from .env file
        ...(ENV_CONTENT as Record<keyof typeof ENV_FILE_VARS, string>),

        NODE_ENV: process.env.NODE_ENV,
    },
});
