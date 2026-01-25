import path from "path";
import fs from "fs";
import os from "os";
import watch from "../watch";
import type { FSWatcher } from "chokidar";

describe("watch", () => {
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

    describe("issue #491 - custom output folder handling", () => {
        /**
         * This test demonstrates the bug BEFORE the fix:
         * When using a custom output folder (not "_book") WITHOUT passing it to watch options,
         * changes to files inside that folder are detected by the watcher.
         */
        it("should detect changes in custom output folder when not specified in options (bug without fix)", (done) => {
            createFile("README.md", "# README");
            createFile("SUMMARY.md", "# Summary");
            createFile("output/orphan.md", "# Orphan in output folder");

            const detectedFiles: string[] = [];
            let resolved = false;

            // Start watching WITHOUT specifying output folder
            const watcher = watch(tempDir, (error, filepath) => {
                if (error || resolved) return;
                detectedFiles.push(filepath!);

                if (filepath!.includes("output/orphan.md")) {
                    resolved = true;
                    expect(detectedFiles.some((f) => f.includes("output/"))).toBe(true);
                    done();
                }
            });
            watchers.push(watcher);

            setTimeout(() => {
                modifyFile("output/orphan.md", "# Modified");
            }, 500);

            setTimeout(() => {
                if (!resolved) {
                    done(new Error("Expected output folder changes to be detected when not in options"));
                }
            }, 3000);
        });

        /**
         * This test verifies the fix:
         * When outputFolder is specified in options, it should be ignored by the watcher.
         */
        it("should NOT detect changes in custom output folder when specified in options (fix)", (done) => {
            createFile("README.md", "# README");
            createFile("SUMMARY.md", "# Summary");
            createFile("output/orphan.md", "# Orphan in output folder");

            const detectedFiles: string[] = [];

            // Start watching WITH output folder specified - it should be ignored
            const watcher = watch(
                tempDir,
                (error, filepath) => {
                    if (error) return;
                    detectedFiles.push(filepath!);
                },
                { outputFolder: "output" }
            );
            watchers.push(watcher);

            setTimeout(() => {
                modifyFile("output/orphan.md", "# Modified");
            }, 500);

            // Wait and verify output folder changes were NOT detected
            setTimeout(() => {
                const outputChanges = detectedFiles.filter((f) => f.includes("output/"));
                expect(outputChanges).toHaveLength(0);
                done();
            }, 2000);
        });

        /**
         * Test that absolute output folder paths are handled correctly.
         */
        it("should handle absolute output folder paths", (done) => {
            createFile("README.md", "# README");
            createFile("docs-output/file.md", "# File");

            const detectedFiles: string[] = [];
            const absoluteOutputPath = path.join(tempDir, "docs-output");

            // Pass absolute path
            const watcher = watch(
                tempDir,
                (error, filepath) => {
                    if (error) return;
                    detectedFiles.push(filepath!);
                },
                { outputFolder: absoluteOutputPath }
            );
            watchers.push(watcher);

            setTimeout(() => {
                modifyFile("docs-output/file.md", "# Modified");
            }, 500);

            setTimeout(() => {
                const outputChanges = detectedFiles.filter((f) => f.includes("docs-output/"));
                expect(outputChanges).toHaveLength(0);
                done();
            }, 2000);
        });
    });

    describe("default _book folder", () => {
        it("should NOT detect changes in _book folder", (done) => {
            createFile("README.md", "# README");
            createFile("_book/output.md", "# Output");

            const detectedFiles: string[] = [];

            const watcher = watch(tempDir, (error, filepath) => {
                if (error) return;
                detectedFiles.push(filepath!);
            });
            watchers.push(watcher);

            setTimeout(() => {
                modifyFile("_book/output.md", "# Modified");
            }, 500);

            setTimeout(() => {
                const bookChanges = detectedFiles.filter((f) => f.includes("_book"));
                expect(bookChanges).toHaveLength(0);
                done();
            }, 2000);
        });
    });

    describe("source files", () => {
        it("should detect changes to markdown files in source directory", (done) => {
            createFile("README.md", "# README");
            createFile("SUMMARY.md", "# Summary\n* [README](README.md)");
            createFile("orphan.md", "# Orphan - not in SUMMARY");

            let orphanDetected = false;

            const watcher = watch(tempDir, (error, filepath) => {
                if (error) return;
                if (filepath!.includes("orphan.md") && !filepath!.includes("_book") && !filepath!.includes("output")) {
                    orphanDetected = true;
                }
            });
            watchers.push(watcher);

            setTimeout(() => {
                modifyFile("orphan.md", "# Modified orphan");
            }, 500);

            setTimeout(() => {
                expect(orphanDetected).toBe(true);
                done();
            }, 2000);
        });
    });
});
