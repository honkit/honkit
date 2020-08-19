// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseStruc... Remove this comment to see the full error message
const parseStructureFile = require("./parseStructureFile");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Summary'.
const Summary = require("../models/summary");
const SummaryModifier = require("../modifiers").Summary;

/**
    Parse summary in a book, the summary can only be parsed
    if the readme as be detected before.

    @param {Book} book
    @return {Promise<Book>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseSumma... Remove this comment to see the full error message
function parseSummary(book) {
    const readme = book.getReadme();
    const logger = book.getLogger();
    const readmeFile = readme.getFile();

    return parseStructureFile(book, "summary").spread((file, result) => {
        let summary;

        if (!file) {
            logger.warn.ln("no summary file in this book");
            summary = Summary();
        } else {
            logger.debug.ln("summary file found at", file.getPath());
            summary = Summary.createFromParts(file, result.parts);
        }

        // Insert readme as first entry if not in SUMMARY.md
        const readmeArticle = summary.getByPath(readmeFile.getPath());

        if (readmeFile.exists() && !readmeArticle) {
            summary = SummaryModifier.unshiftArticle(summary, {
                title: "Introduction",
                ref: readmeFile.getPath(),
            });
        }

        // Set new summary
        return book.setSummary(summary);
    });
}

module.exports = parseSummary;
