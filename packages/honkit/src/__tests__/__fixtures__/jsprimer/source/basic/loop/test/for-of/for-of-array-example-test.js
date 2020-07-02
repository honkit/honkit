const assert = require("assert");
const strictEval = require("strict-eval");
const fs = require("fs");
const path = require("path");
const Code = fs.readFileSync(require.resolve("../../src/for-of/for-of-array-example"), "utf-8");
describe("for-of-array", function() {
    it("配列の値が列挙される", function() {
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
            1,
            2,
            3
        ]);
    });
});
