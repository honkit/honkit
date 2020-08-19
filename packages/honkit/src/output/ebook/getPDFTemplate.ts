const juice = require("juice");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'WebsiteGen... Remove this comment to see the full error message
const WebsiteGenerator = require("../website");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONUtils'... Remove this comment to see the full error message
const JSONUtils = require("../../json");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Templating... Remove this comment to see the full error message
const Templating = require("../../templating");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");

/**
    Generate PDF header/footer templates

    @param {Output} output
    @param {String} type
    @return {String}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getPDFTemp... Remove this comment to see the full error message
function getPDFTemplate(output, type) {
    const filePath = `pdf_${type}.html`;
    const outputRoot = output.getRoot();
    const engine = WebsiteGenerator.createTemplateEngine(output, filePath);

    // Generate context
    const context = JSONUtils.encodeOutput(output);
    context.page = {
        num: "_PAGENUM_",
        title: "_SECTION_",
    };

    // Render the theme
    return (
        Templating.renderFile(engine, `ebook/${filePath}`, context)

            // Inline css and assets
            .then((tplOut) => {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfcall' does not exist on type 'PromiseC... Remove this comment to see the full error message
                return Promise.nfcall(juice.juiceResources, tplOut.getContent(), {
                    webResources: {
                        relativeTo: outputRoot,
                    },
                });
            })
    );
}

module.exports = getPDFTemplate;
