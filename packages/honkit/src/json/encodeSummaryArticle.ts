/**
    Encode a SummaryArticle to JSON

    @param {SummaryArticle}
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeSumm... Remove this comment to see the full error message
function encodeSummaryArticle(article, recursive) {
    let articles = undefined;
    if (recursive !== false) {
        articles = article.getArticles().map(encodeSummaryArticle).toJS();
    }

    return {
        title: article.getTitle(),
        level: article.getLevel(),
        depth: article.getDepth(),
        anchor: article.getAnchor(),
        url: article.getUrl(),
        path: article.getPath(),
        ref: article.getRef(),
        articles: articles,
    };
}

module.exports = encodeSummaryArticle;
