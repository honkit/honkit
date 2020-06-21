module.exports = {
    roots: ["src"],
    preset: "ts-jest",
    setupFilesAfterEnv: ["./testing/setup.js"],
    testEnvironment: "node",
};
