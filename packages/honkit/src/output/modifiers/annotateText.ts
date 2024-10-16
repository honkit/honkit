import escape from "escape-html";
import * as cheerio from "cheerio";

// Selector to ignore
const ANNOTATION_IGNORE = ".no-glossary,code,pre,a,script,h1,h2,h3,h4,h5,h6";

function pregQuote(str) {
    return `${str}`.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

function replaceText($: cheerio.CheerioAPI, el, search, replace, text_only) {
    return $(el).each(function () {
        let node = this.firstChild;
        let val;
        let new_val;
        // Only continue if firstChild exists.
        const replaceMap = new Map();
        if (node) {
            // Loop over all childNodes.
            while (node) {
                // Only process text nodes.
                if (node.nodeType === 3 && node.nodeValue) {
                    // The original node value.
                    val = node.nodeValue;

                    new_val = val.replace(search, replace);

                    // Only replace text if the new value is actually different!
                    if (new_val !== val) {
                        if (!text_only && /</.test(new_val)) {
                            // The new value contains HTML, set it in a slower but far more
                            // robust way.
                            // Don't remove the node yet, or the loop will lose its place.
                            const currentTextNode = $(node);
                            const newHTML = val.replace(val, new_val);
                            if (newHTML !== val) {
                                // should not replace in looping, keep it in map
                                replaceMap.set(currentTextNode, newHTML);
                            }
                        } else {
                            // The new value contains no HTML, so it can be set in this
                            // very fast, simple way.
                            node.nodeValue = new_val;
                        }
                    }
                }
                node = node.nextSibling;
            }
        }
        // replace nodes after looping
        for (const [node, newHTML] of replaceMap.entries()) {
            node.replaceWith(newHTML);
        }
        replaceMap.clear(); // clean up
    });
}

/**
 * Annotate text using a list of GlossaryEntry
 *
 * @param {List<GlossaryEntry>}
 * @param {string} glossaryFilePath
 * @param {HTMLDom} $
 */
function annotateText(entries, glossaryFilePath, $) {
    entries.forEach((entry) => {
        const entryId = entry.getID();
        const name = entry.getName();
        const nameLowerCase = `${name}`.toLowerCase();
        const quotedName = pregQuote(nameLowerCase);
        const nameCleaned = nameLowerCase.replace(/[^\w\s]/, "");
        const searchRegex =
            nameLowerCase === nameCleaned
                ? new RegExp(`\\b(${quotedName})\\b`, "gi")
                : new RegExp(`(?:\\s*)(${quotedName})(?:\\s*)`, "gi");

        const description = entry.getDescription();

        $("*").each(function () {
            const $this = $(this);

            if ($this.is(ANNOTATION_IGNORE) || $this.parents(ANNOTATION_IGNORE).length > 0) return;

            // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
            replaceText($, this, searchRegex, (match, matchedTerm) => {
                return (
                    `<a href="/${glossaryFilePath}#${entryId}" ` +
                    `class="glossary-term" title="${escape(description)}">${matchedTerm}</a>`
                );
            });
        });
    });
}

export default annotateText;
