// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeSumm... Remove this comment to see the full error message
const encodeSummaryArticle = require("./encodeSummaryArticle");

/**
    Encode a SummaryPart to JSON

    @param {SummaryPart}
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeSumm... Remove this comment to see the full error message
function encodeSummaryPart(part) {
    return {
        title: part.getTitle(),
        articles: part.getArticles().map(encodeSummaryArticle).toJS(),
    };
}

module.exports = encodeSummaryPart;
