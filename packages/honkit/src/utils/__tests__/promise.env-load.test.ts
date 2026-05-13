/**
 * Loads {@link ../promise} with CI set so the Q longStackSupport branch is exercised once.
 */
describe("promise module CI branch", () => {
    test("enables Q longStackSupport when CI is set at load time", () => {
        jest.resetModules();
        const prev = process.env.CI;
        process.env.CI = "true";
        expect(() => {
            require("../promise");
        }).not.toThrow();
        if (prev === undefined) {
            delete process.env.CI;
        } else {
            process.env.CI = prev;
        }
        jest.resetModules();
    });
});
