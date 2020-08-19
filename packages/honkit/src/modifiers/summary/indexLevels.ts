// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'indexPartL... Remove this comment to see the full error message
const indexPartLevels = require("./indexPartLevels");

/**
    Index all levels in the summary

    @param {Summary}
    @return {Summary}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'indexLevel... Remove this comment to see the full error message
function indexLevels(summary) {
    let parts = summary.getParts();
    parts = parts.map(indexPartLevels);

    return summary.set("parts", parts);
}

module.exports = indexLevels;
