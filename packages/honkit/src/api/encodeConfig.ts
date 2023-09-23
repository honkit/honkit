import objectPath from "object-path";
import deprecate from "./deprecate";
import Output from "../models/output";
import Config from "../models/config";

/**
 Encode a config object into a JS config api
 */

function encodeConfig(output: Output, config: Config) {
    const result = {
        values: config.getValues().toJS(),

        get: function (key, defaultValue) {
            return objectPath.get(result.values, key, defaultValue);
        },

        set: function (key, value) {
            return objectPath.set(result.values, key, value);
        }
    };

    deprecate.field(
        output,
        "config.options",
        result,
        "options",
        result.values,
        '"config.options" property is deprecated, use "config.get(key)" instead'
    );

    deprecate.field(
        output,
        "config.options.generator",
        result.values,
        "generator",
        output.getGenerator(),
        '"options.generator" property is deprecated, use "output.name" instead'
    );

    deprecate.field(
        output,
        "config.options.generator",
        result.values,
        "output",
        output.getRoot(),
        '"options.output" property is deprecated, use "output.root()" instead'
    );

    return result;
}

export default encodeConfig;
