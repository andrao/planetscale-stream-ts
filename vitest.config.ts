import { defineConfig } from 'vitest/config';

/**
 * @description Whether to run integration tests
 */
const RUN_INTEGRATION_TESTS = Boolean(process.env.RUN_INTEGRATION_TESTS);

/**
 * @description Patterns to ignore in tests
 * - If _not_ integration, ignore integration test folder
 */
const IGNORE_PATTERNS = [
    'node_modules',
    ...(RUN_INTEGRATION_TESTS ? [] : ['__integration_tests__']),
];

export default defineConfig({
    test: {
        clearMocks: true,
        exclude: IGNORE_PATTERNS,
        passWithNoTests: true,
    },
});
