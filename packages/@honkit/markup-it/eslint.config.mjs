// eslint.config.mjs
import globals from "globals";
import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
    eslint.configs.recommended,
    {
        "plugins": {
            "@stylistic/js": stylisticJs,
        },
        "languageOptions": {
            "sourceType": "module",
            "globals": {
                ...globals.mocha,
                ...globals.node,
                "mock": true
            },
            "parserOptions": {
                "ecmaVersion": 2020
            }
        },
        "rules": {
            "no-unused-vars": [
                2,
                {
                    "vars": "all",
                    "args": "none"
                }
            ],
            "spaced-comment": [
                2,
                "always"
            ],
            // @TODO: Cleanup code and remove these.
            "no-var": "off",
            "prefer-arrow-callback": "off",
            "prefer-const": "off",
            "prefer-template": "off",
        }
    }
];
