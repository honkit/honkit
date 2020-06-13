// LICENSE : MIT
"use strict";
const tester = require("text-testing-mocha");
const fs = require("fs");
const path = require("path");
const content = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf-8");
describe("implicit-coercion", function() {
    tester(content, (section) => {
        section("**型変換**は分類すると次の二種類", (test) => {
            test("明示的な型変換");
            test("暗黙的な型変換");
        });
        section("**明示的**な**型変換**を利用するには", (test) => {
            test("それぞれのプリミティブ型の**コンストラクタ関数**を使う");
            test("**真偽値**は各種方法で得ることができるので色々");
        });
        section("なぜ**暗黙的な型変換**を**避ける**べきなのか", (test) => {
            test("**意図しない挙動**を起こすことがあるため");
            test("**エラー**が暗黙的な型変換により隠されることがある");
            test("**バグ**を見つけることが難しくなる");
            test("**意図しない挙動**を発生させることがある");
        });
        section("**暗黙的な型変換**とは", (test) => {
            test("**演算子**のアルゴリズムステップでの副作用を期待しての**型変換**のこと");
            test("**明示的**ではない**型変換**のこと");
        });
    });
});
