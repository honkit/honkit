---
author: azu
description: "JavaScriptにはプロトタイプオブジェクトという特殊なオブジェクトがあります。プロトタイプオブジェクトによってメソッドなどの特性をあるオブジェクトから別のオブジェクトへと継承しています。このプロトタイプオブジェクトによる継承の動きを紹介します。"
---

# プロトタイプオブジェクト {#prototype-object}

「[オブジェクト]」の章では、オブジェクトの処理方法について見てきました。
その中で、空のオブジェクトであっても`toString`メソッドなどを呼び出せていました。

{{book.console}}
```js
const obj = {};
console.log(obj.toString()); // "[object Object]"
```

オブジェクトリテラルで空のオブジェクトを定義しただけなのに、`toString`メソッドを呼び出せています。
このメソッドはどこに実装されているのでしょうか？

また、JavaScriptには`toString`以外にも、オブジェクトに自動的に実装されるメソッドがあります。
これらのオブジェクトに組み込まれたメソッドをビルトインメソッドと呼びます。

この章では、これらのビルトインメソッドがどこに実装され、なぜ`Object`のインスタンスから呼び出せるのかを確認していきます。
詳しい仕組みについては「[クラス][]」の章で改めて解説するため、この章では大まかな動作の流れを理解することが目的です。

## `Object`はすべての元 {#object-is-origin}

`Object`には、他の`Array`、`String`、`Function`などのオブジェクトとは異なる特徴があります。
それは、他のオブジェクトはすべて`Object`を継承しているという点です。

正確には、ほとんどすべてのオブジェクトは`Object.prototype`プロパティに定義された`prototype`オブジェクトを継承しています。
`prototype`オブジェクトとは、すべてのオブジェクトの作成時に自動的に追加される特殊なオブジェクトです。
`Object`の`prototype`オブジェクトは、すべてのオブジェクトから利用できるメソッドなどを提供するベースオブジェクトとも言えます。

![すべてのオブジェクトは`Object`の`prototype`を継承している](./img/object-prototype.png)

具体的にどういうことかを見てみます。

先ほども登場した`toString`メソッドは、`Object`の`prototype`オブジェクトに定義があります。
次のように、`Object.prototype.toString`メソッドの実装自体も参照できます。

{{book.console}}
```js
// `Object.prototype`オブジェクトに`toString`メソッドの定義がある
console.log(typeof Object.prototype.toString); // => "function"
```

このような`prototype`オブジェクトに組み込まれているメソッドは**プロトタイプメソッド**と呼ばれます。
この書籍では`Object.prototype.toString`のようなプロトタイプメソッドを`Object#toString`と短縮して表記します。

> `Object.prototype.toString` = `Object#toString`

`Object`のインスタンスは、この`Object.prototype`オブジェクトに定義されたメソッドやプロパティをインスタンス化したときに継承します。
つまり、オブジェクトリテラルや`new Object`でインスタンス化したオブジェクトは、`Object.prototype`に定義されたものが利用できるということです。

次のコードでは、オブジェクトリテラルで作成（インスタンス化）したオブジェクトから、`Object#toString`メソッドを参照しています。
このときに、インスタンスの`toString`メソッドと`Object#toString`は同じものとなることがわかります。

{{book.console}}
```js
const obj = {
    "key": "value"
};
// `obj`インスタンスは`Object.prototype`に定義されたものを継承する
// `obj.toString`は継承した`Object.prototype.toString`を参照している
console.log(obj.toString === Object.prototype.toString); // => true
// インスタンスからプロトタイプメソッドを呼び出せる
console.log(obj.toString()); // => "[object Object]"
```

このように`Object.prototype`に定義されている`toString`メソッドなどは、インスタンス作成時に自動的に継承されるため、`Object`のインスタンスから呼び出せます。
これによりオブジェクトリテラルで作成した空のオブジェクトでも、`Object#toString`メソッドなどを呼び出せるようになっています。

このインスタンスから`prototype`オブジェクト上に定義されたメソッドを参照できる仕組みを**プロトタイプチェーン**と呼びます。
プロトタイプチェーンの仕組みについては「[クラス][]」の章で扱うため、ここではインスタンスからプロトタイプメソッドを呼び出せるということがわかっていれば問題ありません。

### プロトタイプメソッドとインスタンスメソッドの優先順位 {#same-method-name-order}

