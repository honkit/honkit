// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createNode... Remove this comment to see the full error message
const createNodeFS = require("./fs/node");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("./utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("./utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'File'.
const File = require("./models/file");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Readme'.
const Readme = require("./models/readme");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Book'.
const Book = require("./models/book");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Parse'.
const Parse = require("./parse");

/**
    Initialize folder structure for a book
    Read SUMMARY to created the right chapter

    @param {Book}
    @param {String}
    @return {Promise}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'initBook'.
function initBook(rootFolder) {
    const extension = ".md";

    return (
        fs
            .mkdirp(rootFolder)

            // Parse the summary and readme
            .then(() => {
                const fs = createNodeFS(rootFolder);
                const book = Book.createForFS(fs);

                return (
                    Parse.parseReadme(book)

                        // Setup default readme if doesn't found one
                        .fail(() => {
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'createWithFilepath' does not exist on ty... Remove this comment to see the full error message
                            const readmeFile = File.createWithFilepath(`README${extension}`);
                            const readme = Readme.create(readmeFile);
                            return book.setReadme(readme);
                        })
                );
            })
            .then(Parse.parseSummary)

            .then((book) => {
                const logger = book.getLogger();
                const summary = book.getSummary();
                const summaryFile = summary.getFile();
                const summaryFilename = summaryFile.getPath() || `SUMMARY${extension}`;

                const articles = summary.getArticlesAsList();

                // Write pages
                return (
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type 'Promise... Remove this comment to see the full error message
                    Promise.forEach(articles, (article) => {
                        const articlePath = article.getPath();
                        const filePath = articlePath ? path.join(rootFolder, articlePath) : null;
                        if (!filePath) {
                            return;
                        }

                        return fs.assertFile(filePath, () => {
                            return fs.ensureFile(filePath).then(() => {
                                logger.info.ln("create", article.getPath());
                                return fs.writeFile(filePath, `# ${article.getTitle()}\n\n`);
                            });
                        });
                    })

                        // Write summary
                        .then(() => {
                            const filePath = path.join(rootFolder, summaryFilename);

                            return fs
                                .ensureFile(filePath)
                                .then(() => {
                                    logger.info.ln(`create ${path.basename(filePath)}`);
                                    return summary.toText(extension);
                                })
                                .then((content) => {
                                    return fs.writeFile(filePath, content);
                                });
                        })

                        // Log end
                        .then(() => {
                            logger.info.ln("initialization is finished");
                        })
                );
            })
    );
}

module.exports = initBook;
