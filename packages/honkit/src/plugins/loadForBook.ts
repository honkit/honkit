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

    const pluginResolver = new PluginResolver();
    const installedPlugins = requirements.map((dep) => {
        const name = dep.getName();
        return dep.merge({
            path: pluginResolver.resolvePluginPackageName(name)
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
