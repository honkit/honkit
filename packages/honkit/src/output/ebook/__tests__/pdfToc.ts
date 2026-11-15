import path from "path";
import nunjucks from "nunjucks";
import { load } from "cheerio";
import jsonschema from "jsonschema";
import Config from "../../../models/config";
import Book from "../../../models/book";
import Output from "../../../models/output";
import Summary from "../../../models/summary";
import schema from "../../../constants/configSchema";
import { createPDFTocContext, createPDFTocEntries, PDF_TOC_PROBE_PREFIX } from "../pdfToc";

const parts = [
    {
        articles: [
            { title: "Same title", ref: "README.md" },
            {
                title: "Same title",
                ref: "chapter.md#anchor",
                articles: [{ title: "Another occurrence", ref: "chapter.md#anchor" }]
            },
            { title: "External", ref: "https://example.com" },
            { title: "Group", articles: [{ title: "Nested", ref: "nested/README.md" }] }
        ]
    }
];

function output() {
    return new Output({ book: new Book({ summary: Summary.createFromParts(undefined, parts) }) });
}

describe("PDF TOC configuration and entry identity", () => {
    test("is opt-in and validates booleans", () => {
        expect(new Config().getValue("pdf.tocPageNumbers")).toBe(false);
        for (const value of [true, false]) {
            expect(new jsonschema.Validator().validate({ pdf: { tocPageNumbers: value } }, schema).errors).toEqual([]);
        }
        expect(new jsonschema.Validator().validate({ pdf: { tocPageNumbers: "true" } }, schema).errors).toHaveLength(1);
    });

    test("has stable distinct IDs for duplicate titles, hrefs and nested entries", () => {
        const entries = Object.values(createPDFTocEntries(output()));
        expect(entries.map((entry) => entry.href)).toEqual([
            "README.md",
            "chapter.md#anchor",
            "chapter.md#anchor",
            "nested/README.md"
        ]);
        expect(new Set(entries.map((entry) => entry.id)).size).toBe(4);
        expect(createPDFTocEntries(output())).toEqual(createPDFTocEntries(output()));
    });
});

describe.each(["theme-default", "theme"])("%s PDF summary template", (theme) => {
    const env = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(path.resolve(__dirname, `../../../../../@honkit/${theme}/_layouts`)),
        { autoescape: false }
    );
    env.addFilter("t", (value) => value);
    env.addFilter("contentURL", (value) => value.replace(/\.md$/, ".html"));
    env.addFilter("resolveAsset", (value) => value);
    env.addFilter("resolveFile", (value) => value);
    env.addGlobal("fileExists", () => false);
    const entries = createPDFTocEntries(output());
    const first = Object.values(entries)[0];
    const context = {
        config: { styles: {} },
        options: { format: "pdf" },
        summary: {
            parts: [
                {
                    articles: [
                        { title: "Chapter", path: "README.md", level: "1.1" },
                        { title: "External", url: "https://example.com", level: "1.2" },
                        { title: "Group", level: "1.3" }
                    ]
                }
            ]
        }
    };

    test("retains the old level indicators without the opt-in context", () => {
        const $ = load(env.render("ebook/summary.html", context));
        expect(
            $(".inner > .page")
                .map((_i, el) => $(el).text())
                .get()
        ).toEqual(["1.1", "1.2", "1.3"]);
        expect($(".pdf-toc-probe")).toHaveLength(0);
    });

    test("keeps slots and paired probes during verification, then only removes probes", () => {
        const render = (probes, numbers) =>
            load(
                env.render("ebook/summary.html", {
                    ...context,
                    pdfToc: createPDFTocContext({ "1.1": first }, numbers, probes)
                })
            );
        const initial = render(true, {});
        const verified = render(true, { [first.id]: 12 });
        const clean = render(false, { [first.id]: 12 });
        for (const $ of [initial, verified, clean]) expect($(".pdf-toc-number")).toHaveLength(1);
        expect(initial(".pdf-toc-probe")).toHaveLength(2);
        expect(verified(".pdf-toc-probe")).toHaveLength(2);
        expect(verified(".pdf-toc-probe").first().attr("href")).toBe(PDF_TOC_PROBE_PREFIX + first.id);
        expect(verified(".pdf-toc-probe").last().attr("href")).toBe("README.html");
        expect(clean(".pdf-toc-number").text()).toBe("12");
        expect(clean(".pdf-toc-probe")).toHaveLength(0);
        verified(".pdf-toc-probe").remove();
        expect(verified.html()).toBe(clean.html());
    });
});
