const marked = require("marked");

module.exports = (markdown, cliOptions) => {
    return marked(markdown, {
        gfm: cliOptions.gfm,
    });
};
