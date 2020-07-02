const program = require("commander");
const fs = require("fs");
// markedモジュールをmarkedオブジェクトとしてインポートする
const marked = require("marked");

program.parse(process.argv);
const filePath = program.args[0];

fs.readFile(filePath, { encoding: "utf8" }, (err, file) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
        return;
    }
    // MarkdownファイルをHTML文字列に変換する
    const html = marked(file);
    console.log(html);
});
