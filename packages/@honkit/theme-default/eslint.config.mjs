// eslint.config.mjs
import globals from "globals";
import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
    {
      "ignores": [
        "_assets/"
      ]
    },
    eslint.configs.recommended,
    {
        "plugins": {
            "@stylistic/js": stylisticJs,
        },
        "languageOptions": {
            "sourceType": "module",
            "globals": {
                ...globals.browser,
                ...globals.mocha,
                ...globals.node,
                "mock": true
            },
            "parserOptions": {
                "ecmaVersion": 2020
            }
        },
        "rules": {
            "@stylistic/js/indent": [
                2,
                4
            ],
            "@stylistic/js/quotes": [
                2,
                "single"
            ],
            "linebreak-style": [
                2,
                "unix"
            ],
            "no-extra-boolean-cast": "off",
            "no-unused-vars": [
                2,
                {
                    "vars": "all",
                    "args": "none"
                }
            ],
            "semi": [
                2,
                "always"
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
