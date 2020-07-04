import path from "path";
import { directorySnapshot } from "./directorySnapshot.helper";

const bin = require("../bin.js");

describe("jsprimer snapshots", () => {
    // This test is heavy and windows can not output same result
    // TODO: skip it without yarn run test:full
    if (process.env.TEST_TYPE === "full") {
        it.skip("skip snapshot because TEST_TYPE:" + process.env.TEST_TYPE || "none", () => {});
    } else {
        it("snapshot testing", async () => {
            jest.setTimeout(60 * 1000);
            const bookDir = path.join(__dirname, "__fixtures__/jsprimer");
            const outputDir = path.join(__dirname, "__fixtures__/jsprimer/_book");
            await bin.run([process.argv[0], ".", "build", bookDir]);
            const maskContent = (content) => {
                return content.replace(/gitbook\.page\.hasChanged\(.*\);/g, ``);
            };
            for await (const item of directorySnapshot(outputDir, maskContent)) {
                expect(item).toMatchSnapshot(item.filePath);
            }
        });
    }
});
