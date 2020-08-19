// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Api'.
const Api = require("../api");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callHook'.
const callHook = require("./callHook");

/**
    Call a hook for a specific page

    @param {String} name
    @param {Output} output
    @param {Page} page
    @return {Promise<Page>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callPageHo... Remove this comment to see the full error message
function callPageHook(name, output, page) {
    return callHook(
        name,

        (out) => {
            return Api.encodePage(out, page);
        },

        (out, result) => {
            return Api.decodePage(out, page, result);
        },

        output
    );
}

module.exports = callPageHook;
