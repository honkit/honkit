// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'honkit'.
const honkit = require("../honkit");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");

/**
 Validate a plugin

 @param {Plugin} plugin
 @return {Promise<Plugin>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validatePl... Remove this comment to see the full error message
function validatePlugin(plugin) {
    const packageInfos = plugin.getPackage();

    const isValid =
        plugin.isLoaded() &&
        packageInfos &&
        packageInfos.get("name") &&
        packageInfos.get("engines") &&
        (packageInfos.get("engines").get("gitbook") || packageInfos.get("engines").get("honkit"));

    const pluginName = packageInfos.get("name") || "unknown plugin";
    if (!isValid) {
        return Promise.reject(new Error(`Error loading plugin "${pluginName}" at "${plugin.getPath()}"`));
    }
    const gitbookVersion = packageInfos.get("engines").get("gitbook");
    const honkitVersion = packageInfos.get("engines").get("honkit");
    // support "gitbook" and "honkit"
    if (gitbookVersion && !honkit.satisfies(gitbookVersion)) {
        return Promise.reject(
            new Error(`HonKit doesn't satisfy the requirements of this plugin: ${pluginName} require ${honkitVersion}`)
        );
    }
    if (honkitVersion && !honkit.satisfies(honkitVersion)) {
        return Promise.reject(
            new Error(`HonKit doesn't satisfy the requirements of this plugin: ${pluginName} require ${honkitVersion}`)
        );
    }

    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(plugin);
}

module.exports = validatePlugin;
