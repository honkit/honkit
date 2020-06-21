import fs from "fs";
import mkdirp from "mkdirp";
import destroy from "destroy";
import tmp from "tmp";
import request from "request";
import path from "path";
import cp from "cp";
import cpr from "cpr";

import Promise from "./promise";

// Write a stream to a file
function writeStream(filename, st) {
    const d = Promise.defer();

    const wstream = fs.createWriteStream(filename);
    const cleanup = function () {
        destroy(wstream);
        wstream.removeAllListeners();
    };

    wstream.on("finish", () => {
        cleanup();
        d.resolve();
    });
    wstream.on("error", (err) => {
        cleanup();
        d.reject(err);
    });

    st.on("error", (err) => {
        cleanup();
        d.reject(err);
    });

    st.pipe(wstream);

    return d.promise;
}

// Return a promise resolved with a boolean
function fileExists(filename) {
    const d = Promise.defer();

    fs.stat(filename, (error) => {
        if (error) {
            d.resolve(false);
        } else {
            d.resolve(true);
        }
    });

    return d.promise;
}

// Generate temporary file
function genTmpFile(opts) {
    return Promise.nfcall(tmp.file, opts).get(0);
}

// Generate temporary dir
function genTmpDir(opts) {
    return Promise.nfcall(tmp.dir, opts).get(0);
}

// Download an image
function download(uri, dest) {
    return writeStream(dest, request(uri));
}

// Find a filename available in a folder
function uniqueFilename(base, filename) {
    const ext = path.extname(filename);
    filename = path.resolve(base, filename);
    filename = path.join(path.dirname(filename), path.basename(filename, ext));

    let _filename = filename + ext;

    let i = 0;
    while (fs.existsSync(filename)) {
        _filename = `${filename}_${i}${ext}`;
        i = i + 1;
    }

    return Promise(path.relative(base, _filename));
}

// Create all required folder to create a file
function ensureFile(filename) {
    const base = path.dirname(filename);
    return Promise(mkdirp(base));
}

// Remove a folder
function rmDir(base) {
    return Promise.nfcall(fs.rmdir, base, {
        recursive: true,
    });
}

/**
 Assert a file, if it doesn't exist, call "generator"

 @param {String} filePath
 @param {Function} generator
 @return {Promise}
 */
function assertFile(filePath, generator) {
    return fileExists(filePath).then((exists) => {
        if (exists) return;

        return generator();
    });
}

/**
 Pick a file, returns the absolute path if exists, undefined otherwise

 @param {String} rootFolder
 @param {String} fileName
 @return {String}
 */
function pickFile(rootFolder, fileName) {
    const result = path.join(rootFolder, fileName);
    if (fs.existsSync(result)) {
        return result;
    }

    return undefined;
}

/**
 Ensure that a directory exists and is empty

 @param {String} folder
 @return {Promise}
 */
function ensureFolder(rootFolder) {
    return rmDir(rootFolder)
        .fail(() => {
            return Promise();
        })
        .then(() => {
            return Promise(mkdirp(rootFolder));
        });
}

export default {
    exists: fileExists,
    existsSync: fs.existsSync,
    mkdirp: mkdirp,
    readFile: Promise.nfbind(fs.readFile),
    writeFile: (filePath, content) => {
        const d = Promise.defer();
        fs.writeFile(filePath, content, (error) => {
            if (error) {
                d.reject(error);
            } else {
                d.resolve();
            }
        });
        return d.promise;
    },
    assertFile: assertFile,
    pickFile: pickFile,
    stat: Promise.nfbind(fs.lstat),
    statSync: fs.lstatSync,
    readdir: Promise.nfbind(fs.readdir),
    writeStream: writeStream,
    readStream: fs.createReadStream,
    copy: Promise.nfbind(cp),
    copyDir: Promise.nfbind(cpr),
    tmpFile: genTmpFile,
    tmpDir: genTmpDir,
    download: download,
    uniqueFilename: uniqueFilename,
    ensureFile: ensureFile,
    ensureFolder: ensureFolder,
    rmDir: rmDir,
};
