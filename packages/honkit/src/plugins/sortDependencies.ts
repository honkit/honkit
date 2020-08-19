// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'THEME_PREF... Remove this comment to see the full error message
const THEME_PREFIX = require("../constants/themePrefix");

const TYPE_PLUGIN = "plugin";
const TYPE_THEME = "theme";

/**
 * Returns the type of a plugin given its name
 * @param {Plugin} plugin
 * @return {String}
 */
function pluginType(plugin) {
    const name = plugin.getName();
    return name && name.indexOf(THEME_PREFIX) === 0 ? TYPE_THEME : TYPE_PLUGIN;
}

/**
 * Sort the list of dependencies to match list in book.json
 * The themes should always be loaded after the plugins
 *
 * @param {List<PluginDependency>} deps
 * @return {List<PluginDependency>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sortDepend... Remove this comment to see the full error message
function sortDependencies(plugins) {
    const byTypes = plugins.groupBy(pluginType);

    return byTypes.get(TYPE_PLUGIN, Immutable.List()).concat(byTypes.get(TYPE_THEME, Immutable.List()));
}

module.exports = sortDependencies;
