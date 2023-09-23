import Promise from "../utils/promise";
import validateConfig from "./validateConfig";
import CONFIG_FILES from "../constants/configFiles";

/**
 Parse configuration from "book.json" or "book.js"

 @param {Book} book
 @return {Promise<Book>}
 */

function parseConfig(book) {
    const fs = book.getFS();
    let config = book.getConfig();

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
                        values: cfg
                    };
                });
            })
            .fail((err) => {
                if (err.code != "MODULE_NOT_FOUND") throw err;
                else return Promise(false);
            });
    }).then((result) => {
        let values = result ? result.values : {};
        values = validateConfig(values);

        // Set the file
        if (result && result.file) {
            config = config.setFile(result.file);
        }

        // Merge with old values
        config = config.mergeValues(values);

        return book.setConfig(config);
    });
}

export default parseConfig;
