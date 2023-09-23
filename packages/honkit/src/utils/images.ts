import Promise from "./promise";
import fs from "./fs";

// Converts a inline data: to png file
function convertInlinePNG(source, dest) {
    if (!/^data:image\/png/.test(source)) return Promise.reject(new Error("Source is not a PNG data-uri"));

    const base64data = source.split("data:image/png;base64,")[1];
    const buf = Buffer.from(base64data, "base64");

    return fs.writeFile(dest, buf).then(() => {
        if (fs.existsSync(dest)) return;

        throw new Error(`Error converting ${source} into ${dest}`);
    });
}

export default {
    convertInlinePNG: convertInlinePNG
};
