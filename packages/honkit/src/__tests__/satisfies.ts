import honkit from "../honkit";

describe("satisfies", () => {
    test("should return true for *", () => {
        expect(honkit.satisfies("*")).toBe(true);
    });
});
