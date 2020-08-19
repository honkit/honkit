// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");

/**
    Edit all elements matching a selector
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'editHTMLEl... Remove this comment to see the full error message
function editHTMLElement($, selector, fn) {
    const $elements = $(selector);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type 'Promise... Remove this comment to see the full error message
    return Promise.forEach($elements, (el) => {
        const $el = $(el);
        return fn($el);
    });
}

module.exports = editHTMLElement;
