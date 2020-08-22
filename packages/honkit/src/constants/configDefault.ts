import schema from "./configSchema";
import Immutable from "immutable";
import jsonSchemaDefaults from "json-schema-defaults";

export default Immutable.fromJS(jsonSchemaDefaults(schema));
