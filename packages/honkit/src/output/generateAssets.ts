// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");

/**
    Output all assets using a generator

    @param {Generator} generator
    @param {Output} output
    @return {Promise<Output>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generateAs... Remove this comment to see the full error message
function generateAssets(generator, output) {
    const assets = output.getAssets();
    const logger = output.getLogger();

    // Is generator ignoring assets?
    if (!generator.onAsset) {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise(output);
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'reduce' does not exist on type 'PromiseC... Remove this comment to see the full error message
    return Promise.reduce(
        assets,
        (out, assetFile) => {
            logger.debug.ln(`copy asset "${assetFile}"`);

            return generator.onAsset(out, assetFile);
        },
        output
    );
}

module.exports = generateAssets;
