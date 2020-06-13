---
author: azu
description: "JavaScriptにおける演算子についてを紹介します。演算子は記号で表現されるため、検索しにくいです。この章では主要な演算子をまとめて紹介しています。知らない演算子が出てきたときに読み直せばよいため、すべてを1つずつ読む必要はありません。"
---

# 演算子 {#operator}

演算子はよく利用する演算処理を記号などで表現したものです。
たとえば、足し算をする `+` も演算子の一種です。これ以外にも演算子には多くの種類があります。

演算子は演算する対象を持ちます。この演算子の対象のことを**被演算子（オペランド）**と呼びます。

次のコードでは、`+`演算子が値同士を足し算する加算演算を行っています。
このとき、`+`演算子の対象となっている`1`と`2`という2つの値がオペランドです。

{{book.console}}
```js
1 + 2;
```

このコードでは`+`演算子に対して、前後に合計2つのオペランドがあります。
このように、2つのオペランドを取る演算子を**二項演算子**と呼びます。

```
// 二項演算子とオペランドの関係
オペランド1 演算子 オペランド2
```

また、1つの演算子に対して1つのオペランドだけを取るものもあります。
たとえば、数値をインクリメントする`++`演算子は、次のように前後どちらか一方にオペランドを置きます。

```js
let num = 1;
num++;
// または
++num;
```

このように、1つのオペランドを取る演算子を**単項演算子**と呼びます。
単項演算子と二項演算子で同じ記号を使うことがあるため、呼び方を変えています。

この章では、演算子ごとにそれぞれの処理について学んでいきます。
また、演算子の中でも比較演算子は、JavaScriptでも特に挙動が理解しにくい**暗黙的な型変換**という問題と密接な関係があります。
そのため、演算子をひととおり見た後に、暗黙的な型変換と明示的な型変換について学んでいきます。

演算子の種類は多いため、すべての演算子の動作をここで覚える必要はありません。
必要となったタイミングで、改めてその演算子の動作を見るのがよいでしょう。

## 二項演算子 {#binary-operator}

四則演算など基本的な二項演算子を見ていきます。

### プラス演算子（`+`） {#plus-operator}

2つの数値を加算する演算子です。

{{book.console}}
```js
console.log(1 + 1); // => 2
```

JavaScriptでは、数値は内部的にIEEE 754方式の浮動小数点数として表現されています
（ [データ型とリテラル](../data-type/README.md)を参照）。
そのため、整数と浮動小数点数の加算もプラス演算子で行えます。

{{book.console}}
```js
console.log(10 + 0.5); // => 10.5
```

## 文字列結合演算子（`+`） {#string-combination-operator}

数値の加算に利用したプラス演算子（`+`）は、文字列の結合に利用できます。

文字列結合演算子（`+`）は、文字列を結合した文字列を返します。

{{book.console}}
```js
const value = "文字列" + "結合";
console.log(value); // => "文字列結合"
```

つまり、プラス演算子（`+`）は数値同士と文字列同士の演算を行います。

### マイナス演算子（`-`） {#minus-operator}

2つの数値を減算する演算子です。

{{book.console}}
```js
console.log(1 - 1); // => 0
console.log(10 - 0.5); // => 9.5
```


### 乗算演算子（`*`） {#multiplication-operator}

2つの数値を乗算する演算子です。

{{book.console}}
```js
console.log(2 * 8); // => 16
console.log(10 * 0.5); // => 5
```

### 除算演算子（`/`）{#division-operator}

2つの数値を除算する演算子です。

{{book.console}}
```js
console.log(8 / 2); // => 4
console.log(10 / 0.5); // => 20
```

### 剰余演算子（`%`） {#modulus-operator}

2つの数値のあまりを求める演算子です。

{{book.console}}
```js
console.log(8 % 2); // => 0
console.log(9 % 2); // => 1
console.log(10 % 0.5); // => 0
console.log(10 % 4.5); // => 1
```

### [ES2016] べき乗演算子（`**`） {#pow-operator}

