// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Templating... Remove this comment to see the full error message
const Templating = require("../templating");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TemplateEn... Remove this comment to see the full error message
const TemplateEngine = require("../models/templateEngine");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Api'.
const Api = require("../api");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Plugins'.
const Plugins = require("../plugins");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'defaultBlo... Remove this comment to see the full error message
const defaultBlocks = require("../constants/defaultBlocks");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'defaultFil... Remove this comment to see the full error message
const defaultFilters = require("../constants/defaultFilters");

/**
    Create template engine for an output.
    It adds default filters/blocks, then add the ones from plugins

    @param {Output} output
    @return {TemplateEngine}
*/
// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
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

module.exports = createTemplateEngine;
