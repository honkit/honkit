// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generatePa... Remove this comment to see the full error message
const generatePage = require("./generatePage");
const { getCache } = require("./page-cache");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Page'.
const Page = require("../models/page");

/**
 Output all pages using a generator

 @param {Generator} generator
 @param {Output} output
 @return {Promise<Output>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generatePa... Remove this comment to see the full error message
function generatePages(generator, output) {
    const cache = getCache();
    const pages = output.getPages();
    const logger = output.getLogger();

    // Is generator ignoring assets?
    if (!generator.onPage) {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise(output);
    }

    const root = output.book.getContentRoot();
    const isIncrementBuilding = output.incrementalChangeFileSet.size !== 0;
    const pageList = pages.map((page) => {
        const file = page.getFile();

        const absoluteFilePath = path.join(root, file.getPath());
        // incremental build
        if (isIncrementBuilding && !output.incrementalChangeFileSet.has(absoluteFilePath)) {
            logger.debug.ln(`slkip generate page "${file.getPath()}"`);
            return; // Skip build
        }
        // if has compiled pages, use it instead of compiling page
        const pageHash = page.hash();
        const cachedPage = cache.getKey(pageHash);
        const pagePromise = cachedPage
            ? // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
              Promise(Page.fromJSON(cachedPage))
            : generatePage(output, page).then((resultPage) => {
                  logger.debug.ln(`Update new page "${file.getPath()}"`);
                  cache.setKey(pageHash, Page.toJSON(resultPage));
                  return resultPage;
              });
        return pagePromise
            .then((resultPage) => {
                // It call renderToString
                // Create page file
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
