import Promise from "../../utils/promise";
import error from "../../utils/error";
import writeSummary from "./writeSummary";
import runEbookConvert from "./runEbookConvert";

/** Non-PDF output and the default PDF behavior remain single-pass. */
function onFinish(output) {
    const enabled =
        output.getOptions().get("format") === "pdf" &&
        output.getBook().getConfig().getValue("pdf.tocPageNumbers") === true;
    if (!enabled) return writeSummary(output).then(runEbookConvert);

    // Keep the PDF parser out of ordinary website/ebook builds.
    return Promise(import("./paginatePDF"))
        .then(({ default: paginatePDF }) => paginatePDF(output))
        .catch((err) => {
            if (err.type === "ebook" || err.type === "install.required") throw err;
            throw error.EbookError(err);
        });
}

export default onFinish;
