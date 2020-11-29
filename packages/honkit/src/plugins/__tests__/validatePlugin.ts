import Immutable from "immutable";
import Promise from "../../utils/promise";
import Plugin from "../../models/plugin";
import validatePlugin from "../validatePlugin";

describe("validatePlugin", () => {
    test("must not validate a not loaded plugin", () => {
        const plugin = Plugin.createFromString("test");

        return validatePlugin(plugin).then(
            () => {
                throw new Error("Should not be validate");
            },
            (err) => {
                return Promise();
            }
        );
    });
    test("alpha plugin can loaded plugin", () => {
        const testPkgRequireAlphaVersion = {
            title: "Disqus",
            name: "gitbook-plugin-disqus",
            description: "Disqus comments thread in the footer of your pages",
            icon: "./icon.png",
            main: "index.js",
            browser: "./_assets/plugin.js",
            version: "1.0.1",
            engines: {
                gitbook: ">=4.0.0-alpha",
            },
            dependencies: {
                react: "^15.3.2",
                "react-disqus-thread": "^0.4.0",
            },
            devDependencies: {
                "gitbook-plugin": "^4.0.0-alpha.0",
                eslint: "3.7.1",
                "eslint-config-gitbook": "1.4.0",
            },
            homepage: "https://github.com/GitbookIO/plugin-disqus",
            repository: {
                type: "git",
                url: "https://github.com/GitbookIO/plugin-disqus.git",
            },
            license: "Apache-2.0",
            bugs: {
                url: "https://github.com/GitbookIO/plugin-disqus/issues",
            },
            keywords: ["gitbook:social"],
            scripts: {
                "build-js": "gitbook-plugin build ./src/index.js ./_assets/plugin.js",
                prepublish: "npm run build-js",
            },
            gitbook: {
                properties: {
                    shortName: {
                        type: "string",
                        title: "Website Shortname",
                        description: "Unique identifier for your website as registered on Disqus",
                        required: true,
                    },
                    useIdentifier: {
                        type: "boolean",
                        title: "Pass page identifier option to Disqus",
                        default: false,
                    },
                },
                page: {
                    title: "Disqus configuration for this page",
                    properties: {
                        disqus: {
                            type: "object",
                            properties: {
                                enabled: {
                                    type: "boolean",
                                    title: "Enable Disqus comments for this page.",
                                    default: true,
                                },
                                identifier: {
                                    type: "string",
                                    title: "Identifier for this page.",
                                    description: "Tells the Disqus service how to identify the current page",
                                },
                            },
                        },
                    },
                },
            },
        };
        const plugin = new Plugin({
            name: "test",
            version: "4.0.0",
            path: "/",
            package: Immutable.fromJS(testPkgRequireAlphaVersion),
            content: Immutable.fromJS({}),
        });
        return validatePlugin(plugin);
    });
});
