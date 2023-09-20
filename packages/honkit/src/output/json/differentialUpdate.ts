import * as fs from "fs";
import * as path from "path";

const cwdDir: string = path.resolve(process.cwd());
const modified: string = ".notConvertedPaths";
const modifiedPath: string = path.join(cwdDir, modified);

interface DifferentialUpdate {
    cacheData: any;
    readData: () => any;
    writeData: (jsonData: any) => void;
}

const differentialUpdate: DifferentialUpdate = {
    cacheData: null,
    readData: function read(): any {
        let result: any = null;
        if (differentialUpdate.cacheData !== null) {
            // console.log("readData from cache");
            result = differentialUpdate.cacheData;
        } else {
            let txt: string = fs.readFileSync(modifiedPath, "utf-8");
            if (txt.length === 0 || txt === "") {
                result = [];
            } else {
                // console.log("readData from file");
                result = JSON.parse(txt);
            }
        }
        return result;
    },
    writeData: function write(jsonData: any): void {
        // uniq filter
        const uniqData = new Map();
        for (const path of jsonData) {
            uniqData.set(path, true);
        }
        let notConvertedPaths = Array.from(uniqData.keys());
        for (const path of notConvertedPaths) {
            console.log(`not converted "${path}"`);
        }

        differentialUpdate.cacheData = notConvertedPaths;
        try {
            let data = JSON.stringify(notConvertedPaths, null, "  ");
            fs.writeFileSync(modifiedPath, data);
        } catch (e) {
            console.log(e.message);
        }
    }
};

export = differentialUpdate;
