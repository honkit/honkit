// LICENSE : MIT
"use strict";
const path = require("path");
const util = require("./package-name-util");
const tryResolve = require("try-resolve");
const debug = console.info;

/**
 * This class aim to resolve githon's package name and get the module path.
 *
 * Define
 *
 * - `package` is npm package
 * - `module` is package's main module
 *
 * ## Support
 *
 * - githon-plugin-*
 * - gitbook-plugin-*
 */
class GitHonPluginResolver {
    constructor(config) {
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
        const githonFullPackageName = util.createFullPackageName("gitbook-plugin-", packageName);
        // githon > gitbook > normal
        const gitbookFullPackageName = util.createFullPackageName("gitbook-plugin-", packageName);
        // In sometimes, GitBook package has not main field - so search package.json
        const pkgPath =
            tryResolve(path.join(baseDir, githonFullPackageName, "/package.json")) ||
            tryResolve(path.join(baseDir, gitbookFullPackageName, "/package.json")) ||
            tryResolve(path.join(baseDir, packageName, "/package.json"));
        if (!pkgPath) {
            debug(`Not found plugin: ${packageName}`);
            throw new ReferenceError(`Failed to load githon's plugin module: "${packageName}" is not found.

cwd: ${process.cwd()}
baseDir: ${baseDir}

`);
        }
        return pkgPath.replace("/package.json", "");
    }
}

exports.GitHonPluginResolver = GitHonPluginResolver;
