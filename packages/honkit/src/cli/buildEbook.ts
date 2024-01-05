import path from "path";
import Promise from "../utils/promise";
import fs from "../utils/fs";
import Parse from "../parse";
import Output from "../output";
import options from "./options";
import getBook from "./getBook";
import { clearCache } from "../output/page-cache";
import { createTmpDirWithRealPath } from "../fs/tmpdir";

export default function (format) {
    return {
        name: `${format} [book] [output]`,
        description: "build a book into an ebook file",
        options: [options.log],
        exec: function (args, kwargs) {
            const extension = `.${format}`;

            // Output file will be stored in
            const outputFile = args[1] || `book${extension}`;

            // Create temporary directory
            const outputFolder = createTmpDirWithRealPath();

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
                            format: format
                        });
                    })

                    // Extract ebook file
                    .then((output) => {
                        const book = output.getBook();
                        const languages = book.getLanguages();

                        if (book.isMultilingual()) {
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
        }
    };
}
