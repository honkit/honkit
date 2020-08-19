// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'indexLevel... Remove this comment to see the full error message
const indexLevels = require("./indexLevels");

/**
    Remove a part at given index

    @param {Summary} summary
    @param {Number|} index
    @return {Summary}
*/
function removePart(summary, index) {
    const parts = summary.getParts().remove(index);
    return indexLevels(summary.set("parts", parts));
}

module.exports = removePart;
