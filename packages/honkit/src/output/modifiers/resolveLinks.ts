import path from "path";
import url from "url";
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

        // Split anchor
        const parsed = url.parse(href);
        href = parsed.pathname || "";

        if (href) {
            // Pages are keyed by their real file name, not the encoded one (my%20page.md)
            const encoded = href;
            try {
                href = decodeURI(href);
            } catch {
                // keep malformed hrefs as they are
            }
            const wasEncoded = href !== encoded;

            // Calcul absolute path for this
            href = LocationUtils.toAbsolute(href, currentDirectory, ".");

            // Resolve file
            href = resolveFile(href);

            // Convert back to relative
            href = LocationUtils.relative(currentDirectory, href);

            if (wasEncoded) {
                href = encodeURI(href);
            }
        }

        // Add back anchor
        href = href + (parsed.hash || "");

        $a.attr("href", href);
    });
}

export default resolveLinks;
