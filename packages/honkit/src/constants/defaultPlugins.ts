import Immutable from "immutable";
import PluginDependency from "../models/pluginDependency";
import pkg from "../../package.json";

/**
 * Create a PluginDependency from a dependency of gitbook
 * @param {String} pluginName
 * @return {PluginDependency}
 */
function createFromDependency(pluginName) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToNpmID' does not exist on type 'Cla... Remove this comment to see the full error message
    const npmID = PluginDependency.nameToNpmID(pluginName);
    const version = pkg.dependencies[npmID];

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
    return PluginDependency.create(pluginName, version);
}

export default Immutable.List(["highlight", "search", "lunr", "fontsettings", "theme-default"]).map(
    createFromDependency
);
