import path from "path";
import fs from "fs";
import { iterateDirectoryContents } from "@honkit/internal-test-utils";
import * as bin from "../bin";

it("Pretty URLs snapshots", async () => {
    const bookDir = path.join(__dirname, "__fixtures__/pretty-urls");
    const outputDir = path.join(__dirname, "__fixtures__/pretty-urls/_book");
    await bin.run([process.argv[0], ".", "build", bookDir, "--reload"]);

    // output files are still .html (not directory/index.html)
    expect(fs.existsSync(path.join(outputDir, "guide.html"))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, "index.html"))).toBe(true);

    // links in HTML should use extensionless URLs
    const indexHtml = fs.readFileSync(path.join(outputDir, "index.html"), "utf8");
    expect(indexHtml).toContain('href="guide"');
    expect(indexHtml).not.toMatch(/href="guide\.html"/);

    const maskContent = (content) => {
        return content
            .replace(/gitbook\.page\.hasChanged\(.*\);/g, "")
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
