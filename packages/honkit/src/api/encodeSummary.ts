import encodeSummaryArticle from "../json/encodeSummaryArticle";

/**
 Encode summary to provide an API to plugin

 @param {Output} output
 @param {Config} config
 @return {Object}
 */

function encodeSummary(output, summary) {
    const result = {
        /**
         Iterate over the summary, it stops when the "iter" returns false

         @param {Function} iter
         */
        walk: function (iter) {
            summary.getArticle((article) => {
                const jsonArticle = encodeSummaryArticle(article, false);

                return iter(jsonArticle);
            });
        },

        /**
         Get an article by its level

         @param {String} level
         @return {Object}
         */
        getArticleByLevel: function (level) {
            const article = summary.getByLevel(level);

            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            return article ? encodeSummaryArticle(article) : undefined;
        },

        /**
         Get an article by its path

         @param {String} level
         @return {Object}
         */
        getArticleByPath: function (level) {
            const article = summary.getByPath(level);

            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            return article ? encodeSummaryArticle(article) : undefined;
        },
    };

    return result;
}

export default encodeSummary;
