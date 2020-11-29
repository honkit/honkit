import Immutable from "immutable";
import parsers from "../parsers";

/**
 * Return a list of all shortcuts that can apply
 * to a file for a TemplatEngine
 *
 * @param {List<TemplateBlock>} engine
 * @param {string} filePath
 * @return {List<TemplateShortcut>}
 */

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

export default listShortcuts;
