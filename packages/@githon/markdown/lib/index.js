const HTMLParser = require("@githon/html");

const toHTML = require("./toHTML");
const toMarkdown = require("./toMarkdown");
const page = require("./page");

module.exports = HTMLParser.createParser(toHTML, toMarkdown);

// Add the custom page escaping
module.exports.page.prepare = page.prepare;
