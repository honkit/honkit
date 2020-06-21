const entities = require("html-entities");
const htmlEntities = new entities.AllHtmlEntities();

/**
 * Escape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function escape(str) {
    return htmlEntities.encode(str);
}

/**
 * Unescape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function unescape(str) {
    return htmlEntities.decode(str);
}

module.exports = {
    escape: escape,
    unescape: unescape,
};
