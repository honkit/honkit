const path = require("path");
const Immutable = require("immutable");

describe("findInstalled", () => {
    const findInstalled = require("../findInstalled");

    test.skip("must list default plugins for gitbook directory", () => {
        // Read gitbook-plugins from package.json
        const pkg = require(path.resolve(__dirname, "../../../package.json"));
        const gitbookPlugins = Immutable.Seq(pkg.dependencies)
            .filter((v, k) => {
                return k.indexOf("gitbook-plugin") === 0;
            })
            .cacheResult();

        return findInstalled(path.resolve(__dirname, "../../../")).then((plugins) => {
            expect(plugins.size >= gitbookPlugins.size).toBeTruthy();

            expect(plugins.has("fontsettings")).toBe(true);
            expect(plugins.has("search")).toBe(true);
        });
    });
});
