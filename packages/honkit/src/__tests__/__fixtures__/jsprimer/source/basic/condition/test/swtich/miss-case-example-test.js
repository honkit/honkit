const assert = require("assert");
const strictEval = require("strict-eval");
const fs = require("fs");
const path = require("path");
const Code = fs.readFileSync(path.join(__dirname, "../../src/switch/miss-case-example.js"), "utf-8");
describe("switch-example", function() {
    it("should output \"ECMAScript 2015\"", function() {
        const actualLogs = [];
        const console = {
            log(message) {
                actualLogs.push(message);
            }
        };
        strictEval(Code, {
            console
        });
        assert.deepEqual(actualLogs, [
            "ECMAScript 2015",
            "ECMAScript 2016",
            "しらないバージョンです"
        ]);
    });
});
