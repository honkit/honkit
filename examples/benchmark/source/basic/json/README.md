---
author: laco
description: "JavaScriptのオブジェクトリテラルをベースに作られたデータフォーマットであるJSONを紹介します。また、JavaScriptからのJSONの読み書きするビルトインオブジェクトの使い方を紹介します。"
---

# JSON {#json}

この章では、JavaScriptと密接な関係にあるJSONというデータフォーマットについて見ていきます。

## JSONとは {#what-is-json}

JSONはJavaScript Object Notationの略で、JavaScriptのオブジェクトリテラルをベースに作られた軽量なデータフォーマットです。
JSONの仕様は[ECMA-404][]として標準化されています。
JSONは、人間にとって読み書きが容易で、マシンにとっても簡単にパースや生成を行える形式になっています。
そのため、多くのプログラミング言語がJSONを扱う機能を備えています。

JSONはJavaScriptのオブジェクトリテラル、配列リテラル、各種プリミティブ型の値を組み合わせたものです。
ただしJSONとJavaScriptは一部の構文に違いがあります。
たとえばJSONでは、オブジェクトリテラルのキーを必ずダブルクォートで囲まなければいけません。
また、小数点から書きはじめる数値リテラルや、先頭がゼロからはじまる数値リテラルも使えません。
これらは機械がパースしやすくするために仕様で定められた制約です。

```json
{
    "object": { 
        "number": 1, 
        "string": "js-primer",
        "boolean": true,
        "null": null,
        "array": [1, 2, 3]
    }
}
```

JSONの細かい仕様に関しては[json.orgの日本語ドキュメント][]にわかりやすくまとまっているので、参考にするとよいでしょう。

## `JSON`オブジェクト {#json-object}

JavaScriptでJSONを扱うには、ビルトインオブジェクトである[JSONオブジェクト][]を利用します。
`JSON`オブジェクトはJSON形式の文字列とJavaScriptのオブジェクトを相互に変換するための`parse`メソッドと`stringify`メソッドを提供します。

### JSON文字列をオブジェクトに変換する {#json-parse}

[JSON.parseメソッド][]は引数に与えられた文字列をJSONとしてパースし、その結果をJavaScriptのオブジェクトとして返す関数です。
次のコードは簡単なJSON形式の文字列をJavaScriptのオブジェクトに変換する例です。

<!-- textlint-disable eslint -->

{{book.console}}
```js
// JSONはダブルクォートのみを許容するため、シングルクォートでJSON文字列を記述
const json = '{ "id": 1, "name": "js-primer" }';
const obj = JSON.parse(json);
console.log(obj.id); // => 1
console.log(obj.name); // => "js-primer"
```

<!-- textlint-enable eslint -->

文字列がJSONの配列を表す場合は、`JSON.parse`メソッドの返り値も配列になります。

{{book.console}}
```js
const json = "[1, 2, 3]";
console.log(JSON.parse(json)); // => [1, 2, 3]
```

与えられた文字列がJSON形式でパースできない場合は例外が投げられます。
また、実際のアプリケーションでJSONを扱うのは、外部のプログラムとデータを交換する用途がほとんどです。
外部のプログラムが送ってくるデータが常にJSONとして正しい保証はありません。
そのため、`JSON.parse`メソッドは基本的に`try...catch`構文で例外処理をするべきです。

{{book.console}}
```js
const userInput = "not json value";
try {
    const json = JSON.parse(userInput);
} catch (error) {
    console.log("パースできませんでした");
}
```

### オブジェクトをJSON文字列に変換する {#json-format}

[JSON.stringifyメソッド][]は第一引数に与えられたオブジェクトをJSON形式の文字列に変換して返す関数です。
HTTP通信でサーバーにデータを送信するときや、
アプリケーションが保持している状態を外部に保存するときなどに必要になります。
次のコードはJavaScriptのオブジェクトをJSON形式の文字列に変換する例です。

{{book.console}}
```js
const obj = { id: 1, name: "js-primer", bio: null };
console.log(JSON.stringify(obj)); // => '{"id":1,"name":"js-primer","bio":null}'
```

`JSON.stringify`メソッドにはオプショナルな引数が2つあります。
第二引数はreplacer引数とも呼ばれ、関数あるいは配列を渡せます。
関数を渡した場合は引数にプロパティのキーと値が渡され、その返り値によって文字列に変換される際の挙動をコントロールできます。
次の例は値がnullであるプロパティを除外してJSONに変換するreplacer引数の例です。
replacer引数の関数で`undefined`が返されたプロパティは、変換後のJSONに含まれなくなります。

{{book.console}}
```js
const obj = { id: 1, name: "js-primer", bio: null };
const replacer = (key, value) => {
    if (value === null) {
        return undefined;
    }
    return value;
};
console.log(JSON.stringify(obj, replacer)); // => '{"id":1,"name":"js-primer"}'
```

replacer引数に配列を渡した場合はプロパティのホワイトリストとして使われ、
その配列に含まれる名前のプロパティだけが変換されます。

