import Page from "../../../models/page";
import modifyHTML from "../modifyHTML";

// https://github.com/honkit/honkit/issues/417
// HTML void elements must not acquire end tags when page modifiers serialize them.
describe("modifyHTML", () => {
    test("keeps void elements and the following text as siblings", async () => {
        const html = '<p>first<br>second<img src="image.png">third<input value="x">fourth</p><hr>';
        const page = new Page({ content: html });
        const result = await modifyHTML(page, []);
        expect(result.getContent()).toBe(html);
    });
    test.each(["script", "style"])("preserves literal hexadecimal references in %s", async (tag) => {
        const html = `<${tag}>const example = "&#xA9; &#x110000;";</${tag}>`;
        const result = await modifyHTML(new Page({ content: html }), []);
        expect(result.getContent()).toBe(html);
    });

    test("preserves escaped text and intentional markup in noscript", async () => {
        const html = '<noscript>Press &lt;Enter&gt; <b>now</b><br>Continue.</noscript>';
        const result = await modifyHTML(new Page({ content: html }), []);
        expect(result.getContent()).toBe(html);
    });
});
