const objectValues = require("object-values");
const ENTITIES = require("../constants/entities");

const ENTITY_TYPES = objectValues(ENTITIES);

/**
 * Return true if a token is an entity
 *
 * @param {Token}
 * @return {Boolean}
 */
function isEntity(token) {
    return ENTITY_TYPES.indexOf(token.getType()) >= 0;
}

module.exports = isEntity;
