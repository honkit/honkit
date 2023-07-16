import path from "path";
import assert from "assert";
import markdown from "../";

import fs from "fs";

describe("Readme parsing", () => {
    let LEXED;

    beforeAll(() => {
        const CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/README.md"), "utf8");
        LEXED = markdown.readme(CONTENT);
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
