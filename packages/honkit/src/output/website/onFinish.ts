import Promise from "../../utils/promise";
import JSONUtils from "../../json";
import Templating from "../../templating";
import writeFile from "../helper/writeFile";
import createTemplateEngine from "./createTemplateEngine";

/**
 Finish the generation, write the languages index

 @param {Output} output
 @return {Output}
 */
function onFinish(output) {
    const book = output.getBook();
    const options = output.getOptions();
    const prefix = options.get("prefix");

    if (!book.isMultilingual()) {
        return Promise(output);
    }

    const filePath = "index.html";
    const engine = createTemplateEngine(output, filePath);
    const context = JSONUtils.encodeOutput(output);

    // Render the theme
    return (
        Templating.renderFile(engine, `${prefix}/languages.html`, context)

            // Write it to the disk
            .then((tplOut) => {
                return writeFile(output, filePath, tplOut.getContent());
            })
    );
}

export { onFinish };
