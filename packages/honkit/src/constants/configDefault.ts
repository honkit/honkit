import schema from "./configSchema";
const Immutable = require("immutable");
const jsonSchemaDefaults = require("json-schema-defaults");
module.exports = Immutable.fromJS(jsonSchemaDefaults(schema));