2つの数値のべき乗を求める演算子です。
左オペランドを右オペランドでべき乗した値を返します。

{{book.console}}
```js
// べき乗演算子（ES2016）で2の4乗を計算
console.log(2 ** 4); // => 16
```

べき乗演算子と同じ動作をする`Math.pow`メソッドがあります。

{{book.console}}
```js
console.log(Math.pow(2, 4)); // => 16
```

べき乗演算子はES2016で後から追加された演算子であるため、関数と演算子がそれぞれ存在しています。
他の二項演算子は演算子が先に存在していたため、`Math`には対応するメソッドがありません。

## 単項演算子（算術） {#unary-operator}

単項演算子は、1つのオペランドを受け取り処理する演算子です。

### 単項プラス演算子（`+`） {#unary-plus-operator}

単項演算子の`+`はオペランドを数値に変換します。

次のコードでは、数値の`1`を数値へ変換するため、結果は変わらず数値の`1`です。
`+数値`のように数値に対して、単項プラス演算子をつけるケースはほぼ無いでしょう。

{{book.console}}
```js
console.log(+1); // => 1
```

また、単項プラス演算子は、数値以外も数値へと変換します。
次のコードでは、数字（文字列）を数値へ変換しています。

{{book.console}}
```js
console.log(+"1"); // => 1
```

一方、数値に変換できない文字列などは`NaN`という特殊な値へと変換されます。

{{book.console}}
```js
// 数値ではない文字列はNaNという値に変換される
console.log(+"文字列"); // => NaN
```

`NaN`は"Not-a-Number"の略称で、数値ではないがNumber型の値を表現しています。
`NaN`はどの値とも（NaN自身に対しても）一致しない特性があり、`Number.isNaN`メソッドを使うことで`NaN`の判定を行えます。

{{book.console}}
```js
// 自分自身とも一致しない
console.log(NaN === NaN); // => false
// Number型である
console.log(typeof NaN); // => "number"
// Number.isNaNでNaNかどうかを判定
console.log(Number.isNaN(NaN)); // => true
```

しかし、単項プラス演算子は文字列から数値への変換に使うべきではありません。
なぜなら、`Number`コンストラクタ関数や`parseInt`関数などの明示的な変換方法が存在するためです。
詳しくは「[暗黙的な型変換][]」の章で解説します。

### 単項マイナス演算子（`-`） {#unary-minus-operator}

単項マイナス演算子はマイナスの数値を記述する場合に利用します。

たとえば、マイナスの1という数値を `-1` と書くことができるのは、単項マイナス演算子を利用しているからです。

{{book.console}}
```js
console.log(-1); // => -1
```

また、単項マイナス演算子はマイナスの数値を反転できます。
そのため、"マイナスのマイナスの数値"はプラスの数値となります。

{{book.console}}
```js
console.log(-(-1)); // => 1
```

単項マイナス演算子も文字列などを数値へ変換します。

{{book.console}}
```js
console.log(-"1"); // => -1
```

また、数値へ変換できない文字列などをオペランドに指定した場合は、`NaN`という特殊な値になります。
そのため、単項プラス演算子と同じく、文字列から数値への変換に単項マイナス演算子を使うべきではありません。

{{book.console}}
```js
console.log(-"文字列"); // => NaN
```

### インクリメント演算子（`++`） {#increment-operator}

インクリメント演算子（`++`）は、オペランドの数値を`+1`する演算子です。
オペランドの前後どちらかにインクリメント演算子を置くことで、オペランドに対して値を`+1`した値を返します。

{{book.console}}
```js
let num = 1;
num++;
console.log(num); // => 2
// 次のようにした場合と結果は同じ
// num = num + 1;
```

インクリメント演算子（`++`）は、オペランドの後ろに置くか前に置くかで、それぞれで評価の順番が異なります。

後置インクリメント演算子（`num++`）は、次のような順で処理が行われます。

1. `num`の評価結果を返す
2. `num`に対して`+1`する

そのため、`num++`が返す値は`+1`する前の値となります。

