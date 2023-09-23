import path from "path";
import resolve from "resolve";
import Immutable from "immutable";
import Promise from "../utils/promise";
import error from "../utils/error";
import timing from "../utils/timing";
import validatePlugin from "./validatePlugin";
import Plugin from "../models/plugin";

// Return true if an error is a "module not found"
// Wait on https://github.com/substack/node-resolve/pull/81 to be merged
function isModuleNotFound(err) {
    return err.code == "MODULE_NOT_FOUND" || err.message.indexOf("Cannot find module") >= 0;
}

/**
 Load a plugin in a book

 @param {Book} book
 @param {PluginDependency[]} plugin
 @param {string} pkgPath (optional)
 @return {Promise<Plugin>}
 */
function loadPlugin(book, plugin) {
    const logger = book.getLogger();

    const name = plugin.getName();
    let pkgPath = plugin.getPath();

    // Try loading plugins from different location

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
                        plugin: name
                    });
                }
            }

            // Update plugin

            return new Plugin({
                name: name,
                version: packageContent.version || "*",
                path: pkgPath,
                package: Immutable.fromJS(packageContent),
                content: Immutable.fromJS(content || {})
            });
        })
        .then((plugin) => validatePlugin(plugin))
        .then((plugin) => {
            logger.info(`plugin "${plugin.get("name")}" is loaded\n`);
            return plugin;
        });
    p = timing.measure("plugin.load", p);
    return p;
}

export { loadPlugin };
