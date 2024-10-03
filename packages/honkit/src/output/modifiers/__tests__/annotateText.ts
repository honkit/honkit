import Immutable from "immutable";
import { loadHtml } from '@honkit/html';
import GlossaryEntry from "../../../models/glossaryEntry";
import annotateText from "../annotateText";

describe("annotateText", () => {
    const entries = Immutable.List([
        new GlossaryEntry({ name: "Word" }),
        new GlossaryEntry({ name: "Multiple Words" }),
    ]);

    test("should annotate text", () => {
        const $ = loadHtml("<p>This is a word, and multiple words</p>");

        annotateText(entries, "GLOSSARY.md", $);

        const links = $("a");
        expect(links.length).toBe(2);

        const word = $(links.get(0));
        expect(word.attr("href")).toBe("/GLOSSARY.md#word");
        expect(word.text()).toBe("word");
        expect(word.hasClass("glossary-term")).toBeTruthy();

        const words = $(links.get(1));
        expect(words.attr("href")).toBe("/GLOSSARY.md#multiple-words");
        expect(words.text()).toBe("multiple words");
        expect(words.hasClass("glossary-term")).toBeTruthy();
    });

    test("should annotate text with regardless of glossary order", () => {
        const $ = loadHtml("<p>This is multiple words, and another word.</p>");

        annotateText(entries, "GLOSSARY.md", $);

        const links = $("a");
        expect(links.length).toBe(2);

        const word = $(links.get(0));
        expect(word.attr("href")).toBe("/GLOSSARY.md#multiple-words");
        expect(word.text()).toBe("multiple words");
        expect(word.hasClass("glossary-term")).toBeTruthy();

        const words = $(links.get(1));
        expect(words.attr("href")).toBe("/GLOSSARY.md#word");
        expect(words.text()).toBe("word");
        expect(words.hasClass("glossary-term")).toBeTruthy();
    });

    test("should not annotate scripts", () => {
        const $ = loadHtml("<script>This is a word, and multiple words</script>");

        annotateText(entries, "GLOSSARY.md", $);
        expect($("a").length).toBe(0);
    });

    test('should not annotate when has class "no-glossary"', () => {
        const $ = loadHtml('<p class="no-glossary">This is a word, and multiple words</p>');

        annotateText(entries, "GLOSSARY.md", $);
        expect($("a").length).toBe(0);
    });
});
