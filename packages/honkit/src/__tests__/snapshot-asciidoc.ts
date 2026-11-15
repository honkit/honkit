import path from "path";
import { iterateDirectoryContents } from "@honkit/internal-test-utils";
import * as bin from "../bin";

it("asciidoc snapshot", async () => {
    const bookDir = path.join(__dirname, "__fixtures__/asciidoc");
    const outputDir = path.join(__dirname, "__fixtures__/asciidoc/_book");
    await bin.run([process.argv[0], ".", "build", bookDir, "--reload"]);
    const maskContent = (content) => {
        return content
            .replace(/gitbook\.page\.hasChanged\(.*\);/g, ``)
            // The page context contains the build time and file mtime
            .replace(/(<script type="application\/json" id="honkit-page-context">).*(<\/script>)/g, "$1$2")
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
