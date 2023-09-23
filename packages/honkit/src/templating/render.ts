import Promise from "../utils/promise";
import timing from "../utils/timing";
import TemplateOutput from "../models/templateOutput";
import replaceShortcuts from "./replaceShortcuts";

/**
 * Render a template
 *
 * @param {TemplateEngine} engine
 * @param {string} filePath: absolute path for the loader
 * @param {string} content
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

        Promise.nfcall(env.renderString.bind(env), content, context, {
            path: filePath
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

export default renderTemplate;
