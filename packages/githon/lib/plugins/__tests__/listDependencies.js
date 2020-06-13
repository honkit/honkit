var PluginDependency = require("../../models/pluginDependency");
var listDependencies = require("../listDependencies");
var toNames = require("../toNames");

describe("listDependencies", () => {
    test("must list default", () => {
        var deps = PluginDependency.listFromString("ga,great");
        var plugins = listDependencies(deps);
        var names = toNames(plugins);

        expect(names).toEqual(["ga", "great", "highlight", "search", "lunr", "fontsettings", "theme-default"]);
    });

    test("must list from array with -", () => {
        var deps = PluginDependency.listFromString("ga,-great");
        var plugins = listDependencies(deps);
        var names = toNames(plugins);

        expect(names).toEqual(["ga", "highlight", "search", "lunr", "fontsettings", "theme-default"]);
    });

    test("must remove default plugins using -", () => {
        var deps = PluginDependency.listFromString("ga,-search");
        var plugins = listDependencies(deps);
        var names = toNames(plugins);

        expect(names).toEqual(["ga", "highlight", "lunr", "fontsettings", "theme-default"]);
    });
});
