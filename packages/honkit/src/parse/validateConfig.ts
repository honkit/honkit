import jsonschema from "jsonschema";
import jsonSchemaDefaults from "json-schema-defaults";
import schema from "../constants/configSchema";
import error from "../utils/error";
import mergeDefaults from "../utils/mergeDefaults";

/**
 Validate a book.json content
 And return a mix with the default value

 @param {Object} bookJson
 @return {Object}
 */

function validateConfig(bookJson) {
    const v = new jsonschema.Validator();
    const result = v.validate(bookJson, schema, {
        propertyName: "config"
    });

    // Throw error
    if (result.errors.length > 0) {
        throw new error.ConfigurationError(new Error(result.errors[0].stack));
    }

    // Insert default values
    const defaults = jsonSchemaDefaults(schema);
    return mergeDefaults(bookJson, defaults);
}

export default validateConfig;
