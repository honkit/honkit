var removePlugin = require("../removePlugin");
var Config = require("../../../models/config");

describe("removePlugin", () => {
    var config = Config.createWithValues({
        plugins: ["hello", "world", "-disabled"],
    });

    test("should remove the plugin from the list", () => {
        var newConfig = removePlugin(config, "hello");

        var testDep = newConfig.getPluginDependency("hello");
        expect(testDep).toBeUndefined();
    });

    test("should remove the disabled plugin from the list", () => {
        var newConfig = removePlugin(config, "disabled");

        var testDep = newConfig.getPluginDependency("disabled");
        expect(testDep).toBeUndefined();
    });

    test("should disable default plugin", () => {
        var newConfig = removePlugin(config, "search");

        var disabledDep = newConfig.getPluginDependency("search");
        expect(disabledDep).toBeDefined();
        expect(disabledDep.getVersion()).toEqual("*");
        expect(disabledDep.isEnabled()).toBeFalsy();
    });
});
