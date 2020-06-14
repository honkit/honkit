const HTMLParser = require("@githon/html");
const toHTML = require("./toHTML");
const toAsciidoc = require("./toAsciidoc");

module.exports = HTMLParser.createParser(toHTML, toAsciidoc);
