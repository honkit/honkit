module.exports = {
    roots: ["src"],
    preset: "ts-jest",
    setupFilesAfterEnv: ["./testing/setup.js"],
    testPathIgnorePatterns: ["__fixtures__"],
    testEnvironment: "node"
};
