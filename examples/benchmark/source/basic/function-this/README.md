---
author: azu
description: "JavaScriptにおける`this`というキーワードの動作を紹介します。`this`の参照先は条件によって解決方法が異なるため、`this`の動きについてをそれぞれの条件ごとに紹介します。一見複雑な`this`の動きを予測可能にするにはどうするべきかをコード例とともに紹介します。"
---

# 関数とthis {#function-this}

この章では`this`という特殊な動作をするキーワードについて見ていきます。
基本的にはメソッドの中で利用しますが、`this`は読み取り専用のグローバル変数のようなものでどこにでも書けます。
加えて、`this`の参照先（評価結果）は条件によって異なります。

`this`の参照先は主に次の条件によって変化します。

- 実行コンテキストにおける`this`
- コンストラクタにおける`this`
- 関数とメソッドにおける`this`
- Arrow Functionにおける`this`

コンストラクタにおける`this`は、次の章である「[クラス][]」で扱います。
この章ではさまざまな条件での`this`について扱いますが、`this`が実際に使われるのはメソッドにおいてです。
そのため、あらゆる条件下での`this`の動きを覚える必要はありません。

この章では、さまざまな条件下で変わる`this`の参照先と関数やArrow Functionとの関係を見ていきます。
また、実際にどのような状況で問題が発生するかを知り、`this`の動きを予測可能にするにはどのようにするかを見ていきます。

## 実行コンテキストと`this` {#execution-context-this}

最初に「[JavaScriptとは][]」の章において、JavaScriptには実行コンテキストとして"Script"と"Module"があるという話をしました。
どの実行コンテキストでJavaScriptのコードを評価するかは、実行環境によってやり方が異なります。
この章では、ブラウザの`script`要素と`type`属性を使い、それぞれの実行コンテキストを明示しながら`this`の動きを見ていきます。

トップレベル（もっとも外側のスコープ）にある`this`は、実行コンテキストによって値が異なります。
実行コンテキストの違いは意識しにくい部分であり、トップレベルで`this`を使うと混乱を生むことになります。
そのため、コードのトップレベルにおいては`this`を使うべきではありませんが、それぞれの実行コンテキストにおける動作を紹介します。

### スクリプトにおける`this` {#script-this}

実行コンテキストが"Script"である場合、トップレベルのスコープに書かれた`this`はグローバルオブジェクトを参照します。
グローバルオブジェクトには、実行環境ごとに異なるものが定義されています。
ブラウザなら`window`オブジェクト、Node.jsなら`global`オブジェクトとなります。

ブラウザでは、`script`要素の`type`属性を指定していない場合は、実行コンテキストが"Script"として実行されます。
この`script`要素の直下に書いた`this`はグローバルオブジェクトである`window`オブジェクトとなります。

```html
<script>
// 実行コンテキストは"Script"
console.log(this); // => window
</script>
```

### モジュールにおける`this` {#module-this}

実行コンテキストが"Module"である場合、そのトップレベルのスコープに書かれた`this`は常に`undefined`となります。

ブラウザで、`script`要素に`type="module"`属性がついた場合は、実行コンテキストが"Module"として実行されます。
この`script`要素の直下に書いた`this`は`undefined`となります。

```html
<script type="module">
// 実行コンテキストは"Module"
console.log(this); // => undefined
</script>
```

このように、トップレベルのスコープの`this`は実行コンテキストによって`undefined`となる場合があります。
単純にグローバルオブジェクトを参照したい場合は、`this`ではなく`window`などのグローバルオブジェクトを直接参照したほうがよいです。

## 関数とメソッドにおける`this` {#function-and-method-this}

**関数**を定義する方法として、`function`キーワードによる関数宣言と関数式、Arrow Functionなどがあります。
`this`が参照先を決めるルールは、Arrow Functionとそれ以外の関数定義の方法で異なります。

そのため、まずは関数定義の種類について振り返ってから、それぞれの`this`について見ていきます。

### 関数の種類 {#type-of-function}

「[関数と宣言][]」の章で詳しく紹介していますが、関数の定義方法と呼び出し方について改めて振り返ってみましょう。
**関数**を定義する場合には、次の3つの方法を利用します。

{{book.console}}
```js
// `function`キーワードからはじめる関数宣言
function fn1() {}
// `function`を式として扱う関数式
const fn2 = function() {};
// Arrow Functionを使った関数式
const fn3 = () => {};
```

<!-- textlint-disable no-js-function-paren -->

それぞれ定義した関数は`関数名()`と書くことで呼び出せます。

<!-- textlint-enable no-js-function-paren -->

{{book.console}}
```js
// 関数宣言
function fn() {}
// 関数呼び出し
fn();
```

### メソッドの種類 {#type-of-method}

JavaScriptではオブジェクトのプロパティが関数である場合にそれを**メソッド**と呼びます。
一般的にはメソッドも含めたものを**関数**と言い、関数宣言などとプロパティである関数を区別する場合に**メソッド**と呼びます。

