import fs from "fs";
import path from "path";
import Immutable from "immutable";
import parsers from "../parsers";
import Parser from "./parser";

class File extends Immutable.Record({
    // Path of the file, relative to the FS
    path: String(),

    // Time when file data last modified
    mtime: Date()
}) {
    getPath(): string {
        return this.get("path");
    }

    getMTime(): Date {
        return this.get("mtime");
    }

    /**
     Does the file exists / is set

     @return {boolean}
     */

    exists(): boolean {
        return Boolean(this.getPath());
    }

    /**
     Return type of file ('markdown' or 'asciidoc')

     @return {string}
     */
    getType(): string {
        const parser = this.getParser();
        if (parser) {
            return parser.getName();
        } else {
            return undefined;
        }
    }

    /**
     Return extension of this file (lowercased)

     @return {string}
     */
    getExtension(): string {
        return path.extname(this.getPath()).toLowerCase();
    }

    /**
     Return parser for this file

     @return {Parsers}
     */
    getParser(): Parser {
        return parsers.getByExt(this.getExtension());
    }

    /**
     Return basedirectory of this file
     @return {string}
     */
    getBaseDirectory(): string {
        return path.dirname(this.getPath());
    }

    /**
     Create a file from stats informations

     @param {string} filepath
     @param {Object|fs.Stats} stat
     @return {File}
     */
    static createFromStat(filepath: string, stat: fs.Stats): File {
        return new File({
            path: filepath,
            mtime: stat.mtime
        });
    }

    /**
     Create a file with only a path
     @param {string} filepath
     @return {File}
     */
    static createWithFilepath(filepath: string): File {
        return new File({
            path: filepath
        });
    }
}

export default File;
