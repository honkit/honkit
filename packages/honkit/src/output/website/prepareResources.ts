// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'is'.
const is = require("is");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Api'.
const Api = require("../../api");

/**
    Prepare plugins resources, add all output corresponding type resources

    @param {Output}
    @return {Promise<Output>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prepareRes... Remove this comment to see the full error message
function prepareResources(output) {
    const plugins = output.getPlugins();
    const options = output.getOptions();
    const type = options.get("prefix");
    let state = output.getState();
    const context = Api.encodeGlobal(output);

    let result = Immutable.Map();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type 'Promise... Remove this comment to see the full error message
    return Promise.forEach(plugins, (plugin) => {
        const pluginResources = plugin.getResources(type);

        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise()
            .then(() => {
                // Apply resources if is a function
                if (is.fn(pluginResources)) {
                    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
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
            resources: result,
        });

        output = output.merge({
            state: state,
        });

        return output;
    });
}

module.exports = prepareResources;
