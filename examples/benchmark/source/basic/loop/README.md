---
author: azu
description: "for文やwhile文を使った反復処理についてを紹介します。また、同等の反復処理がArrayのメソッドでも実現できることについても紹介します。"
---

# ループと反復処理 {#loop-and-iteration}

<!-- Note: ループと反復処理

- ループの方がより抽象的な概念
- ループで反復は表現できるが、反復でループは表現できない
- https://common-lisp.net/project/iterate/doc/Differences-Between-Iterate-and-Loop.html

 -->

この章では、while文やfor文などの基本的な反復処理と制御文について学んでいきます。

プログラミングにおいて、同じ処理を繰り返すために同じコードを繰り返し書く必要はありません。
ループやイテレータなどを使い、反復処理として同じ処理を繰り返し実行できます。

また、for文などのような構文だけではなく、配列のメソッドを利用して反復処理を行う方法もあります。
配列のメソッドを使った反復処理もよく利用されるため、合わせて見ていきます。

## while文 {#while-statement}

while文は`条件式`が`true`であるならば、反復処理を行います。

<!-- doctest:disable -->
```js
while (条件式) {
    実行する文;
}
```

while文の実行フローは次のようになります。
最初から`条件式`が`false`である場合は、何も実行せずwhile文は終了します。

<!-- textlint-disable preset-ja-technical-writing/ja-no-redundant-expression -->

1. `条件式` の評価結果が`true`なら次のステップへ、`false`なら終了
2. `実行する文`を実行
3. ステップ1へ戻る

<!-- textlint-enable preset-ja-technical-writing/ja-no-redundant-expression -->

次のコードでは`x`の値が10未満であるなら、コンソールへ繰り返しログが出力されます。
また、`実行する文`にて、`x`の値を増やし`条件式`が`false`となるようにしています。

{{book.console}}
[import, while-add-example.js](./src/while/while-add-example.js)

つまり、`実行する文`の中で`条件式`が`false`となるような処理を書かないと無限ループします。
JavaScriptにはより安全な反復処理の書き方があるため、while文は使う場面が限られています。

安易にwhile文を使うよりも、ほかの書き方で解決できないかを考えてからでも遅くはないでしょう。

## [コラム] 無限ループ {#inifinite-loop}

反復処理を扱う際に、コードの書き間違いや条件式のミスなどから無限ループを引き起こしてしまう場合があります。
たとえば、次のコードは条件式の評価結果が常に`true`となってしまうため、無限ループが発生してしまいます。

<!-- doctest:disable -->
```js
let i = 1;
// 条件式が常にtrueになるため、無限ループする
while (i > 0) {
    console.log(`${i}回目のループ`);
    i += 1;
}
```

無限ループが発生してしまったときは、あわてずにスクリプトを停止してからコードを修正しましょう。

ほとんどのブラウザは無限ループが発生した際に、自動的にスクリプトの実行を停止する機能が含まれています。
また、ブラウザで該当のスクリプトを実行しているページ（タブ）またはブラウザそのものを閉じることで強制的に停止できます。
Node.jsで実行している場合は`Ctrl + C`を入力し、終了シグナルを送ることで強制的に停止できます。

無限ループが発生する原因のほとんどは条件式に関連する実装ミスです。
まずは条件式の確認をしてみることで問題を解決できるはずです。

## do-while文 {#do-while-statement}

do-while文はwhile文とほとんど同じですが実行順序が異なります。

<!-- doctest:disable -->
```js
do {
    実行する文;
} while (条件式);
```

do-while文の実行フローは次のようになります。

1. `実行する文`を実行
2. `条件式` の評価結果が`true`なら次のステップへ、`false`なら終了
3. ステップ1へ戻る

while文とは異なり、必ず最初に`実行する文`を処理します。

そのため、次のコードのように最初から`条件式`を満たさない場合でも、
初回の`実行する文`が処理され、コンソールへ`1000`と出力されます。

{{book.console}}
[import, do-while-example.js](./src/do-while/do-while-example.js)

この仕組みをうまく利用し、ループの開始前とループ中の処理をまとめて書くことができます。
しかし、while文と同じくほかの書き方で解決できないかを考えてからでも遅くはないでしょう。

## for文 {#for-statement}

for文は繰り返す範囲を指定した反復処理を書くことができます。

<!-- doctest:disable -->
```js
for (初期化式; 条件式; 増分式) {
    実行する文;
}
```

for文の実行フローは次のようになります。

1. `初期化式` で変数の宣言
2. `条件式` の評価結果が`true`なら次のステップへ、`false`なら終了
3. `実行する文` を実行
4. `増分式` で変数を更新
5. ステップ2へ戻る