{{book.console}}
```js
let x = 1;
console.log(x++); // => 1
console.log(x);   // => 2
```

一方、前置インクリメント演算子（`++num`）は、次のような順で処理が行われます。

1. `num`に対して`+1`する
2. `num`の評価結果を返す

そのため、`++num`が返す値は`+1`した後の値となります。

{{book.console}}
```js
let x = 1;
console.log(++x); // => 2
console.log(x);   // => 2
```

この2つの使い分けが必要となる場面は多くありません。
そのため、評価の順番が異なることだけを覚えておけば問題ないと言えます。

### デクリメント演算子（`--`） {#decrement-operator}

デクリメント演算子（`--`）は、オペランドの数値を`-1`する演算子です。

{{book.console}}
```js
let num = 1;
num--;
console.log(num); // => 0
// 次のようにした場合と結果は同じ
// num = num - 1;
```

デクリメント演算子は、インクリメント演算子と同様に、オペランドの前後のどちらかに置くことができます。
デクリメント演算子も、前後どちらに置くかで評価の順番が変わります。

{{book.console}}
```js
// 後置デクリメント演算子
let x = 1;
console.log(x--); // => 1
console.log(x);   // => 0
// 前置デクリメント演算子
let y = 1;
console.log(--y); // => 0
console.log(y);   // => 0
```

## 比較演算子 {#comparison-operator}

比較演算子はオペランド同士の値を比較し、真偽値を返す演算子です。

### 厳密等価演算子（`===`） {#strict-equal-operator}

厳密等価演算子は、左右の2つのオペランドを比較します。
同じ型で同じ値である場合に、`true`を返します。

{{book.console}}
```js
console.log(1 === 1); // => true
console.log(1 === "1"); // => false
```

また、オペランドがどちらもオブジェクトであるときは、
オブジェクトの参照が同じである場合に、`true`を返します。

次のコードでは、空のオブジェクトリテラル(`{}`)同士を比較しています。
オブジェクトリテラルは、新しいオブジェクトを作成します。
そのため、異なるオブジェクトを参照する変数を`===`で比較すると`false`を返します。

{{book.console}}
```js
// {} は新しいオブジェクトを作成している
const objA = {};
const objB = {};
// 生成されたオブジェクトは異なる参照となる
console.log(objA === objB); // => false
// 同じ参照を比較している場合
console.log(objA === objA); // => true
```

### 厳密不等価演算子（`!==`）{#strict-not-equal-operator}

厳密不等価演算子は、左右の2つのオペランドを比較します。
異なる型または異なる値である場合に、`true`を返します。

{{book.console}}
```js
console.log(1 !== 1); // => false
console.log(1 !== "1"); // => true
```

`===`を反転した結果を返す演算子となります。

### 等価演算子（`==`）{#equal-operator}

等価演算子（`==`）は、2つのオペランドを比較します。
同じデータ型のオペランドを比較する場合は、厳密等価演算子（`===`）と同じ結果になります。

{{book.console}}
```js
console.log(1 == 1); // => true
console.log("str" == "str"); // => true
console.log("JavaScript" == "ECMAScript"); // => false
// オブジェクトは参照が一致しているならtrueを返す
// {} は新しいオブジェクトを作成している
const objA = {};
const objB = {};
console.log(objA == objB); // => false
console.log(objA == objA); // => true
```

しかし、等価演算子（`==`）はオペランド同士が異なる型の値であった場合に、
同じ型となるように**暗黙的な型変換**をしてから比較します。

そのため、次のような、見た目からは結果を予測できない挙動が多く存在します。

{{book.console}}
```js
// 文字列を数値に変換してから比較
console.log(1 == "1"); // => true
// "01"を数値にすると`1`となる
console.log(1 == "01"); // => true
// 真偽値を数値に変換してから比較
console.log(0 == false); // => true
// nullの比較はfalseを返す
console.log(0 == null); // => false
// nullとundefinedの比較は常にtrueを返す
console.log(null == undefined); // => true
```

