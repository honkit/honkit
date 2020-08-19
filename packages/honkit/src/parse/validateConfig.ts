// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'jsonschema... Remove this comment to see the full error message
const jsonschema = require("jsonschema");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'jsonSchema... Remove this comment to see the full error message
const jsonSchemaDefaults = require("json-schema-defaults");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'schema'.
const schema = require("../constants/configSchema");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'error'.
const error = require("../utils/error");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'mergeDefau... Remove this comment to see the full error message
const mergeDefaults = require("../utils/mergeDefaults");

/**
    Validate a book.json content
    And return a mix with the default value

    @param {Object} bookJson
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateCo... Remove this comment to see the full error message
function validateConfig(bookJson) {
    const v = new jsonschema.Validator();
    const result = v.validate(bookJson, schema, {
        propertyName: "config",
    });

    // Throw error
    if (result.errors.length > 0) {
        throw new error.ConfigurationError(new Error(result.errors[0].stack));
    }

    // Insert default values
    const defaults = jsonSchemaDefaults(schema);
    return mergeDefaults(bookJson, defaults);
}

module.exports = validateConfig;
