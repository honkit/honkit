import { loadHtml } from '@honkit/html';
import tmp from "tmp";

import svgToImg from "../svgToImg";

describe("svgToImg", () => {
    let dir;
    beforeEach(() => {
        dir = tmp.dirSync();
    });

    test("should write svg as a file", () => {
        const $ = loadHtml('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" version="1.1"><rect width="200" height="100" stroke="black" stroke-width="6" fill="green"/></svg>');

        return svgToImg(dir.name, "index.html", $).then(() => {
            const $img = $("img");
            const src = $img.attr("src");

            expect(dir.name).toHaveFile(src);
        });
    });

    it("should not write icon svg as a file", () => {
        const $ = loadHtml('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" version="1.1" fill="currentColor"><rect width="200" height="100" stroke-width="6"/></svg>');

        return svgToImg(dir.name, "index.html", $).then(() => {
            // @ts-expect-error
            expect($.contains("img")).toBe(false);
        });
    });
});
