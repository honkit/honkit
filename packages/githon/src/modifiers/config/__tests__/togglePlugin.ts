// FIXME: Avoid scope error
export {};

import togglePlugin from "../togglePlugin";
import Config from "../../../models/config";

describe("togglePlugin", () => {
    // @ts-ignore
    const config = Config.createWithValues({
        plugins: ["hello", "world", "-disabled"],
    });

    test("should enable plugin", () => {
        // @ts-ignore
        const newConfig = togglePlugin(config, "disabled");

        const testDep = newConfig.getPluginDependency("disabled");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeTruthy();
    });

    test("should disable plugin", () => {
        // @ts-ignore
        const newConfig = togglePlugin(config, "world");

        const testDep = newConfig.getPluginDependency("world");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeFalsy();
    });
});
