const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");

expect.extend({
    /**
     * Check that a file is created in a directory:
     * expect('myFolder').toHaveFile('hello.md');
     */
    toHaveFile(dirPath, fileName) {
        const filePath = path.join(dirPath, fileName);
        const pass = fs.existsSync(filePath);
        const message = pass
            ? () => `expected directory ${dirPath} not to contain a file named ${fileName}`
            : () => `expected directory ${dirPath} to contain a file named ${fileName}`;
        return {
            pass: pass,
            message: message
        };
    },
    /**
     * Check that a dom element exists in HTML
     * @param {Buffer|String|HTMLDom}
     * @param {String} selector
     */
    toHaveDOMElement(html, selector) {
        const $ = cheerio.load(html, { _useHtmlParser2: true });
        const $el = $(selector);
        const pass = $el.length > 0;
        const message = pass
            ? () => `expected HTML not to contain an element at ${selector}`
            : () => `expected HTML to contain an element at ${selector}`;
        return {
            pass: pass,
            message: message
        };
    }
});
