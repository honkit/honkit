import path from "path";
import encodeSummaryArticle from "./encodeSummaryArticle";
import parsers from "../parsers";
import Page from "../models/page";
import Summary from "../models/summary";
import SummaryArticle from "../models/summaryArticle";

export type EncodedPage = {
    content: string;
    dir: string;
} & Partial<{
    title: string;
    level: number;
    depth: number;
    next: SummaryArticle;
    previous: SummaryArticle;
}>;

/**
 Is the article a link to a file that HonKit renders as a page?
 */
function isPageArticle(article: SummaryArticle): boolean {
    const articlePath = article.getPath();
    if (!articlePath) return false;
    const extension = path.extname(articlePath).toLowerCase();
    // Keep a path without an extension as before, because it is not a known non-page file
    if (!extension) return true;
    return Boolean(parsers.getByExt(extension));
}

/**
 Return the closest article in a direction that is a page of the book.
 Entries without a link (e.g. a chapter that only groups sections), external links
 and links to files that are not pages (e.g. a PDF) are skipped,
 so that the previous/next page links always point to a page.
 https://github.com/honkit/honkit/issues/314
 https://github.com/honkit/honkit/issues/453
 */
function findNavigableArticle(
    summary: Summary,
    article: SummaryArticle,
    getSibling: (current: SummaryArticle) => SummaryArticle | undefined
): SummaryArticle | undefined {
    let sibling = getSibling(article);
    while (sibling && !isPageArticle(sibling)) {
        sibling = getSibling(sibling);
    }
    return sibling;
}

/**
 Return a JSON representation of a page
 */
function encodePage(page: Page, summary: Summary): EncodedPage {
    const file = page.getFile();
    const attributes = page.getAttributes();
    const article = summary.getByPath(file.getPath());

    const result = attributes.toJS();

    if (article) {
        result.title = article.getTitle();
        result.level = article.getLevel();
        result.depth = article.getDepth();

        const nextArticle = findNavigableArticle(summary, article, (current) => summary.getNextArticle(current));
        if (nextArticle) {
            result.next = encodeSummaryArticle(nextArticle);
        }

        const prevArticle = findNavigableArticle(summary, article, (current) => summary.getPrevArticle(current));
        if (prevArticle) {
            result.previous = encodeSummaryArticle(prevArticle);
        }

        const articles = article
            .getArticles()
            .map((article) => encodeSummaryArticle(article))
            .toJS();
        if (articles.length > 0) {
            result.articles = articles;
        }
    }

    result.content = page.getContent();
    result.dir = page.getDir();

    return result;
}

export default encodePage;
