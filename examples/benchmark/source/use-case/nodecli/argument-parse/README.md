---
author: laco 
description: "コマンドライン引数を受け取り、アプリケーションから使いやすい形にパースする方法を学びます。"
---

# コマンドライン引数を処理する {#processing-commandline-args}

このユースケースで作成するCLIアプリケーションの目的は、コマンドライン引数として与えられたファイルを変換することです。
このセクションではコマンドライン引数を受け取って、それをパースするところまでを行います。

## `process`オブジェクトとコマンドライン引数 {#process-object-and-commandline-args}

コマンドライン引数を扱う前に、まずは`process`オブジェクトについて触れておきます。
`process`オブジェクトはNode.js実行環境のグローバル変数のひとつです。
`process`オブジェクトが提供するのは、現在のNode.jsの実行プロセスについて、情報の取得と操作をするAPIです。
詳細は[公式ドキュメント](https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process)を参照してください。

コマンドライン引数へのアクセスを提供するのは、`process`オブジェクトの`argv`プロパティで、文字列の配列になっています。
次のように`main.js`を変更し、`process.argv`をコンソールに出力しましょう。

[import title:"main.js"](src/main-1.js)

このスクリプトを次のようにコマンドライン引数をつけて実行してみましょう。

```shell-session
$ node main.js one two=three four
```

このコマンドの実行結果は次のようになります。

```
[ 
  '/usr/local/bin/node', // Node.jsの実行プロセスのパス
  '/Users/laco/nodecli/main.js', // 実行したスクリプトファイルのパス
  'one', // 1番目の引数
  'two=three', // 2番目
  'four'  // 3番目
]
```

1番目と2番目の要素は常に`node`コマンドと実行されたスクリプトのファイルパスになります。
つまりアプリケーションがコマンドライン引数として使うのは、3番目以降の要素です。

## コマンドライン引数をパースする {#parse-args}

`process.argv`配列を使えばコマンドライン引数を取得できますが、取得できる情報にはアプリケーションに不要なものも含まれています。
また、文字列の配列として渡されるため、フラグのオンオフのような真偽値を受け取るときにも不便です。
そのため、アプリケーションでコマンドライン引数を扱うときには、一度パースして扱いやすい値に整形するのが一般的です。

今回は[commander][]というライブラリを使ってコマンドライン引数をパースしてみましょう。
文字列処理を自前で行うこともできますが、このような一般的な処理は既存のライブラリを使うと簡単に書けます。

### `commander`パッケージをインストールする {#install-commander}

commanderは[npm][]の`npm install`コマンドを使ってインストールできます。
まだnpmの実行環境を用意できていなければ、先に「[アプリケーション開発の準備][]」の章を参照してください。

npmでパッケージをインストールする前に、まずは`pacakge.json`というファイルを作成します。
`package.json`とは、アプリケーションが依存するパッケージの種類やバージョンなどの情報を記録するJSON形式のファイルです。
`package.json`ファイルのひな形は、`npm init`コマンドで生成できます。
通常は対話式のプロンプトによって情報を設定しますが、ここではすべてデフォルト値で`pacakge.json`を作成する`--yes`オプションを付与します。

`nodecli`のディレクトリ内で、`npm init --yes`コマンドを実行して`pacakge.json`を作成しましょう。

```shell-session
$ npm init --yes
```

生成された`package.json`ファイルは次のようになっています。

[import, title:"package.json"](src/package.init.json)

`package.json`ファイルが用意できたら、`npm install`コマンドを使って`commander`パッケージをインストールします。
このコマンドの引数にはインストールするパッケージの名前とそのバージョンを`@`記号でつなげて指定できます。
バージョンを指定せずにインストールすれば、その時点での最新の安定版が自動的に選択されます。
次のコマンドを実行して、commanderのバージョン5.0をインストールします。[^1]

```shell-session
$ npm install commander@5.0
```

インストールが完了すると、`package.json`ファイルは次のようになっています。

[import, title:"package.json"](src/package.json)

また、npmのバージョンが5以上であれば `package-lock.json`ファイルが生成されています。
このファイルはnpmがインストールしたパッケージの、実際のバージョンを記録するためのものです。
先ほどcommanderのバージョンを`5.0`としましたが、実際にインストールされるのは`5.0.x`に一致する最新のバージョンです。
`package-lock.json`ファイルには実際にインストールされたバージョンが記録されています。
これによって、再び`npm install`を実行したときに、異なるバージョンがインストールされるのを防ぎます。

### CommonJSモジュール {#commonjs-module}

インストールした`commander`パッケージを使う前に、**CommonJSモジュール**のことを知っておきましょう。
[CommonJSモジュール][]とは、[Node.js][]環境で利用されているJavaScriptのモジュール化の仕組みです。
CommonJSモジュールは基本文法で学んだ[ECMAScriptモジュール][]の仕様が策定されるより前からNode.jsで使われています。
Node.jsの標準パッケージやnpmで配布されるパッケージは、CommonJSモジュールとして提供されていることがほとんどです。
先ほどインストールした`commander`パッケージも、CommonJSモジュールとして利用できます。

