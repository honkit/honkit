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
    // Use htmlparser2 in HTML mode for both parsing and serialization of void elements.
    const $ = cheerio.load(html, { xml: { xmlMode: false, encodeEntities: "utf8" } });

    return Promise.forEach(operations, (op) => {
        return op($);
    }).then(() => {
        const resultHTML = $.html();
        const unescapedHtml = resultHTML.replace(/&#x([0-9a-f]{2,});/gi, (_, code) =>
            String.fromCodePoint(parseInt(code, 16))
        );
        return page.set("content", unescapedHtml);
    });
}

export default modifyHTML;
