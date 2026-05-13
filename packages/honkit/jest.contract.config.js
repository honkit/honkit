/** @type {import("jest").Config} */
const base = require("./jest.config.js");

module.exports = {
    ...base,
    collectCoverageFrom: ["src/utils/promise.ts"],
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            lines: 100,
            functions: 100
        }
    }
};
