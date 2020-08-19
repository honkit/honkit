// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONUtils'... Remove this comment to see the full error message
const JSONUtils = require("../../json");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PathUtils'... Remove this comment to see the full error message
const PathUtils = require("../../utils/path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Modifiers'... Remove this comment to see the full error message
const Modifiers = require("../modifiers");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'writeFile'... Remove this comment to see the full error message
const writeFile = require("../helper/writeFile");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getModifie... Remove this comment to see the full error message
const getModifiers = require("../getModifiers");

const JSON_VERSION = "3";

/**
 * Write a page as a json file
 *
 * @param {Output} output
 * @param {Page} page
 */
function onPage(output, page) {
    const file = page.getFile();
    const readme = output.getBook().getReadme().getFile();

    return Modifiers.modifyHTML(page, getModifiers(output, page)).then((resultPage) => {
        // Generate the JSON
        const json = JSONUtils.encodeBookWithPage(output.getBook(), resultPage);

        // Delete some private properties
        delete json.config;

        // Specify JSON output version
        json.version = JSON_VERSION;

        // File path in the output folder
        let filePath = file.getPath() == readme.getPath() ? "README.json" : file.getPath();
        filePath = PathUtils.setExtension(filePath, ".json");

        // Write it to the disk
        return writeFile(output, filePath, JSON.stringify(json, null, 4));
    });
}

module.exports = onPage;
