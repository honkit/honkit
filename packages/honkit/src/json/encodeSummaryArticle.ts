/**
 Encode a SummaryArticle to JSON

 @param {SummaryArticle}
 @return {Object}
 */

import SummaryArticle from "../models/summaryArticle";
import encodeSummaryArticleWithCache from "./encodeSummaryArticleWithCache";

function encodeSummaryArticle(article: SummaryArticle, recursive?: boolean) {
    let articles = undefined;
    if (recursive !== false) {
        articles = article
            .getArticles()
            .map((article) => encodeSummaryArticleWithCache(article))
            .toJS();
    }

    return {
        title: article.getTitle(),
        level: article.getLevel(),
        depth: article.getDepth(),
        anchor: article.getAnchor(),
        url: article.getUrl(),
        path: article.getPath(),
        ref: article.getRef(),
        articles: articles
    };
}

export default encodeSummaryArticle;
