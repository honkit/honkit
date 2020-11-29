import Immutable from "immutable";
import PluginDependency from "../pluginDependency";

describe("PluginDependency", () => {
    describe("createFromString", () => {
        test("must parse name", () => {
            const plugin = PluginDependency.createFromString("hello");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("*");
        });

        test("must parse state", () => {
            const plugin = PluginDependency.createFromString("-hello");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.isEnabled()).toBe(false);
        });

        describe("Version", () => {
            test("must parse version", () => {
                const plugin = PluginDependency.createFromString("hello@1.0.0");
                expect(plugin.getName()).toBe("hello");
                expect(plugin.getVersion()).toBe("1.0.0");
            });

            test("must parse semver", () => {
                const plugin = PluginDependency.createFromString("hello@>=4.0.0");
                expect(plugin.getName()).toBe("hello");
                expect(plugin.getVersion()).toBe(">=4.0.0");
            });
        });

        describe("GIT Version", () => {
            test("must handle HTTPS urls", () => {
                const plugin = PluginDependency.createFromString(
                    "hello@git+https://github.com/GitbookIO/plugin-ga.git"
                );
                expect(plugin.getName()).toBe("hello");
                expect(plugin.getVersion()).toBe("git+https://github.com/GitbookIO/plugin-ga.git");
            });

            test("must handle SSH urls", () => {
                const plugin = PluginDependency.createFromString(
                    "hello@git+ssh://samy@github.com/GitbookIO/plugin-ga.git"
                );
                expect(plugin.getName()).toBe("hello");
                expect(plugin.getVersion()).toBe("git+ssh://samy@github.com/GitbookIO/plugin-ga.git");
            });
        });

        describe("listToArray", () => {
            test("must create an array from a list of plugin dependencies", () => {
                const list = PluginDependency.listToArray(
                    Immutable.List([
                        PluginDependency.createFromString("hello@1.0.0"),
                        PluginDependency.createFromString("noversion"),
                        PluginDependency.createFromString("-disabled"),
                    ])
                );

                expect(list).toEqual(["hello@1.0.0", "noversion", "-disabled"]);
            });
        });

        describe("listFromArray", () => {
            test("must create an array from a list of plugin dependencies", () => {
                const arr = Immutable.fromJS([
                    "hello@1.0.0",
                    {
                        name: "plugin-ga",
                        version: "git+ssh://samy@github.com/GitbookIO/plugin-ga.git",
                    },
                ]);

                const list = PluginDependency.listFromArray(arr);

                expect(list.first().getName()).toBe("hello");
                expect(list.first().getVersion()).toBe("1.0.0");
                expect(list.last().getName()).toBe("plugin-ga");
                expect(list.last().getVersion()).toBe("git+ssh://samy@github.com/GitbookIO/plugin-ga.git");
            });
        });
    });
});
