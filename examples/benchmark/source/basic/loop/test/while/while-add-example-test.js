const assert = require("assert");
const strictEval = require("strict-eval");
const fs = require("fs");
const path = require("path");
const Code = fs.readFileSync(require.resolve("../../src/while/while-add-example.js"), "utf-8");
describe("whileの加算", function() {
    it("0以上から10未満の値を出力する", function() {
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
            `ループ開始前のxの値: ${0}`,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            `ループ終了後のxの値: ${10}`
        ]);
    });
});
