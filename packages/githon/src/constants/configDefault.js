import Immutable from "immutable";
import jsonSchemaDefaults from "json-schema-defaults";

import schema from "./configSchema";

export default Immutable.fromJS(jsonSchemaDefaults(schema));
