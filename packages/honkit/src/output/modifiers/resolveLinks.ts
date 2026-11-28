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
            const absolute = LocationUtils.toAbsolute(href, currentDirectory, ".");
            let resolved = resolveFile(absolute);

            // Pages are keyed by their real file name, not the encoded one (my%20page.md).
            // Look the decoded name up only when the encoded one is not a page,
            // so links to other files keep their escapes as written.
            const decoded = decodePathname(href);
            if (decoded !== href && LocationUtils.areIdenticalPaths(resolved, absolute)) {
                const decodedAbsolute = LocationUtils.toAbsolute(decoded, currentDirectory, ".");
                const decodedResolved = resolveFile(decodedAbsolute);
                if (!LocationUtils.areIdenticalPaths(decodedResolved, decodedAbsolute)) {
                    resolved = encodePathname(decodedResolved);
                }
            }

            // Convert back to relative
            href = LocationUtils.relative(currentDirectory, resolved);
        }

        // Add back anchor
        href = href + (parsed.hash || "");

        $a.attr("href", href);
    });
}

/**
 * Decode each segment of a pathname: "my%20page.md" -> "my page.md"
 * Returns the pathname as it is when it is malformed,
 * or when a decoded segment would add a path separator (%2F).
 */
function decodePathname(pathname: string): string {
    try {
        const segments = pathname.split("/").map((segment) => decodeURIComponent(segment));
        return segments.some((segment) => /[\\/]/.test(segment)) ? pathname : segments.join("/");
    } catch {
        return pathname;
    }
}

function encodePathname(pathname: string): string {
    return pathname.split("/").map(encodeURIComponent).join("/");
}

export default resolveLinks;
