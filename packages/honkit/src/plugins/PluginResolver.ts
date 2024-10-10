// LICENSE : MIT
"use strict";

import path from "path";
import * as util from "./package-name-util";
import tryResolve from "try-resolve";

const SPECIAL_PACKAGE_NAME = [
    "fontsettings", // → @honkit/honkit-plugin-fontsettings
    "highlight", // → @honkit/honkit-plugin-highlight
    "theme-default" // → @honkit/honkit-plugin-theme-default
];

/**
 * This class aim to resolve honkit's package name and get the module path.
 *
 * Define
 *
 * - `package` is npm package
 * - `module` is package's main module
 *
 * ## Support
 *
 * - honkit-plugin-*
 * - gitbook-plugin-*
 */

export class PluginResolver {
    baseDirectory: string;

    constructor(config: { baseDirectory?: string } = {}) {
        /**
         * @type {string} baseDirectory for resolving
         */
        this.baseDirectory = config && config.baseDirectory ? config.baseDirectory : "";
    }

    /**
     * Take package name, and return path to module.
     * @param {string} packageName
     * @returns {string} return path to module
     */
    resolvePluginPackageName(packageName) {
        const baseDir = this.baseDirectory;
        const honkitFullPackageName = util.createFullPackageName("honkit-plugin-", packageName);
        // honkit > gitbook > normal
        const gitbookFullPackageName = util.createFullPackageName("gitbook-plugin-", packageName);
        // special case for backward-compatible
        // e.g.) load theme-default as @honkit/honkit-plugins-theme-default
        const honkitScopePackageName = `@honkit/${honkitFullPackageName}`;
        // In sometimes, HonKit package has not main field - so search package.json
        const pkgPath =
            tryResolve(path.join(baseDir, honkitFullPackageName, "/package.json")) ||
            tryResolve(path.join(baseDir, gitbookFullPackageName, "/package.json")) ||
            tryResolve(path.join(baseDir, packageName, "/package.json")) ||
            (SPECIAL_PACKAGE_NAME.includes(packageName) &&
                tryResolve(path.join(baseDir, honkitScopePackageName, "/package.json")));
        if (!pkgPath) {
            throw new ReferenceError(`Failed to load HonKit's plugin module: "${packageName}" is not found.

cwd: ${process.cwd()}
baseDir: ${baseDir}

`);
        }
        return pkgPath.substring(0, pkgPath.length - "/package.json".length);
    }
}
