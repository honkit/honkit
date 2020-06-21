const githon = require("../githon");

const Promise = require("../utils/promise");

/**
 Validate a plugin

 @param {Plugin} plugin
 @return {Promise<Plugin>}
 */
function validatePlugin(plugin) {
    const packageInfos = plugin.getPackage();

    const isValid =
        plugin.isLoaded() &&
        packageInfos &&
        packageInfos.get("name") &&
        packageInfos.get("engines") &&
        (packageInfos.get("engines").get("gitbook") || packageInfos.get("engines").get("githon"));

    const pluginName = packageInfos.get("name") || "unknown plugin";
    if (!isValid) {
        return Promise.reject(new Error(`Error loading plugin "${pluginName}" at "${plugin.getPath()}"`));
    }
    const gitbookVersion = packageInfos.get("engines").get("gitbook");
    const githonVersion = packageInfos.get("engines").get("githon");
    // support "gitbook" and "githon"
    if (gitbookVersion && !githon.satisfies(gitbookVersion)) {
        return Promise.reject(
            new Error(`HonKit doesn't satisfy the requirements of this plugin: ${pluginName} require ${githonVersion}`)
        );
    }
    if (githonVersion && !githon.satisfies(githonVersion)) {
        return Promise.reject(
            new Error(`HonKit doesn't satisfy the requirements of this plugin: ${pluginName} require ${githonVersion}`)
        );
    }

    return Promise(plugin);
}

module.exports = validatePlugin;
