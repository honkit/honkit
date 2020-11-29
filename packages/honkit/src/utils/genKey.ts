let lastKey = 0;

/*
    Generate a random key
    @return {string}
*/
function generateKey() {
    lastKey += 1;
    const str = lastKey.toString(16);
    return "00000".slice(str.length) + str;
}

export default generateKey;
