// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'listDepsFo... Remove this comment to see the full error message
const listDepsForBook = require("./listDepsForBook");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'loadPlugin... Remove this comment to see the full error message
const { loadPlugin } = require("./loadPlugin");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PluginReso... Remove this comment to see the full error message
const { PluginResolver } = require("./PluginResolver");

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

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    const pluginResolver = new PluginResolver();
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

module.exports = loadForBook;
