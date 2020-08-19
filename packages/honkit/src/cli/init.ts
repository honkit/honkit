// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'options'.
const options = require("./options");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'initBook'.
const initBook = require("../init");

module.exports = {
    name: "init [book]",
    description: "setup and create files for chapters",
    options: [options.log],
    exec: function (args, kwargs) {
        const bookRoot = path.resolve(process.cwd(), args[0] || "./");

        return initBook(bookRoot);
    },
};
