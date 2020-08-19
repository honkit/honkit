// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DEFAULT_PL... Remove this comment to see the full error message
const DEFAULT_PLUGINS = require("../../constants/defaultPlugins");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hasPlugin'... Remove this comment to see the full error message
const hasPlugin = require("./hasPlugin");

/**
 * Test if a plugin is a default one
 * @param {String} plugin
 * @param {String} version
 * @return {Boolean}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isDefaultP... Remove this comment to see the full error message
function isDefaultPlugin(pluginName, version) {
    return hasPlugin(DEFAULT_PLUGINS, pluginName, version);
}

module.exports = isDefaultPlugin;
