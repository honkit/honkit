// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Modifiers'... Remove this comment to see the full error message
const Modifiers = require("./modifiers");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'resolveFil... Remove this comment to see the full error message
const resolveFileToURL = require("./helper/resolveFileToURL");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Api'.
const Api = require("../api");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Plugins'.
const Plugins = require("../plugins");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'defaultBlo... Remove this comment to see the full error message
const defaultBlocks = require("../constants/defaultBlocks");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fileToOutp... Remove this comment to see the full error message
const fileToOutput = require("./helper/fileToOutput");

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
            // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
            return Promise(
                code.applyBlock(
                    {
                        body: source,
                        kwargs: {
                            language: lang,
                        },
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
        }),
    ];
}

module.exports = getModifiers;
