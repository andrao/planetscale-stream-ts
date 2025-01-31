const BASE_CONFIG = require('@andrao/eslint/lib/base');

module.exports = {
    ...BASE_CONFIG,
    extends: [...BASE_CONFIG.extends, 'plugin:require-extensions/recommended'],
    plugins: [...BASE_CONFIG.plugins, 'require-extensions'],
};
