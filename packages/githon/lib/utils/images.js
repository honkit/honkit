var Promise = require("./promise");
var fs = require("./fs");

// Converts a inline data: to png file
function convertInlinePNG(source, dest) {
    if (!/^data\:image\/png/.test(source)) return Promise.reject(new Error("Source is not a PNG data-uri"));

    var base64data = source.split("data:image/png;base64,")[1];
    var buf = new Buffer(base64data, "base64");

    return fs.writeFile(dest, buf).then(function () {
        if (fs.existsSync(dest)) return;

        throw new Error("Error converting " + source + " into " + dest);
    });
}

module.exports = {
    convertInlinePNG: convertInlinePNG,
};
