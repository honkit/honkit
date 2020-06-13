// commanderモジュールをprogramとしてインポートする
const program = require("commander");
// コマンドライン引数をcommanderでパースする
program.parse(process.argv);

// ファイルパスをprogram.args配列から取り出す
const filePath = program.args[0];
console.log(filePath);
