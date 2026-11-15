import path from "path";
import { mkdtemp, rename, rm } from "fs/promises";
import type Output from "../../models/output";
import { createPDFTocContext, createPDFTocEntries, PDFTocPageNumbers } from "./pdfToc";
import { readPDFPagination, PDFPagination } from "./readPDFPagination";
import writeSummary from "./writeSummary";
import runEbookConvert from "./runEbookConvert";

const MAX_PAGINATION_PASSES = 5;

/** Dependency boundary keeps the convergence policy testable without Calibre. */
export interface PaginationPasses {
    measure(numbers: PDFTocPageNumbers, pass: number): Promise<PDFPagination>;
    finish(numbers: PDFTocPageNumbers): Promise<PDFPagination>;
}

function equalNumbers(left: PDFTocPageNumbers, right: PDFTocPageNumbers): boolean {
    const keys = Object.keys(left);
    return keys.length === Object.keys(right).length && keys.every((key) => left[key] === right[key]);
}

function equalLayout(left: PDFPagination, right: PDFPagination): boolean {
    return (
        left.pageCount === right.pageCount &&
        left.links.length === right.links.length &&
        left.links.every((link, i) => link === right.links[i])
    );
}

/** At least one measured pass with populated slots must agree before publishing. */
export async function convergePDFToc(passes: PaginationPasses): Promise<PDFTocPageNumbers> {
    let numbers: PDFTocPageNumbers = {};
    let previous: PDFPagination | undefined;
    for (let pass = 1; pass <= MAX_PAGINATION_PASSES; pass++) {
        const measured = await passes.measure(numbers, pass);
        if (previous && equalNumbers(numbers, measured.pageNumbers) && equalLayout(previous, measured)) {
            const clean = await passes.finish(numbers);
            if (!equalLayout(measured, clean)) {
                throw new Error(
                    "PDF TOC pagination changed when removing probes. Check custom PDF styles or non-deterministic content."
                );
            }
            return numbers;
        }
        previous = measured;
        numbers = measured.pageNumbers;
    }
    throw new Error(
        `PDF TOC page numbers did not converge after ${MAX_PAGINATION_PASSES} passes. Check custom PDF styles or non-deterministic content.`
    );
}

/**
 * Calibre always renders from HTML. Temporary PDFs are only inspected, never
 * edited or reordered. The clean conversion is published after validation.
 */
async function paginatePDF(output: Output): Promise<Output> {
    const entries = createPDFTocEntries(output);
    const ids = Object.values(entries).map((entry) => entry.id);
    const temporary = await mkdtemp(path.join(output.getRoot(), ".honkit-pdf-toc-"));
    const probeFile = path.join(temporary, "probe.pdf");
    const finalFile = path.join(temporary, "final.pdf");
    let numbers: PDFTocPageNumbers = {};
    let summaryIsClean = false;
    try {
        await convergePDFToc({
            async measure(pageNumbers, pass) {
                numbers = pageNumbers;
                output.getLogger().info.ln(`PDF TOC pagination pass ${pass}`);
                await writeSummary(output, createPDFTocContext(entries, numbers, true));
                await runEbookConvert(output, probeFile);
                return readPDFPagination(probeFile, ids);
            },
            async finish(pageNumbers) {
                numbers = pageNumbers;
                await writeSummary(output, createPDFTocContext(entries, numbers, false));
                summaryIsClean = true;
                await runEbookConvert(output, finalFile);
                return readPDFPagination(finalFile, []);
            }
        });
        await rename(finalFile, path.join(output.getRoot(), "index.pdf"));
        return output;
    } finally {
        try {
            // Do not leave probe links in the HTML, even on failed conversion.
            if (!summaryIsClean) await writeSummary(output, createPDFTocContext(entries, numbers, false));
        } finally {
            await rm(temporary, { recursive: true, force: true });
        }
    }
}

export default paginatePDF;
