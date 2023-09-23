import Parse from "../parse";
import Output from "../output";
import timing from "../utils/timing";
import options from "./options";
import getBook from "./getBook";
import getOutputFolder from "./getOutputFolder";
import { clearCache } from "../output/page-cache";

export default {
    name: "build [book] [output]",
    description: "build a book",
    options: [options.log, options.format, options.timing, options.reload],
    exec: function (args, kwargs) {
        const book = getBook(args, kwargs);
        const outputFolder = getOutputFolder(args);
        const Generator = Output.getGenerator(kwargs.format);
        if (kwargs.reload) {
            book.getLogger().info.ok(`Clear cache`);
            clearCache();
        }
        return Parse.parseBook(book)
            .then((resultBook) => {
                return Output.generate(Generator, resultBook, {
                    root: outputFolder
                });
            })
            .fin(() => {
                if (kwargs.timing) timing.dump(book.getLogger());
            });
    }
};
