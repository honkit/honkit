// ./my-module.jsのすべての名前つきエクスポートを再エクスポートする
export * from "./my-module.js";
// ./my-module.jsの名前つきエクスポートを選んで再エクスポートする
export { foo, bar } from "./my-module.js";
// ./my-module.jsの名前つきエクスポートにエイリアスをつけて再エクスポートする
export { foo as myModuleFoo, bar as myModuleBar } from "./my-module.js";
// ./my-module.jsのデフォルトエクスポートをデフォルトエクスポートとして再エクスポートする
export { default } from "./my-module.js";
// ./my-module.jsのデフォルトエクスポートを名前つきエクスポートとして再エクスポートする
export { default as myModuleDefault } from "./my-module.js";
// ./my-module.jsの名前つきエクスポートをデフォルトエクスポートとして再エクスポートする
export { foo as default } from "./my-module.js";
