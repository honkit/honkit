import Immutable from "immutable";

import Config from "../config";

describe("Config", () => {
    const config = Config.createWithValues({
        hello: {
            world: 1,
            test: "Hello",
            isFalse: false,
        },
    });

    describe("getValue", () => {
        test("must return value as immutable", () => {
            const value = config.getValue("hello");
            expect(Immutable.Map.isMap(value)).toBeTruthy();
        });

        test("must return deep value", () => {
            const value = config.getValue("hello.world");
            expect(value).toBe(1);
        });

        test("must return default value if non existant", () => {
            const value = config.getValue("hello.nonExistant", "defaultValue");
            expect(value).toBe("defaultValue");
        });

        test("must not return default value for falsy values", () => {
            const value = config.getValue("hello.isFalse", "defaultValue");
            expect(value).toBe(false);
        });
    });

    describe("setValue", () => {
        test("must set value as immutable", () => {
            const testConfig = config.setValue("hello", {
                cool: 1,
            });
            const value = testConfig.getValue("hello");

            expect(Immutable.Map.isMap(value)).toBeTruthy();
            expect(value.size).toBe(1);
            expect(value.has("cool")).toBeTruthy();
        });

        test("must set deep value", () => {
            const testConfig = config.setValue("hello.world", 2);
            const hello = testConfig.getValue("hello");
            const world = testConfig.getValue("hello.world");

            expect(Immutable.Map.isMap(hello)).toBeTruthy();
            expect(hello.size).toBe(3);

            expect(world).toBe(2);
        });
    });

    describe("toReducedVersion", () => {
        test("must only return diffs for simple values", () => {
            const _config = Config.createWithValues({
                gitbook: "3.0.0",
            });

            const reducedVersion = _config.toReducedVersion();

            expect(reducedVersion.toJS()).toEqual({
                gitbook: "3.0.0",
            });
        });

        test("must only return diffs for deep values", () => {
            const _config = Config.createWithValues({
                structure: {
                    readme: "intro.md",
                },
            });

            const reducedVersion = _config.toReducedVersion();

            expect(reducedVersion.toJS()).toEqual({
                structure: {
                    readme: "intro.md",
                },
            });
        });
    });

    describe("getPluginDependencies", () => {
        const config = Config.createWithValues({
            plugins: [
                "example",
                "honkit-plugin-example",
                "@example/example",
                "@example/honkit-plugin-example",
                "@honkit/honkit-plugin-example",
                "-no-use",
                "-honkit-plugin-no-use",
                "-@honkit/honkit-plugin-no-use",
                // GitBook logic - deprecated
                "example-v@1.0.0",
                "gitbook-plugin-example-v@1.0.0",
                "example@git+ssh://samy@github.com/GitbookIO/plugin-ga.git",
            ],
        });

        const dependencies = config.getPluginDependencies();

        expect(dependencies.toJS()).toEqual([
            {
                enabled: true,
                name: "example",
                path: "",
                version: "*",
            },
            {
                enabled: true,
                name: "honkit-plugin-example",
                path: "",
                version: "*",
            },
            {
                enabled: true,
                name: "@example/example",
                path: "",
                version: "*",
            },
            {
                enabled: true,
                name: "@example/honkit-plugin-example",
                path: "",
                version: "*",
            },
            {
                enabled: true,
                name: "@honkit/honkit-plugin-example",
                path: "",
                version: "*",
            },
            {
                enabled: false,
                name: "no-use",
                path: "",
                version: "*",
            },
            {
                enabled: false,
                name: "honkit-plugin-no-use",
                path: "",
                version: "*",
            },
            {
                enabled: false,
                name: "@honkit/honkit-plugin-no-use",
                path: "",
                version: "*",
            },
            {
                enabled: true,
                name: "example-v",
                path: "",
                version: "1.0.0",
            },
            {
                enabled: true,
                name: "gitbook-plugin-example-v",
                path: "",
                version: "1.0.0",
            },
            {
                enabled: true,
                name: "example",
                path: "",
                version: "git+ssh://samy@github.com/GitbookIO/plugin-ga.git",
            },
        ]);
    });
});
