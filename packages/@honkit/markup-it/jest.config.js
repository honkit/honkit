module.exports = {
    roots: ["."],
    preset: "ts-jest",
    setupFilesAfterEnv: ["./testing/setup.js"],
    testEnvironment: "node",
};
