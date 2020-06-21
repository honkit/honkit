import Promise from "../utils/promise";
import timing from "../utils/timing";
import TemplateOutput from "../models/templateOutput";
import replaceShortcuts from "./replaceShortcuts";

/**
 * Render a template
 *
 * @param {TemplateEngine} engine
 * @param {String} filePath: absolute path for the loader
 * @param {String} content
 * @param {Object} context (optional)
 * @return {Promise<TemplateOutput>}
 */
function renderTemplate(engine, filePath, content, context = {}) {
    // Mutable objects to contains all blocks requiring post-processing
    const blocks = {};

    // Create nunjucks environment
    const env = engine.toNunjucks(blocks);

    // Replace shortcuts from plugin's blocks
    content = replaceShortcuts(engine.getBlocks(), filePath, content);

    return timing.measure(
        "template.render",

        Promise.nfcall(env.renderString.bind(env), content, context, {
            path: filePath,
        }).then((content) => {
            // @ts-expect-error
            return TemplateOutput.create(content, blocks);
        })
    );
}

export default renderTemplate;
