import PluginDependency from "../../models/pluginDependency";
import hasPlugin from "./hasPlugin";
import isDefaultPlugin from "./isDefaultPlugin";

/**
 * Enable/disable a plugin dependency
 * @param {Config} config
 * @param {string} pluginName
 * @param {boolean} state (optional)
 * @return {Config}
 */

function togglePlugin(config, pluginName, state) {
    let deps = config.getPluginDependencies();

    // For default plugin, we should ensure it's listed first

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    if (isDefaultPlugin(pluginName) && !hasPlugin(deps, pluginName)) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
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

export default togglePlugin;
