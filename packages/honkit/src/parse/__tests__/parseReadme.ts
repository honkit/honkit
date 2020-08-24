import Promise from "../../utils/promise";
import createMockFS from "../../fs/mock";
import Book from "../../models/book";
import parseReadme from "../parseReadme";

describe("parseReadme", () => {
    test("should parse summary if exists", () => {
        const fs = createMockFS({
            "README.md": "# Hello\n\nAnd here is the description.",
        });

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createForFS' does not exist on type 'Cla... Remove this comment to see the full error message
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

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createForFS' does not exist on type 'Cla... Remove this comment to see the full error message
        const book = Book.createForFS(fs);

        return parseReadme(book).then(
            (resultBook) => {
                throw new Error("It should have fail");
            },
            () => {
                return Promise();
            }
        );
    });
});
