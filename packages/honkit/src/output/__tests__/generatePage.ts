import assert from "assert";
import generatePage from "../generatePage";
import { generateMockBook } from "../testing/generateMock";
import Output from "../../models/output";
import Immutable from "immutable";
import generatePages from "../generatePages";
import Plugin from "../../models/plugin";
import Plugins from "../../plugins";
import createMockFS from "../../fs/mock";
import Book from "../../models/book";
import parseBook from "../../parse/parseBook";
import { generateBook } from "../generateBook";
import JSONGenerator from "../json";

describe("generatePage", function () {
    it("should call page when call generatePage", async () => {
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
        const { book, output } = await generateMockBook(JSONGenerator, {
            "README.md": "Hello World",
        });
        // Setup plugin
        const newOutput = output.merge({
            plugins: [plugin],
        });
        // call twice
        // @ts-ignore
        await generatePages(JSONGenerator, newOutput);
        await generatePages(JSONGenerator, newOutput);
        // assert
        assert.strictEqual(onPageBeforeCount, 2);
        assert.strictEqual(onPageCount, 2);
    });
});
