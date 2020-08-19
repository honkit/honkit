// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'mergeAtLev... Remove this comment to see the full error message
const mergeAtLevel = require("./mergeAtLevel");

/**
    Edit the ref of an article

    @param {Summary} summary
    @param {String} level
    @param {String} newRef
    @return {Summary}
*/
function editArticleRef(summary, level, newRef) {
    return mergeAtLevel(summary, level, {
        ref: newRef,
    });
}

module.exports = editArticleRef;
