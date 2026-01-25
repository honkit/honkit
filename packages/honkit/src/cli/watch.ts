import path from "path";
import chokidar, { FSWatcher } from "chokidar";
import parsers from "../parsers";

export interface WatchOptions {
    /**
     * Output folder to ignore (in addition to _book and node_modules)
     * This prevents infinite rebuild loops when using custom output folders
     * @see https://github.com/honkit/honkit/issues/491
     */
    outputFolder?: string;
}

/**
 Watch a folder and resolve promise once a file is modified

 @param {string} dir
 @param callback
 @param {WatchOptions} options
 @return {FSWatcher} The chokidar watcher instance
 */

function watch(
    dir: string,
    callback: (error: Error | null, filepath?: string) => void,
    options: WatchOptions = {}
): FSWatcher {
    dir = path.resolve(dir);

    const toWatch = ["book.json", "book.js", "_layouts/**"];

    // Watch all parsable files
    parsers.extensions.forEach((ext) => {
        toWatch.push(`**/*${ext}`);
    });

    // Build ignored patterns
    // Always ignore _book and node_modules
    // https://github.com/honkit/honkit/issues/269
    const ignored: string[] = ["_book/**", "node_modules/**"];

    // If a custom output folder is specified, ignore it too
    // This prevents infinite rebuild loops when output folder is inside the watched directory
    // https://github.com/honkit/honkit/issues/491
    if (options.outputFolder) {
        const outputRelative = path.relative(dir, path.resolve(dir, options.outputFolder));
        // Only add to ignored if the output folder is inside the watched directory
        if (outputRelative && !outputRelative.startsWith("..") && !path.isAbsolute(outputRelative)) {
            ignored.push(`${outputRelative}/**`);
        }
    }

    const watcher = chokidar.watch(toWatch, {
        cwd: dir,
        ignored: ignored,
        ignoreInitial: true
    });

    watcher.on("all", (e, filepath) => {
        callback(null, path.resolve(dir, filepath));
    });
    watcher.on("error", (err) => {
        callback(err);
    });

    return watcher;
}

export default watch;
