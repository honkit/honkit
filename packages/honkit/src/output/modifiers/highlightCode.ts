// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'is'.
const is = require("is");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'editHTMLEl... Remove this comment to see the full error message
const editHTMLElement = require("./editHTMLElement");

/**
    Return language for a code blocks from a list of class names

    @param {Array<String>}
    @return {String}
*/
function getLanguageForClass(classNames) {
    return Immutable.List(classNames)
        .map((cl) => {
            // Markdown
            if (cl.search("lang-") === 0) {
                return cl.slice("lang-".length);
            }

            // Asciidoc
            if (cl.search("language-") === 0) {
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

        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise(highlight(lang, source)).then((r) => {
            if (is.string(r.html)) {
                $code.html(r.html);
            } else {
                $code.text(r.text);
            }
        });
    });
}

module.exports = highlightCode;
