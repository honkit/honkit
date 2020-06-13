# `class`のアウトライン

## 目的

- `class`の基本的な文法についてを学ぶ
    - コンストラクタ
	    - `new`で呼ぶことが前提の関数のこと
	    - 実際に`typeof`は`function`
	    - しかし `[[Call]]`はできないように仕様で規定されている
    - new
	    - newした時の`this`の仕組み
    - メソッド
		- インスタンスメソッド
	- getter/setter
		- Computed Variable(プロパティ)
			- Public Field
		- アクセス制御
		- WeakSet
    - prototype
	    - ES2015以前
	    - ES2015以後
    - 継承
	    - super
	    - instanceof
	    - カスタムクラス
	    - ネイティブクラス
		    - Error, HTMLElement
    - 静的メソッド
	    - `of`や`from`
- 発展的利用方法
	- classは値
	- mixin
	- multiple extends
- 将来の発展性についてを軽く触れる
    - [コラム] minimal maximal
    - Symbol
    - Public Field
    - Private
    - これらの拡張の基盤について

### 触れないこと

- OOPとしてのクラス
	- リスコフの置換原則とは〜みたいな
	- 根底としてはそこは守るけど、明示はしない
	- 他の言語ではこういうことできるけど、JavaScriptではどうなの?的な感じの触れ方はしない
	- 機能自体が少ないことについては説明する
- メタ
	- propery descriptor
	- メソッドなどは列挙されない
		- enumerable
		- configurable
	- `Object.freeze(this)`でのImmutable class
- Proposalの詳細
	- https://github.com/tc39/proposal-class-public-fields
	- https://github.com/tc39/proposal-private-fields
	- https://github.com/tc39/proposal-class-fields
	- https://github.com/tc39/proposal-static-class-features/


----


# アウトライン: クラス

- 目的: クラスの基本的な使い方、クラスができることできないことを学ぶ

- 目的ではないこと: オブジェクト指向のパターンや型としてのクラス、構文としてできないことをむりやりやる方針としての話

- クラスとは構造、状態、動作(メソッド)を持つものを作る構文や概念のことを言います。
  - この定義を満たす概念としてオブジェクトもありますが、JavaScriptではクラスも一種のオブジェクトであるためもっと広義の概念と言えます。
  - ここでは構文のことを`class`構文と呼び、概念としてのことを言う場合は**クラス**と呼びます。
  - ここで**クラス**とは、動作や値を持った**構造**を定義でき、その構造からインスタンスを作ることでき、またそのインスタンスは**状態**を持てるものをクラスと呼びます。
  - また`class`構文は継承も簡単に実現できるようになっており、ビルトインオブジェクトに対しても`class`構文で継承ができます。
  - JavaScriptではES2015まで`class`構文はなく、関数を使いクラスのようなものを表現して扱っていました
  - ES2015で`class`構文が導入されましたが、この構文で定義したクラスは特殊な関数と言えます。なぜなら、`class`構文で定義された結果作られるオブジェクトは一種の関数であり、`class`構文はクラスを作るための関数定義や継承をパターン化されたものと言えます。
  - そのため、関数で学んだことの多くはクラスでもそのまま適応されます。
  - また、定義の仕方も関数宣言文と関数式があるようのと同じく、クラスにもクラス宣言文とクラス式があります。
  - この章では、`class`構文の使い方やクラスとしての機能を使ってできることや出来ないことについてを学んでいきます。

- `class`構文の定義方法
  - 具体例: `MyClass`
  - `class` = コンストラクタ関数を同時に定義する
  - クラスは暗黙的にコンストラクタを持ちます。
  	- 空の`constructor(){}`は省略できます
  - コンストラクタ関数に対して`new`演算子を使って行う
  	- `class`構文で定義したコンストラクタ関数は関数としては呼び出せない

- クラスのインスタンス化
  - `new`演算子でインスタンス化してそのインスタンスを使います。
  - なぜならクラスのコンストラクタは関数として呼ぶことはできないため。

