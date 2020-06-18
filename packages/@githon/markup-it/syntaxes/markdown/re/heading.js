const heading = {
    // Normal heading "# Hello"
    normal: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n|$)/,

    // 2 Lines heading
    line: /^([^\n]+)\n *(=|-){2,} *(?:\n|$)/,

    // ID in heading
    id: /({#)(.+)(})/g,
};

module.exports = heading;
