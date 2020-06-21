import parseSummary from "./summary";

/**
    Parse an HTML content into a list of language

    @param {String} html
    @return {Array}
*/
function parseLangs(content) {
    const parts = parseSummary(content).parts;
    if (parts.length > 0) {
        return parts[0].articles;
    }

    return [];
}

export default parseLangs;
