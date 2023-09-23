import is from "is";
import Immutable from "immutable";
import error from "../utils/error";
import LocationUtils from "../utils/location";
import File from "./file";
import SummaryPart from "./summaryPart";
import SummaryArticle from "./summaryArticle";
import parsers from "../parsers";

type Parts = Immutable.List<any>;

class Summary extends Immutable.Record(
    {
        file: new File(),
        parts: Immutable.List()
    },
    "Summary"
) {
    getFile(): File {
        return this.get("file");
    }

    getParts(): Parts {
        return this.get("parts");
    }

    /**
     Return a part by its index
     */
    getPart(i: number) {
        const parts = this.getParts();
        return parts.get(i);
    }

    /**
     Return an article using an iterator to find it.
     if "partIter" is set, it can also return a Part.

     @param {Function} iter
     @param {Function} [partIter]
     @return {Article|Part}
     */
    getArticle(iter, partIter?): SummaryArticle | null {
        const parts = this.getParts();

        return parts.reduce((result, part) => {
            if (result) return result;

            if (partIter && partIter(part)) return part;
            return SummaryArticle.findArticle(part, iter);
        }, null);
    }

    /**
     Return a part/article by its level

     @param {string} level
     @return {Article|Part}
     */
    getByLevel(level: string) {
        function iterByLevel(article) {
            return article.getLevel() === level;
        }

        return this.getArticle(iterByLevel, iterByLevel);
    }

    /**
     Return an article by its path

     @param {string} filePath
     @return {Article}
     */
    getByPath(filePath: string): SummaryArticle {
        return this.getArticle((article) => {
            const articlePath = article.getPath();

            return articlePath && LocationUtils.areIdenticalPaths(articlePath, filePath);
        });
    }

    /**
     Return the first article

     @return {Article}
     */
    getFirstArticle() {
        return this.getArticle((article) => {
            return true;
        });
    }

    /**
     Return next article of an article

     */
    getNextArticle(current: SummaryArticle | string): SummaryArticle {
        const level = typeof current === "string" ? current : current.getLevel();
        let wasPrev = false;

        return this.getArticle((article) => {
            if (wasPrev && !article.hasAnchor()) {
                return true;
            }

            if (!wasPrev) {
                wasPrev = article.getLevel() === level;
            }
            return false;
        });
    }

    /**
     Return previous article of an article

     @param {Article} current
     @return {Article}
     */
    getPrevArticle(current) {
        const level = is.string(current) ? current : current.getLevel();
        let prev = undefined;

        this.getArticle((article) => {
            if (article.getLevel() == level) {
                return true;
            }
            if (!article.hasAnchor()) {
                prev = article;
            }
            return false;
        });

        return prev;
    }

    /**
     Return the parent article, or parent part of an article

     @param {String|Article} current
     @return {Article|Part|Null}
     */
    getParent(level) {
        // Coerce to level
        level = is.string(level) ? level : level.getLevel();

        // Get parent level
        const parentLevel = getParentLevel(level);
        if (!parentLevel) {
            return null;
        }

        // Get parent of the position
        const parentArticle = this.getByLevel(parentLevel);
        return parentArticle || null;
    }

    /**
     Render summary as text

     @param {string} parseExt Extension of the parser to use
     @return {Promise<String>}
     */
    toText(parseExt) {
        const file = this.getFile();
        const parts = this.getParts();

        const parser = parseExt ? parsers.getByExt(parseExt) : file.getParser();

        if (!parser) {
            throw error.FileNotParsableError({
                filename: file.getPath()
            });
        }

        return parser.renderSummary({
            parts: parts.toJS()
        });
    }

    /**
     Return all articles as a list

     @return {List<Article>}
     */
    getArticlesAsList() {
        const accu = [];

        this.getArticle((article) => {
            accu.push(article);
        });

        return Immutable.List(accu);
    }

    /**
     Create a new summary for a list of parts

     @param {Lust|Array} parts
     @return {Summary}
     */
    static createFromParts(file, parts) {
        parts = parts.map((part, i) => {
            if (part instanceof SummaryPart) {
                return part;
            }
            return SummaryPart.create(part, i + 1);
        });

        return new Summary({
            file: file,

            // @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
            parts: new Immutable.List(parts)
        });
    }
}

/**
 Returns parent level of a level

 @param {string} level
 @return {string}
 */
function getParentLevel(level: string) {
    const parts = level.split(".");
    return parts.slice(0, -1).join(".");
}

export default Summary;
