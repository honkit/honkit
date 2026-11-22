import assert from "assert";
import { loadHtml, parse } from "../src/dom";

describe("HTML serialization", function() {
    const html = '<p>first<br>second<img src="image.png">third<input value="x">fourth</p><hr>';

    it("keeps void elements without end tags or extra wrappers", function() {
        assert.equal(loadHtml(html).html(), html);
    });

    it("keeps void elements when parsing a fragment", function() {
        assert.equal(parse(html).html(), html);
    });
    it("preserves literal script/style references and escaped noscript fallback", function() {
        const html = '<script>const sample = "&#xA9; &#x110000;";</script><style>.sample::after {content:"&#xA9; &#x110000;"}</style><noscript>Press &lt;Enter&gt; <b>now</b><br>Continue.</noscript>';
        assert.equal(loadHtml(html).html(), html);
        assert.equal(parse(html).html(), html);
    });
});