{{book.console}}
```js
const obj = { id: 1, name: "js-primer", bio: null };
const replacer = ["id", "name"];
console.log(JSON.stringify(obj, replacer)); // => '{"id":1,"name":"js-primer"}'
```

第三引数はspace引数とも呼ばれ、変換後のJSON形式の文字列を読みやすくフォーマットする際のインデントを設定できます。
数値を渡すとその数値分の長さのスペースで、文字列を渡すとその文字列でインデントされます。
次のコードはスペース2個でインデントされたJSONを得る例です。

{{book.console}}
```js
const obj = { id: 1, name: "js-primer" };
// replacer引数を使わない場合はnullを渡して省略するのが一般的です
console.log(JSON.stringify(obj, null, 2)); 
/*
{
   "id": 1,
   "name": "js-primer"
}
*/
```

また、次のコードはタブ文字でインデントされたJSONを得る例です。

{{book.console}}
```js
const obj = { id: 1, name: "js-primer" };
console.log(JSON.stringify(obj, null, "\t")); 
/*
{
   "id": 1,
   "name": "js-primer"
}
*/
```

## JSONにシリアライズできないオブジェクト {#not-serialization-object}

`JSON.stringify`メソッドはJSONで表現可能な値だけをシリアライズします。
そのため、値が関数や`Symbol`、あるいは`undefined`であるプロパティなどは変換されません。
ただし、配列の値としてそれらが見つかったときには例外的に`null`に置き換えられます。
またキーが`Symbol`である場合にもシリアライズの対象外になります。
代表的な変換の例を次の表とサンプルコードに示します。

| シリアライズ前の値 | シリアライズ後の値 |
| ---             |  ---            | 
| 文字列・数値・真偽値 |  対応する値       | 
| null            |  null           | 
| 配列             |  配列           | 
| オブジェクト      |  オブジェクト     | 
| 関数             |  変換されない（配列のときはnull）     | 
| undefined       |  変換されない（配列のときはnull）     | 
| Symbol          |  変換されない（配列のときはnull）     | 
| RegExp          |  {}             | 
| Map, Set        |  {}             | 

{{book.console}}
```js
// 値が関数のプロパティ
console.log(JSON.stringify({ x: function() {} })); // => '{}'
// 値がSymbolのプロパティ
console.log(JSON.stringify({ x: Symbol("") })); // => '{}'
// 値がundefinedのプロパティ
console.log(JSON.stringify({ x: undefined })); // => '{}'
// 配列の場合
console.log(JSON.stringify({ x: [10, function() {}] })); // => '{"x":[10,null]}'
// キーがSymbolのプロパティ
JSON.stringify({ [Symbol("foo")]: "foo" }); // => '{}'
// 値がRegExpのプロパティ
console.log(JSON.stringify({ x: /foo/ })); // => '{"x":{}}'
// 値がMapのプロパティ
const map = new Map();
map.set("foo", "foo");
console.log(JSON.stringify({ x: map })); // => '{"x":{}}'
```

オブジェクトがシリアライズされる際は、そのオブジェクトの列挙可能なプロパティだけが再帰的にシリアライズされます。
`RegExp`や`Map`、`Set`などのインスタンスは列挙可能なプロパティを持たないため、空のオブジェクトに変換されます。

また、`JSON.stringify`メソッドがシリアライズに失敗することもあります。
よくあるのは、参照が循環しているオブジェクトをシリアライズしようとしたときに例外が投げられるケースです。
たとえば次の例のように、あるオブジェクトのプロパティを再帰的にたどって自分自身が見つかるような場合はシリアライズが不可能となります。
`JSON.parse`メソッドだけでなく、`JSON.stringify`メソッドも例外処理を行って安全に使いましょう。

[import circular-reference.js](src/circular-reference.js)

## `toJSON`メソッドを使ったシリアライズ {#serialization-by-toJSON}

オブジェクトが`toJSON`メソッドを持っている場合、`JSON.stringify`メソッドは既定の文字列変換ではなく`toJSON`メソッドの返り値を使います。
次の例のように、引数に直接渡されたときだけでなく引数のプロパティとして登場したときにも再帰的に処理されます。

{{book.console}}
```js
const obj = {
    foo: "foo",
    toJSON() {
        return "bar";
    }
};
console.log(JSON.stringify(obj)); // => '"bar"'
console.log(JSON.stringify({ x: obj })); // => '{"x":"bar"}'
```

`toJSON`メソッドは自作のクラスを特殊な形式でシリアライズする目的などに使われます。

## まとめ {#conclusion}

この章では、JSONについて学びました。

- JSONはJavaScriptのオブジェクトリテラルをベースに作られた軽量なデータフォーマット
- `JSON`オブジェクトを使ったシリアライズとデシリアライズ
- JSON形式にシリアライズできないオブジェクトもある
- `JSON.stringify`はシリアライズ対象の`toJSON`メソッドを利用する

[ECMA-404]: http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf
[json.orgの日本語ドキュメント]: http://www.json.org/json-ja.html
[JSONオブジェクト]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON
[JSON.parseメソッド]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
[JSON.stringifyメソッド]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
