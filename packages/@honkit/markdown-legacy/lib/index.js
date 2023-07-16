var { createParser } = require("@honkit/html");

var toHTML = require("./toHTML");
var toMarkdown = require("./toMarkdown");
var page = require("./page");

module.exports = createParser(toHTML, toMarkdown);
// Add the custom page escaping
// TODO: remove it. use parser.page.prepare instead
module.exports.page.prepare = page.prepare;
