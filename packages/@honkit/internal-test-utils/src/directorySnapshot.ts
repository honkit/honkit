import path from "path";
import fs, { Dirent } from "fs";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

async function* getFiles(dir: string): AsyncIterable<{ dirent: Dirent; filePath: string }> {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const filePath = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(filePath);
        } else {
            yield {
                dirent,
                filePath
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

export async function* iterateDirectoryContents({
    baseDir,
    allowExtensions,
    maskContent = defaultMask
}: {
    baseDir: string;
    allowExtensions: string[];
    maskContent?: (content: string) => string;
}) {
    for await (const item of getFiles(baseDir)) {
        const { dirent, filePath } = item;
        if (!allowExtensions.includes(path.extname(filePath))) {
            continue;
        }
        const isFile = dirent.isFile();
        const contents = maskContent(isFile ? (await readFile(filePath)).toString() : "");
        yield {
            stats: {
                isDirectory: dirent.isDirectory(),
                isFile: isFile,
                isSymbolicLink: dirent.isSymbolicLink(),
                isSocket: dirent.isSocket()
            },
            // normalize file path
            filePath: path.relative(baseDir, filePath).split(path.sep).join("/"),
            contents
        };
    }
}