意図しない挙動となることがあるため、暗黙的な型変換が行われる等価演算子（`==`）を使うべきではありません。
代わりに、厳密等価演算子（`===`）を使い、異なる型を比較したい場合は明示的に型を合わせるべきです。

例外的に、等価演算子（`==`）が使われるケースとして、`null`と`undefined`の比較があります。

次のように、比較したいオペランドが `null` または `undefined` であることを判定したい場合に、
厳密等価演算子（`===`）では二度比較する必要があります。
等価演算子（`==`）では`null`と`undefined`の比較結果は`true`となるため、一度の比較でよくなります。

{{book.console}}
```js
const value = undefined; /* または null */
// === では2つの値と比較しないといけない
if (value === null || value === undefined) {
    console.log("valueがnullまたはundefinedである場合の処理");
}
// == では null と比較するだけでよい
if (value == null) {
    console.log("valueがnullまたはundefinedである場合の処理");
}
```

このように等価演算子（`==`）を使う例外的なケースはありますが、
等価演算子（`==`）は[暗黙的な型変換][]をするため、バグを引き起こしやすいです。
そのため、仕組みを理解するまでは常に厳密等価演算子（`===`）を利用することを推奨します。

### 不等価演算子（`!=`） {#not-equal-operator}

不等価演算子（`!=`）は、2つのオペランドを比較し、等しくないなら`true`を返します。

{{book.console}}
```js
console.log(1 != 1); // => false
console.log("str" != "str"); // => false
console.log("JavaScript" != "ECMAScript"); // => true
console.log(true != true);// => false
// オブジェクトは参照が一致していないならtrueを返す
const objA = {};
const objB = {};
console.log(objA != objB); // => true
console.log(objA != objA); // => false
```

不等価演算子も、等価演算子（`==`）と同様に異なる型のオペランドを比較する際に、暗黙的な型変換をしてから比較します。

{{book.console}}
```js
console.log(1 != "1"); // => false
console.log(0 != false); // => false
console.log(0 != null); // => true
console.log(null != undefined); // => false
```

そのため、不等価演算子（`!=`）は、利用するべきではありません。
代わりに暗黙的な型変換をしない厳密不等価演算子（`!==`）を利用します。

### 大なり演算子/より大きい（`>`） {#more-than}

大なり演算子は、左オペランドが右オペランドより大きいならば、`true`を返します。

{{book.console}}
```js
console.log(42 > 21); // => true
console.log(42 > 42); // => false
```

### 大なりイコール演算子/以上（`>=`）{#more-than-equal}

大なりイコール演算子は、左オペランドが右オペランドより大きいまたは等しいならば、`true`を返します。

{{book.console}}
```js
console.log(42 >= 21); // => true
console.log(42 >= 42); // => true
console.log(42 >= 43); // => false
```

### 小なり演算子/より小さい（`<`） {#less-than}

小なり演算子は、左オペランドが右オペランドより小さいならば、`true`を返します。

{{book.console}}
```js
console.log(21 < 42); // => true
console.log(42 < 42); // => false
```

### 小なりイコール演算子/以下（`<=`） {#less-than-equal}

小なりイコール演算子は、左オペランドが右オペランドより小さいまたは等しいならば、`true`を返します。

{{book.console}}
```js
console.log(21 <= 42); // => true
console.log(42 <= 42); // => true
console.log(43 <= 42); // => false
```

## ビット演算子 {#bit-operator}

ビット演算子はオペランドを符号付き32bit整数に変換してから演算します。
ビット演算子による演算結果は10進数の数値を返します。

たとえば、`9`という数値は符号付き32bit整数では次のように表現されます。

{{book.console}}
```js
console.log(0b0000000000000000000000000001001); // => 9
// Number#toStringメソッドを使うことで2進数表記の文字列を取得できる
console.log((9).toString(2)); // => "1001"
```

また、`-9`という数値は、ビッグエンディアンの2の補数形式で表現されるため、次のようになります。

{{book.console}}
```js
console.log(0b11111111111111111111111111110111); // => 4294967287
// ゼロ桁埋め右シフトをしてからNumber#toStringで2進数表記を取得できる
console.log((-9 >>> 0).toString(2)); // => "11111111111111111111111111110111"
```

