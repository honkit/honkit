import path from "path";
import fs from "fs";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

async function* getFiles(dir: string) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const filePath = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(filePath);
        } else {
            yield {
                dirent,
                filePath,
            };
        }
    }
}

export type directorySnapshotFile = {
    stats: {
        isDirectory: boolean;
        isFile: boolean;
        isSymbolicLink: boolean;
        isSocket: boolean;
    };
    filePath: string;
    contents: string;
};

const defaultMask = (s: string) => s;
export const directorySnapshot = async (basePath: string, maskContent: (content: string) => string = defaultMask) => {
    const results: directorySnapshotFile[] = [];
    const allowExtension = [".html"];
    for await (const item of getFiles(basePath)) {
        const { dirent, filePath } = item;
        if (!allowExtension.includes(path.extname(filePath))) {
            continue;
        }
        const isFile = dirent.isFile();
        // FIXME: windows and other output different result!
        const contents = maskContent(isFile ? (await readFile(filePath)).toString() : "");
        results.push({
            stats: {
                isDirectory: dirent.isDirectory(),
                isFile: isFile,
                isSymbolicLink: dirent.isSymbolicLink(),
                isSocket: dirent.isSocket(),
            },
            // normalize file path
            filePath: path.relative(basePath, filePath).split(path.sep).join("/"),
            contents,
        });
    }
    return {
        contents: results,
    };
};
