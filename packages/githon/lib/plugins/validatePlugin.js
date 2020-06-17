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

    if (!isValid) {
        return Promise.reject(new Error(`Error loading plugin "${plugin.getName()}" at "${plugin.getPath()}"`));
    }

    const engine = packageInfos.get("engines").get("gitbook");
    if (!githon.satisfies(engine)) {
        return Promise.reject(new Error(`Githon doesn't satisfy the requirements of this plugin: ${engine}`));
    }

    return Promise(plugin);
}

module.exports = validatePlugin;
