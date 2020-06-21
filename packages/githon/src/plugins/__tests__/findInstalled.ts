import path from "path";
import Immutable from "immutable";

import findInstalled from "../findInstalled";

test.skip("must list default plugins for gitbook directory", () => {
    // Read gitbook-plugins from package.json
    const pkg = require(path.resolve(__dirname, "../../../package.json"));
    const gitbookPlugins = Immutable.Seq(pkg.dependencies)
        .filter((v, k: any) => {
            return k.indexOf("gitbook-plugin") === 0;
        })
        // @ts-expect-error
        .cacheResult();

    return findInstalled(path.resolve(__dirname, "../../../")).then((plugins) => {
        expect(plugins.size >= gitbookPlugins.size).toBeTruthy();

        expect(plugins.has("fontsettings")).toBe(true);
        expect(plugins.has("search")).toBe(true);
    });
});
