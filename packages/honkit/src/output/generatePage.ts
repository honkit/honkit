// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'error'.
const error = require("../utils/error");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'timing'.
const timing = require("../utils/timing");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Templating... Remove this comment to see the full error message
const Templating = require("../templating");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONUtils'... Remove this comment to see the full error message
const JSONUtils = require("../json");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTemp... Remove this comment to see the full error message
const createTemplateEngine = require("./createTemplateEngine");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callPageHo... Remove this comment to see the full error message
const callPageHook = require("./callPageHook");

/**
 * Prepare and generate HTML for a page
 *
 * @param {Output} output
 * @param {Page} page
 * @return {Promise<Page>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generatePa... Remove this comment to see the full error message
function generatePage(output, page) {
    const book = output.getBook();
    const engine = createTemplateEngine(output);

    return timing.measure(
        "page.generate",
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
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
                            throw error;
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
