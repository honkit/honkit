
# 関数とスコープ

- スコープ
- Next: this

## アウトライン


- @機能 関数はスコープを作り出します
- @目的 スコープを賢く使うことで読みやすいコードを書くことができ、また意図しないコードを減らせることを学ぶ
- スコープとはどのようなものか
	- @提起 スコープと変数宣言には大きな関連があります。 
	- @理由 なぜなら`let`や`const`、`function`文などはすべてそのスコープへ変数を宣言して値を関連付けるためです
	- @命名 関数などでブロックを使っているこれがいわゆるスコープ
	- @事実 スコープの中にある変数は外からアクセスできない
	- @事実 引数はスコープの中にある変数なので外からはアクセスできない
	- @事実 逆にスコープの中から外にある変数へアクセスすることはできる
	- @関連 スコープと変数宣言
- @分類 ブロックスコープ
- @機能 スコープチェイン
	- スコープチェインの仕組みを学ぶ
- @分類 グローバルスコープ
	- @目的 グローバルスコープとはすべての関数で共有されているスコープということを理解する
		- 多用するべきではない点についてはコラムで扱う
	- 別名は大域スコープ
	- グローバルスコープとは何か?
	- 暗黙的に生成されるスコープで、プログラム直下はグローバルスコープである
	- グローバルスコープはすべてのスコープで共有する変数が扱われる
		- 少しでもグローバルスコープは減らしたほうがいい
		- ならなら関数の中で未定義であっても、グローバルスコープに定義されているなら参照できるため
		- うっかりミスで例外がでないけどなぜか動いているというコードがつくらてしまう。
	- global
	- ビルトインオブジェクトが参照できるのもスコープチェイン仕組みによる
	- [x] 確認: 仕様ではどのような言及
	- https://tc39.github.io/ecma262/#sec-global-environment-records
- @名前解決 スコープ間で同じ変数の定義とshadowingの問題
	- スコープチェインの仕組みを理解するとなぜ起きるのかが分かる
- @コラム スコープは小さく、変数の影響範囲は小さく
	- @具体例 swithchをスコープに閉じ込めて結果だけを取り返す方法
	- 変数を不用意にグローバルに書いてしまうと影響範囲がお多い
	- そのため必要なスコープで必要な変数を定義する
	- 複数のスコープで共有する変数は?
		- => いわゆるデザインパターンの世界
	- 必要なスコープで必要な変数を定義する
- varとhoistingについて
	- `var`のhoisting
	- `function`宣言と`const fn = function`の違い
	- TDZについて
- スコープと変数の生存期間
	- @疑問 スコープを抜けた場合にすぐに変数が消滅している?
	- @反例

```js
function createObj(){
	const inner = {};
	return inner;
}
// スコープを抜けた後も`inner`の変数は生きている?
const obj = createObj();
console.log(obj);// => {}
```

	- @事実 一つの変数が複数のスコープに紐づくことがある
- @誤解 スコープの中にある変数は、その関数が終了したから消えるわけではない。
- @詳細 アクセスがなくなったときに初めて消える = ガーベージコレクション
	- @確認 ガーベージコレクションは仕様ではどのような表現?
