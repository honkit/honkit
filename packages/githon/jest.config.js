const path = require("path");
module.exports = {
    roots: [path.join(__dirname, "src")],
    preset: "ts-jest",
    setupFilesAfterEnv: ["./testing/setup.js"],
    testEnvironment: "node",
};
