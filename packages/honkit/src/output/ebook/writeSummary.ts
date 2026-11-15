import WebsiteGenerator from "../website";
import JSONUtils from "../../json";
import Templating from "../../templating";
import writeFile from "../helper/writeFile";
import type { PDFTocContext } from "./pdfToc";

export const SUMMARY_FILE = "SUMMARY.html";

/** Render only the front TOC; page generation and plugin hooks are not repeated. */
function writeSummary(output, pdfToc?: PDFTocContext) {
    const prefix = output.getOptions().get("prefix");
    const engine = WebsiteGenerator.createTemplateEngine(output, SUMMARY_FILE);
    const context = { ...JSONUtils.encodeOutput(output), pdfToc };

    return Templating.renderFile(engine, `${prefix}/summary.html`, context).then((tplOut) =>
        writeFile(output, SUMMARY_FILE, tplOut.getContent())
    );
}

export default writeSummary;
