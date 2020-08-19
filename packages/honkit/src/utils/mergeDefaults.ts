// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

/**
 * Merge
 * @param  {Object|Map} obj
 * @param  {Object|Map} src
 * @return {Object}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'mergeDefau... Remove this comment to see the full error message
function mergeDefaults(obj, src) {
    const objValue = Immutable.fromJS(obj);
    const srcValue = Immutable.fromJS(src);

    return srcValue.mergeDeep(objValue).toJS();
}

module.exports = mergeDefaults;
