import mergeAtLevel from "./mergeAtLevel";

/**
 Edit the ref of an article

 @param {Summary} summary
 @param {string} level
 @param {string} newRef
 @return {Summary}
 */
function editArticleRef(summary, level, newRef) {
    return mergeAtLevel(summary, level, {
        ref: newRef
    });
}

export default editArticleRef;