### ビット論理積（`&`） {#bit-and}

論理積演算子（`&`）はビットごとの**AND**演算した結果を返します。

{{book.console}}
```js
console.log(15     & 9);      // => 9
console.log(0b1111 & 0b1001); // => 0b1001
```

### ビット論理和（`|`） {#bit-or}

論理和演算子（`|`）はビットごとの**OR**演算した結果を返します。

{{book.console}}
```js
console.log(15     | 9);      // => 15
console.log(0b1111 | 0b1001); // => 0b1111
```

### ビット排他的論理和（`^`） {#bit-xor}

排他的論理和演算子（`^`）はビットごとの**XOR**演算した結果を返します。

{{book.console}}
```js
console.log(15     ^ 9);      // => 6
console.log(0b1111 ^ 0b1001); // => 0b0110
```

### ビット否定（`~`） {#bit-not}

単項演算子の否定演算子（`~`）はオペランドを反転した値を返します。
これは1の補数として知られている値と同じものです。

{{book.console}}
```js
console.log(~15); // => -16
console.log(~0b1111); // => -0b10000
```

否定演算子（`~`）はビット演算以外でも使われていることがあります。

文字列（Stringオブジェクト）が持つ`indexOf`メソッドは、マッチする文字列を見つけて、そのインデックス（位置）を返すメソッドです。
この`indexOf`メソッドは、検索対象が見つからない場合には`-1`を返します。

{{book.console}}
```js
const str = "森森本森森";
// 見つかった場合はインデックスを返す
// JavaScriptのインデックスは0から開始するので2を返す
console.log(str.indexOf("本")); // => 2
// 見つからない場合は-1を返す
console.log(str.indexOf("火")); // => -1
```

否定演算子（`~`）は1の補数を返すため、`~(-1)`は`0`となります。

{{book.console}}
```js
console.log(~0); // => -1
console.log(~(-1)); // => 0
```

JavaScriptでは`0`も、if文では`false`として扱われます。
そのため、`~indexOfの結果`が`0`となるのは、その文字列が見つからなかった場合だけとなります。
次のコードのような否定演算子（`~`）と`indexOf`メソッドを使ったイディオムが一部では使われていました。

{{book.console}}
```js
const str = "森森木森森";
// indexOfメソッドは見つからなかった場合は -1 を返す
if (str.indexOf("木") !== -1) {
    console.log("木を見つけました");
}
// 否定演算子（`~`）で同じ動作を実装
// (~(-1)) は 0 となるため、見つからなかった場合はif文の中身は実行されない
if (~str.indexOf("木")) {
    console.log("木を見つけました");
}
```

ES2015では、文字列（Stringオブジェクト）に`includes`メソッドが実装されました。
`includes`メソッドは指定した文字列が含まれているかを真偽値で返します。

{{book.console}}
```js
const str = "森森木森森";
if (str.includes("木")) {
    console.log("木を見つけました");
}
```

そのため、否定演算子（`~`）と`indexOf`メソッドを使ったイディオムは、`includes`メソッドに置き換えられます。

<!-- textlint-disable eslint -->

### 左シフト演算子（`<<`） {#left-shift}

左シフト演算子は、数値である`num`を`bit`の数だけ左へシフトします。
左にあふれたビットは破棄され、`0`のビットを右から詰めます。

<!-- doctest:disable -->
```js
num << bit;
```

次のコードでは、`9`を2ビット分だけ左へシフトしています。

{{book.console}}
```js
console.log(     9 << 2); // => 36
console.log(0b1111 << 2); // => 0b111100
```

### 右シフト演算子（`>>`） {#right-shift}

右シフト演算子は、数値である`num`を`bit`の数だけ右へシフトします。
右にあふれたビットは破棄され、左端のビットのコピーを左から詰めます。

<!-- doctest:disable -->
```js
num >> bit;
```

次のコードでは、`-9`を2ビット分だけ右へシフトしています。
左端のビットのコピーを使うため、常に符号は維持されます。

