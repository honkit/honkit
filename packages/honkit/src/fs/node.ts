import path from "path";
import Immutable from "immutable";
import fs from "../utils/fs";
import FS from "../models/fs";

function fsReadDir(folder) {
    return fs.readdir(folder).then((files) => {
        files = Immutable.List(files);

        return files
            .map((file) => {
                if (file === "." || file === "..") return;

                const stat = fs.statSync(path.join(folder, file));
                if (stat.isSymbolicLink()) {
                    return;
                }
                if (stat.isDirectory()) file = file + path.sep;
                return file;
            })
            .filter((file) => {
                return Boolean(file);
            });
    });
}

function fsLoadObject(filename) {
    return require(filename);
}

export default function createNodeFS(root) {
    return FS.create({
        root: root,

        fsExists: fs.exists,
        fsReadFile: fs.readFile,
        fsStatFile: fs.stat,
        fsReadDir: fsReadDir,
        fsLoadObject: fsLoadObject,
        fsReadAsStream: fs.readStream
    });
}
