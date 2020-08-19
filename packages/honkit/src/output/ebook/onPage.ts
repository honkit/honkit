// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'WebsiteGen... Remove this comment to see the full error message
const WebsiteGenerator = require("../website");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Modifiers'... Remove this comment to see the full error message
const Modifiers = require("../modifiers");

/**
    Write a page for ebook output

    @param {Output} output
    @param {Output}
*/
// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function onPage(output, page) {
    const options = output.getOptions();

    // Inline assets
    return (
        Modifiers.modifyHTML(page, [Modifiers.inlineAssets(options.get("root"), page.getFile().getPath())])

            // Write page using website generator
            .then((resultPage) => {
                return WebsiteGenerator.onPage(output, resultPage);
            })
    );
}

module.exports = onPage;
