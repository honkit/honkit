---
author: azu
description: "文字列リテラルを使った文字列の作成から検索や置換など基本的な文字列操作について紹介します。また正規表現と組み合わせた文字列操作やタグ付きテンプレート関数を使ったテンプレート処理などについても紹介します。"
---

# 文字列 {#string}

この章ではJavaScriptにおける文字列について学んでいきます。
まずは、文字列の作成方法や文字列の操作方法について見ていきます。
そして、文字列を編集して自由な文字列を作れるようになることがこの章の目的です。

## 文字列を作成する {#create}

文字列を作成するには、文字列リテラルを利用します。
「[データ型とリテラル][]」の章でも紹介しましたが、文字列リテラルには`"`（ダブルクォート）、`'`（シングルクォート）、`` ` ``（バッククォート）の3種類があります。

まずは`"`（ダブルクォート）と`'`（シングルクォート）について見ていきます。

`"`（ダブルクォート）と`'`（シングルクォート）に意味的な違いはありません。
そのため、どちらを使うかは好みやプロジェクトごとのコーディング規約によって異なります。
この書籍では、`"`（ダブルクォート）を主な文字列リテラルとして利用します。

<!-- textlint-disable eslint -->

{{book.console}}
```js
const double = "文字列";
console.log(double); // => "文字列"
const single = '文字列';
console.log(single); // => '文字列'
// どちらも同じ文字列
console.log(double === single);// => true
```

ES2015では、テンプレートリテラル `` ` ``（バッククォート）が追加されました。
`` ` ``（バッククォート）を利用することで文字列を作成できる点は、他の文字列リテラルと同じです。

これに加えてテンプレートリテラルでは、文字列中に改行を入力できます。
次のコードでは、テンプレートリテラルを使って複数行の文字列を見た目どおりに定義しています。

{{book.console}}
```js
const multiline = `1行目
2行目
3行目`;
// \n は改行を意味する
console.log(multiline); // => "1行目\n2行目\n3行目"
```

<!-- textlint-enable eslint -->

どの文字列リテラルでも共通ですが、文字列リテラルは同じ記号が対になります。
そのため、文字列の中にリテラルと同じ記号が出現した場合は、`\`（バックスラッシュ）を使いエスケープする必要があります。
次のコードでは、文字列中の`"`を`\"`のようにエスケープしています。

{{book.console}}
```js
const str = "This book is \"js-primer\"";
console.log(str); // => 'This book is "js-primer"'
```

## エスケープシーケンス {#escape-sequence}

文字列リテラル中にはそのままでは入力できない特殊な文字もあります。
改行もそのひとつで、`"`（ダブルクォート）と`'`（シングルクォート）の文字列リテラルには改行をそのまま入力できません
（テンプレートリテラル中には例外的に改行をそのまま入力できます）。

次のコードは、JavaScriptの構文として正しくないため、構文エラー（SyntaxError）となります。

[import, multiline-invalid.js](src/multiline-invalid.js)

この問題を回避するためには、改行のような特殊な文字をエスケープシーケンスとして書く必要があります。
エスケープシーケンスは、`\`と特定の文字を組み合わせることで、特殊文字を表現します。

次の表では、代表的な[エスケープシーケンス][]を紹介しています。
エスケープシーケンスは、`"`（ダブルクォート）、`'`（シングルクォート）、`` ` ``（バッククォート）すべての文字列リテラルの中で利用できます。

| エスケープシーケンス     | 意味                                     |
| ------------------------ | ---------------------------------------- |
| `\'`                     | シングルクォート                         |
| `\"`                     | ダブルクォート                           |
| `` \` ``                 | バッククォート                           |
| `\\`                     | バックスラッシュ(`\`そのものを表示する)  |
| `\n`                     | 改行                                     |
| `\t`                     | タブ                                     |
| `\uXXXX`                 | Code Unit(`\u`と4桁のHexDigit)   |
| `\u{X}` ... `\u{XXXXXX}` | Code Point（`\u{}`のカッコ中にHexDigit） |

このエスケープシーケンスを利用することで、先ほどの`"`（ダブルクォート）の中に改行（`\n`）を入力できます。

{{book.console}}
```js
// 改行を\nのエスケープシーケンスとして入力している
const multiline = "1行目\n2行目\n3行目";
console.log(multiline); 
/* 改行した結果が出力される
1行目
2行目
3行目
*/
```

また、`\`からはじまる文字は自動的にエスケープシーケンスとして扱われます。
しかし、`\a`のように定義されていないエスケープシーケンスは、`\`が単に無視され`a`という文字列として扱われます。
これにより、`\`（バックスラッシュ）そのものを入力していたつもりが、その文字がエスケープシーケンスとして扱われてしまう問題があります。

次のコードでは、`\_`という組み合わせのエスケープシーケンスはないため、`\`が無視された文字列として評価されます。

{{book.console}}
```js
console.log("¯\_(ツ)_/¯"); 
// ¯_(ツ)_/¯ のように\が無視されて表示される
```

`\`（バックスラッシュ）そのものを入力したい場合は、`\\`のようにエスケープする必要があります。

{{book.console}}
```js
console.log("¯\\_(ツ)_/¯"); 
//　¯\_(ツ)_/¯ と表示される
```

<!-- Note: https://tc39.github.io/ecma262/#prod-NonEscapeCharacter

- 指定外の組み合わせもNonEscapeCharacterとして扱われ構文的には無害
- 単純に \ がないように使われる。

 -->

## 文字列を結合する {#concat}

文字列を結合する簡単な方法は文字列結合演算子（`+`）を使う方法です。

{{book.console}}
```js
const str = "a" + "b";
console.log(str); // => "ab"
```

変数と文字列を結合したい場合も文字列結合演算子で行えます。

{{book.console}}
```js
const name = "JavaScript";
console.log("Hello " + name + "!");// => "Hello JavaScript!"
```

特定の書式に文字列を埋め込むには、テンプレートリテラルを使うとより宣言的に書けます。

テンプレートリテラル中に`${変数名}`で書かれた変数は評価時に展開されます。
つまり、先ほどの文字列結合は次のように書けます。

{{book.console}}
```js
const name = "JavaScript";
console.log(`Hello ${name}!`);// => "Hello JavaScript!"
```

## 文字へのアクセス {#get-char}

文字列の特定の位置にある文字にはインデックスを指定してアクセスできます。
これは、配列における要素へのアクセスにインデックスを指定するのと同じです。

文字列では`文字列[インデックス]`のように指定した位置（インデックス）の文字へアクセスできます。
インデックスの値は`0`以上`2^53 - 1`未満の整数が指定できます。

{{book.console}}
```js
const str = "文字列";
// 配列と同じようにインデックスでアクセスできる
console.log(str[0]); // => "文"
console.log(str[1]); // => "字"
console.log(str[2]); // => "列"
```

また、存在しないインデックスへのアクセスでは配列やオブジェクトと同じように`undefined`を返します。

{{book.console}}
```js
const str = "文字列";
// 42番目の要素は存在しない
console.log(str[42]); // => undefined
```

## 文字列とは {#what-is-string}

今まで何気なく「文字列」という言葉を利用していましたが、ここでいう文字列とはどのようなものでしょうか？　コンピュータのメモリ上に文字列の「ア」といった文字をそのまま保存できないため、0と1からなるビット列へ変換する必要があります。
この文字からビット列へ変換することを符号化（エンコード）と呼びます。

一方で、変換後のビット列が何の文字なのかを管理する表が必要になります。
この文字に対応するIDの一覧表のことを符号化文字集合と呼びます。

次の表は、Unicodeという文字コードにおける符号化文字集合からカタカナの一部分を取り出したものです。[^1]
Unicodeはすべての文字に対してID（Code Point）を振ることを目的に作成されている仕様です。

|      | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | A    | B    | C    | D    | E    | F    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 30A0 | ゠   | ァ   | ア   | ィ   | イ   | ゥ   | ウ   | ェ   | エ   | ォ   | オ   | カ   | ガ   | キ   | ギ   | ク   |
| 30B0 | グ   | ケ   | ゲ   | コ   | ゴ   | サ   | ザ   | シ   | ジ   | ス   | ズ   | セ   | ゼ   | ソ   | ゾ   | タ   |
| 30C0 | ダ   | チ   | ヂ   | ッ   | ツ   | ヅ   | テ   | デ   | ト   | ド   | ナ   | ニ   | ヌ   | ネ   | ノ   | ハ   |


JavaScript（ECMAScript）は文字コードとしてUnicodeを採用し、文字をエンコードする方式としてUTF-16を採用しています。
UTF-16とは、それぞれの文字を16bitのビット列に変換するエンコード方式です。
Unicodeでは1文字を表すのに使う最小限のビットの組み合わせを**Code Unit**（符号単位）と呼び、UTF-16では各Code Unitのサイズが16bit（2バイト）です。

<!-- 
- 用語集: http://unicode.org/glossary/
- 比較表: http://unicode.org/faq/utf_bom.html#gen6
 -->

次のコードは、文字列を構成するCode Unitをhex値（16進数）にして表示する例です。
`String#charCodeAt`メソッドは、文字列の指定インデックスのCode Unitを整数として返します。
そのCode Unitの整数値を`String#toString`メソッドでhex値（16進数）にしています。

