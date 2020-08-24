import indexPartLevels from "./indexPartLevels";

/**
 Index all levels in the summary

 @param {Summary}
 @return {Summary}
 */

function indexLevels(summary) {
    let parts = summary.getParts();
    parts = parts.map(indexPartLevels);

    return summary.set("parts", parts);
}

export default indexLevels;
