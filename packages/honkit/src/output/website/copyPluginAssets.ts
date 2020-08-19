// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

const ASSET_FOLDER = require("../../constants/pluginAssetsFolder");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");

/**
    Copy all assets from plugins.
    Assets are files stored in "_assets"
    nd resources declared in the plugin itself.

    @param {Output}
    @return {Promise}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'copyPlugin... Remove this comment to see the full error message
function copyPluginAssets(output) {
    const book = output.getBook();

    // Don't copy plugins assets for language book
    // It'll be resolved to the parent folder
    if (book.isLanguageBook()) {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise(output);
    }

    const plugins = output
        .getPlugins()

        // We reverse the order of plugins to copy
        // so that first plugins can replace assets from other plugins.
        .reverse();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type 'Promise... Remove this comment to see the full error message
    return Promise.forEach(plugins, (plugin) => {
        return copyAssets(output, plugin).then(() => {
            return copyResources(output, plugin);
        });
    }).thenResolve(output);
}

/**
    Copy assets from a plugin

    @param {Plugin}
    @return {Promise}
*/
function copyAssets(output, plugin) {
    const logger = output.getLogger();
    const pluginRoot = plugin.getPath();
    const options = output.getOptions();

    const outputRoot = options.get("root");
    const assetOutputFolder = path.join(outputRoot, "gitbook");
    const prefix = options.get("prefix");

    const assetFolder = path.join(pluginRoot, ASSET_FOLDER, prefix);

    if (!fs.existsSync(assetFolder)) {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise();
    }

    logger.debug.ln("copy assets from theme", assetFolder);
    return fs.copyDir(assetFolder, assetOutputFolder, {
        deleteFirst: false,
        overwrite: true,
        confirm: false,
    });
}

/**
    Copy resources from a plugin

    @param {Plugin}
    @return {Promise}
*/
function copyResources(output, plugin) {
    const logger = output.getLogger();

    const options = output.getOptions();
    const outputRoot = options.get("root");

    const state = output.getState();
    const resources = state.getResources();

    const pluginRoot = plugin.getPath();
    const pluginResources = resources.get(plugin.getName());

    let assetsFolder = pluginResources.get("assets");
    const assetOutputFolder = path.join(outputRoot, "gitbook", plugin.getNpmID());

    if (!assetsFolder) {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise();
    }

    // Resolve assets folder
    assetsFolder = path.resolve(pluginRoot, assetsFolder);
    if (!fs.existsSync(assetsFolder)) {
        logger.warn.ln(`assets folder for plugin "${plugin.getName()}" doesn't exist`);
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise();
    }

    logger.debug.ln("copy resources from plugin", assetsFolder);

    return fs.copyDir(assetsFolder, assetOutputFolder, {
        deleteFirst: false,
        overwrite: true,
        confirm: false,
    });
}

module.exports = copyPluginAssets;
