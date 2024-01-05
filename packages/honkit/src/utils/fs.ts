import fs from "fs";
import mkdirp from "mkdirp";
import destroy from "destroy";
import tmp from "tmp";
import path from "path";
import cp from "cp";
import cpr from "cpr";
import Promise from "./promise";
import http from "http";
import https from "https";

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

/**
 * Generate temporary dir
 * @deprecated use tmpdir.ts
 * @param opts
 */
function genTmpDir(opts) {
    return Promise.nfcall(tmp.dir, opts).get(0);
}

// https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
const downloadStream = (url: string, dest: string, cb: (error: Error | null) => void) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(url, (response) => {
        // check if response is success
        if (response.statusCode < 200 && response.statusCode > 300) {
            return cb(new Error("Response status was " + response.statusCode));
        }
        response.pipe(file);
    });
    // close() is async, call cb after close completes
    file.on("finish", () => file.close(() => cb(null)));
    // check for request error too
    request.on("error", (err) => {
        fs.unlink(dest, () => cb(err)); // delete the (partial) file and then return the error
    });
    file.on("error", (err) => {
        // Handle errors
        fs.unlink(dest, () => cb(err)); // delete the (partial) file and then return the error
    });
};

// Download an image
async function download(uri: string, destFilePath: string) {
    // create dest dir if not exists
    const destDir = path.dirname(destFilePath);
    await fs.promises.mkdir(destDir, { recursive: true });
    const d = Promise.defer();
    downloadStream(uri, destFilePath, (err) => {
        if (err) {
            d.reject(err);
        } else {
            d.resolve();
        }
    });
    return d.promise;
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
    return Promise.nfcall(fs.rm, base, {
        recursive: true
    });
}

/**
 Assert a file, if it doesn't exist, call "generator"

 @param {string} filePath
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

 @param {string} rootFolder
 @param {string} fileName
 @return {string}
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

 @param {string} folder
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
    /**
     * @deprecated use tmpdir.ts
     */
    tmpDir: genTmpDir,
    download: download,
    uniqueFilename: uniqueFilename,
    ensureFile: ensureFile,
    ensureFolder: ensureFolder,
    rmDir: rmDir
};