メソッドを定義する場合には、オブジェクトのプロパティに関数式を定義するだけです。

{{book.console}}
```js
const obj = {
    // `function`キーワードを使ったメソッド
    method1: function() {
    },
    // Arrow Functionを使ったメソッド
    method2: () => {
    }
};
```

これに加えてメソッドには短縮記法があります。
オブジェクトリテラルの中で `メソッド名(){ /*メソッドの処理*/ }`と書くことで、メソッドを定義できます。

{{book.console}}
```js
const obj = {
    // メソッドの短縮記法で定義したメソッド
    method() {
    }
};
```

<!-- textlint-disable no-js-function-paren -->

これらのメソッドは、`オブジェクト名.メソッド名()`と書くことで呼び出せます。

<!-- textlint-enable no-js-function-paren -->

{{book.console}}
```js
const obj = {
    // メソッドの定義
    method() {
    }
};
// メソッド呼び出し
obj.method();
```

関数定義とメソッドの定義についてまとめると、次のようになります。

| 名前                                        | 関数 | メソッド |
| ------------------------------------------- | ---- | ---- |
| 関数宣言(`function fn(){}`)                 | ✔    | x    |
| 関数式(`const fn = function(){}`)           | ✔    | ✔    |
| Arrow Function(`const fn = () => {}`)       | ✔    | ✔    |
| メソッドの短縮記法(`const obj = { method(){} }`) | x    | ✔    |

最初に書いたように`this`の挙動は、Arrow Functionの関数定義とそれ以外（`function`キーワードやメソッドの短縮記法）の関数定義で異なります。
そのため、まずは**Arrow Function以外**の関数やメソッドにおける`this`を見ていきます。

## Arrow Function以外の関数における`this` {#function-without-arrow-function-this}

Arrow Function以外の関数（メソッドも含む）における`this`は、実行時に決まる値となります。
言い方を変えると`this`は関数に渡される暗黙的な引数のようなもので、その渡される値は関数を実行するときに決まります。

次のコードは疑似的なものです。
関数の中に書かれた`this`は、関数の呼び出し元から暗黙的に渡される値を参照することになります。
このルールはArrow Function以外の関数やメソッドで共通した仕組みとなります。Arrow Functionで定義した関数やメソッドはこのルールとは別の仕組みとなります。

<!-- doctest:disable -->

```js
// 疑似的な`this`の値の仕組み
// 関数は引数として暗黙的に`this`の値を受け取るイメージ
function fn(暗黙的に渡されるthisの値, 仮引数) {
    console.log(this); // => 暗黙的に渡されるthisの値
}
// 暗黙的に`this`の値を引数として渡しているイメージ
fn(暗黙的に渡すthisの値, 引数);
```

<!-- textlint-disable no-js-function-paren -->

関数における`this`の基本的な参照先（暗黙的に関数に渡す`this`の値）は**ベースオブジェクト**となります。
ベースオブジェクトとは「メソッドを呼ぶ際に、そのメソッドのドット演算子またはブラケット演算子のひとつ左にあるオブジェクト」のことを言います。
ベースオブジェクトがない場合の`this`は`undefined`となります。

たとえば、`fn()`のように関数を呼び出したとき、この`fn`関数呼び出しのベースオブジェクトはないため、`this`は`undefined`となります。
一方、`obj.method()`のようにメソッドを呼び出したとき、この`obj.method`メソッド呼び出しのベースオブジェクトは`obj`オブジェクトとなり、`this`は`obj`となります。

<!-- textlint-enable no-js-function-paren -->

<!-- doctest:disable -->
```js
// `fn`関数はメソッドではないのでベースオブジェクトはない
fn();
// `obj.method`メソッドのベースオブジェクトは`obj`
obj.method();
// `obj1.obj2.method`メソッドのベースオブジェクトは`obj2`
// ドット演算子、ブラケット演算子どちらも結果は同じ
obj1.obj2.method();
obj1["obj2"]["method"]();
```

`this`は関数の定義ではなく呼び出し方で参照する値が異なります。これは、後述する「`this`が問題となるパターン」で詳しく紹介します。
Arrow Function以外の関数では、関数の定義だけを見て`this`の値が何かということは決定できない点に注意が必要です。

### 関数宣言や関数式における`this` {#function-declaration-expression-this}

まずは、関数宣言や関数式の場合を見ていきます。

<!-- textlint-disable no-js-function-paren -->

次の例では、関数宣言で関数`fn1`と関数式で関数`fn2`を定義し、それぞれの関数内で`this`を返します。
定義したそれぞれの関数を`fn1()`と`fn2()`のようにただの関数として呼び出しています。
このとき、ベースオブジェクトはないため、`this`は`undefined`となります。

<!-- textlint-disable no-js-function-paren -->

