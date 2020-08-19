// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PluginDepe... Remove this comment to see the full error message
const PluginDependency = require("../../models/pluginDependency");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hasPlugin'... Remove this comment to see the full error message
const hasPlugin = require("./hasPlugin");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isDefaultP... Remove this comment to see the full error message
const isDefaultPlugin = require("./isDefaultPlugin");

/**
 * Enable/disable a plugin dependency
 * @param {Config} config
 * @param {String} pluginName
 * @param {Boolean} state (optional)
 * @return {Config}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'togglePlug... Remove this comment to see the full error message
function togglePlugin(config, pluginName, state) {
    let deps = config.getPluginDependencies();

    // For default plugin, we should ensure it's listed first
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
    if (isDefaultPlugin(pluginName) && !hasPlugin(deps, pluginName)) {
        deps = deps.push(PluginDependency.create(pluginName));
    }

    deps = deps.map((dep) => {
        if (dep.getName() === pluginName) {
            return dep.toggle(state);
        }

        return dep;
    });

    return config.setPluginDependencies(deps);
}

module.exports = togglePlugin;
