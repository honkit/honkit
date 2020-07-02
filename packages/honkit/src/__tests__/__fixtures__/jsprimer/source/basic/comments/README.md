---
author: azu
description: "JavaScriptにおけるコメントの書き方を紹介します。コメントはプログラムとして評価されないので、ソースコードに対する説明を書くために利用します。"
---

# コメント {#comment}

コメントはプログラムとして評価されないため、ソースコードの説明を書くために利用されています。
この書籍でも、JavaScriptのソースコードを解説するためにコメントを使っていきます。

コメントの書き方には、一行コメントと複数行コメントの2種類があります。

## 一行コメント {#single-line-comment}

一行コメントは名前のとおり、一行ずつコメントを書く際に利用します。
`//` 以降から行末までがコメントとして扱われるため、プログラムとして評価されません。

```js
// 一行コメント
// この部分はコードとして評価されない
```

## 複数行コメント {#multi-line-comment}

複数行コメントは名前のとおり、複数行のコメントを書く際に利用します。
一行コメントとは違い複数行をまとめて書けるので、長い説明を書く際に利用されています。

`/*` と `*/`で囲まれた範囲がコメントとして扱われるため、プログラムとして評価されません。

 
```js
/* 
   複数行コメント
   囲まれている範囲がコードとして評価されない
 */
```

複数行コメントの中に、複数行コメントを書くことはできません。
次のように、複数行のコメントをネストして書いた場合は構文エラーとなります。

```
/* ネストされた /* 複数行コメント */ は書けない */
```

### [ES2015] HTML-likeコメント {#html-like-comment}

ECMAScript 2015（ES2015）から後方互換性のための仕様として**HTML-likeコメント**が追加されています。
このHTML-likeコメントは、ブラウザの実装に合わせた後方互換性のための仕様として定義されています。

HTML-likeコメントは名前のとおり、HTMLのコメントと同じ表記です。

<!-- textlint-disable eslint -->
<!-- HTML-likeコメントはScript空間のみであるためdoctestしない -->
<!-- doctest:disable -->
```js
<!-- この行はコメントと認識される
console.log("この行はJavaScriptのコードとして実行される");
-->  この行もコメントと認識される
```

<!-- textlint-enable eslint -->

ここでは、 `<!--` と `-->` がそれぞれ一行コメントとして認識されます。

JavaScriptをサポートしていないブラウザでは、`<script>`タグを正しく認識できないために書かれたコードが表示されていました。
それを避けるために`<script>`の中をHTMLコメントで囲み、表示はされないが実行されるという回避策が取られていました。
今は`<script>`タグをサポートしていないブラウザはないため、この回避策は不要です。

```html
<script language="javascript">
<!--
  document.bgColor = "brown";
// -->
</script>
```

一方、`<script>`タグ内、つまりJavaScript内にHTMLコメントが書かれているサイトは残っています。
このようなサイトでもJavaScriptが動作するという、後方互換性のための仕様として追加されています。

[歴史的経緯][ES6 In Depth: Arrow functions]は別として、ECMAScriptではこのように後方互換性が慎重に取り扱われます。
ECMAScriptは一度入った仕様が使えなくなることはほとんどないため、基本文法で覚えたことが使えなくなることはありません。
一方で、仕様が更新されるたびに新しい機能が増えるため、それを学び続けることには変わりありません。

## まとめ {#conclusion}

この章では、ソースコードに説明を書けるコメントについて学びました。

- `//` 以降から行末までが一行コメント
- `/*` と `*/`で囲まれた範囲が複数行コメント
- HTML-likeコメントは後方互換性のためだけに存在する

[Annex B (normative)]: http://www.ecma-international.org/ecma-262/6.0/#sec-additional-ecmascript-features-for-web-browsers
[ES6 In Depth: Arrow functions]: https://dev.mozilla.jp/2016/03/es6-in-depth-arrow-functions/ "ES6 In Depth: Arrow functions | Mozilla Developer Street (modest)"
[JSDoc]: https://ja.wikipedia.org/wiki/JSDoc
