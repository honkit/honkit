---
author: azu
description: "第一部ではJavaScriptの基本的な文法やビルトインオブジェクトの使い方についてを紹介します。第一部で学ぶ内容のほとんどはECMAScriptで定義された内容となります。そのため、流行に左右されにくい知識を学ぶことになります。"
---

# 第一部: 基本文法 {#basic-grammar}

第一部ではJavaScriptの基本的な文法やビルトインオブジェクトの使い方を紹介します。

## 目次 {#summary}

### [JavaScriptとは](./introduction/README.md) {#introduction}

JavaScriptとはどのような用途に使われているプログラミング言語なのか、どのような言語的な特性を持っているのかについて簡単に紹介します。

### [コメント](./comments/README.md) {#comments}

JavaScriptにおけるコメントの書き方を紹介します。コメントはプログラムとして評価されないので、ソースコードに対する説明を書くために利用します。

### [変数と宣言](./variables/README.md) {#variables}

JavaScriptで変数を宣言する方法について紹介します。変数を宣言する方法にはconst, let, varがあります。これらの動作の違いや使い分けについて紹介します。

### [値の評価と表示](./read-eval-print/README.md) {#read-eval-print}

ブラウザでJavaScriptコードを実行する方法について紹介します。またプログラムを実行すると遭遇するエラーをどのように解決していくかを紹介します。エラーを大きく2種類に分けて、構文エラーと実行時エラーについてそれぞれの問題点と解決の糸口を紹介します。

### [データ型とリテラル](./data-type/README.md) {#data-type}

JavaScriptの値の種類にあたるデータ型について紹介します。データ型には大きく分けてプリミティブ型とオブジェクトがあり、それぞれのデータ型を簡単なコード例とともに紹介していきます。一部のデータ型にはリテラルというデータ型を簡単に記述するための構文が用意されており、リテラルについても合わせて紹介していきます。

### [演算子](./operator/README.md) {#operator}

JavaScriptにおける演算子について紹介します。演算子は記号で表現されるため、検索しにくいです。この章では主要な演算子をまとめて紹介しています。知らない演算子が出てきたときに読み直せばよいため、すべてを1つずつ読む必要はありません。

### [暗黙的な型変換](./implicit-coercion/README.md) {#implicit-coercion}

JavaScriptの暗黙的な型変換は意図しない挙動を発生する原因の1つです。暗黙的な型変換が発生する具体的なコード例や予測が難しいことについて紹介します。逆に明示的に変換する方法についても紹介します。

### [関数と宣言](./function-declaration/README.md) {#function-declaration}

JavaScriptの関数を定義する方法について紹介します。関数やメソッドを定義する方法として関数宣言、関数式、Arrow Functionについて紹介します。また関数の引数の扱い方や関数とメソッドの違いについても紹介します。

### [文と式](./statement-expression/README.md) {#statement-expression}

JavaScriptのソースコードを構成する文と式という構文的な概念について紹介します。文と式の違いを理解することで、どの場合にセミコロンを入れるかがわかるようになります。抽象的な話が多くなるため、完全に理解しなくても問題はありません。

### [条件分岐](./condition/README.md) {#condition}

JavaScriptで条件分岐を扱うためのif文やswitch文を紹介します。またネストした条件分岐が読みやすさを妨げる問題をどのように解決するかについて紹介します。

### [ループと反復処理](./loop/README.md) {#loop}

for文やwhile文を使った反復処理について紹介します。また、同等の反復処理がArrayのメソッドでも実現できることについても紹介します。

### [オブジェクト](./object/README.md) {#object}

JavaScriptのObjectはオブジェクトの基礎となるものです。オブジェクトとプロパティの作成、更新、削除などの基本的な操作について紹介します。

### [プロトタイプオブジェクト](./prototype-object/README.md) {#prototype-object}

JavaScriptにはプロトタイプオブジェクトという特殊なオブジェクトがあります。プロトタイプオブジェクトによって、メソッドなどの特性をあるオブジェクトから別のオブジェクトへと継承しています。このプロトタイプオブジェクトによる継承の動きを紹介します。

