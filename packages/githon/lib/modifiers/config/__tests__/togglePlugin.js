const togglePlugin = require("../togglePlugin");
const Config = require("../../../models/config");

describe("togglePlugin", () => {
    const config = Config.createWithValues({
        plugins: ["hello", "world", "-disabled"],
    });

    test("should enable plugin", () => {
        const newConfig = togglePlugin(config, "disabled");

        const testDep = newConfig.getPluginDependency("disabled");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeTruthy();
    });

    test("should disable plugin", () => {
        const newConfig = togglePlugin(config, "world");

        const testDep = newConfig.getPluginDependency("world");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeFalsy();
    });
});
