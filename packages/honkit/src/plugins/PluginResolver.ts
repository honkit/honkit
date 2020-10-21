import path from "path";
import * as util from "./package-name-util";

const tryResolve = (moduleName: string, paths: string[]): string | undefined => {
    try {
        return require.resolve(moduleName, {
            paths,
        });
    } catch {
        return;
    }
};
const SPECIAL_PACKAGE_NAME = [
    "theme-default", // → @honkit/honkit-plugin-theme-default
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

export type PluginResolverOptions = {
    nodeModulePaths: string[];
};

export class PluginResolver {
    nodeModulePaths: string[];

    constructor(config: PluginResolverOptions) {
        console.log("config.nodeModulePaths", config.nodeModulePaths);
        /**
         * @type {string} baseDirectory for resolving
         */
        this.nodeModulePaths = config && config.nodeModulePaths ? config.nodeModulePaths : [];
    }

    /**
     * Take package name, and return path to module.
     * @param {string} packageName
     * @returns {string} return path to module
     */
    resolvePluginPackageName(packageName) {
        const basePaths = this.nodeModulePaths;
        const honkitFullPackageName = util.createFullPackageName("honkit-plugin-", packageName);
        // honkit > gitbook > normal
        const gitbookFullPackageName = util.createFullPackageName("gitbook-plugin-", packageName);
        // special case for backward-compatible
        // e.g.) load theme-default as @honkit/honkit-plugins-theme-default
        const honkitScopePackageName = `@honkit/${honkitFullPackageName}`;
        // In sometimes, HonKit package has not main field - so search package.json
        const pkgPath =
            tryResolve(path.join(honkitFullPackageName, "/package.json"), basePaths) ||
            tryResolve(path.join(gitbookFullPackageName, "/package.json"), basePaths) ||
            tryResolve(path.join(packageName, "/package.json"), basePaths) ||
            (SPECIAL_PACKAGE_NAME.includes(packageName) &&
                tryResolve(path.join(honkitScopePackageName, "/package.json"), basePaths));
        if (!pkgPath) {
            throw new ReferenceError(`Failed to load HonKit's plugin module: "${packageName}" is not found.

cwd: ${process.cwd()}
baseDir: 
${basePaths.join("\n")}
`);
        }
        return pkgPath.substring(0, pkgPath.length - "/package.json".length);
    }
}
