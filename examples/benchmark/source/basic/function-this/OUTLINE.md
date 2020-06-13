



# 関数オブジェクトとthis

目的: 関数のメソッドについてを紹介
目的: thisについてを紹介

## もっと具体的な目標

- 関数の定義方法の振り返り
	- function宣言、function式、Arrow Function
	- nameの関係
- `this`の動きについてを理解する
	- どういうときに使われ、どういう動きをするのか
- 特殊な`this`動きを関数として回避する方法について
	- `var that = this`とArrow Functionon

	- メソッドとしてのcall/apply/bindについて

## 書かないこと

- newとthisの関係 => クラス
- Promiseとthis?
- jQuery、Vue

## アウトライン

### アウトラインパターン1

- タイトル: 関数と`this`
- 目的: `this`にはいくつか扱いがあり、それぞれの動作についてを理解する
- 目的: `this`の原理についてを理解する
- 目的: クラスにおける用法へ備える
- thisは特別なキーワード
	- オブジェクトのように振る舞うがthisは読み取り専用
- thisは暗黙的
	- argumentsのように呼び出し元によってどのような値になるかが決まる
	- 関数はargumentsを束縛する
	- thisは暗黙的だから使う
	- ただしArrow Functionは
- `this`という話
	- ThisModeという視点だと`this`は三種類
		- `global` = undefined
		- `strict` = dynamic
		- `lexical` = static/Arrow Function
- グローバルと`this`
	- Script
	- Module
- 関数と`this`
	- 関数の定義方法
		- Functionキーワード
		- Arrow Function
	- メソッドの定義方法
		- 関数式
		- 短縮記法
		- Arrow Function
	- thisにおいてはArrow Functionとそれ以外に分類される
- Arrow Function以外の関数
	- 関数では`this`は動的に決定される
	- 基本ルール: `this`はベースオブジェクトを示す
	- ベースオブジェクトは関数の呼び方のときのオブジェクトのこと
	- `this`はあくまで実行時に決まる
		- これは関数を実行するときにその関数の環境へ`this`の値が設定される
		- つまり `fn(this = XXX, 実際の引数)`というように呼ばれている
	- 関数宣言における`this`
		- ネストした場合の`this`
			- 所属するオブジェクトとは「ドット演算あるいはブラケット演算でオブジェクトのメソッドを呼んだ時、演算子の左辺に指定したオブジェクト」
			- 関数宣言/関数定義における`this`
	- メソッドにおける`this`
		- メソッドにおいては`this`はベースオブジェクトを示す
		- 短縮記法のメソッドも同じ
		- ネストしたメソッドの場合
	- `this`が問題となるパターン
		- 問題: メソッドを変数に代入した場合
			- 対処法:
				- thisを使わない
				- メソッドはメソッドとして呼ぶ
				- call,apply,bindする
		- 問題: コールバック関数と`this`
			- 問題: コールバック関数の中で`this`を参照するとその`this`が参照するものが代わっていることに気づきにくい問題があります。
			- 対処法:
				- `this`を変数に代入して参照を保持する
					- `that = this`
				- bind
				- Arrow Function
- Arrow Function
	- Arrow Functionでは`this`は静的モードとなる
	- 暗黙的ではなく、静的に`this`が決まる
	- 1つ外側の関数における`this`の値となる
		- 外側の関数がない場合はグローバルオブジェクト or undefinedとなる
	- また`arguments`も束縛しない
	- `this`とスコープチェーン
		- Arrow Functionの場合は`this`は設定できないので、スコープチェーンのように外側のスコープへ探索していく
	- 関数呼び出し
		- グローバルオブジェクト or undeined
	- 関数の入れ子
		- これも関数呼び出しなので同じ
	- メソッド呼び出し
		- メソッド呼び出しの
	- コールバック関数と`this`
		- `this`を持つコールバック関数にはArrow Functionを使うことで問題を回避できる
	- call,apply,bindは効かない
		- `If thisMode is lexical, return NormalCompletion(undefined).`という回避ステップがある
- 結論
	- メソッドはメソッドとして呼ぶ
	- コールバック関数はArrow Functionを使うこと良い
- 未使用
	- 関数
		- `argument`、`super`、`this`、`new.target`を束縛
	- Arrow Function
		- `argument`、`super`、`this`、`new.target`を束縛しない
		- <https://tc39.github.io/ecma262/#prod-asi-rules-ArrowFunction>
	- Strict Mode、Module Contextの細かい違い
		- Top Levelの`this`が違う


