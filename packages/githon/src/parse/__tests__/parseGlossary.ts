import Book from "../../models/book";
import createMockFS from "../../fs/mock";

import parseGlossary from "../parseGlossary";

test("should parse glossary if exists", () => {
    const fs = createMockFS({
        "GLOSSARY.md": "# Glossary\n\n## Hello\nDescription for hello",
    });
    // @ts-expect-error
    const book = Book.createForFS(fs);

    return parseGlossary(book).then((resultBook) => {
        const glossary = resultBook.getGlossary();
        const file = glossary.getFile();
        const entries = glossary.getEntries();

        expect(file.exists()).toBeTruthy();
        expect(entries.size).toBe(1);
    });
});

test("should not fail if doesn't exist", () => {
    const fs = createMockFS({});
    // @ts-expect-error
    const book = Book.createForFS(fs);

    return parseGlossary(book).then((resultBook) => {
        const glossary = resultBook.getGlossary();
        const file = glossary.getFile();

        expect(file.exists()).toBeFalsy();
    });
});
