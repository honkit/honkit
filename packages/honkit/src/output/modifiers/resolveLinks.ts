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
            const resolved = resolveFile(absolute);

            // Pages are keyed by their real file name, not the encoded one (my%20page.md).
            // Look the decoded name up only when the name as written is not a page,
            // so links to other files keep their escapes as written.
            const page = LocationUtils.areIdenticalPaths(resolved, absolute)
                ? resolveEncodedPage(href, currentDirectory, resolveFile)
                : undefined;

            // Convert back to relative
            href =
                page === undefined
                    ? LocationUtils.relative(currentDirectory, resolved)
                    : encodePathname(LocationUtils.relative(currentDirectory, page));
        }

        // Add back anchor
        href = href + (parsed.hash || "");

        $a.attr("href", href);
    });
}

/**
 * Resolve an encoded pathname to a page: "my%20page.md" -> "my page.html"
 * Returns undefined when the pathname is not encoded, or when the decoded file is not a page.
 */
function resolveEncodedPage(pathname: string, currentDirectory: string, resolveFile): string | undefined {
    const decoded = decodePathname(pathname);
    if (decoded === pathname) {
        return undefined;
    }

    // The decoded pathname is a file path, not a URL: a ":" in it is not a scheme (API%3Asetup.md)
    const file = LocationUtils.normalize(
        decoded.startsWith("/") ? LocationUtils.normalize(decoded).slice(1) : path.join(currentDirectory, decoded)
    );
    const resolved = resolveFile(file);
    return LocationUtils.areIdenticalPaths(resolved, file) ? undefined : resolved;
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
