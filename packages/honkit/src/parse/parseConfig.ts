// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateCo... Remove this comment to see the full error message
const validateConfig = require("./validateConfig");
const CONFIG_FILES = require("../constants/configFiles");

/**
    Parse configuration from "book.json" or "book.js"

    @param {Book} book
    @return {Promise<Book>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseConfi... Remove this comment to see the full error message
function parseConfig(book) {
    const fs = book.getFS();
    let config = book.getConfig();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'some' does not exist on type 'PromiseCon... Remove this comment to see the full error message
    return Promise.some(CONFIG_FILES, (filename) => {
        // Is this file ignored?
        if (book.isFileIgnored(filename)) {
            return;
        }

        // Try loading it
        return fs
            .loadAsObject(filename)
            .then((cfg) => {
                return fs.statFile(filename).then((file) => {
                    return {
                        file: file,
                        values: cfg,
                    };
                });
            })
            .fail((err) => {
                if (err.code != "MODULE_NOT_FOUND") throw err;
                // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
                else return Promise(false);
            });
    }).then((result) => {
        let values = result ? result.values : {};
        values = validateConfig(values);

        // Set the file
        if (result.file) {
            config = config.setFile(result.file);
        }

        // Merge with old values
        config = config.mergeValues(values);

        return book.setConfig(config);
    });
}

module.exports = parseConfig;
