import extend from "extend";
import Promise from "../../utils/promise";
import getPDFTemplate from "./getPDFTemplate";
import getCoverPath from "./getCoverPath";

/**
 Generate options for ebook-convert

 @param {Output}
 @return {Promise<Object>}
 */

function getConvertOptions(output) {
    const options = output.getOptions();
    const format = options.get("format");

    const book = output.getBook();
    const config = book.getConfig();

    return Promise().then(() => {
        const coverPath = getCoverPath(output);
        let options = {
            "--cover": coverPath,
            "--title": config.getValue("title"),
            "--comments": config.getValue("description"),
            "--isbn": config.getValue("isbn"),
            "--authors": config.getValue("author"),
            "--author-sort": config.getValue("authorSort"),
            "--language": book.getLanguage() || config.getValue("language"),
            "--book-producer": config.getValue("producer") || "HonKit",
            "--publisher": config.getValue("publisher") || "HonKit",
            "--pubdate": config.getValue("pubdate"),
            "--series": config.getValue("series"),
            "--series-index": config.getValue("seriesIndex"),
            "--chapter": "descendant-or-self::*[contains(concat(' ', normalize-space(@class), ' '), ' book-chapter ')]",
            "--level1-toc":
                "descendant-or-self::*[contains(concat(' ', normalize-space(@class), ' '), ' book-chapter-1 ')]",
            "--level2-toc":
                "descendant-or-self::*[contains(concat(' ', normalize-space(@class), ' '), ' book-chapter-2 ')]",
            "--level3-toc":
                "descendant-or-self::*[contains(concat(' ', normalize-space(@class), ' '), ' book-chapter-3 ')]",
            "--max-levels": "1",
            "--no-chapters-in-toc": true,
            "--breadth-first": true,
            "--dont-split-on-page-breaks": format === "epub" ? true : undefined
        };

        if (format !== "pdf") {
            return options;
        }

        return Promise.all([getPDFTemplate(output, "header"), getPDFTemplate(output, "footer")]).spread(
            (headerTpl, footerTpl) => {
                const pdfOptions = config.getValue("pdf").toJS();

                return (options = extend(options, {
                    "--chapter-mark": String(pdfOptions.chapterMark),
                    "--page-breaks-before": String(pdfOptions.pageBreaksBefore),
                    "--pdf-page-margin-left": String(pdfOptions.margin.left),
                    "--pdf-page-margin-right": String(pdfOptions.margin.right),
                    "--pdf-page-margin-top": String(pdfOptions.margin.top),
                    "--pdf-page-margin-bottom": String(pdfOptions.margin.bottom),
                    "--pdf-default-font-size": String(pdfOptions.fontSize),
                    "--pdf-mono-font-size": String(pdfOptions.fontSize),
                    "--paper-size": String(pdfOptions.paperSize),
                    "--pdf-page-numbers": Boolean(pdfOptions.pageNumbers),
                    "--pdf-sans-family": String(pdfOptions.fontFamily),
                    "--pdf-header-template": headerTpl,
                    "--pdf-footer-template": footerTpl,
                    "--embed-all-fonts": Boolean(pdfOptions.embedFonts)
                }));
            }
        );
    });
}

export default getConvertOptions;
