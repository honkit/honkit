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
    // @ts-expect-error
    const $ = cheerio.load(html, { _useHtmlParser2: true });

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
