import path from "path";
import fs from "fs";
import os from "os";
import { run } from "../../bin";
import { iterateDirectoryContents } from "@honkit/internal-test-utils";

/**
 * Integration tests for honkit build output
 *
 * These tests use bin.run to execute the CLI and verify:
 * 1. New files added to SUMMARY.md are correctly generated
 * 2. Assets not in SUMMARY.md are copied correctly
 * 3. Output structure matches expected snapshot
 *
 * This is a black-box test that only checks input (book files) and output (generated files).
 */

jest.setTimeout(60000);

describe("build integration", () => {
    let tempDir: string;
    let outputDir: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "honkit-build-test-"));
        outputDir = path.join(tempDir, "_book");
    });

    afterEach(() => {
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    function createBookStructure() {
        fs.writeFileSync(
            path.join(tempDir, "README.md"),
            `# Test Book

Welcome to the test book.
`
        );

        fs.writeFileSync(
            path.join(tempDir, "SUMMARY.md"),
            `# Summary

* [Introduction](README.md)
`
        );
    }

    async function buildBook() {
        await run([process.argv[0], "honkit", "build", tempDir, outputDir, "--reload"]);
    }

    function getOutputFiles(): string[] {
        if (!fs.existsSync(outputDir)) return [];

        const files: string[] = [];
        const walk = (dir: string, prefix: string = "") => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
                if (entry.isDirectory()) {
                    walk(path.join(dir, entry.name), relativePath);
                } else {
                    files.push(relativePath);
                }
            }
        };
        walk(outputDir);
        return files.sort();
    }

    describe("build output with bin.run", () => {
        it("should generate index.html for README.md", async () => {
            createBookStructure();
            await buildBook();

            const files = getOutputFiles();
            expect(files).toContain("index.html");
        });

        it("should generate chapter page when added to SUMMARY.md", async () => {
            createBookStructure();

            // Add chapter
            fs.writeFileSync(
                path.join(tempDir, "chapter1.md"),
                `# Chapter 1

This is chapter 1.
`
            );

            fs.writeFileSync(
                path.join(tempDir, "SUMMARY.md"),
                `# Summary

* [Introduction](README.md)
* [Chapter 1](chapter1.md)
`
            );

            await buildBook();

            const files = getOutputFiles();
            expect(files).toContain("index.html");
            expect(files).toContain("chapter1.html");
        });

        it("should copy asset file not in SUMMARY.md", async () => {
            createBookStructure();

            // Add asset file (not in SUMMARY)
            fs.writeFileSync(
                path.join(tempDir, "notes.md"),
                `# Notes

These are my notes.
`
            );

            await buildBook();

            const files = getOutputFiles();
            expect(files).toContain("index.html");
            expect(files).toContain("notes.md"); // Copied as asset
        });

        it("should match expected output structure", async () => {
            createBookStructure();

            fs.writeFileSync(
                path.join(tempDir, "chapter1.md"),
                `# Chapter 1

Content of chapter 1.
`
            );

            fs.writeFileSync(
                path.join(tempDir, "SUMMARY.md"),
                `# Summary

* [Introduction](README.md)
* [Chapter 1](chapter1.md)
`
            );

            await buildBook();

            const files = getOutputFiles();

            // Filter out gitbook files and search index for cleaner snapshot
            const relevantFiles = files.filter(
                (f) => !f.startsWith("gitbook/") && !f.includes("search_index") && !f.includes("lunr")
            );

            expect(relevantFiles).toMatchSnapshot("output-structure");
        });

        it("should generate correct HTML content", async () => {
            createBookStructure();

            fs.writeFileSync(
                path.join(tempDir, "chapter1.md"),
                `# Chapter 1

Content of chapter 1.
`
            );

            fs.writeFileSync(
                path.join(tempDir, "SUMMARY.md"),
                `# Summary

* [Introduction](README.md)
* [Chapter 1](chapter1.md)
`
            );

            await buildBook();

            // Use iterateDirectoryContents like snapshot-honkit.ts
            const maskContent = (content: string) => {
                return content
                    .replace(/gitbook\.page\.hasChanged\(.*\);/g, "")
                    .replace(/<meta name="generator" content="HonKit .*">/g, "")
                    .replace(tempDir, "<TEMP_DIR>");
            };

            for await (const item of iterateDirectoryContents({
                baseDir: outputDir,
                allowExtensions: [".html"],
                maskContent
            })) {
                // Only snapshot key pages, not all gitbook assets
                if (item.filePath === "index.html" || item.filePath === "chapter1.html") {
                    expect(item).toMatchSnapshot(item.filePath);
                }
            }
        });
    });
});
