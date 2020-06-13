const assert = require("assert");
const strictEval = require("strict-eval");
const fs = require("fs");
const Code = fs.readFileSync(require.resolve("../../src/do-while/do-while-example.js"), "utf-8");
describe("do-while", function() {
    it("最初の条件を関係なく一度実行される", function() {
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
            1000
        ]);
    });
});