{{book.console}}
```js
"use strict";
function fn1() {
    return this;
}
const fn2 = function() {
    return this;
};
// 関数の中の`this`が参照する値は呼び出し方によって決まる
// `fn1`と`fn2`どちらもただの関数として呼び出している
// メソッドとして呼び出していないためベースオブジェクトはない
// ベースオブジェクトがない場合、`this`は`undefined`となる
console.log(fn1()); // => undefined
console.log(fn2()); // => undefined
```

これは、関数の中に関数を定義して呼び出す場合も同じです。

{{book.console}}
```js
"use strict";
function outer() {
    console.log(this); // => undefined
    function inner() {
        console.log(this); // => undefined
    }
    // `inner`関数呼び出しのベースオブジェクトはない
    inner();
}
// `outer`関数呼び出しのベースオブジェクトはない
outer();
```

この書籍では注釈がないコードはstrict modeとして扱いますが、コード例に`"use strict";`と改めてstrict modeを明示しています。
なぜなら、strict modeではない状況で`this`が`undefined`の場合は、`this`がグローバルオブジェクトを参照するように変換される問題があるためです。

strict modeは、このような意図しにくい動作を防止するために導入されています。
しかしながら、strict modeのメソッド以外の関数における`this`は`undefined`となるため使い道がありません。
そのため、メソッド以外で`this`を使う必要はありません。

### メソッド呼び出しにおける`this` {#method-this}

次に、メソッドの場合を見ていきます。
メソッドの場合は、そのメソッドが何かしらのオブジェクトに所属しています。
なぜなら、JavaScriptではオブジェクトのプロパティとして指定される関数のことをメソッドと呼ぶためです。

次の例では`method1`と`method2`はそれぞれメソッドとして呼び出されています。
このとき、それぞれのベースオブジェクトは`obj`となり、`this`は`obj`となります。

{{book.console}}
```js
const obj = {
    // 関数式をプロパティの値にしたメソッド
    method1: function() {
        return this;
    },
    // 短縮記法で定義したメソッド
    method2() {
        return this;
    }
};
// メソッド呼び出しの場合、それぞれの`this`はベースオブジェクト(`obj`)を参照する
// メソッド呼び出しの`.`の左にあるオブジェクトがベースオブジェクト
console.log(obj.method1()); // => obj
console.log(obj.method2()); // => obj
```

これを利用すれば、メソッドの中から同じオブジェクトに所属する別のプロパティを`this`で参照できます。

{{book.console}}
```js
const person = {
    fullName: "Brendan Eich",
    sayName: function() {
        // `person.fullName`と書いているのと同じ
        return this.fullName;
    }
};
// `person.fullName`を出力する
console.log(person.sayName()); // => "Brendan Eich"
```

このようにメソッドが所属するオブジェクトのプロパティを、`オブジェクト名.プロパティ名`の代わりに`this.プロパティ名`で参照できます。

オブジェクトは何重にもネストできますが、`this`はベースオブジェクトを参照するというルールは同じです。

次のコードを見てみると、ネストしたオブジェクトにおいてメソッド内の`this`がベースオブジェクトである`obj3`を参照していることがわかります。
このときのベースオブジェクトはドットでつないだ一番左の`obj1`ではなく、メソッドから見てひとつ左の`obj3`となります。

{{book.console}}
```js
const obj1 = {
    obj2: {
        obj3: {
            method() {
                return this;
            }
        }
    }
};
// `obj1.obj2.obj3.method`メソッドの`this`は`obj3`を参照
console.log(obj1.obj2.obj3.method() === obj1.obj2.obj3); // => true
```

## `this`が問題となるパターン {#this-problem}

`this`はその関数（メソッドも含む）呼び出しのベースオブジェクトを参照することがわかりました。
`this`は所属するオブジェクトを直接書く代わりとして利用できますが、一方`this`にはいろいろな問題があります。

この問題の原因は`this`がどの値を参照するかは関数の呼び出し時に決まるという性質に由来します。
この`this`の性質が問題となるパターンの代表的な2つの例とそれぞれの対策について見ていきます。

### 問題: `this`を含むメソッドを変数に代入した場合 {#assign-this-function}

JavaScriptではメソッドとして定義したものが、後からただの関数として呼び出されることがあります。
なぜなら、メソッドは関数を値に持つプロパティのことで、プロパティは変数に代入し直すことができるためです。

そのため、メソッドとして定義した関数も、別の変数に代入してただの関数として呼び出されることがあります。
この場合には、メソッドとして定義した関数であっても、実行時にはただの関数であるためベースオブジェクトが変わっています。
これは`this`が定義した時点ではなく実行したときに決まるという性質そのものです。

具体的に、`this`が実行時に変わる例を見ていきます。
次の例では、`person.sayName`メソッドを変数`say`に代入してから実行しています。
このときの`say`関数（`sayName`メソッドを参照）のベースオブジェクトはありません。
そのため、`this`は`undefined`となり、`undefined.fullName`は参照できずに例外を投げます。

