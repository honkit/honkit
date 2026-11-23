import path from "path";
import LocationUtils from "../../utils/location";
import fileToOutput from "./fileToOutput";

/**
 Convert a filePath (absolute) to an url (without hostname).
 It returns an absolute path.

 "README.md" -> "/"
 "test/hello.md" -> "test/hello.html"
 "test/README.md" -> "test/"

 When `prettyUrls` config is true, strips the .html extension
 from non-index URLs:
 "test/hello.md" -> "test/hello"

 @param {Output} output
 @param {string} filePath
 @return {string}
 */

function fileToURL(output, filePath) {
    const options = output.getOptions();
    const directoryIndex = options.get("directoryIndex");
    const prettyUrls = output.getBook().getConfig().getValue("prettyUrls", false);

    filePath = fileToOutput(output, filePath);

    if (directoryIndex && path.basename(filePath) == "index.html") {
        filePath = `${path.dirname(filePath)}/`;
    } else if (prettyUrls) {
        filePath = filePath.replace(/\.html$/, "");
    }

    return LocationUtils.normalize(filePath);
}

export default fileToURL;
