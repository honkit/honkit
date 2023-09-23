import Immutable from "immutable";
import location from "../utils/location";
import File from "./file";
import Book from "./book";
import Readme from "./readme";

/*
    An article represents an entry in the Summary / table of Contents
*/

type Articles = Immutable.List<SummaryArticle>;

class SummaryArticle extends Immutable.Record(
    {
        level: String(),
        title: String(),
        ref: String(),
        articles: Immutable.List()
    },
    "SummaryArticle"
) {
    getLevel(): string {
        return this.get("level");
    }

    getTitle(): string {
        return this.get("title");
    }

    getRef(): string {
        return this.get("ref");
    }

    getArticles(): Articles {
        return this.get("articles");
    }

    /**
     * Return how deep the article is.
     * The README has a depth of 1
     *
     * @return {number}
     */
    getDepth(): number {
        return this.getLevel().split(".").length - 1;
    }

    /**
     * Get path (without anchor) to the pointing file.
     * It also normalizes the file path.
     *
     * @return {string}
     */
    getPath(): string {
        if (this.isExternal()) {
            return undefined;
        }

        const ref = this.getRef();
        if (!ref) {
            return undefined;
        }

        const parts = ref.split("#");

        const pathname = parts.length > 1 ? parts.slice(0, -1).join("#") : ref;

        // Normalize path to remove ('./', '/...', etc)

        return location.flatten(pathname);
    }

    /**
     * Return url if article is external
     *
     * @return {string}
     */
    getUrl(): string {
        return this.isExternal() ? this.getRef() : undefined;
    }

    /**
     * Get anchor for this article (or undefined)
     *
     * @return {string}
     */
    getAnchor(): string {
        const ref = this.getRef();
        const parts = ref.split("#");

        const anchor = parts.length > 1 ? `#${parts[parts.length - 1]}` : undefined;
        return anchor;
    }

    /**
     * Create a new level for a new child article
     *
     * @return {string}
     */
    createChildLevel(): string {
        const level = this.getLevel();
        const subArticles = this.getArticles();
        const childLevel = `${level}.${subArticles.size + 1}`;

        return childLevel;
    }

    /**
     * Is article pointing to a page of an absolute url
     *
     * @return {boolean}
     */
    isPage(): boolean {
        return Boolean(!this.isExternal() && this.getRef());
    }

    /**
     * Check if this article is a file (exatcly)
     *
     * @param {File} file
     * @return {boolean}
     */
    isFile(file: File): boolean {
        return file.getPath() === this.getPath() && this.getAnchor() === undefined;
    }

    /**
     * Check if this article is the introduction of the book
     *
     * @param {Book|Readme} book
     * @return {boolean}
     */
    isReadme(book: Book | Readme) {
        // @ts-expect-error: union
        const readme = book.getFile ? book : book.getReadme();
        const file = readme.getFile();

        return this.isFile(file);
    }

    /**
     * Is article pointing to aan absolute url
     *
     * @return {boolean}
     */
    isExternal() {
        return location.isExternal(this.getRef());
    }

    /**
     * Create a SummaryArticle
     *
     * @param {Object} def
     * @return {SummaryArticle}
     */
    static create(def, level) {
        const articles = (def.articles || []).map((article, i) => {
            if (article instanceof SummaryArticle) {
                return article;
            }
            return SummaryArticle.create(article, [level, i + 1].join("."));
        });

        return new SummaryArticle({
            level: level,
            title: def.title,
            ref: def.ref || def.path || "",
            articles: Immutable.List(articles)
        });
    }

    /**
     * Has anchor for this article
     *
     * @return {boolean}
     */
    hasAnchor(): boolean {
        const ref = this.getRef();
        return ref.includes("#");
    }

    /**
     * Find an article from a base one
     *
     * @param {Article|Part} base
     * @param {Function(article)} iter
     * @return {Article}
     */

    static findArticle(base, iter): SummaryArticle | null {
        const articles = base.getArticles();

        return articles.reduce((result, article) => {
            if (result) return result;

            if (iter(article)) {
                return article;
            }
            return SummaryArticle.findArticle(article, iter);
        }, null);
    }
}

export default SummaryArticle;
