// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'copyPlugin... Remove this comment to see the full error message
const copyPluginAssets = require("./copyPluginAssets");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prepareI18... Remove this comment to see the full error message
const prepareI18n = require("./prepareI18n");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prepareRes... Remove this comment to see the full error message
const prepareResources = require("./prepareResources");

/**
    Initialize the generator

    @param {Output}
    @return {Output}
*/
function onInit(output) {
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(output).then(prepareI18n).then(prepareResources).then(copyPluginAssets);
}

module.exports = onInit;
