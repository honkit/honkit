// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

/**
    List blocks from a list of plugins

    @param {OrderedMap<String:Plugin>}
    @return {Map<String:TemplateBlock>}
*/
function listBlocks(plugins) {
    return plugins.reverse().reduce((result, plugin) => {
        const blocks = plugin.getBlocks();
        return result.merge(blocks);
    }, Immutable.Map());
}

module.exports = listBlocks;
