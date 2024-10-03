import * as dom from "./dom";

/**
    Parse an HTML content into metadata about a readme

    @param {string} html
    @return {Object}
*/
function parseReadme(html) {
    const $ = dom.parse(html);

    return {
        title: $("h1:first-child").text().trim(),
        description: $("div.paragraph,p").first().text().trim()
    };
}

export default parseReadme;
