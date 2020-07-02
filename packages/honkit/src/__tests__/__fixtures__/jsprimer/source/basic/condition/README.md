---
author: azu
description: "JavaScriptで条件分岐を扱うためのif文やswitch文を紹介します。またネストした条件分岐が読みやすさを妨げる問題をどのように解決するについてを紹介します。"
---

# 条件分岐 {#conditional-branch}

この章ではif文やswitch文を使った条件分岐について学んでいきます。
条件分岐を使うことで、特定の条件を満たすかどうかで行う処理を変更できます。

## if文 {#if-statement}

if文を使うことで、プログラム内に条件分岐を書けます。

if文は次のような構文が基本形となります。
`条件式`の評価結果が`true`であるならば、`実行する文`が実行されます。

<!-- doctest:ReferenceError -->
```js
if (条件式) {
    実行する文;
}
```

次のコードでは`条件式`が`true`であるため、ifの中身が実行されます。

{{book.console}}
```js
if (true) {
    console.log("この行は実行されます");
}
```

`実行する文`が1行のみの場合は、`{` と `}` のブロックを省略できます。
しかし、どこまでがif文かがわかりにくくなるため、常にブロックで囲むことを推奨します。

{{book.console}}
```js
if (true)
    console.log("この行は実行されます");
```

if文は`条件式`に比較演算子などを使い、その比較結果によって処理を分岐するためによく使われます。
次のコードでは、`x`が`10`よりも大きな値である場合に、if文の中身が実行されます。

{{book.console}}
```js
const x = 42;
if (x > 10) {
    console.log("xは10より大きな値です");
}
```

if文の`条件式`には`true`または`false`といった真偽値以外の値も指定できます。
真偽値以外の値の場合、その値を暗黙的に真偽値へ変換してから、条件式として判定します。

真偽値へ変換すると`true`となる値の種類は多いため、逆に変換した結果が`false`となる値を覚えるのが簡単です。
次の値は真偽値へと変換すると`false`となるため、これらの値は**falsy**と呼ばれます（「[暗黙的な型変換][]」の章を参照）。

- `false`
- `undefined`
- `null`
- `0`
- `NaN`
- `""`（空文字列）

これ以外の値は真偽値に変換すると`true`になります。
そのため、`"文字列"`や0以外の数値などを`条件式`に指定した場合は、`true`へと変換してから条件式として判定します。

次のコードは、条件式が`true`へと変換されるため、if文の中身が実行されます。

{{book.console}}
```js
if (true) {
    console.log("この行は実行されます"); 
}
if ("文字列") {
    console.log("この行は実行されます");
}
if (42) {
    console.log("この行は実行されます");
}
if (["配列"]) {
    console.log("この行は実行されます");
}
if ({ name: "オブジェクト" }) {
    console.log("この行は実行されます");
}
```

falsyな値を`条件式`に指定した場合は、`false`へと変換されます。
次のコードは、条件式が`false`へと変換されるため、if文の中身は実行されません。

{{book.console}}
```js
if (false) {
    // この行は実行されません
}
if ("") {
    // この行は実行されません
}
if (0) {
    // この行は実行されません
}
if (undefined) {
    // この行は実行されません
}
if (null) {
    // この行は実行されません
}
```

### else if文 {#else-if-statement}

複数の条件分岐を書く場合は、if文に続けてelse if文を使うことで書けます。
たとえば、次の3つの条件分岐するプログラムを考えます。

- `version` が "ES5" ならば "ECMAScript 5" と出力
- `version` が "ES6" ならば "ECMAScript 2015" と出力
- `version` が "ES7" ならば "ECMAScript 2016" と出力

次のコードでは、if文とelse if文を使うことで3つの条件を書いています。
変数`version`の値が`"ES6"`であるため、コンソールには`"ECMAScript 2015"`が出力されます。

{{book.console}}
[import, else-if-example.js](src/if/else-if-example.js)

### else文 {#else-statement}

if文とelse if文では、条件に一致した場合の処理をブロック内に書いていました。
一方で条件に一致しなかった場合の処理は、else文を使うことで書けます。

次のコードでは、変数`num`の数値が10より大きいかを判定しています。
`num`の値は10以下であるため、else文で書いた処理が実行されます。

{{book.console}}
```js
const num = 1;
if (num > 10) {
    console.log(`numは10より大きいです: ${num}`);
} else {
    console.log(`numは10以下です: ${num}`);
}
```

#### ネストしたif文 {#nested-if-statement}

if文、else if文、else文はネストして書けます。
次のように複数の条件を満たすかどうかをif文のネストとして表現できます。

<!-- doctest:disable -->
```js
if (条件式A) {
    if (条件式B) {
        // 条件式Aと条件式Bがtrueならば実行される文
    }
}
```

ネストしたif文の例として、今年がうるう年かを判定してみましょう。

うるう年の条件は次のとおりです。

<!-- textlint-disable preset-ja-technical-writing/no-start-duplicated-conjunction -->

