// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
const chokidar = require("chokidar");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parsers'.
const parsers = require("../parsers");

/**
 Watch a folder and resolve promise once a file is modified

 @param {String} dir
 @param callback
 @return {Promise}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'watch'.
function watch(dir, callback) {
    dir = path.resolve(dir);

    const toWatch = ["book.json", "book.js", "_layouts/**"];

    // Watch all parsable files
    parsers.extensions.forEach((ext) => {
        toWatch.push(`**/*${ext}`);
    });

    const watcher = chokidar.watch(toWatch, {
        cwd: dir,
        ignored: "_book/**",
        ignoreInitial: true,
    });

    watcher.on("all", (e, filepath) => {
        callback(null, path.resolve(dir, filepath));
    });
    watcher.on("error", (err) => {
        callback(err);
    });
}

module.exports = watch;
