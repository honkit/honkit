// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FS'.
const FS = require("../models/fs");

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

module.exports = function createNodeFS(root) {
    return FS.create({
        root: root,

        fsExists: fs.exists,
        fsReadFile: fs.readFile,
        fsStatFile: fs.stat,
        fsReadDir: fsReadDir,
        fsLoadObject: fsLoadObject,
        fsReadAsStream: fs.readStream,
    });
};
