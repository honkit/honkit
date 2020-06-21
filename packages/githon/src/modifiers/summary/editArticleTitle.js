import mergeAtLevel from "./mergeAtLevel";

/**
    Edit title of an article

    @param {Summary} summary
    @param {String} level
    @param {String} newTitle
    @return {Summary}
*/
function editArticleTitle(summary, level, newTitle) {
    return mergeAtLevel(summary, level, {
        title: newTitle,
    });
}

export default editArticleTitle;
