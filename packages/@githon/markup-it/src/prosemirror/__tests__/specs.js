import fs from "fs";
import path from "path";

import encode from "../encode";
import JSONUtils from "../../json";

const FIXTURES = path.resolve(__dirname, "specs");

const files = fs.readdirSync(FIXTURES);

describe("encode", () => {
    files.forEach((file) => {
        if (path.extname(file) !== ".js") return;

        it(file, () => {
            const content = require(path.join(FIXTURES, file));
            const contentState = JSONUtils.decode(content.json);

            encode(contentState).should.deepEqual(content.prosemirror);
        });
    });
});

describe("decode", () => {
    files.forEach((file) => {
        if (path.extname(file) !== ".md") return;

        it(file, () => {});
    });
});
