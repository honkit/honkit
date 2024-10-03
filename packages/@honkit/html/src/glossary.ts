// const dom = require("./dom");
import * as dom from "./dom";

/**
    Parse an HTML content into a list of glossary entry

    @param {string} html
    @return {Array}
*/
function parseGlossary(html: string) {
    const $ = dom.parse(html);

    const entries: Array<{ name: string; description: any }> = [];

    $("h2").each(function () {
        const $heading = $(this);
        const $next = $heading.next();
        const $p = $next.is("p") ? $next.first() : $next.find("p").first();

        const entry: any = {};

        entry.name = $heading.text();
        entry.description = $p.text();

        entries.push(entry);
    });

    return entries;
}
export default parseGlossary;