{{book.console}}
```js
const str = "アオイ";
// それぞれの文字をCode Unitのhex値（16進数）に変換する
// toStringの引数に16を渡すと16進数に変換される
console.log(str.charCodeAt(0).toString(16)); // => "30a2"
console.log(str.charCodeAt(1).toString(16)); // => "30aa"
console.log(str.charCodeAt(2).toString(16));  // => "30a4"
```

逆に、Code Unitをhex値（16進数）から文字へと変換するには`String.fromCharCode`メソッドを使います。
次のコードでは、16進数の整数リテラルである`0x`で記述したCode Unitから文字列へと変換しています
（`0x`リテラルについては「[データ型とリテラル][]」の章を参照）。

{{book.console}}
```js
const str = String.fromCharCode(
    0x30a2, // アのCode Unit
    0x30aa, // オのCode Unit
    0x30a4  // イのCode Unit
);
console.log(str); // => "アオイ"
```

これらの結果をまとめると、この文字列と文字列を構成するUTF-16のCode Unitとの関係は次のようになります。

| インデックス                       | 0     | 1     | 2     |
| -------------------------------- | ----- | ----- | ----- |
| 文字列                            | ア    | オ    | イ     |
| UTF-16のCode Unit（16進数）        | 0x30A2 | 0x30AA | 0x30A4 |

このように、JavaScriptにおける文字列は16bitのCode Unitが順番に並んだものとして内部的に管理されています。
これは、ECMAScriptの内部表現としてUTF-16を採用しているだけで、JavaScriptファイル（ソースコードを書いたファイル）のエンコーディングとは関係ありません。そのため、JavaScriptファイル自体のエンコードは、UTF-16以外の文字コードであっても問題ありません。

UTF-16を利用していることはJavaScriptの内部的な表現であるため、気にする必要がないようにも思えます。
しかし、このJavaScriptがUTF-16を利用していることは、これから見ていくStringのAPIにも影響しています。
このUTF-16と文字列については、次の章である「[文字列とUnicode][]」で詳しく見ていきます。

ここでは、「JavaScriptの文字列の各要素はUTF-16のCode Unitで構成されている」ということだけを覚えておけば問題ありません。

## 文字列の分解と結合 {#split-join}

文字列を配列へ分解するには`String#split`メソッドを利用できます。
一方、配列の要素を結合して文字列にするには`Array#join`メソッドを利用できます。

この２つはよく組み合わせて利用されるため、合わせて見ていきます。

`String#split`メソッドは、第一引数に指定した区切り文字で文字列を分解した配列を返します。
次のコードでは、文字列を`・`で区切った配列を作成しています。

{{book.console}}
```js
const strings = "赤・青・緑".split("・");
console.log(strings); // => ["赤", "青", "緑"]
```

分解してできた文字列の配列を結合して文字列を作る際に、`Array#join`メソッドが利用できます。
`Array#join`メソッドの第一引数には区切り文字を指定し、その区切り文字で結合した文字列を返します。

この２つを合わせれば、区切り文字を`・`から`、`へ変換する処理を次のように書くことができます。
`・`で文字列を分割（`split`）してから、区切り文字を`、`にして結合（`join`）すれば変換できます。

{{book.console}}
```js
const str = "赤・青・緑".split("・").join("、");
console.log(str); // => "赤、青、緑"
```

`String#split`メソッドの第一引数には正規表現も指定できます。
これを利用すると、次のように文字列をスペースで区切るような処理を簡単に書けます。
`/\s+/`は1つ以上のスペースにマッチする正規表現オブジェクトを作成する正規表現リテラルです。

{{book.console}}
```js
// 文字間に1つ以上のスペースがある
const str = "a     b    c      d";
// 1つ以上のスペースにマッチして分解する
const strings = str.split(/\s+/);
console.log(strings); // => ["a", "b", "c", "d"] 
```

## 文字列の長さ {#length}

`String#length`プロパティは文字列の要素数を返します。
文字列の構成要素はCode Unitであるため、`length`プロパティはCode Unitの個数を返します。

次の文字列は3つの要素（Code Unit）が並んだものであるため、`length`プロパティは`3`を返します。

{{book.console}}
```js
console.log("文字列".length); // => 3
```

また、空文字列は要素数が`0`であるため、`length`プロパティの結果も`0`となります。
 
{{book.console}}
```js
console.log("".length); // => 0
```

## 文字列の比較 {#compare}

文字列の比較には`===`（厳密比較演算子）を利用します。
次の条件を満たしていれば同じ文字列となります。

- 文字列の要素であるCode Unitが同じ順番で並んでいるか
- 文字列の長さ（length）は同じか

難しく書いていますが、同じ文字列同士なら`===`（厳密比較演算子）の結果は`true`となります。