### アウトラインパターン -メソッドのみ

- タイトル: メソッドと`this`
- 目的: `this`にはいくつか扱いがあり、それぞれの動作についてを理解する
- 目的: `this`の原理についてを理解する
- 目的: クラスにおける用法へ備える
- thisはメソッド用
	- 元々OOPのものとして導入された
	- しかし、JavaScriptでは関数とメソッドの区別がない
	- そのため、`this`はどこでも使えてしまう
	- しかし、現実的には`this`はメソッドの中でのみ利用するキーワード
- thisは特別なキーワード
	- オブジェクトのように振る舞うがthisは読み取り専用
- thisは暗黙的
	- argumentsのように呼び出し元によってどのような値になるかが決まる
	- 関数はargumentsを束縛する
	- thisは暗黙的だから使う
	- ただしArrow Functionは
- `this`という話
	- ThisModeという視点だと`this`は三種類
		- `global` = undefined
		- `strict` = dynamic
		- `lexical` = static/Arrow Function
- グローバルと`this`
	- Script
	- Module
- 関数と`this`
	- 関数の定義方法
		- Functionキーワード
		- Arrow Function
	- メソッドの定義方法
		- 関数式
		- 短縮記法
		- Arrow Function
	- thisにおいてはArrow Functionとそれ以外に分類される
- Arrow Function以外の関数
	- 関数では`this`は動的に決定される
	- 基本ルール: `this`はベースオブジェクトを示す
	- ベースオブジェクトは関数の呼び方のときのオブジェクトのこと
	- `this`はあくまで実行時に決まる
		- これは関数を実行するときにその関数の環境へ`this`の値が設定される
		- つまり `fn(this = XXX, 実際の引数)`というように呼ばれている
	- 関数宣言における`this`
		- ネストした場合の`this`
			- 所属するオブジェクトとは「ドット演算あるいはブラケット演算でオブジェクトのメソッドを呼んだ時、演算子の左辺に指定したオブジェクト」
			- 関数宣言/関数定義における`this`
	- メソッドにおける`this`
		- メソッドにおいては`this`はベースオブジェクトを示す
		- 短縮記法のメソッドも同じ
		- ネストしたメソッドの場合
	- `this`が問題となるパターン
		- 問題: メソッドを変数に代入した場合
			- 対処法:
				- thisを使わない
				- メソッドはメソッドとして呼ぶ
				- call,apply,bindする
		- 問題: コールバック関数と`this`
			- 対処法:
				- `this`を変数に代入して参照を保持する
					- `that = this`
				- bind
				- Arrow Function
- Arrow Function
	- Arrow Functionでは`this`は静的モードとなる
	- 暗黙的ではなく、静的に`this`が決まる
	- 1つ外側の関数における`this`の値となる
		- 外側の関数がない場合はグローバルオブジェクト or undefinedとなる
	- また`arguments`も束縛しない
	- `this`とスコープチェーン
		- Arrow Functionの場合は`this`は設定できないので、スコープチェーンのように外側のスコープへ探索していく
	- 関数呼び出し
		- グローバルオブジェクト or undeined
	- 関数の入れ子
		- これも関数呼び出しなので同じ
	- メソッド呼び出し
		- メソッド呼び出しの
	- コールバック関数と`this`
		- `this`を持つコールバック関数にはArrow Functionを使うことで問題を回避できる
	- call,apply,bindは効かない
		- `If thisMode is lexical, return NormalCompletion(undefined).`という回避ステップがある
- 結論
	- メソッドはメソッドとして呼ぶ
	- コールバック関数はArrow Functionを使うこと良い

### アウトライン - パターン2

Arrow Functionを前にだす

- タイトル: 関数と`this`
- 目的: `this`についてを理解する
- 目的: Arrow Functionと`this`についてを理解する
- 目的: `this`には3種類の扱いがあり、既存のコードではArrow Function以外での`this`があるため、それを理解する。
- thisは特別なキーワード
	- オブジェクトのように振る舞うがthisは読み取り専用
	- thisは利用する場所、関数の宣言方法、関数の呼び出し方によって異なる値となります
- グローバルと`this`
	- strict modeは常にundefinedとなる
	- [コラム] strict modeはない場合はグローバルオブジェクトを返す
