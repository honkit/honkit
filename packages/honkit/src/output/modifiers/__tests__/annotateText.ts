import Immutable from "immutable";
import cheerio from "cheerio";
import GlossaryEntry from "../../../models/glossaryEntry";
import annotateText from "../annotateText";

describe("annotateText", () => {
    const entries = Immutable.List([GlossaryEntry({ name: "Word" }), GlossaryEntry({ name: "Multiple Words" })]);

    test("should annotate text", () => {
        const $ = cheerio.load("<p>This is a word, and multiple words</p>");

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

    test("should not annotate scripts", () => {
        const $ = cheerio.load("<script>This is a word, and multiple words</script>");

        annotateText(entries, "GLOSSARY.md", $);
        expect($("a").length).toBe(0);
    });

    test("should not annotate when has class \"no-glossary\"", () => {
        const $ = cheerio.load("<p class=\"no-glossary\">This is a word, and multiple words</p>");

        annotateText(entries, "GLOSSARY.md", $);
        expect($("a").length).toBe(0);
    });
});
