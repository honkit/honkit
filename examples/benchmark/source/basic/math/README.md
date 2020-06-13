---
author: laco
description: "数学的な定数や関数を提供するビルトインオブジェクトのMathを紹介します。"
---

# Math {#math}

この章では、JavaScriptで数学的な定数と関数を提供するビルトインオブジェクトである[Math][]について学びます。

## Mathオブジェクト {#math-object}

`Math`オブジェクトはビルトインオブジェクトですが、コンストラクタではありません。
つまり`Math`オブジェクトはインスタンスを作らず、
すべての定数や関数は`Math`オブジェクトの静的なプロパティやメソッドとして提供されています。
たとえば、`Math.PI`プロパティは円周率πを表す定数であり、`Math.sin`メソッドはラジアン値から正弦を計算する関数です。
次の例では、90度における正弦を計算しています。90度の正弦は1なので、`sin90`変数は1を返します。

{{book.console}}
```js
const rad90 = Math.PI * 90 / 180;
const sin90 = Math.sin(rad90);
console.log(sin90); // => 1
```

三角関数をはじめとした多くの関数や定数が`Math`オブジェクトから提供されています。
この章ではそれらのうちよく使われるものについてユースケースを交えて紹介します。
網羅的な解説については[MDNのリファレンス][]を参照してください。

### 乱数を生成する {#create-random-number}

`Math`オブジェクトの主な用途のひとつは、[Math.random][]メソッドによる乱数の生成です。
`Math.random`メソッドは、0以上1未満の範囲内で、疑似ランダムな浮動小数点数を返します。

{{book.console}}
```js
for (let i = 0; i < 5; i++) {
    // 毎回ランダムな浮動小数点数を返す
    console.log(Math.random());
}
```

次の例では、`Math.random`メソッドを使って、任意の範囲で乱数を生成しています。

{{book.console}}
```js
// minからmaxまでの乱数を返す関数
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
// 1以上5未満の浮動小数点数を返す
console.log(getRandom(1, 5));
```

### 数値の大小を比較する {#compare-number}

[Math.max][]メソッドは引数として渡された複数の数値のうち、最大のものを返します。
同様に、[Math.min][]メソッドは引数として渡された複数の数値のうち、最小のものを返します。

{{book.console}}
```js
console.log(Math.max(1, 10)); // => 10
console.log(Math.min(1, 10)); // => 1
```

これらのメソッドは可変長の引数を取るため、任意の個数の数値を比較できます。
数値の配列の中から最大・最小の値を取り出す際には、`...`（spread構文）を使うと簡潔に記述できます。

{{book.console}}
```js
const numbers = [1, 2, 3, 4, 5];
console.log(Math.max(...numbers)); // => 5
console.log(Math.min(...numbers)); // => 1
```

### 数値を整数にする {#convert-to-integer}

`Math`オブジェクトには数値を整数に丸めるためのメソッドがいくつかあります。
代表的なものは、小数点以下を切り捨てる`Math.floor`メソッド、小数点以下を切り上げる`Math.ceil`メソッド、そして四捨五入を行う`Math.round`メソッドです。

[Math.floor][]メソッドは、引数として渡した数以下で最大の整数を返します。このような関数は**底関数**と呼ばれます。
正の数である`1.3`は`1`になりますが、負の数である`-1.3`はより小さい整数の`-2`に丸められます。

次の[Math.ceil][]メソッドは、引数として渡した数以上で最小の整数を返します。このような関数は**天井関数**と呼ばれます。
正の数である`1.3`は`2`になりますが、負の数である`-1.3`はより大きい整数の`-1`に丸められます。

[Math.round][]メソッドは、一般的な四捨五入の処理を行います。
小数部分が`0.5`よりも小さな場合は切り捨てられ、それ以外は切り上げられます。

{{book.console}}
```js
// 底関数
console.log(Math.floor(1.3)); // => 1
console.log(Math.floor(-1.3)); // => -2
// 天井関数
console.log(Math.ceil(1.3)); // => 2
console.log(Math.ceil(-1.3)); // => -1
// 四捨五入
console.log(Math.round(1.3)); // => 1
console.log(Math.round(1.6)); // => 2
console.log(Math.round(-1.3)); // => -1
```

また、[Math.trunc][]メソッド<sup>[ES2015]</sup>は、渡された数字の小数点以下を単純に切り落とした整数を返します。
そのため、引数が正の値の場合は`Math.floor`メソッドと同じになり、そうでない場合は`Math.ceil`メソッドと同じになります。

{{book.console}}
```js
// 単純に小数部分を切り落とす
console.log(Math.trunc(1.3)); // => 1
console.log(Math.trunc(-1.3)); // => -1
```

## まとめ {#conclusion}

この章では、`Math`オブジェクトについて学びました。
紹介したメソッドは`Math`オブジェクトの一部にすぎないため、そのほかにもメソッドが用意されています。

- `Math`は数学的な定数や関数を提供するビルトインオブジェクト
- `Math`はコンストラクタではないためインスタンス化できない
- 疑似乱数の生成、数値の比較、数値の計算などを行うメソッドが提供されている


[Math]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math
[MDNのリファレンス]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math
[Math.random]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
[Math.max]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/max
[Math.min]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/min
[Math.floor]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
[Math.ceil]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil
[Math.round]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/round
[Math.trunc]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
