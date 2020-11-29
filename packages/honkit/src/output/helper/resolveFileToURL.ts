import LocationUtils from "../../utils/location";
import fileToURL from "./fileToURL";

/**
 * Resolve an absolute path (extracted from a link)
 *
 * @param {Output} output
 * @param {string} filePath
 * @return {string}
 */

function resolveFileToURL(output, filePath) {
    // Convert /test.png -> test.png
    filePath = LocationUtils.toAbsolute(filePath, "", "");

    const page = output.getPage(filePath);

    // if file is a page, return correct .html url
    if (page) {
        filePath = fileToURL(output, filePath);
    }

    return LocationUtils.normalize(filePath);
}

export default resolveFileToURL;
