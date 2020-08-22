import Immutable from "immutable";
import { generateBook, incrementalBuild } from "./generateBook";

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

export default {
    generate: generateBook,
    incrementalBuild,
    getGenerator: getGenerator,
};
