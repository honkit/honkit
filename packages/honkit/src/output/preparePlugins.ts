// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Plugins'.
const Plugins = require("../plugins");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");

/**
 * Load and setup plugins
 *
 * @param {Output}
 * @return {Promise<Output>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'preparePlu... Remove this comment to see the full error message
function preparePlugins(output) {
    const book = output.getBook();

    return (
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        Promise()
            // Only load plugins for main book
            .then(() => {
                if (book.isLanguageBook()) {
                    return output.getPlugins();
                } else {
                    return Plugins.loadForBook(book);
                }
            })

            // Update book's configuration using the plugins
            .then((plugins) => {
                return Plugins.validateConfig(book, plugins).then((newBook) => {
                    return output.merge({
                        book: newBook,
                        plugins: plugins,
                    });
                });
            })
    );
}

module.exports = preparePlugins;
