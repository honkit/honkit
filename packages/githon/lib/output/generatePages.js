const Promise = require("../utils/promise");
const generatePage = require("./generatePage");

/**
 Output all pages using a generator

 @param {Generator} generator
 @param {Output} output
 @return {Promise<Output>}
 */
function generatePages(generator, output) {
    const pages = output.getPages();
    const logger = output.getLogger();

    // Is generator ignoring assets?
    if (!generator.onPage) {
        return Promise(output);
    }

    const promises = pages.map((page) => {
        const file = page.getFile();
        logger.debug.ln(`generate page "${file.getPath()}"`);
        return generatePage(output, page)
            .then((resultPage) => {
                return generator.onPage(output, resultPage);
            })
            .fail((err) => {
                logger.error.ln(`error while generating page "${file.getPath()}":`);
                throw err;
            });
    });
    return Promise.all(promises.toArray()).then(() => {
        return output;
    });
}

module.exports = generatePages;
