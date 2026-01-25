import path from "path";
import fs from "fs";
import os from "os";
import watch from "../watch";
import type { FSWatcher } from "chokidar";

describe("watch", () => {
    // Increase timeout for file system operations
    jest.setTimeout(15000);

    let tempDir: string;
    let watchers: FSWatcher[] = [];

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "honkit-watch-test-"));
    });

    afterEach(async () => {
        // Close all watchers
        await Promise.all(watchers.map((w) => w.close()));
        watchers = [];

        // Cleanup temp directory
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    function createFile(relativePath: string, content: string = "# Test") {
        const filePath = path.join(tempDir, relativePath);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, content);
        return filePath;
    }

    function modifyFile(relativePath: string, content: string) {
        const filePath = path.join(tempDir, relativePath);
        fs.writeFileSync(filePath, content);
        return filePath;
    }

    /**
     * Wait for watcher to be ready and stable
     */
    async function waitForReady(watcher: FSWatcher): Promise<void> {
        await new Promise<void>((resolve) => {
            watcher.on("ready", resolve);
        });
        // Give the watcher a moment to stabilize after ready event
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    /**
     * Wait for a file change to be detected that matches the predicate
     */
    function waitForChange(
        watcher: FSWatcher,
        predicate: (filepath: string) => boolean,
        timeoutMs: number = 10000
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Timeout waiting for file change after ${timeoutMs}ms`));
            }, timeoutMs);

            const handler = (_event: string, filepath: string) => {
                const fullPath = path.resolve(tempDir, filepath);
                if (predicate(fullPath)) {
                    clearTimeout(timeout);
                    watcher.off("all", handler);
                    resolve(fullPath);
                }
            };
            watcher.on("all", handler);
        });
    }

    describe("issue #491 - custom output folder handling", () => {
        it("should detect changes in custom output folder when not specified in options", async () => {
            createFile("README.md", "# README");
            createFile("output/orphan.md", "# Orphan in output folder");

            const detectedFiles: string[] = [];

            // Start watching WITHOUT specifying output folder
            const watcher = watch({
                watchDir: tempDir,
                callback: (error, filepath) => {
                    if (error) return;
                    detectedFiles.push(filepath!);
                }
            });
            watchers.push(watcher);

            await waitForReady(watcher);

            // Modify file in output folder and wait for detection
            modifyFile("output/orphan.md", "# Modified");
            const detected = await waitForChange(watcher, (f) => f.includes("output/orphan.md"));

            expect(detected).toContain("output/orphan.md");
        });

        it("should NOT detect changes in custom output folder when specified in options", async () => {
            createFile("README.md", "# README");
            createFile("output/orphan.md", "# Orphan in output folder");

            const detectedFiles: string[] = [];

            // Start watching WITH output folder specified - it should be ignored
            const watcher = watch({
                watchDir: tempDir,
                outputFolder: "output",
                callback: (error, filepath) => {
                    if (error) return;
                    detectedFiles.push(filepath!);
                }
            });
            watchers.push(watcher);

            await waitForReady(watcher);

            // Modify both files - output should be ignored, README should be detected
            modifyFile("output/orphan.md", "# Modified");
            modifyFile("README.md", "# Modified README");

            // Wait for README change to be detected (proves watcher is working)
            await waitForChange(watcher, (f) => f.includes("README.md"));

            // Verify output folder change was NOT detected
            const outputChanges = detectedFiles.filter((f) => f.includes("output/"));
            expect(outputChanges).toHaveLength(0);
        });

        it("should handle absolute output folder paths", async () => {
            createFile("README.md", "# README");
            createFile("docs-output/file.md", "# File");

            const detectedFiles: string[] = [];
            const absoluteOutputPath = path.join(tempDir, "docs-output");

            const watcher = watch({
                watchDir: tempDir,
                outputFolder: absoluteOutputPath,
                callback: (error, filepath) => {
                    if (error) return;
                    detectedFiles.push(filepath!);
                }
            });
            watchers.push(watcher);

            await waitForReady(watcher);

            // Modify both files
            modifyFile("docs-output/file.md", "# Modified");
            modifyFile("README.md", "# Modified README");

            // Wait for README change
            await waitForChange(watcher, (f) => f.includes("README.md"));

            // Verify docs-output was NOT detected
            const outputChanges = detectedFiles.filter((f) => f.includes("docs-output/"));
            expect(outputChanges).toHaveLength(0);
        });
    });

    describe("default _book folder", () => {
        it("should NOT detect changes in _book folder", async () => {
            createFile("file1.md", "# File 1");
            createFile("file2.md", "# File 2");
            createFile("_book/output.md", "# Output");

            const detectedFiles: string[] = [];

            const watcher = watch({
                watchDir: tempDir,
                callback: (error, filepath) => {
                    if (error) return;
                    detectedFiles.push(filepath!);
                }
            });
            watchers.push(watcher);

            await waitForReady(watcher);

            // First modify file1 to ensure watcher is working
            modifyFile("file1.md", "# Modified File 1");
            await waitForChange(watcher, (f) => f.includes("file1.md"));

            // Now modify _book file (should be ignored)
            modifyFile("_book/output.md", "# Modified");

            // Modify file2 to confirm watcher still works
            modifyFile("file2.md", "# Modified File 2");
            await waitForChange(watcher, (f) => f.includes("file2.md"));

            // Verify _book was NOT detected
            const bookChanges = detectedFiles.filter((f) => f.includes("_book"));
            expect(bookChanges).toHaveLength(0);
        });
    });

    describe("source files", () => {
        it("should detect changes to markdown files in source directory", async () => {
            createFile("README.md", "# README");
            createFile("orphan.md", "# Orphan - not in SUMMARY");

            const watcher = watch({
                watchDir: tempDir,
                callback: () => {}
            });
            watchers.push(watcher);

            await waitForReady(watcher);

            modifyFile("orphan.md", "# Modified orphan");

            const detected = await waitForChange(watcher, (f) => f.includes("orphan.md"));
            expect(detected).toContain("orphan.md");
        });
    });
});