プロトタイプメソッドと同じ名前のメソッドがインスタンスオブジェクトに定義されている場合もあります。
その場合には、インスタンスに定義したメソッドが優先して呼び出されます。

次のコードでは、`Object`のインスタンスである`customObject`に`toString`メソッドを定義しています。
実行してみると、プロトタイプメソッドよりも優先してインスタンスのメソッドが呼び出されていることがわかります。

{{book.console}}
```js
// オブジェクトのインスタンスにtoStringメソッドを定義
const customObject = {
    toString() {
        return "custom value";
    }
};
console.log(customObject.toString()); // => "custom value"
```

このように、インスタンスとプロトタイプオブジェクトで同じ名前のメソッドがある場合には、インスタンスのメソッドが優先されます。

### `in`演算子と`Object#hasOwnProperty`メソッドの違い {#diff-in-operator-and-hasOwnProperty}

「[オブジェクト][]」の章で学んだ`Object#hasOwnProperty`メソッドと`in`演算子の挙動の違いについて見ていきます。
2つの挙動の違いはこの章で紹介したプロトタイプオブジェクトに関係しています。

`hasOwnProperty`メソッドは、そのオブジェクト自身が指定したプロパティを持っているかを判定します。
一方、`in`演算子はオブジェクト自身が持っていなければ、そのオブジェクトの継承元である`prototype`オブジェクトまで探索して持っているかを判定します。
つまり、`in`演算子はインスタンスに実装されたメソッドなのか、プロトタイプオブジェクトに実装されたメソッドなのかを区別しません。

次のコードでは、空のオブジェクトが`toString`メソッドを持っているかを`Object#hasOwnProperty`メソッドと`in`演算子でそれぞれ判定しています。
`hasOwnProperty`メソッドは`false`を返し、`in`演算子は`toString`メソッドがプロトタイプオブジェクトに存在するため`true`を返します。

{{book.console}}
```js
const obj = {};
// `obj`というオブジェクト自体に`toString`メソッドが定義されているわけではない
console.log(obj.hasOwnProperty("toString")); // => false
// `in`演算子は指定されたプロパティ名が見つかるまで親をたどるため、`Object.prototype`まで見にいく
console.log("toString" in obj); // => true
```

次のように、インスタンスが`toString`メソッドを持っている場合は、`hasOwnProperty`メソッドも`true`を返します。

{{book.console}}
```js
// オブジェクトのインスタンスにtoStringメソッドを定義
const obj = {
    toString() {
        return "custom value";
    }
};
// オブジェクトのインスタンスが`toString`メソッドを持っている
console.log(obj.hasOwnProperty("toString")); // => true
console.log("toString" in obj); // => true
```

### オブジェクトの継承元を明示する`Object.create`メソッド {#create-method}

`Object.create`メソッドを使うと、第一引数に指定した`prototype`オブジェクトを継承した新しいオブジェクトを作成できます。

これまでの説明で、オブジェクトリテラルは`Object.prototype`オブジェクトを自動的に継承したオブジェクトを作成していることがわかりました。
オブジェクトリテラルで作成する新しいオブジェクトは、`Object.create`メソッドを使うことで次のように書けます。

{{book.console}}
```js
// const obj = {} と同じ意味
const obj = Object.create(Object.prototype);
// `obj`は`Object.prototype`を継承している
console.log(obj.hasOwnProperty === Object.prototype.hasOwnProperty); // => true
```

### ArrayもObjectを継承している {#inherit-object}

`Object`と`Object.prototype`の関係と同じように、ビルトインオブジェクト`Array`も`Array.prototype`を持っています。
同じように、配列（`Array`）のインスタンスは`Array.prototype`を継承します。
さらに、`Array.prototype`は`Object.prototype`を継承しているため、`Array`のインスタンスは`Object.prototype`も継承しています。

> `Array`のインスタンス -> `Array.prototype` -> `Object.prototype`

`Object.create`メソッドを使って`Array`と`Object`の関係をコードとして表現してみます。
この疑似コードは、`Array`コンストラクタの実装など、実際のものとは異なる部分があるため、あくまでイメージであることに注意してください。

```js
// このコードはイメージです！
// `Array`コンストラクタ自身は関数でもある
const Array = function() {};
// `Array.prototype`は`Object.prototype`を継承している
Array.prototype = Object.create(Object.prototype);
// `Array`のインスタンスは、`Array.prototype`を継承している
const array = Object.create(Array.prototype);
// `array`は`Object.prototype`を継承している
console.log(array.hasOwnProperty === Object.prototype.hasOwnProperty); // => true
```

