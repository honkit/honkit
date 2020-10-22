import assert from "assert";
import { generateMockBook } from "../testing/generateMock";
import Immutable from "immutable";
import generatePages from "../generatePages";
import Plugin from "../../models/plugin";
import JSONGenerator from "../json";

const createOutputWithPlugin = async ({ Generator, plugin, files }) => {
    const { output } = await generateMockBook(Generator, files);
    // add plugin
    return output.merge({
        plugins: [plugin],
    });
};
describe("plugin-hooks", function () {
    it(`should be called "page" and "page:before" when generate each pages`, async () => {
        let onPageBeforeCount = 0;
        let onPageCount = 0;
        const plugin = new Plugin({
            name: "testplugin",
            version: "*",
            path: "test.js",
            package: Immutable.fromJS({
                name: "testplugin",
            }),
            content: Immutable.fromJS({
                hooks: {
                    "page:before": function (page) {
                        onPageBeforeCount++;
                        return page;
                    },
                    page: function (page) {
                        onPageCount++;
                        return page;
                    },
                },
            }),
        });
        const output = await createOutputWithPlugin({
            Generator: JSONGenerator,
            plugin,
            files: {
                "README.md": "Hello World",
            },
        });
        // call twice
        await generatePages(JSONGenerator, output);
        await generatePages(JSONGenerator, output);
        // assert
        assert.strictEqual(onPageBeforeCount, 2);
        assert.strictEqual(onPageCount, 2);
    });
});
