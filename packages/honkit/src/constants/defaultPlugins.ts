// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PluginDepe... Remove this comment to see the full error message
const PluginDependency = require("../models/pluginDependency");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'pkg'.
const pkg = require("../../package.json");

/**
 * Create a PluginDependency from a dependency of gitbook
 * @param {String} pluginName
 * @return {PluginDependency}
 */
function createFromDependency(pluginName) {
    const npmID = PluginDependency.nameToNpmID(pluginName);
    const version = pkg.dependencies[npmID];

    return PluginDependency.create(pluginName, version);
}

/*
 * List of default plugins for all books,
 * default plugins should be installed in node dependencies of HonKit
 */
module.exports = Immutable.List(["highlight", "search", "lunr", "fontsettings", "theme-default"]).map(
    createFromDependency
);
