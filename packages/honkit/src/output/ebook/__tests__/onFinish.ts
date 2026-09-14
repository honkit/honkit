import Immutable from "immutable";
import Output from "../../../models/output";
import Book from "../../../models/book";
import Config from "../../../models/config";
import onFinish from "../onFinish";
import writeSummary from "../writeSummary";
import runEbookConvert from "../runEbookConvert";
import paginatePDF from "../paginatePDF";

jest.mock("../writeSummary", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("../runEbookConvert", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("../paginatePDF", () => ({ __esModule: true, default: jest.fn() }));

const write = jest.mocked(writeSummary);
const convert = jest.mocked(runEbookConvert);
const paginate = jest.mocked(paginatePDF);

beforeEach(() => {
    jest.resetAllMocks();
    write.mockImplementation(async (output) => output);
    convert.mockImplementation(async (output) => output);
    paginate.mockImplementation(async (output) => output);
});

function output(format, enabled) {
    return new Output({
        options: Immutable.Map({ format }),
        book: new Book({ config: new Config().setValue("pdf.tocPageNumbers", enabled) })
    });
}

test.each([
    ["pdf", false],
    ["epub", true],
    ["mobi", true],
    ["", true]
])("%s with tocPageNumbers=%s retains the single-pass path", async (format, enabled) => {
    const result = output(format, enabled);
    await expect(onFinish(result)).resolves.toBe(result);
    expect(write).toHaveBeenCalledTimes(1);
    expect(convert).toHaveBeenCalledTimes(1);
    expect(paginate).not.toHaveBeenCalled();
});

test("only opted-in PDFs run the pagination pipeline", async () => {
    const result = output("pdf", true);
    await expect(onFinish(result)).resolves.toBe(result);
    expect(paginate).toHaveBeenCalledWith(result);
    expect(write).not.toHaveBeenCalled();
    expect(convert).not.toHaveBeenCalled();
});
