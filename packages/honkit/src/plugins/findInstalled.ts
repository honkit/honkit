const readInstalled = require("read-installed");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Plugin'.
const Plugin = require("../models/plugin");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PREFIX'.
const PREFIX = require("../constants/pluginPrefix");

/**
 * Validate if a package name is a GitBook/HonKit plugin
 *
 * @return {Boolean}
 */
function validateId(name) {
    return name && name.indexOf(PREFIX) === 0;
}

/**
 * List all packages installed inside a folder
 *
 * @param {String} folder
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
                // @ts-expect-error ts-migrate(2348) FIXME: Value of type '{ new (): Plugin; prototype: Plugin... Remove this comment to see the full error message
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
            // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
            return Promise([]);
        })
        .then((modules) => {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'serie' does not exist on type 'PromiseCo... Remove this comment to see the full error message
            return Promise.serie(modules, (module) => {
                // Not a gitbook-plugin
                if (!validateId(module)) {
                    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
                    return Promise();
                }

                // Read gitbook-plugin package details
                const module_folder = path.join(node_modules, module);
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfcall' does not exist on type 'PromiseC... Remove this comment to see the full error message
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

module.exports = findInstalled;
