# 文字列

## アウトライン

目的: 自由な文字列を作れるようになること

- 文字列
- 文字列を作成する（リテラル）
- 文字列を結合する
- 文字列とは
    - 配列っぽい
    - Code Point
    - Code Unit
- 文字列の分解
    - split and join
    - `String#split`と空文字列
- 文字列の長さ
    - 通常の文字列
    - サロゲートペア（視覚とは異なる長さ）
    - Code Pointの数
- 文字列の比較
    - 比較
    - `<`、`>
    - ローカライズと比較
- 部分文字列の取得
- 文字列の検索
    - 文字列による検索
        - インデックス
        - マッチ
        - 真偽値
    - 正規表現による検索
        - インデックス
        - マッチ
        - 真偽値
    - 文字列と正規表現
- 文字列の置換
- 文字列の削除
- 文字列の組み立て
    - URL
    - タグ付きテンプレート関数
- 終わりに

##　分離案

目的: 自由に文字列処理出来るようになること。
JavaScriptと内部的な文字コードについて知ること。

- 文字列処理
- 正規表現を使った文字列処理
- 期待する文字列の出力
- JavaScriptの文字コード

問題: 後ろに重たくて面倒なものが集まるため、モチベーションをいじする内容じゃないとダメそう

----

- 文字列
- 文字列を作成する（リテラル）
- 制御文字
    - 改行記号、タブ
    - ユニコード
- 文字列を結合する
- 文字列へのアクセス
    - インデックスアクセス
- 文字列の分解
    - split and join
- 文字列の長さ
    - 通常の文字列
- 文字列の比較(一致)
-  [コラム] i18n @コンテキスト
- 部分文字列の取得
- 文字列の検索
    - 文字列による検索
        - インデックス
        - マッチ
        - 真偽値
    - 正規表現による検索
        - インデックス
        - マッチ
        - 真偽値
    - 文字列と正規表現
- 文字列の置換
- 文字列の削除
- 文字列の組み立て = 目的
    - タグ付きテンプレート関数 @コンテキスト
- JavaScriptと文字コード
    - JavaScriptはUTF-16
    - Code Point
    - Code Unit
    - Iterator
    - サロゲートペアが問題となるのは1文字という視覚に依存した単位を扱う処理のケース
    - 文字列の分解
        - `String#split`と空文字列
    - 文字列の長さ
        - サロゲートペア（視覚とは異なる長さ）
        - Code Pointの数
        - カーソルの位置の問題
    - 文字列の比較
        - 比較
        - `<`、`>`
    - 文字列のスライス = 正規表現の一致
        - スライス = 指定した位置移行を取り出したい、半荷を取り出したい
        - https://twitter.com/azu_re/status/1088087626840629249
    - 絵文字
- 終わりに

##　分離案

目的: 自由に文字列処理出来るようになること。
JavaScriptと内部的な文字コードについて知ること。

- 文字列処理
- 正規表現を使った文字列処理
- 期待する文字列の出力
- JavaScriptの文字コード

ref [JavaScript における文字コードと「文字数」の数え方 | blog.jxck.io](https://blog.jxck.io/entries/2017-03-02/unicode-in-javascript.html)

## 文字列 整理していく方法

問題: セクションごとに常に反例がでてきてしまって読みにくい

- 文字列
- 文字列を作成する（リテラル）
- 文字列を結合する
- 文字列とは
    - 順序づいた文字の集合
    - 文字は視覚的なもの
    - 内部的にはUTF-16でエンコードされて保存されている
    - UTF-16とは~
- 文字へのアクセス
    - `string[0]`
    - 指定したインデックスが文字ではなくバイト列の場合がある = サロゲートペアなど
    - サロゲートペアをうまく扱うには…
    - 絵文字 
- 文字列の分解
    - split and join
- 文字列の長さ
    - 通常の文字列
- 文字列の比較
    - 比較
    - `<`、`>`
-  [コラム] i18n @コンテキスト
- 部分文字列の取得
- 文字列の検索
    - 文字列による検索
        - インデックス
        - マッチ
        - 真偽値
    - 正規表現による検索
        - インデックス
        - マッチ
        - 真偽値
    - 文字列と正規表現
- 文字列の置換
- 文字列の削除
- 文字列の組み立て = 目的
    - タグ付きテンプレート関数 @コンテキスト
- JavaScriptと文字コード
    - JavaScriptはUTF-16
    - Code Point
    - Code Unit
    - Iterator
    - 文字列の分解
        - `String#split`と空文字列
    - 文字列の長さ
        - サロゲートペア（視覚とは異なる長さ）
        - Code Pointの数
    - 絵文字
- 終わりに


## 参考 {#reference-for-string}

- [What every JavaScript developer should know about Unicode](https://rainsoft.io/what-every-javascript-developer-should-know-about-unicode/)
- Unicodeについて
    - [「文字数」ってなぁに？〜String, NSString, Unicodeの基本〜 - Qiita](http://qiita.com/takasek/items/19438ecf7e60c8d53bbc)
    - [プログラマのための文字コード技術入門 | Gihyo Digital Publishing … 技術評論社の電子書籍](https://gihyo.jp/dp/ebook/2014/978-4-7741-7087-9)
    - [文字コード「超」研究　改訂第2版【委託】 - 達人出版会](http://tatsu-zine.com/books/moji-code)
    - [Unicode のサロゲートペアとは何か - ひだまりソケットは壊れない](http://vividcode.hatenablog.com/entry/unicode/surrogate-pair)
    - [文字って何かね？ - Qiita](http://qiita.com/matarillo/items/91b9656428bed7a1a797)
    - [ものかの >> archive >> Unicode正規化　その１](http://tama-san.com/old/document03.html)
    - [結合文字列をUnicode正規化で合成する方法の危険性 - Qiita](http://qiita.com/monokano/items/d4c37d9bc9833eaeda6e)
    - [Unicode（絵文字） - CyberLibrarian](http://www.asahi-net.or.jp/~ax2s-kmtn/ref/unicode/emoji.html "Unicode（絵文字） - CyberLibrarian")
    - [Unicode Emoji](http://unicode.org/emoji/ "Unicode Emoji")
    - [JavaScript における文字コードと「文字数」の数え方 | blog.jxck.io](https://blog.jxck.io/entries/2017-03-02/unicode-in-javascript.html)
- 国際化APIについて
    - [Intl - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation)
    - [andyearnshaw/Intl.js](https://github.com/andyearnshaw/Intl.js/)
    - [ECMAScript® 2017 Internationalization API Specification](https://tc39.github.io/ecma402/)
    - [ウェブサイトをグローバル化するために便利なIntl APIの話 - Qiita](http://qiita.com/teyosh/items/b126f21a16b795885067 "ウェブサイトをグローバル化するために便利なIntl APIの話 - Qiita")
    - [カスタムの大文字と小文字の対応規則および並べ替え規則](https://msdn.microsoft.com/ja-jp/library/xk2wykcz(v=vs.110).aspx "カスタムの大文字と小文字の対応規則および並べ替え規則")
- 文字列の検索について
    - [四章第一回　文字列の操作 — JavaScript初級者から中級者になろう — uhyohyo.net](http://uhyohyo.net/javascript/4_1.html "四章第一回　文字列の操作 — JavaScript初級者から中級者になろう — uhyohyo.net")
