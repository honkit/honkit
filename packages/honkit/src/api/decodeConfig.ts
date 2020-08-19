/**
 Decode changes from a JS API to a config object

 @param {Config} config
 @param {Object} result: result from API
 @return {Config}
 */
function decodeConfig(config, result) {
    const values = result.values;

    delete values.generator;
    delete values.output;

    return config.updateValues(values);
}

export { decodeConfig };
