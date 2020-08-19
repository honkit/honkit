// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Output'.
const Output = require("../models/output");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../utils/fs");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callHook'.
const callHook = require("./callHook");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'preparePlu... Remove this comment to see the full error message
const preparePlugins = require("./preparePlugins");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'preparePag... Remove this comment to see the full error message
const preparePages = require("./preparePages");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prepareAss... Remove this comment to see the full error message
const prepareAssets = require("./prepareAssets");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generateAs... Remove this comment to see the full error message
const generateAssets = require("./generateAssets");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generatePa... Remove this comment to see the full error message
const generatePages = require("./generatePages");

/**
 * Process an output to generate the book
 *
 * @param {Generator} generator
 * @param {Output} output
 * @return {Promise<Output>}
 */
function processOutput(generator, output) {
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(output)
        .then(preparePlugins)
        .then(preparePages)
        .then(prepareAssets)

        .then(
            callHook.bind(
                null,
                "config",
                (output) => {
                    const book = output.getBook();
                    const config = book.getConfig();
                    const values = config.getValues();

                    return values.toJS();
                },
                (output, result) => {
                    let book = output.getBook();
                    let config = book.getConfig();

                    config = config.updateValues(result);
                    book = book.set("config", config);
                    return output.set("book", book);
                }
            )
        )

        .then(
            callHook.bind(
                null,
                "init",
                (output) => {
                    return {};
                },
                (output) => {
                    return output;
                }
            )
        )

        .then((output) => {
            if (!generator.onInit) {
                return output;
            }

            return generator.onInit(output);
        })

        .then((output) => generateAssets(generator, output))
        .then((output) => generatePages(generator, output))

        .tap((output) => {
            const book = output.getBook();

            if (!book.isMultilingual()) {
                return;
            }

            const logger = book.getLogger();
            const books = book.getBooks();
            const outputRoot = output.getRoot();
            const plugins = output.getPlugins();
            const state = output.getState();
            const options = output.getOptions();
            const bookList = books.map((langBook) => {
                // Inherits plugins list, options and state
                const langOptions = options.set("root", path.join(outputRoot, langBook.getLanguage()));
                const langOutput = new Output({
                    book: langBook,
                    options: langOptions,
                    state: state,
                    generator: generator.name,
                    plugins: plugins,
                });

                logger.info.ln("");
                logger.info.ln(`generating language "${langBook.getLanguage()}"`);
                return processOutput(generator, langOutput);
            });
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'thenResolve' does not exist on type 'Pro... Remove this comment to see the full error message
            return Promise.all(bookList.toArray()).thenResolve(output);
        })

        .then(
            callHook.bind(
                null,
                "finish:before",
                (output) => {
                    return {};
                },
                (output) => {
                    return output;
                }
            )
        )

        .then((output) => {
            if (!generator.onFinish) {
                return output;
            }

            return generator.onFinish(output);
        })

        .then(
            callHook.bind(
                null,
                "finish",
                (output) => {
                    return {};
                },
                (output) => {
                    return output;
                }
            )
        );
}

/**
 * Generate a book using a generator.
 *
 * The overall process is:
 *     1. List and load plugins for this book
 *     2. Call hook "config"
 *     3. Call hook "init"
 *     4. Initialize generator
 *     5. List all assets and pages
 *     6. Copy all assets to output
 *     7. Generate all pages
 *     8. Call hook "finish:before"
 *     9. Finish generation
 *     10. Call hook "finish"
 *
 *
 * @param {Generator} generator
 * @param {Book} book
 * @param {Object} options
 * @return {Promise<Output>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generateBo... Remove this comment to see the full error message
function generateBook(generator, book, options) {
    options = generator.Options(options);
    const state = generator.State ? generator.State({}) : Immutable.Map();
    const start = Date.now();

    return (
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        Promise(
            new Output({
                book: book,
                options: options,
                state: state,
                generator: generator.name,
            })
        )
            // Cleanup output folder
            .then((output) => {
                const logger = output.getLogger();
                const rootFolder = output.getRoot();

                logger.debug.ln(`cleanup folder "${rootFolder}"`);
                return fs.ensureFolder(rootFolder).thenResolve(output);
            })

            .then(processOutput.bind(null, generator))

            // Log duration and end message
            .then((output) => {
                const logger = output.getLogger();
                const end = Date.now();
                const duration = (end - start) / 1000;

                logger.info.ok(`generation finished with success in ${duration.toFixed(1)}s !`);

                return output;
            })
    );
}

/**
 * Incremental build for pages
 * output should be prepared plugins
 * @param generator
 * @param output
 * @returns {Promise<Promise<Output>>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'incrementa... Remove this comment to see the full error message
function incrementalBuild(generator, output) {
    const start = Date.now();
    return generateAssets(generator, output)
        .then((output) => generatePages(generator, output))
        .then((output) => {
            const logger = output.getLogger();
            const end = Date.now();
            const duration = (end - start) / 1000;
            logger.info.ok(`generation finished with success in ${duration.toFixed(1)}s !`);

            return output;
        });
}

module.exports.generateBook = generateBook;
module.exports.incrementalBuild = incrementalBuild;
