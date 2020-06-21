const is = require("is");

const MarkupIt = require("../../");
function identity(value) {
    return value;
}

const SINGLE_TAG = ["img", "hr"];

/**
 * Convert a map of attributes into a string
 * @param {Object} attrs
 * @return {String}
 */
function attrsToString(attrs) {
    let output = "",
        value;

    for (const key in attrs) {
        value = attrs[key];
        if (is.undefined(value) || is.null(value)) {
            continue;
        }

        if (is.string(value) && !value) {
            output += ` ${key}`;
        } else {
            output += ` ${key}=${JSON.stringify(value)}`;
        }
    }

    return output;
}

function HTMLRule(type, tag, getAttrs) {
    getAttrs = getAttrs || identity;
    const isSingleTag = SINGLE_TAG.indexOf(tag) >= 0;

    return MarkupIt.Rule(type).toText((state, token) => {
        const text = state.render(token);
        const data = token.getData().toJS();
        const attrs = getAttrs(data, token);

        let output = `<${tag}${attrsToString(attrs)}${isSingleTag ? "/>" : ">"}`;

        if (!isSingleTag) {
            output += text;
            output += `</${tag}>`;
        }

        return output;
    });
}

module.exports = HTMLRule;
