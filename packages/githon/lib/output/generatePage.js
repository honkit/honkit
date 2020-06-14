const path = require("path");

const Promise = require("../utils/promise");
const error = require("../utils/error");
const timing = require("../utils/timing");

const Templating = require("../templating");
const JSONUtils = require("../json");
const createTemplateEngine = require("./createTemplateEngine");
const callPageHook = require("./callPageHook");

/**
 * Prepare and generate HTML for a page
 *
 * @param {Output} output
 * @param {Page} page
 * @return {Promise<Page>}
 */
function generatePage(output, page) {
    const book = output.getBook();
    const engine = createTemplateEngine(output);

    return timing.measure(
        "page.generate",
        Promise(page).then((resultPage) => {
            const file = resultPage.getFile();
            const filePath = file.getPath();
            const parser = file.getParser();
            const context = JSONUtils.encodeOutputWithPage(output, resultPage);

            if (!parser) {
                return Promise.reject(
                    error.FileNotParsableError({
                        filename: filePath,
                    })
                );
            }

            // Call hook "page:before"
            // const start = Date.now();
            return (
                callPageHook("page:before", output, resultPage)
                    // Escape code blocks with raw tags
                    .then((currentPage) => {
                        // console.log("page:before", Date.now() - start);
                        return parser.preparePage(currentPage.getContent());
                    })

                    // Render templating syntax
                    .then((content) => {
                        // console.log("page:preparePage", Date.now() - start);
                        const absoluteFilePath = path.join(book.getContentRoot(), filePath);
                        try {
                            return Templating.render(engine, absoluteFilePath, content, context);
                        } catch (error) {
                            console.error("Template Rendering Error");
                            console.log("Template content", content);
                        }
                    })

                    .then((output) => {
                        // console.log("page:render", Date.now() - start);
                        const content = output.getContent();

                        return parser.parsePage(content).then((result) => {
                            return output.setContent(result.content);
                        });
                    })

                    // Post processing for templating syntax
                    .then((output) => {
                        // console.log("page:parsePage", Date.now() - start);
                        return Templating.postRender(engine, output);
                    })

                    // Return new page
                    .then((content) => {
                        // console.log("page:postRender", Date.now() - start);
                        return resultPage.set("content", content);
                    })

                    // Call final hook
                    .then((currentPage) => {
                        return callPageHook("page", output, currentPage);
                    })
            );
        })
    );
}

module.exports = generatePage;
