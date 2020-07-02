const assert = require("assert");
const strictEval = require("strict-eval");
const fs = require("fs");
const path = require("path");
const Code = fs.readFileSync(require.resolve("../../src/for-in/for-in-array-bug-example.js"), "utf-8");
describe("for-in-array", function() {
    it("配列の添字が列挙される", function() {
        const actualLogs = [];
        const console = {
            log(message) {
                actualLogs.push(message);
            }
        };
        strictEval(Code, {
            console
        });
        // 文字列であるため
        assert.deepEqual(actualLogs, [
            "001"
        ]);
    });
});
