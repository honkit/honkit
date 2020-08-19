// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Options'.
const Options = Immutable.Record({
    // Root folder for the output
    root: String(),

    // Prefix for generation
    prefix: String("website"),

    // Use directory index url instead of "index.html"
    directoryIndex: Boolean(true),
});

module.exports = Options;
