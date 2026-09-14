import { readFile } from "fs/promises";
import { PDFArray, PDFDict, PDFDocument, PDFHexString, PDFName, PDFNumber, PDFRef, PDFString } from "pdf-lib";
import { PDF_TOC_PROBE_PREFIX, PDF_TOC_MAX_PAGE, PDFTocPageNumbers } from "./pdfToc";

interface Link {
    uri?: string;
    targetPage?: number;
    rect: number[];
}

export interface PDFPagination {
    pageCount: number;
    pageNumbers: PDFTocPageNumbers;
    // Non-probe internal links, independent of PDF object numbers. Comparing
    // these after the clean conversion also checks that removing probes did
    // not move links or their destinations to different physical pages.
    links: string[];
}

function text(value): string | undefined {
    if (value instanceof PDFString || value instanceof PDFHexString || value instanceof PDFName) {
        return value.decodeText();
    }
}

/**
 * Read annotations and destinations only. pdf-lib works in CommonJS Node without
 * a DOM, a worker or native canvas dependencies; no PDF save/edit API is used.
 */
export async function readPDFPagination(filePath: string, expectedIds: string[]): Promise<PDFPagination> {
    const document = await PDFDocument.load(await readFile(filePath), { updateMetadata: false });
    const pages = document.getPages();
    if (pages.length > PDF_TOC_MAX_PAGE) {
        throw new Error(`PDF TOC supports at most ${PDF_TOC_MAX_PAGE} physical pages.`);
    }
    const pageByRef = new Map(pages.map((page, index) => [page.ref.toString(), index + 1]));
    const lookup = (value) => document.context.lookup(value);
    const namedDestinations = new Map<string, unknown>();
    const visited = new Set<PDFDict>();

    // PDF 1.2+ name trees may be nested and contain indirect objects.
    const readNameTree = (node) => {
        node = lookup(node);
        if (!(node instanceof PDFDict) || visited.has(node)) return;
        visited.add(node);
        const names = lookup(node.get(PDFName.of("Names")));
        if (names instanceof PDFArray) {
            for (let i = 0; i + 1 < names.size(); i += 2) {
                const name = text(names.lookup(i));
                if (name !== undefined) namedDestinations.set(name, names.get(i + 1));
            }
        }
        const kids = lookup(node.get(PDFName.of("Kids")));
        if (kids instanceof PDFArray) {
            for (let i = 0; i < kids.size(); i++) readNameTree(kids.get(i));
        }
    };
    const names = lookup(document.catalog.get(PDFName.of("Names")));
    if (names instanceof PDFDict) readNameTree(names.get(PDFName.of("Dests")));
    const legacyDests = lookup(document.catalog.get(PDFName.of("Dests")));

    const destinationPage = (destination, seen = new Set<unknown>()): number | undefined => {
        destination = lookup(destination);
        if (!destination || seen.has(destination)) return;
        seen.add(destination);
        if (destination instanceof PDFDict) {
            return destinationPage(destination.get(PDFName.of("D")), seen);
        }
        const name = text(destination);
        if (name !== undefined) {
            const value =
                namedDestinations.get(name) ||
                (legacyDests instanceof PDFDict ? legacyDests.get(PDFName.of(name)) : undefined);
            return destinationPage(value, seen);
        }
        if (!(destination instanceof PDFArray)) return;
        const page = destination.get(0);
        if (page instanceof PDFRef) return pageByRef.get(page.toString());
        if (page instanceof PDFNumber) {
            const index = page.asNumber();
            if (Number.isInteger(index) && index >= 0 && index < pages.length) return index + 1;
        }
    };

    const expected = new Set(expectedIds);
    const found = new Map<string, number>();
    const links: string[] = [];
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const annotations = pages[pageIndex].node.Annots();
        const pageLinks: Link[] = [];
        for (let i = 0; annotations && i < annotations.size(); i++) {
            const annotation = annotations.lookup(i);
            if (!(annotation instanceof PDFDict) || text(annotation.get(PDFName.of("Subtype"))) !== "Link") continue;
            const rectangle = lookup(annotation.get(PDFName.of("Rect")));
            if (!(rectangle instanceof PDFArray) || rectangle.size() !== 4) continue;
            const rect = rectangle.asArray().map((value) => {
                const number = lookup(value);
                return number instanceof PDFNumber ? number.asNumber() : NaN;
            });
            if (!rect.every(Number.isFinite)) continue;
            const actionObject = lookup(annotation.get(PDFName.of("A")));
            const action = actionObject instanceof PDFDict ? actionObject : undefined;
            const kind = action ? text(action.get(PDFName.of("S"))) : undefined;
            const uri = kind === "URI" ? text(lookup(action.get(PDFName.of("URI")))) : undefined;
            const destination =
                annotation.get(PDFName.of("Dest")) || (kind === "GoTo" ? action.get(PDFName.of("D")) : undefined);
            pageLinks.push({ uri, targetPage: destinationPage(destination), rect });
        }
        const probeTargets = new Set<Link>();
        for (const marker of pageLinks) {
            if (!marker.uri?.startsWith(PDF_TOC_PROBE_PREFIX)) continue;
            const id = marker.uri.slice(PDF_TOC_PROBE_PREFIX.length);
            if (!expected.has(id)) throw new Error(`Unexpected PDF TOC probe "${id}".`);
            if (found.has(id)) throw new Error(`Duplicate PDF TOC probe "${id}".`);
            // The marker and destination anchors deliberately overlap. Match by
            // geometry, never annotation order, titles, outline depth or URLs.
            const matches = pageLinks.filter(
                (link) => link.targetPage !== undefined && marker.rect.every((n, i) => Math.abs(n - link.rect[i]) < 0.1)
            );
            if (matches.length !== 1 || probeTargets.has(matches[0])) {
                throw new Error(
                    `Cannot resolve PDF TOC probe "${id}" to one internal destination. Check the SUMMARY link and PDF styles.`
                );
            }
            found.set(id, matches[0].targetPage);
            probeTargets.add(matches[0]);
        }
        for (const link of pageLinks) {
            if (link.targetPage === undefined || probeTargets.has(link)) continue;
            links.push(
                JSON.stringify([pageIndex + 1, link.targetPage, link.rect.map((n) => Math.round(n * 100) / 100)])
            );
        }
    }
    const missing = expectedIds.filter((id) => !found.has(id));
    if (missing.length) {
        throw new Error(
            `Missing PDF TOC probes: ${missing.join(", ")}. The ebook summary template must support pdf.tocPageNumbers and preserve its probe links.`
        );
    }
    return { pageCount: pages.length, pageNumbers: Object.fromEntries(found), links: links.sort() };
}
