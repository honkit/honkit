import path from "path";
import Promise from "../utils/promise";
import PathUtils from "../utils/path";
import fs from "../utils/fs";
import Plugins from "../plugins";
import deprecate from "./deprecate";
import fileToURL from "../output/helper/fileToURL";
import defaultBlocks from "../constants/defaultBlocks";
import honkit from "../honkit";
import parsers from "../parsers";
import encodeConfig from "./encodeConfig";
import encodeSummary from "./encodeSummary";
import encodeNavigation from "./encodeNavigation";
import encodePage from "./encodePage";
import { ParserOptions } from "../models/parser";

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

         @return {boolean}
         */
        isMultilingual: function () {
            return book.isMultilingual();
        },

        /**
         Check if the book is a language book for a multilingual book

         @return {boolean}
         */
        isLanguageBook: function () {
            return book.isLanguageBook();
        },

        /**
         Read a file from the book

         @param {string} fileName
         @return {Promise<Buffer>}
         */
        readFile: function (fileName) {
            return bookFS.read(fileName);
        },

        /**
         Read a file from the book as a string

         @param {string} fileName
         @return {Promise<String>}
         */
        readFileAsString: function (fileName) {
            return bookFS.readAsString(fileName);
        },

        /**
         Resolve a file from the book root

         @param {string} fileName
         @return {string}
         */
        resolve: function (fileName) {
            return path.resolve(book.getContentRoot(), fileName);
        },

        /**
         Resolve a page by it path

         @param {string} filePath
         @return {string}
         */
        getPageByPath: function (filePath) {
            const page = output.getPage(filePath);
            if (!page) return undefined;

            return encodePage(output, page);
        },

        /**
         Render a block of text (markdown/asciidoc)

         @param {string} type
         @param {string} text
         @param options
         @return {Promise<String>}
         */
        renderBlock: function (type: string, text: string, options: ParserOptions) {
            const parser = parsers.get(type);

            return parser.parsePage(text, options).get("content");
        },

        /**
         Render an inline text (markdown/asciidoc)

         @param {string} type
         @param {string} text
         @param options
         @return {Promise<String>}
         */
        renderInline: function (type: string, text: string, options: ParserOptions) {
            const parser = parsers.get(type);

            return parser.parseInline(text, options).get("content");
        },

        template: {
            /**
             Apply a templating block and returns its result

             @param {string} name
             @param {Object} blockData
             @return {Promise|Object}
             */
            applyBlock: function (name, blockData) {
                const block = blocks.get(name) || defaultBlocks.get(name);

                return Promise(block.applyBlock(blockData, result));
            }
        },

        output: {
            /**
             Name of the generator being used
             {string}
             */
            name: output.getGenerator(),

            /**
             Return absolute path to the root folder of output
             @return {string}
             */
            root: function () {
                return outputFolder;
            },

            /**
             Resolve a file from the output root

             @param {string} fileName
             @return {string}
             */
            resolve: function (fileName) {
                return path.resolve(outputFolder, fileName);
            },

            /**
             Convert a filepath into an url
             @return {string}
             */
            toURL: function (filePath) {
                return fileToURL(output, filePath);
            },

            /**
             Check that a file exists.

             @param {string} fileName
             @return {Promise}
             */
            hasFile: function (fileName, content) {
                return Promise().then(() => {
                    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
                    const filePath = PathUtils.resolveInRoot(outputFolder, fileName);

                    return fs.exists(filePath);
                });
            },

            /**
             Write a file to the output folder,
             It creates the required folder

             @param {string} fileName
             @param {Buffer} content
             @return {Promise}
             */
            writeFile: function (fileName, content) {
                return Promise().then(() => {
                    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
                    const filePath = PathUtils.resolveInRoot(outputFolder, fileName);

                    return fs.ensureFile(filePath).then(() => {
                        return fs.writeFile(filePath, content);
                    });
                });
            },

            /**
             Copy a file to the output folder
             It creates the required folder.

             @param {string} inputFile
             @param {string} outputFile
             @param {Buffer} content
             @return {Promise}
             */
            copyFile: function (inputFile, outputFile, content) {
                return Promise().then(() => {
                    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
                    const outputFilePath = PathUtils.resolveInRoot(outputFolder, outputFile);

                    return fs.ensureFile(outputFilePath).then(() => {
                        return fs.copy(inputFile, outputFilePath);
                    });
                });
            }
        },

        gitbook: {
            version: honkit.version
        },
        honkit: {
            version: honkit.version
        }
    };

    // Deprecated properties

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 6 arguments, but got 5.
    deprecate.renamedMethod(output, "this.isSubBook", result, "isSubBook", "isLanguageBook");

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 6 arguments, but got 5.
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

export default encodeGlobal;