- Arrow Functionと`this`
	- Arrow Function
- thisは暗黙的
	- argumentsのように呼び出し元によってどのような値になるかが決まる
	- thisは暗黙的だから使う
	- ただしArrow Functionは
- `this`という話
	- ThisModeという視点だと`this`は三種類
		- `global` = undefined
		- `strict` = dynamic
		- `lexical` = Arrow Function

- 関数と`this`
	- 関数の定義方法
		- Functionキーワード
		- Arrow Function
	- メソッドの定義方法
		- 関数式
		- 短縮記法
		- Arrow Function
	- thisにおいてはArrow Functionとそれ以外に分類される
- 関数
	- `function`キーワード
	- 短縮記法のメソッド
	- これらにおける`this`は暗黙的
	- 明示的にするにはcall bind applyが利用できる
- Arrow Function
- thisとFunctionキーワード
	- var that = this
- thisとArrow Function
	- thisがlexicalモードになる
- thisを決めて関数を呼ぶ
	- call
	- apply
	- 3rd arguments(Array系))
	- bind
	- `this`はこの影響を受けない
		- `If thisMode is lexical, return NormalCompletion(undefined).`という回避ステップがある


## パターン 3

- 目的: 仕様的な定義をちゃんと解説していく
	- `this`はクラスで使用するものだが、元々は関数がある概念で、その動作は関数とクラスに違いはない
	- そのため、まずは関数やオブジェクトにおいて`this`を学び、その後クラスを見ていく。
- Arrow Functionは `[[ThisMode]]` が Lexicalな関数という定義
	- つまり、`this`が静的に決まることを保証した関数を作る
- 他の`function`キーワードは`[[ThisMode]]`がstrictであるという関数の定義
	- つまり、`this`は動的に決まると関数を作る
- 

> Like we said, in the global context the this value is the global object (the binding object of the global environment record). Previously there was only one global object. In current version of the spec there might be multiple global objects which are part of code realms. Let’s discuss this structure.

現在実行している処理のグローバルオブジェクトを示します。
グローバルオブジェクトは実行艦橋に寄って異なりますがwindowやnOde,jsならglobalなどが該当します、


----


- 未使用
	-  thisとクラス
		- クラスでのthisはとても良く見る形
	- 関数はオブジェクトです。`Function`オブジェクト
	- オブジェクトの中で呼び出せるものを関数と読んでいる
	- しかし、`typeof`はfunctionであるため関数がオブジェクトであることは。強く意識する必要はありません。
	- 文字列や配列のように`Function`オブジェクトだけが持つメソッドやプロパティについて紹介
	- また、その中でも`bind`、`call`、`apply`メソッドに関連する`this`というキーワードについてを紹介します。
	- プロパティ
	- `Function.name`
	- メソッド
	- `toString`
	- [コラム] リフレクションはproductionで使えない
	- あくまでデバッグ用
	- [Function.name - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/name "Function.name - JavaScript | MDN")
	- this
	- thisとはなにか
	- Arrow FunctionとFunction式による違い
	- thisのサンプル


### thisとクラス

`this`はクラスで使われることが多い特別なキーワードです。
クラスのインスタンスを`this`で示すことができます。
しかし、JavaScriptでは`class`そのものがES2015で導入された後付の概念です。
`this`はES2015よりも前から存在し、その動作は関数とクラスにおいて違いはありません。
なぜならクラスも関数の一種にすぎないためです。クラスについては次の章で解説します。

```js
class K {}
```

そのため、`this`の動作原理について関数と`this`についてを学ぶことで、クラスについてもそのまま応用できます。
この章では関数における`this`についてを学んでいきます。


	- getter/setterについて


## thisの名前解決の仕様


`this` bindingの設定は関数を呼ぶときに次のルートで決定される

- https://tc39.github.io/ecma262/#sec-evaluatecall
- https://tc39.github.io/ecma262/#sec-call
- https://tc39.github.io/ecma262/#sec-ecmascript-function-objects-call-thisargument-argumentslist
- https://tc39.github.io/ecma262/#sec-ordinarycallbindthis

