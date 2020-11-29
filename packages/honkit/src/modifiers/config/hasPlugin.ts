/**
 * Test if a plugin is listed
 * @param { {List<PluginDependency}} deps
 * @param {string} plugin
 * @param {string} version
 * @return {Boolean}
 */

function hasPlugin(deps, pluginName, version) {
    return !!deps.find((dep) => {
        return dep.getName() === pluginName && (!version || dep.getVersion() === version);
    });
}

export default hasPlugin;
