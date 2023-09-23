import Immutable from "immutable";
import SummaryArticle from "./summaryArticle";

/*
    A part represents a section in the Summary / table of Contents
*/

type Articles = Immutable.List<any>;

class SummaryPart extends Immutable.Record({
    level: String(),
    title: String(),
    articles: Immutable.List()
}) {
    getLevel(): string {
        return this.get("level");
    }

    getTitle(): string {
        return this.get("title");
    }

    getArticles(): Articles {
        return this.get("articles");
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
     * Create a SummaryPart
     *
     * @param {Object} def
     * @return {SummaryPart}
     */
    static create(def, level): SummaryPart {
        const articles = (def.articles || []).map((article, i) => {
            if (article instanceof SummaryArticle) {
                return article;
            }

            return SummaryArticle.create(article, [level, i + 1].join("."));
        });

        return new SummaryPart({
            level: String(level),
            title: def.title,
            articles: Immutable.List(articles)
        });
    }
}

export default SummaryPart;
