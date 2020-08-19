// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parsers'.
const parsers = require("../parsers");

/**
 * Return a list of all shortcuts that can apply
 * to a file for a TemplatEngine
 *
 * @param {List<TemplateBlock>} engine
 * @param {String} filePath
 * @return {List<TemplateShortcut>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'listShortc... Remove this comment to see the full error message
function listShortcuts(blocks, filePath) {
    const parser = parsers.getForFile(filePath);

    if (!parser) {
        return Immutable.List();
    }

    return blocks
        .map((block) => {
            return block.getShortcuts();
        })
        .filter((shortcuts) => {
            return shortcuts && shortcuts.acceptParser(parser.getName());
        });
}

module.exports = listShortcuts;
