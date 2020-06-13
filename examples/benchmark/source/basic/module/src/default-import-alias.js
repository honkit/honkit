// デフォルトエクスポートをmyModuleとしてインポートする
import { default as myModule } from "./my-module.js";
console.log(myModule); // => { baz: "baz" }