次のコードでは、for文で1から10までの値を合計して、その結果をコンソールへ出力しています。

{{book.console}}
```js
let total = 0; // totalの初期値は0
// for文の実行フロー
// iを0で初期化
// iが10未満（条件式を満たす）ならfor文の処理を実行
// iに1を足し、再び条件式の判定へ
for (let i = 0; i < 10; i++) {
    total += i + 1; // 1から10の値をtotalに加算している
}
console.log(total); // => 55
```

このコードは1から10までの合計を電卓で計算すればいいので、普通は必要ありませんね。
もう少し実用的なものを考えると、任意の数値の入った配列を受け取り、その合計を計算して返すという関数を実装すると良さそうです。

次のコードでは、任意の数値が入った配列を受け取り、その合計値を返す `sum` 関数を実装しています。
`numbers`配列に含まれている要素を先頭から順番に変数`total`へ加算することで合計値を計算しています。

{{book.console}}
[import, sum-for-example.js](./src/for/sum-for-example.js)

JavaScriptの配列である`Array`オブジェクトには、反復処理のためのメソッドが備わっています。
そのため、配列のメソッドを使った反復処理も合わせて見ていきます。

## 配列の`forEach`メソッド {#array-foreach}

配列には`forEach`メソッドというfor文と同じように反復処理を行うメソッドがあります。

`forEach`メソッドでの反復処理は、次のように書けます。

{{book.console}}
```js
const array = [1, 2, 3];
array.forEach(currentValue => {
    // 配列の要素ごとに呼び出される処理
});
```

JavaScriptでは、関数がファーストクラスであるため、その場で作った匿名関数（名前のない関数）を引数として渡せます。

引数として渡される関数のことを**コールバック関数**と呼びます。
また、コールバック関数を引数として受け取る関数やメソッドのことを**高階関数**と呼びます。

<!-- doctest: ReferenceError -->
```js
const array = [1, 2, 3];
// forEachは"コールバック関数"を受け取る高階関数
array.forEach(コールバック関数);
```

`forEach`メソッドのコールバック関数には、配列の要素が先頭から順番に渡されて実行されます。
つまり、コールバック関数の`currentValue`には1から3の値が順番に渡されます。

{{book.console}}
```js
const array = [1, 2, 3];
array.forEach(currentValue => {
    console.log(currentValue);
});
// 1
// 2
// 3
// と順番に出力される
```

先ほどのfor文の例と同じ数値の合計を返す`sum` 関数を`forEach`メソッドで実装してみます。

{{book.console}}
[import, sum-for-each-example.js](./src/for/sum-for-each-example.js)

`forEach`はfor文の`条件式`に相当するものはなく、必ず配列のすべての要素を反復処理します。
変数`i`といった一時的な値を定義する必要がないため、シンプルに反復処理を書けます。

## break文 {#break-statement}

break文は処理中の文から抜けて次の文へ移行する制御文です。
while、do-while、forの中で使い、処理中のループを抜けて次の文へ制御を移します。

```js
while (true) {
    break; // *1 へ
}
// *1 次の文
```

switch文で出てきたものと同様で、処理中のループ文を終了できます。

次のコードでは配列の要素に1つでも偶数を含んでいるかを判定しています。

{{book.console}}
[import, break-find-example.js](./src/break/break-find-example.js)

1つでも偶数があるかがわかればいいため、配列内から最初の偶数を見つけたらfor文での反復処理を終了します。
このような処理は使い回せるように、関数として実装するのが一般的です。

同様の処理をする `isEvenIncluded` 関数を実装してみます。
次のコードでは、break文が実行され、ループを抜けた後にreturn文で結果を返しています。

{{book.console}}
[import, find-even-break-example.js](./src/break/find-even-break-example.js)

return文は現在の関数を終了させることができるため、次のように書くこともできます。
`numbers`に1つでも偶数が含まれていれば結果は`true`となるため、偶数の値が見つかった時点で`true`を返しています。

{{book.console}}
[import, find-even-return-example.js](./src/break/find-even-return-example.js)

偶数を見つけたらすぐにreturnすることで一時的な変数が不要となり、より簡潔に書けました。

### 配列の`some`メソッド {#array-some}

先ほどの`isEvenIncluded`関数は、偶数を見つけたら `true` を返す関数でした。
配列では`some`メソッドで同様のことが行えます。

`some`メソッドは、配列の各要素をテストする処理をコールバック関数として受け取ります。
コールバック関数が、一度でも`true`を返した時点で反復処理を終了し、`some`メソッドは`true`を返します。

