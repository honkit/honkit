const path = require("path");

const createNodeFS = require("./fs/node");
const fs = require("./utils/fs");
const Promise = require("./utils/promise");
const File = require("./models/file");
const Readme = require("./models/readme");
const Book = require("./models/book");
const Parse = require("./parse");

/**
 Initialize folder structure for a book
 Read SUMMARY to created the right chapter

 @param {Book}
 @param {String}
 @return {Promise}
 */
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
                    Promise.forEach(articles, (article) => {
                        const articlePath = article.getPath();
                        const filePath = articlePath ? path.join(rootFolder, articlePath) : null;
                        if (!filePath) {
                            return;
                        }

                        return fs.assertFile(filePath, () => {
                            return fs.ensureFile(filePath).then(() => {
                                logger.info.ln("create", article.getPath());
                                const d = Promise.defer();
                                fs.writeFile(filePath, `# ${article.getTitle()}\n\n`, (error) => {
                                    if (error) {
                                        d.reject(error);
                                    } else {
                                        d.resolve();
                                    }
                                });
                                return d.promise;
                            });
                        });
                    })

                        // Write summary
                        .then(() => {
                            const filePath = path.join(rootFolder, summaryFilename);
                            return fs.ensureFile(filePath).then(() => {
                                logger.info.ln(`create ${path.basename(filePath)}`);
                                const d = Promise.defer();
                                fs.writeFile(filePath, summary.toText(extension), (error) => {
                                    if (error) {
                                        d.reject(error);
                                    } else {
                                        d.resolve();
                                    }
                                });
                                return d.promise;
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
