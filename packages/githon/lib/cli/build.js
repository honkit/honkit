const Parse = require("../parse");
const Output = require("../output");
const timing = require("../utils/timing");

const options = require("./options");
const getBook = require("./getBook");
const getOutputFolder = require("./getOutputFolder");
const { clearCache } = require("../output/page-cache");

module.exports = {
    name: "build [book] [output]",
    description: "build a book",
    options: [options.log, options.format, options.timing, options.reaload],
    exec: function (args, kwargs) {
        const book = getBook(args, kwargs);
        const outputFolder = getOutputFolder(args);
        const Generator = Output.getGenerator(kwargs.format);

        if (kwargs.reload) {
            clearCache();
        }
        return Parse.parseBook(book)
            .then((resultBook) => {
                return Output.generate(Generator, resultBook, {
                    root: outputFolder,
                });
            })
            .fin(() => {
                if (kwargs.timing) timing.dump(book.getLogger());
            });
    },
};
