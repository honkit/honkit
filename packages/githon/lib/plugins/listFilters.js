const Immutable = require("immutable");

/**
    List filters from a list of plugins

    @param {OrderedMap<String:Plugin>}
    @return {Map<String:Function>}
*/
function listFilters(plugins) {
    return plugins.reverse().reduce((result, plugin) => {
        return result.merge(plugin.getFilters());
    }, Immutable.Map());
}

module.exports = listFilters;
