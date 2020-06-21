import encodeBook from "./encodeBook";
import encodePage from "./encodePage";
import encodeFile from "./encodeFile";

/**
 * Return a JSON representation of a book with a specific file
 *
 * @param {Book} output
 * @param {Page} page
 * @return {Object}
 */
function encodeBookWithPage(book, page) {
    const file = page.getFile();

    const result = encodeBook(book);
    result.page = encodePage(page, book.getSummary());
    result.file = encodeFile(file);

    return result;
}

export default encodeBookWithPage;
