import escapeStringRegexp from "escape-string-regexp";
import listShortcuts from "./listShortcuts";

/**
 * Apply a shortcut of block to a template
 * @param {string} content
 * @param {Shortcut} shortcut
 * @return {string}
 */
function applyShortcut(content, shortcut) {
    const start = shortcut.getStart();
    const end = shortcut.getEnd();

    const tagStart = shortcut.getStartTag();
    const tagEnd = shortcut.getEndTag();

    const regex = new RegExp(`${escapeStringRegexp(start)}([\\s\\S]*?[^\\$])${escapeStringRegexp(end)}`, "g");
    return content.replace(regex, (all, match) => {
        return `{% ${tagStart} %}${match}{% ${tagEnd} %}`;
    });
}

/**
 * Replace shortcuts from blocks in a string
 *
 * @param {List<TemplateBlock>} engine
 * @param {string} filePath
 * @param {string} content
 * @return {string}
 */

function replaceShortcuts(blocks, filePath, content) {
    const shortcuts = listShortcuts(blocks, filePath);
    return shortcuts.reduce(applyShortcut, content);
}

export default replaceShortcuts;
