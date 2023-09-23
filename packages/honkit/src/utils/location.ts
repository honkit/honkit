import url from "url";
import path from "path";

// Is the url an external url
function isExternal(href) {
    try {
        return Boolean(url.parse(href).protocol) && !isDataURI(href);
    } catch (err) {
        return false;
    }
}

// Is the url an iniline data-uri
function isDataURI(href) {
    try {
        return Boolean(url.parse(href).protocol) && url.parse(href).protocol === "data:";
    } catch (err) {
        return false;
    }
}

// Inverse of isExternal
function isRelative(href) {
    return !isExternal(href);
}

// Return true if the link is an achor
function isAnchor(href) {
    try {
        const parsed = url.parse(href);
        return !!(!parsed.protocol && !parsed.path && parsed.hash);
    } catch (err) {
        return false;
    }
}

// Normalize a path to be a link
function normalize(s) {
    return path.normalize(s).replace(/\\/g, "/");
}

/**
 * Flatten a path, it removes the leading "/"
 *
 * @param {string} href
 * @return {string}
 */
function flatten(href) {
    href = normalize(href);
    if (href[0] == "/") {
        href = normalize(href.slice(1));
    }

    return href;
}

/**
 * Convert a relative path to absolute
 *
 * @param {string} _href
 * @param {string} dir: directory parent of the file currently in rendering process
 * @param {string} outdir: directory parent from the html output
 * @return {string}
 */
function toAbsolute(_href, dir, outdir) {
    if (isExternal(_href) || isDataURI(_href)) {
        return _href;
    }

    outdir = outdir == undefined ? dir : outdir;

    _href = normalize(_href);
    dir = normalize(dir);
    outdir = normalize(outdir);

    // Path "_href" inside the base folder
    let hrefInRoot = normalize(path.join(dir, _href));
    if (_href[0] == "/") {
        hrefInRoot = normalize(_href.slice(1));
    }

    // Make it relative to output
    _href = path.relative(outdir, hrefInRoot);

    // Normalize windows paths
    _href = normalize(_href);

    return _href;
}

/**
 * Convert an absolute path to a relative path for a specific folder (dir)
 * ('test/', 'hello.md') -> '../hello.md'
 *
 * @param {string} dir: current directory
 * @param {string} file: absolute path of file
 * @return {string}
 */
function relative(dir, file) {
    const isDirectory = file.slice(-1) === "/";
    return normalize(path.relative(dir, file)) + (isDirectory ? "/" : "");
}

/**
 * Convert an absolute path to a relative path for a specific folder (dir)
 * ('test/test.md', 'hello.md') -> '../hello.md'
 *
 * @param {string} baseFile: current file
 * @param {string} file: absolute path of file
 * @return {string}
 */
function relativeForFile(baseFile, file) {
    return relative(path.dirname(baseFile), file);
}

/**
 * Compare two paths, return true if they are identical
 * ('README.md', './README.md') -> true
 *
 * @param {string} p1: first path
 * @param {string} p2: second path
 * @return {boolean}
 */
function areIdenticalPaths(p1, p2) {
    return normalize(p1) === normalize(p2);
}

export default {
    areIdenticalPaths: areIdenticalPaths,
    isDataURI: isDataURI,
    isExternal: isExternal,
    isRelative: isRelative,
    isAnchor: isAnchor,
    normalize: normalize,
    toAbsolute: toAbsolute,
    relative: relative,
    relativeForFile: relativeForFile,
    flatten: flatten
};