{{book.console}}
```js
"use strict";
const person = {
    fullName: "Brendan Eich",
    sayName: function() {
        // `this`は呼び出し元によって異なる
        return this.fullName;
    }
};
// `sayName`メソッドは`person`オブジェクトに所属する
// `this`は`person`オブジェクトとなる
console.log(person.sayName()); // => "Brendan Eich"
// `person.sayName`を`say`変数に代入する
const say = person.sayName;
// 代入したメソッドを関数として呼ぶ
// この`say`関数はどのオブジェクトにも所属していない
// `this`はundefinedとなるため例外を投げる
say(); // => TypeError: Cannot read property 'fullName' of undefined
```

結果的には、次のようなコードが実行されているのと同じです。
次のコードでは、`undefined.fullName`を参照しようとして例外が発生しています。

{{book.console}}
```js
"use strict";
// const say = person.sayName; は次のようなイメージ
const say = function() {
    return this.fullName;
};
// `this`は`undefined`となるため例外を投げる
say(); // => TypeError: Cannot read property 'fullName' of undefined
```

このように、Arrow Function以外の関数において、`this`は定義したときではなく実行したときに決定されます。
そのため、関数に`this`を含んでいる場合、その関数は意図した呼ばれ方がされないと間違った結果が発生するという問題があります。

この問題の対処法としては大きく分けて2つあります。

1つはメソッドとして定義されている関数はメソッドとして呼ぶということです。
メソッドをわざわざただの関数として呼ばなければそもそもこの問題は発生しません。

もう1つは、`this`の値を指定して関数を呼べるメソッドで関数を実行する方法です。

#### 対処法: call、apply、bindメソッド {#call-apply-bind}

関数やメソッドの`this`を明示的に指定して関数を実行する方法もあります。
`Function`（関数オブジェクト）には`call`、`apply`、`bind`といった明示的に`this`を指定して関数を実行するメソッドが用意されています。

`call`メソッドは第一引数に`this`としたい値を指定し、残りの引数には呼び出す関数の引数を指定します。
暗黙的に渡される`this`の値を明示的に渡せるメソッドと言えます。

<!-- doctest:disable -->
```js
関数.call(thisの値, ...関数の引数);
```

次の例では`this`に`person`オブジェクトを指定した状態で`say`関数を呼び出しています。
`call`メソッドの第二引数で指定した値が、`say`関数の仮引数`message`に入ります。

{{book.console}}
```js
"use strict";
function say(message) {
    return `${message} ${this.fullName}！`;
}
const person = {
    fullName: "Brendan Eich"
};
// `this`を`person`にして`say`関数を呼びだす
console.log(say.call(person, "こんにちは")); // => "こんにちは Brendan Eich！"
// `say`関数をそのまま呼び出すと`this`は`undefined`となるため例外が発生
say("こんにちは"); // => TypeError: Cannot read property 'fullName' of undefined
```

<!--
この例を見ると`this`が暗黙的に関数に渡される仮引数の一種のよう扱われていることが分かります。
他の言語とは異なり`this`が実行時に決定されることは、定義時点ではthisの値が何になるのか分からないという曖昧さがあることを示しています。
-->

`apply`メソッドは第一引数に`this`とする値を指定し、第二引数に関数の引数を配列として渡します。

<!-- doctest:disable -->
```js
関数.apply(thisの値, [関数の引数1, 関数の引数2]);
```

次の例では`this`に`person`オブジェクトを指定した状態で`say`関数を呼び出しています。
`apply`メソッドの第二引数で指定した配列は、自動的に展開されて`say`関数の仮引数`message`に入ります。

{{book.console}}
```js
"use strict";
function say(message) {
    return `${message} ${this.fullName}！`;
}
const person = {
    fullName: "Brendan Eich"
};
// `this`を`person`にして`say`関数を呼びだす
// callとは異なり引数を配列として渡す
console.log(say.apply(person, ["こんにちは"])); // => "こんにちは Brendan Eich！"
// `say`関数をそのまま呼び出すと`this`は`undefined`となるため例外が発生
say("こんにちは"); // => TypeError: Cannot read property 'fullName' of undefined
```

`call`メソッドと`apply`メソッドの違いは、関数の引数への値の渡し方が異なるだけです。
また、どちらのメソッドも`this`の値が不要な場合は`null`を渡すのが一般的です。

{{book.console}}
```js
function add(x, y) {
    return x + y;
}
// `this`が不要な場合は、nullを渡す
console.log(add.call(null, 1, 2)); // => 3
console.log(add.apply(null, [1, 2])); // => 3
```

最後に`bind`メソッドについてです。
名前のとおり`this`の値を束縛（bind）した新しい関数を作成します。

<!-- doctest:disable -->
```js
関数.bind(thisの値, ...関数の引数); // => thisや引数がbindされた関数
```

次の例では`this`を`person`オブジェクトに束縛した`say`関数をラップした関数を作っています。
`bind`メソッドの第二引数以降に値を渡すことで、束縛した関数の引数も束縛できます。

