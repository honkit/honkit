// eslint.config.mjs
import { eslintConfig } from "@honkit/cleaning-tools";

export default [
    {
        ignores: [
            "docs/**",
            "_book/**",
            "**/node_modules/**",
            "packages/@honkit/**/test",
            "packages/@honkit/**/__tests__",
            "examples/**",
            "theme-default/",
            "theme/",
            "packages/**/lib",
            "packages/**/__tests__",
            "__fixtures__",
            "__snapshots__",
            ".yarn",
            ".nx/",
            "**/_assets/"
        ]
    },
    ...eslintConfig
];