Write: 関数呼び出するときに、事前に`[[ThisValue]]`を決める処理が実行される。
`[[ThisValue]]`には次のステップの結果が入る。(ただしArrow Functionはlexicalなので`[[ThisValue]]`を持たない。[Arrow Functionの詳細](https://tc39.github.io/ecma262/#sec-ordinarycallbindthis))

- [12.3.4.2Runtime Semantics: EvaluateCall(func, ref, arguments, tailPosition )](https://tc39.github.io/ecma262/#sec-evaluatecall "12.3.4.2Runtime Semantics: EvaluateCall(func, ref, arguments, tailPosition )")
- プロパティならば
	- `this`はGetThisValueの結果
		- `super.prop`なら
			- `super`となる
		- それ以外なら
			- [6.2.4.1GetBase ( V )](https://tc39.github.io/ecma262/#sec-getbase "6.2.4.1GetBase ( V )")の結果 - いわゆるレシーバが`this`となる
- それ以外(ただの関数呼び出し)なら[WithBaseObject](https://tc39.github.io/ecma262/#sec-object-environment-records-withbaseobject)の結果
	- withの場合
		- with bingingの値
	- それ以外
		- undefined

Read: `this`を読み取るときは、次のステップで探索する。

- https://tc39.github.io/ecma262/#sec-getthisenvironment
	- `this`の解決はスコープと同じく、一個つづ順に内側から外側へ探すのはスコープと同じ
	- ただし、Arrow Functionは`[[ThisValue]]`を持たないので必ずスキップされる
	- つまり、もっと近いコンテキストの`[[ThisValue]]`の値が`this`となる

## 簡略化した説明

-  Arrow Function以外の関数においては
	- thisの値はその関数が所属していたオブジェクトとなる
- Arrow Functionにおいては
	- <del>1つ外側の関数またはグローバルオブジェクトとなる</del>

## 説明

-  Arrow Function以外の関数において
	- `var`はグローバルオブジェクトに変数が付く => windowになる
	- `const`はグローバルではなくその下のLexical Envに変数が付く => undefinedになる
- Arrow Functionにおいては
	- グローバル
	- or 関数



## Note


### `this`は暗黙的な引数

関数においては`this`は暗黙的に渡されるような引数となる。
つまり`fn`という関数を呼ぶときに自動で`this`を`fn(実際の引数, this = XXX)` のように渡している。
一方、Arrow Functionの場合は`this`を持たない(引数に渡さない)ため、そのArrow Functionの中では`this`はスコープチェーンのように外側の(関数)スコープへ探索する。
(スコープチェーンとは異なり、`this`は関数スコープまたはグローバルスコープにしか定義されていないため、関数スコープを辿るような挙動をする)

仕様としても`[[Call]]`には`this`を引数として渡している。
これは`call`メソッドを使うことで明示的に渡すことができる。

- https://tc39.github.io/ecma262/#sec-call


### `this` in the future

個人の感想としては関数(`function`)やオブジェクトのメソッドにおいて`this`を積極的に利用する理由はあまりないと考える。
引数を一つ省略出来るという見た目上の美しさがありデザインパターンとして使われることがあるが、それ以上にthisは動的かつ暗黙的だから難しくなるためである。
この書籍では、芸術的に書くよりも読んで分かる書いても分かるものを目指すべきである。

- https://github.com/tc39/proposal-bind-operator
- `this`のダイナミックさを最大限活用しようとしたProposal
- https://github.com/tc39/proposal-pipeline-operator
- 一方のpipeline operatorは`this`がない


### FAQ


### オブジェクトのメソッド内のArrow Functionのthis

```js
"use strict";
var o = {
	m(){
	   var inner = () => this;
       return inner();
	}
}
var m = o.m;
console.log(m()); => undefined
```

この時の`this`がなぜundeinedになるか

1. `o.m` ではなく `m()`で実行されている
2. `m`は関数なので、実行するときに`m`のFunction Envの`[[ThisValue]]`には値が設定される
	3. <https://tc39.github.io/ecma262/#sec-evaluatecall>
3. この時の`[[ThisValue]]`は`m`がプロパティではないので、`Let thisValue be refEnv.WithBaseObject().`となる
	4. `WithBaseObject`は`with`じゃないなら`undefined`となる
5. つまり`thisValue`は`undefined`となる
6. そして、`inner`を実行する
7. `inner`はArrow Functionなので、`[[ThisValue]]`を設定できない
8. `inner`における`this`は、自身の外側の関数の`[[ThisValue]]`となる
9. つまり、先ほど設定した`undefined`が`this`の値となる


### 何故 () => this global?

- [ecmascript 6 - use strict in javascript not working for fat arrow? - Stack Overflow](https://stackoverflow.com/questions/36427862/use-strict-in-javascript-not-working-for-fat-arrow "ecmascript 6 - use strict in javascript not working for fat arrow? - Stack Overflow")
- <https://github.com/anba/es6draft/blob/7e196e8a1482384ca83946998f5fbd22068b47c6/src/main/java/com/github/anba/es6draft/runtime/GlobalEnvironmentRecord.java#L194-L202>
- GlobalEnvはhasThisBindingが`true`なのでthisの対象になる。
	- 最終的にthis lookupの最後になる。

### `this`は暗黙的な引数ですか?

YES

- <https://tc39.github.io/ecma262/#sec-call>
- `[[Call]]`において暗黙的渡された`V`が`This`です

## 開眼JavaScriptの`this`の章

開眼JavaScript

- this とは何か、および this は何を参照するか
	- `obj.method` を `this.method`に置き換える例
	- `this`は混乱する
	- new、call,apply,bindは別
- this の値はどのように決められるのか?
	- コンテキストに基づく
- 入れ子関数内では、this は グローバルオブジェクトを参照する
	- ES5で直るパターン
- 入れ子関数内で this を見失う問題を スコープチェーンを使って回避する
	- `var that = this`
- call() や apply() を使って this の値を コントロールする
- this キーワードをユーザ定義の コンストラクタ関数で使う
	- newは特別
- プロトタイプメソッド内の this は 生成されるインスタンスを参照する

## ['this' in TypeScript · Microsoft/TypeScript Wiki](https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript "&#39;this&#39; in TypeScript · Microsoft/TypeScript Wiki")

- `this`がどのような問題を持っているか
- その問題となる実例
	- Event Listener
	- コールバック
	- オプションオブジェクト
	- Promiseなど
- その中でも特に間違いが多いRed Flagsの例
	- 代入
	- イベント
- 問題の解決方法について
	- public method = () => {}
	- local () => {}
	- Function bind

## [This in JavaScript | Zell Liew](https://zellwk.com/blog/this/ "This in JavaScript | Zell Liew")

- コンテキストに基づく`this`の動きについて

----


## 初めてのJavaScript

- thisはread-only
- thisは通常bindする
- thisは呼び出され方に依存する
	- 説明的なthisコード
- メソッにおけるthis
	- self = thisでのbind
	- これはArrow Functionで避けれるよ
- Arrow Function
- call
- apply
- bind

```js
const o = {
name: 'Wallace',
speak() { return `My name is ${this.name}!`; }, }
```


## パーフェクトJavaScript

- thisは読み取り専用の変数
- どこからでも使える
	- Javaとかではメソッドに暗黙的に渡す引数とみなせる
	- JavaScriptではグローバルや関数でも使える
- thisの参照の規則
	- 関数内でのthisの参照規則
	- コンストラクタ: 生成したオブジェクト
	- メソッド呼び出し: レシーバーオブジェクト
	- apply、call: 指定したオブジェクト
	- それ以外: グローバル
- レシーバーとは、ドット演算子あるブラケット演算子の左辺にしたオブジェクトです
- thisは呼び出し元によって決まる
- thisの注意点
- クラスベースでは基本的にはレシーバーはクラスのインスタンス
- 恣意的な例
	- `var m = obj.m`
	- グローバルになる
- JavaScriptでは実行時にthisが決まるため、省略することができません
	- 省略するとその識別子と同じ変数を探索する
- applyとcall
- コールバックの注意点
	- applyとcallを使う
- ...プロトタイプ継承...


----

## [Speaking JavaScript](http://speakingjs.com/es5/ "Speaking JavaScript")

> [Chapter 17. Objects and Inheritance](http://speakingjs.com/es5/ch17.html#_this_as_an_implicit_parameter_of_functions_and_methods "Chapter 17. Objects and Inheritance")


- non-strict modeの`this`はglobal
- strict modeの`this`はundefined
- メソッドにおける`this`は所属してるオブジェクト
- call,apply,bind
- bindの掘り下げ
- applyのconstructor
- Pitfall: `var fn = obj.fn`した時の`this`の問題
- Workaround: bind
- Pitfall: メソッド内の入れ子関数の問題`this.friends.forEach`の中での`this`の問題
- Workaround: that = this
- Workaround: bind
- Workaround: 3rd argumetns