import Asciidoctor from "asciidoctor";

const asciidoctor = Asciidoctor();

// Render Asciidoc to HTML (block)
function asciidocToHTML(content: string) {
    return asciidoctor.convert(content, { safe: "server", attributes: { showtitle: "", icons: "font@" } });
}

// Render Asciidoc to HTML (inline)
function asciidocToHTMLInline(content: string) {
    return asciidoctor.convert(content, { doctype: "inline" });
}

export default {
    block: asciidocToHTML,
    inline: asciidocToHTMLInline,
};
