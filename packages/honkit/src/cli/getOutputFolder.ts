import path from "path";

/**
 Return path to output folder

 @param {Array} args
 @return {string}
 */

function getOutputFolder(args) {
    const bookRoot = path.resolve(args[0] || process.cwd());
    const defaultOutputRoot = path.join(bookRoot, "_book");
    // Fix: Resolve output folder relative to book root, not process.cwd()
    // This ensures the output folder is correctly ignored by the file watcher
    // https://github.com/honkit/honkit/issues/491
    const outputFolder = args[1] ? path.resolve(bookRoot, args[1]) : defaultOutputRoot;

    return outputFolder;
}

export default getOutputFolder;
