import PluginDependency from "../../models/pluginDependency";
import togglePlugin from "./togglePlugin";
import isDefaultPlugin from "./isDefaultPlugin";

/**
 * Add a plugin to a book's configuration
 * @param {Config} config
 * @param {string} pluginName
 * @param {string} version (optional)
 * @return {Config}
 */
function addPlugin(config, pluginName, version) {
    // For default plugin, we only ensure it is enabled
    if (isDefaultPlugin(pluginName, version)) {
        return togglePlugin(config, pluginName, true);
    }

    let deps = config.getPluginDependencies();

    const dep = PluginDependency.create(pluginName, version);

    deps = deps.push(dep);
    return config.setPluginDependencies(deps);
}

export default addPlugin;
