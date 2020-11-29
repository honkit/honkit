import path from "path";
import createNodeFS from "./fs/node";
import fs from "./utils/fs";
import Promise from "./utils/promise";
import File from "./models/file";
import Readme from "./models/readme";
import Book from "./models/book";
import Parse from "./parse";

/**
 Initialize folder structure for a book
 Read SUMMARY to created the right chapter

 @param {Book}
 @param {string}
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

                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
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

export default initBook;
