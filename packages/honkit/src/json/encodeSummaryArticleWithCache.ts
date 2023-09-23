/**
 Encode a SummaryArticle to JSON

 @param {SummaryArticle}
 @return {Object}
 */

import SummaryArticle from "../models/summaryArticle";
import { LRUMap } from "lru_map";

const LRU_MAP_LIMIT = 1000;
const articleCacheMap = new LRUMap<SummaryArticle, EncodedArticle>(LRU_MAP_LIMIT);

export type EncodedArticle = {
    title: string;
    level: string;
    depth: number;
    anchor: string;
    url: string;
    path: string;
    ref: string;
    articles: EncodedArticle[];
};

function encodeSummaryArticleWithCache(article: SummaryArticle, recursive?: boolean): EncodedArticle {
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
        articles: articles
    };
    articleCacheMap.set(article, encodedArticle);

    return encodedArticle;
}

export default encodeSummaryArticleWithCache;
