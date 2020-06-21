import Promise from "../../utils/promise";
import Book from "../../models/book";
import createMockFS from "../../fs/mock";

import parseReadme from "../parseReadme";

test("should parse summary if exists", () => {
    const fs = createMockFS({
        "README.md": "# Hello\n\nAnd here is the description.",
    });
    // @ts-expect-error
    const book = Book.createForFS(fs);

    return parseReadme(book).then((resultBook) => {
        const readme = resultBook.getReadme();
        const file = readme.getFile();

        expect(file.exists()).toBeTruthy();
        expect(readme.getTitle()).toBe("Hello");
        expect(readme.getDescription()).toBe("And here is the description.");
    });
});

test("should fail if doesn't exist", () => {
    const fs = createMockFS({});
    // @ts-expect-error
    const book = Book.createForFS(fs);

    return parseReadme(book).then(
        (resultBook) => {
            throw new Error("It should have fail");
        },
        () => {
            // @ts-expect-error
            return Promise();
        }
    );
});
