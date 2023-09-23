import encodeBook from "./encodeBook";

/**
 * Encode an output to JSON
 *
 * @param {Output}
 * @return {Object}
 */
function encodeOutputToJson(output) {
    const book = output.getBook();
    const generator = output.getGenerator();
    const options = output.getOptions();

    const result = encodeBook(book);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'output' does not exist on type '{ summar... Remove this comment to see the full error message
    result.output = {
        name: generator
    };

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type '{ summa... Remove this comment to see the full error message
    result.options = options.toJS();

    return result;
}

export default encodeOutputToJson;
