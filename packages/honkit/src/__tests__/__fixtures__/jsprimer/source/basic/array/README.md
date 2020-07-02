---
author: azu
description: "配列は値を順番に格納できるオブジェクトです。この配列の作成、更新、削除などの基本的な操作や実際に使い方についてを紹介します。また配列における破壊的なメソッドと非破壊的メソッドの違いについても紹介します。"
---

# 配列 {#array}

配列はJavaScriptの中でもよく使われるオブジェクトです。

配列とは値に順序をつけて格納できるオブジェクトです。
配列に格納したそれぞれの値のことを**要素**、それぞれの要素の位置のことを**インデックス**（`index`）と呼びます。
インデックスは先頭の要素から`0`、`1`、`2`のように`0`からはじまる連番となります。

またJavaScriptにおける配列は可変長です。
そのため配列を作成後に配列へ要素を追加したり、配列から要素を削除できます。

この章では、配列の基本的な操作と配列を扱う場合においてのパターンについて学びます。

## 配列の作成とアクセス {#create-and-access}

配列の作成と要素へのアクセス方法は「[データ型とリテラル](../data-type/#array)」の章ですでに紹介していますが、
もう一度振り返ってみましょう。

配列の作成には配列リテラルを使います。
配列リテラル（`[`と`]`）の中に要素をカンマ（`,`）区切りで記述するだけです。

{{book.console}}
```js
const emptyArray = [];
const numbers = [1, 2, 3];
// 2次元配列（配列の配列）
const matrix = [
    ["a", "b"],
    ["c", "d"]
];
```

作成した配列の要素へインデックスとなる数値を、`配列[インデックス]`と記述することで、
そのインデックスの要素を配列から読み取れます。
配列の先頭要素のインデックスは`0`となります。配列のインデックスは、`0`以上`2^32 - 1`未満の整数となります。

{{book.console}}
```js
const array = ["one", "two", "three"];
console.log(array[0]); // => "one"
```

2次元配列（配列の配列）からの値の読み取りも同様に`配列[インデックス]`でアクセスできます。
`配列[0][0]`は、配列の`0`番目の要素である配列（`["a", "b"]`）の`0`番目の要素を読み取ります。

{{book.console}}
```js
// 2次元配列（配列の配列）
const matrix = [
    ["a", "b"],
    ["c", "d"]
];
console.log(matrix[0][0]); // => "a"
```

配列の`length`プロパティは配列の要素の数を返します。
そのため、配列の最後の要素へアクセスするには `array.length - 1` をインデックスとして利用できます。

{{book.console}}
```js
const array = ["one", "two", "three"];
console.log(array.length); // => 3
// 配列の要素数 - 1 が 最後の要素のインデックスとなる
console.log(array[array.length - 1]); // => "three"
```

一方、存在しないインデックスにアクセスした場合はどうなるでしょうか？　JavaScriptでは、存在しないインデックスに対してアクセスした場合に、例外ではなく`undefined`を返します。

{{book.console}}
```js
const array = ["one", "two", "three"];
// `array`にはインデックスが100の要素は定義されていない
console.log(array[100]); // => undefined
```

これは、配列がオブジェクトであることを考えると、次のように存在しないプロパティへアクセスしているのと原理は同じです。
オブジェクトでも、存在しないプロパティへアクセスした場合には`undefined`が返ってきます。

{{book.console}}
```js
const obj = {
    "0": "one",
    "1": "two",
    "2": "three",
    "length": 3
};
// obj["100"]は定義されていないため、undefinedが返る
console.log(obj[100]); // => undefined
```

また、配列は常に`length`の数だけ要素を持っているとは限りません。
次のように、配列リテラルでは値を省略することで、未定義の要素を含めることができます。
このような、配列の中に隙間があるものを**疎な配列**と呼びます。
一方、隙間がなくすべてのインデックスに要素がある配列を**密な配列**と呼びます。

{{book.console}}
```js
// 未定義の箇所が1つ含まれる疎な配列
// インデックスが1の値を省略しているので、カンマが2つ続いていることに注意
const sparseArray = [1,, 3];
console.log(sparseArray.length); // => 3
// 1番目の要素は存在しないため undefined が返る
console.log(sparseArray[1]); // => undefined
```

## オブジェクトが配列かどうかを判定する {#detect-array}

あるオブジェクトが配列かどうかを判定するには`Array.isArray`メソッドを利用します。
`Array.isArray`メソッドは引数が配列ならば`true`を返します。

{{book.console}}
```js
const obj = {};
const array = [];
console.log(Array.isArray(obj)); // => false
console.log(Array.isArray(array)); // => true
```

また、`typeof`演算子では配列かどうかを判定することはできません。
配列もオブジェクトの一種であるため、`typeof`演算子の結果が`"object"`となるためです。

{{book.console}}
```js
const array = [];
console.log(typeof array); // => "object"
```

### [コラム] TypedArray<sup>[ES2015]</sup> {#typed-array}

JavaScriptの配列は可変長のみですが、`TypedArray`という固定長でかつ型つきの配列を扱う別のオブジェクトが存在します。
`TypedArray`はバイナリデータのバッファを示すために使われるデータ型で、WebGLやバイナリを扱う場面で利用されます。
文字列や数値などのプリミティブ型の値はそのままでは扱えないため、通常の配列とは用途や使い勝手が異なります。

また、TypedArrayは`Array.isArray`のメソッドの結果が`false`となることからも別物と考えてよいでしょう。

```js
// TypedArrayを作成
const typedArray = new Int8Array(8);
console.log(Array.isArray(typedArray)); // => false
```

そのため、JavaScriptで配列といった場合には`Array`を示します。

## [ES2015] 配列と分割代入 {#array-destructuring}

配列の指定したインデックスの値を変数として定義し直す場合には、分割代入（Destructuring assignment）が利用できます。

配列の分割代入では、左辺に配列リテラルのような構文で定義したい変数名を書きます。
右辺の配列から対応するインデックスの要素が、左辺で定義した変数に代入されます。

次のコードでは、左辺に定義した変数に対して、右辺の配列から対応するインデックスの要素が代入されます。
`first`にはインデックスが`0`の要素、`second`にはインデックスが`1`の要素、`third`にはインデックスが`2`の要素が代入されます。

{{book.console}}
```js
const array = ["one", "two", "three"];
const [first, second, third] = array;
console.log(first);  // => "one"
console.log(second); // => "two"
console.log(third);  // => "three"
```

## [コラム] undefinedの要素と未定義の要素の違い {#diff-undefined-and-no-element}

疎な配列で該当するインデックスに要素がない場合は`undefined`を返します。
しかし、`undefined`という値も存在するため、配列に`undefined`という値がある場合に区別できません。

次のコードでは、`undefined`という値を要素として定義した密な配列と、要素そのものがない疎な配列を定義しています。
どちらも要素にアクセスした結果は`undefined`となり、区別できていないことがわかります。

{{book.console}}
```js
// 要素として`undefined`を持つ密な配列
const denseArray = [1, undefined, 3];
// 要素そのものがない疎な配列
const sparseArray = [1, , 3];
console.log(denseArray[1]); // => undefined
console.log(sparseArray[1]); // => undefined
```

この違いを見つける方法として利用できるのが`Object#hasOwnProperty`メソッドです。
`hasOwnProperty`メソッドを使うことで、配列の指定したインデックスに要素自体が存在するかを判定できます。

{{book.console}}
```js
const denseArray = [1, undefined, 3];
const sparseArray = [1, , 3];
// 要素自体は`undefined`値が存在する
console.log(denseArray.hasOwnProperty(1)); // => true
// 要素自体がない
console.log(sparseArray.hasOwnProperty(1)); // => false
```

## 配列から要素を検索 {#search-element}

配列から指定した要素を検索する目的には、
主に次の3つがあります。

- その要素のインデックスが欲しい場合
- その要素自体が欲しい場合
- その要素が含まれているかという真偽値が欲しい場合

配列にはそれぞれに対応したメソッドが用意されているため、目的別に見ていきます。

### インデックスを取得 {#indexof}

指定した要素が配列のどの位置にあるかを知りたい場合、`Array#indexOf`メソッドや`Array#findIndex`メソッド<sup>[ES2015]</sup>を利用します。
要素の位置のことを**インデックス**（`index`）と呼ぶため、メソッド名にも`index`という名前が入っています。

次のコードでは、`Array#indexOf`メソッドを利用して、配列の中から`"JavaScript"`という文字列のインデックスを取得しています。
`indexOf`メソッドは引数と厳密等価演算子（`===`）で一致する要素があるなら、その要素のインデックスを返し、該当する要素がない場合は`-1`を返します。
`indexOf`メソッドは先頭から検索して見つかった要素のインデックスを返します。
`indexOf`メソッドには対となる`Array#lastIndexOf`メソッドがあり、`lastIndexOf`メソッドでは末尾から検索した結果が得られます。

{{book.console}}
```js
const array = ["Java", "JavaScript", "Ruby"];
const indexOfJS = array.indexOf("JavaScript");
console.log(indexOfJS); // => 1
console.log(array[indexOfJS]); // => "JavaScript"
// "JS" という要素はないため `-1` が返される
console.log(array.indexOf("JS")); // => -1
```

`indexOf`メソッドは配列からプリミティブな要素を発見できますが、オブジェクトは持っているプロパティが同じでも別オブジェクトだと異なるものとして扱われます。
次のコードを見ると、同じプロパティを持つ異なるオブジェクトは、`indexOf`メソッドでは見つけることができません。
これは、異なる参照を持つオブジェクト同士は`===`で比較しても一致しないためです。

{{book.console}}
```js
const obj = { key: "value" };
const array = ["A", "B", obj];
console.log(array.indexOf({ key: "value" })); // => -1
// リテラルは新しいオブジェクトを作るため、異なるオブジェクトだと判定される
console.log(obj === { key: "value" }); // => false
// 等価のオブジェクトを検索してインデックスを返す
console.log(array.indexOf(obj)); // => 2
```

このように、異なるオブジェクトだが値は同じものを見つけたい場合には、`Array#findIndex`メソッドが利用できます。
`findIndex`メソッドの引数には配列の各要素をテストする関数をコールバック関数として渡します。
`indexOf`メソッドとは異なり、テストする処理を自由に書けます。
これにより、プロパティの値が同じ要素を配列から見つけて、その要素のインデックスを得ることができます。

{{book.console}}
```js
// colorプロパティを持つオブジェクトの配列
const colors = [
    { "color": "red" },
    { "color": "green" },
    { "color": "blue" }
];
// `color`プロパティが"blue"のオブジェクトのインデックスを取得
const indexOfBlue = colors.findIndex((obj) => {
    return obj.color === "blue";
});
console.log(indexOfBlue); // => 2
console.log(colors[indexOfBlue]); // => { "color": "blue" }
```

### 条件に一致する要素を取得 {#find}

配列から要素を取得する方法としてインデックスを使うこともできます。
先ほどのように`findIndex`メソッドでインデックスを取得し、そのインデックスで配列へアクセスすればよいだけです。

しかし、`findIndex`メソッドを使って要素を取得するケースでは、
そのインデックスが欲しいのか、またはその要素自体が欲しいのかがコードとして明確ではありません。

より明確に要素自体が欲しいということを表現するには、`Array#find`メソッド<sup>[ES2015]</sup>が使えます。
`find`メソッドには、`findIndex`メソッドと同様にテストする関数をコールバック関数として渡します。
`find`メソッドの返り値は、要素そのものとなり、要素が存在しない場合は`undefined`を返します。

{{book.console}}
```js
// colorプロパティを持つオブジェクトの配列
const colors = [
    { "color": "red" },
    { "color": "green" },
    { "color": "blue" }
];
// `color`プロパティが"blue"のオブジェクトを取得
const blueColor = colors.find((obj) => {
    return obj.color === "blue";
});
console.log(blueColor); // => { "color": "blue" }
// 該当する要素がない場合は`undefined`を返す
const whiteColor = colors.find((obj) => {
    return obj.color === "white";
});
console.log(whiteColor); // => undefined
```

### 指定範囲の要素を取得 {#slice}

配列から指定範囲の要素を取り出す方法として`Array#slice`メソッドが利用できます。
`slice`メソッドは第一引数に開始位置、第二引数に終了位置を指定することで、その範囲を取り出した新しい配列を返します。
第二引数は省略でき、省略した場合は配列の末尾が終了位置となります。

{{book.console}}
```js
const array = ["A", "B", "C", "D", "E"];
// インデックス1から4の範囲を取り出す
console.log(array.slice(1, 4)); // => ["B", "C", "D"]
// 第二引数を省略した場合は、第一引数から末尾の要素までを取り出す
console.log(array.slice(1)); // => ["B", "C", "D", "E"]
// マイナスを指定すると後ろからの数えた位置となる
console.log(array.slice(-1)); // => ["E"]
// 第一引数 > 第二引数の場合、常に空配列を返す
console.log(array.slice(4, 1)); // => []
```

### 真偽値を取得 {#get-boolean}

最後に、指定した要素が配列に含まれているかを知る方法について見ていきます。
インデックスや要素が取得できれば、その要素は配列に含まれているということはわかります。

しかし、指定した要素が含まれているか**だけ**を知りたい場合に、
`Array#findIndex`メソッドや`Array#find`メソッドは過剰な機能を持っています。
そのコードを読んだ人には、取得したインデックスや要素を何に使うのかが明確ではありません。

次のコードは、`Array#indexOf`メソッドを利用し、該当する要素が含まれているかを判定しています。
`indexOf`メソッドの結果を`indexOfJS`に代入していますが、含まれているかを判定する以外には利用していません。
コードを隅々まで読まないといけないため、意図が明確ではなくコードの読みづらさにつながります。

{{book.console}}
```js
const array = ["Java", "JavaScript", "Ruby"];
// `indexOf`メソッドは含まれていないときのみ`-1`を返すことを利用
const indexOfJS = array.indexOf("JavaScript");
if (indexOfJS !== -1) {
    console.log("配列にJavaScriptが含まれている");
    // ... いろいろな処理 ...
    // `indexOfJS`は、含まれているのかの判定以外には利用してない
}

```

そこで、ES2016で導入された`Array#includes`メソッド<sup>[ES2016]</sup>を利用します。
`Array#includes`メソッドは配列に指定要素が含まれているかを判定します。
`includes`メソッドは真偽値を返すので、`indexOf`メソッドを使った場合に比べて意図が明確になります。
前述のコードでは次のように`includes`メソッドを使うべきでしょう。

{{book.console}}
```js
const array = ["Java", "JavaScript", "Ruby"];
// `includes`は含まれているなら`true`を返す
if (array.includes("JavaScript")) {
    console.log("配列にJavaScriptが含まれている");
}
```

`includes`メソッドは、`indexOf`メソッドと同様、異なるオブジェクトだが値が同じものを見つけたい場合には利用できません。
`Array#find`メソッドのようにテストするコールバック関数を利用して、真偽値を得るには`Array#some`メソッドを利用できます。

`Array#some`メソッドはテストするコールバック関数にマッチする要素があるなら`true`を返し、存在しない場合は`false`を返します
（「[ループと反復処理](../loop/README.md#array-some)」の章を参照）。

{{book.console}}
```js
// colorプロパティを持つオブジェクトの配列
const colors = [
    { "color": "red" },
    { "color": "green" },
    { "color": "blue" }
];
// `color`プロパティが"blue"のオブジェクトがあるかどうか
const isIncludedBlueColor = colors.some((obj) => {
    return obj.color === "blue";
});
console.log(isIncludedBlueColor); // => true
```

## 追加と削除 {#add-and-delete}

配列は可変長であるため、作成後の配列に対して要素を追加、削除できます。

要素を配列の末尾へ追加するには`Array#push`が利用できます。
一方、末尾から要素を削除するには`Array#pop`が利用できます。

{{book.console}}
```js
const array = ["A", "B", "C"];
array.push("D"); // "D"を末尾に追加
console.log(array); // => ["A", "B", "C", "D"]
const poppedItem = array.pop(); // 最末尾の要素を削除し、その要素を返す
console.log(poppedItem); // => "D"
console.log(array); // => ["A", "B", "C"]
```

要素を配列の先頭へ追加するには`Array#unshift`が利用できます。
一方、配列の先頭から要素を削除するには`Array#shift`が利用できます。

{{book.console}}
```js
const array = ["A", "B", "C"];
array.unshift("S"); // "S"を先頭に追加
console.log(array); // => ["S", "A", "B", "C"]
const shiftedItem = array.shift(); // 先頭の要素を削除
console.log(shiftedItem); // => "S"
console.log(array); // => ["A", "B", "C"]
```

## 配列同士を結合 {#concat}

`Array#concat`メソッドを使うことで配列と配列を結合した新しい配列を作成できます。

{{book.console}}
```js
const array = ["A", "B", "C"];
const newArray = array.concat(["D", "E"]);
console.log(newArray); // => ["A", "B", "C", "D", "E"]
```

また、`concat`メソッドは配列だけではなく任意の値を要素として結合できます。

{{book.console}}
```js
const array = ["A", "B", "C"];
const newArray = array.concat("新しい要素");
console.log(newArray); // => ["A", "B", "C", "新しい要素"]
```

## [ES2015] 配列の展開 {#spread}

`...`（Spread構文）を使うことで、配列リテラル中に既存の配列を展開できます。

次のコードでは、配列リテラルの末尾に配列を展開しています。
これは、`Array#concat`メソッドで配列同士を結合するのと同じ結果になります。

{{book.console}}
```js
const array = ["A", "B", "C"];
// Spread構文を使った場合
const newArray = ["X", "Y", "Z", ...array];
// concatメソッドの場合
const newArrayConcat = ["X", "Y", "Z"].concat(array);
console.log(newArray); // => ["X", "Y", "Z", "A", "B", "C"]
console.log(newArrayConcat); // => ["X", "Y", "Z", "A", "B", "C"]
```

Spread構文は、`concat`メソッドとは異なり、配列リテラル中の任意の位置に配列を展開できます。
そのため、次のように要素の途中に配列を展開することも可能です。

{{book.console}}
```js
const array = ["A", "B", "C"];
const newArray = ["X", ...array, "Z"];
console.log(newArray); // => ["X", "A", "B", "C", "Z"]
```

## [ES2019] 配列をフラット化 {#flat}

`Array#flat`メソッド<sup>[ES2019]</sup>を使うことで、多次元配列をフラットな配列に変換できます。
引数を指定しなかった場合は1段階のみのフラット化ですが、引数に渡す数値でフラット化する深さを指定できます。
配列をすべてフラット化する場合には、無限を意味する`Infinity`を値として渡すことで実現できます。

{{book.console}}
<!-- doctest:meta:{ "ECMAScript": "2019" } -->
```js
const array = [[["A"], "B"], "C"];
// 引数なしは 1 を指定した場合と同じ
console.log(array.flat()); // => [["A"], "B", "C"]
console.log(array.flat(1)); // => [["A"], "B", "C"]
console.log(array.flat(2)); // => ["A", "B", "C"]
// すべてをフラット化するには Infinity を渡す
console.log(array.flat(Infinity)); // => ["A", "B", "C"]
```

また、`Array#flat`メソッドは必ず新しい配列を作成して返すメソッドです。
そのため、これ以上フラット化できない配列をフラット化しても、同じ要素を持つ新しい配列を返します。

{{book.console}}
<!-- doctest:meta:{ "ECMAScript": "2019" } -->
```js
const array = ["A", "B", "C"];
console.log(array.flat()); // => ["A", "B", "C"]
```

## 配列から要素を削除 {#delete-element}

### `Array#splice` {#splice}

配列の先頭や末尾の要素を削除する場合は`Array#shift`や`Array#pop`で行えます。
しかし、配列の任意のインデックスの要素を削除できません。
配列の任意のインデックスの要素を削除するには`Array#splice`を利用できます。

`Array#splice`メソッドを利用すると、削除した要素を自動で詰めることができます。
`Array#splice`メソッドは指定したインデックスから、指定した数だけ要素を取り除き、必要ならば要素を同時に追加できます。

{{book.console}}
<!-- doctest: ReferenceError -->
```js
const array = [];
array.splice(インデックス, 削除する要素数);
// 削除と同時に要素の追加もできる
array.splice(インデックス, 削除する要素数, ...追加する要素);
```

たとえば、配列のインデックスが`1`の要素を削除するには、インデックス`1`から`1`つの要素を削除するという指定をする必要があります。
このとき、削除した要素は自動で詰められるため、疎な配列にはなりません。

{{book.console}}
```js
const array = ["a", "b", "c"];
// 1番目から1つの要素("b")を削除
array.splice(1, 1);
console.log(array); // => ["a", "c"]
console.log(array.length); // => 2
console.log(array[1]); // => "c"
// すべて削除
array.splice(0, array.length);
console.log(array.length); // => 0
```

### `length`プロパティへの代入 {#assign-to-length}

配列のすべての要素を削除することは`Array#splice`で行えますが、
配列の`length`プロパティへの代入を利用した方法もあります。

{{book.console}}
```js
const array = [1, 2, 3];
array.length = 0; // 配列を空にする
console.log(array); // => []
```

配列の`length`プロパティへ`要素数`を代入すると、その要素数に配列が切り詰められます。
つまり、`length`プロパティへ`0`を代入すると、インデックスが`0`以降の要素がすべて削除されます。

### 空の配列を代入 {#assign-empty-array}

最後に、その配列の要素を削除するのではなく、新しい空の配列を変数へ代入する方法です。
次のコードでは、`array`変数に空の配列を代入することで、`array`に空の配列を参照させられます。

{{book.console}}
```js
let array = [1, 2, 3];
console.log(array.length); // => 3
// 新しい配列で変数を上書き
array = [];
console.log(array.length); // => 0
```

元々、`array`変数が参照していた`[1, 2, 3]`はどこからも参照されなくなり、ガベージコレクションによりメモリから解放されます。

また、`const`で宣言した配列の場合は変数に対して再代入できないため、この手法は使えません。
そのため、再代入をしたい場合は`let`または`var`で変数宣言をする必要があります。

[import, const-empty-array-invalid.js](./src/const-empty-array-invalid.js)

## 破壊的なメソッドと非破壊的なメソッド {#mutable-immutable}

これまで紹介してきた配列を変更するメソッドには、破壊的なメソッドと非破壊的メソッドがあります。この破壊的なメソッドと非破壊的メソッドの違いを知ることは、意図しない結果を避けるために重要です。
破壊的なメソッドとは、配列オブジェクトそのものを変更し、変更した配列または変更箇所を返すメソッドです。
非破壊的メソッドとは、配列オブジェクトのコピーを作成してから変更し、そのコピーした配列を返すメソッドです。

<!-- 具体例:破壊的なメソッド -->

破壊的なメソッドの例として、配列に要素を追加する`Array#push`メソッドがあります。
`push`メソッドは、`myArray`の配列そのものへ要素を追加しています。
その結果`myArray`変数の参照する配列が変更されるため破壊的なメソッドです。

{{book.console}}
```js
const myArray = ["A", "B", "C"];
const result = myArray.push("D");
// `push`の返り値は配列ではなく、追加後の配列のlength
console.log(result); // => 4
// `myArray`が参照する配列そのものが変更されている
console.log(myArray); // => ["A", "B", "C", "D"]
```

<!-- 具体例:非破壊的メソッド -->

非破壊的なメソッドの例として、配列に要素を結合する`Array#concat`メソッドがあります。
`concat`メソッドは、`myArray`をコピーした配列に対して要素を結合し、その配列を返します。
`myArray`変数の参照する配列は変更されないため非破壊的なメソッドです。

{{book.console}}
```js
const myArray = ["A", "B", "C"];
// `concat`の返り値は結合済みの新しい配列
const newArray = myArray.concat("D");
console.log(newArray); // => ["A", "B", "C", "D"]
// `myArray`は変更されていない
console.log(myArray); // => ["A", "B", "C"]
// `newArray`と`myArray`は異なる配列オブジェクト
console.log(myArray === newArray); // => false
```


JavaScriptにおいて破壊的なメソッドと非破壊的メソッドを名前から見分ける方法はありません。
また、配列を返す破壊的なメソッドもあるため、返り値からも判別できません。
たとえば、`Array#sort`メソッドは返り値がソート済みの配列ですが破壊的メソッドです。

次の表で紹介するメソッドは破壊的なメソッドです。

| メソッド名                                    | 返り値           |
| ---------------------------------------- | ------------- |
| [`Array.prototype.pop`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/pop) | 配列の末尾の値       |
| [`Array.prototype.push`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/push) | 変更後の配列のlength |
| [`Array.prototype.splice`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) | 取り除かれた要素を含む配列 |
| [`Array.prototype.reverse`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) | 反転した配列        |
| [`Array.prototype.shift`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/shift) | 配列の先頭の値       |
| [`Array.prototype.sort`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) | ソートした配列       |
| [`Array.prototype.unshift`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) | 変更後の配列のlength |
| [`Array.prototype.copyWithin`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)<sup>[ES2015]</sup> | 変更後の配列        |
| [`Array.prototype.fill`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)<sup>[ES2015]</sup> | 変更後の配列        |


破壊的メソッドは意図せぬ副作用を与えてしまうことがあるため、そのことを意識して利用する必要があります。
たとえば、配列から特定のインデックスの要素を削除する`removeAtIndex`という関数を提供したいとします。

```js
// `array`の`index`番目の要素を削除した配列を返す関数
function removeAtIndex(array, index) { /* 実装 */ }
```

次のように、破壊的なメソッドである`Array#splice`メソッドで要素を削除すると、引数として受け取った配列にも影響を与えます。
この場合`removeAtIndex`関数には副作用があるため、破壊的であることについてのコメントがあると親切です。


{{book.console}}
```js
// `array`の`index`番目の要素を削除した配列を返す関数
// 引数の`array`は破壊的に変更される
function removeAtIndex(array, index) {
    array.splice(index, 1);
    return array;
}
const array = ["A", "B", "C"];
// `array`から1番目の要素を削除した配列を取得
const newArray = removeAtIndex(array, 1);
console.log(newArray); // => ["A", "C"]
// `array`自体にも影響を与える
console.log(array); // => ["A", "C"]
```

一方、非破壊的メソッドは配列のコピーを作成するため、元々の配列に対して影響はありません。
この`removeAtIndex`関数を非破壊的なものにするには、受け取った配列をコピーしてから変更を加える必要があります。

JavaScriptには`copy`メソッドそのものは存在しませんが、配列をコピーする方法として`Array#slice`メソッドと`Array#concat`メソッドが利用されています。`slice`メソッドと`concat`メソッドは引数なしで呼び出すと、その配列のコピーを返します。

{{book.console}}
```js
const myArray = ["A", "B", "C"];
// `slice`は`myArray`のコピーを返す - `myArray.concat()`でも同じ
const copiedArray = myArray.slice();
myArray.push("D");
console.log(myArray); // => ["A", "B", "C", "D"]
// `array`のコピーである`copiedArray`には影響がない
console.log(copiedArray); // => ["A", "B", "C"]
// コピーであるため参照は異なる
console.log(copiedArray === myArray); // => false
```

コピーした配列に変更を加えることで、`removeAtIndex`関数を非破壊的な関数として実装できます。
非破壊的であれば引数の配列への副作用がないので、注意させるようなコメントは不要です。

{{book.console}}
```js
// `array`の`index`番目の要素を削除した配列を返す関数
function removeAtIndex(array, index) {
    // コピーを作成してから変更する
    const copiedArray = array.slice();
    copiedArray.splice(index, 1);
    return copiedArray;
}
const array = ["A", "B", "C"];
// `array`から1番目の要素を削除した配列を取得
const newArray = removeAtIndex(array, 1);
console.log(newArray); // => ["A", "C"]
// 元の`array`には影響がない
console.log(array); // => ["A", "B", "C"]
```

このようにJavaScriptの配列には破壊的なメソッドと非破壊的メソッドが混在しています。そのため、統一的なインターフェースで扱えないのが現状です。
このような背景もあるため、JavaScriptには配列を扱うためのさまざまライブラリが存在します。
非破壊的な配列を扱うライブラリの例として[immutable-array-prototype][]や[Immutable.js][]などがあります。

## 配列を反復処理するメソッド {#array-iterate}

「[ループと反復処理][]」の章において配列を反復処理する方法を一部解説しましたが、改めて関連するArrayメソッドを見ていきます。
反復処理の中でもよく利用されるのが`Array#forEach`、`Array#map`、`Array#filter`、`Array#reduce`です。
どのメソッドも共通して引数にコールバック関数を受け取るため高階関数と呼ばれます。

### `Array#forEach` {#array-foreach}

`Array#forEach`は配列の要素を先頭から順番にコールバック関数へ渡し、反復処理を行うメソッドです。

次のようにコールバック関数には`要素, インデックス, 配列`が引数として渡され、配列要素の先頭から順番に反復処理します。

{{book.console}}
```js
const array = [1, 2, 3];
array.forEach((currentValue, index, array) => {
    console.log(currentValue, index, array);
});
// コンソールの出力
// 1, 0, [1, 2, 3]
// 2, 1, [1, 2, 3]
// 3, 2, [1, 2, 3]
```

### `Array#map` {#array-map}

`Array#map`は配列の要素を順番にコールバック関数へ渡し、コールバック関数が返した値から新しい配列を返す非破壊的なメソッドです。
配列の各要素を加工したい場合に利用します。

次のようにコールバック関数には`要素, インデックス, 配列`が引数として渡され、配列要素の先頭から順番に反復処理します。
`map`メソッドの返り値は、それぞれのコールバック関数が返した値を集めた新しい配列です。

{{book.console}}
```js
const array = [1, 2, 3];
// 各要素に10を乗算した新しい配列を作成する
const newArray = array.map((currentValue, index, array) => {
    return currentValue * 10;
});
console.log(newArray); // => [10, 20, 30]
// 元の配列とは異なるインスタンス
console.log(array !== newArray); // => true
```

### `Array#filter` {#array-filter}

`Array#filter`は配列の要素を順番にコールバック関数へ渡し、コールバック関数が`true`を返した要素だけを集めた新しい配列を返す非破壊的なメソッドです。
配列から不要な要素を取り除いた配列を作成したい場合に利用します。

次のようにコールバック関数には`要素, インデックス, 配列`が引数として渡され、配列要素の先頭から順番に反復処理します。
`filter`メソッドの返り値は、コールバック関数が`true`を返した要素だけを集めた新しい配列です。

{{book.console}}
```js
const array = [1, 2, 3];
// 奇数の値を持つ要素だけを集めた配列を返す
const newArray = array.filter((currentValue, index, array) => {
    return currentValue % 2 === 1;
});
console.log(newArray); // => [1, 3]
// 元の配列とは異なるインスタンス
console.log(array !== newArray); // => true
```

### `Array#reduce` {#array-reduce}

`Array#reduce`は累積値（アキュムレータ）と配列の要素を順番にコールバック関数へ渡し、1つの累積値を返します。
配列から配列以外を含む任意の値を作成したい場合に利用します。

ここまでで紹介した反復処理のメソッドとは異なり、コールバック関数には`累積値, 要素, インデックス, 配列`を引数として渡します。
`reduce`メソッドの第二引数には`累積値`の初期値となる値を渡せます。

次のコードでは、`reduce`メソッドは初期値を0として配列の各要素を加算した1つの数値を返します。
つまり配列から配列要素の合計値というNumber型の値を返しています。

{{book.console}}
```js
const array = [1, 2, 3];
// すべての要素を加算した値を返す
// accumulatorの初期値は`0`
const totalValue = array.reduce((accumulator, currentValue, index, array) => {
    return accumulator + currentValue;
}, 0);
// 0 + 1 + 2 + 3という式の結果が返り値になる
console.log(totalValue); // => 6
```

`Array#reduce`メソッドはやや複雜ですが、配列以外の値も返せるという特徴があります。

## [コラム] Array-likeオブジェクト {#array-like}

配列のように扱えるが配列ではないオブジェクトのことを、**Array-likeオブジェクト**と呼びます。
Array-likeオブジェクトとは配列のようにインデックスにアクセスでき、配列のように`length`プロパティも持っています。しかし、配列のインスタンスではないため、Arrayメソッドは持っていないオブジェクトのことです。

| 機能                             | Array-likeオブジェクト | 配列    |
| ------------------------------ | ---------------- | ----- |
| インデックスアクセス（`array[0]`）         | できる              | できる   |
| 長さ（`array.length`）       | 持っている            | 持っている |
| Arrayメソッド(`Array#forEach`など) | 持っていない場合もある      | 持っている |

Array-likeオブジェクトの例として`arguments`があります。
`arguments`オブジェクトは、`function`で宣言した関数の中から参照できる変数です。
`arguments`オブジェクトには関数の引数に渡された値が順番に格納されていて、配列のように引数へアクセスできます。

{{book.console}}
```js
function myFunc() {
    console.log(arguments[0]); // => "a"
    console.log(arguments[1]); // => "b"
    console.log(arguments[2]); // => "c"
    // 配列ではないため、配列のメソッドは持っていない
    console.log(typeof arguments.forEach); // => "undefined"
}
myFunc("a", "b", "c");
```

Array-likeオブジェクトか配列なのかを判別するには`Array.isArray`メソッドを利用できます。
`Array-like`オブジェクトは配列ではないので結果は常に`false`となります。

{{book.console}}
```js
function myFunc() {
    console.log(Array.isArray([1, 2, 3])); // => true
    console.log(Array.isArray(arguments)); // => false
}
myFunc("a", "b", "c");
```

Array-likeオブジェクトは配列のようで配列ではないというもどかしさを持つオブジェクトです。`Array.from`メソッド<sup>[ES2015]</sup>を使うことでArray-likeオブジェクトを配列に変換して扱うことができます。一度配列に変換してしまえばArrayメソッドも利用できます。

{{book.console}}
```js
function myFunc() {
    // Array-likeオブジェクトを配列へ変換
    const argumentsArray = Array.from(arguments);
    console.log(Array.isArray(argumentsArray)); // => true
    // 配列のメソッドを利用できる
    argumentsArray.forEach(arg => {
        console.log(arg);
    });
}
myFunc("a", "b", "c");
```

## メソッドチェーンと高階関数 {#method-chain-and-high-order-function}

配列で頻出するパターンとしてメソッドチェーンがあります。
メソッドチェーンとは名前のとおり、メソッドを呼び出した返り値に対してメソッド呼び出しをするパターンのことを言います。

次のコードでは、`Array#concat`メソッドの返り値、つまり配列に対してさらに`concat`メソッドを呼び出すというメソッドチェーンが行われています。

{{book.console}}
```js
const array = ["a"].concat("b").concat("c");
console.log(array); // => ["a", "b", "c"]
```

このコードの`concat`メソッドの呼び出しを分解してみると何が行われているのかわかりやすいです。
`concat`メソッドの返り値は結合した新しい配列です。先ほどのメソッドチェーンでは、その新しい配列に対してさらに`concat`メソッドで値を結合しているということがわかります。

{{book.console}}
```js
// メソッドチェーンを分解した例
// 一時的な`abArray`という変数が増えている
const abArray = ["a"].concat("b");
console.log(abArray); // => ["a", "b"]
const abcArray = abArray.concat("c");
console.log(abcArray); // => ["a", "b", "c"]
```

メソッドチェーンを利用することで処理の見た目を簡潔にできます。メソッドチェーンを利用した場合も最終的な処理結果は同じですが、途中の一時的な変数を省略できます。先ほどの例では`abArray`という一時的な変数をメソッドチェーンでは省略できています。

メソッドチェーンは配列に限ったものではありませんが、配列では頻出するパターンです。なぜなら、配列に含まれるデータを表示する際には、最終的に文字列や数値など別のデータへ加工することがほとんどであるためです。配列には配列を返す高階関数が多く実装されているため、配列を柔軟に加工できます。

次のコードでは、ECMAScriptのバージョン名と発行年数が定義された`ECMAScriptVersions`という配列が定義されています。この配列から`2000`年以前に発行されたECMAScriptのバージョン名の一覧を取り出すことを考えてみます。目的の一覧を取り出すには「2000年以前のデータに絞り込む」と「データから`name`を取り出す」という2つの加工処理を組み合わせる必要があります。

この2つの加工処理は`Array#filter`メソッドと`Array#map`メソッドで実現できます。`filter`メソッドで配列から`2000`年以前というルールで絞り込み、`map`メソッドでそれぞれの要素から`name`プロパティを取り出せます。どちらのメソッドも配列を返すのでメソッドチェーンで処理をつなげられます。

{{book.console}}
```js
// ECMAScriptのバージョン名と発行年
const ECMAScriptVersions = [
    { name: "ECMAScript 1", year: 1997 },
    { name: "ECMAScript 2", year: 1998 },
    { name: "ECMAScript 3", year: 1999 },
    { name: "ECMAScript 5", year: 2009 },
    { name: "ECMAScript 5.1", year: 2011 },
    { name: "ECMAScript 2015", year: 2015 },
    { name: "ECMAScript 2016", year: 2016 },
    { name: "ECMAScript 2017", year: 2017 },
];
// メソッドチェーンで必要な加工処理を並べている
const versionNames = ECMAScriptVersions
    // 2000年以下のデータに絞り込み
    .filter(ECMAScript => ECMAScript.year <= 2000)
    // それぞれの要素から`name`プロパティを取り出す
    .map(ECMAScript => ECMAScript.name);
console.log(versionNames); // => ["ECMAScript 1", "ECMAScript 2", "ECMAScript 3"]
```

メソッドチェーンを使うことで複数の処理からなるものをひとつのまとった処理のように見せることができます。長過ぎるメソッドチェーンは長過ぎる関数と同じように読みにくくなりますが、適度な単位のメソッドチェーンは処理をスッキリ見せるパターンとして利用されています。

## まとめ {#conclusion}

この章では配列について学びました。

- 配列は順序を持った要素を格納できるオブジェクトの一種
- 配列には破壊的なメソッドと非破壊的なメソッドがある
- 配列には反復処理を行う高階関数となるメソッドがある
- メソッドチェーンは配列のメソッドが配列を返すことを利用している

配列はJavaScriptの中でもよく使われるオブジェクトで、メソッドの種類も多いです。
この書籍でもすべてのメソッドは紹介していないため、詳しくは[Arrayについてのドキュメント][]も参照してみてください。

[ループと反復処理]: ../loop/README.md
[immutable-array-prototype]: https://github.com/azu/immutable-array-prototype  "azu/immutable-array-prototype: A collection of Immutable Array prototype methods(Per method packages)."
[Lodash]: https://lodash.com/  "Lodash"
[Immutable.js]: https://facebook.github.io/immutable-js/  "Immutable.js"
[Arrayについてのドキュメント]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array
