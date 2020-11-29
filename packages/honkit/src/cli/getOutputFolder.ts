import path from "path";

/**
 Return path to output folder

 @param {Array} args
 @return {string}
 */

function getOutputFolder(args) {
    const bookRoot = path.resolve(args[0] || process.cwd());
    const defaultOutputRoot = path.join(bookRoot, "_book");
    const outputFolder = args[1] ? path.resolve(process.cwd(), args[1]) : defaultOutputRoot;

    return outputFolder;
}

export default getOutputFolder;
