const dom = require("./dom");

/**
    Parse an HTML content into a list of glossary entry

    @param {String} html
    @return {Array}
*/
function parseGlossary(html) {
    const $ = dom.parse(html);

    const entries = [];

    $("h2").each(function () {
        const $heading = $(this);
        const $next = $heading.next();
        const $p = $next.is("p") ? $next.first() : $next.find("p").first();

        const entry = {};

        entry.name = $heading.text();
        entry.description = $p.text();

        entries.push(entry);
    });

    return entries;
}

module.exports = parseGlossary;
