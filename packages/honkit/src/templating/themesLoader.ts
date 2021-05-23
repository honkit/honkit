import Immutable from "immutable";
import nunjucks from "nunjucks";
import fs from "fs";
import path from "path";
import PathUtils from "../utils/path";

const ThemesLoader = nunjucks.Loader.extend({
    // @ts-expect-error: Property 'extend' does not exist on type 'typeof Loader'.
    init: function (searchPaths) {
        this.searchPaths = Immutable.List(searchPaths).map(path.normalize);
    },

    /**
     * Read source of a resolved filepath
     * @param {string}
     * @return {Object}
     */
    getSource: function (fullpath) {
        if (!fullpath) return null;

        fullpath = this.resolve(null, fullpath);
        const templateName = this.getTemplateName(fullpath);

        if (!fullpath) {
            return null;
        }

        let src = fs.readFileSync(fullpath, "utf-8");

        src = `{% do %}var template = template || {}; template.stack = template.stack || []; template.stack.push(template.self); template.self = ${JSON.stringify(
            templateName
        )}{% enddo %}\n${src}\n{% do %}template.self = template.stack.pop();{% enddo %}`;

        return {
            src: src,
            path: fullpath,
            noCache: true,
        };
    },

    /**
     * Nunjucks calls "isRelative" to determine when to call "resolve".
     * We handle absolute paths ourselves in ".resolve" so we always return true
     */
    isRelative: function () {
        return true;
    },

    /**
     * Get original search path containing a template
     * @param {string} filepath
     * @return {string} searchPath
     */
    getSearchPath: function (filepath) {
        return this.searchPaths
            .sortBy((s) => {
                return -s.length;
            })
            .find((basePath) => {
                return filepath && filepath.indexOf(basePath) === 0;
            });
    },

    /**
     * Get template name from a filepath
     * @param {string} filepath
     * @return {string} name
     */
    getTemplateName: function (filepath) {
        const originalSearchPath = this.getSearchPath(filepath);
        return originalSearchPath ? path.relative(originalSearchPath, filepath) : null;
    },

    /**
     * Resolve a template from a current template
     * @param {String|null} from
     * @param {string} to
     * @return {String|null}
     */
    resolve: function (from, to) {
        let searchPaths = this.searchPaths;

        // Relative template like "./test.html"
        if (PathUtils.isPureRelative(to) && from) {
            return path.resolve(path.dirname(from), to);
        }

        // Determine in which search folder we currently are
        const originalSearchPath = this.getSearchPath(from);
        const originalFilename = this.getTemplateName(from);

        // If we are including same file from a different search path
        // Slice the search paths to avoid including from previous ones
        if (originalFilename == to) {
            const currentIndex = searchPaths.indexOf(originalSearchPath);
            searchPaths = searchPaths.slice(currentIndex + 1);
        }

        // Absolute template to resolve in root folder
        const resultFolder = searchPaths.find((basePath) => {
            const p = path.resolve(basePath, to);

            return p.indexOf(basePath) === 0 && fs.existsSync(p);
        });
        if (!resultFolder) return null;
        return path.resolve(resultFolder, to);
    },
});

export default ThemesLoader;
