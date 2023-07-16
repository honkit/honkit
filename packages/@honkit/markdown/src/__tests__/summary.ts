import path from "path";
import assert from "assert";
import fs from "fs";
import markdown from "../";

function lex(fixtureFile) {
    return markdown.summary(fs.readFileSync(path.join(__dirname, "fixtures", fixtureFile), "utf8"));
}

describe("Summary parsing", () => {
    let LEXED, PART;

    beforeAll(() => {
        LEXED = lex("SUMMARY.md");
        PART = LEXED.parts[0];
    });

    it("should detect chapters", () => {
        assert.equal(PART.articles.length, 5);
    });

    it("should support articles", () => {
        assert.equal(PART.articles[0].articles.length, 2);
        assert.equal(PART.articles[1].articles.length, 0);
        assert.equal(PART.articles[2].articles.length, 0);
    });

    it("should detect paths and titles", () => {
        assert(PART.articles[0].ref);
        assert(PART.articles[1].ref);
        assert(PART.articles[2].ref);
        assert(PART.articles[3].ref);
        assert.equal(PART.articles[4].ref, null);

        assert(PART.articles[0].title);
        assert(PART.articles[1].title);
        assert(PART.articles[2].title);
        assert(PART.articles[3].title);
        assert(PART.articles[4].title);
    });

    it("should normalize paths from .md", () => {
        assert.equal(PART.articles[0].ref, "chapter-1/README.md");
        assert.equal(PART.articles[1].ref, "chapter-2/README.md");
        assert.equal(PART.articles[2].ref, "chapter-3/README.md");
    });

    it("should part parts", () => {
        const l = lex("SUMMARY_PARTS.md");
        assert.equal(l.parts.length, 3);
    });

    it("should allow lists separated by whitespace", () => {
        const l = lex("SUMMARY_WHITESPACE.md");
        assert.equal(l.parts[0].articles.length, 5);
    });

    it("should allow ignore empty entries", () => {
        const l = lex("SUMMARY_EMPTY.md");
        assert.equal(l.parts[0].articles.length, 1);
    });

    it("should correctly convert it to text", () => {
        const text = markdown.summary.toText(LEXED);
        assert.deepEqual(markdown.summary(text), LEXED);
    });
});
