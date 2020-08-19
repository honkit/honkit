/**
    Index levels in an article tree

    @param {Article}
    @param {String} baseLevel
    @return {Article}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'indexArtic... Remove this comment to see the full error message
function indexArticleLevels(article, baseLevel) {
    baseLevel = baseLevel || article.getLevel();
    let articles = article.getArticles();

    articles = articles.map((inner, i) => {
        return indexArticleLevels(inner, `${baseLevel}.${i + 1}`);
    });

    return article.merge({
        level: baseLevel,
        articles: articles,
    });
}

module.exports = indexArticleLevels;
