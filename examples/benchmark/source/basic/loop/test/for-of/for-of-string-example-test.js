const assert = require("assert");
const strictEval = require("strict-eval");
const fs = require("fs");
const path = require("path");
const Code = fs.readFileSync(path.join(__dirname, "../../src/for-of/for-of-string-example.js"), "utf-8");
describe("for-of-string", function() {
    it("can handle サロゲートペア", function() {
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
            "𠮷",
            "野",
            "家"
        ]);
    });
});
