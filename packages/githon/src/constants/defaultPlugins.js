import Immutable from "immutable";
import PluginDependency from "../models/pluginDependency";

import pkg from "../../package.json";

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
 * default plugins should be installed in node dependencies of GitBook
 */
export default Immutable.List(["highlight", "search", "lunr", "fontsettings", "theme-default"]).map(
    createFromDependency
);
