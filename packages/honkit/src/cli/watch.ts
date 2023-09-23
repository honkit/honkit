import path from "path";
import chokidar from "chokidar";
import parsers from "../parsers";

/**
 Watch a folder and resolve promise once a file is modified

 @param {string} dir
 @param callback
 @return {Promise}
 */

function watch(dir, callback) {
    dir = path.resolve(dir);

    const toWatch = ["book.json", "book.js", "_layouts/**"];

    // Watch all parsable files
    parsers.extensions.forEach((ext) => {
        toWatch.push(`**/*${ext}`);
    });

    const watcher = chokidar.watch(toWatch, {
        cwd: dir,
        // prevent infinity loop
        // https://github.com/honkit/honkit/issues/269
        ignored: ["_book/**", "node_modules/**"],
        ignoreInitial: true
    });

    watcher.on("all", (e, filepath) => {
        callback(null, path.resolve(dir, filepath));
    });
    watcher.on("error", (err) => {
        callback(err);
    });
}

export default watch;
