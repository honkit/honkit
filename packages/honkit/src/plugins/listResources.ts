import Immutable from "immutable";
import path from "path";
import LocationUtils from "../utils/location";
import PLUGIN_RESOURCES from "../constants/pluginResources";
import Plugin from "../models/plugin";

/**
 List all resources from a list of plugins
 @return {Map<String:List<{url, path}>}
 */
function listResources(plugins: Plugin[], resources) {
    return plugins.reduce((result, plugin) => {
        const npmId = plugin.getNpmID();
        const pluginResources = resources.get(plugin.getName());

        PLUGIN_RESOURCES.forEach((resourceType) => {
            let assets = pluginResources.get(resourceType);
            if (!assets) return;

            let list = result.get(resourceType) || Immutable.List();

            assets = assets.map((assetFile) => {
                if (LocationUtils.isExternal(assetFile)) {
                    return {
                        url: assetFile
                    };
                } else {
                    return {
                        path: LocationUtils.normalize(path.join(npmId, assetFile))
                    };
                }
            });

            list = list.concat(assets);
            result = result.set(resourceType, list);
        });

        return result;
    }, Immutable.Map());
}

export default listResources;
