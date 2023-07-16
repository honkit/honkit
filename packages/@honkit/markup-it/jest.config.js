module.exports = {
    roots: ["."],
    preset: "ts-jest",
    setupFilesAfterEnv: ["./testing/setup.js"],
    testMatch: ["**/__tests__/**/*.{js,ts}", "!**/lib/**"],
    testEnvironment: "node"
};
