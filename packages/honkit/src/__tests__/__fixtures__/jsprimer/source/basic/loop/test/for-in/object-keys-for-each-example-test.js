const assert = require("assert");
const strictEval = require("strict-eval");
const fs = require("fs");
const path = require("path");
const Code = fs.readFileSync(require.resolve("../../src/for-in/object-keys-for-each-example.js"), "utf-8");
describe("object-keys-for-each", function() {
    it("オブジェクトのkey:valueが列挙される", function() {
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
            "key:a, value:1",
            "key:b, value:2",
            "key:c, value:3",
        ]);
    });
});
