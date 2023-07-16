module.exports = {
    roots: ["src"],
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)", "!**/lib/**"]
};
