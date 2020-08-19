// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Parse'.
const Parse = require("../parse");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Output'.
const Output = require("../output");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'timing'.
const timing = require("../utils/timing");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'options'.
const options = require("./options");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getBook'.
const getBook = require("./getBook");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getOutputF... Remove this comment to see the full error message
const getOutputFolder = require("./getOutputFolder");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clearCache... Remove this comment to see the full error message
const { clearCache } = require("../output/page-cache");

module.exports = {
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
                    root: outputFolder,
                });
            })
            .fin(() => {
                if (kwargs.timing) timing.dump(book.getLogger());
            });
    },
};
