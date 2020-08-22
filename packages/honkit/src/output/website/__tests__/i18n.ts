import createTemplateEngine from "../createTemplateEngine";
import createMockOutput from "../../testing/createMock";
import prepareI18n from "../prepareI18n";
import WebsiteGenerator from "../";

describe("i18n", () => {
    test("should correctly use english as default language", () => {
        // @ts-expect-error
        return createMockOutput(WebsiteGenerator, {
            "README.md": "Hello World"
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
        // @ts-expect-error
        return createMockOutput(WebsiteGenerator, {
            "README.md": "Hello World",
            "book.json": JSON.stringify({ language: "fr" })
        })
            .then((output) => {
                return prepareI18n(output);
            })
            .then((output) => {
                const engine = createTemplateEngine(output, "README.md");
                const t = engine.getFilters().get("t");

                expect(t("GITBOOK_LINK")).toEqual("Publié avec HonKit");
            });
    });
});
