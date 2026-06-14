import nodeFs from "fs/promises";
import nodeFsSync from "fs";
import os from "os";
import path from "path";
import fs from "../fs";

describe("fs", () => {
    const createdPaths: string[] = [];
    let tmpDir: string;

    beforeAll(() => {
        try {
            tmpDir = nodeFsSync.realpathSync.native(os.tmpdir());
        } catch {
            tmpDir = os.tmpdir();
        }
    });

    afterEach(async () => {
        await Promise.all(createdPaths.splice(0).map((createdPath) => nodeFs.rm(createdPath, { recursive: true, force: true })));
    });

    test("tmpDir creates a temporary directory", async () => {
        const dir = await fs.tmpDir();
        createdPaths.push(dir);

        expect(path.dirname(dir)).toBe(tmpDir);
        expect(path.basename(dir).startsWith("honkit-")).toBe(true);
        await expect(nodeFs.stat(dir)).resolves.toMatchObject({ isDirectory: expect.any(Function) });
    });

    test("tmpFile creates a temporary file", async () => {
        const file = await fs.tmpFile();
        createdPaths.push(file);

        expect(path.dirname(file)).toBe(tmpDir);
        expect(path.basename(file).startsWith("honkit-")).toBe(true);
        await expect(nodeFs.stat(file)).resolves.toMatchObject({ isFile: expect.any(Function) });
    });
});
