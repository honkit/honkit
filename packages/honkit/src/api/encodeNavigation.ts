import Immutable from "immutable";
import type Output from "../models/output";
import type Page from "../models/page";
import type SummaryArticle from "../models/summaryArticle";

/**
 Encode an article for next/prev
 @return {Object}
 */
function encodeArticle(pages: Immutable.OrderedMap<string, Page>, article: SummaryArticle) {
    const articlePath = article.getPath();

    return {
        path: articlePath,
        title: article.getTitle(),
        level: article.getLevel(),
        exists: articlePath && pages.has(articlePath),
        external: article.isExternal()
    };
}

export type EncodedNavigation = {
    [index: string]: {
        index: number;
        title: string;
        introduction: boolean;
        prev?: unknown;
        next?: unknown;
        level: number;
    };
};

/**
 this.navigation is a deprecated property from GitBook v2

 @return {Object}
 */

function encodeNavigation(output: Output): EncodedNavigation {
    const book = output.getBook();
    const pages = output.getPages();
    const summary = book.getSummary();
    const articles = summary.getArticlesAsList();

    const navigation = articles
        .map((article, i) => {
            const ref = article.getRef();
            if (!ref) {
                return undefined;
            }

            const prev = articles.get(i - 1);
            const next = articles.get(i + 1);

            return [
                ref,
                {
                    index: i,
                    title: article.getTitle(),
                    introduction: i === 0,
                    prev: prev ? encodeArticle(pages, prev) : undefined,
                    next: next ? encodeArticle(pages, next) : undefined,
                    level: article.getLevel()
                }
            ];
        })
        .filter((e) => {
            return Boolean(e);
        });

    return Immutable.Map(navigation).toJS() as EncodedNavigation;
}

export default encodeNavigation;
