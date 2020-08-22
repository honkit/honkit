import Book from "../../models/book";
import createMockFS from "../../fs/mock";

describe("parseSummary", () => {
    const parseSummary = require("../parseSummary");

    test("should parse summary if exists", () => {
        const fs = createMockFS({
            "SUMMARY.md": "# Summary\n\n* [Hello](hello.md)"
        });

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createForFS' does not exist on type 'Cla... Remove this comment to see the full error message
        const book = Book.createForFS(fs);

        return parseSummary(book).then((resultBook) => {
            const summary = resultBook.getSummary();
            const file = summary.getFile();

            expect(file.exists()).toBeTruthy();
        });
    });

    test("should not fail if doesn't exist", () => {
        const fs = createMockFS({});

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createForFS' does not exist on type 'Cla... Remove this comment to see the full error message
        const book = Book.createForFS(fs);

        return parseSummary(book).then((resultBook) => {
            const summary = resultBook.getSummary();
            const file = summary.getFile();

            expect(file.exists()).toBeFalsy();
        });
    });
});
