// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generateBo... Remove this comment to see the full error message
const { generateBook, incrementalBuild } = require("./generateBook");

const generators = Immutable.List([require("./json"), require("./website"), require("./ebook")]);
/**
 Return a specific generator by its name

 @param {String}
 @return {Generator}
 */
function getGenerator(name) {
    return generators.find((generator) => {
        return generator.name == name;
    });
}
module.exports = {
    generate: generateBook,
    incrementalBuild,
    getGenerator: getGenerator,
};
