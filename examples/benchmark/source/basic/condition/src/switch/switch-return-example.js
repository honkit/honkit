function getECMAScriptName(version) {
    switch (version) {
        case "ES5":
            return "ECMAScript 5";
        case "ES6":
            return "ECMAScript 2015";
        case "ES7":
            return "ECMAScript 2016";
        default:
            return "しらないバージョンです";
    }
}
// 関数を実行して`return`された値を得る
getECMAScriptName("ES6"); // => "ECMAScript 2015"