{{book.console}}
```js
console.log("文字列" === "文字列"); // => true
// 一致しなければfalseとなる
console.log("JS" === "ES"); // => false
// 文字列の長さが異なるのでfalseとなる
console.log("文字列" === "文字"); // => false
```


また、`===`などの比較演算子だけではなく、
`>`、`<`、`>=`、`<=`など大小の関係演算子で文字列同士の比較もできます。

これらの関係演算子も、文字列の要素であるCode Unitの同士を先頭から順番に比較します。
文字列からCode Unitの数値を取得するには`String#charCodeAt`メソッドを利用できます。

次のコードでは、`ABC`と`ABD`を比較した場合にどちらが大きい（Code Unitの値が大きい）かを比較しています。

{{book.console}}
```js
// "A"と"B"のCode Unitは65と66
console.log("A".charCodeAt(0)); // => 65
console.log("B".charCodeAt(0)); // => 66
// "A"（65）は"B"（66）よりCode Unitの値が小さい
console.log("A" > "B"); // => false
// 先頭から順番に比較し C > D が falseであるため
console.log("ABC" > "ABD"); // => false
```

このように、関係演算子での文字列比較はCode Unit同士を比較しています。
この結果を予測することは難しく、また直感的ではない結果が生まれることも多いです。
文字の順番は国や言語によっても異なるため、国際化（Internationalization）に関する知識も必要です。

JavaScriptにおいても、[ECMA-402][]というECMAScriptと関連する別の仕様として国際化についての取り決めがされています。
この国際化に関するAPIを定義した[Intl][]というビルトインオブジェクトもありますが、このAPIについての詳細は省略します。

## 文字列の一部を取得 {#slice}

文字列からその一部を取り出したい場合には、`String#slice`メソッドや`String#substring`メソッドが利用できます。

`slice`メソッドについては、すでに配列で学んでいますが、基本的な動作は文字列でも同様です。
まずは`slice`メソッドについて見ていきます。

<!-- textlint-disable ja-technical-writing/max-ten -->

`String#slice`メソッドは、第一引数に開始位置、第二引数に終了位置を指定し、その範囲を取り出した新しい文字列を返します。
第二引数は省略でき、省略した場合は文字列の末尾が終了位置となります。

<!-- textlint-enable ja-technical-writing/max-ten -->

位置にマイナスの値を指定した場合は文字列の末尾から数えた位置となります。
また、第一引数の位置が第二引数の位置より大きい場合、常に空の文字列を返します。

{{book.console}}
```js
const str = "ABCDE";
console.log(str.slice(1)); // => "BCDE"
console.log(str.slice(1, 5)); // => "BCDE"
// マイナスを指定すると後ろからの位置となる
console.log(str.slice(-1)); // => "E"
// インデックスが1から4の範囲を取り出す
console.log(str.slice(1, 4)); // => "BCD"
// 第一引数 > 第二引数の場合、常に空文字列を返す
console.log(str.slice(4, 1)); // => ""
```

`String#substring`メソッドは、`slice`メソッドと同じく第一引数に開始位置、第二引数に終了位置を指定し、その範囲を取り出して新しい文字列を返します。
第二引数を省略した場合の挙動も同様で、省略した場合は文字列の末尾が終了位置となります。

`slice`メソッドとは異なる点として、位置にマイナスの値を指定した場合は常に`0`として扱われます。
また、第一引数の位置が第二引数の位置より大きい場合、第一引数と第二引数が入れ替わるという予想しにくい挙動となります。

{{book.console}}
```js
const str = "ABCDE";
console.log(str.substring(1)); // => "BCDE"
console.log(str.substring(1, 5)); // => "BCDE"
// マイナスを指定すると0として扱われる
console.log(str.substring(-1)); // => "ABCDE"
// 位置:1から4の範囲を取り出す
console.log(str.substring(1, 4)); // => "BCD"
// 第一引数 > 第二引数の場合、引数が入れ替わる
// str.substring(1, 4)と同じ結果になる
console.log(str.substring(4, 1)); // => "BCD"
```

このように、マイナスの位置や引数が交換される挙動はわかりやすいものとは言えません。
そのため、`slice`メソッドと`substring`メソッドに指定する引数は、どちらとも同じ結果となる範囲に限定したほうが直感的な挙動となります。
つまり、指定するインデックスは0以上にして、第二引数を指定する場合は`第一引数の位置 < 第二引数の位置`にするということです。

`String#slice`メソッドは`String#indexOf`メソッドなど位置を取得するものと組み合わせて使うことが多いでしょう。
次のコードでは、`?`の位置を`indexOf`メソッドで取得し、それ以降の文字列を`slice`メソッドで切り出しています。

{{book.console}}
```js
const url = "https://example.com?param=1";
const indexOfQuery = url.indexOf("?");
const queryString = url.slice(indexOfQuery);
console.log(queryString); // => "?param=1"
```

また、配列とは異なりプリミティブ型の値である文字列は、`slice`メソッドと`substring`メソッド共に非破壊的です。
機能的な違いがほとんどないため、どちらを利用するかは好みの問題となるでしょう。

## 文字列の検索 {#search}

文字列の検索方法として、大きく分けて文字列による検索と正規表現による検索があります。

指定した文字列が文字列中に含まれているかを検索する方法として、Stringメソッドには取得したい結果ごとにメソッドが用意されています。
ここでは、次の3種類の結果を取得する方法について文字列と正規表現それぞれの検索方法を見ていきます。

- マッチした箇所のインデックスを取得
- マッチした文字列の取得
- マッチしたかどうかの真偽値を取得

<!-- Note: 検索はある目的を持って探すこと、探索は目的外の有益な情報も探すことを含んでいる -->
<!-- ここでは目的が決まっているので"検索" -->
<!-- http://www.st38.net/chigaino-zatugaku/z0174.html -->

### 文字列による検索 {#search-by-string}

`String`オブジェクトには、指定した文字列で検索するメソッドが用意されています。

#### 文字列によるインデックスの取得 {#search-index-by-string}

`String#indexOf`メソッドと`String#lastIndexOf`メソッドは、指定した文字列で検索し、その文字列が最初に現れたインデックスを返します。
これらは配列の`Array#indexOf`メソッドと同じで、厳密等価演算子（`===`）で文字列を検索します。
一致する文字列がない場合は`-1`を返します。

- `文字列.indexOf("検索文字列")`: 先頭から検索し、指定された文字列が最初に現れたインデックスを返す
- `文字列.lastIndexOf("検索文字列")`: 末尾から検索し、指定された文字列が最初に現れたインデックスを返す

どちらのメソッドも一致する文字列が複数個ある場合でも、指定した検索文字列を最初に見つけた時点で検索は終了します。

