/** @type {import("jest").Config} */
const base = require("./jest.config.js");

module.exports = {
    ...base,
    collectCoverageFrom: ["src/utils/promise.ts"]
};
