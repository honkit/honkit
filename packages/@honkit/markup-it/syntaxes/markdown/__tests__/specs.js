const fs = require("fs");
const path = require("path");
const JSDOM = require("jsdom").JSDOM;
const assert = require("assert");

const MarkupIt = require("../../..").Markup;
const markdownSyntax = require("../");
const htmlSyntax = require("../../html");

const FIXTURES = path.resolve(__dirname, "specs");

const markdown = new MarkupIt(markdownSyntax);
const html = new MarkupIt(htmlSyntax);

const assertHTMLEqual = (aHTML, bHTML) => {
    const aDOM = new JSDOM(aHTML);
    const bDOM = new JSDOM(bHTML);
    assert.strictEqual(aDOM.innerHTML, bDOM.innerHTML);
};

describe("Markdown Specs", () => {
    const files = fs.readdirSync(FIXTURES);

    describe("MD -> HTML", () => {
        files.forEach((file) => {
            if (path.extname(file) !== ".md") return;

            it(file, () => {
                const fixture = readFixture(file);
                testMdToHtml(fixture);
            });
        });
    });

    describe("MD -> MD", () => {
        files.forEach((file) => {
            if (path.extname(file) !== ".md") return;

            it(file, () => {
                const fixture = readFixture(file);
                testMdIdempotence(fixture);
            });
        });
    });
});

function testMdToHtml(fixture) {
    const content = markdown.toContent(fixture.sourceMd);
    const resultHtml = html.toText(content);

    assertHTMLEqual(resultHtml, fixture.sourceHtml);
}

function testMdIdempotence(fixture) {
    const content1 = markdown.toContent(fixture.sourceMd);
    const backToMd = markdown.toText(content1);
    const content2 = markdown.toContent(backToMd);

    const resultHtml1 = html.toText(content1);
    const resultHtml2 = html.toText(content2);
    assertHTMLEqual(resultHtml1, resultHtml2);
}

function readFixture(filename) {
    const htmlFilePath = `${path.basename(filename, ".md")}.html`;

    const sourceMd = fs.readFileSync(path.resolve(FIXTURES, filename), "utf8");
    const sourceHtml = fs.readFileSync(path.resolve(FIXTURES, htmlFilePath), "utf8");

    return {
        sourceMd: sourceMd,
        sourceHtml: sourceHtml,
    };
}
