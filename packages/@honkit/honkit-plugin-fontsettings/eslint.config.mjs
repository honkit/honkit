import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends('eslint:recommended'), {
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
            ...globals.browser,
        },
    },

    rules: {
        'no-extra-boolean-cast': [0],
        indent: [2, 4],
        quotes: [2, 'single'],
        'linebreak-style': [2, 'unix'],
        semi: [2, 'always'],

        'no-unused-vars': [2, {
            vars: 'all',
            args: 'none',
        }],

        'spaced-comment': [2, 'always'],
    },
}];