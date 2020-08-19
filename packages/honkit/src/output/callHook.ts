// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'timing'.
const timing = require("../utils/timing");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Api'.
const Api = require("../api");

function defaultGetArgument() {
    return undefined;
}

function defaultHandleResult(output, result) {
    return output;
}

/**
    Call a "global" hook for an output

    @param {String} name
    @param {Function(Output) -> Mixed} getArgument
    @param {Function(Output, result) -> Output} handleResult
    @param {Output} output
    @return {Promise<Output>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callHook'.
function callHook(name, getArgument, handleResult, output) {
    getArgument = getArgument || defaultGetArgument;
    handleResult = handleResult || defaultHandleResult;

    const logger = output.getLogger();
    const plugins = output.getPlugins();

    logger.debug.ln(`calling hook "${name}"`);

    // Create the JS context for plugins
    const context = Api.encodeGlobal(output);

    return timing.measure(
        `call.hook.${name}`,

        // Get the arguments
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        Promise(getArgument(output))
            // Call the hooks in serie
            .then((arg) => {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'reduce' does not exist on type 'PromiseC... Remove this comment to see the full error message
                return Promise.reduce(
                    plugins,
                    (prev, plugin) => {
                        const hook = plugin.getHook(name);
                        if (!hook) {
                            return prev;
                        }

                        return hook.call(context, prev);
                    },
                    arg
                );
            })

            // Handle final result
            .then((result) => {
                output = Api.decodeGlobal(output, context);
                return handleResult(output, result);
            })
    );
}

module.exports = callHook;