{{book.console}}
```js
function say(message) {
    return `${message} ${this.fullName}！`;
}
const person = {
    fullName: "Brendan Eich"
};
// `this`を`person`に束縛した`say`関数をラップした関数を作る
const sayPerson = say.bind(person, "こんにちは");
console.log(sayPerson()); // => "こんにちは Brendan Eich！"
```

この`bind`メソッドをただの関数で表現すると次のように書けます。
`bind`は`this`や引数を束縛した関数を作るメソッドだということがわかります。

{{book.console}}
```js
function say(message) {
    return `${message} ${this.fullName}！`;
}
const person = {
    fullName: "Brendan Eich"
};
// `this`を`person`に束縛した`say`関数をラップした関数を作る
//  say.bind(person, "こんにちは"); は次のようなラップ関数を作る
const sayPerson = () => {
    return say.call(person, "こんにちは");
};
console.log(sayPerson()); // => "こんにちは Brendan Eich！"
```

このように`call`、`apply`、`bind`メソッドを使うことで`this`を明示的に指定した状態で関数を呼び出せます。
しかし、毎回関数を呼び出すたびにこれらのメソッドを使うのは、関数を呼び出すための関数が必要になってしまい手間がかかります。
そのため、基本的には「メソッドとして定義されている関数はメソッドとして呼ぶこと」でこの問題を回避するほうがよいでしょう。
その中で、どうしても`this`を固定したい場合には`call`、`apply`、`bind`メソッドを利用します。

<!--
そのため、ES2015ではこの`this`の問題を解決するためにArrow Functionという新しい関数の定義方法を導入しました。
そもそも`call`、`apply`、`bind`が必要となるのは「`this`が呼び出し方によって暗黙的に決まる」という問題があるためです。
-->

### 問題: コールバック関数と`this` {#callback-and-this}

コールバック関数の中で`this`を参照すると問題となる場合があります。
この問題は、メソッドの中で`Array#map`メソッドなどのコールバック関数を扱う場合に発生しやすいです。

具体的に、コールバック関数における`this`が問題となっている例を見てみましょう。
次のコードでは`prefixArray`メソッドの中で`Array#map`メソッドを使っています。
このとき、`Array#map`メソッドのコールバック関数の中で、`Prefixer`オブジェクトを参照するつもりで`this`を参照しています。

しかし、このコールバック関数における`this`は`undefined`となり、`undefined.prefix`は参照できないためTypeErrorの例外が発生します。

{{book.console}}
```js
"use strict";
// strict modeを明示しているのは、thisがグローバルオブジェクトに暗黙的に変換されるのを防止するため
const Prefixer = {
    prefix: "pre",
    /**
     * `strings`配列の各要素にprefixをつける
     */
    prefixArray(strings) {
        return strings.map(function(str) {
            // コールバック関数における`this`は`undefined`となる(strict mode)
            // そのため`this.prefix`は`undefined.prefix`となり例外が発生する
            return this.prefix + "-" + str;
        });
    }
};
// `prefixArray`メソッドにおける`this`は`Prefixer`
Prefixer.prefixArray(["a", "b", "c"]); // => TypeError: Cannot read property 'prefix' of undefined
```

なぜコールバック関数の中の`this`が`undefined`となるのかを見ていきます。
`Array#map`メソッドにはコールバック関数として、その場で定義した匿名関数を渡していることに注目してください。

<!-- textlint-disable eslint -->
<!-- doctest:disable -->
```js
// ...
    prefixArray(strings) {
        // 匿名関数をコールバック関数として渡している
        return strings.map(function(str) {
            return this.prefix + "-" + str;
        });
    }
// ...
```
<!-- textlint-enable eslint -->

<!-- textlint-disable no-js-function-paren -->

このとき、`Array#map`メソッドに渡しているコールバック関数は`callback()`のようにただの関数として呼び出されます。
つまり、コールバック関数として呼び出すとき、この関数にはベースオブジェクトはありません。
そのため`callback`関数の`this`は`undefined`となります。

先ほどの例では匿名関数をコールバック関数として直接メソッドに渡していますが、一度`callback`変数に入れてから渡しても結果は同じです。

<!-- textlint-enable no-js-function-paren -->

{{book.console}}
```js
"use strict";
// strict modeを明示しているのは、thisがグローバルオブジェクトに暗黙的に変換されるのを防止するため
const Prefixer = {
    prefix: "pre",
    prefixArray(strings) {
        // コールバック関数は`callback()`のように呼び出される
        // そのためコールバック関数における`this`は`undefined`となる(strict mode)
        const callback = function(str) {
            return this.prefix + "-" + str;
        };
        return strings.map(callback);
    }
};
// `prefixArray`メソッドにおける`this`は`Prefixer`
Prefixer.prefixArray(["a", "b", "c"]); // => TypeError: Cannot read property 'prefix' of undefined
```

#### 対処法: `this`を一時変数へ代入する {#substitute-this}

