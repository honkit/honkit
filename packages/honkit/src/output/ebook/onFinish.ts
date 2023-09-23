import path from "path";
import WebsiteGenerator from "../website";
import JSONUtils from "../../json";
import Templating from "../../templating";
import Promise from "../../utils/promise";
import error from "../../utils/error";
import command from "../../utils/command";
import writeFile from "../helper/writeFile";
import getConvertOptions from "./getConvertOptions";

const SUMMARY_FILE = "SUMMARY.html";

/**
 Write the SUMMARY.html

 @param {Output}
 @return {Output}
 */
function writeSummary(output) {
    const options = output.getOptions();
    const prefix = options.get("prefix");

    const filePath = SUMMARY_FILE;
    const engine = WebsiteGenerator.createTemplateEngine(output, filePath);
    const context = JSONUtils.encodeOutput(output);

    // Render the theme
    return (
        Templating.renderFile(engine, `${prefix}/summary.html`, context)

            // Write it to the disk
            .then((tplOut) => {
                return writeFile(output, filePath, tplOut.getContent());
            })
    );
}

/**
 Generate the ebook file as "index.pdf"

 @param {Output}
 @return {Output}
 */
function runEbookConvert(output) {
    const logger = output.getLogger();
    const options = output.getOptions();
    const format = options.get("format");
    const outputFolder = output.getRoot();

    if (!format) {
        return Promise(output);
    }

    return getConvertOptions(output)
        .then((options) => {
            const cmd = [
                "ebook-convert",
                path.resolve(outputFolder, SUMMARY_FILE),
                path.resolve(outputFolder, `index.${format}`),
                command.optionsToShellArgs(options)
            ].join(" ");

            return (
                command

                    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
                    .exec(cmd)
                    .progress((data) => {
                        logger.debug(data);
                    })
                    .fail((err) => {
                        if (err.code == 127) {
                            throw error.RequireInstallError({
                                cmd: "ebook-convert",
                                install: "Install it from Calibre: https://calibre-ebook.com"
                            });
                        }

                        throw error.EbookError(err);
                    })
            );
        })
        .thenResolve(output);
}

/**
 Finish the generation, generates the SUMMARY.html

 @param {Output}
 @return {Output}
 */
function onFinish(output) {
    return writeSummary(output).then(runEbookConvert);
}

export default onFinish;
