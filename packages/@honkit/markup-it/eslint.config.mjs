// eslint.config.mjs
import { eslintConfig } from "@honkit/cleaning-tools";

export default [
    {
        "ignores": [
          "lib/",
          "node_modules/",
          "eslint.config.mjs",
        ]
    },
    ...eslintConfig
];
