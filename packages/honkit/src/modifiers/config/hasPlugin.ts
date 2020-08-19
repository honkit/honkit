/**
 * Test if a plugin is listed
 * @param { {List<PluginDependency}} deps
 * @param {String} plugin
 * @param {String} version
 * @return {Boolean}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hasPlugin'... Remove this comment to see the full error message
function hasPlugin(deps, pluginName, version) {
    return !!deps.find((dep) => {
        return dep.getName() === pluginName && (!version || dep.getVersion() === version);
    });
}

module.exports = hasPlugin;