このように、`Array`のインスタンスも`Object.prototype`を継承しているため、
`Object.prototype`に定義されているメソッドを利用できます。

次のコードでは、`Array`のインスタンスから`Object#hasOwnProperty`メソッドが参照できていることがわかります。

{{book.console}}
```js
const array = [];
// `Array`のインスタンス -> `Array.prototype` -> `Object.prototype`
console.log(array.hasOwnProperty === Object.prototype.hasOwnProperty); // => true
```

このような`hasOwnProperty`メソッドの参照が可能なのもプロトタイプチェーンという仕組みによるものです。

ここでは、`Object.prototype`はすべてのオブジェクトの親となるオブジェクトであることを覚えておくだけで問題ありません。
これにより、`Array`や`String`などのインスタンスも`Object.prototype`が持つメソッドを利用できる点を覚えておきましょう。

また、`Array.prototype`などもそれぞれ独自のメソッドを定義しています。
たとえば、`Array#toString`メソッドもそのひとつです。
そのため、配列のインスタンスで`toString`メソッドを呼び出すと`Array#toString`が優先して呼び出されます。

{{book.console}}
```js
const numbers = [1, 2, 3];
// `Array#toString`が定義されているため、`Object#toString`とは異なる形式となる
console.log(numbers.toString()); // => "1,2,3"
```

## [コラム] `Object.prototype`を継承しないオブジェクト {#not-inherit-object}

`Object`はすべてのオブジェクトの親になるオブジェクトであると言いましたが、例外もあります。

イディオム（慣習的な書き方）ですが、`Object.create(null)`とすることで`Object.prototype`を継承しないオブジェクトを作成できます。
これにより、プロパティやメソッドをまったく持たない本当に**空のオブジェクト**を作れます。

{{book.console}}
```js
// 親がnull、つまり親がいないオブジェクトを作る
const obj = Object.create(null);
// Object.prototypeを継承しないため、hasOwnPropertyが存在しない
console.log(obj.hasOwnProperty); // => undefined
```

`Object.create`メソッドはES5から導入されました。
`Object.create`メソッドは`Object.create(null)`というイディオムで、一部ライブラリなどで`Map`オブジェクトの代わりとして利用されていました。
Mapとはキーと値の組み合わせを保持するためのオブジェクトです。

ただのオブジェクトもMapとよく似た性質を持っていますが、最初からいくつかのプロパティが存在しアクセスできてしまいます。
なぜなら、`Object`のインスタンスはデフォルトで`Object.prototype`を継承するため、`toString`などのプロパティ名がオブジェクトを作成した時点で存在するためです。そのため、`Object.create(null)`で`Object.prototype`を継承しないオブジェクトを作成し、そのオブジェクトが`Map`の代わりとして使われていました。

{{book.console}}
```js
// 空オブジェクトを作成
const obj = {};
// "toString"という値を定義してないのに、"toString"が存在している
console.log(obj["toString"]);// Function 
// Mapのような空オブジェクト
const mapLike = Object.create(null);
// toStringキーは存在しない
console.log(mapLike["toString"]); // => undefined
```

しかし、ES2015からは、本物の`Map`が利用できるため、`Object.create(null)`を`Map`の代わりに利用する必要はありません。
`Map`については「[Map/Set][]」の章で詳しく紹介します。

{{book.console}}
```js
const map = new Map();
// toStringキーは存在しない
console.log(map.has("toString")); // => false
```

## まとめ {#conclusion}

この章では、プロトタイプオブジェクトについて学びました。

- プロトタイプオブジェクトはオブジェクトの作成時に自動的に作成される
- `Object`のプロトタイプオブジェクトには`toString`などのプロトタイプメソッドが定義されている
- ほとんどのオブジェクトは`Object.prototype`を継承することで`toString`メソッドなどを呼び出せる
- プロトタイプメソッドとインスタンスメソッドではインスタンスメソッドが優先される
- `Object.create`メソッドを使うことでプロトタイプオブジェクトを継承しないオブジェクトを作成できる

プロトタイプオブジェクトに定義されているメソッドがどのように参照されているかを確認しました。
このプロトタイプの詳しい仕組みについては「[クラス][]」の章で改めて解説します。

[クラス]: ../class/README.md
[オブジェクト]: ../object/README.md
[Map/Set]: ../map-and-set/README.md
