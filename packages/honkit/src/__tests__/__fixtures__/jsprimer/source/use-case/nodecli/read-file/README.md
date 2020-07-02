---
author: laco 
description: "Node.jsの`fs`モジュールを使ったファイルの読み込みについて学びます。"
---

# ファイルを読み込む {#read-file}

前のセクションではコマンドライン引数からファイルパスを取得して利用できるようになりました。
このセクションでは渡されたファイルパスを元にMarkdownファイルを読み込んで、標準出力に表示してみましょう。

## `fs`モジュールを使ってファイルを読み込む {#read-file-by-fs}

前のセクションで取得できるようになったファイルパスを元に、ファイルを読み込みましょう。
Node.jsでファイルの読み書きを行うには、標準モジュールの[`fs`モジュール][]を使います。
まずは読み込む対象のファイルを作成しましょう。`sample.md`という名前で`main.js`と同じ`nodecli`ディレクトリに配置します。

[import title:"sample.md"](src/sample.md)

### `fs`モジュール {#fs-module}

`fs`モジュールは、Node.jsでファイルの読み書きを行うための基本的な関数を提供するモジュールです。
`fs`モジュールのメソッドとして非同期形式と同期形式の両方が提供されています。

非同期形式の関数は常にコールバック関数を受け取ります。 
コールバック関数の第一引数は必ずその処理で発生したエラーオブジェクトになり、残りの引数は処理の戻り値となります。
処理が成功したときには、第一引数は`null`または`undefined`になります。
一方、同期形式の関数が処理に失敗したときは例外を発生させるので、`try...catch`構文によって例外処理を行えます。

次のサンプルコードは、指定したファイルを読み込む非同期形式の`readFile`メソッドの例です。

<!-- doctest:disable -->
```js
const fs = require("fs");

fs.readFile("sample.md", (err, file) => {
    if (err) {
        console.error(err);
    } else {
        console.log(file);
    }
});
```

そして、次のサンプルコードは、同じく指定したファイルを読み込む同期形式`readFileSync`メソッドの例です。

<!-- doctest:disable -->
```js
const fs = require("fs");

try {
    const file = fs.readFileSync("sample.md");
} catch (err) { 
    // ファイルが読み込めないなどのエラーが発生したときに呼ばれる
}
```

Node.jsはシングルスレッドなので、他の処理をブロックしにくい非同期形式のAPIを選ぶことがほとんどです。
Node.jsには`fs`モジュール以外にも多くの非同期APIがあるので、非同期処理に慣れておきましょう。

### readFile関数を使う {#use-readFile}

それでは`fs`モジュールの`readFile`メソッドを使って`sample.md`ファイルを読み込んでみましょう。
次のように`main.js`を変更し、コマンドライン引数から取得したファイルパスを元にファイルを読み込んでコンソールに出力します。

[import title:"main.js"](src/main-1.js)

`sample.md`を引数に渡した実行結果は次のようになります。
文字列になっていないのは、コールバック関数の第二引数はファイルの中身を表す`Buffer`インスタンスだからです。
`Buffer`インスタンスはファイルの中身をバイト列として保持しています。
そのため、そのまま`console.log`メソッドに渡しても人間が読める文字列にはなりません。

```shell-session
$ node main.js sample.md
<Buffer 23 20 73 61 6d 70 6c 65>
```

`fs.readFile`関数は引数によってファイルの読み込み方を指定できます。
ファイルのエンコードを第二引数であらかじめ指定しておけば、自動的に文字列に変換された状態でコールバック関数に渡されます。
次のように`main.js`を変更し、読み込まれるファイルをUTF-8として変換させます。

[import title:"main.js"](src/main-2.js)

先ほどと同じコマンドをもう一度実行すると、実行結果は次のようになります。
`sample.md`ファイルの中身を文字列として出力できました。

```shell-session
$ node main.js sample.md
# sample
```

### エラーハンドリング {#error-handling}

先ほどの例では触れませんでしたが、`fs`モジュールのコールバック関数の第一引数には常にエラーオブジェクトが渡されます。
ファイルの読み書きは存在の有無や権限、ファイルシステムの違いなどによって例外が発生しやすいので、必ずエラーハンドリング処理を書きましょう。

次のように`main.js`を変更し、`err`オブジェクトが`null`または`undefined`ではないことだけをチェックするシンプルなエラーハンドリングです。
エラーが発生していたときにはエラーメッセージを表示し、`process.exit`関数に終了ステータスを指定してプロセスを終了しています。
ここでは、一般的なエラーを表す終了ステータスの`1`でプロセスを終了しています。

[import title:"main.js"](src/main-3.js)

存在しないファイルである`notfound.md`をコマンドライン引数に渡して実行すると、次のようにエラーが発生して終了します。

```shell-session
$ node main.js notfound.md
ENOENT: no such file or directory, open 'notfound.md'
```

これでコマンドライン引数に指定したファイルを読み込んで標準出力に表示できました。
次のセクションでは読み込んだMarkdownファイルをHTMLに変換する処理を追加していきます。

## このセクションのチェックリスト {#section-checklist}

- `fs`モジュールの`readFile`関数を使ってファイルを読み込んだ
- UTF-8形式のファイルの中身をコンソールに出力した
- `readFile`関数の呼び出しにエラーハンドリング処理を記述した

[`fs`モジュール]: https://nodejs.org/api/fs.html
[Buffer]: https://nodejs.org/api/buffer.html
