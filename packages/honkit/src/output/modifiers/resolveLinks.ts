import path from "path";
import LocationUtils from "../../utils/location";
import editHTMLElement from "./editHTMLElement";

/**
 Resolve all HTML links:
 - /test.md in hello -> ../test.html

 @param {string} currentFile
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

        // Split query string and anchor
        const queryIndex = href.indexOf("?");
        const hashIndex = href.indexOf("#");
        const splitIndex = queryIndex >= 0 && (hashIndex < 0 || queryIndex < hashIndex) ? queryIndex : hashIndex;
        const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
        href = splitIndex >= 0 ? href.slice(0, splitIndex) : href;

        if (href) {
            // Calcul absolute path for this
            href = LocationUtils.toAbsolute(href, currentDirectory, ".");

            // Resolve file
            href = resolveFile(href);

            // Convert back to relative
            href = LocationUtils.relative(currentDirectory, href);
        }

        // Add back anchor
        href = href + hash;

        $a.attr("href", href);
    });
}

export default resolveLinks;
