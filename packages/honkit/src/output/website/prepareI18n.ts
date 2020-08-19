// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'listSearch... Remove this comment to see the full error message
const listSearchPaths = require("./listSearchPaths");

/**
 * Prepare i18n, load translations from plugins and book
 *
 * @param {Output}
 * @return {Promise<Output>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prepareI18... Remove this comment to see the full error message
function prepareI18n(output) {
    const state = output.getState();
    const i18n = state.getI18n();
    const searchPaths = listSearchPaths(output);

    searchPaths.reverse().forEach((searchPath) => {
        const i18nRoot = path.resolve(searchPath, "_i18n");

        if (!fs.existsSync(i18nRoot)) return;
        i18n.load(i18nRoot);
    });

    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(output);
}

module.exports = prepareI18n;
