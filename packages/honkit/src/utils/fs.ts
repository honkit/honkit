// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("fs");
const mkdirp = require("mkdirp");
const destroy = require("destroy");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tmp'.
const tmp = require("tmp");
const request = require("request");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
const cp = require("cp");
const cpr = require("cpr");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("./promise");

// Write a stream to a file
function writeStream(filename, st) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defer' does not exist on type 'PromiseCo... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defer' does not exist on type 'PromiseCo... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfcall' does not exist on type 'PromiseC... Remove this comment to see the full error message
    return Promise.nfcall(tmp.file, opts).get(0);
}

// Generate temporary dir
function genTmpDir(opts) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfcall' does not exist on type 'PromiseC... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(path.relative(base, _filename));
}

// Create all required folder to create a file
function ensureFile(filename) {
    const base = path.dirname(filename);
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(mkdirp(base));
}

// Remove a folder
function rmDir(base) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfcall' does not exist on type 'PromiseC... Remove this comment to see the full error message
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
            // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
            return Promise();
        })
        .then(() => {
            // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
            return Promise(mkdirp(rootFolder));
        });
}

module.exports = {
    exists: fileExists,
    existsSync: fs.existsSync,
    mkdirp: mkdirp,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfbind' does not exist on type 'PromiseC... Remove this comment to see the full error message
    readFile: Promise.nfbind(fs.readFile),
    writeFile: (filePath, content) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'defer' does not exist on type 'PromiseCo... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfbind' does not exist on type 'PromiseC... Remove this comment to see the full error message
    stat: Promise.nfbind(fs.lstat),
    statSync: fs.lstatSync,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfbind' does not exist on type 'PromiseC... Remove this comment to see the full error message
    readdir: Promise.nfbind(fs.readdir),
    writeStream: writeStream,
    readStream: fs.createReadStream,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfbind' does not exist on type 'PromiseC... Remove this comment to see the full error message
    copy: Promise.nfbind(cp),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfbind' does not exist on type 'PromiseC... Remove this comment to see the full error message
    copyDir: Promise.nfbind(cpr),
    tmpFile: genTmpFile,
    tmpDir: genTmpDir,
    download: download,
    uniqueFilename: uniqueFilename,
    ensureFile: ensureFile,
    ensureFolder: ensureFolder,
    rmDir: rmDir,
};
