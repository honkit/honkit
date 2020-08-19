// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PathUtils'... Remove this comment to see the full error message
const PathUtils = require("../utils/path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../utils/fs");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Plugins'.
const Plugins = require("../plugins");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'deprecate'... Remove this comment to see the full error message
const deprecate = require("./deprecate");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fileToURL'... Remove this comment to see the full error message
const fileToURL = require("../output/helper/fileToURL");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'defaultBlo... Remove this comment to see the full error message
const defaultBlocks = require("../constants/defaultBlocks");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'honkit'.
const honkit = require("../honkit");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parsers'.
const parsers = require("../parsers");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeConf... Remove this comment to see the full error message
const encodeConfig = require("./encodeConfig");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeSumm... Remove this comment to see the full error message
const encodeSummary = require("./encodeSummary");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeNavi... Remove this comment to see the full error message
const encodeNavigation = require("./encodeNavigation");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodePage... Remove this comment to see the full error message
const encodePage = require("./encodePage");

/**
    Encode a global context into a JS object
    It's the context for page's hook, etc

    @param {Output} output
    @return {Object}
*/
function encodeGlobal(output) {
    const book = output.getBook();
    const bookFS = book.getContentFS();
    const logger = output.getLogger();
    const outputFolder = output.getRoot();
    const plugins = output.getPlugins();
    const blocks = Plugins.listBlocks(plugins);

    const result = {
        log: logger,
        config: encodeConfig(output, book.getConfig()),
        summary: encodeSummary(output, book.getSummary()),

        /**
            Check if the book is a multilingual book

            @return {Boolean}
        */
        isMultilingual: function () {
            return book.isMultilingual();
        },

        /**
            Check if the book is a language book for a multilingual book

            @return {Boolean}
        */
        isLanguageBook: function () {
            return book.isLanguageBook();
        },

        /**
            Read a file from the book

            @param {String} fileName
            @return {Promise<Buffer>}
        */
        readFile: function (fileName) {
            return bookFS.read(fileName);
        },

        /**
            Read a file from the book as a string

            @param {String} fileName
            @return {Promise<String>}
        */
        readFileAsString: function (fileName) {
            return bookFS.readAsString(fileName);
        },

        /**
            Resolve a file from the book root

            @param {String} fileName
            @return {String}
        */
        resolve: function (fileName) {
            return path.resolve(book.getContentRoot(), fileName);
        },

        /**
            Resolve a page by it path

            @param {String} filePath
            @return {String}
        */
        getPageByPath: function (filePath) {
            const page = output.getPage(filePath);
            if (!page) return undefined;

            return encodePage(output, page);
        },

        /**
            Render a block of text (markdown/asciidoc)

            @param {String} type
            @param {String} text
            @return {Promise<String>}
        */
        renderBlock: function (type, text) {
            const parser = parsers.get(type);

            return parser.parsePage(text).get("content");
        },

        /**
            Render an inline text (markdown/asciidoc)

            @param {String} type
            @param {String} text
            @return {Promise<String>}
        */
        renderInline: function (type, text) {
            const parser = parsers.get(type);

            return parser.parseInline(text).get("content");
        },

        template: {
            /**
                Apply a templating block and returns its result

                @param {String} name
                @param {Object} blockData
                @return {Promise|Object}
            */
            applyBlock: function (name, blockData) {
                const block = blocks.get(name) || defaultBlocks.get(name);
                // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
                return Promise(block.applyBlock(blockData, result));
            },
        },

        output: {
            /**
                Name of the generator being used
                {String}
            */
            name: output.getGenerator(),

            /**
                Return absolute path to the root folder of output
                @return {String}
            */
            root: function () {
                return outputFolder;
            },

            /**
                Resolve a file from the output root

                @param {String} fileName
                @return {String}
            */
            resolve: function (fileName) {
                return path.resolve(outputFolder, fileName);
            },

            /**
                Convert a filepath into an url
                @return {String}
            */
            toURL: function (filePath) {
                return fileToURL(output, filePath);
            },

            /**
                Check that a file exists.

                @param {String} fileName
                @return {Promise}
            */
            hasFile: function (fileName, content) {
                // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
                return Promise().then(() => {
                    const filePath = PathUtils.resolveInRoot(outputFolder, fileName);

                    return fs.exists(filePath);
                });
            },

            /**
                Write a file to the output folder,
                It creates the required folder

                @param {String} fileName
                @param {Buffer} content
                @return {Promise}
            */
            writeFile: function (fileName, content) {
                // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
                return Promise().then(() => {
                    const filePath = PathUtils.resolveInRoot(outputFolder, fileName);

                    return fs.ensureFile(filePath).then(() => {
                        return fs.writeFile(filePath, content);
                    });
                });
            },

            /**
                Copy a file to the output folder
                It creates the required folder.

                @param {String} inputFile
                @param {String} outputFile
                @param {Buffer} content
                @return {Promise}
            */
            copyFile: function (inputFile, outputFile, content) {
                // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
                return Promise().then(() => {
                    const outputFilePath = PathUtils.resolveInRoot(outputFolder, outputFile);

                    return fs.ensureFile(outputFilePath).then(() => {
                        return fs.copy(inputFile, outputFilePath);
                    });
                });
            },
        },

        gitbook: {
            version: honkit.version,
        },
    };

    // Deprecated properties

    deprecate.renamedMethod(output, "this.isSubBook", result, "isSubBook", "isLanguageBook");
    deprecate.renamedMethod(output, "this.contentLink", result, "contentLink", "output.toURL");

    deprecate.field(
        output,
        "this.generator",
        result,
        "generator",
        output.getGenerator(),
        '"this.generator" property is deprecated, use "this.output.name" instead'
    );

    deprecate.field(
        output,
        "this.navigation",
        result,
        "navigation",
        () => {
            return encodeNavigation(output);
        },
        '"navigation" property is deprecated'
    );

    deprecate.field(
        output,
        "this.book",
        result,
        "book",
        result,
        '"book" property is deprecated, use "this" directly instead'
    );

    deprecate.field(
        output,
        "this.options",
        result,
        "options",
        result.config.values,
        '"options" property is deprecated, use config.get(key) instead'
    );

    return result;
}

module.exports = encodeGlobal;
