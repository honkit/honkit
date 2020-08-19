// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'timing'.
const timing = require("../utils/timing");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TemplateOu... Remove this comment to see the full error message
const TemplateOutput = require("../models/templateOutput");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'replaceSho... Remove this comment to see the full error message
const replaceShortcuts = require("./replaceShortcuts");

/**
 * Render a template
 *
 * @param {TemplateEngine} engine
 * @param {String} filePath: absolute path for the loader
 * @param {String} content
 * @param {Object} context (optional)
 * @return {Promise<TemplateOutput>}
 */
function renderTemplate(engine, filePath, content, context) {
    context = context || {};

    // Mutable objects to contains all blocks requiring post-processing
    const blocks = {};

    // Create nunjucks environment
    const env = engine.toNunjucks(blocks);

    // Replace shortcuts from plugin's blocks
    content = replaceShortcuts(engine.getBlocks(), filePath, content);

    return timing.measure(
        "template.render",
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfcall' does not exist on type 'PromiseC... Remove this comment to see the full error message
        Promise.nfcall(env.renderString.bind(env), content, context, {
            path: filePath,
        })
            .then((content) => {
                return TemplateOutput.create(content, blocks);
            })
            .catch((error) => {
                console.log("env:", env);
                console.log("context:", context);
                console.log("content:", content);
                console.error("rendering error:", error);
                return Promise.reject(error);
            })
    );
}

module.exports = renderTemplate;
