---
author: laco
description: "JavaScriptのモジュール（ECMAScriptモジュール）について紹介します。"
---

# [ES2015] ECMAScriptモジュール {#module}

ECMAScriptモジュールは[Todoアプリのユースケース][]で実際に動かしながら学ぶため、ここでは構文の説明とモジュールのイメージをつかむのが目的です。
この章のサンプルコードを実際に動かすためにはローカルサーバーなどの準備が必要です。
そのため、ユースケースの章を先に読んでから戻ってきてもかまいません。

モジュールは、保守性・名前空間・再利用性のために使われます。

 * 保守性: 依存性の高いコードの集合を一箇所にまとめ、それ以外のモジュールへの依存性を減らせます
 * 名前空間: モジュールごとに分かれたスコープがあり、グローバルの名前空間を汚染しません
 * 再利用性: 便利な変数や関数を複数の場所にコピーアンドペーストせず、モジュールとして再利用できます

1つのJavaScriptモジュールは1つのJavaScriptファイルに対応します。
モジュールは変数や関数などを外部にエクスポートできます。また、別のモジュールで宣言された変数や関数などをインポートできます。
この章では **ECMAScriptモジュール（ESモジュール、JSモジュールとも呼ばれる）** について見ていきます。
ECMAScriptモジュールは、ES2015で導入されたJavaScriptファイルをモジュール化する言語標準の機能です。

## ECMAScriptモジュールの構文 {#es-module-syntax}

ECMAScriptモジュールは、[export文][]によって変数や関数などをエクスポートできます。
また、[import文][]を使って別のモジュールからエクスポートされたものをインポートできます。
インポートとエクスポートはそれぞれに **名前つき** と **デフォルト** という2種類の方法があります。

まずは名前つきエクスポート／インポート文について見ていきましょう。

### 名前つきエクスポート／インポート {#named-export-import}

**名前つきエクスポート**は、モジュールごとに複数の変数や関数などをエクスポートできます。
次の例では、`foo`変数と`bar`関数をそれぞれ名前つきエクスポートしています。
`export`文のあとに続けて`{}`を書き、その中にエクスポートする変数を入れることで、宣言済みの変数を名前つきエクスポートできます。

[import, title="named-export.js"](src/named-export.js)

また、名前つきエクスポートでは`export`文を宣言の前につけると、宣言と同時に名前つきエクスポートできます。
[import, title="named-export-declare.js"](src/named-export-declare.js)

**名前つきインポート**は、指定したモジュールから名前を指定して選択的にインポートできます。
次の例では `my-module.js`から名前つきエクスポートされたオブジェクトの名前を指定して名前つきインポートしています。
`import`文のあとに続けて`{}`を書き、その中にインポートしたい名前つきエクスポートの名前を入れます。
複数の値をインポートしたい場合は、それぞれの名前をカンマで区切ります。

[import, title="my-module.js"](src/my-module-1.js)

[import, title="named-import.js"](src/named-import.js)

#### 名前つきエクスポート／インポートのエイリアス {#named-export-import-alias}

名前つきエクスポート／インポートには**エイリアス**の仕組みがあります。
エイリアスを使うと、宣言済みの変数を違う名前で名前つきエクスポートできます。
エイリアスをつけるには、次のように`as`のあとにエクスポートしたい名前を記述します。

[import, title="named-export-alias.js"](src/named-export-alias.js)

また、名前つきインポートしたオブジェクトにも別名をつけることができます。
インポートでも同様に、`as`のあとに別名を記述します。

[import, title="named-import-alias.js"](src/named-import-alias.js)

### デフォルトエクスポート／インポート {#default-export-import}

次に、デフォルトエクスポート／インポートについて見ていきましょう。
**デフォルトエクスポート**は、モジュールごとに1つしかエクスポートできない特殊なエクスポートです。
次の例は、すでに宣言されている変数をデフォルトエクスポートしています。
`export default`文で、後に続く式の評価結果をデフォルトエクスポートします。

[import, title="default-export.js"](src/default-export.js)

また、`export`文を宣言の前につけると、宣言と同時にデフォルトエクスポートできます。
このとき関数やクラスの名前を省略できます。

<!-- exportがないため -->
<!-- doctest:disable -->
```js
// 宣言と同時に関数をデフォルトエクスポートする
export default function() {}
```
<!-- doctest:enable -->

ただし、変数宣言は宣言とデフォルトエクスポートを同時に行うことはできません。
なぜなら、変数宣言はカンマ区切りで複数の変数を定義できてしまうためです。
次の例は実行できない不正なコードです。

[import, default-export-variables-invalid.js](src/default-export-variables-invalid.js)