- 西暦で示した年が4で割り切れる年はうるう年です
- ただし、西暦で示した年が100で割り切れる年はうるう年ではありません
- ただし、西暦で示した年が400で割り切れる年はうるう年です

<!-- textlint-enable preset-ja-technical-writing/no-start-duplicated-conjunction -->

西暦での現在の年は `new Date().getFullYear();` で取得できます。
このうるう年の条件をif文で表現すると次のように書けます。

{{book.console}}
[import, leap-year-nest-example.js](src/if/leap-year-nest-example.js)

条件を上から順に書き下したため、ネストが深い文となってしまっています。
一般的にはネストは浅いほうが、読みやすいコードとなります。

条件を少し読み解くと、400で割り切れる年は無条件にうるう年であることがわかります。
そのため、条件を並び替えることで、ネストするif文なしに書くことができます。

{{book.console}}
[import, leap-year-flat-example.js](src/if/leap-year-flat-example.js)

## switch文 {#switch-statement}

switch文は、次のような構文で`式`の評価結果が指定した値である場合に行う処理を並べて書きます。

<!-- doctest:disable -->
```js
switch (式) {
    case ラベル1:
        // `式`の評価結果が`ラベル1`と一致する場合に実行する文
        break;
    case ラベル2:
        // `式`の評価結果が`ラベル2`と一致する場合に実行する文
        break;
    default:
        // どのcaseにも該当しない場合の処理
        break;
}
// break; 後はここから実行される
```

switch文はif文と同様に`式`の評価結果に基づく条件分岐を扱います。
またbreak文は、switch文から抜けてswitch文の次の文から実行するためのものです。
次のコードでは、`version`の評価結果は`"ES6"`となるため、`case "ES6":`に続く文が実行されます。

{{book.console}}
[import, switch-example.js](./src/switch/switch-example.js)

これはif文で次のように書いた場合と同じ結果になります。

{{book.console}}
```js
const version = "ES6";
if (version === "ES5") {
    console.log("ECMAScript 5");
} else if (version === "ES6") {
    console.log("ECMAScript 2015");
} else if (version === "ES7") {
    console.log("ECMAScript 2016");
} else {
    console.log("しらないバージョンです");
}
```

switch文はやや複雑な仕組みであるため、どのように処理されているかを見ていきます。
まず `switch (式)` の`式`を評価します。

<!-- doctest:disable -->
```js
switch (式) {
    // case
}
```

次に`式`の評価結果が厳密等価演算子（`===`）で一致するラベルを探索します。
一致するラベルが存在する場合は、そのcase節を実行します。
一致する`ラベル`が存在しない場合は、default節が実行されます。

<!-- doctest:disable -->
```js
switch (式) {
    // if (式 === "ラベル1")
    case "ラベル1":
        break;
    // else if (式 === "ラベル2")
    case "ラベル2":
        break;
    // else
    default:
        break;
}
```

### break文 {#break-statement}

switch文のcase節では基本的に`break;`を使ってswitch文を抜けるようにします。
この`break;`は省略が可能ですが、省略した場合、後ろに続くcase節が条件に関係なく実行されます。

{{book.console}}
[import, miss-case-example.js](./src/switch/miss-case-example.js)

このように`break;`を忘れてしまうと意図しないcase節が実行されてしまいます。
そのため、case節とbreak文が多用されているswitch文が出てきた場合、
別の方法で書けないかを考えるべきサインとなります。

switch文はif文の代用として使うのではなく、次のように関数と組み合わせて条件に対する値を返すパターンとして使うことが多いです。
関数については「[関数と宣言][]」の章で紹介します。

{{book.console}}
[import, switch-return-example.js](./src/switch/switch-return-example.js)

## まとめ {#conclusion}

この章では条件分岐について学びました。

- if文、else if文、else文で条件分岐した処理を扱える
- 条件式に指定した値は真偽値へと変換してから判定される
- 真偽値に変換すると`false`となる値をfalsyと呼ぶ
- switch文とcase節、default節を組み合わせて条件分岐した処理を扱える
- case節でbreak文しない場合は引き続きcase節が実行される

条件分岐にはif文やswitch文を利用します。
複雑な条件を定義する場合には、if文のネストが深くなりやすいです。
そのような場合には、条件式自体を見直してよりシンプルな条件にできないかを考えてみることも重要です。

<!--
## 参考 {#reference-for-condition}

- [うるう年 - Wikipedia](https://ja.wikipedia.org/wiki/%E9%96%8F%E5%B9%B4)
- [C言語入門：うるう年判定プログラム:Geekなぺーじ](http://www.geekpage.jp/programming/c/leap-year.php)
- [どうしてこんなキーワードがあるの？ - あどけない話](http://d.hatena.ne.jp/kazu-yamamoto/20080904/1220495854)
- [switch - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/switch)
- [制御フローとエラー処理 - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
-->

[暗黙的な型変換]: ../implicit-coercion/README.md
[関数と宣言]: ../function-declaration/README.md
