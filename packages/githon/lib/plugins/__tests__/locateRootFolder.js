const path = require("path");
const locateRootFolder = require("../locateRootFolder");

describe("locateRootFolder", () => {
    test.skip("should correctly resolve the node_modules for gitbook", () => {
        expect(locateRootFolder()).toBe(path.resolve(__dirname, "../../../"));
    });
});
