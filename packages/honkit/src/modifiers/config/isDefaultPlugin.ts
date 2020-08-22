import DEFAULT_PLUGINS from "../../constants/defaultPlugins";
import hasPlugin from "./hasPlugin";

/**
 * Test if a plugin is a default one
 * @param {String} plugin
 * @param {String} version
 * @return {Boolean}
 */

function isDefaultPlugin(pluginName, version) {
    return hasPlugin(DEFAULT_PLUGINS, pluginName, version);
}

export default isDefaultPlugin;
