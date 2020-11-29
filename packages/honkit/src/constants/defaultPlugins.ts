import Immutable from "immutable";
import PluginDependency from "../models/pluginDependency";

const pkg = require("../../package.json");

/**
 * Create a PluginDependency from a dependency of gitbook
 * @param {string} pluginName
 * @return {PluginDependency}
 */
function createFromDependency(pluginName) {
    const npmID = PluginDependency.nameToNpmID(pluginName);
    const version = pkg.dependencies[npmID];

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
    return PluginDependency.create(pluginName, version);
}

export default Immutable.List(["highlight", "search", "lunr", "fontsettings", "theme-default"]).map(
    createFromDependency
);
