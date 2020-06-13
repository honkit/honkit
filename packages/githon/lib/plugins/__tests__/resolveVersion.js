var PluginDependency = require("../../models/pluginDependency");
var resolveVersion = require("../resolveVersion");

describe("resolveVersion", () => {
    test("must skip resolving and return non-semver versions", () => {
        var plugin = PluginDependency.createFromString("ga@git+ssh://samy@github.com/GitbookIO/plugin-ga.git");

        return resolveVersion(plugin).then(function (version) {
            expect(version).toBe("git+ssh://samy@github.com/GitbookIO/plugin-ga.git");
        });
    });

    test("must resolve a normal plugin dependency", () => {
        var plugin = PluginDependency.createFromString("ga@>0.9.0 < 1.0.1");

        return resolveVersion(plugin).then(function (version) {
            expect(version).toBe("1.0.0");
        });
    });
});
