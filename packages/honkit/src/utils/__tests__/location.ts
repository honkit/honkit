import LocationUtils from "../location";
describe("LocationUtils", () => {
    test("should correctly test external location", () => {
        expect(LocationUtils.isExternal("http://google.fr")).toBe(true);
        expect(LocationUtils.isExternal("https://google.fr")).toBe(true);
        expect(LocationUtils.isExternal("test.md")).toBe(false);
        expect(LocationUtils.isExternal("folder/test.md")).toBe(false);
        expect(LocationUtils.isExternal("/folder/test.md")).toBe(false);
        expect(LocationUtils.isExternal("data:image/png")).toBe(false);
    });

    test("should correctly test data:uri location", () => {
        expect(LocationUtils.isDataURI("data:image/png")).toBe(true);
        expect(LocationUtils.isDataURI("http://google.fr")).toBe(false);
        expect(LocationUtils.isDataURI("https://google.fr")).toBe(false);
        expect(LocationUtils.isDataURI("test.md")).toBe(false);
        expect(LocationUtils.isDataURI("data.md")).toBe(false);
    });

    test("should correctly detect anchor location", () => {
        expect(LocationUtils.isAnchor("#test")).toBe(true);
        expect(LocationUtils.isAnchor(" #test")).toBe(true);
        expect(LocationUtils.isAnchor("https://google.fr#test")).toBe(false);
        expect(LocationUtils.isAnchor("test.md#test")).toBe(false);
    });

    describe(".relative", () => {
        test("should resolve to a relative path (same folder)", () => {
            expect(LocationUtils.relative("links/", "links/test.md")).toBe("test.md");
        });

        test("should resolve to a relative path (parent folder)", () => {
            expect(LocationUtils.relative("links/", "test.md")).toBe("../test.md");
        });

        test("should resolve to a relative path (child folder)", () => {
            expect(LocationUtils.relative("links/", "links/hello/test.md")).toBe("hello/test.md");
        });
    });

    describe(".flatten", () => {
        test("should remove leading slash", () => {
            expect(LocationUtils.flatten("/test.md")).toBe("test.md");
            expect(LocationUtils.flatten("/hello/cool.md")).toBe("hello/cool.md");
        });

        test("should remove leading slashes", () => {
            expect(LocationUtils.flatten("///test.md")).toBe("test.md");
        });

        test("should not break paths", () => {
            expect(LocationUtils.flatten("hello/cool.md")).toBe("hello/cool.md");
        });
    });

    describe(".toAbsolute", () => {
        test("should correctly transform as absolute", () => {
            // @ts-expect-error
            expect(LocationUtils.toAbsolute("http://google.fr")).toBe("http://google.fr");
            expect(LocationUtils.toAbsolute("test.md", "./", "./")).toBe("test.md");
            expect(LocationUtils.toAbsolute("folder/test.md", "./", "./")).toBe("folder/test.md");
        });

        test("should correctly handle windows path", () => {
            expect(LocationUtils.toAbsolute("folder\\test.md", "./", "./")).toBe("folder/test.md");
        });

        test("should correctly handle absolute path", () => {
            expect(LocationUtils.toAbsolute("/test.md", "./", "./")).toBe("test.md");
            expect(LocationUtils.toAbsolute("/test.md", "test", "test")).toBe("../test.md");
            expect(LocationUtils.toAbsolute("/sub/test.md", "test", "test")).toBe("../sub/test.md");
            expect(LocationUtils.toAbsolute("/test.png", "folder", "")).toBe("test.png");
        });

        test("should correctly handle absolute path (windows)", () => {
            expect(LocationUtils.toAbsolute("\\test.png", "folder", "")).toBe("test.png");
        });

        test("should resolve path starting by \"/\" in root directory", () => {
            expect(LocationUtils.toAbsolute("/test/hello.md", "./", "./")).toBe("test/hello.md");
        });

        test("should resolve path starting by \"/\" in child directory", () => {
            expect(LocationUtils.toAbsolute("/test/hello.md", "./hello", "./")).toBe("test/hello.md");
        });

        test("should resolve path starting by \"/\" in child directory, with same output directory", () => {
            expect(LocationUtils.toAbsolute("/test/hello.md", "./hello", "./hello")).toBe("../test/hello.md");
        });
    });
});
