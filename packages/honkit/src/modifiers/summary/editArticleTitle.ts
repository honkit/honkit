import mergeAtLevel from "./mergeAtLevel";

/**
 Edit title of an article

 @param {Summary} summary
 @param {string} level
 @param {string} newTitle
 @return {Summary}
 */
function editArticleTitle(summary, level, newTitle) {
    return mergeAtLevel(summary, level, {
        title: newTitle
    });
}

export default editArticleTitle;