{{book.console}}
```js
console.log((-9) >> 2); // => -3
// 0b11111111111111111111111111110111 >> 2; // => 0b11111111111111111111111111111101
```

### ゼロ埋め右シフト演算子（`>>>`） {#fill-zero-right-shift}

ゼロ埋め右シフト演算子は、数値である`num`を`bit`の数だけ右へシフトするのは右シフト演算子（`>>`）と同じです。異なる点としては右にあふれたビットは破棄され、`0`のビットを左から詰めます。

次のコードでは、`-9`を2ビット分だけゼロ埋め右シフトしています。
左端のビットは`0`となるため、常に正の値となります。

{{book.console}}
```js
console.log((-9) >>> 2); // => 1073741821
// 0b11111111111111111111111111110111 >>> 2; // => 0b00111111111111111111111111111101
```

<!-- textlint-enable eslint -->

## 代入演算子（`=`） {#assignment-operator}

代入演算子（`=`）は変数に対して値を代入します。
代入演算子については「[変数と宣言](../variables/README.md)」の章も参照してください。

{{book.console}}
```js
let x = 1;
x = 42;
console.log(x); // => 42
```

また、代入演算子は二項演算子と組み合わせて利用できます。
`+=`、`-=`、`*=`、`/=`、`%=`、`<<=`、`>>=`、`>>>=`、`&=`、`^=`、`|=`のように、演算した結果を代入できます。

```js
let num = 1;
num += 10; // num = num + 10; と同じ
console.log(num); // => 11
```

### [ES2015] 分割代入（Destructuring assignment） {#destructuring-assignment}

今まで見てきた代入演算子は1つの変数に値を代入するものでした。
分割代入を使うことで、配列やオブジェクトの値を複数の変数へ同時に代入できます。
分割代入は短縮記法のひとつでES2015から導入された構文です。

分割代入は、代入演算子（`=`）を使うのは同じですが、左辺のオペランドが配列リテラルやオブジェクトリテラルとなります。

次のコードでは、右辺の配列の値を、左辺の配列リテラルの対応するインデックスに書かれた変数名へ代入します。

{{book.console}}
```js
const array = [1, 2];
// aには`array`の0番目の値、bには1番目の値が代入される
const [a, b] = array;
console.log(a); // => 1
console.log(b); // => 2
```

これは、次のように書いたのと同じ結果になります。

```js
const array = [1, 2];
const a = array[0];
const b = array[1];
```

同様にオブジェクトも分割代入に対応しています。
オブジェクトの場合は、右辺のオブジェクトのプロパティ値を、左辺に対応するプロパティ名へ代入します。

{{book.console}}
```js
const obj = {
    "key": "value"
};
// プロパティ名`key`の値を、変数`key`として定義する
const { key } = obj;
console.log(key); // => "value"
```

これは、次のように書いたのと同じ結果になります。

```js
const obj = {
    "key": "value"
};
const key = obj.key;
```

## 条件（三項）演算子（`?`と`:`） {#ternary-operator}

条件演算子（`?`と`:`）は三項をとる演算子であるため、三項演算子とも呼ばれます。

条件演算子は`条件式`を評価した結果が`true`ならば、`Trueのとき処理する式`の評価結果を返します。
`条件式`が`false`である場合は、`Falseのとき処理する式`の評価結果を返します。

<!-- doctest:disable -->
```js
条件式 ? Trueのとき処理する式 : Falseのとき処理する式;
```

if文との違いは、条件演算子は式として書くことができるため値を返します。
次のように、`条件式`の評価結果により`"A"` または `"B"` どちらかを返します。

{{book.console}}
```js
const valueA = true ? "A" : "B";
console.log(valueA); // => "A"
const valueB = false ? "A" : "B";
console.log(valueB); // => "B"
```

条件分岐による値を返せるため、条件によって変数の初期値が違う場合などに使われます。

