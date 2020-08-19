// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'indexArtic... Remove this comment to see the full error message
const indexArticleLevels = require("./indexArticleLevels");

/**
    Index levels in a part

    @param {Part}
    @param {Number} index
    @return {Part}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'indexPartL... Remove this comment to see the full error message
function indexPartLevels(part, index) {
    const baseLevel = String(index + 1);
    let articles = part.getArticles();

    articles = articles.map((inner, i) => {
        return indexArticleLevels(inner, `${baseLevel}.${i + 1}`);
    });

    return part.merge({
        level: baseLevel,
        articles: articles,
    });
}

module.exports = indexPartLevels;
