import { copyFile, mkdtemp, readFile, readdir, rm, writeFile } from "fs/promises";
import path from "path";
import os from "os";
import { load } from "cheerio";
import Book from "../../../models/book";
import createNodeFS from "../../../fs/node";
import parseBook from "../../../parse/parseBook";
import { generateBook } from "../../generateBook";
import EbookGenerator from "..";
import * as reader from "../readPDFPagination";
import { createPDFTocEntries } from "../pdfToc";

// HONKIT_TEST_CALIBRE=1 pnpm --filter honkit exec jest --runInBand src/output/ebook/__tests__/pdfToc-integration.ts
const calibreTest = process.env.HONKIT_TEST_CALIBRE === "1" ? test : test.skip;

calibreTest(
    "renders a clean front TOC with physical numbers, a cover, multiple TOC pages and repeated anchored links",
    async () => {
        const root = await mkdtemp(path.join(os.tmpdir(), "honkit pdf toc integration "));
        const outputRoot = path.join(root, "output with spaces");
        const originalReader = reader.readPDFPagination;
        const inspections: reader.PDFPagination[] = [];
        const spy = jest.spyOn(reader, "readPDFPagination").mockImplementation(async (...args) => {
            const result = await originalReader(...args);
            inspections.push(result);
            return result;
        });
        try {
            await writeFile(
                path.join(root, "book.json"),
                JSON.stringify({
                    title: "Physical TOC page numbers",
                    cover: "cover.png",
                    plugins: ["-lunr", "-search", "-fontsettings", "-sharing"],
                    pdf: { tocPageNumbers: true, pageNumbers: false }
                })
            );
            await copyFile(
                path.resolve(__dirname, "../../../../../@honkit/theme-default/logo/apple-touch-icon.png"),
                path.join(root, "cover.png")
            );
            await writeFile(path.join(root, "README.md"), "# Introduction\n\nThe first content page.");
            await writeFile(
                path.join(root, "chapter.md"),
                '# Chapter\n\nChapter opening.\n\n<div style="page-break-before: always"></div>\n\n## Deep\n\nThe anchored physical page.'
            );
            await writeFile(
                path.join(root, "SUMMARY.md"),
                [
                    "# Summary",
                    "",
                    "- [Introduction](README.md)",
                    "- [Repeated title](chapter.md)",
                    "  - [Repeated title](chapter.md#deep)",
                    ...Array.from(
                        { length: 55 },
                        () =>
                            "- [A deliberately long repeated title which wraps onto another line in the front table of contents](chapter.md#deep)"
                    ),
                    "- [External](https://example.com)",
                    "- Unlinked group"
                ].join("\n")
            );
            const book = await parseBook(Book.createForFS(createNodeFS(root)).setLogLevel("disabled"));
            const output = await generateBook(EbookGenerator, book, { root: outputRoot, format: "pdf" });
            const $ = load(await readFile(path.join(outputRoot, "SUMMARY.html"), "utf8"));
            const printed = $(".pdf-toc-number")
                .map((_i, el) => Number($(el).text()))
                .get();
            const entries = Object.values(createPDFTocEntries(output));
            expect(inspections.length).toBeGreaterThanOrEqual(3);
            const verified = inspections[inspections.length - 2];
            const final = inspections[inspections.length - 1];
            expect(printed).toEqual(entries.map((entry) => verified.pageNumbers[entry.id]));
            expect(printed[0]).toBeGreaterThan(3); // cover + at least two TOC pages
            expect(printed[1]).toBe(printed[0] + 1);
            expect(printed[2]).toBe(printed[1] + 1); // fragment target, not the file's first page
            expect(printed.slice(2).every((page) => page === printed[2])).toBe(true);
            expect(final.pageCount).toBe(printed[2]);
            expect(final.links).toEqual(verified.links);
            expect(final.pageNumbers).toEqual({}); // no probe URIs in the final PDF
            expect($(".pdf-toc-probe")).toHaveLength(0);
            expect((await readdir(outputRoot)).some((name) => name.startsWith(".honkit-pdf-toc-"))).toBe(false);
        } finally {
            spy.mockRestore();
            await rm(root, { recursive: true, force: true });
        }
    },
    120000
);
