import HTMLParser from "@githon/html";

import toHTML from "./toHTML";
import toMarkdown from "./toMarkdown";
import page from "./page";

module.exports = HTMLParser.createParser(toHTML, toMarkdown);

// Add the custom page escaping
module.exports.page.prepare = page.prepare;
