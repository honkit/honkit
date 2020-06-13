// すべての名前つきエクスポートをmyModuleオブジェクトとしてまとめてインポートする
import * as myModule from "./my-module.js";
// fooとして名前つきエクスポートされた値にアクセスする
console.log(myModule.foo); // => "foo"
// defaultとしてデフォルトエクスポートされた値にアクセスする
console.log(myModule.default); // => { baz: "baz" }
