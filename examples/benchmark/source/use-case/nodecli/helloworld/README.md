---
author: laco 
description: "Hello Worldアプリケーションを通じてNode.jsのCLIアプリケーションの基本を学びます。"
---

# Node.jsでHello World {#hello-world-by-nodejs}

実際にアプリケーションを作成する前に、まずはHello Worldアプリケーションを通じてNode.jsのCLIアプリケーションの基本を学びましょう。

## プロジェクトディレクトリの作成 {#create-project}

今回作成するNode.jsのCLIアプリケーションでは、JavaScriptやMarkdownなどのファイルを扱います。
そのため、まずそれらのファイルを置くためのディレクトリを作成します。

ここでは`nodecli`という名前で新しいディレクトリを作成します。
ここからは作成した`nodecli`ディレクトリ以下で作業していきます。

またこのプロジェクトで作成するファイルは、必ず文字コード（エンコーディング）を**UTF-8**、改行コードを**LF**にしてファイルを保存します。

## Hello World {#hello-world}

<!-- textlint-disable preset-ja-technical-writing/no-exclamation-question-mark -->

まずはNode.jsでHello Worldアプリケーションを作ってみましょう。
具体的には、実行すると標準出力に`"Hello World!"`という文字列を表示するCLIアプリケーションを記述します。
はじめに用意するのは、アプリケーションのエントリーポイントとなるJavaScriptファイルです。
`nodecli`ディレクトリに`main.js`という名前でファイルを作成し、次のように記述します。

[import, title:"main.js"](src/main.js)

ウェブブラウザの実行環境では、`console.log`メソッドの出力先はブラウザの開発者ツールのコンソールでした。
Node.js環境では、`console.log`メソッドの出力先は標準出力になります。
このコードは、標準出力に`"Hello World!"`という文字列を出力するものです。

<!-- textlint-enable preset-ja-technical-writing/no-exclamation-question-mark -->

JavaScriptのコードをNode.jsで実行するには、`node`コマンドを使用します。
コマンドラインで`nodecli`ディレクトリに移動し、次のコマンドでNode.jsを使い`main.js`を実行します。
まだ`node`コマンドの用意ができていなければ、先に「[アプリケーション開発の準備][]」の章を参照してください。

```shell-session
$ node main.js
Hello World!
```

Node.jsでは、エントリーポイントとなるJavaScriptファイルを作成し、そのファイルを`node`コマンドの引数に渡して実行するのが基本です。
また、ウェブブラウザのJavaScriptと同じく、コードは1行目から順に実行されます。

## Node.jsとブラウザのグローバルオブジェクト {#global-objects}

Node.jsはChromeと同じV8というJavaScriptエンジンを利用しています。
そのため、ECMAScriptで定義されている基本構文はブラウザと同じように使えます。
しかし、ブラウザ環境とNode.js環境では利用できるグローバルオブジェクトが違うため、アプリケーションを開発するときにはその違いを理解しなくてはなりません。

ECMAScriptで定義されているグローバルオブジェクトはブラウザとNode.jsどちらの環境にも存在します。
たとえば`Boolean`や`String`などのラッパーオブジェクト、`Map`や`Promise`のようなビルトインオブジェクトはどちらの環境にも存在します。

しかし、実行環境によって異なるオブジェクトもあります。
たとえばウェブブラウザ環境のグローバルオブジェクトは`window`オブジェクトですが、Node.jsでは[global][]と呼ばれるオブジェクトがグローバルオブジェクトになります。
ブラウザの`window`オブジェクトには、次のようなプロパティや関数があります。

- [document][]
- [XMLHttpRequest][]

一方、Node.jsの`global`オブジェクトには、たとえば次のようなプロパティや関数があります。

- [process][]
- [Buffer][]

それぞれのグローバルオブジェクトにあるプロパティなどは、同じ名前でグローバル変数や関数としてアクセスできます。
たとえば`window.document`プロパティは、グローバル変数の`document`としてもアクセスできます。

また、ECMAScriptで定義されたものではありませんが、ほぼ同等の機能と名前を持つプロパティや関数がブラウザとNode.jsのどちらにもある場合があります。
たとえば次のようなAPIは同等の機能を提供しますが、メソッドの種類や返り値が異なります。

- Console API
- `setTimeout`関数

これらを踏まえた上で、次のセクションからCLIアプリケーションの開発をはじめていきましょう。

## このセクションのチェックリスト {#section-checklist}

- `main.js`ファイルを作成した
- `node`コマンドで`main.js`を実行し、標準出力にログが出力されるのを確認した
- グローバルオブジェクトについて、ウェブブラウザとNode.jsで実行環境による違いがあることを理解した

[document]: https://developer.mozilla.org/ja/docs/Web/API/Document
[XMLHttpRequest]: https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest
[global]: https://nodejs.org/docs/latest-v12.x/api/globals.html
[process]: https://nodejs.org/docs/latest-v12.x/api/process.html#process_process
[Buffer]: https://nodejs.org/docs/latest-v12.x/api/buffer.html

[アプリケーション開発の準備]: ../../setup-local-env/README.md
