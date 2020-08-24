import buildEbook from "./buildEbook";
import build from "./build";
import serve from "./serve";
import parse from "./parse";
import init from "./init";
export default [build, serve, parse, init, buildEbook("pdf"), buildEbook("epub"), buildEbook("mobi")];
