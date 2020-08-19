// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONUtils'... Remove this comment to see the full error message
const JSONUtils = require("../../json");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Templating... Remove this comment to see the full error message
const Templating = require("../../templating");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'writeFile'... Remove this comment to see the full error message
const writeFile = require("../helper/writeFile");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTemp... Remove this comment to see the full error message
const createTemplateEngine = require("./createTemplateEngine");

/**
    Finish the generation, write the languages index

    @param {Output}
    @return {Output}
*/
function onFinish(output) {
    const book = output.getBook();
    const options = output.getOptions();
    const prefix = options.get("prefix");

    if (!book.isMultilingual()) {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
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

module.exports = onFinish;
