/**
    List search paths for templates / i18n, etc

    @param {Output} output
    @return {List<String>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'listSearch... Remove this comment to see the full error message
function listSearchPaths(output) {
    const book = output.getBook();
    const plugins = output.getPlugins();

    const searchPaths = plugins
        .valueSeq()
        .map((plugin) => {
            return plugin.getPath();
        })
        .toList();

    return searchPaths.unshift(book.getContentRoot());
}

module.exports = listSearchPaths;
