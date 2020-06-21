const ENTITIES = require("../constants/entities");

const ENTITY_TYPES = Object.values(ENTITIES);

/**
 * Return true if a token is an entity
 *
 * @param {Token}
 * @return {Boolean}
 */
function isEntity(token) {
    return ENTITY_TYPES.indexOf(token.getType()) >= 0;
}

export default isEntity;
