// LICENSE : MIT
import path from "path";
import * as util from "./package-name-util";
import tryResolve from "try-resolve";

const SPECIAL_PACKAGE_NAME = [
    "theme-default", // → @githon/githon-plugin-theme-default
];

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
    constructor(config?: any) {
        /**
         * @type {string} baseDirectory for resolving
         */
        // @ts-expect-error
        this.baseDirectory = config && config.baseDirectory ? config.baseDirectory : "";
    }

    /**
     * Take package name, and return path to module.
     * @param {string} packageName
     * @returns {string} return path to module
     */
    resolvePluginPackageName(packageName) {
        // @ts-expect-error
        const baseDir = this.baseDirectory;
        const githonFullPackageName = util.createFullPackageName("githon-plugin-", packageName);
        // githon > gitbook > normal
        const gitbookFullPackageName = util.createFullPackageName("gitbook-plugin-", packageName);
        // special case for backward-compatible
        // e.g.) load theme-default as @githon/githon-plugins-theme-default
        const githonScopePackageName = `@githon/${githonFullPackageName}`;
        // In sometimes, GitBook package has not main field - so search package.json
        const pkgPath =
            tryResolve(path.join(baseDir, githonFullPackageName, "/package.json")) ||
            tryResolve(path.join(baseDir, gitbookFullPackageName, "/package.json")) ||
            tryResolve(path.join(baseDir, packageName, "/package.json")) ||
            (SPECIAL_PACKAGE_NAME.includes(packageName) &&
                tryResolve(path.join(baseDir, githonScopePackageName, "/package.json")));
        if (!pkgPath) {
            throw new ReferenceError(`Failed to load GitHon's plugin module: "${packageName}" is not found.

cwd: ${process.cwd()}
baseDir: ${baseDir}

`);
        }
        return pkgPath.substring(0, pkgPath.length - "/package.json".length);
    }
}

export { GitHonPluginResolver };
