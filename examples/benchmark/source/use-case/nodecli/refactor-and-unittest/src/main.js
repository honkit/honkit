const program = require("commander");
const fs = require("fs");
// md2htmlモジュールをインポートする
const md2html = require("./md2html");

program.option("--gfm", "GFMを有効にする");
program.parse(process.argv);
const filePath = program.args[0];

const cliOptions = {
    gfm: false,
    ...program.opts(),
};

fs.readFile(filePath, { encoding: "utf8" }, (err, file) => {
    if (err) {
        console.error(err);
        process.exit(1);
        return;
    }
    // md2htmlモジュールを使ってHTMLに変換する
    const html = md2html(file, cliOptions);
    console.log(html);
});
