// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../utils/location");
const PLUGIN_RESOURCES = require("../constants/pluginResources");

/**
    List all resources from a list of plugins

    @param {OrderedMap<String:Plugin>}
    @param {String} type
    @return {Map<String:List<{url, path}>}
*/
function listResources(plugins, resources) {
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
                        url: assetFile,
                    };
                } else {
                    return {
                        path: LocationUtils.normalize(path.join(npmId, assetFile)),
                    };
                }
            });

            list = list.concat(assets);
            result = result.set(resourceType, list);
        });

        return result;
    }, Immutable.Map());
}

module.exports = listResources;
