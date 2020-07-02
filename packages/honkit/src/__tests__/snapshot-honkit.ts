import path from "path";
import { directorySnapshot } from "./directorySnapshot.helper";

const bin = require("../bin.js");
it("HonKit snapshots", async () => {
    jest.setTimeout(60 * 1000);
    const bookDir = path.join(__dirname, "__fixtures__/honkit");
    const outputDir = path.join(__dirname, "__fixtures__/honkit/_book");
    await bin.run([process.argv[0], ".", "build", bookDir]);
    const outputs = await directorySnapshot(outputDir, content => {
        return content.replace(/gitbook\.page\.hasChanged\(.*\);/g, ``);
    });
    expect(outputs).toMatchSnapshot("honkit");
});
