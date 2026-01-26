import path from "path";
import fs from "fs";
import os from "os";
import Parse from "../../parse";
import Output from "../../output";
import Book from "../../models/book";
import createNodeFS from "../../fs/node";
import watch, { WatchEventType } from "../watch";
import { shouldFullRebuild, isStructureFile } from "../shouldFullRebuild";

/**
 * Integration tests for honkit serve rebuild logic
 *
 * These tests verify that:
 * 1. New files added during serve trigger full rebuild
 * 2. SUMMARY.md changes trigger full rebuild
 * 3. Regular .md changes trigger incremental rebuild
 */

jest.setTimeout(30000);

describe("serve rebuild logic", () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "honkit-serve-test-"));
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

    async function buildBook(): Promise<{ output: any; files: string[] }> {
        const nodeFS = createNodeFS(tempDir);
        const book = Book.createForFS(nodeFS);
        const parsedBook = await Parse.parseBook(book);
        const Generator = Output.getGenerator("website");
        const outputDir = path.join(tempDir, "_book");

        const output = await Output.generate(Generator, parsedBook, {
            root: outputDir
        });

        const files = getOutputFiles(outputDir);
        return { output, files };
    }

    function getOutputFiles(outputDir: string): string[] {
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

    describe("shouldFullRebuild function", () => {
        it("should trigger full rebuild for SUMMARY.md change", () => {
            const filepath = path.join(tempDir, "SUMMARY.md");
            // When SUMMARY.md is changed (not added), shouldFullRebuild returns true
            expect(shouldFullRebuild(filepath, "change")).toBe(true);
        });

        it("should trigger full rebuild for new file addition", () => {
            const filepath = path.join(tempDir, "newfile.md");
            // When any file is added, shouldFullRebuild returns true
            expect(shouldFullRebuild(filepath, "add")).toBe(true);
        });

        it("should trigger incremental build for existing file change", () => {
            const filepath = path.join(tempDir, "README.md");
            // When a regular file is changed, shouldFullRebuild returns false
            expect(shouldFullRebuild(filepath, "change")).toBe(false);
        });

        it("should trigger full rebuild for GLOSSARY.md change", () => {
            const filepath = path.join(tempDir, "GLOSSARY.md");
            expect(shouldFullRebuild(filepath, "change")).toBe(true);
        });

        it("should trigger full rebuild for book.json change", () => {
            const filepath = path.join(tempDir, "book.json");
            expect(shouldFullRebuild(filepath, "change")).toBe(true);
        });

        it("should identify structure files correctly", () => {
            expect(isStructureFile("/path/to/SUMMARY.md")).toBe(true);
            expect(isStructureFile("/path/to/GLOSSARY.md")).toBe(true);
            expect(isStructureFile("/path/to/book.json")).toBe(true);
            expect(isStructureFile("/path/to/book.js")).toBe(true);
            expect(isStructureFile("/path/to/README.md")).toBe(false);
            expect(isStructureFile("/path/to/chapter.md")).toBe(false);
        });
    });

    describe("build output", () => {
        it("should generate index.html for README.md", async () => {
            createBookStructure();
            const { files } = await buildBook();

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

            const { files } = await buildBook();

            expect(files).toContain("index.html");
            expect(files).toContain("chapter1.html");
        });

        it("should copy asset file not in SUMMARY.md", async () => {
            createBookStructure();

            // Add asset file (not in SUMMARY)
            fs.writeFileSync(path.join(tempDir, "notes.md"), `# Notes

These are my notes.
`);

            const { files } = await buildBook();

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

            const { files } = await buildBook();

            // Filter out gitbook files and search index for cleaner snapshot
            const relevantFiles = files.filter(
                (f) => !f.startsWith("gitbook/") && !f.includes("search_index") && !f.includes("lunr")
            );

            expect(relevantFiles).toMatchSnapshot("output-structure");
        });
    });

    describe("watch event detection", () => {
        it("should detect file changes via watch", async () => {
            createBookStructure();

            const detectedEvents: Array<{ filepath: string; eventType: WatchEventType }> = [];

            const watcher = watch({
                watchDir: tempDir,
                callback: (error, filepath, eventType) => {
                    if (!error && filepath && eventType) {
                        detectedEvents.push({ filepath, eventType });
                    }
                }
            });

            // Wait for watcher to be ready
            await new Promise<void>((resolve) => {
                watcher.on("ready", resolve);
            });
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Add new file
            fs.writeFileSync(path.join(tempDir, "newfile.md"), "# New File");
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Modify existing file
            fs.writeFileSync(path.join(tempDir, "README.md"), "# Modified README");
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await watcher.close();

            // Check that we detected the add event
            const addEvents = detectedEvents.filter((e) => e.eventType === "add");
            const changeEvents = detectedEvents.filter((e) => e.eventType === "change");

            expect(addEvents.length).toBeGreaterThan(0);
            expect(changeEvents.length).toBeGreaterThan(0);

            // Verify the add event was for newfile.md
            const newFileEvent = addEvents.find((e) => e.filepath.includes("newfile.md"));
            expect(newFileEvent).toBeDefined();
        });
    });
});
