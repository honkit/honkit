import path from "path";
import { iterateDirectoryContents } from "@honkit/internal-test-utils";
import * as bin from "../bin";
it("HonKit snapshots", async () => {
    const bookDir = path.join(__dirname, "__fixtures__/honkit");
    const outputDir = path.join(__dirname, "__fixtures__/honkit/_book");
    await bin.run([process.argv[0], ".", "build", bookDir, "--reload"]);
    const maskContent = (content) => {
        return content
            .replace(/gitbook\.page\.hasChanged\(.*\);/g, ``)
            .replace(/<meta name="generator" content="HonKit .*">/g, "");
    };
    for await (const item of iterateDirectoryContents({
        baseDir: outputDir,
        allowExtensions: [".html"],
        maskContent
    })) {
        expect(item).toMatchSnapshot(item.filePath);
    }
}, 60 * 1000);
