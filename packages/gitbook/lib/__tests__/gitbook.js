var gitbook = require("../gitbook");

describe("satisfies", () => {
    test("should return true for *", () => {
        expect(gitbook.satisfies("*")).toBe(true);
    });
});
