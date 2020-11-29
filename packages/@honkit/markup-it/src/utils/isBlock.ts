import BLOCKS from "../constants/blocks";

const BLOCK_TYPES = Object.values(BLOCKS);

/**
 * Return true if a token is a block
 *
 * @param {Token}
 * @return {boolean}
 */
function isBlock(token) {
    return BLOCK_TYPES.indexOf(token.getType()) >= 0;
}

export default isBlock;
