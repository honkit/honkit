/**
 Edit title of a part in the summary

 @param {Summary} summary
 @param {number} index
 @param {string} newTitle
 @return {Summary}
 */
function editPartTitle(summary, index, newTitle) {
    let parts = summary.getParts();

    let part = parts.get(index);
    if (!part) {
        return summary;
    }

    part = part.set("title", newTitle);
    parts = parts.set(index, part);

    return summary.set("parts", parts);
}

export default editPartTitle;
