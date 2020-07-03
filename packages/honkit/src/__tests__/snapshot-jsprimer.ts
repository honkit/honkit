import path from "path";
import { directorySnapshot } from "./directorySnapshot.helper";

const bin = require("../bin.js");

// This test is heavy and window can not output same result
test("jsprimer snapshots", async () => {
    if (process.env.TEST_TYPE !== "full") {
        return;
    }
    jest.setTimeout(60 * 1000);
    const bookDir = path.join(__dirname, "__fixtures__/jsprimer");
    const outputDir = path.join(__dirname, "__fixtures__/jsprimer/_book");
    await bin.run([process.argv[0], ".", "build", bookDir]);
    const outputs = await directorySnapshot(outputDir, (content) => {
        return content.replace(/gitbook\.page\.hasChanged\(.*\);/g, ``);
    });
    expect(outputs).toMatchSnapshot("jsprimer");
});
