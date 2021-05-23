import path from "path";
import nunjucks from "nunjucks";
import nunjucks_do from "nunjucks-do";
const DoExtension = nunjucks_do(nunjucks);
import memoizeOne from "memoize-one";
import Api from "../../api";
import deprecate from "../../api/deprecate";
import JSONUtils from "../../json";
import LocationUtils from "../../utils/location";
import fs from "../../utils/fs";
import PathUtils from "../../utils/path";
import TemplateEngine from "../../models/templateEngine";
import templatesFolder from "../../constants/templatesFolder";
import defaultFilters from "../../constants/defaultFilters";
import Templating from "../../templating";
import listSearchPaths from "./listSearchPaths";
import fileToURL from "../helper/fileToURL";

import resolveFileToURL from "../helper/resolveFileToURL";
import Output from "../../models/output";

/**
 * Directory for a theme with the templates
 */
function templateFolder(dir) {
    return path.join(dir, templatesFolder);
}

/**
 * Create templating engine to render themes
 *
 * @param {Output} output
 * @param {string} currentFile
 * @return {TemplateEngine}
 */

function createTemplateEngine(output: Output, currentFile: string): TemplateEngine {
    const book = output.getBook();
    const state = output.getState();
    // @ts-expect-error: state type
    const i18n = state.getI18n();
    const config = book.getConfig();
    const summary = book.getSummary();
    const outputFolder = output.getRoot();

    // Search paths for templates
    const searchPaths = listSearchPaths(output);
    const tplSearchPaths = searchPaths.map(templateFolder);

    // Create loader
    // @ts-expect-error: Expected 0 arguments, but got 1.
    const loader = new Templating.ThemesLoader(tplSearchPaths);

    // Get languages
    const language = config.getValue("language");

    // Create API context
    const context = Api.encodeGlobal(output);

    /**
     * Check if a file exists
     * @param {string} fileName
     * @return {boolean}
     */
    function fileExists(fileName) {
        if (!fileName) {
            return false;
        }

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        const filePath = PathUtils.resolveInRoot(outputFolder, fileName);
        return fs.existsSync(filePath);
    }

    /**
     * Return an article by its path
     * @param {string} filePath
     * @return {Object|undefined}
     */
    function getArticleByPath(filePath) {
        const article = summary.getByPath(filePath);
        if (!article) return undefined;

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        return JSONUtils.encodeSummaryArticle(article);
    }

    /**
     * Return a page by its path
     * @param {string} filePath
     * @return {Object|undefined}
     */
    function getPageByPath(filePath) {
        const page = output.getPage(filePath);
        if (!page) return undefined;

        return JSONUtils.encodePage(page, summary);
    }

    return TemplateEngine.create({
        loader: loader,

        context: context,

        globals: {
            getArticleByPath: memoizeOne(getArticleByPath),
            getPageByPath: memoizeOne(getPageByPath),
            fileExists: fileExists,
        },

        filters: defaultFilters.merge({
            /**
             * Translate a sentence
             */
            t: function t(s) {
                return i18n.t(language, s);
            },

            /**
             * Resolve an absolute file path into a
             * relative path.
             * it also resolve pages
             */
            resolveFile: function (filePath) {
                filePath = resolveFileToURL(output, filePath);
                return LocationUtils.relativeForFile(currentFile, filePath);
            },

            resolveAsset: function (filePath) {
                filePath = LocationUtils.toAbsolute(filePath, "", "");
                filePath = path.join("gitbook", filePath);
                filePath = LocationUtils.relativeForFile(currentFile, filePath);

                // Use assets from parent if language book
                if (book.isLanguageBook()) {
                    filePath = path.join("../", filePath);
                }

                return LocationUtils.normalize(filePath);
            },

            fileExists: deprecate.method(
                book,
                "fileExists",
                fileExists,
                'Filter "fileExists" is deprecated, use "fileExists(filename)" '
            ),
            getArticleByPath: deprecate.method(
                book,
                "getArticleByPath",
                fileExists,
                'Filter "getArticleByPath" is deprecated, use "getArticleByPath(filename)" '
            ),

            contentURL: function (filePath) {
                return fileToURL(output, filePath);
            },
        }),

        extensions: {
            DoExtension: new DoExtension(),
        },
    });
}

export default createTemplateEngine;
