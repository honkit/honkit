import encodeSummaryArticle from "./encodeSummaryArticle";
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

        const nextArticle = summary.getNextArticle(article);
        if (nextArticle) {
            result.next = encodeSummaryArticle(nextArticle);
        }

        const prevArticle = summary.getPrevArticle(article);
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
