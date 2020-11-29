import is from "is";
import Immutable from "immutable";
import Promise from "../../utils/promise";
import editHTMLElement from "./editHTMLElement";

/**
 Return language for a code blocks from a list of class names

 @param {Array<String>}
 @return {string}
 */
function getLanguageForClass(classNames) {
    return Immutable.List(classNames)
        .map((cl) => {
            // Markdown

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'search' does not exist on type 'unknown'... Remove this comment to see the full error message
            if (cl.search("lang-") === 0) {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'slice' does not exist on type 'unknown'.
                return cl.slice("lang-".length);
            }

            // Asciidoc

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'search' does not exist on type 'unknown'... Remove this comment to see the full error message
            if (cl.search("language-") === 0) {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'slice' does not exist on type 'unknown'.
                return cl.slice("language-".length);
            }

            return null;
        })
        .find((cl) => {
            return Boolean(cl);
        });
}

/**
 Highlight all code elements

 @param {Function(lang, body) -> String} highlight
 @param {HTMLDom} $
 @return {Promise}
 */
function highlightCode(highlight, $) {
    return editHTMLElement($, "code", ($code) => {
        const classNames = ($code.attr("class") || "").split(" ");
        const lang = getLanguageForClass(classNames);
        const source = $code.text();

        return Promise(highlight(lang, source)).then((r) => {
            if (is.string(r.html)) {
                $code.html(r.html);
            } else {
                $code.text(r.text);
            }
        });
    });
}

export default highlightCode;
