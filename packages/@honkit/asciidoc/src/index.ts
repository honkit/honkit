import { createParser } from "@honkit/html";
import toHTML from "./toHTML";
import toAsciidoc from "./toAsciidoc";

export default createParser(toHTML, toAsciidoc);