**デフォルトインポート**は、指定したモジュールのデフォルトエクスポートに名前をつけてインポートします。
次の例では `my-module.js`のデフォルトエクスポートに`myModule`という名前をつけてインポートしています。
`import`文のあとに任意の名前をつけることで、デフォルトエクスポートをインポートできます。

[import, title="my-module.js"](src/my-module-2.js)

[import, title="default-import.js"](src/default-import.js)

実はデフォルトエクスポートは、`default`という固有の名前による名前つきエクスポートと同じものです。
そのため、名前つきエクスポートで`as default`とエイリアスをつけることでデフォルトエクスポートすることもできます。

[import, title="default-export-alias.js"](src/default-export-alias.js)

同様に、名前つきインポートにおいても`default`という名前がデフォルトインポートに対応しています。
次のように、名前つきインポートで`default`を指定するとデフォルトインポートできます。
ただし、`default`は予約語なので、この方法では必ず`as`構文を使ってエイリアスをつける必要があります。

[import, title="default-import-alias.js"](src/default-import-alias.js)

また、名前つきインポートとデフォルトインポートの構文は同時に記述できます。
次のように2つの構文をカンマでつなげます。

[import, title="default-import-with-named.js"](src/default-import-with-named.js)

ECMAScriptモジュールでは、エクスポートされていないものはインポートできません。
なぜならECMAScriptモジュールはJavaScriptのパース段階で依存関係が解決され、インポートする対象が存在しない場合はパースエラーとなるためです。
デフォルトインポートは、インポート先のモジュールがデフォルトエクスポートをしている必要があります。
同様に名前つきインポートは、インポート先のモジュールが指定した名前つきエクスポートをしている必要があります。

### その他の構文 {#other-syntax}

ECMAScriptモジュールには名前つきとデフォルト以外にもいくつかの構文があります。

#### 再エクスポート {#re-export}

再エクスポートとは、別のモジュールからインポートしたものを、改めて自分自身からエクスポートし直すことです。
複数のモジュールからエクスポートされたものをまとめたモジュールを作るときなどに使われます。

再エクスポートは次のように`export`文のあとに`from`を続けて、別のモジュール名を指定します。

[import, re-export-invalid.js](src/re-export-invalid.js)

#### すべてをインポート {#namespace-import}

`import * as`構文は、すべての名前つきエクスポートをまとめてインポートします。
この方法では、モジュールごとの **名前空間** となるオブジェクトを宣言します。
エクスポートされた変数や関数などにアクセスするには、その名前空間オブジェクトのプロパティを使います。
また、先ほどのとおり、`default` という固有名を使うとデフォルトエクスポートにもアクセスできます。

[import, title="my-module.js"](src/my-module.js)

[import, title="namespace-import.js"](src/namespace-import.js)

#### 副作用のためのインポート {#import-for-side-effect}

モジュールの中には、グローバルのコードを実行するだけで何もエクスポートしないものがあります。
たとえば次のような、グローバル変数を操作するためのモジュールなどです。

[import, title="side-effects.js"](src/side-effects.js)

このようなモジュールをインポートするには、副作用のためのインポート構文を使います。
この構文では、指定したモジュールを読み込んで実行するだけで、何もインポートしません。

[import, importExample.js](src/import-side-effects.js)

## ECMAScriptモジュールを実行する {#run-es-modules}

作成したECMAScriptモジュールを実行するためには、起点となるJavaScriptファイルをECMAScriptモジュールとしてウェブブラウザに読み込ませる必要があります。
ウェブブラウザは`script`要素によってJavaScriptファイルを読み込み、実行します。
次のように`script`要素に`type="module"`属性を付与すると、ウェブブラウザはJavaScriptファイルをECMAScriptモジュールとして読み込みます。

```html
<!-- my-module.jsをECMAScriptモジュールとして読み込む -->
<script type="module" src="./my-module.js"></script>
<!-- インラインでも同じ -->
<script type="module">
import { foo } from "./my-module.js";
</script>
```

`type="module"`属性が付与されない場合は通常のスクリプトとして扱われ、ECMAScriptモジュールの機能は使えません。
スクリプトとして読み込まれたJavaScriptで`import`文や`export`文を使用すると、構文エラーが発生します。

ウェブブラウザの環境では、インポートされるモジュールの取得はネットワーク経由で解決されます。
そのため、モジュール名はJavaScriptファイルの絶対URLあるいは相対URLを指定します。
詳しくは[Todoアプリのユースケース][]を参照してください。


[Todoアプリのユースケース]: ../../use-case/todoapp/README.md
[export文]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/export
[import文]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import
