import parseSummary from "./summary";

/**
    Parse an HTML content into a list of language

    @param {string} html
    @return {Array}
*/
function parseLangs(content: string) {
    const parts = parseSummary(content).parts;
    if (parts.length > 0) {
        return parts[0].articles;
    }

    return [];
}

export default parseLangs;
