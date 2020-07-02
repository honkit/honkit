---
author: laco 
description: "ユニットテストの導入とソースコードのモジュール化を行います。"
---

# ユニットテストを記述する {#unit-test}

このセクションでは、これまで作成したCLIアプリケーションにユニットテストを導入します。
ユニットテストの導入と合わせて、ソースコードを整理してテストがしやすくなるようにモジュール化します。

前のセクションまでは、すべての処理をひとつのJavaScriptファイルに記述していました。
ユニットテストを行うためにはテスト対象がモジュールとして分割されていなければいけません。
今回のアプリケーションでは、CLIアプリケーションとしてコマンドライン引数を処理する部分と、MarkdownをHTMLへ変換する部分に分割します。

## CommonJSでのモジュール化 {#commonjs-module}

実際にアプリケーションのモジュール化をする前に、CommonJSでのモジュール化について簡単に振り返ります。

Node.jsでは、複数のJavaScriptファイル間で変数や関数などをやり取りするために、CommonJSモジュールという仕組みを利用します。
CommonJSモジュールからオブジェクトをエクスポートするには、Node.jsのグローバル変数である[moduleオブジェクト][]を利用します。
`module.exports`オブジェクトは、そのファイルからエクスポートされるオブジェクトを格納します。

次の`greet.js`というファイルは、`greet`関数をエクスポートするモジュールの例です。

[import, title:"greet.js"](src/example/greet.js)

`require`関数を使って、指定したファイルパスのJavaScriptファイルをモジュールとしてインポートできます。
次のコードでは先ほどの`greet.js`のパスを指定してモジュールとしてインポートして、エクスポートされた関数を取得しています。

[import, title:"greet-main.js"](src/example/greet-main.js)

`module.exports`オブジェクトそのものに代入するのではなく、`module.exports`オブジェクトのプロパティに代入することでも任意の値をエクスポートできます。
次の`functions.js`というファイルでは、`foo`と`bar`の2つの関数を同じファイルからエクスポートしています。

[import, title:"functions.js"](src/example/functions.js)

このようにエクスポートされたオブジェクトは、`require`関数の戻り値であるオブジェクトのプロパティとしてアクセスできます。
次のコードでは先ほどの`functions.js`をインポートして取得したオブジェクトから`foo`と`bar`関数をプロパティとして取得しています。

[import, title:"functions-main.js"](src/example/functions-main.js)

## アプリケーションをモジュールに分割する {#split-script}

それではCLIアプリケーションのソースコードをモジュールに分割してみましょう。
`md2html.js`という名前のJavaScriptファイルを作成し、次のようにmarkedを使ったMarkdownの変換処理を記述します。

[import title:"md2html.js"](./src/md2html.js)

このモジュールがエクスポートするのは、与えられたオプションを元にMarkdown文字列をHTMLに変換する関数です。
アプリケーションのエントリーポイントである`main.js`では、次のようにこのモジュールをインポートして使用します。

[import title:"main.js"](./src/main.js)

markedパッケージや、そのオプションに関する記述がひとつの`md2html`関数に隠蔽され、`main.js`がシンプルになりました。
そして`md2html.js`はアプリケーションから独立したひとつのモジュールとして切り出され、ユニットテストが可能になりました。

## ユニットテスト実行環境を作る {#create-env}

ユニットテストの実行にはさまざまな方法があります。
このセクションではテスティングフレームワークとして[Mocha][]を使って、ユニットテストの実行環境を作成します。
Mochaが提供するテスト実行環境では、グローバルに`it`や`describe`などの関数が定義されます。
`it`関数はその内部でエラーが発生したとき、そのテストを失敗として扱います。
つまり、期待する結果と異なるならエラーを投げ、期待どおりならエラーを投げないというテストコードを書くことになります。

今回はNode.jsの標準モジュールのひとつである[assertモジュール][]から提供される`assert.strictEqual`メソッドを利用します。
`assert.strictEqual`メソッドは第一引数と第二引数の評価結果が`===`で比較して異なる場合に、例外を投げる関数です。

Mochaによるテスト環境を作るために、まずは次のコマンドで`mocha`パッケージをインストールします。

```shell-session
$ npm install --save-dev mocha@7
```

`--save-dev`オプションは、パッケージを`devDependencies`としてインストールするためのものです。
`package.json`の`devDependencies`には、そのパッケージを開発するときだけ必要な依存ライブラリを記述します。

