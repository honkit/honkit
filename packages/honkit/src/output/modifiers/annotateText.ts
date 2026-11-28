import escape from "escape-html";
import * as cheerio from "cheerio";

// Selector to ignore
const ANNOTATION_IGNORE = ".no-glossary,code,pre,a,script,h1,h2,h3,h4,h5,h6";

function pregQuote(str) {
    return `${str}`.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

/**
 * Build the HTML of a text, with the matches of `search` replaced by the HTML from `replace`.
 * Return null if there is no match.
 */
function replaceTextToHTML(text, search, replace) {
    let html = "";
    let lastIndex = 0;

    for (const match of text.matchAll(search)) {
        html += escape(text.slice(lastIndex, match.index)) + replace(...match);
        lastIndex = match.index + match[0].length;
    }

    return lastIndex === 0 ? null : html + escape(text.slice(lastIndex));
}

function replaceText($: cheerio.CheerioAPI, el, search, replace) {
    return $(el).each(function () {
        let node = this.firstChild;
        // Only continue if firstChild exists.
        const replaceMap = new Map();
        if (node) {
            // Loop over all childNodes.
            while (node) {
                // Only process text nodes.
                if (node.nodeType === 3 && node.nodeValue) {
                    // The node value is decoded text, so the text around a match needs to be escaped again.
                    const newHTML = replaceTextToHTML(node.nodeValue, search, replace);

                    // Only replace text if there is a match
                    if (newHTML !== null) {
                        // Don't remove the node yet, or the loop will lose its place.
                        // should not replace in looping, keep it in map
                        replaceMap.set($(node), newHTML);
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
                : new RegExp(`(${quotedName})`, "gi");

        const description = entry.getDescription();

        $("*").each(function () {
            const $this = $(this);

            if ($this.is(ANNOTATION_IGNORE) || $this.parents(ANNOTATION_IGNORE).length > 0) return;

            replaceText($, this, searchRegex, (match, matchedTerm) => {
                return (
                    `<a href="/${glossaryFilePath}#${entryId}" ` +
                    `class="glossary-term" title="${escape(description)}">${escape(matchedTerm)}</a>`
                );
            });
        });
    });
}

export default annotateText;