```js
const array = [1, 2, 3, 4, 5];
const isPassed = array.some(currentValue => {
    // テストをパスするとtrue、そうでないならfalseを返す
});
```

`some`メソッドを使うことで、配列に偶数が含まれているかは次のように書くことができます。
受け取った値が偶数であるかをテストするコールバック関数として`isEven`関数を渡します。

{{book.console}}
[import, some-even-example.js](./src/break/some-even-example.js)

## continue文 {#continue-statement}

continue文は現在の反復処理を終了して、次の反復処理を行います。
continue文は、while、do-while、forの中で使うことができます。

たとえば、while文の処理中で`continue`文が実行されると、現在の反復処理はその時点で終了されます。
そして、次の反復処理で`条件式`を評価するところからループが再開されます。

<!-- doctest:disable -->
```js
while (条件式) {
    // 実行される処理
    continue; // `条件式` へ
    // これ以降の行は実行されません
}
```

次のコードでは、配列の中から偶数を集め、新しい配列を作り返しています。
偶数ではない場合、処理中のfor文をスキップしています。

{{book.console}}
[import, continue-filter-even-example.js](src/continue/continue-filter-even-example.js)

もちろん、次のように`continue`文を使わずに「偶数なら`results`へ追加する」という書き方も可能です。

<!-- doctest:disable -->
```js
if (isEven(number)) {
    results.push(number);
}
```

この場合、条件が複雑になってきた場合にネストが深くなってコードが読みにくくなります。
そのため、[ネストしたif文](../condition/README.md)のうるう年の例でも紹介したように、
できるだけ早い段階でそれ以上処理を続けない宣言をすることで、複雑なコードになることを避けています。

### 配列の`filter`メソッド {#array-filter}

配列から特定の値だけを集めた新しい配列を作るには`filter`メソッドを利用できます。

`filter`メソッドには、配列の各要素をテストする処理をコールバック関数として渡します。
コールバック関数が`true`を返した要素のみを集めた新しい配列を返します。

```js
const array = [1, 2, 3, 4, 5];
// テストをパスしたものを集めた配列
const filteredArray = array.filter((currentValue, index, array) => {
    // テストをパスするならtrue、そうでないならfalseを返す
});
```

先ほどのcontinue文を使った値の絞り込みは`filter`メソッドを使うとより簡潔に書けます。
次のコードでは、`filter`メソッドを使って偶数だけに絞り込んでいます。

{{book.console}}
[import, filter-even-example.js](./src/continue/filter-even-example.js)

## for...in文 {#for-in-statement}

for...in文はオブジェクトのプロパティに対して、順不同で反復処理を行います。

<!-- doctest:disable -->
```js
for (プロパティ in オブジェクト) {
    実行する文;
}
```

次のコードでは`obj`のプロパティ名を`key`変数に代入して反復処理をしています。
`obj`には、3つのプロパティ名があるため３回繰り返されます
（ループのたびに毎回新しいブロックを作成しているため、ループごとに定義する変数`key`は再定義エラーになりません。詳細は「[関数とスコープ][]」の章の「[ブロックスコープ][]」で解説します）。

{{book.console}}
[import, for-in-object-example.js](./src/for-in/for-in-object-example.js)

オブジェクトに対する反復処理のためにfor...in文は有用に見えますが、多くの問題を持っています。

JavaScriptでは、オブジェクトは何らかのオブジェクトを継承しています。
for...in文は、対象となるオブジェクトのプロパティを列挙する場合に、親オブジェクトまで列挙可能なものがあるかを探索して列挙します。
そのため、オブジェクト自身が持っていないプロパティも列挙されてしまい、意図しない結果になる場合があります。

安全にオブジェクトのプロパティを列挙するには、`Object.keys`メソッド、`Object.values`メソッド、`Object.entries`メソッドなどが利用できます。

先ほどの例である、オブジェクトのキーと値を列挙するコードはfor...in文を使わずに書けます。
`Object.keys`メソッドは引数のオブジェクト自身が持つ列挙可能なプロパティ名の配列を返します。
そのためfor...in文とは違い、親オブジェクトのプロパティは列挙されません。

{{book.console}}
[import, object-keys-for-each-example.js](./src/for-in/object-keys-for-each-example.js)

また、for...in文は配列に対しても利用できますが、こちらも期待した結果にはなりません。

次のコードでは、配列の要素が列挙されそうですが、実際には配列のプロパティ名が列挙されます。
for...in文が列挙する配列オブジェクトのプロパティ名は、要素のインデックスを文字列化した"0"、"1"となるため、その文字列が`num`へと順番に代入されます。
そのため、数値と文字列の加算が行われ、意図した結果にはなりません。

