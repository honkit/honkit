var htmlParser = require('gitbook-html');
var toHTML = require('./tohtml');
var toAsciidoc = require('./toasciidoc');

module.exports = htmlParser.createParser(toHTML, toAsciidoc);
