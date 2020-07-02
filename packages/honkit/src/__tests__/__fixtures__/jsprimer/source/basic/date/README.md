---
author: laco
description: "日付や時刻を扱うビルトインオブジェクトのDateを紹介します。"
---

# Date {#date}

この章では、JavaScriptで日付や時刻を扱うための[Date][]について学びます。

## Dateオブジェクト {#date-object}

`Date`オブジェクトは`String`や`Array`などと同じく、ECMAScriptで定義されたビルトインオブジェクトです。

`Date`オブジェクトをインスタンス化することで、ある特定の時刻を表すオブジェクトが得られます。
`Date`における「時刻」は、UTC（協定世界時）の1970年1月1日0時0分0秒を基準とした相対的なミリ秒として保持されます。
このミリ秒の値のことを、本章では「時刻値」と呼びます。
`Date`オブジェクトのインスタンスはそれぞれがひとつの時刻値を持ち、その時刻値を元に日付や時・分などを扱うメソッドを提供します。

### インスタンスの作成 {#create-instance}

`Date`オブジェクトのインスタンスは、常にnew演算子を使って作成します。
`Date`オブジェクトのインスタンス作成には、大きく分けて2つの種類があります。
1つは現在の時刻をインスタンス化するもの、もう1つは任意の時刻をインスタンス化するものです。

#### 現在の時刻をインスタンス化する {#instance-current-time}

`Date`をnewするときにコンストラクタ引数を何も渡さない場合、作成されるインスタンスは現在の時刻を表すものになります。
`Date`オブジェクトのインスタンスではなく現在の時刻の時刻値だけが欲しい場合には、`Date.now`メソッドの戻り値を使います。
作成したインスタンスが持つ時刻値は、`getTime`メソッドで取得できます。
また、`toISOString`メソッドを使うと、その時刻をUTCにおける[ISO 8601][]形式の文字列に変換できます。
ISO 8601とは国際規格となっている文字列の形式で、`2006-01-02T15:04:05.999+09:00`のように時刻を表現します。
人間が見てもわかりやすい文字列であるため、広く利用されています。

{{book.console}}
```js
// 現在の時刻を表すインスタンスを作成する
const now = new Date();
// 時刻値だけが欲しい場合にはDate.nowメソッドを使う
console.log(Date.now());

// 時刻値を取得する
console.log(now.getTime());
// 時刻をISO 8601形式の文字列で表示する
console.log(now.toISOString());
```

#### 任意の時刻をインスタンス化する {#instance-any-time}

コンストラクタ引数を渡すことで、任意の時刻を表すインスタンスを作成できます。
`Date`のコンストラクタ関数は渡すデータ型や引数によって時刻の指定方法が変わります。
`Date`は次の3種類を引数としてサポートしています。

- 時刻値を渡すもの
- 時刻を示す文字列を渡すもの
- 時刻の部分（年・月・日など）をそれぞれ数値で渡すもの

1つめは、コンストラクタ関数にミリ秒を表す数値型の引数を渡したときに適用されます。
渡した数値をUTCの1970年1月1日0時0分0秒を基準とした時刻値として扱います。
この方法は実行環境による挙動の違いが起きないので安全です。
また、時刻値を直接指定するので、他の2つの方法と違ってタイムゾーンを考慮する必要がありません。

{{book.console}}
```js
// 時刻のミリ秒値を直接指定する形式
// 1136214245999はUTCにおける"2006年1月2日15時04分05秒999"を表す
const date = new Date(1136214245999);
// 末尾の'Z'はUTCであることを表す
console.log(date.toISOString()); // => "2006-01-02T15:04:05.999Z"
```

2つめは文字列型の引数を渡したときに適用されます。
[RFC2822][]や[ISO 8601][]の形式に従った文字列を渡すと、
その文字列をパースして得られる時刻値を使って、`Date`のインスタンスを作成します。

次のコードでは、ISO 8601形式の文字列を渡して`Date`のインスタンスを作成します。
タイムゾーンを含む文字列の場合は、そのタイムゾーンにおける時刻として時刻値を計算します。
文字列からタイムゾーンが読み取れない場合は、実行環境のタイムゾーンによって時刻値を計算するため注意が必要です。
また、ISO 8601形式以外の文字列のパースは、ブラウザごとに異なる結果を返す可能性があるため注意しましょう。

{{book.console}}
```js
// UTCにおける"2006年1月2日15時04分05秒999"を表すISO 8601形式の文字列
const inUTC = new Date("2006-01-02T15:04:05.999Z");
console.log(inUTC.toISOString()); // => "2006-01-02T15:04:05.999Z"

// 上記の例とは異なり、UTCであることを表す'Z'がついていないことに注意
// Asia/Tokyo(+09:00)で実行すると、UTCにおける表記は9時間前の06時04分05秒になる
const inLocal = new Date("2006-01-02T15:04:05.999");
console.log(inLocal.toISOString()); // "2006-01-02T06:04:05.999Z" (Asia/Tokyoの場合)
```

3つめは、時刻を次のように、年・月・日などの部分ごとの数値で指定する方法です。

<!-- doctest:disable -->
```js
new Date(year, month, day, hour, minutes, seconds, milliseconds);
```

コンストラクタ関数に2つ以上の引数を渡すと、このオーバーロードが適用されます。
日を表す第三引数から後ろの引数は省略可能ですが、日付だけはデフォルトで1が設定され、そのほかには0が設定されます。
また、月を表す第二引数は0から11までの数値で指定することにも注意しましょう。

