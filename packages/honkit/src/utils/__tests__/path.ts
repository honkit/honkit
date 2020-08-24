import path from "path";
import PathUtils from "../path";
describe("Paths", () => {
    describe("setExtension", () => {
        test("should correctly change extension of filename", () => {
            expect(PathUtils.setExtension("test.md", ".html")).toBe("test.html");
            expect(PathUtils.setExtension("test.md", ".json")).toBe("test.json");
        });

        test("should correctly change extension of path", () => {
            expect(PathUtils.setExtension("hello/test.md", ".html")).toBe(path.normalize("hello/test.html"));
            expect(PathUtils.setExtension("hello/test.md", ".json")).toBe(path.normalize("hello/test.json"));
        });
    });
});
