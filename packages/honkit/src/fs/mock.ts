import path from "path";
import is from "is";

import { Buffer } from "buffer";
import Immutable from "immutable";
import FS from "../models/fs";
import error from "../utils/error";

/**
 Create a fake filesystem for unit testing HonKit.

 @param {Map<String:String|Map>}
 */

function createMockFS(files) {
    files = Immutable.fromJS(files);
    const mtime = new Date();

    function getFile(filePath) {
        const parts = path.normalize(filePath).split(path.sep);
        return parts.reduce((list, part, i) => {
            if (!list) return null;

            let file;

            if (!part || part === ".") file = list;
            else file = list.get(part);

            if (!file) return null;

            if (is.string(file)) {
                if (i === parts.length - 1) return file;
                else return null;
            }

            return file;
        }, files);
    }

    function fsExists(filePath) {
        return Boolean(getFile(filePath) !== null);
    }

    function fsReadFile(filePath) {
        const file = getFile(filePath);
        if (!is.string(file)) {
            throw error.FileNotFoundError({
                filename: filePath
            });
        }

        return Buffer.from(file, "utf8");
    }

    function fsStatFile(filePath) {
        const file = getFile(filePath);
        if (!file) {
            throw error.FileNotFoundError({
                filename: filePath
            });
        }

        return {
            mtime: mtime
        };
    }

    function fsReadDir(filePath) {
        const dir = getFile(filePath);
        if (!dir || is.string(dir)) {
            throw error.FileNotFoundError({
                filename: filePath
            });
        }

        return dir
            .map((content, name) => {
                if (!is.string(content)) {
                    name = `${name}/`;
                }

                return name;
            })
            .valueSeq();
    }

    return FS.create({
        root: "",
        fsExists: fsExists,
        fsReadFile: fsReadFile,
        fsStatFile: fsStatFile,
        fsReadDir: fsReadDir
    });
}

export default createMockFS;
