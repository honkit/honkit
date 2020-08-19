// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'nunjucks'.
const nunjucks = require("nunjucks");
const DoExtension = require("nunjucks-do")(nunjucks);
const memoizeOne = require("memoize-one");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Api'.
const Api = require("../../api");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'deprecate'... Remove this comment to see the full error message
const deprecate = require("../../api/deprecate");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONUtils'... Remove this comment to see the full error message
const JSONUtils = require("../../json");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PathUtils'... Remove this comment to see the full error message
const PathUtils = require("../../utils/path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TemplateEn... Remove this comment to see the full error message
const TemplateEngine = require("../../models/templateEngine");
const templatesFolder = require("../../constants/templatesFolder");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'defaultFil... Remove this comment to see the full error message
const defaultFilters = require("../../constants/defaultFilters");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Templating... Remove this comment to see the full error message
const Templating = require("../../templating");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'listSearch... Remove this comment to see the full error message
const listSearchPaths = require("./listSearchPaths");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fileToURL'... Remove this comment to see the full error message
const fileToURL = require("../helper/fileToURL");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'resolveFil... Remove this comment to see the full error message
const resolveFileToURL = require("../helper/resolveFileToURL");

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
 * @param {String} currentFile
 * @return {TemplateEngine}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTemp... Remove this comment to see the full error message
function createTemplateEngine(output, currentFile) {
    const book = output.getBook();
    const state = output.getState();
    const i18n = state.getI18n();
    const config = book.getConfig();
    const summary = book.getSummary();
    const outputFolder = output.getRoot();

    // Search paths for templates
    const searchPaths = listSearchPaths(output);
    const tplSearchPaths = searchPaths.map(templateFolder);

    // Create loader
    const loader = new Templating.ThemesLoader(tplSearchPaths);

    // Get languages
    const language = config.getValue("language");

    // Create API context
    const context = Api.encodeGlobal(output);

    /**
     * Check if a file exists
     * @param {String} fileName
     * @return {Boolean}
     */
    function fileExists(fileName) {
        if (!fileName) {
            return false;
        }

        const filePath = PathUtils.resolveInRoot(outputFolder, fileName);
        return fs.existsSync(filePath);
    }

    /**
     * Return an article by its path
     * @param {String} filePath
     * @return {Object|undefined}
     */
    function getArticleByPath(filePath) {
        const article = summary.getByPath(filePath);
        if (!article) return undefined;

        return JSONUtils.encodeSummaryArticle(article);
    }

    /**
     * Return a page by its path
     * @param {String} filePath
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

module.exports = createTemplateEngine;
