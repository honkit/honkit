const Promise = require("../utils/promise");
const generatePage = require("./generatePage");
const { getCache } = require("./page-cache");
const Page = require("../models/page");

/**
 Output all pages using a generator

 @param {Generator} generator
 @param {Output} output
 @return {Promise<Output>}
 */
function generatePages(generator, output) {
    const cache = getCache();
    const pages = output.getPages();
    const logger = output.getLogger();

    // Is generator ignoring assets?
    if (!generator.onPage) {
        return Promise(output);
    }

    const pageList = pages.map((page) => {
        const file = page.getFile();
        logger.debug.ln(`generate page "${file.getPath()}"`);
        // if has compiled pages, use it instead of compiling page
        const pageHash = page.hash();
        const cachedPage = cache.getKey(pageHash);
        const pagePromise = cachedPage
            ? Promise(Page.fromJSON(cachedPage))
            : generatePage(output, page).then((resultPage) => {
                  cache.setKey(pageHash, Page.toJSON(resultPage));
                  return resultPage;
              });
        return pagePromise
            .then((resultPage) => {
                return generator.onPage(output, resultPage);
            })
            .fail((err) => {
                logger.error.ln(`error while generating page "${file.getPath()}":`);
                throw err;
            });
    });
    return Promise.all(pageList.toArray()).then(() => {
        // update caches
        cache.save();
        return output;
    });
}

module.exports = generatePages;
