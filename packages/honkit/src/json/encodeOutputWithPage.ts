import encodeOutput from "./encodeOutput";
import encodePage from "./encodePage";
import encodeFile from "./encodeFile";

/**
 * Return a JSON representation of a book with a specific file
 *
 * @param {Book} output
 * @param {Page} page
 * @return {Object}
 */
function encodeOutputWithPage(output, page) {
    const file = page.getFile();
    const book = output.getBook();

    const result = encodeOutput(output);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'page' does not exist on type '{ summary:... Remove this comment to see the full error message
    result.page = encodePage(page, book.getSummary());

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'file' does not exist on type '{ summary:... Remove this comment to see the full error message
    result.file = encodeFile(file);

    return result;
}

export default encodeOutputWithPage;
