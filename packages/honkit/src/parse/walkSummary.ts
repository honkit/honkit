// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");

/**
    Walk over a list of articles

    @param {List<Article>} articles
    @param {Function(article)}
    @return {Promise}
*/
function walkArticles(articles, fn) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type 'Promise... Remove this comment to see the full error message
    return Promise.forEach(articles, (article) => {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise(fn(article)).then(() => {
            return walkArticles(article.getArticles(), fn);
        });
    });
}

/**
    Walk over summary and execute "fn" on each article

    @param {Summary} summary
    @param {Function(article)}
    @return {Promise}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'walkSummar... Remove this comment to see the full error message
function walkSummary(summary, fn) {
    const parts = summary.getParts();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type 'Promise... Remove this comment to see the full error message
    return Promise.forEach(parts, (part) => {
        return walkArticles(part.getArticles(), fn);
    });
}

module.exports = walkSummary;
