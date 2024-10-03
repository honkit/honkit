import { loadHtml } from '@honkit/html';
import Promise from "../../../utils/promise";
import highlightCode from "../highlightCode";

describe("highlightCode", () => {
    function doHighlight(lang, code) {
        return {
            text: `${lang || ""}$${code}`
        };
    }

    function doHighlightAsync(lang, code) {
        return Promise().then(() => {
            return doHighlight(lang, code);
        });
    }

    test("should call it for normal code element", () => {
        const $ = loadHtml("<p>This is a <code>test</code></p>");

        return highlightCode(doHighlight, $).then(() => {
            const $code = $("code");
            expect($code.text()).toBe("$test");
        });
    });

    test("should call it for markdown code block", () => {
        const $ = loadHtml("<pre><code class=\"lang-js\">test</code></pre>");

        return highlightCode(doHighlight, $).then(() => {
            const $code = $("code");
            expect($code.text()).toBe("js$test");
        });
    });

    test("should call it for asciidoc code block", () => {
        const $ = loadHtml("<pre><code class=\"language-python\">test</code></pre>");

        return highlightCode(doHighlight, $).then(() => {
            const $code = $("code");
            expect($code.text()).toBe("python$test");
        });
    });

    test("should accept async highlighter", () => {
        const $ = loadHtml("<pre><code class=\"language-python\">test</code></pre>");

        return highlightCode(doHighlightAsync, $).then(() => {
            const $code = $("code");
            expect($code.text()).toBe("python$test");
        });
    });
});
