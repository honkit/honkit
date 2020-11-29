import SummaryPart from "../../models/summaryPart";
import indexLevels from "./indexLevels";
import Summary from "../../models/summary";

/**
 Returns a new Summary with a part inserted at given index

 @param {Summary} summary
 @param {Part} part
 @param {number} index
 @return {Summary}
 */
function insertPart(summary: Summary, part: SummaryPart, index: number) {
    part = new SummaryPart(part);

    const parts = summary.getParts().insert(index, part);
    return indexLevels(summary.set("parts", parts));
}

export default insertPart;
