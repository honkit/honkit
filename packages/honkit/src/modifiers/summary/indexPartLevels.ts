import indexArticleLevels from "./indexArticleLevels";

/**
 Index levels in a part

 @param {Part}
 @param {number} index
 @return {Part}
 */

function indexPartLevels(part, index) {
    const baseLevel = String(index + 1);
    let articles = part.getArticles();

    articles = articles.map((inner, i) => {
        return indexArticleLevels(inner, `${baseLevel}.${i + 1}`);
    });

    return part.merge({
        level: baseLevel,
        articles: articles
    });
}

export default indexPartLevels;
