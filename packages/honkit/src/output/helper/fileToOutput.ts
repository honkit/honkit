import path from "path";
import PathUtils from "../../utils/path";
import LocationUtils from "../../utils/location";

const OUTPUT_EXTENSION = ".html";

/**
 * Convert a filePath (absolute) to a filename for output
 *
 * @param {Output} output
 * @param {string} filePath
 * @return {string}
 */

function fileToOutput(output, filePath) {
    const book = output.getBook();
    const readme = book.getReadme();
    const fileReadme = readme.getFile();

    if (
        path.basename(filePath, path.extname(filePath)) == "README" ||
        (fileReadme.exists() && filePath == fileReadme.getPath())
    ) {
        filePath = path.join(path.dirname(filePath), `index${OUTPUT_EXTENSION}`);
    } else {
        filePath = PathUtils.setExtension(filePath, OUTPUT_EXTENSION);
    }

    return LocationUtils.normalize(filePath);
}

export default fileToOutput;
