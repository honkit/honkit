import { createTmpDirWithRealPath } from "../fs/tmpdir";
import initBook from "../init";

describe("initBook", () => {
    let dir: string;

    beforeEach(() => {
        dir = createTmpDirWithRealPath("honkit-init-test-");
    });

    test("should create a README and SUMMARY for empty book", () => {
        return initBook(dir).then(() => {
            expect(dir).toHaveFile("README.md");
            expect(dir).toHaveFile("SUMMARY.md");
        });
    });
});
