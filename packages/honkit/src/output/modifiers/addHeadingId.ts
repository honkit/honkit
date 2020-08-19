// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'slug'.
const slug = require("github-slugid");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'editHTMLEl... Remove this comment to see the full error message
const editHTMLElement = require("./editHTMLElement");

/**
    Add ID to an heading

    @param {HTMLElement} heading
*/
function addId(heading) {
    if (heading.attr("id")) return;
    heading.attr("id", slug(heading.text()));
}

/**
    Add ID to all headings

    @param {HTMLDom} $
*/
function addHeadingId($) {
    return editHTMLElement($, "h1,h2,h3,h4,h5,h6", addId);
}

module.exports = addHeadingId;
