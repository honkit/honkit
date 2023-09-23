import path from "path";
import omit from "omit-keys";
import Templating from "../../templating";
import Plugins from "../../plugins";
import JSONUtils from "../../json";
import LocationUtils from "../../utils/location";
import Modifiers from "../modifiers";
import writeFile from "../helper/writeFile";
import getModifiers from "../getModifiers";
import createTemplateEngine from "./createTemplateEngine";
import fileToOutput from "../helper/fileToOutput";

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
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'plugins' does not exist on type '{ summa... Remove this comment to see the full error message
        context.plugins = {
            resources: Plugins.listResources(plugins, resources).toJS()
        };

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'template' does not exist on type '{ summ... Remove this comment to see the full error message
        context.template = {
            getJSContext: function () {
                return {
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'page' does not exist on type '{ summary:... Remove this comment to see the full error message
                    page: omit(context.page, "content"),
                    config: context.config,
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'file' does not exist on type '{ summary:... Remove this comment to see the full error message
                    file: context.file,
                    gitbook: context.gitbook,
                    basePath: basePath,
                    book: {
                        language: book.getLanguage()
                    }
                };
            }
        };

        // We should probabbly move it to "template" or a "site" namespace
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'basePath' does not exist on type '{ summ... Remove this comment to see the full error message
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

export { onPage };
