---
author: azu
description: "Note"
---

## Table

- <https://azu.github.io/what-is-this/>
- [azu/what-is-this: What value is `this` in Strict, Script, or Module?](https://github.com/azu/what-is-this "azu/what-is-this: What value is `this` in Strict, Script, or Module?")

Notes: `const fn = () => this` はChrome64.0.3282.3では壊れている

それぞれの`this`の評価結果のまとめ。
`fn()`または`obj.method()`をそれぞれの環境で実行した際の`this`の結果をまとめたもの

- <https://azu.github.io/what-is-this/>

| 実行環境   | Strict | コード                                      | 結果        |
| ------ | ------ | ---------------------------------------- | --------- |
| Script | NO     | `this`                                   | global    |
| Script | NO     | `const fn = () => this`                  | global    |
| Script | NO     | `const fn = function(){ return this; }`  | global    |
| Script | YES    | `this`                                   | global    |
| Script | YES    | `const fn = () => this`                  | global    |
| Script | YES    | `const fn = function(){ return this; }`  | undefined |
| Module | YES    | `this`                                   | undefined |
| Module | YES    | `const fn = () => this`                  | undefined |
| Module | YES    | `const fn = function(){ return this; }`  | undefined |
| ＊      | ＊      | `const obj = { method(){ return this; } }` | `obj`     |
| ＊      | ＊      | `const obj = { method: function(){ return this; } }` | `obj`     |
| Script | ＊      | `const obj = { method: () => { return this; } }` | global    |
| Module | ＊      | `const obj = { method: () => { return this; } }` | undefined |

`＊`はどの場合でも結果に影響しないということを示す



## Reference

- https://tc39.github.io/ecma262/#sec-arrow-function-definitions-runtime-semantics-evaluation
- https://esdiscuss.org/topic/clarification-regarding-top-level-arrow-functions-and-this-arguments