ユニットテストを実行するには、Mochaが提供する`mocha`コマンドを使います。
Mochaをインストールした後、`package.json`の`scripts`プロパティを次のように記述します。

```json
{
    ...
    "scripts": {
        "test": "mocha test/"
    },
    ...
}
```

この記述により、`npm test`コマンドを実行すると、`mocha`コマンドで`test/`ディレクトリにあるテストファイルを実行します。
試しに`npm test`コマンドを実行し、Mochaによるテストが行われることを確認しましょう。
まだテストファイルを作っていないので、`Error: No test files found`というエラーが表示されます。

```shell-session
$ npm test
> mocha

 Error: No test files found
```

## ユニットテストを記述する {#write-unit-test}

テストの実行環境ができたので、実際にユニットテストを記述します。
Mochaのユニットテストは`test`ディレクトリの中にJavaScriptファイルを配置して記述します。
`test/md2html-test.js`ファイルを作成し、`md2html.js`に対するユニットテストを次のように記述します。

[import test/md2html-test.js](./src/test/md2html-test.js)

`it`関数で定義したユニットテストは、`md2html`関数の変換結果が期待するものになっているかをテストしています。
`test/fixtures`ディレクトリにはユニットテストで用いるファイルを配置しています。
今回は変換元のMarkdownファイルと、期待する変換結果のHTMLファイルが存在します。

次のように変換元のMarkdownファイルを`test/fixtures/sample.md`に配置します。

[import, title:"test/fixtures/sample.md"](./src/test/fixtures/sample.md)

そして、期待する変換結果のHTMLファイルも`test/fixtures`ディレクトリに配置します。
`gfm`オプションの有無にあわせて、`expected.html`と`expected-gfm.html`の2つを次のように作成しましょう。

[import, title:"test/fixtures/expected.html"](./src/test/fixtures/expected.html)

[import, title:"test/fixtures/expected-gfm.html"](./src/test/fixtures/expected-gfm.html)

ユニットテストの準備ができたら、もう一度改めて`npm test`コマンドを実行しましょう。1件のテストが通れば成功です。

```shell-session
$ npm test
> mocha

  ✓ converts Markdown to HTML
  ✓ converts Markdown to HTML (GFM=true)

  2 passing (31ms)
```

ユニットテストが通らなかった場合は、次のことを確認してみましょう。

- `test/fixtures`ディレクトリに`sample.md`と`expected.html`、`expected-gfm.html`というファイルを作成したか
- それぞれのファイルは文字コードがUTF-8で、改行コードがLFになっているか
- それぞれのファイルの末尾に余計な改行文字が入っていないか

## なぜユニットテストを行うのか {#reason-for-unit-test}

ユニットテストを実施することには多くの利点があります。
早期にバグが発見できることや、安心してリファクタリングを行えるようになるのはもちろんですが、
ユニットテストが可能な状態を保つこと自体に意味があります。
実際にテストを行わなくてもテストしやすいコードになるよう心がけることが、アプリケーションを適切にモジュール化する指針になります。

またユニットテストには生きたドキュメントとしての側面もあります。
ドキュメントはこまめにメンテナンスされないとすぐに実際のコードと齟齬が生まれてしまいますが、
ユニットテストはそのモジュールが満たすべき仕様を表すドキュメントとして機能します。

ユニットテストの記述は手間がかかるだけのようにも思えますが、
中長期的にアプリケーションをメンテナンスする場合にはかかせないものです。
そしてよいテストを書くためには、日頃からテストを書く習慣をつけておくことが重要です。

## まとめ {#unit-test-summary}

このユースケースの目標であるNode.jsを使ったCLIアプリケーションの作成と、ユニットテストの導入ができました。
npmを使ったパッケージ管理や外部モジュールの利用、`fs`モジュールを使ったファイル操作など、多くの要素が登場しました。
これらはNode.jsアプリケーション開発においてほとんどのユースケースで応用されるものなので、よく理解しておきましょう。

## このセクションのチェックリスト {#section-checklist}

- Markdownの変換処理をCommonJSモジュールとして`md2html.js`に切り出し、`main.js`から読み込んだ
- mochaパッケージをインストールし、`npm test`コマンドで`mocha`コマンドを実行できることを確認した
- `md2html`関数のユニットテストを作成し、テストの実行結果を確認した

[moduleオブジェクト]: https://nodejs.org/api/modules.html#modules_the_module_object
[Mocha]: https://mochajs.org/
[assertモジュール]: https://nodejs.org/api/assert.html
