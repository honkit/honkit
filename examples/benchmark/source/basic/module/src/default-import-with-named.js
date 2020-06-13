// myModuleとしてデフォルトインポートし、
// fooを名前つきインポートする
import myModule, { foo } from "./my-module.js";
console.log(foo); // => "foo"
console.log(myModule); // => { baz: "baz" }
