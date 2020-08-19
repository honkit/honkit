// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONUtils'... Remove this comment to see the full error message
const JSONUtils = require("../../json");

/**
    Finish the generation

    @param {Output}
    @return {Output}
*/
function onFinish(output) {
    const book = output.getBook();
    const outputRoot = output.getRoot();

    if (!book.isMultilingual()) {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise(output);
    }

    // Get main language
    const languages = book.getLanguages();
    const mainLanguage = languages.getDefaultLanguage();

    // Read the main JSON
    return (
        fs
            .readFile(path.resolve(outputRoot, mainLanguage.getID(), "README.json"), "utf8")

            // Extend the JSON
            .then((content) => {
                const json = JSON.parse(content);

                json.languages = JSONUtils.encodeLanguages(languages);

                return json;
            })

            .then((json) => {
                return fs.writeFile(path.resolve(outputRoot, "README.json"), JSON.stringify(json, null, 4));
            })

            .thenResolve(output)
    );
}

module.exports = onFinish;
