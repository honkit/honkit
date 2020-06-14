/**
    Parse content of a page

    @param {String} html
    @return {Object}
*/
function parsePage(html) {
    return {
        content: html,
    };
}

module.exports = parsePage;
