---
author: laco 
description: "markedパッケージを使ってMarkdownファイルをHTMLに変換します。"
---

# MarkdownをHTMLに変換する {#md-to-html}

前のセクションではコマンドライン引数で受け取ったファイルを読み込み、標準出力に表示しました。
次は読み込んだMarkdownファイルをHTMLに変換して、その結果を標準出力に表示してみましょう。

## markedパッケージを使う {#use-marked-package}

JavaScriptでMarkdownをHTMLへ変換するために、今回は[marked][]というライブラリを使用します。
markedのパッケージはnpmで配布されているので、commanderと同様に`npm install`コマンドでパッケージをインストールしましょう。

```shell-session
$ npm install --save marked@0.8.0
```

インストールが完了したら、Node.jsのスクリプトから読み込みます。
前のセクションの最後で書いたスクリプトに、markedパッケージの読み込み処理を追加しましょう。
次のように`main.js`を変更し、読み込んだMarkdownファイルをmarkedを使ってHTMLに変換します。
markedパッケージをインポートした`marked`関数は、Markdown文字列を引数にとり、HTML文字列に変換して返します。

[import title:"main.js"](src/main-1.js)

## 変換オプションを作成する {#create-convert-option}

markedにはMarkdownの[変換オプション][]があり、オプションの設定によって変換後のHTMLが変化します。
そこで、アプリケーション中でオプションのデフォルト値を決め、さらにコマンドライン引数から設定を切り替えられるようにしてみましょう。

今回のアプリケーションでは、例として`gfm`というmarkedのオプションを扱います。

### gfmオプション {#gfm-option}

`gfm`オプションは、GitHubにおけるMarkdownの仕様（[GitHub Flavored Markdown][], GFM）に合わせて変換するかを決めるオプションです。
markedではこの`gfm`オプションがデフォルトで`true`になっています。GFMは標準的なMarkdownにいくつかの拡張を加えたもので、代表的な拡張がURLの自動リンク化です。
次のように`sample.md`を変更し、先ほどのスクリプトと`gfm`オプションを`false`にしたスクリプトで結果の違いを見てみましょう。

[import, title:"sample.md"](src/sample.md)

`gfm`オプションが有効のときは、URLの文字列が自動的に`<a>`タグのリンクに置き換わります。

```html
<h1 id="サンプルファイル">サンプルファイル</h1>
<p>これはサンプルです。
<a href="https://jsprimer.net/">https://jsprimer.net/</a></p>
<ul>
<li>サンプル1</li>
<li>サンプル2</li>
</ul>
```

一方、次のように`gfm`オプションを`false`にすると、単なる文字列として扱われ、リンクには置き換わりません。

[import title:"main.js"](src/main-2.js)

```html
<h1 id="サンプルファイル">サンプルファイル</h1>
<p>これはサンプルです。
https://jsprimer.net/</p>
<ul>
<li>サンプル1</li>
<li>サンプル2</li>
</ul>
```

自動リンクのほかにもいくつかの拡張がありますが、詳しくは[GitHub Flavored Markdown][]のドキュメントを参照してください。

### コマンドライン引数からオプションを受け取る {#receive-option}

次に、`gfm`オプションをコマンドライン引数で制御できるようにしましょう。
アプリケーションのデフォルトでは`gfm`オプションを無効にした上で、次のように`--gfm`オプションを付与してコマンドを実行できるようにします。

```shell-session
$ node main.js --gfm sample.md
```

コマンドライン引数で`--gfm`のようなオプションを扱いたいときには、commanderの`option`メソッドを使います。
次のように必要なオプションを定義してからコマンドライン引数をパースすると、`program.opts`メソッドでパース結果のオブジェクトを取得できます。

<!-- 差分コードなので -->
<!-- doctest:disable -->
```js
// gfmオプションを定義する
program.option("--gfm", "GFMを有効にする");
// コマンドライン引数をパースする
program.parse(process.argv);
// オプションのパース結果をオブジェクトとして取得する
const options = program.opts();
console.log(options.gfm);
```

`--gfm`オプションはファイルパスを指定する`sample.md`の前後のどちらについていても動作します。
なぜなら`program.args`配列には`program.option`メソッドで定義したオプションが含まれないためです。
`process.argv`配列を直接使っているとこのようなオプションの処理が面倒なので、commanderのようなパース処理を挟むのが一般的です。

### デフォルト設定を定義する {#declare-default}

アプリケーション側でデフォルト設定を持っておくことで、将来的にmarkedの挙動が変わったときにも影響を受けにくくなります。
次のようにデフォルトのオプションを表現したオブジェクトに対して、`program.opts`メソッドの戻り値で上書きしましょう。
オブジェクトのデフォルト値を別のオブジェクトで上書きするときには`...`（spread構文）を使うと便利です（[オブジェクトのspread構文][]を参照）。

<!-- 差分コードなので -->
<!-- doctest:disable -->
```js
// コマンドライン引数のオプションを取得し、デフォルトのオプションを上書きする
const cliOptions = {
    gfm: false,
    ...program.opts(),
};
```

こうして作成した`cliOptions`オブジェクトから、markedにオプションを渡しましょう。
`main.js`の全体は次のようになります。

[import title:"main.js"](src/main-3.js)

定義したコマンドライン引数を使って、Markdownファイルを変換してみましょう。

```shell-session
$ node main.js sample.md
<h1 id="サンプルファイル">サンプルファイル</h1>
<p>これはサンプルです。
https://jsprimer.net/</p>
<ul>
<li>サンプル1</li>
<li>サンプル2</li>
</ul>
```

また、`gfm`オプションを付与して実行すると次のように出力されるはずです。

```shell-session
$ node main.js --gfm sample.md 
<h1 id="サンプルファイル">サンプルファイル</h1>
<p>これはサンプルです。
<a href="https://jsprimer.net/">https://jsprimer.net/</a></p>
<ul>
<li>サンプル1</li>
<li>サンプル2</li>
</ul>
```

これでMarkdown変換の設定をコマンドライン引数でオプションとして与えられるようになりました。
次のセクションではアプリケーションのコードを整理し、最後にユニットテストを導入します。

## このセクションのチェックリスト {#section-checklist}

- markedパッケージを使ってMarkdown文字列をHTML文字列に変換した
- コマンドライン引数でmarkedの変換オプションを設定した
- デフォルトオプションを定義し、コマンドライン引数で上書きできるようにした

[marked]: https://github.com/chjj/marked
[変換オプション]: https://marked.js.org/#/USING_ADVANCED.md#options
[GitHub Flavored Markdown]: https://github.github.com/gfm/
[オブジェクトのspread構文]: ../../../basic/object/README.md#object-spread-syntax
