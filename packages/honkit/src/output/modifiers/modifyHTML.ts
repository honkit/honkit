// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cheerio'.
const cheerio = require("cheerio");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");

/**
    Apply a list of operations to a page and
    output the new page.

    @param {Page}
    @param {List|Array<Transformation>}
    @return {Promise<Page>}
*/
function modifyHTML(page, operations) {
    const html = page.getContent();
    const $ = cheerio.load(html);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type 'Promise... Remove this comment to see the full error message
    return Promise.forEach(operations, (op) => {
        return op($);
    }).then(() => {
        const resultHTML = $.html();
        return page.set("content", resultHTML);
    });
}

module.exports = modifyHTML;
