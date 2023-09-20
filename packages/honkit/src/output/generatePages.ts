import path from "path";
import Promise from "../utils/promise";
import generatePage from "./generatePage";
import { getCache } from "./page-cache";
import Page from "../models/page";
import differentialUpdate from "../output/json/differentialUpdate";

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
    let modifiedPaths = differentialUpdate.readData();
    let mapIncliment = 0;
    const pageList = pages.map((page) => {
        mapIncliment++;
        const file = page.getFile();
        const absoluteFilePath = path.join(root, file.getPath());

        // Only files registered in the `SUMMARY.md`
        logger.debug.ln("absoluteFilePath", absoluteFilePath);
        if (modifiedPaths.length == 0) {
            if (mapIncliment == 1) {
                // logger.warn.ln("\x1b[33m[WARNING] Immediately after launching the honkit server, all pages will be updated.\x1b[0m")
                logger.warn.ln(
                    "\x1b[33mImmediately after launching the honkit server, all pages will be updated.\x1b[0m"
                );
            }
        } else {
            let pathIdx = modifiedPaths.indexOf(absoluteFilePath);
            if (pathIdx < 0) {
                return;
            }
        }

        // When incremental build
        if (isIncrementBuilding && !output.incrementalChangeFileSet.has(absoluteFilePath)) {
            logger.debug.ln(`skip generate page "${file.getPath()}"`);
            return; // Skip build
        }

        // Delete all matches
        for (let i = modifiedPaths.length - 1; i >= 0; i--) {
            if (modifiedPaths[i] === absoluteFilePath) {
                modifiedPaths.splice(i, 1);
            }
        }

        return generatePage(output, page)
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

    // uniq filter
    const uniqData = new Map();
    for (const path of modifiedPaths) {
        uniqData.set(path, true);
    }
    let newModifiedPaths = Array.from(uniqData.keys());
    for (const path of newModifiedPaths) {
        logger.warn.ln(`It is not subject to differential updates. "${path}"`);
    }

    // differentialUpdate update
    differentialUpdate.writeData(newModifiedPaths);

    return Promise.all(pageList.toArray()).then(() => {
        // update caches
        cache.save();
        return output;
    });
}

export default generatePages;
