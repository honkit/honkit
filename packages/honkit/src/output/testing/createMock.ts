import createMockFS from "../../fs/mock";

import Immutable from "immutable";
import Output from "../../models/output";
import Book from "../../models/book";
import parseBook from "../../parse/parseBook";
import preparePlugins from "../preparePlugins";

/**
 * Create an output using a generator
 *
 * FOR TESTING PURPOSE ONLY
 *
 * @param {Generator} generator
 * @param {Map<String:String|Map>} files
 * @return {Promise<Output>}
 */
function createMockOutput(generator, files, options) {
    const fs = createMockFS(files);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'createForFS' does not exist on type 'Cla... Remove this comment to see the full error message
    let book = Book.createForFS(fs);
    const state = generator.State ? generator.State({}) : Immutable.Map();

    book = book.setLogLevel("disabled");
    options = generator.Options(options);

    return parseBook(book)
        .then((resultBook) => {
            return new Output({
                book: resultBook,
                options: options,
                state: state,
                generator: generator.name,
            });
        })
        .then(preparePlugins);
}

export default createMockOutput;