- インスタンスの初期値
  - クラスの初期化は`constructor`関数で行います。
  - `new`演算子の引数で渡したものが`constructor`関数の仮引数に渡されます。
  - この時のコンストラクタ関数の`this`はクラスのインスタンスになります
  - つまり次のようにコンストラクタで`this.x`のように代入すれば、それはインスタンスが持つ`x`プロパティに値が入るという事になります。
  - インスタンスのプロパティとして定義した値はデフォルトで外から読み書きが可能です。
  - 具体例: `Point`

- クラスのメソッドの定義
  - また、`class`構文でコンストラクタ以外にもそのクラスが持つメソッドを定義できます。
  - 後述しますが、このメソッドはインスタンス(`this`)ではなく、クラスの`prototype`に定義されることで、各インスタンスからも呼び出すことが共通のメソッドを定義できます。
  - 具体例: `Counter`
  - 各メソッドからインスタンスを参照する場合もどうように`this`を使います。

- [コラム] クラスの名前は大文字開始にする
  - これは慣習であってこれによる挙動の違いはない
  - しかし、クラス名とインスタンス名が大文字小文字の違いで表現できる

- アクセッサメソッドの定義
  - メソッドは`()`で呼び出す必要がありますが、プロパティのように参照するだけで呼び出せるgetterやsetterと呼ばれるアクセッサプロパティを定義できます。
  - 具体例: 特に意味はないgetとsetの実装
  - メソッドの前に`get`や`set`をつけることで、アクセッサプロパティとして定義できます
  - getterには引数は書くことができませんがsetterには引数が必要です。
  - アクセッサメソッドを使ってインスタンス変数の値を合成した値を返したり、getだけを実装し外からsetはできないようにすると言った実装が可能です
  - (習慣として外からアクセスしてほしくないプロパティは`_`で開始することが習慣としてあります。これはさまざま言語で見られるものでかつECMAScriptでは特殊な内部プロパティが`__`で定義されているという実装からきているものと考えられます。)
  - 具体例: ArrayLikeな`length`の実装
  - しかし、現在のJavaScriptのクラスにはクラスの外側から完全に見えない値を定義する(hard privateと呼ばれる)アクセス制御を行う方法は持っていません。
  - これについては今後hard privateの機能を追加することが検討されています。(後述する[コラム] maximally minimal class)、また現時点でもWeakSetを使って擬似的なprivate(soft privateと呼ばれる)を実現できます(詳細は「Map/Set」の章）

- 静的メソッド

    - `of`や`from`
    - staticにおける`this`

- [コラム] インスタンスが持つ初期値
  - 現在のクラスにはフィールド変数をメソッドのように定義する構文はありません。
  - そのためインスタンスが持つ初期値はconstructor関数の中で`this`に対して代入したり、アクセッサメソッドで代用できます。
  - オブジェクトと同じくメソッドの中で新しいプロパティをインスタンスに対して追加することもできますが、オブジェクトでも書きましたが作成時に持つべきプロパティを宣言した方が読む人にとってもこのインスタンスが持つプロパティが分かるため良い習慣がいえます。
  - 具体例: 初期値として`0`を持つインスタンス?
  	- Counterの良くない例,Goodの良い例

- メソッドの定義が重複した場合
  - 目的: メソッドの定義が重複したときにどうなるか、その仕組みを理解する
  - 具体例: ConflictClass
  	- コンストラクタでthisに対しての定義
  	- メソッドで同じ名前の定義
  	- どちらが優先される => thisへ定義
  	- deleteしてみるとプロトタイプメソッドが呼ばれる
    - このことから
        - インスタンスメソッドとプロトタイプメソッドは別々の定義(上書きではない)ということがわかる
        - またインスタンスメソッド -> プロトタイプメソッドの優先度があることが分かる
        - この仕組みはプロトタイプチェーンと呼ばれる継承の仕組みによって動いている

- プロトタイプオブジェクト
    - すべての関数(オブジェクト)は作成されたときに自動的に`prototype`プロパティが作成されます。
    - この`prototype`プロパティはオブジェクトであるためプロトタイプオブジェクトとも言われます。
    - クラスも関数の一種であるため、クラスを定義した時に`クラス名.prototype`プロパティが作成されています。
    - クラスのメソッド定義はこの`prototype`オブジェクトに対して定義されています。
    - 具体例: つまりクラスのメソッド定義とは次のような形
        - インスタンスメソッドの対比
    - prototypeメソッドはインスタンス間で同じものを示す
        - 共有しているとも言える

- プロトタイプチェーン
    - 目的: `instance#method`で`class.prototype.method`が呼び出される仕組みを知る
    - インスタンスのメソッドが呼び出されるのは明確です
    - 一方プロトタイプオブジェクトに定義されたプロトタイプメソッドが呼び出されるのは不明確
    - JavaScriptにはインスタンスにはないプロパティはプロトタイプオブジェクトを探索するプロトタイプチェーンと呼ばれる仕組みがあります。
    - プロトタイプチェーンの仕組み
        - 2つの要素から成り立つ
    	- プロトタイプメソッドの定義
        - プロトタイプの参照
    - プロトタイプの仕組み
    - 作成側
        1. クラスの作成
        2. プロトタイプオブジェクトの作成(自動)
        3. プロトタイプオブジェクトにメソッドを定義
        4. クラスからインスタンスを作るときに、`インスタンス[[Prototype]]`にプロトタイプオブジェクトの代入
            - `インスタンス[[Prototype]]` は仕様上決められた内部プロパティで通常のプロパティと違って直接アクセスはできません
            - 代わりに`__proto__`という標準化されてるけど、推奨できない方法があります
            - このアクセッサプロパティの代わりに、`Object.getPrototypeOf`や`Object.setPrototypeOf`を使うのが正攻法ですが、このメソッドを直接扱うことは極稀でしょう
    - 参照側
        - インスタンスからメソッドを呼び出す
        - if `インスタンス.hasOwnProperty(メソッド)` なら　インスタンスのメソッドを呼ぶ
        - if `インスタンス[[Prototype]]` or `メソッド in インスタンス`なら、プロトタイプメソッドを呼ぶ
    - `[[Prototype]]`を参照する仕組みをプロトタイプチェーンという
    - 基本的に`[[Prototype]]`の参照先はインスタンス化した時に決まる
    - `new MyClass`ならインスタンスには`MyClass.prototype`が`[[Prototype]]`に入る
    - プロトタイプチェーンはインスタンス -> `[[Prototype]]` -> `[[Prototype]]` -> null

- [コラム] プロトタイプとメタ
    - プロトタイプはインスタンス間で値を共有しているということはプロトタイプをいじると既存のプロパティに影響を与える
    - この仕組みはJavaScriptをメタプログラミング的に柔軟性をもたせた一方、普通の人は扱うべきであはありません
    - これらを利用した仕組みとして新しい仕様を、古い実装の上で互換レイヤーを実現するpolyfillなどに使われています。
    - 一方アプリケーションでこれらのコードを直接書くことはパフォーマンスの低下やコードの読みにくさをあげます
    - そのため既存オブジェクトのプロトタイプを変更するのは次の場合に限ってください
    - そのメソッドは標準化(ECMAScriptやW3C、WHATWGといったデファクトスタンダードがある)
    - 既に実装したいる場合は拡張しない
    - 詳しくはpolyfillガイドを見てください

- [コラム] クラスは関数の一種
  - typeof の結果はfunctionです
  - また関数として呼び出せません。また詳しくは解説しませんが、手順は複雑ですが`Reflect`メソッドや`prototype`オブジェクトを使うことでクラスと同等のことを関数で表現できます。
  - そのため、`class`で宣言したクラスは一種の関数であると言えます。
  - そのため、`class`は関数でクラスを表現するために用意された糖衣構文(Syntax Suger)と呼ばれることがあります。

- 継承
    - 目的: プロトタイプ継承の仕組みと`extends`の使い方を理解する
    - まずは`extends`による継承の書き方とコンストラクタ処理についてを見ていきます
    - `extends`
        - 継承は`extends`を行うことで継承できます
    - `super`
        - コンストラクタで処理を行うには必ず最初に`super`で親のコンストラクタ処理を行います
        - constructorの処理がない場合は省略できます
        - このときは`super(...args)`と同じ意味となります
    - インスタンス化
        - 継承した小クラスのインスタンス化は通常のクラスと同様です。
        - この時、親クラスのコンストラクタ処理、子クラスのコンストラクタ処理と順番に行われインスタンス化されます
        - 具体例: `this.name`が上書きされる例
        - このように`this.name`の値がそれぞれ変わっていることからも初期化の順番が分かります。
    - ## プロトタイプ継承
    - 継承はクラスの"構造"や"機能"を継承する仕組みです。
    - JavaScriptでは`class extends` 構文でクラスから機能 – つまりメソッドを継承できます。
    - 具体的な継承の例を見てみましょう
    - 具体的: Parent-Child
    - プロトタイプチェーンの解説
        - この時Squareのインスタンスからこのメソッドをよべます。
        - これはプロトタイプオブエジェクト間でも継承されているためです。
    - `instanceof`の性質はプロトタイプチェーン
    - 具体例: Event
    - ## 継承のユースケース
    - 必要な要素
        - [x] constructor
        - [x] super()
        - [x] super.method
        - [x] method継承
        - [x] インスタンス
        - thisのbind
    - 継承はメソッドという見える機能だけではなく性質も継承します
    - まずは、イベントを登録、処理する機能を持つクラスを作成してます。
    - この`EventEmitter`を継承してみます。
    - ## ビルトインオブジェクトの継承
    - ビルトインオブジェクトの継承
        - 具体例: MyArray
        - `MyArray.from`のようにStaticメソッドが継承されています
    - ## 継承の制限
    - 多重継承はできません => mixin
        - 継承は縦に直列的な関係です
        - mixinは横に並列的な合成の関係です
    - 未使用:
        - 構文的にはエラーなく継承できますが、意味的にはおかしな継承できます
        - 具体例: widthを変更できるSquare
        - しかしこれはオブジェクト指向プログラミングなどの考え方の問題となります
        - そのためクラスの構文としての話ではないため詳しくは別の本にゆずります

- 発展的利用方法
  - classは値
  - mixin
  - multiple extends

- 将来の発展性についてを軽く触れる
    - [コラム] minimal maximal
    - Symbol
    - Public Field
    - Private
    - これらの拡張の基盤について

- 未使用
    - `instanceof`演算子は`__proto__`と`prototype`の比較
        - https://www.slideshare.net/zhiyelee/protoandprototype
        - https://tc39.github.io/ecma262/#sec-ordinaryhasinstance
	- new演算子は何をやっているのかについて
	- メソッドはnewできない件について
	- クラスとtypeofの結果
	- `[prop]()`で定義できるよという話
		- Symbolとの併せわざ
	- オブジェクトにもgetterやsetterがあるよ
	- `Object.freeze`でのimmutable class
	- static methodの継承
        - `class C extends P{}`は `C.__proto__` が `P` となる
	- アクセスレベル
		- pubilc, private, computed
		- [ES proposal: class fields](http://2ality.com/2017/07/class-fields.html "ES proposal: class fields")
    - [ES2019] フィールドプロパティ
        - https://github.com/tc39/proposal-class-fields
        - ES2019あたりで入る可能性がある
        - StaticとInstanceは別
    - [ES2019] Private
        - https://github.com/tc39/proposal-class-fields


----

## プロトタイプ


- 疑問: プロトタイプメソッドとインスタンスにメソッド同時に定義したらどうなるの?
  - 実験: 実験する
  - 結果: インスタンスのメソッドが優先して呼ばれる
  - 結果: でもインスタンスのメソッドを消すと、プロトタイプのメソッドが呼ばれる
  - 推測: 実験結果から、上書きして定義されるのではなくそれぞれちゃんと定義されていることが分かる
    - プロトタイプメソッドはインスタンスのメソッド定義で上書きされているわけではない
    - インスタンスのメソッドがプロトタイプのメソッドよりも優先して呼ばれている
- 目的: この仕組みを理解しよう
- 解説: プロトタイプオブジェクト
    - 理由: `class`構文ではプロトタイプメソッドはプロトタイプオブジェクトという特殊なオブジェクトに定義されている
    - 理由: これにより上書きされて定義されていないことが分かる
- 解説: プロトタイプチェーン
    - 疑問: じゃあなんで、そもそもプロトタイプメソッドにあるメソッドがよびだせてるの?
    - 解説: この仕組みはプロトタイプチェーンと呼ばれる仕組み
    - 解説: インスタンス化するときにプロトタイプオブジェクトの参照を自動的に`[[Prototype]]`という内部プロパティに保存する
    - 解説: 実際にプロパティを参照するときに`[[Prototype]]`という内部プロパティにあるなら自動的参照する(透過的に行うので意識するのは無理
    - 解説: インスタンス自身がプロパティを持っているならそちらが優先される
- 結論: これがJavaScriptのクラスの内部表現(プロトタイプベース言語と言われる要因)

----


## サンプル

- 状態を持つクラス
- Point
	- クラス
- Counter
- 継承の例
	- EventEmitter
		- DOMはEventTarget、NodeはEventEmitter
		- https://github.com/mysticatea/event-target-shim
		- https://blog.jxck.io/entries/2017-07-10/subclassible-eventtarget.html
	- Square
- 継承の場合
	- 次のパターンは省略可能であるという話
	- EventEmitter

```js
constructor(...args){
 super(...args);
}
```

- 静的メソッドの例
	- `of`や`from`を持つ例
	- `ArrayLike#of`


-----

# ノート

## `class`のコンストラクタ関数が呼び出せない理由

```js
class C{}
C(); // => TypeError
```

これって意外にも `[[Call]]` で クラスのコンストラクタ関数は呼び出すと例外を投げるって書いてあるんだ。てっきり定義するときに例外を投げる関数を登録みたいな感じだと思ってた。

- [Runtime Semantics: ClassDefinitionEvaluation](https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation "Runtime Semantics: ClassDefinitionEvaluation")
	- `class`で定義した場合
- [MakeClassConstructor ( F )](https://tc39.github.io/ecma262/#sec-makeclassconstructor "MakeClassConstructor ( F )")
	- このコンストラクタ関数の`[[FunctionKind]]`が`classConstructor`になる
- [`[[Call]] ( thisArgument, argumentsList )`](https://tc39.github.io/ecma262/#sec-ecmascript-function-objects-call-thisargument-argumentslist)
	- `[[FunctionKind]]`が`classConstructor`な関数は`TypeError`を投げる


## クラスの構成要素

- クラス
	- コンストラクタ
	- プロトタイプ.プロパティ
	- フィールド
	- プロパティ
	- アクセッサ
	- static
- インスタンス

----

# 関数とクラス


```js
class MyClass {
    constructor() {
        this.name = "MyClass";
    }
    field = "field";
    method() { }
}

const FnClass = function FnClass() {
    function Constructor() {
        this.name = "FnClass";
        this.field = "field"
    }
    Constructor.prototype.method = function () {
    }
    return Constructor;
}();

```

-----
# 他の書籍

## [Understanding ECMAScript 6](https://leanpub.com/understandinges6/read#leanpub-auto-introducing-javascript-classes "Understanding ECMAScript 6")

- `PersonClass`
- `Rectangle` -> `Square`
	- instanceof

## Exploring JS

- [15. Classes](http://exploringjs.com/es6/ch_classes.html#sec_overview-classes "15. Classes")
- `Point`

## JavaScript本格入門

- `Area`
- `Member`
	- 継承 `BussinessMember`

## Refactoring JavaScript

> Why Do Some People Hate Classes?

Mutateや意図しないネストのextendsを加速させるから

```
class Dog extends (Animal, Barky, Bitey) { };
```

はできないという話


- `class JapaneseWord extends Word{}`


protototyep note

- There’s a “nonstandard” yet popular alternative to Object.getProto-typeOf(thing), which you use like this: thing.__proto__.•Object.getPrototypeOf has the alias Reflect.getPrototypeOf.
- There’s another prototype inspection attribute that you can use like this:thing.prototype. It’s super unreliable.
- Partly because there’s so much nonsense and inconsistency around pro-totypes, when people talk about the “real, true, deep-down” prototype ofsomething, they’ll use syntax like [[Prototype]] to indicate they meanthe real prototype, as opposed to the five ways of actually interrogatingan object.



## 初めてのJavaScript


- `Car`
- getter/setter
	- 本当の制御はWeakMapで
- StaticメソッドはID生成の例

```
let _id = 0;
class Car { static createUUID(){ return _id++ } }
Car.createUUID()
```


- 継承 `Vehicle` -> `Car`
