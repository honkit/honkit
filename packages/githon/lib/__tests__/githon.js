var githon = require("../githon");

describe("satisfies", () => {
    test("should return true for *", () => {
        expect(githon.satisfies("*")).toBe(true);
    });
});
