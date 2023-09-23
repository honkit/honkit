import path from "path";
import Immutable from "immutable";
import Logger from "../utils/logger";
import FS from "./fs";
import Config from "./config";
import Readme from "./readme";
import Summary from "./summary";
import Glossary from "./glossary";
import Languages from "./languages";
import Ignore from "./ignore";

class Book extends Immutable.Record({
    // Logger for outptut message

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
    logger: Logger(),

    // Filesystem binded to the book scope to read files/directories
    fs: new FS(),

    // Ignore files parser
    ignore: new Ignore(),

    // Structure files
    config: new Config(),
    readme: new Readme(),
    summary: new Summary(),
    glossary: new Glossary(),
    languages: new Languages(),

    // ID of the language for language books
    language: String(),

    // List of children, if multilingual (String -> Book)
    books: Immutable.OrderedMap()
}) {
    getLogger() {
        return this.get("logger");
    }

    getFS(): FS {
        return this.get("fs");
    }

    getIgnore(): Ignore {
        return this.get("ignore");
    }

    getConfig(): Config {
        return this.get("config");
    }

    getReadme(): Readme {
        return this.get("readme");
    }

    getSummary(): Summary {
        return this.get("summary");
    }

    getGlossary(): Glossary {
        return this.get("glossary");
    }

    getLanguages(): Languages {
        return this.get("languages");
    }

    getBooks() {
        return this.get("books");
    }

    getLanguage() {
        return this.get("language");
    }

    /**
     Return FS instance to access the content

     @return {FS}
     */
    getContentFS(): FS {
        const fs = this.getFS();
        const config = this.getConfig();
        const rootFolder = config.getValue("root");

        if (rootFolder) {
            return FS.reduceScope(fs, rootFolder);
        }

        return fs;
    }

    /**
     Return root of the book

     @return {string}
     */
    getRoot() {
        const fs = this.getFS();
        return fs.getRoot();
    }

    /**
     Return root for content of the book

     @return {string}
     */
    getContentRoot() {
        const fs = this.getContentFS();
        return fs.getRoot();
    }

    /**
     Check if a file is ignore (should not being parsed, etc)

     @param {string} ref
     @return {Page|undefined}
     */
    isFileIgnored(filename) {
        const ignore = this.getIgnore();
        const language = this.getLanguage();

        // Ignore is always relative to the root of the main book
        if (language) {
            filename = path.join(language, filename);
        }

        return ignore.isFileIgnored(filename);
    }

    /**
     Check if a content file is ignore (should not being parsed, etc)

     @param {string} ref
     @return {Page|undefined}
     */
    isContentFileIgnored(filename) {
        const config = this.getConfig();
        const rootFolder = config.getValue("root");

        if (rootFolder) {
            filename = path.join(rootFolder, filename);
        }

        return this.isFileIgnored(filename);
    }

    /**
     Is this book the parent of language's books

     @return {boolean}
     */
    isMultilingual() {
        return this.getLanguages().getCount() > 0;
    }

    /**
     Return true if book is associated to a language

     @return {boolean}
     */
    isLanguageBook() {
        return Boolean(this.getLanguage());
    }

    /**
     Return a languages book

     @param {string} language
     @return {Book}
     */
    getLanguageBook(language) {
        const books = this.getBooks();
        return books.get(language);
    }

    /**
     Add a new language book

     @param {string} language
     @param {Book} book
     @return {Book}
     */
    addLanguageBook(language, book) {
        let books = this.getBooks();
        books = books.set(language, book);

        return this.set("books", books);
    }

    /**
     Set the summary for this book

     @param {Summary}
     @return {Book}
     */
    setSummary(summary) {
        return this.set("summary", summary);
    }

    /**
     Set the readme for this book

     @param {Readme}
     @return {Book}
     */
    setReadme(readme) {
        return this.set("readme", readme);
    }

    /**
     Set the configuration for this book

     @param {Config}
     @return {Book}
     */
    setConfig(config) {
        return this.set("config", config);
    }

    /**
     Set the ignore instance for this book

     @param {Ignore}
     @return {Book}
     */
    setIgnore(ignore) {
        return this.set("ignore", ignore);
    }

    /**
     Change log level

     @param {string} level
     @return {Book}
     */
    setLogLevel(level) {
        this.getLogger().setLevel(level);
        return this;
    }

    /**
     Create a book using a filesystem

     @param {FS} fs
     @return {Book}
     */
    static createForFS(fs) {
        return new Book({
            fs: fs
        });
    }

    /**
     Infers the default extension for files
     @return {string}
     */
    getDefaultExt() {
        // Inferring sources
        const clues = [this.getReadme(), this.getSummary(), this.getGlossary()];

        // List their extensions
        const exts = clues.map((clue) => {
            const file = clue.getFile();
            if (file.exists()) {
                return file.getParser().getExtensions().first();
            } else {
                return null;
            }
        });
        // Adds the general default extension
        exts.push(".md");

        // Choose the first non null
        return exts.find((e) => {
            return e !== null;
        });
    }

    /**
     Infer the default path for a Readme.
     @param {boolean} [absolute=false] False for a path relative to
     this book's content root
     @return {string}
     */
    getDefaultReadmePath(absolute) {
        const defaultPath = `README${this.getDefaultExt()}`;
        if (absolute) {
            return path.join(this.getContentRoot(), defaultPath);
        } else {
            return defaultPath;
        }
    }

    /**
     Infer the default path for a Summary.
     @param {boolean} [absolute=false] False for a path relative to
     this book's content root
     @return {string}
     */
    getDefaultSummaryPath(absolute) {
        const defaultPath = `SUMMARY${this.getDefaultExt()}`;
        if (absolute) {
            return path.join(this.getContentRoot(), defaultPath);
        } else {
            return defaultPath;
        }
    }

    /**
     Infer the default path for a Glossary.
     @param {boolean} [absolute=false] False for a path relative to
     this book's content root
     @return {string}
     */
    getDefaultGlossaryPath(absolute) {
        const defaultPath = `GLOSSARY${this.getDefaultExt()}`;
        if (absolute) {
            return path.join(this.getContentRoot(), defaultPath);
        } else {
            return defaultPath;
        }
    }

    /**
     Create a language book from a parent

     @param {Book} parent
     @param {string} language
     @return {Book}
     */

    static createFromParent(parent, language) {
        const ignore = parent.getIgnore();
        let config = parent.getConfig();

        // Set language in configuration
        config = config.setValue("language", language);

        return new Book({
            // Inherits config. logegr and list of ignored files
            logger: parent.getLogger(),
            config: config,
            ignore: ignore,

            language: language,

            fs: FS.reduceScope(parent.getContentFS(), language)
        });
    }
}

export default Book;
