const Immutable = require("immutable");

const STYLES = require("../constants/styles");
const ENTITIES = require("../constants/entities");

module.exports = Immutable.List([STYLES.BOLD, STYLES.ITALIC, STYLES.CODE, STYLES.STRIKETHROUGH, ENTITIES.LINK]);
