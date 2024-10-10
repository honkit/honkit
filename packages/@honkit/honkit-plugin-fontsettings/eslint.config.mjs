import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import stylisticJs from '@stylistic/eslint-plugin-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends('eslint:recommended'), {
    plugins: {
        '@stylistic/js': stylisticJs,
    },
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
            ...globals.browser,
        },
    },

    rules: {
        '@stylistic/js/indent': [2, 4],
        '@stylistic/js/quotes': [2, 'single'],
        'linebreak-style': [2, 'unix'],
        semi: [2, 'always'],

        'no-unused-vars': [2, {
            vars: 'all',
            args: 'none',
        }],

        'spaced-comment': [2, 'always'],
        'no-var': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-const': 'error',
        'prefer-template': 'error',
    },
}];
