// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'jsonschema... Remove this comment to see the full error message
const jsonschema = require("jsonschema");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'jsonSchema... Remove this comment to see the full error message
const jsonSchemaDefaults = require("json-schema-defaults");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'error'.
const error = require("../utils/error");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'mergeDefau... Remove this comment to see the full error message
const mergeDefaults = require("../utils/mergeDefaults");

/**
    Validate one plugin for a book and update book's confiration

    @param {Book}
    @param {Plugin}
    @return {Book}
*/
function validatePluginConfig(book, plugin) {
    let config = book.getConfig();
    const packageInfos = plugin.getPackage();

    const configKey = ["pluginsConfig", plugin.getName()].join(".");

    let pluginConfig = config.getValue(configKey, {}).toJS();

    const schema = (packageInfos.get("gitbook") || Immutable.Map()).toJS();
    if (!schema) return book;

    // Normalize schema
    schema.id = `/${configKey}`;
    schema.type = "object";

    // Validate and throw if invalid
    const v = new jsonschema.Validator();
    const result = v.validate(pluginConfig, schema, {
        propertyName: configKey,
    });

    // Throw error
    if (result.errors.length > 0) {
        throw new error.ConfigurationError(new Error(result.errors[0].stack));
    }

    // Insert default values
    const defaults = jsonSchemaDefaults(schema);
    pluginConfig = mergeDefaults(pluginConfig, defaults);

    // Update configuration
    config = config.setValue(configKey, pluginConfig);

    // Return new book
    return book.set("config", config);
}

/**
    Validate a book configuration for plugins and
    returns an update configuration with default values.

    @param {Book}
    @param {OrderedMap<String:Plugin>}
    @return {Promise<Book>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateCo... Remove this comment to see the full error message
function validateConfig(book, plugins) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'reduce' does not exist on type 'PromiseC... Remove this comment to see the full error message
    return Promise.reduce(
        plugins,
        (newBook, plugin) => {
            return validatePluginConfig(newBook, plugin);
        },
        book
    );
}

module.exports = validateConfig;
