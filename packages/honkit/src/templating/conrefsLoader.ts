import path from "path";
import nunjucks from "nunjucks";
import fs from "../utils/fs";
import Git from "../utils/git";
import LocationUtils from "../utils/location";
import PathUtils from "../utils/path";

/**
 * Template loader resolving both:
 *      - relative url ("./test.md")
 *      - absolute url ("/test.md")
 *      - git url ("")
 *
 * @param {string} rootFolder
 * @param {Function(filePath, source)} transformFn (optional)
 * @param {Logger} logger (optional)
 */
const ConrefsLoader = nunjucks.Loader.extend({
    async: true,

    init: function (rootFolder, transformFn, logger) {
        this.rootFolder = rootFolder;
        this.transformFn = transformFn;
        this.logger = logger;
        this.git = new Git();
    },

    // @ts-expect-error: Property 'extend' does not exist on type 'typeof Loader'.
    getSource: function (sourceURL, callback) {
        const that = this;

        this.git
            .resolve(sourceURL)
            .then((filepath) => {
                // Is local file
                if (!filepath) {
                    filepath = path.resolve(sourceURL);
                } else {
                    if (that.logger) that.logger.debug.ln("resolve from git", sourceURL, "to", filepath);
                }

                // Read file from absolute path
                return fs
                    .readFile(filepath)
                    .then((source) => {
                        source = source.toString("utf8");

                        if (that.transformFn) {
                            return that.transformFn(filepath, source);
                        }

                        return source;
                    })
                    .then((source) => {
                        return {
                            src: source,
                            path: filepath,
                        };
                    });
            })
            .nodeify(callback);
    },

    resolve: function (from, to) {
        // If origin is in the book, we enforce result file to be in the book
        if (PathUtils.isInRoot(this.rootFolder, from)) {
            // Path of current template in the rootFolder (not absolute to fs)
            const fromRelative = path.relative(this.rootFolder, from);

            // Resolve "to" to a filepath relative to rootFolder
            const href = LocationUtils.toAbsolute(to, path.dirname(fromRelative), "");

            // Return absolute path

            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
            return PathUtils.resolveInRoot(this.rootFolder, href);
        }

        // If origin is in a git repository, we resolve file in the git repository
        const gitRoot = this.git.resolveRoot(from);
        if (gitRoot) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
            return PathUtils.resolveInRoot(gitRoot, to);
        }

        // If origin is not in the book (include from a git content ref)
        return path.resolve(path.dirname(from), to);
    },

    // Handle all files as relative, so that nunjucks pass responsability to 'resolve'
    isRelative: function (filename) {
        return LocationUtils.isRelative(filename);
    },
});

export default ConrefsLoader;