### [配列](./array/README.md) {#array}

配列は値を順番に格納できるオブジェクトです。この配列の作成、更新、削除などの基本的な操作や実際の使い方について紹介します。また配列における破壊的なメソッドと非破壊的メソッドの違いについても紹介します。

### [文字列](./string/README.md) {#string}

文字列リテラルを使った文字列の作成から検索や置換など基本的な文字列操作について紹介します。また正規表現と組み合わせた文字列操作やタグ付きテンプレート関数を使ったテンプレート処理などについても紹介します。

### [文字列とUnicode](./string-unicode/README.md) {#string-unicode}

JavaScriptが採用している文字コードであるUnicodeと関連するStringのメソッドについて紹介します。Stringのメソッドや文字列を扱う上で、UTF-16でエンコードされていることを意識する場面について紹介します。

### [ラッパーオブジェクト](./wrapper-object/README.md) {#wrapper-object}

JavaScriptのプリミティブ型の値がビルトインオブジェクトのメソッドなどを呼び出せる仕組みとしてのラッパーオブジェクトを紹介します。プリミティブ型からオブジェクトへとどのように実行時に変換されているのかを確認できます。

### [関数とスコープ](./function-scope/README.md) {#function-scope}

スコープという変数などを参照できる範囲を決める概念を紹介します。ブロックスコープや関数スコープなどがどのような働きをしているのかや複数のスコープが重なったときにどのように変数の参照先が決まるのかを紹介します。また、スコープに関係する動作としてクロージャーという性質を紹介します。

### [関数とthis](./function-this/README.md) {#function-this}

JavaScriptにおける`this`というキーワードの動作を紹介します。`this`の参照先は条件によって解決方法が異なるため、`this`の動きについてをそれぞれの条件ごとに紹介します。一見複雑な`this`の動きを予測可能にするにはどうするべきかをコード例とともに紹介します。

### [クラス](./class/README.md) {#class}

JavaScriptにおけるクラスの定義方法や継承方法を紹介します。プロトタイプベースの言語であるJavaScriptがどのように継承などを実現しているのかを紹介します。

### [例外処理](./error-try-catch/README.md) {#error-try-catch}

JavaScriptにおける例外処理について紹介します。try...catch構文の使い方やErrorオブジェクトを紹介します。またエラーが発生した際のエラー文の読み方といったデバッグ方法を紹介します。

### [非同期処理:コールバック/Promise/Async Function](./async/README.md) {#async}

JavaScriptにおける非同期処理について紹介します。同期処理と非同期処理の違いやなぜ非同期処理が重要になるかを紹介します。非同期処理を行う方法としてコールバックスタイル、Promise、Async Functionを紹介します。

### [Map/Set](./map-and-set/README.md) {#map-and-set}

データの集合を扱うビルトインオブジェクトであるMapとSetについて紹介します。オブジェクトの作成方法や更新方法から実際にどのようなケースで使うのかを紹介します。

### [JSON](./json/README.md) {#json}

JavaScriptのオブジェクトリテラルをベースに作られたデータフォーマットであるJSONを紹介します。また、JavaScriptからJSONの読み書きをするビルトインオブジェクトの使い方を紹介します。

### [Date](./date/README.md) {#date}

日付や時刻を扱うビルトインオブジェクトのDateを紹介します。

### [Math](./math/README.md) {#math}

数学的な定数や関数を提供するビルトインオブジェクトのMathを紹介します。

### [ECMAScriptモジュール](./module/README.md) {#module}

JavaScriptのモジュール（ECMAScriptモジュール）について紹介します。

### [ECMAScript](./ecmascript/README.md) {#ecmascript}

JavaScriptの仕様であるECMAScriptについて紹介します。ECMAScriptの歴史や仕様策定がどのようなプロセスで行われているかを紹介します。

### [第一部: 終わりに](./other-parts/README.md) {#other-parts}

第一部の終わりに書籍では紹介しなかったその他の文法やビルトインオブジェクトを簡単に紹介します。また、知らなかった文法やビルトインオブジェクトの使い方を調べる方法を紹介します。
