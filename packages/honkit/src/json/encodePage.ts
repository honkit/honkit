// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeSumm... Remove this comment to see the full error message
const encodeSummaryArticle = require("./encodeSummaryArticle");

/**
    Return a JSON representation of a page

    @param {Page} page
    @param {Summary} summary
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodePage... Remove this comment to see the full error message
function encodePage(page, summary) {
    const file = page.getFile();
    const attributes = page.getAttributes();
    const article = summary.getByPath(file.getPath());

    const result = attributes.toJS();

    if (article) {
        result.title = article.getTitle();
        result.level = article.getLevel();
        result.depth = article.getDepth();

        const nextArticle = summary.getNextArticle(article);
        if (nextArticle) {
            result.next = encodeSummaryArticle(nextArticle);
        }

        const prevArticle = summary.getPrevArticle(article);
        if (prevArticle) {
            result.previous = encodeSummaryArticle(prevArticle);
        }
    }

    result.content = page.getContent();
    result.dir = page.getDir();

    return result;
}

module.exports = encodePage;
