import HTMLParser from "@githon/html";
import toHTML from "./toHTML";
import toAsciidoc from "./toAsciidoc";

module.exports = HTMLParser.createParser(toHTML, toAsciidoc);
