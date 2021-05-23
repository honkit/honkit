import Templating from "../templating";
import TemplateEngine from "../models/templateEngine";
import Api from "../api";
import Plugins from "../plugins";
import defaultBlocks from "../constants/defaultBlocks";
import defaultFilters from "../constants/defaultFilters";

/**
 Create template engine for an output.
 It adds default filters/blocks, then add the ones from plugins

 @param {Output} output
 @return {TemplateEngine}
 */

function createTemplateEngine(output) {
    const plugins = output.getPlugins();
    const book = output.getBook();
    const rootFolder = book.getContentRoot();
    const logger = book.getLogger();

    let filters = Plugins.listFilters(plugins);
    let blocks = Plugins.listBlocks(plugins);

    // Extend with default
    blocks = defaultBlocks.merge(blocks);
    filters = defaultFilters.merge(filters);

    // Create loader
    const transformFn = Templating.replaceShortcuts.bind(null, blocks);
    // @ts-expect-error: Expected 0 arguments, but got 3.
    const loader = new Templating.ConrefsLoader(rootFolder, transformFn, logger);

    // Create API context
    const context = Api.encodeGlobal(output);

    return new TemplateEngine({
        filters: filters,
        blocks: blocks,
        loader: loader,
        context: context,
    });
}

export default createTemplateEngine;
