// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'jsonSchema... Remove this comment to see the full error message
const jsonSchemaDefaults = require("json-schema-defaults");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'schema'.
const schema = require("./configSchema");

module.exports = Immutable.fromJS(jsonSchemaDefaults(schema));
