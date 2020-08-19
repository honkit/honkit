// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'listDepend... Remove this comment to see the full error message
const listDependencies = require("./listDependencies");

/**
 * List all plugin requirements for a book.
 * It can be different from the final list of plugins,
 * since plugins can have their own dependencies
 *
 * @param {Book}
 * @return {List<PluginDependency>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'listDepsFo... Remove this comment to see the full error message
function listDepsForBook(book) {
    const config = book.getConfig();
    const plugins = config.getPluginDependencies();

    return listDependencies(plugins);
}

module.exports = listDepsForBook;
