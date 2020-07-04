import path from "path";
import { iterateDirectoryContents } from "@honkit/internal-test-utils";

const spawn = require("cross-spawn");
it("jsprimer snapshots", async () => {
    jest.setTimeout(60 * 1000);
    const outputDir = path.join(__dirname, "../_book");
    spawn.sync("npm", ["run", "build"], { stdio: "inherit" });
    const maskContent = (content) => {
        return content.replace(/gitbook\.page\.hasChanged\(.*\);/g, ``);
    };
    for await (const item of iterateDirectoryContents({
        baseDir: outputDir,
        allowExtensions: [".html"],
        maskContent
    })) {
        expect(item).toMatchSnapshot(item.filePath);
    }
});
