import Immutable from "immutable";
import fm from "front-matter";
import direction from "direction";

/**
 * Parse a page, its content and the YAMl header
 *
 * @param {Page} page
 * @param {string} content
 * @return {Page}
 */

function parsePageFromString(page, content) {
    // Parse page YAML
    const parsed = fm(content);

    return page.merge({
        content: parsed.body,
        attributes: Immutable.fromJS(parsed.attributes),
        dir: direction(parsed.body)
    });
}

export default parsePageFromString;
