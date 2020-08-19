// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tmp'.
const tmp = require("tmp");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Parse'.
const Parse = require("../parse");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Output'.
const Output = require("../output");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'options'.
const options = require("./options");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getBook'.
const getBook = require("./getBook");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clearCache... Remove this comment to see the full error message
const { clearCache } = require("../output/page-cache");

module.exports = function (format) {
    return {
        name: `${format} [book] [output]`,
        description: "build a book into an ebook file",
        options: [options.log],
        exec: function (args, kwargs) {
            const extension = `.${format}`;

            // Output file will be stored in
            const outputFile = args[1] || `book${extension}`;

            // Create temporary directory
            const outputFolder = tmp.dirSync().name;

            const book = getBook(args, kwargs);
            const logger = book.getLogger();
            const Generator = Output.getGenerator("ebook");
            if (kwargs.reload) {
                clearCache();
            }
            return (
                Parse.parseBook(book)
                    .then((resultBook) => {
                        return Output.generate(Generator, resultBook, {
                            root: outputFolder,
                            format: format,
                        });
                    })

                    // Extract ebook file
                    .then((output) => {
                        const book = output.getBook();
                        const languages = book.getLanguages();

                        if (book.isMultilingual()) {
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type 'Promise... Remove this comment to see the full error message
                            return Promise.forEach(languages.getList(), (lang) => {
                                const langID = lang.getID();

                                const langOutputFile = path.join(
                                    path.dirname(outputFile),
                                    `${path.basename(outputFile, extension)}_${langID}${extension}`
                                );

                                return fs.copy(path.resolve(outputFolder, langID, `index${extension}`), langOutputFile);
                            }).thenResolve(languages.getCount());
                        } else {
                            return fs.copy(path.resolve(outputFolder, `index${extension}`), outputFile).thenResolve(1);
                        }
                    })

                    // Log end
                    .then((count) => {
                        logger.info.ok(`${count} file(s) generated`);

                        logger.debug("cleaning up... ");
                        return logger.debug.promise(fs.rmDir(outputFolder));
                    })
            );
        },
    };
};
