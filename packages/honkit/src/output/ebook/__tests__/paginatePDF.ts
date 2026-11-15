import { convergePDFToc } from "../paginatePDF";
import { PDFPagination } from "../readPDFPagination";

function pagination(page = 3, links = ["stable"]): PDFPagination {
    return { pageCount: page + 2, pageNumbers: { entry: page }, links };
}

describe("PDF TOC convergence", () => {
    test("verifies populated slots with probes before a separate clean conversion", async () => {
        const measure = jest.fn(async () => pagination());
        const finish = jest.fn(async () => pagination());
        await expect(convergePDFToc({ measure, finish })).resolves.toEqual({ entry: 3 });
        expect(measure.mock.calls).toEqual([
            [{}, 1],
            [{ entry: 3 }, 2]
        ]);
        expect(finish).toHaveBeenCalledTimes(1);
        expect(finish).toHaveBeenCalledWith({ entry: 3 });
    });

    test("continues when inserting numbers moves targets", async () => {
        const measure = jest
            .fn()
            .mockResolvedValueOnce(pagination(9))
            .mockResolvedValueOnce(pagination(10))
            .mockResolvedValueOnce(pagination(10));
        const finish = jest.fn(async () => pagination(10));
        await expect(convergePDFToc({ measure, finish })).resolves.toEqual({ entry: 10 });
        expect(measure).toHaveBeenCalledTimes(3);
    });

    test("checks layout as well as page numbers", async () => {
        const measure = jest
            .fn()
            .mockResolvedValueOnce(pagination(3, ["moved"]))
            .mockResolvedValue(pagination());
        const finish = jest.fn(async () => pagination());
        await convergePDFToc({ measure, finish });
        expect(measure).toHaveBeenCalledTimes(3);
    });

    test("bounds non-convergence and never publishes an unverified PDF", async () => {
        const measure = jest.fn(async (_numbers, pass) => pagination(pass));
        const finish = jest.fn();
        await expect(convergePDFToc({ measure, finish })).rejects.toThrow(/did not converge after 5 passes/);
        expect(measure).toHaveBeenCalledTimes(5);
        expect(finish).not.toHaveBeenCalled();
    });

    test("does not accept a clean PDF whose pagination changed", async () => {
        await expect(
            convergePDFToc({
                measure: async () => pagination(),
                finish: async () => pagination(4)
            })
        ).rejects.toThrow(/changed when removing probes/);
    });

    test("does not hide conversion failures", async () => {
        const finish = jest.fn();
        await expect(
            convergePDFToc({
                measure: async () => {
                    throw new Error("conversion failed");
                },
                finish
            })
        ).rejects.toThrow("conversion failed");
        expect(finish).not.toHaveBeenCalled();
    });
});
