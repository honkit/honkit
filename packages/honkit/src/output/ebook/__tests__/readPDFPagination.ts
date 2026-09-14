import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { PDFDocument, PDFHexString, PDFName, PDFString } from "pdf-lib";
import { readPDFPagination } from "../readPDFPagination";
import { PDF_TOC_PROBE_PREFIX } from "../pdfToc";

// Fixtures are created in Node, including compressed object streams. Production
// parsing never saves a PDF; synthetic fixture creation is the only writer.
async function fixture(kind = "direct") {
    const document = await PDFDocument.create();
    document.addPage(); // Cover: physical numbering must include it.
    const toc = document.addPage();
    const target = document.addPage();
    const context = document.context;
    const destination = context.obj([target.ref, "XYZ", 0, 100, 0]);
    let dest: any = destination;
    if (kind === "named") {
        dest = PDFHexString.fromText("chapter Ω");
        const leaf = context.register(context.obj({ Names: [dest, context.obj({ D: destination })] }));
        document.catalog.set(PDFName.of("Names"), context.obj({ Dests: { Kids: [leaf] } }));
    } else if (kind === "legacy") {
        dest = PDFName.of("chapter");
        document.catalog.set(PDFName.of("Dests"), context.obj({ chapter: { D: destination } }));
    } else if (kind === "numeric") {
        dest = context.obj([2, "Fit"]);
    }
    const rect = [10, 50, 12, 58];
    const marker = context.register(
        context.obj({
            Type: "Annot",
            Subtype: "Link",
            Rect: rect,
            A: { S: "URI", URI: PDFString.of(`${PDF_TOC_PROBE_PREFIX}article-1.1`) }
        })
    );
    const link = context.register(
        context.obj({
            Type: "Annot",
            Subtype: "Link",
            Rect: rect,
            ...(kind === "goto" ? { A: { S: "GoTo", D: dest } } : { Dest: dest })
        })
    );
    const title = context.register(
        context.obj({
            Type: "Annot",
            Subtype: "Link",
            Rect: [30, 50, 200, 70],
            Dest: destination
        })
    );
    // Intervening annotations and reversed order must not affect pairing.
    const annotations =
        kind === "missing"
            ? [title]
            : kind === "unresolved"
              ? [marker, title]
              : kind === "duplicate"
                ? [marker, marker, title, link]
                : kind === "ambiguous"
                  ? [marker, title, link, link]
                  : [link, title, marker];
    toc.node.set(PDFName.of("Annots"), context.obj(annotations));
    return document.save();
}

describe("readPDFPagination", () => {
    let directory: string;
    let file: string;
    beforeEach(async () => {
        directory = await mkdtemp(path.join(os.tmpdir(), "honkit-pdf-reader-"));
        file = path.join(directory, "probe.pdf");
    });
    afterEach(async () => rm(directory, { recursive: true, force: true }));

    test.each(["direct", "goto", "named", "legacy", "numeric"])(
        "reads %s destinations without modifying the PDF",
        async (kind) => {
            const bytes = await fixture(kind);
            await writeFile(file, bytes);
            const result = await readPDFPagination(file, ["article-1.1"]);
            expect(result).toEqual({
                pageCount: 3,
                pageNumbers: { "article-1.1": 3 },
                links: [JSON.stringify([2, 3, [30, 50, 200, 70]])]
            });
            expect(await readFile(file)).toEqual(Buffer.from(bytes));
        }
    );

    test.each([
        ["missing", /Missing PDF TOC probes/],
        ["unresolved", /Cannot resolve PDF TOC probe/],
        ["duplicate", /Duplicate PDF TOC probe/],
        ["ambiguous", /Cannot resolve PDF TOC probe/]
    ])("rejects %s probes rather than printing guessed numbers", async (kind, message) => {
        await writeFile(file, await fixture(kind as string));
        await expect(readPDFPagination(file, ["article-1.1"])).rejects.toThrow(message as RegExp);
    });

    test("rejects probes in a supposedly clean final PDF", async () => {
        await writeFile(file, await fixture());
        await expect(readPDFPagination(file, [])).rejects.toThrow(/Unexpected PDF TOC probe/);
    });
});
