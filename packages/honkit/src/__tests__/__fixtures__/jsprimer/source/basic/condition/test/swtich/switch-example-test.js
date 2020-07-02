const assert = require("assert");
const strictEval = require("strict-eval");
const fs = require("fs");
const path = require("path");
const Code = fs.readFileSync(path.join(__dirname, "../../src/switch/switch-example.js"), "utf-8");
describe("switch-example", function() {
    it("should output \"ECMAScript 2015\"", function() {
        const  expectedMessage = "ECMAScript 2015";
        const console = {
            log(message) {
                assert.equal(message, expectedMessage);
            }
        };
        strictEval(Code, {
            console
        });
    });
});
