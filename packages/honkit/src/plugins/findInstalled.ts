import readInstalled from "read-installed";
import Immutable from "immutable";
import path from "path";
import Promise from "../utils/promise";
import fs from "../utils/fs";
import Plugin from "../models/plugin";
import PREFIX from "../constants/pluginPrefix";

/**
 * Validate if a package name is a GitBook/HonKit plugin
 *
 * @return {boolean}
 */
function validateId(name) {
    return name && name.indexOf(PREFIX) === 0;
}

/**
 * List all packages installed inside a folder
 *
 * @param {string} folder
 * @return {OrderedMap<String:Plugin>}
 */
function findInstalled(folder) {
    const options = {
        dev: false,
        log: function () {},
        depth: 4,
    };
    let results = Immutable.OrderedMap();

    function onPackage(pkg, parent) {
        if (!pkg.name) return;

        const name = pkg.name;
        const version = pkg.version;
        const pkgPath = pkg.realPath;
        const depth = pkg.depth;
        const dependencies = pkg.dependencies;

        const pluginName = name.slice(PREFIX.length);

        if (!validateId(name)) {
            if (parent) return;
        } else {
            results = results.set(
                pluginName,

                Plugin({
                    name: pluginName,
                    version: version,
                    path: pkgPath,
                    depth: depth,
                    parent: parent,
                })
            );
        }

        Immutable.Map(dependencies).forEach((dep) => {
            onPackage(dep, pluginName);
        });
    }

    // Search for gitbook-plugins in node_modules folder
    const node_modules = path.join(folder, "node_modules");

    // List all folders in node_modules
    return fs
        .readdir(node_modules)
        .fail(() => {
            return Promise([]);
        })
        .then((modules) => {
            return Promise.serie(modules, (module) => {
                // Not a gitbook-plugin
                if (!validateId(module)) {
                    return Promise();
                }

                // Read gitbook-plugin package details
                const module_folder = path.join(node_modules, module);

                return Promise.nfcall(readInstalled, module_folder, options).then((data) => {
                    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
                    onPackage(data);
                });
            });
        })
        .then(() => {
            // Return installed plugins
            return results;
        });
}

export default findInstalled;
