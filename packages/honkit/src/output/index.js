const Immutable = require("immutable");

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
