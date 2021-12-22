/**
 Encode a SummaryArticle to JSON

 @param {SummaryArticle}
 @return {Object}
 */

import SummaryArticle from "../models/summaryArticle";

const articleMapByLevel = new Map();

function encodeSummaryArticle(article: SummaryArticle, recursive?: boolean) {
    const articleLevel = article.getLevel();
    if (articleMapByLevel.has(articleLevel)) {
        return articleMapByLevel.get(articleLevel);
    }
    
    let articles = undefined;
    if (recursive !== false) {
        articles = article
            .getArticles()
            .map((article) => encodeSummaryArticle(article))
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
    articleMapByLevel.set(articleLevel, encodedArticle);

    return encodedArticle;
}

export default encodeSummaryArticle;
