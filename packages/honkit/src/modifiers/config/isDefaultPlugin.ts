import DEFAULT_PLUGINS from "../../constants/defaultPlugins";
import hasPlugin from "./hasPlugin";

/**
 * Test if a plugin is a default one
 * @param {string} plugin
 * @param {string} version
 * @return {boolean}
 */

function isDefaultPlugin(pluginName, version) {
    return hasPlugin(DEFAULT_PLUGINS, pluginName, version);
}

export default isDefaultPlugin;
