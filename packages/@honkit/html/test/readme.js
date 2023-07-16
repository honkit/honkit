import fs from "fs";
import path from "path";
import assert from "assert";
import html from "../";
describe("Readme parsing", () => {
    let LEXED;
    
    before(() => {
        const CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/README.html"), "utf8");
        LEXED = html.readme(CONTENT);
    });
    
    it("should contain a title", () => {
        assert(LEXED.title);
    });
    
    it("should contain a description", () => {
        assert(LEXED.description);
    });
    
    it("should extract the right title", () => {
        assert.equal(LEXED.title, "This is the title");
    });
    
    it("should extract the right description", () => {
        assert.equal(LEXED.description, "This is the book description.");
    });
});
