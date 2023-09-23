import path from "path";
import options from "./options";
import initBook from "../init";

export default {
    name: "init [book]",
    description: "setup and create files for chapters",
    options: [options.log],
    exec: function (args, kwargs) {
        const bookRoot = path.resolve(process.cwd(), args[0] || "./");

        return initBook(bookRoot);
    }
};
