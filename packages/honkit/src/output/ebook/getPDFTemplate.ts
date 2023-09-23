import juice from "juice";
import WebsiteGenerator from "../website";
import JSONUtils from "../../json";
import Templating from "../../templating";
import Promise from "../../utils/promise";

/**
 Generate PDF header/footer templates

 @param {Output} output
 @param {string} type
 @return {string}
 */

function getPDFTemplate(output, type) {
    const filePath = `pdf_${type}.html`;
    const outputRoot = output.getRoot();
    const engine = WebsiteGenerator.createTemplateEngine(output, filePath);

    // Generate context
    const context = JSONUtils.encodeOutput(output);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'page' does not exist on type '{ summary:... Remove this comment to see the full error message
    context.page = {
        num: "_PAGENUM_",
        title: "_SECTION_"
    };

    // Render the theme
    return (
        Templating.renderFile(engine, `ebook/${filePath}`, context)

            // Inline css and assets
            .then((tplOut) => {
                return Promise.nfcall(juice.juiceResources, tplOut.getContent(), {
                    webResources: {
                        relativeTo: outputRoot
                    }
                });
            })
            .then((tplOut) => tplOut.replace(/\n/g, " ")) // PDF templates need to be on one line for inclusion in spawned command
    );
}

export default getPDFTemplate;
