// FIXME: Avoid scope error
export {};

import togglePlugin from "../togglePlugin";
import Config from "../../../models/config";

describe("togglePlugin", () => {
    const config = Config.createWithValues({
        plugins: ["hello", "world", "-disabled"],
    });

    test("should enable plugin", () => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        const newConfig = togglePlugin(config, "disabled");

        const testDep = newConfig.getPluginDependency("disabled");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeTruthy();
    });

    test("should disable plugin", () => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        const newConfig = togglePlugin(config, "world");

        const testDep = newConfig.getPluginDependency("world");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeFalsy();
    });
});
