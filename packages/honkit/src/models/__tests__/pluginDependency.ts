import Immutable from "immutable";
import PluginDependency from "../pluginDependency";

describe("PluginDependency", () => {
    describe("createFromString", () => {
        test("must parse name", () => {
            
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
            const plugin = PluginDependency.createFromString("hello");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("*");
        });

        test("must parse state", () => {
            
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
            const plugin = PluginDependency.createFromString("-hello");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.isEnabled()).toBe(false);
        });

        describe("Version", () => {
            test("must parse version", () => {
                
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
                const plugin = PluginDependency.createFromString("hello@1.0.0");
                expect(plugin.getName()).toBe("hello");
                expect(plugin.getVersion()).toBe("1.0.0");
            });

            test("must parse semver", () => {
                
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
                const plugin = PluginDependency.createFromString("hello@>=4.0.0");
                expect(plugin.getName()).toBe("hello");
                expect(plugin.getVersion()).toBe(">=4.0.0");
            });
        });

        describe("GIT Version", () => {
            test("must handle HTTPS urls", () => {
                
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
                const plugin = PluginDependency.createFromString(
                    "hello@git+https://github.com/GitbookIO/plugin-ga.git"
                );
                expect(plugin.getName()).toBe("hello");
                expect(plugin.getVersion()).toBe("git+https://github.com/GitbookIO/plugin-ga.git");
            });

            test("must handle SSH urls", () => {
                
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
                const plugin = PluginDependency.createFromString(
                    "hello@git+ssh://samy@github.com/GitbookIO/plugin-ga.git"
                );
                expect(plugin.getName()).toBe("hello");
                expect(plugin.getVersion()).toBe("git+ssh://samy@github.com/GitbookIO/plugin-ga.git");
            });
        });

        describe("listToArray", () => {
            test("must create an array from a list of plugin dependencies", () => {
                
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'listToArray' does not exist on type 'Cla... Remove this comment to see the full error message
                const list = PluginDependency.listToArray(
                    Immutable.List([
                        
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
                        PluginDependency.createFromString("hello@1.0.0"),
                        
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
                        PluginDependency.createFromString("noversion"),
                        
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
                        PluginDependency.createFromString("-disabled")
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
                        version: "git+ssh://samy@github.com/GitbookIO/plugin-ga.git"
                    }
                ]);
                
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'listFromArray' does not exist on type 'C... Remove this comment to see the full error message
                const list = PluginDependency.listFromArray(arr);

                expect(list.first().getName()).toBe("hello");
                expect(list.first().getVersion()).toBe("1.0.0");
                expect(list.last().getName()).toBe("plugin-ga");
                expect(list.last().getVersion()).toBe("git+ssh://samy@github.com/GitbookIO/plugin-ga.git");
            });
        });
    });
});
