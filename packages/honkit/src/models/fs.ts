import path from "path";
import Immutable from "immutable";
import stream from "stream";
import File from "./file";
import Promise from "../utils/promise";
import error from "../utils/error";
import PathUtil from "../utils/path";

class FS extends Immutable.Record({
    root: String(),

    fsExists: Function(),
    fsReadFile: Function(),
    fsStatFile: Function(),
    fsReadDir: Function(),

    fsLoadObject: null,
    fsReadAsStream: null
}) {
    /**
     Return path to the root

     @return {string}
     */
    getRoot(): string {
        return this.get("root");
    }

    /**
     Verify that a file is in the fs scope

     @param {string} filename
     @return {boolean}
     */
    isInScope(filename: string): boolean {
        const rootPath = this.getRoot();
        filename = path.join(rootPath, filename);

        return PathUtil.isInRoot(rootPath, filename);
    }

    /**
     Resolve a file in this FS
     @return {string}
     */
    resolve(...args: string[]): string {
        const rootPath = this.getRoot();
        let filename = path.join.apply(path, [rootPath].concat(args));
        filename = path.normalize(filename);

        if (!this.isInScope(filename)) {
            throw error.FileOutOfScopeError({
                filename: filename,
                root: rootPath
            });
        }

        return filename;
    }

    /**
     Check if a file exists, run a Promise(true) if that's the case, Promise(false) otherwise

     @param {string} filename
     @return {Promise<Boolean>}
     */
    exists(filename: string): Promise<boolean> {
        const that = this;

        return Promise().then(() => {
            filename = that.resolve(filename);
            const exists = that.get("fsExists");

            return exists(filename);
        });
    }

    /**
     Read a file and returns a promise with the content as a buffer

     @param {string} filename
     @return {Promise<Buffer>}
     */
    read(filename: string): Promise<Buffer> {
        const that = this;

        return Promise().then(() => {
            filename = that.resolve(filename);
            const read = that.get("fsReadFile");

            return read(filename);
        });
    }

    /**
     Read a file as a string (utf-8)
     @return {Promise<String>}
     */
    readAsString(filename: string, encoding: string = "utf8"): Promise<string> {
        return this.read(filename).then((buf) => {
            return buf.toString(encoding);
        });
    }

    /**
     Read file as a stream

     @param {string} filename
     @return {Promise<Stream>}
     */
    readAsStream(filename: string) {
        const that = this;
        const filepath = that.resolve(filename);
        const fsReadAsStream = this.get("fsReadAsStream");

        if (fsReadAsStream) {
            return Promise(fsReadAsStream(filepath));
        }

        return this.read(filename).then((buf) => {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(buf);

            return bufferStream;
        });
    }

    /**
     Read stat infos about a file

     @param {string} filename
     @return {Promise<File>}
     */
    statFile(filename: string): Promise<File> {
        const that = this;

        return Promise()
            .then(() => {
                const filepath = that.resolve(filename);
                const stat = that.get("fsStatFile");

                return stat(filepath);
            })
            .then((stat) => {
                return File.createFromStat(filename, stat);
            });
    }

    /**
     List files/directories in a directory.
     Directories ends with '/'

     @param {string} dirname
     @return {Promise<List<String>>}
     */
    readDir(dirname: string) {
        const that = this;

        return Promise()
            .then(() => {
                const dirpath = that.resolve(dirname);
                const readDir = that.get("fsReadDir");

                return readDir(dirpath);
            })
            .then((files) => {
                return Immutable.List(files);
            });
    }

    /**
     List only files in a diretcory
     Directories ends with '/'

     @param {string} dirname
     @return {Promise<List<String>>}
     */
    listFiles(dirname: string) {
        return this.readDir(dirname).then((files) => {
            return files.filterNot(pathIsFolder);
        });
    }

    /**
     List all files in a directory

     @param {string} dirName
     @param {Function(dirName)} filterFn: call it for each file/directory to test if it should stop iterating
     @return {Promise<List<String>>}
     */
    listAllFiles(dirName: string, filterFn: (arg0: string) => boolean) {
        const that = this;
        dirName = dirName || ".";

        return this.readDir(dirName).then((files) => {
            return Promise.reduce(
                files,
                (out, file) => {
                    const isDirectory = pathIsFolder(file);
                    const newDirName = path.join(dirName, file);

                    if (filterFn && filterFn(newDirName) === false) {
                        return out;
                    }

                    if (!isDirectory) {
                        return out.push(newDirName);
                    }

                    return that.listAllFiles(newDirName, filterFn).then((inner) => {
                        return out.concat(inner);
                    });
                },
                Immutable.List()
            );
        });
    }

    /**
     Find a file in a folder (case insensitive)
     Return the found filename

     @param {string} dirname
     @param {string} filename
     @return {Promise<String>}
     */
    findFile(dirname: string, filename: string) {
        return this.listFiles(dirname).then((files) => {
            return files.find((file) => {
                return file.toLowerCase() == filename.toLowerCase();
            });
        });
    }

    /**
     Load a JSON file
     By default, fs only supports JSON

     @param {string} filename
     @return {Promise<Object>}
     */
    loadAsObject(filename: string) {
        const that = this;
        const fsLoadObject = this.get("fsLoadObject");

        return this.exists(filename).then((exists) => {
            if (!exists) {
                const err = new Error("Module doesn't exist");

                // @ts-expect-error ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Error'.
                err.code = "MODULE_NOT_FOUND";

                throw err;
            }

            if (fsLoadObject) {
                return fsLoadObject(that.resolve(filename));
            } else {
                return that.readAsString(filename).then((str) => {
                    return JSON.parse(str);
                });
            }
        });
    }

    /**
     Create a FS instance

     @param {Object} def
     @return {FS}
     */
    static create(def) {
        return new FS(def);
    }

    /**
     Create a new FS instance with a reduced scope

     @param {FS} fs
     @param {string} scope
     @return {FS}
     */
    static reduceScope(fs: FS, scope: string): FS {
        return fs.set("root", path.join(fs.getRoot(), scope)) as FS;
    }
}

// .readdir return files/folder as a list of string, folder ending with '/'
function pathIsFolder(filename: string): boolean {
    const lastChar = filename[filename.length - 1];
    return lastChar == "/" || lastChar == "\\";
}

export default FS;