コールバック関数内での`this`の参照先が変わる問題への対処法として、`this`を別の変数に代入し、その`this`の参照先を保持するという方法があります。

`this`は関数の呼び出し元で変化し、その参照先は呼び出し元におけるベースオブジェクトです。
`prefixArray`メソッドの呼び出しにおいては、`this`は`Prefixer`オブジェクトです。
しかし、コールバック関数は改めて関数として呼び出されるため`this`が`undefined`となってしまうのが問題でした。

そのため、最初の`prefixArray`メソッド呼び出しにおける`this`の参照先を一時変数として保存することでこの問題を回避できます。
次のコードでは、`prefixArray`メソッドの`this`を`that`変数に保持しています。
コールバック関数からは`this`の代わりに`that`変数を参照することで、コールバック関数からも`prefixArray`メソッド呼び出しと同じ`this`を参照できます。

{{book.console}}
```js
"use strict";
const Prefixer = {
    prefix: "pre",
    prefixArray(strings) {
        // `that`は`prefixArray`メソッド呼び出しにおける`this`となる
        // つまり`that`は`Prefixer`オブジェクトを参照する
        const that = this;
        return strings.map(function(str) {
            // `this`ではなく`that`を参照する
            return that.prefix + "-" + str;
        });
    }
};
// `prefixArray`メソッドにおける`this`は`Prefixer`
const prefixedStrings = Prefixer.prefixArray(["a", "b", "c"]);
console.log(prefixedStrings); // => ["pre-a", "pre-b", "pre-c"]
```

もちろん`Function#call`メソッドなどで明示的に`this`を渡して関数を呼び出すこともできます。
また、`Array#map`メソッドなどは`this`となる値を引数として渡せる仕組みを持っています。
そのため、次のように第二引数に`this`となる値を渡すことでも解決できます。

