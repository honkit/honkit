// FIXME: Avoid scope error
export {};

import removePlugin from "../removePlugin";
import Config from "../../../models/config";

describe("removePlugin", () => {
    const config = Config.createWithValues({
        plugins: ["hello", "world", "-disabled"],
    });

    test("should remove the plugin from the list", () => {
        const newConfig = removePlugin(config, "hello");

        const testDep = newConfig.getPluginDependency("hello");
        expect(testDep).toBeUndefined();
    });

    test("should remove the disabled plugin from the list", () => {
        const newConfig = removePlugin(config, "disabled");

        const testDep = newConfig.getPluginDependency("disabled");
        expect(testDep).toBeUndefined();
    });

    test("should disable default plugin", () => {
        const newConfig = removePlugin(config, "search");

        const disabledDep = newConfig.getPluginDependency("search");
        expect(disabledDep).toBeDefined();
        expect(disabledDep.getVersion()).toEqual("*");
        expect(disabledDep.isEnabled()).toBeFalsy();
    });
});
