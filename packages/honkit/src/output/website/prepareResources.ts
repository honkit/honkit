import is from "is";
import Immutable from "immutable";
import Promise from "../../utils/promise";
import Api from "../../api";

/**
 Prepare plugins resources, add all output corresponding type resources

 @param {Output}
 @return {Promise<Output>}
 */

function prepareResources(output) {
    const plugins = output.getPlugins();
    const options = output.getOptions();
    const type = options.get("prefix");
    let state = output.getState();
    const context = Api.encodeGlobal(output);

    let result = Immutable.Map();

    return Promise.forEach(plugins, (plugin) => {
        const pluginResources = plugin.getResources(type);

        return Promise()
            .then(() => {
                // Apply resources if is a function
                if (is.fn(pluginResources)) {
                    return Promise().then(pluginResources.bind(context));
                } else {
                    return pluginResources;
                }
            })
            .then((resources) => {
                result = result.set(plugin.getName(), Immutable.Map(resources));
            });
    }).then(() => {
        // Set output resources
        state = state.merge({
            resources: result
        });

        output = output.merge({
            state: state
        });

        return output;
    });
}

export default prepareResources;
