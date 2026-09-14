import { mkdtemp, readFile, readdir, rm, writeFile } from "fs/promises";
import path from "path";
import os from "os";
import Immutable from "immutable";
import Output from "../../../models/output";
import Summary from "../../../models/summary";
import paginatePDF from "../paginatePDF";
import writeSummary from "../writeSummary";
import runEbookConvert from "../runEbookConvert";
import { readPDFPagination } from "../readPDFPagination";

jest.mock("../writeSummary", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("../runEbookConvert", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("../readPDFPagination", () => ({ __esModule: true, readPDFPagination: jest.fn() }));

let directory: string;
let output: Output;
const summary = jest.mocked(writeSummary);
const convert = jest.mocked(runEbookConvert);
const read = jest.mocked(readPDFPagination);

beforeEach(async () => {
    jest.resetAllMocks();
    directory = await mkdtemp(path.join(os.tmpdir(), "honkit-pdf-cleanup-"));
    output = new Output({ options: Immutable.Map({ root: directory }) });
    output = output.set(
        "book",
        output
            .getBook()
            .setLogLevel("disabled")
            .set(
                "summary",
                Summary.createFromParts(undefined, [{ articles: [{ title: "Chapter", ref: "README.md" }] }])
            )
    ) as Output;
    summary.mockImplementation(async (_output, context) => {
        await writeFile(path.join(directory, "SUMMARY.html"), JSON.stringify(context));
        return output;
    });
    convert.mockImplementation(async (_output, destination) => {
        await writeFile(destination, path.basename(destination));
        return output;
    });
    read.mockResolvedValue({ pageCount: 2, pageNumbers: {}, links: [] });
});
afterEach(async () => rm(directory, { recursive: true, force: true }));

async function expectClean() {
    const context = JSON.parse(await readFile(path.join(directory, "SUMMARY.html"), "utf8"));
    expect(Object.values(context).every((slot: any) => slot.probeURL === undefined)).toBe(true);
    expect((await readdir(directory)).filter((name) => name.startsWith(".honkit-pdf-toc-"))).toEqual([]);
}

test("publishes exactly the clean Calibre output and removes all temporary PDFs", async () => {
    await expect(paginatePDF(output)).resolves.toBe(output);
    expect(await readFile(path.join(directory, "index.pdf"), "utf8")).toBe("final.pdf");
    expect(convert).toHaveBeenCalledTimes(3);
    expect(summary.mock.calls.map((call) => Object.values(call[1]).some((slot) => Boolean(slot.probeURL)))).toEqual([
        true,
        true,
        false
    ]);
    await expectClean();
});

test.each(["conversion", "inspection", "final validation"])(
    "cleans up on %s failure without replacing an existing PDF",
    async (stage) => {
        await writeFile(path.join(directory, "index.pdf"), "existing PDF");
        if (stage === "conversion") convert.mockRejectedValueOnce(new Error("failed conversion"));
        else if (stage === "inspection") read.mockRejectedValueOnce(new Error("failed inspection"));
        else
            read.mockResolvedValueOnce({ pageCount: 2, pageNumbers: {}, links: [] })
                .mockResolvedValueOnce({ pageCount: 2, pageNumbers: {}, links: [] })
                .mockResolvedValueOnce({ pageCount: 3, pageNumbers: {}, links: [] });
        await expect(paginatePDF(output)).rejects.toThrow();
        expect(await readFile(path.join(directory, "index.pdf"), "utf8")).toBe("existing PDF");
        await expectClean();
    }
);
