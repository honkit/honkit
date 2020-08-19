// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'is'.
const is = require("is");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'mergeAtLev... Remove this comment to see the full error message
const mergeAtLevel = require("./mergeAtLevel");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'indexArtic... Remove this comment to see the full error message
const indexArticleLevels = require("./indexArticleLevels");

/**
    Remove an article from a level.

    @param {Summary} summary
    @param {String|SummaryArticle} level: level to remove
    @return {Summary}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'removeArti... Remove this comment to see the full error message
function removeArticle(summary, level) {
    // Coerce to level
    level = is.string(level) ? level : level.getLevel();

    let parent = summary.getParent(level);

    let articles = parent.getArticles();
    // Find the index to remove
    const index = articles.findIndex((art) => {
        return art.getLevel() === level;
    });
    if (index === -1) {
        return summary;
    }

    // Remove from children
    articles = articles.remove(index);
    parent = parent.set("articles", articles);

    // Reindex the level from here
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    parent = indexArticleLevels(parent);

    return mergeAtLevel(summary, parent.getLevel(), parent);
}

module.exports = removeArticle;
