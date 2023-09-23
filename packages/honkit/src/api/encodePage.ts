import JSONUtils from "../json";
import Output from "../models/output";
import Page from "../models/page";
import deprecate from "./deprecate";
import encodeProgress from "./encodeProgress";
import { EncodedPage } from "../json/encodePage";

type PageAttributes = {
    type: string; // 'markdown' or 'asciidoc'
    path: string;
    rawPath: string;
};
export type EncodedPageWithAttributes = EncodedPage & PageAttributes;
export type PartialEncodedPageWithAttributes = EncodedPage & Partial<PageAttributes>;

/**
 Encode a page in a context to a JS API
 */

function encodePage(output: Output, page: Page): EncodedPageWithAttributes {
    const book = output.getBook();
    const summary = book.getSummary();
    const fs = book.getContentFS();
    const file = page.getFile();

    // JS Page is based on the JSON output
    const result: PartialEncodedPageWithAttributes = JSONUtils.encodePage(page, summary);

    result.type = file.getType();
    result.path = file.getPath();
    result.rawPath = fs.resolve(result.path);

    deprecate.field(
        output,
        "page.progress",
        result,
        "progress",
        () => {
            return encodeProgress(output, page);
        },
        '"page.progress" property is deprecated'
    );

    deprecate.field(
        output,
        "page.sections",
        result,
        "sections",
        [
            {
                content: result.content,
                type: "normal"
            }
        ],
        '"sections" property is deprecated, use page.content instead'
    );

    return result as EncodedPageWithAttributes;
}

export default encodePage;