次の例では、`text`文字列に`prefix`となる文字列を先頭につける関数を書いています。
`prefix`の第二引数を省略したり文字列ではないものが指定された場合に、デフォルトの`prefix`を使います。
第二引数が省略された場合には、`prefix`に`undefined`が入ります。

条件演算子の評価結果は値を返すので、`const`を使って宣言と同時に代入できます。

{{book.console}}
```js
function addPrefix(text, prefix) {
    // `prefix`が指定されていない場合は"デフォルト:"を付ける
    const pre = typeof prefix === "string" ? prefix : "デフォルト:";
    return pre + text;
}

console.log(addPrefix("文字列")); // => "デフォルト:文字列"
console.log(addPrefix("文字列", "カスタム")); // => "カスタム文字列"
```

if文を使った場合は、宣言と代入を分ける必要があるため、`const`を使うことができません。

{{book.console}}
```js
function addPrefix(text, prefix) {
    let pre = "デフォルト:";
    if (typeof prefix === "string") {
        pre = prefix;
    }
    return pre + text;
}

console.log(addPrefix("文字列")); // => "デフォルト:文字列"
console.log(addPrefix("文字列", "カスタム")); // => "カスタム文字列"
```

## 論理演算子 {#logical-operator}

論理演算子は基本的に真偽値を扱う演算子で、AND、OR、NOTを表現できます。

### AND演算子（`&&`） {#and-operator}

AND演算子（`&&`）は、左辺の値の評価結果が`true`であるならば、右辺の評価結果を返します。
左辺の評価が`true`ではない場合、右辺は評価されません。

このような値が決まった時点でそれ以上評価しないことを**短絡評価**（ショートサーキット）と呼びます。

{{book.console}}
```js
const x = true;
const y = false;
// x -> y の順に評価される
console.log(x && y); // => false
// 左辺がfalseであるなら、その時点でfalseを返す
// xは評価されない
console.log(y && x); // => false
```

AND演算子は、if文と組み合わせて利用することが多い演算子です。
次のように、`value`がString型で **かつ** 値が`"str"`である場合という条件をひとつの式として書くことができます。

{{book.console}}
```js
const value = "str";
if (typeof value === "string" && value === "str") {
    console.log(`${value} is string value`);
}
// if文のネストで書いた場合と結果は同じとなる
if (typeof value === "string") {
    if (value === "str") {
        console.log(`${value} is string value`);
    }
}
```

このときに、`value`がString型でない場合は、その時点で`false`となります。

短絡評価はif文のネストに比べて短く書くことができます。

しかし、if文が3重4重にネストしているのは不自然なのと同様に、
AND演算子やOR演算子が3つ4つ連続する場合は複雑で読みにくいコードです。
その場合は抽象化ができないかを検討するべきサインとなります。

### OR演算子（`||`） {#or-operator}

OR演算子（`||`）は、左辺の値の評価結果が`false`であるならば、右辺の評価結果を返します。
AND演算子（`&&`）とは逆に、左辺が`true`である場合は、右辺を評価せず`true`を返します。

{{book.console}}
```js
const x = true;
const y = false;
// xがtrueなのでyは評価されない
console.log(x || y); // => true
// yはfalseなのでxを評価した結果を返す
console.log(y || x); // => true
```

OR演算子は、if文と組み合わせて利用することが多い演算子です。
次のように、`value`が`0`または`1`の場合にif文の中身が実行されます。

{{book.console}}
```js
const value = 1;
if (value === 0 || value === 1) {
    console.log("valueは0または1です。");
}
```

### NOT演算子（`!`） {#not-operator}

NOT演算子（`!`）は、`オペランド`の評価結果が`true`であるならば、`false`を返します。

{{book.console}}
```js
console.log(!false); // => true
console.log(!true);  // => false
```

NOT演算子は必ず真偽値を返すため、次のように2つNOT演算子を重ねて真偽値へ変換するという使い方も見かけます。

{{book.console}}
```js
const str = "";
// 空文字列はfalseへと変換される
console.log(!!str); // => false
```

