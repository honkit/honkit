// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseStruc... Remove this comment to see the full error message
const parseStructureFile = require("./parseStructureFile");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Readme'.
const Readme = require("../models/readme");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'error'.
const error = require("../utils/error");

/**
    Parse readme from book

    @param {Book} book
    @return {Promise<Book>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseReadm... Remove this comment to see the full error message
function parseReadme(book) {
    const logger = book.getLogger();

    return parseStructureFile(book, "readme").spread((file, result) => {
        if (!file) {
            throw new error.FileNotFoundError({ filename: "README" });
        }

        logger.debug.ln("readme found at", file.getPath());

        const readme = Readme.create(file, result);
        return book.set("readme", readme);
    });
}

module.exports = parseReadme;
