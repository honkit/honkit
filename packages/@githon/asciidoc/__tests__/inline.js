var assert = require("assert");

var inline = require("../").inline;

it("should render inline AsciiDoc", function () {
    assert.equal(inline("Hello **World**").content, "Hello <strong>World</strong>");
});
