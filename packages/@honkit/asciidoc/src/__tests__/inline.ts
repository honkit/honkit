import assert from "assert";
import asciidoc from "../";

it("should render inline AsciiDoc", function () {
    assert.equal(asciidoc.inline("Hello **World**").content, "Hello <strong>World</strong>");
});
