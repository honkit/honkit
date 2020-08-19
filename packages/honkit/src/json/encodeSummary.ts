// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeFile... Remove this comment to see the full error message
const encodeFile = require("./encodeFile");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeSumm... Remove this comment to see the full error message
const encodeSummaryPart = require("./encodeSummaryPart");

/**
    Encode a summary to JSON

    @param {Summary}
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeSumm... Remove this comment to see the full error message
function encodeSummary(summary) {
    const file = summary.getFile();
    const parts = summary.getParts();

    return {
        file: encodeFile(file),
        parts: parts.map(encodeSummaryPart).toJS(),
    };
}

module.exports = encodeSummary;
