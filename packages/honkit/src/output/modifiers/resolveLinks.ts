// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'url'.
const url = require("url");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'editHTMLEl... Remove this comment to see the full error message
const editHTMLElement = require("./editHTMLElement");

/**
    Resolve all HTML links:
        - /test.md in hello -> ../test.html

    @param {String} currentFile
    @param {Function(String) -> String} resolveFile
    @param {HTMLDom} $
*/
function resolveLinks(currentFile, resolveFile, $) {
    const currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, "a", ($a) => {
        let href = $a.attr("href");

        // Don't change a tag without href
        if (!href) {
            return;
        }

        if (LocationUtils.isExternal(href)) {
            $a.attr("target", "_blank");
            return;
        }

        // Split anchor
        const parsed = url.parse(href);
        href = parsed.pathname || "";

        if (href) {
            // Calcul absolute path for this
            href = LocationUtils.toAbsolute(href, currentDirectory, ".");

            // Resolve file
            href = resolveFile(href);

            // Convert back to relative
            href = LocationUtils.relative(currentDirectory, href);
        }

        // Add back anchor
        href = href + (parsed.hash || "");

        $a.attr("href", href);
    });
}

module.exports = resolveLinks;
