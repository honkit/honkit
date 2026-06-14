import nodeFs from "fs/promises";
import os from "os";
import path from "path";
import fs from "../fs";

describe("fs", () => {
    let rootDir: string;

    beforeEach(async () => {
        rootDir = await nodeFs.mkdtemp(path.join(os.tmpdir(), "honkit-utils-fs-test-"));
    });

    afterEach(async () => {
        await nodeFs.rm(rootDir, { recursive: true, force: true });
    });

    test("tmpDir creates a temporary directory", async () => {
        const dir = await fs.tmpDir({ dir: rootDir, prefix: "dir-" });

        expect(path.dirname(dir)).toBe(rootDir);
        expect(path.basename(dir).startsWith("dir-")).toBe(true);
        await expect(nodeFs.stat(dir)).resolves.toMatchObject({ isDirectory: expect.any(Function) });
    });

    test("tmpFile creates a temporary file", async () => {
        const file = await fs.tmpFile({ dir: rootDir, prefix: "file-", postfix: ".txt" });

        expect(path.dirname(file)).toBe(rootDir);
        expect(path.basename(file).startsWith("file-")).toBe(true);
        expect(path.basename(file).endsWith(".txt")).toBe(true);
        await expect(nodeFs.stat(file)).resolves.toMatchObject({ isFile: expect.any(Function) });
    });
});