{{book.console}}
[import, for-in-array-bug-example.js](./src/for-in/for-in-array-bug-example.js)

配列の内容に対して反復処理を行う場合は、for文や`forEach`メソッド、後述するfor...of文を使うべきでしょう。

このようにfor...in文は正しく扱うのが難しいですが、代わりとなる手段が豊富にあります。
そのため、for...in文の利用は避け、`Object.keys`メソッドなどを使って配列として反復処理するなど別の方法を考えたほうがよいでしょう。

## [ES2015] for...of文 {#for-of-statement}

最後にfor...of文についてです。

JavaScriptでは、`Symbol.iterator`という特別な名前のメソッドを実装したオブジェクトを**iterable**と呼びます。
iterableオブジェクトは、for...of文で反復処理できます。

iterableについてはgeneratorと密接な関係がありますが、ここでは反復処理時の動作が定義されたオブジェクトと認識していれば問題ありません。

iterableオブジェクトは反復処理時に次の返す値を定義しています。
それに対して、for...of文では、`iterable`から値を1つ取り出し、`variable`に代入して反復処理を行います。

<!-- doctest:disable -->
```js
for (variable of iterable) {
    実行する文;
}
```

実はすでにiterableオブジェクトは登場していて、Arrayはiterableオブジェクトです。

次のようにfor...of文で、配列から値を取り出して反復処理を行えます。
for...in文とは異なり、インデックス値ではなく配列の値を列挙します。

{{book.console}}
[import, for-of-array-example.js](./src/for-of/for-of-array-example.js)

JavaScriptではStringオブジェクトもiterableです。
そのため、文字列を1文字ずつ列挙できます。

{{book.console}}
[import, for-of-string-example.js](./src/for-of/for-of-string-example.js)

そのほかにも、`TypedArray`、`Map`、`Set`、DOM NodeListなど、`Symbol.iterator`が実装されているオブジェクトは多いです。
for...of文は、それらのiterableオブジェクトで反復処理に利用できます。

## [コラム] `let`ではなく`const`で反復処理をする {#const-iteration}

先ほどのfor文や`forEach`メソッドで数値の合計を返す`sum`関数の実装は、`const`ではなく`let`を利用していました。
なぜなら、`const`は再代入できない変数を宣言するキーワードであるためです。

一度定義した変数に値を代入しつつ反復処理をすると、変数への値の上書きが必要となり`const`を使うことができません。
そのため、一時的な変数を定義せずに反復処理した結果だけを受け取る方法が必要になります。

配列には、反復処理をして新しい値を作る`reduce`メソッドがあります。

`reduce`メソッドは2つずつ要素を取り出し（左から右へ）、その値を`コールバック関数`に適用し、
`次の値`として1つの値を返します。
最終的な、`reduce`メソッドの返り値は、コールバック関数が最後に`return`した値となります。

<!-- doctest:disable -->
```js
const result = array.reduce((前回の値, 現在の値) => {
    return 次の値;
}, 初期値);
```

配列から合計値を返す関数を`reduce`メソッドを使って実装してみましょう。

`初期値`に`0`を指定し、`前回の値`と`現在の値`を足していくことで合計を計算できます。
`初期値`を指定していた場合は、最初の`前回の値`に初期値が、配列の先頭の値が`現在の値`となった状態で開始されます。

{{book.console}}
[import, sum-reduce-example.js](./src/for/sum-reduce-example.js)

`reduce`メソッドを使った例では、そもそも変数宣言をしていないことがわかります。
`reduce`メソッドでは常に新しい値を返すことで、1つの変数の値を更新していく必要がなくなります。
これは`const`と同じく、一度作った変数の値を変更しないため、意図しない変数の更新を避けることにつながります。

## まとめ {#conclusion}

この章では、for文などの構文での反復処理と配列のメソッドを使った反復処理について比較しながら見ていきました。
for文などの構文ではcontinue文やbreak文が利用できますが、配列のメソッドではそれらは利用できません。
一方で配列のメソッドは、一時的な変数を管理する必要がないことや、処理をコールバック関数として書くという違いがあります。

どちらの方法も反復処理においてはよく利用されます。
どちらが優れているというわけでもないため、どちらの方法も使いこなせるようになることが重要です。
また、配列のメソッドについては「[配列][]」の章でも詳しく解説します。

[配列]: ../array/README.md
[関数とスコープ]: .../function-scope/README.md
[ブロックスコープ]: .../function-scope/README.md#block-scope