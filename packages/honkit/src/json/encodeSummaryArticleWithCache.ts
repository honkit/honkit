/**
 Encode a SummaryArticle to JSON

 @param {SummaryArticle}
 @return {Object}
 */

import SummaryArticle from "../models/summaryArticle";

const articleCacheMap = new Map();

function encodeSummaryArticleWithCache(article: SummaryArticle, recursive?: boolean) {
    if (articleCacheMap.has(article)) {
        return articleCacheMap.get(article);
    }

    let articles = undefined;
    if (recursive !== false) {
        articles = article
            .getArticles()
            .map((article) => encodeSummaryArticleWithCache(article))
            .toJS();
    }

    const encodedArticle = {
        title: article.getTitle(),
        level: article.getLevel(),
        depth: article.getDepth(),
        anchor: article.getAnchor(),
        url: article.getUrl(),
        path: article.getPath(),
        ref: article.getRef(),
        articles: articles,
    };
    articleCacheMap.set(article, encodedArticle);

    return encodedArticle;
}

export default encodeSummaryArticleWithCache;
