import markdown  from "../";
import assert from "assert";

const inline = markdown.inline;
describe("Inline", () => {
    it("should render inline markdown", () => {
        assert.equal(inline("Hello **World**").content, "Hello <strong>World</strong>");
    });
});
