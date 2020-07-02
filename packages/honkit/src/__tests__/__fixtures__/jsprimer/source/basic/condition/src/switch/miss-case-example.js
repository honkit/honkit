const version = "ES6";
switch (version) {
    case "ES5":
        console.log("ECMAScript 5");
    case "ES6": // 一致するケース
        console.log("ECMAScript 2015");
    case "ES7": // breakされないため条件無視して実行
        console.log("ECMAScript 2016");
    default:    // breakされないため条件無視して実行
        console.log("しらないバージョンです");
}
/*
 "ECMAScript 2015"
 "ECMAScript 2016"
 "しらないバージョンです"
 と出力される
 */