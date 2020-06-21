const createMockOutput = require("../../testing/createMock");
const prepareI18n = require("../prepareI18n");
const createTemplateEngine = require("../createTemplateEngine");

const WebsiteGenerator = require("../");

describe("i18n", () => {
    test("should correctly use english as default language", () => {
        return createMockOutput(WebsiteGenerator, {
            "README.md": "Hello World",
        })
            .then((output) => {
                return prepareI18n(output);
            })
            .then((output) => {
                const engine = createTemplateEngine(output, "README.md");
                const t = engine.getFilters().get("t");

                expect(t("SUMMARY_INTRODUCTION")).toEqual("Introduction");
            });
    });

    test("should correctly use language from book.json", () => {
        return createMockOutput(WebsiteGenerator, {
            "README.md": "Hello World",
            "book.json": JSON.stringify({ language: "fr" }),
        })
            .then((output) => {
                return prepareI18n(output);
            })
            .then((output) => {
                const engine = createTemplateEngine(output, "README.md");
                const t = engine.getFilters().get("t");

                expect(t("GITBOOK_LINK")).toEqual("Publié avec GitHon");
            });
    });
});
