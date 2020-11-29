import STYLES from "../constants/styles";

const STYLE_TYPES = Object.values(STYLES);

/**
 * Return true if a token is a style
 *
 * @param {Token}
 * @return {boolean}
 */
function isStyle(token) {
    return STYLE_TYPES.indexOf(token.getType()) >= 0;
}

export default isStyle;
