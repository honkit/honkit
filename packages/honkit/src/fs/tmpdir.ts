import path from "path";
import os from "os";
import fs from "fs";

/**
 * Create a temporary directory with a real path
 * ebook-convert requires a real path to work
 * https://github.com/honkit/honkit/issues/394
 * @param prefix "honkit-"
 */
export const createTmpDirWithRealPath = (prefix: string = "honkit-") => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    return fs.realpathSync(tmpDir);
};
