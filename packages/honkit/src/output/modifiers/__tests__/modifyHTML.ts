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
});
