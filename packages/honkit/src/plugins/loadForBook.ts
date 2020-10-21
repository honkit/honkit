import path from "path";
import listDepsForBook from "./listDepsForBook";
import { loadPlugin } from "./loadPlugin";
import { PluginResolver } from "./PluginResolver";

/**
 * Load all plugins in a book
 *
 * @param {Book}
 * @return {Promise<Map<String:Plugin>}
 */
function loadForBook(book) {
    const logger = book.getLogger();

    // List the dependencies are defined in book.js
    /**
     * @type {List<PluginDependency>}
     */
    const requirements = listDepsForBook(book);

    /**
     * Lookup order
     * 1. Current Working Directory
     * 2. HonKit Installed Directory
     * 3. 2's prent directory ... loop 2
     * 4. Global node_modules directory
     * https://nodejs.org/api/modules.html#modules_require_resolve_request_options
     */
    const pluginResolver = new PluginResolver({
        nodeModulePaths: [path.join(process.cwd(), "node_modules")].concat(require.resolve.paths("honkit")),
    });
    const installedPlugins = requirements.map((dep) => {
        const name = dep.getName();
        return dep.merge({
            path: pluginResolver.resolvePluginPackageName(name),
        });
    });

    // Log state
    logger.info.ln(`${installedPlugins.size} plugins are installed`);
    if (requirements.size !== installedPlugins.length) {
        logger.info.ln(`${requirements.size} explicitly listed`);
    }

    return Promise.all(
        installedPlugins.map((plugin) => {
            return loadPlugin(book, plugin);
        })
    );
}

export default loadForBook;
