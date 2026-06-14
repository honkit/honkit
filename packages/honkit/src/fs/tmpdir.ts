import path from "path";
import os from "os";
import fs from "fs";

const getRealTmpRoot = () => {
    try {
        return fs.realpathSync.native(os.tmpdir());
    } catch {
        return os.tmpdir();
    }
};

/**
 * Create a temporary directory with a real path
 * ebook-convert requires a real path to work
 * https://github.com/honkit/honkit/issues/394
 * @param prefix "honkit-"
 */
export const createTmpDirWithRealPath = (prefix: string = "honkit-") => {
    const tmpDir = fs.mkdtempSync(path.join(getRealTmpRoot(), prefix));
    return fs.realpathSync.native(tmpDir);
};