先述した2つの方法と違い、この方法はタイムゾーンを指定できません。
渡した数値は常にローカルのタイムゾーンにおける時刻とみなされます。
<!-- textlint-disable -->
結果が実行環境に依存してしまうため、基本的にこの方法は使うべきではありません。
<!-- textlint-enable -->
時刻を部分ごとに指定したい場合は、[Date.UTC][]メソッドを使うとよいでしょう。
渡す引数の形式は同じですが、`Date.UTC`メソッドは渡された数値をUTCにおける時刻として扱い、その時刻値を返します。

{{book.console}}
```js
// 実行環境における"2006年1月2日15時04分05秒999"を表す
// タイムゾーンを指定することはできない
const date1 = new Date(2006, 0, 2, 15, 4, 5, 999);
console.log(date1.toISOString()); // "2006-01-02T06:04:05.999Z" (Asia/Tokyoの場合)

// Date.UTCメソッドを使うとUTCに固定できる
const ms = Date.UTC(2006, 0, 2, 15, 4, 5, 999);
// 時刻値を渡すコンストラクタと併用する
const date2 = new Date(ms);
console.log(date2.toISOString()); // => "2006-01-02T15:04:05.999Z"
```

なお、どのオーバーロードにも当てはまらない引数や、時刻としてパースできない文字列を渡した際にも、`Date`のインスタンスは作成されます。
ただし、このインスタンスが持つ時刻は不正であるため、`getTime`メソッドは`NaN`を返し、`toString`メソッドは`Invalid Date`という文字列を返します。

{{book.console}}
```js
// 不正なDateインスタンスを作成する
const invalid = new Date("");
console.log(invalid.getTime()); // => NaN
console.log(invalid.toString()); // => "Invalid Date"
```

### Dateのインスタンスメソッド {#instance-method}

`Date`オブジェクトのインスタンスは多くのメソッドを持っていますが、
ほとんどは`getHours`と`setHours`のような、時刻の各部分を取得・更新するためのメソッドです。

次の例は、日付を決まった形式の文字列に変換しています。
`getMonth`メソッドや`setMonth`メソッドのように月を数値で扱うメソッドは、0から11の数値で指定することに注意しましょう。ある`Date`のインスタンスの時刻が何月かを表示するには、`getMonth`メソッドの戻り値に1を足す必要があります。

{{book.console}}
<!-- doctest:meta:{ "ECMAScript": "2017" } -->
```js
// YYYY/MM/DD形式の文字列に変換する関数
function formatDate(date) {
    const yyyy = String(date.getFullYear());
    // String#padStartメソッド（ES2017）で2桁になるように0埋めする
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
}

const date = new Date("2006-01-02T15:04:05.999");
console.log(formatDate(date)); // => "2006/01/02"
```

`getTimezoneOffset`メソッドは、実行環境のタイムゾーンのUTC**からの**オフセット値を**分**単位の数値で返します。
たとえばAsia/TokyoタイムゾーンはUTC+9時間なのでオフセット値は-9時間となり、`getTimezoneOffset`メソッドの戻り値は`-540`です。

{{book.console}}
```js
// getTimezoneOffsetはインスタンスメソッドなので、インスタンスが必要
const now = new Date();
// 時間単位にしたタイムゾーンオフセット
const timezoneOffsetInHours = now.getTimezoneOffset() / 60;
// UTCの現在の時間を計算できる
console.log(`Hours in UTC: ${now.getHours() + timezoneOffsetInHours}`);
```

## 現実のユースケースとDate {#usecase}

ここまで`Date`オブジェクトとインスタンスメソッドについて述べましたが、
多くのユースケースにおいては機能が不十分です。
たとえば次のような場合に、`Date`では直感的に記述できません。

- 任意の書式の文字列から時刻に変換するメソッドがない
- 「時刻を1時間進める」のように時刻を前後にずらす操作を提供するメソッドがない
- 任意のタイムゾーンにおける時刻を計算するメソッドがない
- `YYYY/MM/DD`のようなフォーマットに基づいた文字列への変換を提供するメソッドがない

そのため、JavaScriptにおける日付・時刻の処理は、標準のDateではなくライブラリを使うことが一般的になっています。
代表的なライブラリとしては、[moment.js][]や[js-joda][]、[date-fns][]などがあります。

<!-- momentが参照できない -->
<!-- doctest:disable -->
```js
// moment.jsで現在時刻のmomentオブジェクトを作る
const now = moment();
// addメソッドで10分進める
const future = now.add(10, "minutes");
// formatメソッドで任意の書式の文字列に変換する
console.log(future.format("YYYY/MM/DD")); 
```

## まとめ {#conclusion}

この章では、Dateオブジェクトについて学びました。

- `Date`オブジェクトのインスタンスはある特定の時刻を表すビルトインオブジェクト
- `Date`における「時刻」は、UTC（協定世界時）の1970年1月1日0時0分0秒を基準とした相対的なミリ秒として保持されている
- `Date`コンストラクタで任意の時間を表す`Date`インスタンスを作成できる
- `Date`インスタンスメソッドにはさまざまなものがあるが、現実のユースケースでは機能が不十分になりやすい
- ビルトインオブジェクトの`Date`のみではなく、ライブラリも合わせて利用するのが一般的

[Date]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date
[Date.parse]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
[Date.now]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/now
[Date.UTC]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC
[RFC2822]: https://tools.ietf.org/html/rfc2822#section-3.3
[ISO 8601]: https://ja.wikipedia.org/wiki/ISO_8601
[moment.js]: https://momentjs.com/
[js-joda]: https://github.com/js-joda/js-joda
[date-fns]: https://date-fns.org/