{{book.console}}
```js
// 検索対象となる文字列
const str = "にわにはにわにわとりがいる";
// indexOfは先頭から検索しインデックスを返す - "**にわ**にはにわにわとりがいる"
// "にわ"の先頭のインデックスを返すため 0 となる
console.log(str.indexOf("にわ")); // => 0
// lastIndexOfは末尾から検索しインデックスを返す- "にわにはにわ**にわ**とりがいる"
console.log(str.lastIndexOf("にわ")); // => 6
// 指定した文字列が見つからない場合は -1 を返す
console.log(str.indexOf("未知のキーワード")); // => -1
```

### 文字列にマッチした文字列の取得 {#match-by-string}

文字列を検索してマッチした文字列は、検索文字列そのものになるので自明です。

次のコードでは`"Script"`という文字列で検索していますが、その検索文字列にマッチする文字列はもちろん`"Script"`になります。

{{book.console}}
```js
const str = "JavaScript";
const searchWord = "Script";
const index = str.indexOf(searchWord);
if (index !== -1) {
    console.log(`${searchWord}が見つかりました`);
} else {
    console.log(`${searchWord}は見つかりませんでした`);
}
```

#### 真偽値の取得 {#test-by-string}

「文字列」に「検索文字列」が含まれているかを検索する方法がいくつか用意されています。
次の3つのメソッドはES2015で導入されました。

- `String#startsWith(検索文字列)`<sup>[ES2015]</sup>: 検索文字列が先頭にあるかの真偽値を返す
- `String#endsWith(検索文字列)`<sup>[ES2015]</sup>: 検索文字列が末尾にあるかの真偽値を返す
- `String#includes(検索文字列)`<sup>[ES2015]</sup>: 検索文字列を含むかの真偽値を返す

具体的な例をいくつか見てみましょう。

{{book.console}}
```js
// 検索対象となる文字列
const str = "にわにはにわにわとりがいる";
// startsWith - 検索文字列が先頭ならtrue
console.log(str.startsWith("にわ")); // => true
console.log(str.startsWith("いる")); // => false
// endsWith - 検索文字列が末尾ならtrue
console.log(str.endsWith("にわ")); // => false
console.log(str.endsWith("いる")); // => true
// includes - 検索文字列が含まれるならtrue
console.log(str.includes("にわ")); // => true
console.log(str.includes("いる")); // => true
```

## 正規表現オブジェクト {#regexp-object}

<!-- パターンと正規表現オブジェクトの用語については https://github.com/asciidwango/js-primer/issues/21#issuecomment-293502813 -->

文字列による検索では、固定の文字列にマッチするものしか検索できません。
一方で正規表現による検索では、あるパターン（規則性）にマッチするという柔軟な検索ができます。

