// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONUtils'... Remove this comment to see the full error message
const JSONUtils = require("../json");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'deprecate'... Remove this comment to see the full error message
const deprecate = require("./deprecate");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeProg... Remove this comment to see the full error message
const encodeProgress = require("./encodeProgress");

/**
    Encode a page in a context to a JS API

    @param {Output} output
    @param {Page} page
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodePage... Remove this comment to see the full error message
function encodePage(output, page) {
    const book = output.getBook();
    const summary = book.getSummary();
    const fs = book.getContentFS();
    const file = page.getFile();

    // JS Page is based on the JSON output
    const result = JSONUtils.encodePage(page, summary);

    result.type = file.getType();
    result.path = file.getPath();
    result.rawPath = fs.resolve(result.path);

    deprecate.field(
        output,
        "page.progress",
        result,
        "progress",
        () => {
            return encodeProgress(output, page);
        },
        '"page.progress" property is deprecated'
    );

    deprecate.field(
        output,
        "page.sections",
        result,
        "sections",
        [
            {
                content: result.content,
                type: "normal",
            },
        ],
        '"sections" property is deprecated, use page.content instead'
    );

    return result;
}

module.exports = encodePage;
