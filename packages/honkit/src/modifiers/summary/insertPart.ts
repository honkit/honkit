// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SummaryPar... Remove this comment to see the full error message
const SummaryPart = require("../../models/summaryPart");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'indexLevel... Remove this comment to see the full error message
const indexLevels = require("./indexLevels");

/**
    Returns a new Summary with a part inserted at given index

    @param {Summary} summary
    @param {Part} part
    @param {Number} index
    @return {Summary}
*/
function insertPart(summary, part, index) {
    part = SummaryPart(part);

    const parts = summary.getParts().insert(index, part);
    return indexLevels(summary.set("parts", parts));
}

module.exports = insertPart;
