import path from "path";
import fs from "fs";
import os from "os";
import { spawn, ChildProcess } from "child_process";

/**
 * Integration tests for honkit serve rebuild behavior
 *
 * These tests verify that:
 * 1. SUMMARY.md changes trigger full rebuild and generate new pages
 * 2. New file additions are detected and processed
 *
 * This is a black-box test that starts serve, modifies files, and checks output.
 */

jest.setTimeout(60000);

describe("serve integration", () => {
    let tempDir: string;
    let outputDir: string;
    let serveProcess: ChildProcess | null = null;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "honkit-serve-test-"));
        outputDir = path.join(tempDir, "_book");
    });

    afterEach(async () => {
        // Kill serve process
        if (serveProcess && !serveProcess.killed) {
            serveProcess.kill("SIGKILL");
            await new Promise<void>((resolve) => {
                serveProcess?.on("exit", resolve);
                setTimeout(resolve, 1000);
            });
        }
        serveProcess = null;

        // Cleanup temp directory
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

    function startServe(): Promise<void> {
        return new Promise((resolve, reject) => {
            const binPath = path.resolve(__dirname, "../../../bin/honkit.js");

            // Use port 0 to let OS assign an available port
            serveProcess = spawn(process.execPath, [binPath, "serve", tempDir, outputDir, "--port", "0", "--lrport", "0"], {
                stdio: ["pipe", "pipe", "pipe"],
                env: { ...process.env }
            });

            let started = false;

            const checkStarted = (output: string) => {
                if (output.includes("Serving book on") && !started) {
                    started = true;
                    // Wait a bit for initial build to complete
                    setTimeout(resolve, 1000);
                }
            };

            serveProcess.stdout?.on("data", (data) => {
                checkStarted(data.toString());
            });

            serveProcess.stderr?.on("data", (data) => {
                // HonKit outputs to stderr for info/warn
                checkStarted(data.toString());
            });

            serveProcess.on("error", reject);

            // Timeout after 10 seconds
            setTimeout(() => {
                if (!started) {
                    reject(new Error("Timeout waiting for serve to start"));
                }
            }, 10000);
        });
    }

    function waitForFile(filePath: string, timeoutMs: number = 15000): Promise<void> {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const check = () => {
                if (fs.existsSync(filePath)) {
                    resolve();
                } else if (Date.now() - startTime > timeoutMs) {
                    reject(new Error(`Timeout waiting for file: ${filePath}`));
                } else {
                    setTimeout(check, 200);
                }
            };

            check();
        });
    }

    describe("file watching and rebuild", () => {
        it("should generate new page when SUMMARY.md is updated during serve", async () => {
            createBookStructure();
            await startServe();

            // Verify initial build - only index.html
            expect(getOutputFiles()).toContain("index.html");
            expect(getOutputFiles()).not.toContain("chapter1.html");

            // Add chapter1.md
            fs.writeFileSync(
                path.join(tempDir, "chapter1.md"),
                `# Chapter 1

This is chapter 1.
`
            );

            // Update SUMMARY.md to include chapter1
            fs.writeFileSync(
                path.join(tempDir, "SUMMARY.md"),
                `# Summary

* [Introduction](README.md)
* [Chapter 1](chapter1.md)
`
            );

            // Wait for rebuild
            await waitForFile(path.join(outputDir, "chapter1.html"));

            // Verify chapter1.html was generated
            expect(getOutputFiles()).toContain("chapter1.html");
        });

        it("should copy new asset file when added during serve", async () => {
            createBookStructure();
            await startServe();

            // Verify initial state
            expect(getOutputFiles()).not.toContain("notes.md");

            // Add new asset file (not in SUMMARY.md)
            fs.writeFileSync(
                path.join(tempDir, "notes.md"),
                `# Notes

These are my notes.
`
            );

            // Wait for the asset to be copied
            await waitForFile(path.join(outputDir, "notes.md"));

            // Verify asset was copied
            expect(getOutputFiles()).toContain("notes.md");
        });
    });
});
