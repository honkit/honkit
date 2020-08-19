const I18n = require("i18n-t");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

const GeneratorState = Immutable.Record({
    i18n: I18n(),

    // List of plugins' resources
    resources: Immutable.Map(),
});

GeneratorState.prototype.getI18n = function () {
    return this.get("i18n");
};

GeneratorState.prototype.getResources = function () {
    return this.get("resources");
};

module.exports = GeneratorState;
