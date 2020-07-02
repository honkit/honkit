const assert = require("assert");
const strictEval = require("strict-eval");
const fs = require("fs");
const path = require("path");
const Code = fs.readFileSync(path.join(__dirname, "../../src/if/leap-year-flat-example.js"), "utf-8");
const testLeapYear = (year, expectedMessage) => {
    const MockDate = class MockDate {
        getFullYear() {
            return year;
        }
    };
    const console = {
        log(message) {
            assert.equal(message, expectedMessage(year), `year: ${year}`);
        }
    };
    strictEval(Code, {
        Date: MockDate,
        console
    });
};
describe("leap-year-flat", function() {
    context("うるう年であるならば", function() {
        it("should return \"うるう年です\"", function() {
            const message = (year) => `${year}年はうるう年です`;
            testLeapYear(0, message);
            testLeapYear(4, message);
            testLeapYear(400, message);
            testLeapYear(2000, message);
            testLeapYear(2016, message);
            testLeapYear(1289031804, message);
        });
    });
    context("うるう年でないならば", function() {
        it("should return \"うるう年ではありません\"", function() {
            const message = (year) => `${year}年はうるう年ではありません`;
            testLeapYear(100, message);
            testLeapYear(200, message);
            testLeapYear(1234, message);
            testLeapYear(2100, message);
        });
    });
});
