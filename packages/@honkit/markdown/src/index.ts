import { createParser } from "@honkit/html";
import toHTML from "./toHTML";
import toMarkdown from "./toMarkdown";
import { preparePage } from "./page";

const markdownParser = createParser(toHTML, toMarkdown);
// Add the custom page escaping
markdownParser.page.prepare = preparePage;
export default markdownParser;
