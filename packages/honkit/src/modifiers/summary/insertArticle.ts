import is from "is";
import SummaryArticle from "../../models/summaryArticle";
import mergeAtLevel from "./mergeAtLevel";
import indexArticleLevels from "./indexArticleLevels";

/**
 Returns a new Summary with the article at the given level, with
 subsequent article shifted.

 @param {Summary} summary
 @param {Article} article
 @param {String|Article} level: level to insert at
 @return {Summary}
 */

function insertArticle(summary, article, level) {
    article = new SummaryArticle(article);
    level = is.string(level) ? level : level.getLevel();

    let parent = summary.getParent(level);
    if (!parent) {
        return summary;
    }

    // Find the index to insert at
    let articles = parent.getArticles();
    const index = getLeafIndex(level);

    // Insert the article at the right index
    articles = articles.insert(index, article);

    // Reindex the level from here
    parent = parent.set("articles", articles);

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    parent = indexArticleLevels(parent);

    return mergeAtLevel(summary, parent.getLevel(), parent);
}

/**
 @param {string}
 @return {number} The index of this level within its parent's children
 */
function getLeafIndex(level) {
    const arr = level.split(".").map((char) => {
        return parseInt(char, 10);
    });
    return arr[arr.length - 1] - 1;
}

export default insertArticle;
