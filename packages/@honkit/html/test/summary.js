import fs from "fs";
import path from "path";
import assert from "assert";
import html from "../";

describe("Summary parsing", () => {
    let LEXED, PART;
    let LEXED_EMPTY;
    
    before(() => {
        const CONTENT = fs.readFileSync(
            path.join(__dirname, "./fixtures/SUMMARY.html"), "utf8");
        LEXED = html.summary(CONTENT);
        PART = LEXED.parts[0];
        
        const CONTENT_EMPTY = fs.readFileSync(
            path.join(__dirname, "./fixtures/SUMMARY-EMPTY.html"), "utf8");
        LEXED_EMPTY = html.summary(CONTENT_EMPTY);
    });
    
    describe("Parts", () => {
        it("should detect parts", () => {
            assert.equal(LEXED.parts.length, 3);
        });
        
        it("should detect title", () => {
            assert.equal(LEXED.parts[0].title, "");
            assert.equal(LEXED.parts[1].title, "Part 2");
            assert.equal(LEXED.parts[2].title, "");
        });
        
        it("should detect empty parts", () => {
            const partTitles = LEXED_EMPTY.parts.map((part) => {
                return part.title;
            });
            const expectedTitles = [
                "First empty part",
                "Part 1",
                "",
                "Empty part",
                "Part 2",
                "Penultimate empty part",
                "Last empty part"
            ];
            assert.equal(LEXED_EMPTY.parts.length, 7);
            expectedTitles.forEach((title, index) => {
                assert.equal(partTitles[index], title);
            });
        });
    });
    
    it("should detect chapters", () => {
        assert.equal(PART.articles.length, 5);
    });
    
    it("should detect chapters in other parts", () => {
        assert.equal(LEXED.parts[1].articles.length, 1);
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
    
    it("should correctly convert it to text", () => {
        const text = html.summary.toText(LEXED);
        assertObjectsEqual(html.summary(text), LEXED);
    });
});

describe("Summary parsing of loose lists", () => {
    // https://github.com/honkit/honkit/issues/314
    it("should not take the link of a nested entry for an entry without link", () => {
        const LEXED = html.summary(`<ul>
<li><p>Chapter One</p>
<ul>
<li><p><a href="chapter1/section1.md">section1</a></p></li>
<li><p><a href="chapter1/section2.md">section2</a></p></li>
</ul>
</li>
<li><p><a href="chapter2/README.md">Chapter Two</a></p>
<ul>
<li><p><a href="chapter2/section1.md">section1</a></p></li>
</ul>
</li>
</ul>`);
        const [chapterOne, chapterTwo] = LEXED.parts[0].articles;
        assert.equal(chapterOne.title, "Chapter One");
        assert.equal(chapterOne.ref, undefined);
        assert.deepEqual(
            chapterOne.articles.map((article) => [article.title, article.ref]),
            [
                ["section1", "chapter1/section1.md"],
                ["section2", "chapter1/section2.md"]
            ]
        );
        assert.equal(chapterTwo.title, "Chapter Two");
        assert.equal(chapterTwo.ref, "chapter2/README.md");
    });
});
