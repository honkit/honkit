import * as cheerio from "cheerio";
import Promise from "../../utils/promise";

/**
 Apply a list of operations to a page and
 output the new page.

 @param {Page}
 @param {List|Array<Transformation>}
 @return {Promise<Page>}
 */
function modifyHTML(page, operations) {
    const html = page.getContent();
    // Parse an HTML fragment without adding html/head/body wrappers.
    const $ = cheerio.load(html, {}, false);

    return Promise.forEach(operations, (op) => {
        return op($);
    }).then(() => {
        return page.set("content", $.html());
    });
}

export default modifyHTML;