- @分類 静的なスコープと動的なスコープ
	- ある変数がどのスコープにあるのかは見て分かる
	- スコープには関数スコープ、catchのスコープなど何種類化ある
	- 基本的には `{ }` で囲まれたブロック
	- スコープにLexiacal Envという変数が作成され、変数はこのEnvに紐付けられる
	- 静的なスコープ
		- functionや
	- @http//azu.github.io/annotation-memo/es6-draft/
		- 動的なスコープ
				- withとeval
				- [JS scope: static, dynamic, and runtime-augmented – codeburst](https://codeburst.io/js-scope-static-dynamic-and-runtime-augmented-5abfee6223fe "JS scope: static, dynamic, and runtime-augmented – codeburst")
- @活用 クロージャー
	- @構成要素
		- 変数とスコープの生存期間
		- スコープチェイン
		- 静的なスコープ
	- 変数の生きてる例
	- クロージャーはファクトリと言えそう
		- <http://www.sbcr.jp/products/4797388640.html>
	- @応用 ファクトリをその場で作って定義は捨てるIIFE
	- @具体的 正規表現の初期化コスト
- 未使用
	- 関数の仮引数は上書きして宣言できない
	- [9.6 Parameters as variables](http://exploringjs.com/es6/ch_variables.html#sec_parameters-as-variables "9.6 Parameters as variables")

**Note**:

スコープの説明パターン

- コードで説明する
	- 初めてのJavaScript
- 図で説明する
	- JavaScript本格入門
	- [You-Dont-Know-JS/ch1.md at 31e1d4ff600d88cc2ce243903ab8a3a9d15cce15 · getify/You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS/blob/31e1d4ff600d88cc2ce243903ab8a3a9d15cce15/scope%20%26%20closures/ch1.md "You-Dont-Know-JS/ch1.md at 31e1d4ff600d88cc2ce243903ab8a3a9d15cce15 · getify/You-Dont-Know-JS")
- 擬似コードで説明する
	- 仕様をコードにする


## 関数とスコープ: 序文: なぜスコープは大事？

- スコープと名前解決
		- プログラミングで重要な概念は値を変数に保存して、必要なときに取り出して使うことです
		- 関数も値であるので、関数を変数に保存して、必要な処理を再利用できます
		- しかし変数は同じ名前をスコープに宣言することはできません
		- 何かアプリケーションを作成する際に、あらゆるところから取り出す必要がある値よりも一時的な値、つまり一時的な変数の方が多いです
		- つまり、ひとつのグローバルスコープへすべての変数を定義する必要性はありません
		- むしろ変数は必要なスコープの中でのみ扱い、その中で完結することが見た目どおりのコードへつながります
- 関数とプログラミング
		- 関数を使わなくてもプログラミングはできます
		- 多くのプログラミング言語は人間が書くために作られたものです
		- すべての処理を関数を使わずに書くこともできその処理結果は同等です
		- しかし次のように関数を使うことで人間が読んで分かるコードを書きやすくなる


## 関数とスコープ: 未使用

- スコープは**静的**に決定される
	- そのため見た目よりははるかに分かりやすい
	- 開眼JavaScript参照
	- スコープチェインの参照は動的(実行時に)おこなわれる
- クロージャー
	- クロージャを一言で表すと「スコープチェーンに存在する変数への参照を(囲い込んで)保持している関数」と言えます。
	- 開眼JavaScript参照
- ScopeとEnvironment
	- scopeによって定義されたenvironment
	- EnvironmentはRecordから構成される
	- inner env -> outer envによりスコープチェインという現象が起きる
	- <https://tc39.github.io/ecma262/#sec-lexical-environments>
- Scope chain
	- https://tc39.github.io/ecma262/#sec-newdeclarativeenvironment
	- スコープを作成するときにouter lexicale envへのリファレンスを
- A global environment is a Lexical Environment
	- GlobalもLexicalの一種
	- globalはouterがnull
- Envの種類
	- <https://tc39.github.io/ecma262/#table-23>
	- LexicalEnv
		- letやconst、classはこちらに登録する
		- https://tc39.github.io/ecma262/#sec-let-and-const-declarations
	- VariableEnv
		- varはこちらに登録する
		- https://tc39.github.io/ecma262/#sec-variable-statement
	- この２つのenvは同じことがあり、実行Contextに紐づく
- module environment もあるよ
	- module envはglobal envとなることがある
- function environment は`this`の新しいバインディングを作成する
- GlobalとLocal Scope?
	- Localという言葉を使うことでの矛盾が起きるかどうか
	- 仕様ではLocalはない、Globalはある
	- lexical scopeという分類のうち、色々あるという体後
	- var 命令を使わずに宣言された変数はすべてグローバル変数と見なす
- Global scopeのメタファ
	- https://github.com/getify/You-Dont-Know-JS/blob/31e1d4ff600d88cc2ce243903ab8a3a9d15cce15/scope%20%26%20closures/ch1.md#building-on-metaphors

擬似コードでのスコープ

```js
const globalScope = {
		outer: null, // <= globalより外側のスコープはないためnull
		envRec: new Map(), // <= envRecはスコープ毎に作られる
};
// globalスコープには`outer`変数が定義されていり
// 変数はglobalスコープのenvRecに記録される
globalScope.envRec.set("outer", "out");

// function宣言により関数fnのスコープを作成する
const fnScope = {
		outer: globalScope, // <= 現在の実装スコープ = globalScope
		envRec: new Map() // <= envRecはスコープ毎に作られる
		// Object.create(null) = arguments
		// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
};
// function fnの中の変数処理
// `arg` 仮引数はfnScopeのenvRecに記録される
fnScope.envRec.set("arg", 1);
// 関数スコープ内で宣言された`inter`変数もfnScopeのenvRecにされる
fnScope.envRec.set("inter", "in");
// fnScopeのなかで`outer`変数を参照する
// この時のcurrentScopeはfnScope
getValue("outer", fnScope);

function getValue(variableName, currentScope) {
		if (!currentScope) {
				throw new Error(`変数:${variableName}は定義されていません`);
		}
		// 現在のScopeのenvRecに変数が定義されているならそのenvRecから取り出す
		if (currentScope.envRec.has(variableName)) {
				return currentScope.envRec.get(variableName);
		} else {
				// ない場合は、outerのscopeに訪ねに行く
				return getValue(variableName, currentScope.outer);
		}
}
```

## Arrow Functionとthis

- Arrow Functionでは`this`が`[[ThisMode]]`が`lexical`になる
- https://tc39.github.io/ecma262/#sec-functioninitialize
- lexicalではもっとも近いfunctionを参照するようになる = 


-----

## スコープとは何?

- @目的 コードとしては見えないがスコープとは何かを身近な例を元に理解する
- スコープは暗黙的に作られれるが意識すればスコープはわかる
	- なぜなぜ暗黙的な変換などと違いスコープは静的に決定されるため
- @関数 最も身近に見ることができるスコープは関数のスコープです。
- @スコープ この関数の`{`と`}`ブロックを使っているのがスコープ
- @変数 スコープは変数の名前を解決するプロセスと大きく関わります
- @具体例 関数は宣言するとスコープを作成するため、スコープの中と外で変数の名前を解決できる範囲がことなります。
		- スコープの中から外の変数は参照できる
		- 一方スコープの外から中にある変数は参照できません
		- 同じスコープに同じ名前の変数は宣言できません


```js
function fn() {
		const x = 1;
		console.log(x); // => 1
}
console.log(x); // => ReferenceError: x is not defined

```

```js
const x = 1;
const x = 2;
```

- 目的スコープとはそもそもどういうものなのかを解説する
- スコープにはいくつか種類があります
- 最も身近なスコープは関数スコープです
- 変数を宣言した時、変数名とその変数の値は今いるスコープに紐付けられます。
- 具体的な次のコードの `x` は 関数 `a` に紐付いた変数として宣言されています。
- そのため、関数 `a` の外側(のスコープ)からは 変数 `x` を参照することはできません。
	- 具体的なコード
- 別の読み方をしてみましょう。
- letやconstで宣言した変数名は1つのスコープないでは１つのみです



## ブロックスコープ

- @目的 ブロックにもスコープがあることを知る
- 関数スコープは関数によるスコープですが、`{`と`}`で囲んだブロックもスコープを作成します。（「文と式」を参照）
- @具体例 ブロックの内側で宣言した変数はブロックの外側から参照できません
- ブロックは `if文` や `for文` なども同様です
- @具体例 for文は変数の宣言とブロックを同時に扱うため少し特殊に見えますが、iterationごとに新しいブロックをスコープを作り出します。
- Note: letとforのスコープはIterateごとに新しく作られる
	- [9. Variables and scoping](http://exploringjs.com/es6/ch_variables.html#sec_let-const-loop-heads "9. Variables and scoping")
	- [CreatePerIterationEnvironment](http://www.ecma-international.org/ecma-262/6.0/#sec-createperiterationenvironment "CreatePerIterationEnvironment")

## スコープチェイン

- @目的 スコープがネストした時の名前解決について学ぶ
- @事実 関数スコープ、ブロックスコープで既に分かるかもしれませんが、スコープはネストできます
- スコープが別々ではなくスコープが入れ子となった場合の同じ名前には最も近い内側のスコープにある変数の名前を解決します。
- スコープがネストした時、変数の名前解決は現在いる位置のスコープから順番に外側のスコープかを確認していきます。
- @具体例 外側のスコープに変数定義が存在するケース(参照できる)
- @具体例 外側のスコープにも変数定義が存在しないケース(ReferenceError)
- @命名 この仕組みスコープチェーンと呼ばれています。以前オブジェクトで紹介したプロトタイプチェーンとよく似た仕組みと言えます。
- ネストしたスコープで同じ名前の変数が定義されていた場合も内側から外側のスコープへと順番に確認していきます。
- 異なるスコープ または `let` or `const` で宣言した変数でなければ同じ名前の変数を定義することができます。
- @具体例 外側のスコープと同じ名前で定義した場合のコード例
	- `name`という変数を定義した例
	- Notes: ビルトインオブジェクトについてはグローバルスコープで話す
- Notes:
	- 唯一の違いは、プロトタイプチェーンはオブジェクトのプロパティであるため、該当結果がない場合はundefineを返します。一方スコープチェーンの名前解決結果で該当結果がない場合は`ReferenceError: x is not defined`のようにReferenceErrorが発生します。


## グローバルスコープ

- @目的 グローバルスコープは暗黙的に存在し強力だが、強くは依存していはいけないことを知る
- @事実 グローバルスコープとはプログラム直下の暗黙的に作られているスコープのこと
- @事実 グローバルスコープに定義された変数はどのスコープからも参照できる
- @問題 グローバルスコープにはJavaScriptのビルトインオブジェクトがあり実行環境が定義する様々な関数や値が定義されています。
- @問題 グローバル変数がビルトインオブジェクトと同じ名前で定義してしまうと、そのスコープではビルトインオブジェクトへアクセスすることができなくなります。
- @具体例 `URL`の再定義
- グローバル変数とビルトインオブジェクト
- @解決 グローバル変数の利用を極力抑えることがこの問題の解決方法の一つです。
- @具体例 例えばグローバルに置く変数をオブジェクトとしてまとめたり、関数を使ってグローバルに直接変数を定義しなくすることが有用です。
- @具体例 ???
- @コラム モジュールとモジュールスコープ
	- 実践的にはJavaScriptのモジュールにも関数と同様にモジュールスコープが存在します。
	- モジュール直下に定義された変数はexportしない限り他のモジュールからは参照できません。
	- つまりモジュールスコープに変数を定義すればグローバル変数はないということです。
	- そのため、関数などの処理をモジュールに分けていくことで自然とグローバル変数の利用は減っていきます。
- 未使用:
	- グローバルスコープの反対はローカルスコープと言われることがあります
	- ローカルスコープはグローバルスコープ以外のスコープなので関数、ブロックなど
- Note: グローバル変数とビルトインオブジェクト
	- グローバルオブジェクトのプロパティがグローバル変数のこと
	- ビルトインオブジェクトのプロパティがparseIntなどホスト環境が定義しているものがあり様々
	- どちらもグローバルスコープにあり、`x` という名前を解決するときにグローバル変数が優先して解決される
	- そのため、ビルトインオブジェクトと同じ名前のグローバル変数を定義すると、そのプログラムでビルトインオブジェクトを使うことができなくなる
	- グローバル変数の定義
		- varはglobal objectのプロパティで
		- let constはグローバルスコープの変数定義
		- current -> module variable -> global variable -> global object -> built-in object で解決される
		- [9. Variables and scoping](http://exploringjs.com/es6/ch_variables.html#sect_global-object "9. Variables and scoping")
	- `URL`などをグローバル変数として定義すると悲惨なことになる

```js
const a = 2;
window.a = 1;
console.log(a) // => 2
```

- 未使用
	- @問題 どこからでも参照できるということは便利では、一方ではグローバル変数の乱用は不必要な依存性を作り出してしまいます。
	- @具体例 


----

## [コラム] スコープを小さく

- @目的 スコープを小さく書くことで何が良くなるのかを例題から学ぶ
- グローバル変数に限らす変数のスコープを小さくすることはいいこと
- モジュールもモジュールのスコープを持つため、モジュールに分けることもスコープを小さくすることにつながる
- 状態を表す変数のスコープを小さくするにはクロージャーが必要になる
	- クロージャーでもスコープを小さくするテクニック


定数が複数の関数で利用されているケース

```
var 消費税 = 0.8;
function multiple(){
	return x * 消費税;
}
function add(){
	
}
```


不要な一時的な変数をグローバル変数にするのを避ける

```js
// before
const start = Date.now();
task();
const end = Date.now();
console.log(end - start);

// after
function doTask(callback){
	const start = Date.now();
	callback();
	return Date.now() - start;
}
doTask(task);
```

一度しか実行できない関数(クロージャが必要)

```js
// Before: グローバルにsubmmitedというフラグが見えている
let submmitted = false
function submit(data){
	if(submitted){
		return
	}
	// ... データを処理 ...
	submmitted = true;
}
```


## 関数スコープとvarの巻き上げ

- @目的 varは巻き上げにより関数スコープに紐づくという特殊な動作を理解する
- @前提 すべてを今から新しく書くなら`var`を使う理由は一つもありません
	- `let`か`const`を常に使います
	- しかし、既存のコードやライブラリなどでは`var`が使われていることがあります
- @命名 `var`にはもっとも近くの関数またはグローバルスコープへ紐づくという**巻き上げ**と呼ばれる特性があります。
- @具体例 巻き上げの動作を順番に見ていきます
	- letやconstは宣言より前にその変数を参照することができません(TDZ)
		- [JavaScript variables hoisting in details](https://dmitripavlutin.com/javascript-hoisting-in-details/)
		- [9. Variables and scoping](http://exploringjs.com/es6/ch_variables.html#sec_temporal-dead-zone)
	- 一方varでは、宣言より前にその変数を参照することができます。
		- ただし、その評価結果は常に`undefined`となります。
	- これは`let`が変数の宣言と初期化が同時に起きるのに対して、`var`は変数の宣言と初期化が異なるタイミングで行われることにより発生しています。
	- varによる変数宣言を分解してされる
		- 宣言
		- 代入
		- Notes:
			- Effective JavaScriptでは変数(var)宣言の振る舞いは、宣言と代入の2つで構成されていると理解すれば巻き上げの説明がし易い
			- これは`var`、`let`どちらも同じ(TDZはこれの互換性のために定義された仕様っぽい感じはある)
			- https://twitter.com/azu_re/status/911872145252159488
			- https://twitter.com/azu_re/status/911874213971034112
			- varで宣言された変数はLetのLexicalEnviromentとは異なり、VariableEnvironmentに紐づく
			- https://tc39.github.io/ecma262/#sec-execution-contexts``
	- @具体例 巻き上げられた処理の擬似コード
	- @事実 巻き上げはもっとも近くの関数スコープまたはグローバルスコープに変数が紐づく
		- つまりブロックスコープを無視します
		- @具体例 次のようにforループとvarを組み合わせ組み合わせるとおきる問題があります
		- @反例 一方ブロックスコープがあるletではこの問題がおきません。
- @まとめ この結果varを使った場合の問題としては次のものがあります。
	- 宣言された文より前に変数にアクセスすることがでる
		- typeofもTDZではReferenceError
		- 「変数の隠蔽」と組み合わさることで問題が複雑化する
	- ブロックスコープを無視する
		- hoistingはもっと近いfunctionまで巻き上がる
		- ifやforなどでブロックスコープの中にあるものがvarだと外から見えてしまう
- @事実 「varにはブロックスコープがない」
	- @事実 ES2015より前は`var`しかありませんでした
	- @事実「ES2015より前にブロックスコープはない」はただしい
	- @事実 ES2015以降はブロックスコープがあるので「ES2015以降はブロックスコープがある」
	- @仕様 ES2015で、`var`と`let`と`const`が両立できるように`var`は特別扱いされるルールが追加されている
- @分類 また`var`ほど問題にはなりませんがfunction宣言も似た動作を持っています
- 未使用
	- varとletの違い
		- varで宣言した変数は、宣言する前でも参照できる
		- varで宣言した変数は、ブロックスコープを無視するように振る舞う
		- varは同一のスコープに同じ名前で変数を宣言できる

## function宣言（文）とfunction式のhoisting

- function宣言もES2015より前に導入された宣言方法です
- これもvarと同様にhoistingされます
- しかしvarとはことなり大きな問題となることはあまりありません
- なぜなら undefined で初期化されることはなく、宣言された文よりまえでも正しく呼び出すことができるからです。

## クロージャー

- 目的: クロージャーとはどのようなものかやなぜ動くのかを理解する
- 目的: 具体的に関数が状態を持てるというカウンターの例が動くことを理解する
	- 発展として初期化が一度だけで済むパターンについて理解する
	- 関数オブジェクトとクロージャーの違い
	- 静的スコープと変数の生存期間2つの性質からクロージャーがなぜ動くかを説明する
- この章のすべての知識を利用してクロージャーという仕組みについてを見ていきます。
- 最初にクロージャーが実際に動作をしていく例を見ますが、このセクションの最後にこれが理解できるように順番に解説していくため、まだ分からなくてもいいです。
- @具体例 カウンターとクロージャー
- クロージャーの動作を見る前に、今まで説明していなかったスコープと変数の参照の性質について見ていきます。
- 静的スコープ
	- JavaScriptのスコープに変数の参照先は静的に決定されます
	- どういうことかという実行順ではなく、コードの見たままの構造でどの識別子がどの変数を参照しているかが分かるという仕組みになっています。
	- このような静的にどの識別子がどの変数を参照するか分かるスコープのことを静的スコープと呼びます。
	- JavaScriptは静的スコープを採用していますが、次章で紹介する`this`という特別なキーワードはこのルールとは異なります。
	- [コラム] 動的スコープって何?
- 変数の生存期間と関数スコープ
	- プログラムは定義された変数やデータはメモリ上に確保します。
	- しかしハードウェアのメモリは有限であるため、必要ではなくなったデータはメモリから解放する必要があります。
	- JavaScriptエンジンでは不要となったデータを必要なタイミングで自動的に解放します。
	- この自動的に不要なデータを回収する仕組みをガーベジコレクションとと言います。
	- 手動でメモリを解放するコードを書く必要がないため意識しなくても動くコードは書くことができますが、その不要となったタイミングとはどのような場合かを理解するのは大切です。
	- なぜなら〜
	- この必要なタイミングというのは、殆どのケースではどこから参照されることがなくなったタイミングとなります。
	- @具体例 次のコードを見てましょう。xに新しい値を代入した際に元々xに入っていたaというデータはどこからも参照されなくなっています。つまり、もう不要となったデータと判断されてガーベジコレクションによって回収されメモリ上から解放されます。(ガーベジコレクションの仕組みはJavaScriptのエンジンによって詳細が異なりますが、不要となったものを解放するのは同じです)
	- 次に変数の参照と関数の実行について考えてみましょう
	- 次にスコープと変数は密接な関係があることを紹介してきましたが、変数は複数のスコープから参照されることがあります。
	- つまり、関数`fn`の中で変数`x`が定義されていたとします。次の場合関数`fn`が実行し終わると変数`x`はどこからも参照されることがなくなるためガーベジコレクションによって回収されます。
	- では、次のような例ではどうでしょうか?
		- @具体例 
	- 関数`fn`では変数`array`を定義していますが、この変数を外側の変数へ代入しています。
	- つまり変数`array`は関数`fn`のスコープと外側の関数`outer`のスコープに紐付いていることが分かります。
		- outer -> array
		- fn -> array
	- この場合、関数`fn`を実行し終わったからと言って`array`はガーベジコレクションによって回収されるわけではありません。なぜなら別のところでまだ参照されているからです。
	- このように、関数の実行と変数が解放されるかどうかという変数の生存期間は必ずしも一致しないことが分かります。
- クロージャーの仕組み
- 要点
	- 静的スコープ: 見たままのコードでどの識別子がどの変数を参照するかが決まる
	- 変数の生存期間: 変数が参照されているなら生存し続け、変数が参照されなくなったらガーベジコレクションによって定期的に回収される
	- 最後にここまで説明してきた静的スコープという性質と変数の生存期間は参照されなくなるまでというルールを元にクロージャーがなぜ動くのかについてを見ていきます。
	- クロージャーはこの2つの性質を元にうごいています。
- クロージャーの用途
	- クロージャーは多用な用途がありますが基本的には次の部分で言及されています。
	- 関数に状態を持たせる手段として
	- 外から参照できない変数を定義する手段として
	- グローバル変数を減らす手段として
	- 高階関数の一部部分として
- [コラム] 関数オブジェクト
	- 関数はオブジェクトなので状態は持つ
	- プロパティに代入すればいいだけ
	- しかしこれは外からも自由に読み書きできるのでクロージャーで隠蔽するのが一般的
	- まだ最適化を妨げる(形が変化する)ため推奨されない
- クロージャーのまとめ
	- ２つの性質によって動く
	- すべての関数はクロージャー

```js
const createCounter = () => {
	let count = 0;
	return () => {
		count = count + 1;
		return count;
	};
};
const counter = createCounter();
counter(); // => 1
counter(); // => 2
counter(); // => 3
```

### 静的スコープ

- JavaScriptのスコープは静的スコープであるという点について理解する


```js
const x = 10;

function print_x() {
  console.log(x);
}

function run() {
  const x = 20;
  print_x(); // 10, not 20
}

run();
````

### スコープと関数の実行のライフサイクル

具体例と共に関数を実行し終わった後も変数を参照できる例を作る

```js
let count = 0;
function fn(){
	count = count + 1;
}
console.log(x); // => 0
fn();
console.log(x); // => 1
```

参照系の代入をすると、関数を実行し終わっても中で宣言した変数が生きていることが分かる。

```js
var x = { outer : "outer" };
function fn(){
    var obj = { inner : "inner" }
	x = obj;
}
console.log(x); // =>  { outer : "outer" };
fn();
console.log(x); // => { inner : "inner" }
x.inner = "x"
console.log(x); // => { inner : "x" }
```

ではこの変数`x`の元々の中身であった`{ outer : "outer" }`はいつメモリ上から消えるのでしょうか?
これは参照されなくなった時にガーベジコレクションによって自動的に解放されます。

```js
var x = { outer : "outer" };
function fn(){
    var obj = { inner : "inner" }
	x = obj;
	// ここで元々`x`が参照していたオブジェクトは参照されなくなった
	// 参照されなくなった値は、ガーベジコレクションの対象となるので自動的にメモリ上から解放される
}
console.log(x); // => undefined
fn();
console.log(x); // => { inner : "inner" }
x.inner = "x"
console.log(x); // => { inner : "x" }
````


これを元にクロージャーを理解していきます。


### クロージャー

ここまで変数の名前解決は静的に決まる静的スコープという性質と
関数の内側で宣言した変数が関数の実行終了後でも参照され続けていれば存在し続け、
参照されなくなった時点でガーベジコレクションによって解放されるというしくみについて説明しました。

クロージャーとはこの２つの性質を利用して、関数が特定の変数を参照し続けることで関数が状態を持つことができる仕組みの事を言います。
（Note: JavaScriptでは関数もオブジェクトであるため、関数のプロパティに値を追加できますがJavaScriptエンジンの最適化を妨げるなどの問題があるためあまり推奨されません）

クロージャーは関数閉包と呼ばれることがありますが、関数の内側に変数を閉じ込めることができる性質で、まるで関数が状態を持っているように見えます。


```js
const createCounter = () => {
	let count = 0;
	return function countUp() {
		// 変数`count`を参照し続けている
		count = count + 1;
		return count;
	};
};
// createCounter()の実行結果は、内側で定義されていた`countUp`関数
const countUp = createCounter();
// countUp関数の実行結果は`count`の評価結果
countUp(); // => 1
countUp(); // => 2
```

createCounterは次のことを行っています。

1. 新しくcount変数を定義し初期値を0となる
2. 新しく`countUp`関数を定義し返す

このcreateCounter関数の中で定義された`countUp`関数は次のことをやっています。

1. `createCounter`が定義した`count`変数の値を+1増加させる
2. `count`変数の評価結果を返す


`count`変数に限ってみれば、`createCounter`関数が実行し終わった(`countUp`関数を返した後)も、異なるスコープとなる`countUp`関数から参照され続けていることが分かります。
そして`countUp`関数は実行するたびに参照している`count`の値を+1していきます。
そのため、`countUp`関数が`count`変数を内側に保持し続けているように見えます。

このような関数の内側に変数を閉じ込めることができる性質のことをクロージャー(関数閉包）と呼びます。クロージャーは定義した時に名前解決は静的に決まる静的スコープと変数は参照され続けていれば保持される2つの性質によって成り立っています。JavaScriptの関数は常にこの2つの性質をもっているため、ある意味ではすべての関数がクロージャーとなりますが、ここでは関数が特定の変数を参照することで関数が状態をもっていることを指すことにします。

先ほどのCountUp関数も`createCounter`関数を実行するたびに、それぞれ`count`と`CountUp`関数が定義されていることが分かります。そのため、普通の`createCounter()`実行結果である`countUp`関数はそれぞれの別々の`count`変数を参照しています。

次のように`createCounter`関数を複数回呼び出してみるとその違いが分かります。

```js
const createCounter = () => {
	let count = 0;
	return function countUp() {
		// 変数`count`を参照し続けている
		count = count + 1;
		return count;
	};
};
// countUpとotherCountUpはそれぞれ別のcountUp関数(内側にあるのも別のcount変数)
const countUp = createCounter();
const otherCountUp = createCounter();
// 参照してる関数(オブジェクト)は別であるため===は一致しない
console.log(countUp === otherCountUp);// false
// それぞれの状態も別となる
countUp(); // => 1
otherCountUp(); // => 1
```

関数が状態を持つという性質は、〜で紹介するクラスでも表現することができます。
クロージャーがよく使われるのは、初期化と関数の呼び出しを分離するパターンとして使われます。

また、クロージャーは変数を内側に閉じ込めることができるので、外からは直接参照できないという書き方ができます

vs. 関数オブジェクトとの対比

つまり、次のような初期化コストがある処理において使われることがあります。

```js
const createMatcher = () => {
	const pattern = /pattern/;
	reutnr (text) => {
		return pattern.test(text);
	}
}
const test = createMatcher();
```