CommonJSモジュールはNode.jsのグローバル変数である`module`変数を使って変数や関数などをエクスポートします。
CommonJSモジュールでは`module.exports`プロパティに代入されたオブジェクトが、そのJavaScriptファイルからエクスポートされます。
複数の名前つきエクスポートが可能なES Moduleとは異なり、CommonJSでは`module.exports`プロパティの値だけがエクスポートの対象です。

次の例では、`my-module.js`というファイルを作成し、`module.exports`でオブジェクトをエクスポートしています。

[import, title:"my-module.js"](src/my-module.js)

このCommonJSモジュールをインポートするには、Node.js実行環境のグローバル関数である[require関数][]を使います。
次のように`require`関数にインポートしたいモジュールのファイルパスを渡し、戻り値としてエクスポートされた値をインポートできます。
インポートするファイルパスに拡張子が必須なES Moduleとは異なり、CommonJSの`require`関数では拡張子である`.js`が省略可能です。

[import](src/cjs-import.js)

また、`require`関数は相対パスや絶対パス以外にもnpmでインストールしたパッケージ名を指定できます。
`npm install`コマンドでインストールされたパッケージは、`node_modules`というディレクトリの中に配置されています。
`require`関数にインストールしたパッケージ名を指定することで、`node_modules`ディレクトリに配置されたパッケージを読み込めます。

次の例では、先ほどインストールした`commander`パッケージを`node_modules`ディレクトリから読み込んでいます。

<!-- doctest:disable -->
```js
const program = require("commander");
```

このユースケースで今後登場するモジュールはすべてCommonJSモジュールです。
Node.jsではES Moduleもサポートされる予定ですが、現在はまだ安定した機能としてサポートされていません。

### コマンドライン引数からファイルパスを取得する {#get-file-path}

先ほどインストールした`commander`パッケージを使って、コマンドライン引数として渡されたファイルパスを取得しましょう。
このCLIアプリケーションでは、処理の対象とするファイルパスを次のようなコマンドの形式で受け取ります。

```shell-session
$ node main.js ./sample.md
```

commanderでコマンドライン引数をパースするためには、`parse`メソッドにコマンドライン引数を渡します。

<!-- doctest:disable -->
```js
// commanderモジュールをprogramオブジェクトとしてインポートする
const program = require("commander");
// コマンドライン引数をパースする
program.parse(process.argv);
```

`parse`メソッドを呼び出すと、コマンドライン引数をパースした結果を`program`オブジェクトから取り出せるようになります。
今回の例では、ファイルパスは`program.args`配列に格納されています。
`program.args`配列には`--key=value`のようなオプションや`--flag`のようなフラグを取り除いた残りのコマンドライン引数が順番に格納されています。

それでは`main.js`を次のように変更し、コマンドライン引数で渡されたファイルパスを取得しましょう。

[import title:"main.js"](src/main-2.js)

次のコマンドを実行すると、`program.args`配列に格納された`./sample.md`文字列が取得されてコンソールに出力されます。
`./sample.md`は`process.argv`配列では3番目に存在していましたが、パース後の`program.args`配列では1番目になって扱いやすくなっています。

```shell-session
$ node main.js ./sample.md
./sample.md
```

このように、`process.argv`配列を直接扱うよりも、commanderのようなライブラリを使うことで宣言的にコマンドライン引数を定義して処理できます。
次のセクションではコマンドライン引数から取得したファイルパスを元に、ファイルを読み込む処理を追加していきます。

## このセクションのチェックリスト {#section-checklist}

- `process.argv`配列に`node`コマンドのコマンドライン引数が格納されていることを確認した
- npmを使ってパッケージをインストールする方法を理解した
- `require`関数を使ってパッケージのモジュールを読み込めることを確認した
- commanderを使ってコマンドライン引数をパースできることを確認した
- コマンドライン引数で渡されたファイルパスを取得してコンソールに出力できた

[commander]: https://github.com/tj/commander.js/
[npm]: https://www.npmjs.com/
[npmのGitHubリポジトリ]: https://github.com/npm/npm
[CommonJSモジュール]: https://nodejs.org/docs/latest/api/modules.html
[Node.js]: https://nodejs.org/ja/
[require関数]: https://nodejs.org/dist/latest-v12.x/docs/api/modules.html#modules_loading_from_node_modules_folders
[アプリケーション開発の準備]: ../../setup-local-env/README.md
[ECMAScriptモジュール]: ../../../basic/module/README.md
[^1]: --saveオプションをつけてインストールしたのと同じ意味。npm 5.0.0からは--saveがデフォルトオプションとなりました。