正規表現は正規表現オブジェクト（`RegExp`オブジェクト）として表現されます。
正規表現オブジェクトはマッチする範囲を決める`パターン`と正規表現の検索モードを指定する`フラグ`の2つで構成されます。
正規表現のパターン内では、次の文字は**特殊文字**と呼ばれ、特別な意味を持ちます。特殊文字として解釈されないように入力する場合には`\`（バックスラッシュ）でエスケープすることが必要です。

```
\ ^ $ . * + ? ( ) [ ] { } |
```

正規表現オブジェクトを作成するには、正規表現リテラルと`RegExp`コンストラクタを使う2つの方法があります。

<!-- textlint-disable eslint -->
<!-- doctest:disable -->
```js
// 正規表現リテラルで正規表現オブジェクトを作成
const patternA = /パターン/フラグ;
// `RegExp`コンストラクタで正規表現オブジェクトを作成
const patternB = new RegExp("パターン文字列", "フラグ");
```
<!-- textlint-enable eslint -->

正規表現リテラルは、`/`と`/`のリテラル内に正規表現のパターンを書くことで、正規表現オブジェクトを作成できます。
次のコードでは、`+`という1回以上の繰り返しを意味する特殊文字を使い、`a`が1回以上連続する文字列にマッチする正規表現オブジェクトを作成しています。

```js
const pattern = /a+/;
```

正規表現オブジェクトを作成するもうひとつの方法として`RegExp`コンストラクタがあります。
`RegExp`コンストラクタでは、文字列から正規表現オブジェクトを作成できます。

次のコードでは、`RegExp`コンストラクタを使って`a`が1文字以上連続している文字列にマッチする正規表現オブジェクトを作成しています。
これは先ほどの正規表現リテラルで作成した正規表現オブジェクトと同じ意味になります。

```js
const pattern = new RegExp("a+");
```

### 正規表現リテラルと`RegExp`コンストラクタの違い {#difference-regexp-literal-regexp-constructor}

<!-- 評価とコンパイルは仕様から来てる用語 https://tc39.es/ecma262/#sec-pattern -->

正規表現リテラルと`RegExp`コンストラクタの違いとして、正規表現のパターンが評価されるタイミングの違いがあります。
正規表現リテラルは、ソースコードをロード（パース）した段階で正規表現のパターンが評価されます。
一方で、`RegExp`コンストラクタでは通常の関数と同じように実際に`RegExp`コンストラクタを呼び出すまでパターンは評価されません。

単独の`[`という不正なパターンである正規表現を例に、評価されているタイミングの違いを見てみます。
`[`は対になる`]`と組み合わせて利用する特殊文字であるため、正規表現のパターンに単独で書くと構文エラーの例外が発生します。

正規表現リテラルは、ソースコードのロード時に正規表現のパターンが評価されるため、
次のように`main`関数を呼び出していなくても構文エラー（`SyntaxError`）が発生します。

{{book.console}}
[import, invalid/regexp-literal.js](src/invalid/regexp-literal.js)

一方で、`RegExp`コンストラクタは実行時に正規表現のパターンが評価されるため、
`main`関数を呼び出すことで初めて構文エラー（`SyntaxError`）が発生します。

{{book.console}}
[import, invalid/regexp-constructor.js](src/invalid/regexp-constructor.js)

これを言い換えると、正規表現リテラルはコードを書いた時点で決まったパターンの正規表現オブジェクトを作成する構文です。
一方で、`RegExp`コンストラクタは変数と組み合わせるなど、実行時に変わることがあるパターンの正規表現オブジェクトを作成できます。

例として、指定個数のホワイトスペース（空白文字）が連続した場合にマッチする正規表現オブジェクトで比較してみます。

次のコードでは、正規表現リテラルを使って3つ連続するホワイトスペースにマッチする正規表現オブジェクトを作成しています。
`\s`はスペースやタブなどのホワイトスペースにマッチする特殊文字です。
また、`{数字}`は指定した回数だけ繰り返しを意味する特殊文字です。

```js
// 3つの連続するスペースなどにマッチする正規表現
const pattern = /\s{3}/;
```

正規表現リテラルは、ロード時に正規表現のパターンが評価されるため、`\s`の連続する回数を動的に変更することはできません。
一方で、`RegExp`コンストラクタは、実行時に正規表現のパターンが評価されるため、変数を含んだ正規表現オブジェクトを作成できます。

次のコードでは、`RegExp`コンストラクタで変数`spaceCount`の数だけ連続するホワイトスペースにマッチする正規表現オブジェクトを作成しています。
注意点として、`\`（バックスラッシュ）自体が、文字列中ではエスケープ文字であることに注意してください。
そのため、`RegExp`コンストラクタの引数のパターン文字列では、バックスラッシュからはじまる特殊文字は`\`（バックスラッシュ）自体をエスケープする必要があります。

```js
const spaceCount = 3;
// `/\s{3}/`の正規表現を文字列から作成する
// "\"がエスケープ文字であるため、"\"自身を文字列として書くには、"\\"のように2つ書く
const pattern = new RegExp(`\\s{${spaceCount}}`);
```

このように、`RegExp`コンストラクタは文字列から正規表現オブジェクトを作成できますが、特殊文字のエスケープが必要となります。
そのため、正規表現リテラルで表現できる場合は、リテラルを利用したほうが簡潔でパフォーマンスもよいです。
正規表現のパターンに変数を利用する場合などは、`RegExp`コンストラクタを利用します。

### 正規表現による検索 {#search-by-regexp}

正規表現による検索は、正規表現オブジェクトと対応した`String`オブジェクトまたは`RegExp`オブジェクトのメソッドを利用します。

#### 正規表現によるインデックスの取得 {#search-index-by-regexp}

`String#indexOf`メソッドの正規表現版ともいえる`String#search`メソッドがあります。
`search`メソッドは正規表現のパターンにマッチした箇所のインデックスを返し、マッチする文字列がない場合は`-1`を返します。

- `String#indexOf(検索文字列)`: 指定された文字列にマッチした箇所のインデックスを返す
- `String#search(/パターン/)`: 指定された正規表現のパターンにマッチした箇所のインデックスを返す

次のコードでは、数字が3つ連続しているかを検索し、該当した箇所のインデックスを返しています。
`\d`は、1文字の数字（`0`から`9`）にマッチする特殊文字です。

{{book.console}}
```js
const str = "ABC123EFG";
const searchPattern = /\d{3}/;
console.log(str.search(searchPattern)); // => 3
```

#### 正規表現によるマッチした文字列の取得 {#match-by-regexp}

文字列による検索では、検索した文字列そのものがマッチした文字列になります。
しかし、`search`メソッドの正規表現による検索は、正規表現パターンによる検索であるため、検索してマッチした文字列の長さは固定ではありません。
つまり、次のように`String#search`メソッドでマッチしたインデックスのみを取得しても、実際にマッチした文字列がわかりません。

<!-- doctest:disable -->
```js
const str = "abc123def";
// 連続した数字にマッチする正規表現
const searchPattern = /\d+/;
const index = str.search(searchPattern); // => 3
// `index` だけではマッチした文字列の長さがわからない
str.slice(index, index + マッチした文字列の長さ); // マッチした文字列は取得できない
```

そのため、マッチした文字列を取得する`RegExp#exec`メソッドと`String#match`メソッドが用意されています。
これらのメソッドは、正規表現のマッチを文字列の最後まで繰り返す`g`フラグ（globalの略称）と組み合わせてよく利用されます。
また、`g`フラグの有無によって返り値が変わるのも特徴的です。

- `String#match(正規表現)`: 文字列中でマッチするものを検索する
    - マッチした場合は、マッチした文字列を含んだ特殊な配列を返す
    - マッチしない場合は、`null`を返す
    - 正規表現の`g`フラグが有効化されているときは、マッチしたすべての結果を含んだ配列を返す
- `RegExp#exec(文字列)`: 文字列中でマッチするものを検索する
    - マッチした場合は、マッチした文字列を含んだ特殊な配列を返す
    - マッチしない場合は、`null`を返す
    - 正規表現の`g`フラグが有効化されているときは、マッチした末尾のインデックスを`lastIndex`プロパティに記憶する

`String#match`メソッドは正規表現の`g`フラグなしのパターンで検索した場合、マッチしたものが見つかった時点で検索が終了します。
このときの`match`メソッドの返り値である配列は`index`プロパティと`input`プロパティが追加された特殊な配列となります。

次のコードの`/[a-zA-Z]+/`という正規表現は`a`から`Z`のどれかの文字が1つ以上連続しているものにマッチします。

{{book.console}}
```js
const str = "ABC あいう DE えお";
const alphabetsPattern = /[a-zA-Z]+/;
// gフラグなしでは、最初の結果のみを含んだ特殊な配列を返す
const results = str.match(alphabetsPattern);
console.log(results.length); // => 1
// マッチした文字列はインデックスでアクセスできる
console.log(results[0]); // => "ABC"
// マッチした文字列の先頭のインデックス
console.log(results.index); // => 0
// 検索対象となった文字列全体
console.log(results.input); // => "ABC あいう DE えお"
```

`String#match`メソッドは正規表現の`g`フラグありのパターンで検索した場合、マッチしたすべての結果を含んだ配列を返します。

次のコードの`/[a-zA-Z]+/g`という正規表現は`a`から`Z`のどれかの文字が1つ以上連続しているものに繰り返しマッチします。
このパターンにマッチする箇所は2つあるため、`String#match`メソッドの返り値である配列にも2つの要素が含まれています。

{{book.console}}
```js
const str = "ABC あいう DE えお";
const alphabetsPattern = /[a-zA-Z]+/g;
// gフラグありでは、すべての検索結果を含む配列を返す
const resultsWithG = str.match(alphabetsPattern);
console.log(resultsWithG.length); // => 2
console.log(resultsWithG[0]); // => "ABC"
console.log(resultsWithG[1]); // => "DE"
// indexとinputはgフラグありの場合は追加されない
console.log(resultsWithG.index); // => undefined
console.log(resultsWithG.input); // => undefined
```

`RegExp#exec`メソッドも、`g`フラグの有無によって挙動が変化します。

`RegExp#exec`メソッドは`g`フラグなしのパターンで検索した場合、マッチした最初の結果のみを含む特殊な配列を返します。
このときの`exec`メソッドの返り値である配列が`index`プロパティと`input`プロパティが追加された特殊な配列となるのは、`String#match`メソッドと同様です。

{{book.console}}
```js
const str = "ABC あいう DE えお";
const alphabetsPattern = /[a-zA-Z]+/;
// gフラグなしでは、最初の結果のみを持つ配列を返す
const results = alphabetsPattern.exec(str);
console.log(results.length); // => 1
console.log(results[0]); // => "ABC"
// マッチした文字列の先頭のインデックス
console.log(results.index); // => 0
// 検索対象となった文字列全体
console.log(results.input); // => "ABC あいう DE えお"
```

`RegExp#exec`メソッドは`g`フラグありのパターンで検索した場合も、マッチした最初の結果のみを含む特殊な配列を返します。
この点は`String#match`メソッドとは異なります。
また、最後にマッチした末尾のインデックスを正規表現オブジェクトの`lastIndex`プロパティに記憶します。
そしてもう一度`exec`メソッドを呼び出すと最後にマッチした末尾のインデックスから検索が開始されます。

{{book.console}}
```js
const str = "ABC あいう DE えお";
const alphabetsPattern = /[a-zA-Z]+/g;
// まだ一度も検索していないので、lastIndexは0となり先頭から検索が開始される
console.log(alphabetsPattern.lastIndex); // => 0
// gフラグありでも、一回目の結果は同じだが、`lastIndex`プロパティが更新される
const result1 = alphabetsPattern.exec(str);
console.log(result1[0]); // => "ABC"
console.log(alphabetsPattern.lastIndex); // => 3
// 2回目の検索が、`lastIndex`の値のインデックスから開始される
const result2 = alphabetsPattern.exec(str);
console.log(result2[0]); // => "DE"
console.log(alphabetsPattern.lastIndex); // => 10
// 検索結果が見つからない場合はnullを返し、`lastIndex`プロパティは0にリセットされる
const result3 = alphabetsPattern.exec(str);
console.log(result3); // => null
console.log(alphabetsPattern.lastIndex); // => 0
```

この`lastIndex`プロパティが検索ごとに更新される仕組みを利用することで、`exec`を反復処理してすべての検索結果を取得できます。
`exec`メソッドはマッチしなければ`null`を返すため、マッチするものがなくなればwhile文から自動的に脱出します。

{{book.console}}
```js
const str = "ABC あいう DE えお";
const alphabetsPattern = /[a-zA-Z]+/g;
let matches;
while (matches = alphabetsPattern.exec(str)) {
    console.log(`match: ${matches[0]}, lastIndex: ${alphabetsPattern.lastIndex}`);
}
// コンソールには次のように出力される
// match: ABC, lastIndex: 3
// match: DE, lastIndex: 10
```

このように`String#match`メソッドと`RegExp#exec`メソッドはどちらも`g`フラグによって挙動が変わります。
また`RegExp#exec`メソッドは、正規表現オブジェクトの`lastIndex`プロパティを変更するという副作用を持ちます。

#### マッチした一部の文字列を取得 {#match-capture-by-regexp}

`String#match`メソッドと`RegExp#exec`メソッドのどちらも正規表現のキャプチャリングに対応しています。
キャプチャリングとは、正規表現中で`/パターン1(パターン2)/`のようにカッコで囲んだ部分を取り出すことです。
このキャプチャリングによって、正規表現でマッチした一部分だけを取り出せます。

`String#match`メソッド、`RegExp#exec`メソッドのどちらもマッチした結果を配列として返します。

そのマッチしているパターンにキャプチャが含まれている場合は、次のように返り値の配列へキャプチャした部分が追加されていきます。

<!-- doctest:disable -->
```js
const [マッチした全体の文字列, ...キャプチャされた文字列] = 文字列.match(/パターン(キャプチャ)/);
```

次のコードでは、`ECMAScript 数字`の`数字`部分だけを取り出そうとしています。
`String#match`メソッドとキャプチャリングによって数字(`\d`)にマッチする部分を取り出しています。

{{book.console}}
```js
// "ECMAScript (数字+)"にマッチするが、欲しい文字列は数字の部分のみ
const pattern = /ECMAScript (\d+)/;
// 返り値は0番目がマッチした全体、1番目がキャプチャの1番目というように対応している
// [マッチした全部の文字列, キャプチャの1番目, キャプチャの2番目 ....]
// `pattern.exec("ECMAScript 6")`も返り値は同じ
const [all, capture1] = "ECMAScript 6".match(pattern);
console.log(all); // => "ECMAScript 6"
console.log(capture1); // => "6"
```

#### 真偽値を取得 {#test-by-regexp}

正規表現オブジェクトを使って、そのパターンにマッチするかをテストするには、`RegExp#test`メソッドを利用できます。

正規表現のパターンには、パターンの位置を指定する特殊文字があります。
そのため、「文字列による検索」で登場したメソッドは、すべての特殊文字と`RegExp#test`メソッドで表現できます。

- `String#startsWith`: `/^パターン/.test(文字列)`
    - `^` は先頭に一致する特殊文字
- `String#endsWith`: `/パターン$/.test(文字列)`
    - `$` は末尾に一致する特殊文字
- `String#includes`: `/パターン/.test(文字列)`

具体的な例を見てみましょう。

{{book.console}}
```js
// 検索対象となる文字列
const str = "にわにはにわにわとりがいる";
// ^ - 検索文字列が先頭ならtrue
console.log(/^にわ/.test(str)); // => true
console.log(/^いる/.test(str)); // => false
// $ - 検索文字列が末尾ならtrue
console.log(/にわ$/.test(str)); // => false
console.log(/いる$/.test(str)); // => true
// 検索文字列が含まれるならtrue
console.log(/にわ/.test(str)); // => true
console.log(/いる/.test(str)); // => true
```

そのほかにも、正規表現では繰り返しや文字の集合などを特殊文字で表現できるため柔軟な検索が可能です。

### 文字列と正規表現どちらを使うべきか {#string-or-regexp}

Stringメソッドでの検索と同等のことは、正規表現でもできることがわかりました。
Stringメソッドと正規表現で同じ結果が得られる場合はどちらを利用するのがよいでしょうか？

正規表現は曖昧な検索に強く、特殊文字を使うことで柔軟な検索結果を得られます。
一方、曖昧であるため、コードを見ても何を検索しているかが正規表現のパターン自体からわからないことがあります。

次の例は、`/`からはじまり`/`で終わる文字列かを判定しようとしています。
この判定を正規表現とStringメソッドを使ってそれぞれ実装しています
（これは意図的に正規表現に不利な例となっています）。

正規表現の場合、`/^\/.*\/$/`のようにパターンそのものを見ても何をしたいのかはひと目ではわかりにくいです。
Stringメソッドの場合は、`/`からはじまり`/`で終わるかを判定してることがそのままコードに表現できています。

{{book.console}}
```js
const str = "/正規表現のような文字列/";
// 正規表現で`/`からはじまり`/`で終わる文字列のパターン
const regExpLikePattern = /^\/.*\/$/;
// RegExp#testメソッドでパターンにマッチするかを判定
console.log(regExpLikePattern.test(str)); // => true
// Stringメソッドで、`/`からはじまり`/`で終わる文字列かを判定する関数
const isRegExpLikeString = (str) => {
    return str.startsWith("/") && str.endsWith("/");
};
console.log(isRegExpLikeString(str)); // => true
```

このように、正規表現は柔軟で便利ですが、コード上から意図が消えてしまいやすいです。
そのため、正規表現を扱う際にはコメントや変数名で具体的な意図を補足したほうがよいでしょう。

「Stringメソッドと正規表現で同じ結果が得られる場合はどちらを利用するのがよいでしょうか？」という疑問に戻ります。
Stringメソッドで表現できることはStringメソッドで表現し、柔軟性や曖昧な検索が必要な場合はコメントとともに正規表現を利用するという方針を推奨します。

正規表現についてより詳しくは[MDNの正規表現ドキュメント][]や、コンソールで実行しながら試せる[regex101][]のようなサイトを参照してください。

## 文字列の置換/削除 {#replace-delete}

文字列の一部を置換したり削除するには`String#replace`メソッドを利用します。
「[データ型とリテラル][]」で説明したようにプリミティブ型である文字列は不変な特性を持ちます。
そのため、文字列から一部の文字を削除するような操作はできません。

つまり、`delete`演算子は文字列に対して利用できません。
strict modeでは削除できないプロパティを削除しようとするとエラーが発生します
（strict modeでない場合はエラーも発生せず単に無視されます）。

{{book.console}}
```js
"use strict";
const str = "文字列";
// 文字列の0番目の削除を試みるがStrict modeでは例外が発生する
delete str[0]; // => TypeError: property 0 is non-configurable and can't be deleted
```

代わりに、`String#replace`メソッドなどで削除したい文字を取り除いた新しい文字列を返すことで削除を表現します。
`replace`メソッドは、**文字列**から第一引数の`検索文字列`または正規表現にマッチする部分を、第二引数の`置換文字列`へ置換します。
第一引数には、文字列と正規表現を指定できます。

<!-- doctest: ReferenceError -->
```js
文字列.replace("検索文字列", "置換文字列");
文字列.replace(/パターン/, "置換文字列");
```

次のように、`replace`メソッドで削除したい部分を空文字列へ置換することで、文字列を削除できます。

{{book.console}}
```js
const str = "文字列";
// "文字"を""（空文字列）へ置換することで"削除"を表現
const newStr = str.replace("文字", "");
console.log(newStr); // => "列"
```

`replace`メソッドには正規表現も指定できます。
`g`フラグを有効化した正規表現を渡すことで、文字列からパターンにマッチするものをすべて置換できます。

{{book.console}}
```js
// 検索対象となる文字列
const str = "にわにはにわにわとりがいる";
// 文字列を指定した場合は、最初に一致したものだけが置換される
console.log(str.replace("にわ", "niwa")); // => "niwaにはにわにわとりがいる"
// `g`フラグなし正規表現の場合は、最初に一致したものだけが置換される
console.log(str.replace(/にわ/, "niwa")); // => "niwaにはにわにわとりがいる"
// `g`フラグあり正規表現の場合は、繰り返し置換を行う
console.log(str.replace(/にわ/g, "niwa")); // => "niwaにはniwaniwaとりがいる"
```

`replace`メソッドでは、キャプチャした文字列を利用して複雑な置換処理もできます。

`replace`メソッドの第二引数にはコールバック関数を渡せます。
第一引数の`パターン`にマッチした部分がコールバック関数の返り値で置換されます。
コールバック関数の第一引数には`パターン`に一致した文字列全体、第二引数以降へキャプチャした文字列が順番に入ります。

<!-- doctest:disable -->
```js
const 置換した結果の文字列 = 文字列.replace(/(パターン)/, (all, ...captures) => {
    return 置換したい文字列;
});
```

例として、`2017-03-01`を`2017年03月01日`に置換する処理を書いてみましょう。

`/(\d{4})-(\d{2})-(\d{2})/`という正規表現が`"2017-03-01"`という文字列にマッチします。
コールバック関数の`year`、`month`、`day`にはそれぞれキャプチャした文字列が入り、
マッチした文字列全体がコールバック関数の返り値に置換されます。

{{book.console}}
```js
function toDateJa(dateString) {
    // パターンにマッチしたときのみ、コールバック関数で置換処理が行われる
    return dateString.replace(/(\d{4})-(\d{2})-(\d{2})/, (all, year, month, day) => {
        // `all`には、マッチした文字列全体が入っているが今回は利用しない
        // `all`が次の返す値で置換されるイメージ
        return `${year}年${month}月${day}日`;
    });
}
// マッチしない文字列の場合は、そのままの文字列が返る
console.log(toDateJa("本日ハ晴天ナリ")); // => "本日ハ晴天ナリ"
// マッチした場合は置換した結果を返す
console.log(toDateJa("今日は2017-03-01です")); // => "今日は2017年03月01日です"
```

## 文字列の組み立て {#built}

最後に文字列の組み立てについて見ていきましょう。
最初に述べたようにこの章の目的は、「自由な文字列を作れるようになること」です。

文字列を単純に結合したり置換することで新しい文字列を作れることがわかりました。
一方、構造的な文字列の場合は単純に結合するだけでは意味が異なってしまうことがあります。

ここでの構造的な文字列とは、URL文字列やファイルパス文字列といった文字列中にコンテキストを持っているものを指します。
たとえば、URL文字列は次のような構造を持っており、それぞれの要素に入る文字列の種類などが決められています（詳細は「[URL Standard][]」を参照）。

```
"https://example.com/index.html"
 ^^^^^   ^^^^^^^^^^^ ^^^^^^^^^^   
   |          |     　　　|
 scheme      host     pathname
```

これらの文字列を作成する場合は、文字列結合演算子（`+`）で単純に結合するよりも専用の関数を用意するほうが安全です。

たとえば、次のように`baseURL`と`pathname`を渡し、それらを結合したURLにあるリソースを取得する`getResource`関数があるとします。
この`getResource`関数には、ベースURL(`baseURL`)とパス（`pathname`）を引数に渡して利用します。

{{book.console}}
```js
// `baseURL`と`pathname`にあるリソースを取得する
function getResource(baseURL, pathname) {
    const url = baseURL + pathname;
    console.log(url); // => "http://example.com/resouces/example.js"
    // 省略) リソースを取得する処理...
}
const baseURL = "http://example.com/resouces";
const pathname = "/example.js";
getResource(baseURL, pathname);
```

しかし、人によっては、`baseURL`の末尾には`/`が含まれると考える場合もあります。
`getResource`関数は、`baseURL`の末尾に`/`が含まれているケースを想定していませんでした。
そのため、意図しないURLからリソースを取得するという問題が発生します。

{{book.console}}
```js
// `baseURL`と`pathname`にあるリソースを取得する
function getResource(baseURL, pathname) {
    const url = baseURL + pathname;
    // `/` と `/` が２つ重なってしまっている
    console.log(url); // => "http://example.com/resouces//example.js"
    // 省略) リソースを取得する処理...
}
const baseURL = "http://example.com/resouces/";
const pathname = "/example.js";
getResource(baseURL, pathname);
```

この問題が難しいところは、結合してできた`url`は文字列としては正しいため、エラーではないということです。
つまり、一見すると問題ないように見えますが、実際に動かしてみて初めてわかるような問題が生じやすいのです。

そのため、このような構造的な文字列を扱う場合は、専用の関数や専用のオブジェクトを作ることで安全に文字列を処理します。

先ほどのような、URL文字列の結合を安全に行うには、入力される`baseURL`文字列の表記揺れを吸収する仕組みを作成します。
次の`baseJoin`関数はベースURLとパスを結合した文字列を返しますが、ベースURLの末尾に`/`があるかの揺れを吸収しています。

{{book.console}}
```js
// ベースURLとパスを結合した文字列を返す
function baseJoin(baseURL, pathname) {
    // 末尾に / がある場合は、/を削除してから結合する
    const stripSlashBaseURl = baseURL.replace(/\/$/, "");
    return stripSlashBaseURl + pathname;
}
// `baseURL`と`pathname`にあるリソースを取得する
function getResource(baseURL, pathname) {
    const url = baseJoin(baseURL, pathname);
    // baseURLの末尾に`/`があってもなくても同じ結果となる
    console.log(url); // => "http://example.com/resouces/example.js"
    // 省略) リソースを取得する処理...
}
const baseURL = "http://example.com/resouces/";
const pathname = "/example.js";
getResource(baseURL, pathname);
```

ECMAScriptの範囲ではありませんが、URLやファイルパスといった典型的なものに対してはすでに専用のものがあります。
URLを扱うものとしてウェブ標準APIである[URL][]オブジェクト、ファイルパスを扱うものとしてはNode.jsのコアモジュールである[Path][]モジュールなどがあります。専用の仕組みがある場合は、直接`+`演算子で結合するような文字列処理は避けるべきです。

### [ES2015] タグつきテンプレート関数 {#tagged-template-function}

JavaScriptでは、テンプレートとなる文字列に対して一部分だけを変更する処理を行う方法として、タグつきテンプレート関数があります。
タグつきテンプレート関数とは、``` 関数`テンプレート` ```という形式で記述する関数とテンプレートリテラルを合わせた表現です。
関数の呼び出しに```関数(`テンプレート`)```ではなく、``` 関数`テンプレート` ```という書式を使っていることに注意してください。

通常の関数として呼び出した場合、関数の引数にはただの文字列が渡ってきます。

{{book.console}}
```js
function tag(str) {
    // 引数`str`にはただの文字列が渡ってくる
    console.log(str); // => "template 0 literal 1"
}
// ()をつけて関数を呼び出す
tag(`template ${0} literal ${1}`);
```

しかし、`()`ではなく ``` 関数`テンプレート` ``` と記述することで、`関数`が受け取る引数にはタグつきテンプレート向けの値が渡ってきます。
このとき、関数の第一引数にはテンプレートの中身が`${}`で区切られた文字列の配列、第二引数以降は`${}`の中に書いた式の評価結果が順番に渡されます。

{{book.console}}
<!-- doctest:disable -->
```js
// 呼び出し方によって受け取る引数の形式が変わる
function tag(strings, ...values) {
    // stringsは文字列のパーツが${}で区切られた配列となる
    console.log(strings); // => ["template "," literal ",""]
    // valuesには${}の評価値が順番に入る
    console.log(values); // => [0, 1]
}
// ()をつけずにテンプレートを呼び出す
tag`template ${0} literal ${1}`;
```

どちらも同じ関数ですが、``` 関数`テンプレート` ```という書式で呼び出すと渡される引数が特殊な形になります。
そのため、タグつきテンプレートで利用する関数のことを**タグ関数**（Tag function）と呼び分けることにします。

まずは引数をどう扱うかを見ていくために、タグつきテンプレートの内容をそのまま結合して返す`stringRaw`というタグ関数を実装してみます。
`Array#reduce`メソッドを使うことで、テンプレートの文字列と変数を順番に結合できます。

{{book.console}}
```js
// テンプレートを順番どおりに結合した文字列を返すタグ関数
function stringRaw(strings, ...values) {
    // resultの初期値はstrings[0]の値となる
    return strings.reduce((result, str, i) => {
        console.log([result, values[i - 1], str]);
        // それぞれループで次のような出力となる
        // 1度目: ["template ", 0, " literal "]
        // 2度目: ["template 0 literal ", 1, ""]
        return result + values[i - 1] + str;
    }); 
}
// 関数`テンプレートリテラル` という形で呼び出す
console.log(stringRaw`template ${0} literal ${1}`); // => "template 0 literal 1"
```

ここで実装した`stringRaw`タグ関数と同様のものが、`String.raw`メソッド<sup>[ES2015]</sup>として提供されています。

{{book.console}}
```js
console.log(String.raw`template ${0} literal ${1}`); // => "template 0 literal 1"
```

タグつきテンプレート関数を利用することで、テンプレートとなる文字列に対して特定の形式に変換したデータを埋め込むといったテンプレート処理が行えます。

次のコードでは、テンプレート中の変数をURLエスケープしてから埋め込むタグつきテンプレート関数を定義しています。
`encodeURIComponent`関数は引数の値をURLエスケープする関数です。
`escapeURL`では受け取った変数を`encodeURIComponent`関数でURLエスケープしてから埋め込んでいます。

{{book.console}}
```js
// 変数をURLエスケープするタグ関数
function escapeURL(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + encodeURIComponent(values[i - 1]) + str;
    });  
}

const input = "A&B";
// escapeURLタグ関数を使ったタグつきテンプレート
const escapedURL = escapeURL`https://example.com/search?q=${input}&sort=desc`;
console.log(escapedURL); // => "https://example.com/search?q=A%26B&sort=desc"
```

このようにタグつきテンプレートリテラルを使うことで、コンテキストに応じた処理をつけ加えることができます。
この機能はJavaScript内にHTMLなどの別の言語やDSL（ドメイン固有言語）を埋め込む際に利用されることが多いです。

## 終わりに {#string-summary}

この章では、JavaScriptにおける文字列(`String`オブジェクト)について紹介しました。
文字列処理するStringメソッドにはさまざまなものがあり、正規表現と組み合わせて使うものも含まれます。

正規表現は、正規表現のみで1冊の本が作れるようなJavaScript言語内にある別言語です。
詳細は[MDNの正規表現ドキュメント][]なども参照してください。

文字列は一見すると単純に見えますが、文字列にはURLやパスといったコンテキストを持つ文字列もあります。
それらの文字列を安全に扱うためには、コンテキストに応じた処理が必要になります。
また、タグつきテンプレートリテラルを利用することで、テンプレート中の変数を自動でエスケープするといった処理を実現できます。


[文字列とUnicode]: ../string-unicode/README.md
[エスケープシーケンス]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String#%E3%82%A8%E3%82%B9%E3%82%B1%E3%83%BC%E3%83%97%E3%82%B7%E3%83%BC%E3%82%B1%E3%83%B3%E3%82%B9
[MDNの正規表現ドキュメント]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions  "正規表現 - JavaScript | MDN"
[regex101]: https://regex101.com/  "Online regex tester and debugger: PHP, PCRE, Python, Golang and JavaScript"
[データ型とリテラル]: ../data-type/README.md
[ECMA-402]: https://www.ecma-international.org/publications/standards/Ecma-402.htm  "Standard ECMA-402"
[Intl]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl
[URL Standard]: https://url.spec.whatwg.org/  "URL Standard"
[URL]: https://developer.mozilla.org/ja/docs/Web/API/URL  "URL - Web API インターフェイス | MDN"
[Path]: https://nodejs.org/api/path.html  "Path | Node.js v7.9.0 Documentation"

[^1]: Unicodeのカタカナの一覧 <https://unicode-table.com/jp/#katakana> から取り出したテーブルです。