{{book.console}}
```js
"use strict";
const Prefixer = {
    prefix: "pre",
    prefixArray(strings) {
        // `Array#map`メソッドは第二引数に`this`となる値を渡せる
        return strings.map(function(str) {
            // `this`が第二引数の値と同じになる
            // つまり`prefixArray`メソッドと同じ`this`となる
            return this.prefix + "-" + str;
        }, this);
    }
};
// `prefixArray`メソッドにおける`this`は`Prefixer`
const prefixedStrings = Prefixer.prefixArray(["a", "b", "c"]);
console.log(prefixedStrings); // => ["pre-a", "pre-b", "pre-c"]
```

しかし、これらの解決方法はコールバック関数において`this`が変わることを意識して書く必要があります。
そもそもメソッド呼び出しとその中でのコールバック関数における`this`が変わってしまうのが問題でした。
ES2015では`this`を変えずにコールバック関数を定義する方法として、Arrow Functionが導入されました。

#### 対処法: Arrow Functionでコールバック関数を扱う {#arrow-function-callback}

通常の関数やメソッドは呼び出し時に暗黙的に`this`の値を受け取り、関数内の`this`はその値を参照します。
一方、Arrow Functionはこの暗黙的な`this`の値を受け取りません。
そのためArrow Function内の`this`は、スコープチェーンの仕組みと同様に外側の関数（この場合は`prefixArray`メソッド）を探索します。
これにより、Arrow Functionで定義したコールバック関数は呼び出し方には関係なく、常に外側の関数の`this`をそのまま利用します。

Arrow Functionを使うことで、先ほどのコードは次のように書けます。

{{book.console}}
```js
"use strict";
const Prefixer = {
    prefix: "pre",
    prefixArray(strings) {
        return strings.map((str) => {
            // Arrow Function自体は`this`を持たない
            // `this`は外側の`prefixArray`関数が持つ`this`を参照する
            // そのため`this.prefix`は"pre"となる
            return this.prefix + "-" + str;
        });
    }
};
// このとき、`prefixArray`のベースオブジェクトは`Prefixer`となる
// つまり、`prefixArray`メソッド内の`this`は`Prefixer`を参照する
const prefixedStrings = Prefixer.prefixArray(["a", "b", "c"]);
console.log(prefixedStrings); // => ["pre-a", "pre-b", "pre-c"]
```

このように、Arrow Functionでのコールバック関数における`this`は簡潔です。
コールバック関数内での`this`の対処法として`this`を代入する方法を紹介しましたが、
ES2015からはArrow Functionを使うのがもっとも簡潔です。

このArrow Functionと`this`の関係についてより詳しく見ていきます。

## Arrow Functionと`this` {#arrow-function-this}

Arrow Functionで定義された関数やメソッドにおける`this`がどの値を参照するかは関数の定義時（静的）に決まります。
一方、Arrow Functionではない関数においては、`this`は呼び出し元に依存するため関数の実行時（動的）に決まります。

Arrow Functionとそれ以外の関数で大きく違うことは、Arrow Functionは`this`を暗黙的な引数として受けつけないということです。
そのため、Arrow Function内には`this`が定義されていません。このときの`this`は外側のスコープ（関数）の`this`を参照します。

これは、変数におけるスコープチェーンの仕組みと同様で、そのスコープに`this`が定義されていない場合には外側のスコープを探索します。
そのため、Arrow Function内の`this`の参照で、常に外側のスコープ（関数）へと`this`の定義を探索しに行きます（詳細は[スコープチェーン][]を参照）。
また、`this`はECMAScriptのキーワードであるため、ユーザーは`this`という変数を定義できません。

[import, this-is-readonly](./src/this-is-readonly-invalid.js)

これにより、通常の変数のように`this`がどの値を参照するかは静的（定義時）に決定されます（詳細は[静的スコープ][]を参照）。
つまり、Arrow Functionにおける`this`は「Arrow Function自身の外側のスコープに定義されたもっとも近い関数の`this`の値」となります。

具体的なArrow Functionにおける`this`の動きを見ていきましょう。

まずは、関数式のArrow Functionを見ていきます。

次の例では、関数式で定義したArrow Functionの中の`this`をコンソールに出力しています。
このとき、`fn`の外側には関数がないため、「自身より外側のスコープに定義されたもっとも近い関数」の条件にあてはまるものはありません。
このときの`this`はトップレベルに書かれた`this`と同じ値になります。

{{book.console}}
<!-- TypeError: 'getOwnPropertyDescriptor' on proxy: trap returned descriptor for property 'global' that is incompatible with the existing property in the proxy target を回避する -->
<!-- doctest:disable -->
```js
// Arrow Functionで定義した関数
const fn = () => {
    // この関数の外側には関数は存在しない
    // トップレベルの`this`と同じ値
    return this;
};
console.log(fn() === this); // => true
```

トップレベルに書かれた`this`の値は[実行コンテキスト](#execution-context-this)によって異なることを紹介しました。
`this`の値は、実行コンテキストが"Script"ならばグローバルオブジェクトとなり、"Module"ならば`undefined`となります。

次の例のように、Arrow Functionを包むように通常の関数が定義されている場合はどうでしょうか。
Arrow Functionにおける`this`は「自身の外側のスコープにあるもっとも近い関数の`this`の値」となるのは同じです。

{{book.console}}
```js
"use strict";
function outer() {
    // Arrow Functionで定義した関数を返す
    return () => {
        // この関数の外側には`outer`関数が存在する
        // `outer`関数に`this`を書いた場合と同じ
        return this;
    };
}
// `outer`関数の返り値はArrow Functionにて定義された関数
const innerArrowFunction = outer();
console.log(innerArrowFunction()); // => undefined
```

つまり、このArrow Functionにおける`this`は`outer`関数で`this`を参照した場合と同じ値になります。

{{book.console}}
```js
"use strict";
function outer() {
    // `outer`関数直下の`this`
    const that = this;
    // Arrow Functionで定義した関数を返す
    return () => {
        // Arrow Function自身は`this`を持たない
        // `outer`関数に`this`を書いた場合と同じ
        return that;
    };
}
// `outer()`と呼び出したときの`this`は`undefined`(strict mode)
const innerArrowFunction = outer();
console.log(innerArrowFunction()); // => undefined
```

### メソッドとコールバック関数とArrow Function {#method-callback-arrow-function}

メソッド内におけるコールバック関数はArrow Functionをより活用できるパターンです。
`function`キーワードでコールバック関数を定義すると、`this`の値はコールバック関数の呼ばれ方を意識する必要があります。
なぜなら、`function`キーワードで定義した関数における`this`は呼び出し方によって変わるためです。

コールバック関数側から見ると、どのように呼ばれるかによって変わってしまう`this`を使うことはできません。
そのため、コールバック関数の外側のスコープで`this`を一時変数に代入し、それを使うという回避方法を取っていました。

```js
// `callback`関数を受け取り呼び出す関数
const callCallback = (callback) => {
    // `callback`を呼び出す実装
};

const obj = {
    method() {
        callCallback(function() {
            // ここでの `this` は`callCallback`の実装に依存する
            // `callback()`のように単純に呼び出されるなら`this`は`undefined`になる
            // `Function#call`などを使って特定のオブジェクトを指定するかもしれない
            // この問題を回避するために`const that = this`のような一時変数を使う
        });
    }
};
```

一方、Arrow Functionでコールバック関数を定義した場合は、1つ外側の関数の`this`を参照します。
このときのArrow Functionで定義したコールバック関数における`this`は呼び出し方によって変化しません。
そのため、`this`を一時変数に代入するなどの回避方法は必要ありません。

```js
// `callback`関数を受け取り呼び出す関数
const callCallback = (callback) => {
    // `callback`を呼び出す実装
};

