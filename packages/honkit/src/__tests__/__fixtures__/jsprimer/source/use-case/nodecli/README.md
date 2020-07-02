---
author: laco 
description: "Node.jsでCLI（コマンドラインインターフェース）アプリケーションを開発する例として、MarkdownをHTMLに変換するツールを作成していきます。また、Node.jsやnpmの使い方を紹介します。"
---

# ユースケース: Node.jsでCLIアプリケーション {#node-cli}

ここではNode.jsでCLI（コマンドラインインターフェース）アプリケーションを開発します。
CLIのユースケースとしてMarkdown形式のテキストファイルをHTMLテキストに変換するツールを作成します。

作成するアプリケーションは次の要件を満たすものとします。

- コマンドライン引数として変換対象のファイルパスを受け取る
- Markdown形式のファイルを読み込み、変換したHTMLを標準出力に表示する
- 変換の設定をコマンドライン引数でオプションとして与えられる

## 目次 {#summary}

### [Node.jsでHello World](./helloworld/README.md) {#helloworld}

Hello Worldアプリケーションを通じてNode.jsのCLIアプリケーションの基本を学びます。

### [コマンドライン引数を処理する](./argument-parse/README.md) {#argument-parse}

コマンドライン引数を受け取り、アプリケーションから使いやすい形にパースする方法を学びます。

### [ファイルを読み込む](./read-file/README.md) {#read-file}

Node.jsの`fs`モジュールを使ったファイルの読み込みについて学びます。

### [MarkdownをHTMLに変換する](./md-to-html/README.md) {#md-to-html}

markedパッケージを使ってMarkdownファイルをHTMLに変換します。

### [ユニットテストを記述する](./refactor-and-unittest/README.md) {#refactor-and-unittest}

ユニットテストの導入とソースコードのモジュール化を行います。
