import fs from "fs";
import path from "path";
import Immutable from "immutable";
import parsers from "../parsers";

class File extends Immutable.Record({
    // Path of the file, relative to the FS
    path: String(),

    // Time when file data last modified
    mtime: Date(),
}) {
    getPath() {
        return this.get("path");
    }

    getMTime() {
        return this.get("mtime");
    }

    /**
     Does the file exists / is set

     @return {boolean}
     */

    exists() {
        return Boolean(this.getPath());
    }

    /**
     Return type of file ('markdown' or 'asciidoc')

     @return {string}
     */

    getType() {
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

    getExtension() {
        return path.extname(this.getPath()).toLowerCase();
    }

    /**
     Return parser for this file

     @return {Parser}
     */

    getParser() {
        return parsers.getByExt(this.getExtension());
    }

    /**
     Create a file from stats informations

     @param {string} filepath
     @param {Object|fs.Stats} stat
     @return {File}
     */
    static createFromStat(filepath: string, stat: fs.Stats) {
        return new File({
            path: filepath,
            mtime: stat.mtime,
        });
    }

    /**
     Create a file with only a path
     @param {string} filepath
     @return {File}
     */
    static createWithFilepath(filepath: string) {
        return new File({
            path: filepath,
        });
    }
}

export default File;
