import path from "path";
import { iterateDirectoryContents } from "@honkit/internal-test-utils";

const honkitBin = require.resolve(".bin/honkit");
const spawn = require("cross-spawn");
it("jsprimer snapshots", async () => {
    const outputDir = path.join(__dirname, "../_book");
    spawn.sync(honkitBin, ["build", "--reload"], {
        cwd: path.join(__dirname, ".."),
        stdio: "inherit"
    });
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
