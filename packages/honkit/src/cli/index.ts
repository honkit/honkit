import buildEbook from "./buildEbook";

export default [
    require("./build"),
    require("./serve"),
    require("./parse"),
    require("./init"),
    buildEbook("pdf"),
    buildEbook("epub"),
    buildEbook("mobi"),
];
