// FIXME: Avoid scope error
export {};

import addPlugin from "../addPlugin";
import Config from "../../../models/config";

describe("addPlugin", () => {
    const config = Config.createWithValues({
        plugins: ["hello", "world", "-disabled"],
    });

    test("should have correct state of dependencies", () => {
        const disabledDep = config.getPluginDependency("disabled");

        expect(disabledDep).toBeDefined();
        expect(disabledDep.getVersion()).toEqual("*");
        expect(disabledDep.isEnabled()).toBeFalsy();
    });

    test("should add the plugin to the list", () => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        const newConfig = addPlugin(config, "test");

        const testDep = newConfig.getPluginDependency("test");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeTruthy();

        const disabledDep = newConfig.getPluginDependency("disabled");
        expect(disabledDep).toBeDefined();
        expect(disabledDep.getVersion()).toEqual("*");
        expect(disabledDep.isEnabled()).toBeFalsy();
    });
});
