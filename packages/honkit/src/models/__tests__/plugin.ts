import Plugin from "../plugin";
import Immutable from "immutable";

describe("Plugin", () => {
    describe("createFromString", () => {
        test("must parse name", () => {
            const plugin = Plugin.createFromString("hello");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("*");
        });

        test("must parse version", () => {
            const plugin = Plugin.createFromString("hello@1.0.0");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("1.0.0");
        });
    });

    describe("getNpmId", () => {
        it("should return package's name", () => {
            const plugin = new Plugin({
                name: "testplugin",
                version: "*",
                path: "test.js",
                package: Immutable.fromJS({
                    name: "testplugin-name"
                }),
                content: Immutable.fromJS({
                    hooks: {
                        "page:before": function(page) {
                            return page;
                        },
                        page: function(page) {
                            return page;
                        }
                    }
                })
            });
            expect(plugin.getNpmID()).toBe("testplugin-name");
        });
    });
    describe("isLoaded", () => {
        test("must return false for empty plugin", () => {
            const plugin = Plugin.createFromString("hello");
            expect(plugin.isLoaded()).toBe(false);
        });
    });
});
