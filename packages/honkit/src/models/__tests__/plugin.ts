import Plugin from "../plugin";

describe("Plugin", () => {
    describe("createFromString", () => {
        test("must parse name", () => {
            // @ts-expect-error
            const plugin = Plugin.createFromString("hello");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("*");
        });

        test("must parse version", () => {
            // @ts-expect-error
            const plugin = Plugin.createFromString("hello@1.0.0");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("1.0.0");
        });
    });

    describe("isLoaded", () => {
        test("must return false for empty plugin", () => {
            // @ts-expect-error
            const plugin = Plugin.createFromString("hello");
            expect(plugin.isLoaded()).toBe(false);
        });
    });
});
