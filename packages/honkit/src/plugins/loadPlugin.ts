// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
const resolve = require("resolve");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'error'.
const error = require("../utils/error");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'timing'.
const timing = require("../utils/timing");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validatePl... Remove this comment to see the full error message
const validatePlugin = require("./validatePlugin");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Plugin'.
const Plugin = require("../models/plugin");

// Return true if an error is a "module not found"
// Wait on https://github.com/substack/node-resolve/pull/81 to be merged
function isModuleNotFound(err) {
    return err.code == "MODULE_NOT_FOUND" || err.message.indexOf("Cannot find module") >= 0;
}

/**
 Load a plugin in a book

 @param {Book} book
 @param {PluginDependency[]} plugin
 @param {String} pkgPath (optional)
 @return {Promise<Plugin>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'loadPlugin... Remove this comment to see the full error message
function loadPlugin(book, plugin) {
    const logger = book.getLogger();

    const name = plugin.getName();
    let pkgPath = plugin.getPath();

    // Try loading plugins from different location
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    let p = Promise()
        .then(() => {
            let packageContent;
            let packageMain;
            let content;

            // Locate plugin and load package.json
            try {
                const res = resolve.sync("./package.json", { basedir: pkgPath });

                pkgPath = path.dirname(res);
                packageContent = require(res);
            } catch (err) {
                if (!isModuleNotFound(err)) throw err;

                packageContent = undefined;
                content = undefined;

                return;
            }

            // Locate the main package
            try {
                const indexJs = path.normalize(packageContent.main || "index.js");
                packageMain = resolve.sync(`./${indexJs}`, { basedir: pkgPath });
            } catch (err) {
                if (!isModuleNotFound(err)) throw err;
                packageMain = undefined;
            }

            // Load plugin JS content
            if (packageMain) {
                try {
                    content = require(packageMain);
                } catch (err) {
                    throw new error.PluginError(err, {
                        plugin: name,
                    });
                }
            }

            // Update plugin
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
            return new Plugin({
                name: name,
                version: packageContent.version || "*",
                path: pkgPath,
                package: Immutable.fromJS(packageContent),
                content: Immutable.fromJS(content || {}),
            });
        })
        .then((plugin) => validatePlugin(plugin))
        .then((plugin) => {
            logger.info(`plugin "${plugin.get("name")} is loaded\n`);
            return plugin;
        });
    p = timing.measure("plugin.load", p);
    return p;
}

module.exports.loadPlugin = loadPlugin;
