import childProcess from "child_process";
import { EventEmitter } from "events";
import path from "path";
import runEbookConvert, { convertOptionsToArgs } from "../runEbookConvert";
import getConvertOptions from "../getConvertOptions";
import PromiseUtil from "../../../utils/promise";

jest.mock("../getConvertOptions");

const root = path.resolve("book with spaces and %variables% and $dollars");
const output = (format = "pdf") => ({
    getOptions: () => new Map([["format", format]]),
    getRoot: () => root,
    getLogger: () => ({ debug: jest.fn() })
});

function mockProcess(failure?: NodeJS.ErrnoException) {
    return jest.spyOn(childProcess, "execFile").mockImplementation(((file, args, callback) => {
        process.nextTick(() => callback(failure, "", failure ? "Calibre failed" : ""));
        return { stdout: new EventEmitter(), stderr: new EventEmitter() };
    }) as any);
}

afterEach(() => jest.restoreAllMocks());
beforeEach(() =>
    jest.mocked(getConvertOptions).mockImplementation(() => PromiseUtil({ "--title": 'A "$HOME" %title% `book`' }))
);

test("passes paths and metadata literally without a shell", async () => {
    const exec = mockProcess();
    const bookOutput = output();
    const destination = path.join(root, "temporary probe.pdf");
    await expect(runEbookConvert(bookOutput, destination)).resolves.toBe(bookOutput);
    expect(exec).toHaveBeenCalledWith(
        "ebook-convert",
        [path.join(root, "SUMMARY.html"), destination, '--title=A "$HOME" %title% `book`'],
        expect.any(Function)
    );
});

test("keeps Calibre option semantics for flags, empty strings and zero", () => {
    expect(
        convertOptionsToArgs({
            "--flag": true,
            "--disabled": false,
            "--absent": undefined,
            "--null": null,
            "--zero": 0,
            "--empty": "",
            "--number": 12
        })
    ).toEqual(["--flag", "--zero=0", "--empty=", "--number=12"]);
});

test("reports a missing Calibre installation", async () => {
    mockProcess(Object.assign(new Error("missing"), { code: "ENOENT" }));
    await expect(runEbookConvert(output())).rejects.toMatchObject({ type: "install.required" });
});

test("reports conversion stderr", async () => {
    mockProcess(new Error("conversion failed"));
    await expect(runEbookConvert(output())).rejects.toThrow(/Calibre failed/);
});

test("does not invoke Calibre for HTML-only ebook output", async () => {
    const exec = mockProcess();
    const bookOutput = output("");
    await expect(runEbookConvert(bookOutput)).resolves.toBe(bookOutput);
    expect(exec).not.toHaveBeenCalled();
});
