import Modifiers from "./modifiers";
import resolveFileToURL from "./helper/resolveFileToURL";
import Api from "../api";
import Plugins from "../plugins";
import Promise from "../utils/promise";
import defaultBlocks from "../constants/defaultBlocks";
import fileToOutput from "./helper/fileToOutput";

const CODEBLOCK = "code";

/**
 * Return default modifier to prepare a page for
 * rendering.
 *
 * @return {Array<Modifier>}
 */
function getModifiers(output, page) {
    const book = output.getBook();
    const plugins = output.getPlugins();
    const glossary = book.getGlossary();
    const file = page.getFile();

    // Glossary entries
    const entries = glossary.getEntries();
    const glossaryFile = glossary.getFile();
    const glossaryFilename = fileToOutput(output, glossaryFile.getPath());

    // Current file path
    const currentFilePath = file.getPath();

    // Get TemplateBlock for highlighting
    const blocks = Plugins.listBlocks(plugins);
    const code = blocks.get(CODEBLOCK) || defaultBlocks.get(CODEBLOCK);

    // Current context
    const context = Api.encodeGlobal(output);

    return [
        // Normalize IDs on headings
        Modifiers.addHeadingId,

        // Annotate text with glossary entries
        Modifiers.annotateText.bind(null, entries, glossaryFilename),

        // Resolve images
        Modifiers.resolveImages.bind(null, currentFilePath),

        // Resolve links (.md -> .html)
        Modifiers.resolveLinks.bind(null, currentFilePath, resolveFileToURL.bind(null, output)),

        // Highlight code blocks using "code" block
        Modifiers.highlightCode.bind(null, (lang, source) => {
            return Promise(
                code.applyBlock(
                    {
                        body: source,
                        kwargs: {
                            language: lang
                        }
                    },
                    context
                )
            ).then((result) => {
                if (result.html === false) {
                    return { text: result.body };
                } else {
                    return { html: result.body };
                }
            });
        })
    ];
}

export default getModifiers;