const obj = {
    method() {
        callCallback(() => {
            // ここでの`this`は1つ外側の関数における`this`と同じ
        });
    }
};
```

このArrow Functionにおける`this`は呼び出し方の影響を受けません。
つまり、コールバック関数がどのように呼ばれるかという実装についてを考えることなく`this`を扱えます。

{{book.console}}
```js
const Prefixer = {
    prefix: "pre",
    prefixArray(strings) {
        return strings.map((str) => {
            // `Prefixer.prefixArray()` と呼び出されたとき
            // `this`は常に`Prefixer`を参照する
            return this.prefix + "-" + str;
        });
    }
};
const prefixedStrings = Prefixer.prefixArray(["a", "b", "c"]);
console.log(prefixedStrings); // => ["pre-a", "pre-b", "pre-c"]
```

### Arrow Functionは`this`をbindできない {#not-bind-arrow-function}

Arrow Functionで定義した関数では`call`、`apply`、`bind`を使った`this`の指定は単に無視されます。
これは、Arrow Functionは`this`を持てないためです。

次のようにArrow Functionで定義した関数に対して`call`で`this`を指定しても、`this`の参照先が代わっていないことがわかります。
同様に`apply`や`bind`メソッドを使った場合も`this`の参照先は変わりません。

{{book.console}}
<!-- doctest:disable -->
```js
const fn = () => {
    return this;
};
// Scriptコンテキストの場合、スクリプト直下のArrow Functionの`this`はグローバルオブジェクト
console.log(fn()); // グローバルオブジェクト
// callで`this`を`{}`にしようとしても、`this`は変わらない
console.log(fn.call({})); // グローバルオブジェクト
```


最初に述べたように`function`キーワードで定義した関数では呼び出し時に、ベースオブジェクトが`this`の値として暗黙的な引数のように渡されます。 
一方、Arrow Functionの関数は呼び出し時に`this`を受け取らず、`this`の参照先は定義時に静的に決定されます。

<!-- textlint-disable -->

また、`this`が変わらないのはあくまでArrow Functionで定義した関数だけで、Arrow Functionの`this`が参照する「自身の外側のスコープにあるもっとも近い関数の`this`の値」は`call`メソッドで変更できます。

<!-- textlint-enable -->

{{book.console}}
```js
const obj = {
    method() {
        const arrowFunction = () => {
            return this;
        };
        return arrowFunction();
    }
};
// 通常の`this`は`obj.method`の`this`と同じ
console.log(obj.method()); // => obj
// `obj.method`の`this`を変更すれば、Arrow Functionの`this`も変更される
console.log(obj.method.call("THAT")); // => "THAT"
```

## まとめ {#conclusion}

`this`は状況によって異なる値を参照する性質を持ったキーワードであることを紹介しました。
その`this`の評価結果をまとめると次の表のようになります。

| 実行コンテキスト | strict mode | コード                                               | `this`の評価結果 |
| ---------------- | ----------- | ---------------------------------------------------- | ---------------- |
| Script           | ＊          | `this`                                               | global           |
| Script           | ＊          | `const fn = () => this`                              | global           |
| Script           | NO          | `const fn = function(){ return this; }`              | global           |
| Script           | YES         | `const fn = function(){ return this; }`              | undefined        |
| Script           | ＊          | `const obj = { method: () => { return this; } }`     | global           |
| Module           | YES         | `this`                                               | undefined        |
| Module           | YES         | `const fn = () => this`                              | undefined        |
| Module           | YES         | `const fn = function(){ return this; }`              | undefined        |
| Module           | YES         | `const obj = { method: () => { return this; } }`     | undefined        |
| ＊               | ＊          | `const obj = { method(){ return this; } }`           | `obj`            |
| ＊               | ＊          | `const obj = { method: function(){ return this; } }` | `obj`            |

> ＊はどの場合でも`this`の評価結果に影響しないということを示しています。

実際にブラウザで実行した結果は[What is `this` value in JavaScript][]というサイトで確認できます。

`this`はオブジェクト指向プログラミングの文脈でJavaScriptに導入されました。
メソッド以外においても`this`は評価できますが、実行コンテキストやstrict modeなどによって結果が異なり、混乱の元となります。
そのため、メソッドではない通常の関数においては`this`を使うべきではありません。[^1]

また、メソッドにおいても`this`は呼び出し方によって異なる値となり、それにより発生する問題と対処法について紹介しました。
コールバック関数における`this`はArrow Functionを使うことでわかりやすく解決できます。
この背景にはArrow Functionで定義した関数は`this`を持たないという性質があります。

[^1]: ES2015の仕様編集者であるAllen Wirfs-Brock‏氏もただの関数においては`this`を使うべきではないと述べている。<https://twitter.com/awbjs/status/938272440085446657>;
[JavaScriptとは]: ../introduction/README.md
[関数と宣言]: ../function-declaration/README.md
[クラス]: ../class/README.md
[関数とスコープ]: ../function-scope/README.md
[スコープチェーン]: ../function-scope/README.md##scope-chain}
[静的スコープ]: ../function-scope/README.md#static-scope
[動的スコープ]: ../function-scope/README.md#dynamic-scope
[What is `this` value in JavaScript]: https://azu.github.io/what-is-this/
