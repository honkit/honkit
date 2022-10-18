import honkit from "../honkit";
import Promise from "../utils/promise";

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
            new Error(`HonKit doesn't satisfy the requirements of this plugin: ${pluginName} require ${gitbookVersion}`)
        );
    }
    if (honkitVersion && !honkit.satisfies(honkitVersion)) {
        return Promise.reject(
            new Error(`HonKit doesn't satisfy the requirements of this plugin: ${pluginName} require ${honkitVersion}`)
        );
    }
    return Promise(plugin);
}

export default validatePlugin;
