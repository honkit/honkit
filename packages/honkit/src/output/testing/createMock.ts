// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Output'.
const Output = require("../../models/output");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Book'.
const Book = require("../../models/book");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseBook'... Remove this comment to see the full error message
const parseBook = require("../../parse/parseBook");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createMock... Remove this comment to see the full error message
const createMockFS = require("../../fs/mock");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'preparePlu... Remove this comment to see the full error message
const preparePlugins = require("../preparePlugins");

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

module.exports = createMockOutput;
