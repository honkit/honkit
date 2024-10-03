import { loadHtml } from '@honkit/html';
import tmp from "tmp";
import path from "path";
import fs from "fs";

import inlineSvg from "../inlineSvg";

describe("inlineSvg", () => {
    let dir;
    let svgPath;
    beforeEach(() => {
        dir = tmp.dirSync();
        svgPath = path.join(dir.name, "test.svg");
    });

    test("should inline svg icons", () => {
        const svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" version="1.1"><rect width="200" height="100" stroke-width="6"/></svg>';
        const $ = loadHtml('<img src="test.svg"/>');
        return fs.promises
            .writeFile(svgPath, svg)
            .then(() => {
                return inlineSvg(dir.name, "index.html", $);
            })
            .then(() => {
                expect($("svg").attr("fill")).toBe("currentColor");
            });
    });

    test("should not inline svgs with style tags", () => {
        const svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" version="1.1" style="background-color:red"><rect width="200" height="100" stroke="black" stroke-width="6" fill="green"/></svg>';
        const $ = loadHtml('<img src="test.svg"/>');
        return fs.promises
            .writeFile(svgPath, svg)
            .then(() => {
                return inlineSvg(dir.name, "index.html", $);
            })
            .then(() => {
                expect($("svg").length).toBe(0);
            });
    });
});
