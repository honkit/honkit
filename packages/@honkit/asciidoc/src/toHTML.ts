import Asciidoctor from "asciidoctor";
import { ToHTMLFunction } from "@honkit/html";

const asciidoctor = Asciidoctor();

// Render Asciidoc to HTML (block)
const asciidocToHTML: ToHTMLFunction = (content: string, options) => {
    return asciidoctor.convert(content, {
        safe: "server",
        attributes: { showtitle: "", icons: "font@" },
        base_dir: options?.baseDirectory
    }) as string;
};

// Render Asciidoc to HTML (inline)
const asciidocToHTMLInline: ToHTMLFunction = (content: string, options) => {
    return asciidoctor.convert(content, { doctype: "inline", base_dir: options?.baseDirectory }) as string;
};

export default {
    block: asciidocToHTML,
    inline: asciidocToHTMLInline
};
