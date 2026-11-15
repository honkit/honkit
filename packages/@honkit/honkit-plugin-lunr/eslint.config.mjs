// eslint.config.mjs
import { eslintConfig } from "@honkit/cleaning-tools";

export default [
    {
        // copied from the lunr package by "npm run build"
        ignores: ["assets/lunr.min.js"]
    },
    ...eslintConfig
];
