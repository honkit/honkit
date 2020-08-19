// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
const omit = require("omit-keys");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Templating... Remove this comment to see the full error message
const Templating = require("../../templating");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Plugins'.
const Plugins = require("../../plugins");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONUtils'... Remove this comment to see the full error message
const JSONUtils = require("../../json");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Modifiers'... Remove this comment to see the full error message
const Modifiers = require("../modifiers");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'writeFile'... Remove this comment to see the full error message
const writeFile = require("../helper/writeFile");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getModifie... Remove this comment to see the full error message
const getModifiers = require("../getModifiers");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createTemp... Remove this comment to see the full error message
const createTemplateEngine = require("./createTemplateEngine");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fileToOutp... Remove this comment to see the full error message
const fileToOutput = require("../helper/fileToOutput");

/**
 * Write a page as a json file
 *
 * @param {Output} output
 * @param {Page} page
 */
function onPage(output, page) {
    const options = output.getOptions();
    const prefix = options.get("prefix");

    const file = page.getFile();

    const book = output.getBook();
    const plugins = output.getPlugins();
    const state = output.getState();
    const resources = state.getResources();

    const engine = createTemplateEngine(output, page.getPath());

    // Output file path
    const filePath = fileToOutput(output, file.getPath());

    // Calcul relative path to the root
    const outputDirName = path.dirname(filePath);
    const basePath = LocationUtils.normalize(path.relative(outputDirName, "./"));

    return Modifiers.modifyHTML(page, getModifiers(output, page)).then((resultPage) => {
        // Generate the context
        const context = JSONUtils.encodeOutputWithPage(output, resultPage);
        context.plugins = {
            resources: Plugins.listResources(plugins, resources).toJS(),
        };

        context.template = {
            getJSContext: function () {
                return {
                    page: omit(context.page, "content"),
                    config: context.config,
                    file: context.file,
                    gitbook: context.gitbook,
                    basePath: basePath,
                    book: {
                        language: book.getLanguage(),
                    },
                };
            },
        };

        // We should probabbly move it to "template" or a "site" namespace
        context.basePath = basePath;

        // Render the theme
        return (
            Templating.renderFile(engine, `${prefix}/page.html`, context)

                // Write it to the disk
                .then((tplOut) => {
                    return writeFile(output, filePath, tplOut.getContent());
                })
        );
    });
}

module.exports = onPage;
