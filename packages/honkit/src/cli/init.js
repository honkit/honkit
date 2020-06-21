const path = require("path");

const options = require("./options");
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
