"use strict";
const object = Object.freeze({ key: "value" });
// freezeしたオブジェクトにプロパティを追加や変更できない
object.key = "value"; // => TypeError: "key" is read-only