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

export default onPage;