このようなケースの多くは、比較演算子を使うなどより明示的な方法で、真偽値を得ることができます。
安易に`!!`による変換に頼るよりは別の方法を探してみるのがいいでしょう。

{{book.console}}
```js
const str = "";
// 空文字列でないことを判定
console.log(str.length > 0); // => false
```

### グループ化演算子（`(`と`)`） {#group-operator}

グループ化演算子は複数の二項演算子が組み合わさった場合に、演算子の優先順位を明示できる演算子です。

たとえば、次のようにグループ化演算子で囲んだ部分が最初に処理されるため、結果も変化します。

{{book.console}}
```js
const a = 1;
const b = 2;
const c = 3;
console.log(a + b * c); // 7
console.log((a + b) * c); // => 9
```

[演算子の優先順位][]はECMAScript仕様で定義されていますが、演算子の優先度をすべて覚えるのは難しいです。
演算子の優先順位の中でグループ化演算子は優先される演算子となり、グループ化演算子を使って優先順位を明示できます。

次のようなグループ化演算子を使わずに書いたコードを見てみましょう。
`x`が`true`または、`y`かつ`z`が`true`であるときに処理されます。

<!-- doctest:disable -->
```js
if (x || y && z) {
    // x が true または
    // y かつ z が true
}
```

ひとつの式に複数の種類の演算子が出てくると読みにくくなる傾向があります。
このような場合にはグループ化演算子を使い、結合順を明示して書くようにしましょう。

<!-- doctest:disable -->
```js
if (x || (y && z)) {
    // x が true または
    // y かつ z が true
}
```

しかし、ひとつの式で多数の演算を行うよりも、式自体を分けたほうが読みやすい場合もあります。

次のように`a`と`b`が文字列型 または `x`と`y`が数値型の場合に処理するif文を考えてみます。
グループ化演算子を使い、そのまま1つの条件式で書くことも可能ですが、読みにくくなってしまいます。

<!-- doctest:disable -->
```js
if ((typeof a === "string" && typeof b === "string") || (typeof x === "number" && typeof y === "number")) {
    // `a`と`b`が文字列型 または
    // `x`と`y`が数値型
}
```

このように無理して1つの式（1行）で書くよりも、条件式を分解してそれぞれの結果を変数として定義したほうが読みやすくなる場合もあります。

<!-- doctest:disable -->
```js
const isAbString = typeof a === "string" && typeof b === "string";
const isXyNumber = typeof x === "number" && typeof y === "number";
if (isAbString || isXyNumber) {
    // `a`と`b`が文字列型 または
    // `x`と`y`が数値型
}
```

そのため、グループ化演算子ですべての条件をまとめるのではなく、
それぞれの条件を分解して名前をつける（変数として定義する）ことも重要です。

## カンマ演算子（`,`） {#comma-operator}

カンマ演算子（`,`）は、カンマ（`,`）で区切った式を左から順に評価し、
最後の式の評価結果を返します。

次の例では、`式1`、`式2`、`式3`の順に評価され、`式3`の評価結果を返します。

```
式1, 式2, 式3;
```

これまでに、カンマで区切るという表現は、`const`による変数宣言などでも出てきました。
左から順に実行する点ではカンマ演算子の挙動は同じものですが、構文としては似て非なるものです。

{{book.console}}
```js
const a = 1, b = 2, c = a + b;
console.log(c); // => 3
```

一般にカンマ演算子を利用する機会はほとんどないため、「カンマで区切った式は左から順に評価される」ということだけを知っていれば問題ありません。[^1]

## まとめ {#conclusion}

この章では演算子について学びました。

- 演算子はよく利用する演算処理を記号などで表現したもの
- 四則演算から論理演算などさまざまな種類の演算子がある
- 演算子には優先順位が定義されており、グループ化演算子で明示できる

[暗黙的な型変換]: ../implicit-coercion/README "暗黙的な型変換について解説する章"
[演算子の優先順位]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table "演算子の優先順位 - JavaScript | MDN"
[^1]: カンマ演算子を活用したテクニックとしてindirect callというものがあります。<https://2ality.com/2014/01/eval.html>
