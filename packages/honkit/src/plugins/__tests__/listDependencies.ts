import PluginDependency from "../../models/pluginDependency";
import listDependencies from "../listDependencies";
import toNames from "../toNames";

describe("listDependencies", () => {
    test("must list default", () => {
        const deps = PluginDependency.listFromString("ga,great");
        const plugins = listDependencies(deps);
        const names = toNames(plugins);

        expect(names).toEqual(["ga", "great", "highlight", "search", "lunr", "fontsettings", "theme-default"]);
    });

    test("must list from array with -", () => {
        const deps = PluginDependency.listFromString("ga,-great");
        const plugins = listDependencies(deps);
        const names = toNames(plugins);

        expect(names).toEqual(["ga", "highlight", "search", "lunr", "fontsettings", "theme-default"]);
    });

    test("must remove default plugins using -", () => {
        const deps = PluginDependency.listFromString("ga,-search");
        const plugins = listDependencies(deps);
        const names = toNames(plugins);

        expect(names).toEqual(["ga", "highlight", "lunr", "fontsettings", "theme-default"]);
    });
});
