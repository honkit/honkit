import path from "path";
import chokidar, { FSWatcher } from "chokidar";
import parsers from "../parsers";

export type WatchEventType = "add" | "addDir" | "change" | "unlink" | "unlinkDir";

export interface WatchOptions {
    /**
     * Directory to watch
     */
    watchDir: string;
    /**
     * Callback when a file is modified
     * @param error - Error if any
     * @param filepath - Absolute path of the changed file
     * @param eventType - Type of change: "add", "change", "unlink", etc.
     */
    callback: (error: Error | null, filepath?: string, eventType?: WatchEventType) => void;
    /**
     * Output folder to ignore (in addition to _book and node_modules)
     * This prevents infinite rebuild loops when using custom output folders
     * @see https://github.com/honkit/honkit/issues/491
     */
    outputFolder?: string;
}

/**
 * Watch a folder and call callback when a file is modified
 *
 * @param {WatchOptions} options
 * @return {FSWatcher} The chokidar watcher instance
 */
function watch(options: WatchOptions): FSWatcher {
    const { callback, outputFolder } = options;
    const dir = path.resolve(options.watchDir);

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
    if (outputFolder) {
        // Convert to forward slashes for glob pattern (Windows compatibility)
        const outputRelative = path.relative(dir, path.resolve(dir, outputFolder)).replace(/\\/g, "/");
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

    watcher.on("all", (eventType: WatchEventType, filepath) => {
        callback(null, path.resolve(dir, filepath), eventType);
    });
    watcher.on("error", (err) => {
        callback(err);
    });

    return watcher;
}

export default watch;
