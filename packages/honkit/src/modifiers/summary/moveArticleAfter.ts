// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'is'.
const is = require("is");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'removeArti... Remove this comment to see the full error message
const removeArticle = require("./removeArticle");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'insertArti... Remove this comment to see the full error message
const insertArticle = require("./insertArticle");

/**
    Returns a new summary, with the an article moved after another
    article. Unlike `moveArticle`, does not ensure that the article
    will be found at the target's level plus one.

    @param {Summary} summary
    @param {String|SummaryArticle} origin
    @param {String|SummaryArticle} afterTarget
    @return {Summary}
*/
function moveArticleAfter(summary, origin, afterTarget) {
    // Coerce to level
    const originLevel = is.string(origin) ? origin : origin.getLevel();
    const afterTargetLevel = is.string(afterTarget) ? afterTarget : afterTarget.getLevel();
    const article = summary.getByLevel(originLevel);

    const targetLevel = increment(afterTargetLevel);

    if (targetLevel < origin) {
        // Remove first
        const removed = removeArticle(summary, originLevel);
        // Insert then
        return insertArticle(removed, article, targetLevel);
    } else {
        // Insert right after first
        const inserted = insertArticle(summary, article, targetLevel);
        // Remove old one
        return removeArticle(inserted, originLevel);
    }
}

/**
    @param {String}
    @return {Array<Number>}
 */
function levelToArray(l) {
    return l.split(".").map((char) => {
        return parseInt(char, 10);
    });
}

/**
    @param {Array<Number>}
    @return {String}
 */
function arrayToLevel(a) {
    return a.join(".");
}

function increment(level) {
    level = levelToArray(level);
    level[level.length - 1]++;
    return arrayToLevel(level);
}

module.exports = moveArticleAfter;
