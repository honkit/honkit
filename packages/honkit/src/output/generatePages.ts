import path from "path";
import Promise from "../utils/promise";
import generatePage from "./generatePage";
import { getCache } from "./page-cache";
import Page from "../models/page";

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
            ? // @ts-expect-error ts-migrate(2339) FIXME: Property 'fromJSON' does not exist on type 'Class'... Remove this comment to see the full error message
              Promise(Page.fromJSON(cachedPage))
            : generatePage(output, page).then((resultPage) => {
                  logger.debug.ln(`Update new page "${file.getPath()}"`);

                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'toJSON' does not exist on type 'Class'.
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

export default generatePages;
