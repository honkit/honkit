// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'WebsiteGen... Remove this comment to see the full error message
const WebsiteGenerator = require("../website");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONUtils'... Remove this comment to see the full error message
const JSONUtils = require("../../json");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Templating... Remove this comment to see the full error message
const Templating = require("../../templating");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'error'.
const error = require("../../utils/error");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'command'.
const command = require("../../utils/command");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'writeFile'... Remove this comment to see the full error message
const writeFile = require("../helper/writeFile");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getConvert... Remove this comment to see the full error message
const getConvertOptions = require("./getConvertOptions");
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
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise(output);
    }

    return getConvertOptions(output)
        .then((options) => {
            const cmd = [
                "ebook-convert",
                path.resolve(outputFolder, SUMMARY_FILE),
                path.resolve(outputFolder, `index.${format}`),
                command.optionsToShellArgs(options),
            ].join(" ");

            return command
                .exec(cmd)
                .progress((data) => {
                    logger.debug(data);
                })
                .fail((err) => {
                    if (err.code == 127) {
                        throw error.RequireInstallError({
                            cmd: "ebook-convert",
                            install: "Install it from Calibre: https://calibre-ebook.com",
                        });
                    }

                    throw error.EbookError(err);
                });
        })
        .thenResolve(output);
}

/**
    Finish the generation, generates the SUMMARY.html

    @param {Output}
    @return {Output}
*/
// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function onFinish(output) {
    return writeSummary(output).then(runEbookConvert);
}

module.exports = onFinish;
