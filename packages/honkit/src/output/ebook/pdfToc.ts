import type Output from "../../models/output";

// A reserved, non-resolving domain: Calibre preserves these links as PDF URI
// annotations. No HTTP requests are made when inspecting the temporary PDF.
export const PDF_TOC_PROBE_PREFIX = "https://honkit.invalid/pdf-toc/";
export const PDF_TOC_MAX_PAGE = 999999;

export interface PDFTocEntry {
    id: string;
    title: string;
    href: string;
}

export type PDFTocPageNumbers = Record<string, number>;

export interface PDFTocSlot {
    pageNumber?: number;
    probeURL?: string;
}

// The only theme contract: SUMMARY level -> displayed number / temporary marker.
export type PDFTocContext = Record<string, PDFTocSlot>;

/** Stable IDs describe SUMMARY entries, not titles or hrefs (both can repeat). */
export function createPDFTocEntries(output: Output): Record<string, PDFTocEntry> {
    const entries: Record<string, PDFTocEntry> = {};
    output
        .getBook()
        .getSummary()
        .getParts()
        .forEach((part) => {
            const visit = (articles) => {
                articles.forEach((article) => {
                    if (article.getPath()) {
                        const level = article.getLevel();
                        entries[level] = {
                            id: `article-${level}`,
                            title: article.getTitle(),
                            href: article.getRef()
                        };
                    }
                    visit(article.getArticles());
                });
            };
            visit(part.getArticles());
        });
    return entries;
}

export function createPDFTocContext(
    entries: Record<string, PDFTocEntry>,
    pageNumbers: PDFTocPageNumbers,
    probes: boolean
): PDFTocContext {
    return Object.fromEntries(
        Object.entries(entries).map(([level, entry]) => [
            level,
            {
                pageNumber: pageNumbers[entry.id],
                probeURL: probes ? PDF_TOC_PROBE_PREFIX + entry.id : undefined
            }
        ])
    );
}
