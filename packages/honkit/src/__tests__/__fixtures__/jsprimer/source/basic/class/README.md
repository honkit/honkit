---
author: azu
description: "JavaScriptにおけるクラスの定義方法や継承方法を紹介します。プロトタイプベースの言語であるJavaScriptがどのように継承などを実現しているのかを紹介します。"
---

# クラス {#class}

「クラス」と一言にいってもさまざまであるため、ここでは**構造**、**動作**、**状態**を定義できるものを指すことにします。
また、この章では概念を示す場合は**クラス**と呼び、クラスに関する構文（記述するコード）のことを`class`構文と呼びます。

**クラス**とは**動作**や**状態**を定義した**構造**です。
クラスからはインスタンスと呼ばれるオブジェクトを作成でき、インスタンスはクラスに定義した**動作**を継承し、**状態**は動作によって変化します。
とても抽象的なことに思えますが、これは今までオブジェクトや関数を使って表現してきたものです。
JavaScriptではES2015より前までは`class`構文はなく、関数を使ってクラスのようなものを表現して扱っていました。

ES2015でクラスを表現するための`class`構文が導入されましたが、この`class`構文で定義したクラスは関数オブジェクトの一種です。
`class`構文ではプロトタイプベースの継承の仕組みを使って関数でクラスを表現しています。
そのため、`class`構文はクラスを作るための関数定義や継承をパターン化した書き方と言えます。[^1]

また、関数の定義方法として関数宣言文と関数式があるように、クラスにもクラス宣言文とクラス式があります。
このように関数とクラスは似ている部分が多いです。

この章では、`class`構文でのクラスの定義や継承、クラスの性質について学んでいきます。

## クラスの定義 {#class-declaration}

クラスを定義するには`class`構文を使います。
クラスの定義方法にはクラス宣言文とクラス式があります。

まずは、クラス宣言文によるクラスの定義方法を見ていきます。

クラス宣言文では`class`キーワードを使い、`class クラス名{ }`のようにクラスの**構造**を定義できます。

クラスは必ずコンストラクタを持ち、`constructor`という名前のメソッドとして定義します。
コンストラクタとは、そのクラスからインスタンスを作成する際にインスタンスに関する**状態**の初期化を行うメソッドです。
`constructor`メソッドに定義した処理は、クラスをインスタンス化したときに自動的に呼び出されます。

{{book.console}}
```js
class MyClass {
    constructor() {
        // コンストラクタ関数の処理
        // インスタンス化されるときに自動的に呼び出される
    }
}
```

もうひとつの定義方法であるクラス式は、クラスを値として定義する方法です。
クラス式ではクラス名を省略できます。これは関数式における匿名関数と同じです。

{{book.console}}
```js
const MyClass = class MyClass {
    constructor() {}
};

const AnonymousClass = class {
    constructor() {}
};
```

コンストラクタ関数内で、何も処理がない場合はコンストラクタの記述を省略できます。
省略した場合でも自動的に空のコンストラクタが定義されるため、クラスにはコンストラクタが必ず存在します。

```js
class MyClassA {
    constructor() {
        // コンストラクタの処理が必要なら書く
    }
}
// コンストラクタの処理が不要な場合は省略できる
class MyClassB {

}
```

## クラスのインスタンス化 {#class-instance}

クラスは`new`演算子でインスタンスであるオブジェクトを作成できます。
`class`構文で定義したクラスからインスタンスを作成することを**インスタンス化**と呼びます。
あるインスタンスが指定したクラスから作成されたものかを判定するには`instanceof`演算子が利用できます。

{{book.console}}
```js
class MyClass {
}
// `MyClass`をインスタンス化する
const myClass = new MyClass();
// 毎回新しいインスタンス(オブジェクト)を作成する
const myClassAnother = new MyClass();
// それぞれのインスタンスは異なるオブジェクト
console.log(myClass === myClassAnother); // => false
// クラスのインスタンスかどうかは`instanceof`演算子で判定できる
console.log(myClass instanceof MyClass); // => true
console.log(myClassAnother instanceof MyClass); // => true
```

このままでは何も処理がない空のクラスなので、値を持ったクラスを定義してみましょう。

クラスではインスタンスの初期化処理をコンストラクタ関数で行います。
コンストラクタ関数は`new`演算子でインスタンス化する際に自動的に呼び出されます。
コンストラクタ関数内での`this`はこれから新しく作るインスタンスオブジェクトとなります。

次のコードでは、`x`座標と`y`座標の値を持つ`Point`というクラスを定義しています。
コンストラクタ関数（`constructor`）の中でインスタンスオブジェクト（`this`）の`x`と`y`プロパティに値を代入して初期化しています。

{{book.console}}
```js
class Point {
    // コンストラクタ関数の仮引数として`x`と`y`を定義
    constructor(x, y) {
        // コンストラクタ関数における`this`はインスタンスを示すオブジェクト
        // インスタンスの`x`と`y`プロパティにそれぞれ値を設定する
        this.x = x;
        this.y = y;
    }
}
```

この`Point`クラスのインスタンスを作成するには`new`演算子を使います。
`new`演算子には関数呼び出しと同じように引数を渡すことができます。
`new`演算子の引数はクラスの`constructor`メソッド（コンストラクタ関数）の仮引数に渡されます。
そして、コンストラクタの中ではインスタンスオブジェクト（`this`）の初期化処理を行います。

{{book.console}}
```js
class Point {
    // 2. コンストラクタ関数の仮引数として`x`には`3`、`y`には`4`が渡る
    constructor(x, y) {
        // 3. インスタンス(`this`)の`x`と`y`プロパティにそれぞれ値を設定する
        this.x = x;
        this.y = y;
        // コンストラクタではreturn文は書かない
    }
}

// 1. コンストラクタを`new`演算子で引数とともに呼び出す
const point = new Point(3, 4);
// 4. `Point`のインスタンスである`point`の`x`と`y`プロパティには初期化された値が入る
console.log(point.x); // => 3
console.log(point.y); // => 4
```

このようにクラスからインスタンスを作成するには必ず`new`演算子を使います。

一方、クラスは通常の関数として呼ぶことができません。
これは、クラスのコンストラクタはインスタンス（`this`）を初期化する場所であり、通常の関数とは役割が異なるためです。

{{book.console}}
```js
class MyClass {
    constructor() { }
}
// クラスのコンストラクタ関数として呼び出すことはできない
MyClass(); // => TypeError: class constructors must be invoked with |new|
```

コンストラクタは初期化処理を書く場所であるため、`return`文で値を返すべきではありません。
JavaScriptでは、コンストラクタ関数が任意のオブジェクトを返すことが可能ですが、行うべきではありません。
なぜなら、コンストラクタは`new`演算子で呼び出し、その評価結果はクラスのインスタンスを期待するのが一般的であるためです。

次のコードのようにコンストラクタで返した値が`new`演算子で呼び出した際の返り値となります。
このような書き方は混乱を生むため避けるべきです。

{{book.console}}
```js
// 非推奨の例: コンストラクタで値を返すべきではない
class Point {
    constructor(x, y) {
        // `this`の代わりにただのオブジェクトを返せる
        return { x, y };
    }
}

// `new`演算子の結果はコンストラクタ関数が返したただのオブジェクト
const point = new Point(3, 4);
console.log(point); // => { x: 3, y: 4 }
// Pointクラスのインスタンスではない
console.log(point instanceof Point); // => false
```

### [Note] クラス名は大文字ではじめる {#class-name-start-upper-case}

JavaScriptでは慣習としてクラス名には大文字ではじまる名前をつけます。
これは、変数名にキャメルケースを使う慣習があるのと同じで、名前自体に特別なルールがあるわけではありません。
クラス名を大文字にしておき、そのインスタンスは小文字で開始すれば名前が被らないという合理的な理由で好まれています。

```js
class Thing {}
const thing = new Thing();
```

### [コラム] `class`構文と関数でのクラスの違い {#class-vs-function}

ES2015より前はこれらのクラスを`class`構文ではなく、関数で表現していました。
その表現方法は人によってさまざまで、これも`class`構文という統一した記法が導入された理由の1つです。

次のコードは、関数でクラスを実装した1つの例です。
この関数でのクラス表現は、継承の仕組みなどは省かれていますが、`class`構文とよく似ています。

{{book.console}}
```js
// コンストラクタ関数
const Point = function PointConstructor(x, y) {
    // インスタンスの初期化処理
    this.x = x;
    this.y = y;
};

// `new`演算子でコンストラクタ関数から新しいインスタンスを作成
const point = new Point(3, 4);
```

大きな違いとして、`class`構文で定義したクラスは関数として呼び出すことができません。
クラスは`new`演算子でインスタンス化して使うものなので、これはクラスの誤用を防ぐ仕様です。
一方、関数でのクラス表現はただの関数なので、当然関数として呼び出せます。

{{book.console}}
```js
// 関数でのクラス表現
function MyClassLike() {
}
// 関数なので関数として呼び出せる
MyClassLike(); 

// `class`構文でのクラス
class MyClass {
}
// クラスは関数として呼び出すと例外が発生する
MyClass(); // => TypeError: class constructors must be invoked with |new|
```

このように、関数でクラスのようなものを実装した場合には、関数として呼び出せてしまう問題があります。
このような問題を避けるためにもクラスは`class`構文を使って実装します。

## クラスのプロトタイプメソッドの定義 {#class-prototype-method-definition}

クラスの**動作**はメソッドによって定義できます。
`constructor`メソッドは初期化時に呼ばれる特殊なメソッドですが、`class`構文ではクラスに対して自由にメソッドを定義できます。
このクラスに定義したメソッドは作成したインスタンスが持つ動作となります。

次のように`class`構文ではクラスに対してメソッドを定義できます。
メソッドの中からクラスのインスタンスを参照するには、`constructor`メソッドと同じく`this`を使います。
このクラスのメソッドにおける`this`は「[関数とthis][]」の章で学んだメソッドと同じくベースオブジェクトを参照します。

<!-- doctest:disable -->
```js
class クラス {
    メソッド() {
        // ここでの`this`はベースオブジェクトを参照
    }
}

const インスタンス = new クラス();
// メソッド呼び出しのベースオブジェクト(`this`)は`インスタンス`となる
インスタンス.メソッド();
```

クラスのプロトタイプメソッド定義では、オブジェクトにおけるメソッドとは異なり`key : value`のように`:`区切りでメソッドを定義できないことに注意してください。
つまり、次のような書き方は構文エラー（`SyntaxError`）となります。

<!-- textlint-disable -->
<!-- doctest:disable -->
```js
// クラスでは次のようにメソッドを定義できない
class クラス {
   // SyntaxError
   メソッド: () => {}
   // SyntaxError
   メソッド: function(){}
}
```
<!-- textlint-enable -->

このようにクラスに対して定義したメソッドは、クラスの各インスタンスから**共有されるメソッド**となります。
このインスタンス間で共有されるメソッドのことを**プロトタイプメソッド**と呼びます。
また、プロトタイプメソッドはインスタンスから呼び出せるメソッドであるため**インスタンスメソッド**とも呼ばれます。

この書籍では、プロトタイプメソッド（インスタンスメソッド）を`クラス#メソッド名`のように表記します。

次のコードでは、`Counter`クラスに`increment`メソッド（`Counter#increment`メソッド）を定義しています。
`Counter`クラスのインスタンスはそれぞれ別々の状態（`count`プロパティ）を持ちます。

{{book.console}}
```js
class Counter {
    constructor() {
        this.count = 0;
    }
    // `increment`メソッドをクラスに定義する
    increment() {
        // `this`は`Counter`のインスタンスを参照する
        this.count++;
    }
}
const counterA = new Counter();
const counterB = new Counter();
// `counterA.increment()`のベースオブジェクトは`counterA`インスタンス
counterA.increment();
// 各インスタンスの持つプロパティ(状態)は異なる
console.log(counterA.count); // => 1
console.log(counterB.count); // => 0
```

また`increment`メソッドはプロトタイプメソッドとして定義されています。
プロトタイプメソッドは各インスタンス間で共有されます。
そのため、次のように各インスタンスの`increment`メソッドの参照先は同じとなっていることがわかります。

{{book.console}}
```js
class Counter {
    constructor() {
        this.count = 0;
    }
    increment() {
        this.count++;
    }
}
const counterA = new Counter();
const counterB = new Counter();
// 各インスタンスオブジェクトのメソッドは共有されている(同じ関数を参照している)
console.log(counterA.increment === counterB.increment); // => true
```

プロトタイプメソッドがなぜインスタンス間で共有されているのかは、クラスの継承の仕組みと密接に関係しています。
プロトタイプメソッドの仕組みについては後ほど解説します。

### クラスのインスタンスに対してメソッドを定義する {#class-instance-method}

`class`構文でのメソッド定義はプロトタイプメソッドとなり、インスタンス間で共有されます。

一方、クラスのインスタンスに対して、直接メソッドを定義する方法もあります。
これは、コンストラクタ関数内でインスタンスオブジェクトである`this`に対してメソッドを定義するだけです。

次のコードでは、`Counter`クラスのコンストラクタ関数で、インスタンスオブジェクトに`increment`メソッドを定義しています。
コンストラクタ関数内で`this`はインスタンスオブジェクトを示すため、`this`に対してメソッドを定義しています。

{{book.console}}
```js
class Counter {
    constructor() {
        this.count = 0;
        this.increment = () => {
            // `this`は`constructor`メソッドにおける`this`（インスタンスオブジェクト）を参照する
            this.count++;
        };
    }
}
const counterA = new Counter();
const counterB = new Counter();
// `counterA.increment()`のベースオブジェクトは`counterA`インスタンス
counterA.increment();
// 各インスタンスの持つプロパティ(状態)は異なる
console.log(counterA.count); // => 1
console.log(counterB.count); // => 0
```

この方法で定義した`increment`メソッドはインスタンスから呼び出せるため、インスタンスメソッドです。
しかし、インスタンスオブジェクトに定義した`increment`メソッドはプロトタイプメソッドではありません。
インスタンスオブジェクトのメソッドとプロトタイプメソッドには、いくつか異なる点があります。

プロトタイプメソッドは各インスタンスから共有されているため、各インスタンスからのメソッドの参照先が同じでした。
しかし、インスタンスオブジェクトのメソッドは、コンストラクタで毎回同じ挙動の関数（オブジェクト）を新しく定義しています。
そのため、次のように各インスタンスからのメソッドの参照先も異なります。

```js
class Counter {
    constructor() {
        this.count = 0;
        this.increment = () => {
            this.count++;
        };
    }
}
const counterA = new Counter();
const counterB = new Counter();
// 各インスタンスオブジェクトのメソッドの参照先は異なる
console.log(counterA.increment !== counterB.increment); // => true
```

また、プロトタイプメソッドとは異なり、インスタンスオブジェクトへのメソッド定義はArrow Functionが利用できます。
Arrow Functionには`this`が静的に決まるという性質があるため、メソッドにおける`this`の参照先をインスタンスに固定できます。
なぜならArrow Functionで定義した`increment`メソッドはどのような呼び出し方をしても、必ず`constructor`における`this`となるためです（「[Arrow Functionでコールバック関数を扱う][]」を参照）。

{{book.console}}
```js
"use strict";
class ArrowClass {
    constructor() {
        // コンストラクタでの`this`は常にインスタンス
        this.method = () => {
            // Arrow Functionにおける`this`は静的に決まる
            // そのため`this`は常にインスタンスを参照する
            return this;
        };
    }
}
const instance = new ArrowClass();
const method = instance.method;
// 呼び出し方法（ベースオブジェクト）に依存しないため、`this`がインスタンスを参照する
console.log(method()); // => instance
```

一方、プロトタイプメソッドにおける`this`はメソッド呼び出し時のベースオブジェクトを参照します。
そのためプロトタイプメソッドは呼び出し方によって`this`の参照先が異なります（「[関数とthis][]」の章の「[問題: `this`を含むメソッドを変数に代入した場合][]」を参照）。

{{book.console}}
```js
"use strict";
class PrototypeClass {
    method() {
        // `this`はベースオブジェクトを参照する
        return this;
    };
}
const instance = new PrototypeClass();
const method = instance.method;
// ベースオブジェクトはundefined
console.log(method()); // => undefined
```

このように、インスタンスに対してArrow Functionでメソッドを定義することで`this`の参照先を固定化できます。

## クラスのアクセッサプロパティの定義 {#class-accessor-property}

<!-- textlint-disable no-js-function-paren -->

クラスに対してメソッドを定義できますが、メソッドは`メソッド名()`のように呼び出す必要があります。
クラスでは、プロパティの参照（getter）、プロパティへの代入（setter）時に呼び出される特殊なメソッドを定義できます。
このメソッドはプロパティのように振る舞うため**アクセッサプロパティ**と呼ばれます。

<!-- textlint-enable no-js-function-paren -->

次のコードでは、プロパティの参照（getter）、プロパティへの代入（setter）に対するアクセッサプロパティを定義しています。
アクセッサプロパティはメソッド名（プロパティ名）の前に`get`または`set`をつけるだけです。
getter（`get`）には仮引数はありませんが、必ず値を返す必要があります。
setter（`set`）の仮引数にはプロパティへ代入する値が入りますが、値を返す必要はありません。

<!-- doctest:disable -->
```js
class クラス {
    // getter
    get プロパティ名() {
        return 値;
    }
    // setter
    set プロパティ名(仮引数) {
        // setterの処理
    }
}
const インスタンス = new クラス();
インスタンス.プロパティ名; // getterが呼び出される
インスタンス.プロパティ名 = 値; // setterが呼び出される
```

次のコードでは、`NumberWrapper`クラスの`value`プロパティをアクセッサプロパティとして定義しています。
`value`プロパティへアクセスした際にそれぞれ定義したgetterとsetterが呼ばれているのがわかります。
このアクセッサプロパティで実際に読み書きされているのは、`NumberWrapper`インスタンスの`_value`プロパティとなります。

{{book.console}}
```js
class NumberWrapper {
    constructor(value) {
        this._value = value;
    }
    // `_value`プロパティの値を返すgetter
    get value() {
        console.log("getter");
        return this._value;
    }
    // `_value`プロパティに値を代入するsetter
    set value(newValue) {
        console.log("setter");
        this._value = newValue;
    }
}

const numberWrapper = new NumberWrapper(1);
// "getter"とコンソールに表示される
console.log(numberWrapper.value); // => 1
// "setter"とコンソールに表示される
numberWrapper.value = 42;
// "getter"とコンソールに表示される
console.log(numberWrapper.value); // => 42
```

<!-- Note: インスタンスオブジェクトのアクセッサプロパティ
インスタンスオブジェクトへも定義できるが、メソッドとは異なり意味の違いがでることはないため省略。
またフィールドとして定義することはできないため対比は意味がない。
-->

### [コラム] プライベートプロパティ {#private-property}

`NumberWrapper#value`のアクセッサプロパティで実際に読み書きしているのは、`_value`プロパティです。
このように、外から直接読み書きしてほしくないプロパティを`_`（アンダーバー）で開始するのはただの習慣であるため、構文としての意味はありません。

現時点（ECMAScript {{book.esversion}}）では、外から原理的に参照できないプライベートプロパティ（hard private）を定義する構文はありません。
しかし、現時点でも`WeakSet`などを使うことで疑似的なプライベートプロパティを実現できます。
`WeakSet`については「[Map/Set][]」の章で解説します。

### `Array#length`をアクセッサプロパティで再現する {#array-like-length}

getterやsetterを利用しないと実現が難しいものとして`Array#length`プロパティがあります。
`Array#length`プロパティへ値を代入すると、そのインデックス以降の要素は自動的に削除される仕様になっています。

次のコードでは、配列の要素数（`length`プロパティ）を小さくすると配列の要素が削除されています。

{{book.console}}
```js
const array = [1, 2, 3, 4, 5];
// 要素数を減らすと、インデックス以降の要素が削除される
array.length = 2;
console.log(array.join(", ")); // => "1, 2"
// 要素数だけを増やしても、配列の中身は空要素が増えるだけ
array.length = 5;
console.log(array.join(", ")); // => "1, 2, , , "
```

この`length`プロパティの挙動を再現する`ArrayLike`クラスを実装してみます。
`Array#length`プロパティは、`length`プロパティへ値を代入した際に次のようなことを行っています。

- 現在要素数より小さな**要素数**が指定された場合、その**要素数**を変更し、配列の末尾の要素を削除する
- 現在要素数より大きな**要素数**が指定された場合、その**要素数**だけを変更し、配列の実際の要素はそのままにする

<!-- Note:

- 仕様的にもIf newLen ≥ oldLenでは`length`だけを変更している
- <https://tc39.github.io/ecma262/#sec-arraysetlength>

-->

`ArrayLike#length`のsetterで要素の追加や削除を実装することで、配列のような`length`プロパティを実装できます。

{{book.console}}
```js
/**
 * 配列のようなlengthを持つクラス
 */
class ArrayLike {
    constructor(items = []) {
        this._items = items;
    }

    get items() {
        return this._items;
    }

    get length() {
        return this._items.length;
    }

    set length(newLength) {
        const currentItemLength = this.items.length;
        // 現在要素数より小さな`newLength`が指定された場合、指定した要素数となるように末尾を削除する
        if (newLength < currentItemLength) {
            this._items = this.items.slice(0, newLength);
        } else if (newLength > currentItemLength) {
            // 現在要素数より大きな`newLength`が指定された場合、指定した要素数となるように末尾に空要素を追加する
            this._items = this.items.concat(new Array(newLength - currentItemLength));
        }
    }
}

const arrayLike = new ArrayLike([1, 2, 3, 4, 5]);
// 要素数を減らすとインデックス以降の要素が削除される
arrayLike.length = 2;
console.log(arrayLike.items.join(", ")); // => "1, 2"
// 要素数を増やすと末尾に空要素が追加される
arrayLike.length = 5;
console.log(arrayLike.items.join(", ")); // => "1, 2, , , "
```

このようにアクセッサプロパティでは、プロパティのようでありながら実際にアクセスした際には他のプロパティと連動する動作を実現できます。

## 静的メソッド {#static-method}

インスタンスメソッドは、クラスをインスタンス化して利用します。
一方、クラスをインスタンス化せずに利用できる静的メソッド（クラスメソッド）もあります。

静的メソッドの定義方法はメソッド名の前に、`static`をつけるだけです。

<!-- doctest:disable -->
```js
class クラス {
    static メソッド() {
        // 静的メソッドの処理
    }
}
// 静的メソッドの呼び出し
クラス.メソッド();
```

次のコードでは、配列をラップする`ArrayWrapper`というクラスを定義しています。
`ArrayWrapper`はコンストラクタの引数として配列を受け取って初期化しています。
このクラスに配列ではなく要素そのものを引数に受け取ってインスタンス化できる`ArrayWrapper.of`という静的メソッドを定義します。

{{book.console}}
```js
class ArrayWrapper {
    constructor(array = []) {
        this.array = array;
    }

    // rest parametersとして要素を受けつける
    static of(...items) {
        return new ArrayWrapper(items);
    }

    get length() {
        return this.array.length;
    }
}

// 配列を引数として渡している
const arrayWrapperA = new ArrayWrapper([1, 2, 3]);
// 要素を引数として渡している
const arrayWrapperB = ArrayWrapper.of(1, 2, 3);
console.log(arrayWrapperA.length); // => 3
console.log(arrayWrapperB.length); // => 3
```

クラスの静的メソッドにおける`this`は、そのクラス自身を参照します。
そのため、先ほどのコードは`new ArrayWrapper`の代わりに`new this`と書くこともできます。

{{book.console}}
```js
class ArrayWrapper {
    constructor(array = []) {
        this.array = array;
    }

    static of(...items) {
        // `this`は`ArrayWrapper`を参照する
        return new this(items);
    }

    get length() {
        return this.array.length;
    }
}

const arrayWrapper = ArrayWrapper.of(1, 2, 3);
console.log(arrayWrapper.length); // => 3
```

このように静的メソッドでの`this`はクラス自身を参照するため、クラスのインスタンスは参照できません。
そのため静的メソッドは、クラスのインスタンスを作成する処理やクラスに関係する処理を書くために利用されます。

## 2種類のインスタンスメソッドの定義 {#two-instance-method-definition}

クラスでは、2種類のインスタンスメソッドの定義方法があります。
`class`構文を使ったインスタンス間で共有されるプロトタイプメソッドの定義と、
インスタンスオブジェクトに対するメソッドの定義です。

これらの2つの方法を同時に使い、1つのクラスに同じ名前でメソッドを2つ定義した場合はどうなるでしょうか？

次のコードでは、`ConflictClass`クラスにプロトタイプメソッドとインスタンスに対して同じ`method`という名前のメソッドを定義しています。

{{book.console}}
```js
class ConflictClass {
    constructor() {
        // インスタンスオブジェクトに`method`を定義
        this.method = () => {
            console.log("インスタンスオブジェクトのメソッド");
        };
    }

    // クラスのプロトタイプメソッドとして`method`を定義
    method() {
        console.log("プロトタイプのメソッド");
    }
}

const conflict = new ConflictClass();
conflict.method(); // どちらの`method`が呼び出される？
```

結論から述べると、この場合はインスタンスオブジェクトに定義した`method`が呼び出されます。
このとき、インスタンスの`method`プロパティを`delete`演算子で削除すると、今度はプロトタイプメソッドの`method`が呼び出されます。

{{book.console}}
```js
class ConflictClass {
    constructor() {
        this.method = () => {
            console.log("インスタンスオブジェクトのメソッド");
        };
    }

    method() {
        console.log("プロトタイプメソッド");
    }
}

const conflict = new ConflictClass();
conflict.method(); // "インスタンスオブジェクトのメソッド"
// インスタンスの`method`プロパティを削除
delete conflict.method;
conflict.method(); // "プロトタイプメソッド"
```

この実行結果から次のことがわかります。

- プロトタイプメソッドとインスタンスオブジェクトのメソッドは上書きされずにどちらも定義されている
- インスタンスオブジェクトのメソッドがプロトタイプオブジェクトのメソッドよりも優先して呼ばれている

どちらも注意深く意識しないと気づきにくいですが、この挙動はJavaScriptの重要な仕組みであるため理解することは重要です。

この挙動は**プロトタイプオブジェクト**と呼ばれる特殊なオブジェクトと**プロトタイプチェーン**と呼ばれる仕組みで成り立っています。
どちらも**プロトタイプ**とついていることからわかるように、2つで1組のような仕組みです。

このセクションでは、**プロトタイプオブジェクト**と**プロトタイプチェーン**とはどのような仕組みなのかを見ていきます。

## プロトタイプオブジェクト {#prototype}

**プロトタイプメソッド**と**インスタンスオブジェクトのメソッド**を同時に定義しても、互いのメソッドは上書きされるわけでありません。
なぜなら、プロトタイプメソッドは**プロトタイプオブジェクト**へ、インスタンスオブジェクトのメソッドは**インスタンスオブジェクト**へそれぞれ定義されるためです。

プロトタイプオブジェクトについては「[プロトタイプオブジェクト][]」の章で簡単に紹介していましたが、改めて解説していきます。

**プロトタイプオブジェクト**とは、JavaScriptの関数オブジェクトの`prototype`プロパティに自動的に作成される特殊なオブジェクトです。
クラスも一種の関数オブジェクトであるため、自動的に`prototype`プロパティにプロトタイプオブジェクトが作成されています。

次のコードでは、関数やクラス自身の`prototype`プロパティに、プロトタイプオブジェクトが自動的に作成されていることがわかります。

{{book.console}}
```js
function fn() {
}
// `prototype`プロパティにプロトタイプオブジェクトが存在する
console.log(typeof fn.prototype === "object"); // => true

class MyClass {
}
// `prototype`プロパティにプロトタイプオブジェクトが存在する
console.log(typeof MyClass.prototype === "object"); // => true
```

`class`構文のメソッド定義は、このプロトタイプオブジェクトのプロパティとして定義されます。

次のコードでは、クラスのメソッドがプロトタイプオブジェクトに定義されていることを確認できます。
また、クラスには`constructor`メソッド（コンストラクタ）が必ず定義されます。
この`constructor`メソッドもプロトタイプオブジェクトに定義されており、この`constructor`プロパティはクラス自身を参照します。

{{book.console}}
```js
class MyClass {
    method() { }
}

console.log(typeof MyClass.prototype.method === "function"); // => true
// クラス#constructorはクラス自身を参照する
console.log(MyClass.prototype.constructor === MyClass); // => true
```

このように、プロトタイプメソッドはプロトタイプオブジェクトに定義され、インスタンスオブジェクトのメソッドとは異なるオブジェクトに定義されています。そのため、それぞれの方法でメソッドを定義しても、上書きされることはありません。

## プロトタイプチェーン {#prototype-chain}

`class`構文で定義したプロトタイプメソッドはプロトタイプオブジェクトに定義されます。
しかし、インスタンス（オブジェクト）にはメソッドが定義されていないのに、インスタンスからクラスのプロトタイプメソッドを呼び出せます。

{{book.console}}
```js
class MyClass {
    method() {
        console.log("プロトタイプのメソッド");
    }
}
const instance = new MyClass();
instance.method(); // "プロトタイプのメソッド"
```

インスタンスからプロトタイプメソッドを呼び出せるのは**プロトタイプチェーン**と呼ばれる仕組みによるものです。
プロトタイプチェーンは2つの処理から成り立ちます。

- インスタンス作成時に、インスタンスの`[[Prototype]]`内部プロパティへプロトタイプオブジェクトの参照を保存する処理
- インスタンスからプロパティ（またはメソッド）を参照するときに、`[[Prototype]]`内部プロパティまで探索する処理

### インスタンス作成とプロトタイプチェーン {#write-prototype-chain}

クラスから`new`演算子によってインスタンスを作成する際に、インスタンスにはクラスのプロトタイプオブジェクトへの参照が保存されます。
このとき、インスタンスからクラスのプロトタイプオブジェクトへの参照は、インスタンスオブジェクトの`[[Prototype]]`という内部プロパティに保存されます。

`[[Prototype]]`内部プロパティはECMAScriptの仕様で定められた内部的な表現であるため、通常のプロパティのようにはアクセスできません。
ここでは説明のために、`[[プロパティ名]]`という書式でECMAScriptの仕様上に存在する内部プロパティを表現しています。

<!-- textlint-disable ja-technical-writing/sentence-length -->

`[[Prototype]]`内部プロパティへプロパティのようにはアクセスできませんが、`Object.getPrototypeOf`メソッドで`[[Prototype]]`内部プロパティを参照できます。

<!-- textlint-enable ja-technical-writing/sentence-length -->

次のコードでは、`instance`オブジェクトの`[[Prototype]]`内部プロパティを取得しています。
その取得した結果がクラスのプロトタイプオブジェクトを参照していることを確認できます。

{{book.console}}
```js
class MyClass {
    method() {
        console.log("プロトタイプのメソッド");
    }
}
const instance = new MyClass();
// `instance`の`[[Prototype]]`内部プロパティは`MyClass.prototype`と一致する
const MyClassPrototype = Object.getPrototypeOf(instance);
console.log(MyClassPrototype === MyClass.prototype); // => true
```

ここで重要なのは、インスタンスはどのクラスから作られたかやそのクラスのプロトタイプオブジェクトを知っているということです。

----

#### Note: `[[Prototype]]`内部プロパティを読み書きする {#inner-property}

`Object.getPrototypeOf(オブジェクト)`で`オブジェクト`の`[[Prototype]]`を読み取ることができます。
一方、`Object.setPrototypeOf(オブジェクト, プロトタイプオブジェクト)`で`オブジェクト`の`[[Prototype]]`に`プロトタイプオブジェクト`を設定できます。
また、`[[Prototype]]`内部プロパティを通常のプロパティのように扱える`__proto__`という特殊なアクセッサプロパティが存在します。

しかし、これらの`[[Prototype]]`内部プロパティを直接読み書きすることは通常の用途では行いません。
また、既存のビルトインオブジェクトの動作なども変更できるため、不用意に扱うべきではないでしょう。

----

### プロパティの参照とプロトタイプチェーン {#read-prototype-chain}

プロトタイプオブジェクトのプロパティがどのようにインスタンスから参照されるかを見ていきます。

オブジェクトのプロパティを参照するときに、オブジェクト自身がプロパティを持っていない場合でも、そこで探索が終わるわけではありません。
オブジェクトの`[[Prototype]]`内部プロパティ（仕様上の内部的なプロパティ）の参照先であるプロトタイプオブジェクトに対しても探索を続けます。
これは、スコープに指定した識別子の変数がなかった場合に外側のスコープへと探索するスコープチェーンと良く似た仕組みです。

つまり、オブジェクトがプロパティを探索するときは次のような順番で、それぞれのオブジェクトを調べます。
すべてのオブジェクトにおいて見つからなかった場合の結果は`undefined`を返します。

1. `instance`オブジェクト自身
2. `instance`オブジェクトの`[[Prototype]]`の参照先（プロトタイプオブジェクト）
3. どこにもなかった場合は`undefined`

次のコードでは、インスタンスオブジェクト自身は`method`プロパティを持っていません。
そのため、実際に参照しているのはクラスのプロトタイプオブジェクトの`method`プロパティです。

{{book.console}}
```js
class MyClass {
    method() {
        console.log("プロトタイプのメソッド");
    }
}
const instance = new MyClass();
// インスタンスには`method`プロパティがないため、プロトタイプオブジェクトの`method`が参照される
instance.method(); // "プロトタイプのメソッド"
// `instance.method`の参照はプロトタイプオブジェクトの`method`と一致する
const Prototype = Object.getPrototypeOf(instance);
console.log(instance.method === Prototype.method); // => true
```

このように、インスタンスオブジェクトに`method`が定義されていなくても、クラスのプロトタイプオブジェクトの`method`を呼び出すことができます。
このプロパティを参照する際に、オブジェクト自身から`[[Prototype]]`内部プロパティへと順番に探す仕組みのことを**プロトタイプチェーン**と呼びます。

プロトタイプチェーンの仕組みを疑似的なコードとして表現すると次のような動きをしています。

{{book.console}}
```js
// プロトタイプチェーンの動作の疑似的なコード
class MyClass {
    method() {
        console.log("プロトタイプのメソッド");
    }
}
const instance = new MyClass();
// `instance.method()`を実行する場合
// 次のような呼び出し処理が行われている
// インスタンス自身が`method`プロパティを持っている場合
if (instance.hasOwnProperty("method")) {
    instance.method();
} else {
    // インスタンスの`[[Prototype]]`の参照先（`MyClass`のプロトタイプオブジェクト）を取り出す
    const prototypeObject = Object.getPrototypeOf(instance);
    // プロトタイプオブジェクトが`method`プロパティを持っている場合
    if (prototypeObject.hasOwnProperty("method")) {
        // `this`はインスタンス自身を指定して呼び出す
        prototypeObject.method.call(instance);
    }
}
```

プロトタイプチェーンの仕組みによって、プロトタイプオブジェクトに定義したプロトタイプメソッドをインスタンスから呼び出せます。

普段は、プロトタイプオブジェクトやプロトタイプチェーンといった仕組みを意識する必要はありません。
`class`構文はこのようなプロトタイプを意識せずにクラスを利用できるように導入された構文です。
しかし、プロトタイプベースである言語のJavaScriptではクラスをこのようなプロトタイプを使って表現していることは知っておくとよいでしょう。

<!-- Note

インスタンスオブジェクトのメソッドがプロトタイプのメソッドの呼び出しの仕組みについてを見ていきます。
 
- プロトタイプチェーンという仕組み
- インスタンス化されるときに自動的にインスタンスはプロトタイプオブジェクトを参照する（継承）
- これは`[[Prototype]]`という内部プロパティに保存されますが、`__proto__`というアクセッサプロパティで参照できます
- しかし、`class`構文を利用する場合にはこれを意識して触ることはありません

-->

## 継承 {#extends}

`extends`キーワードを使うことで既存のクラスを継承できます。
継承とは、クラスの**構造**や**機能**を引き継いだ新しいクラスを定義することです。

### 継承したクラスの定義 {#class-extends}

`extends`キーワードを使って既存のクラスを継承した新しいクラスを定義してみます。
`class`構文の右辺に`extends`キーワードで継承元となる**親クラス**（基底クラス）を指定することで、
親クラスを継承した**子クラス**（派生クラス）を定義できます。

<!-- doctest:disable -->
```js
class 子クラス extends 親クラス {

}
```

次のコードでは、`Parent`クラスを継承した`Child`クラスを定義しています。
子クラスである`Child`クラスのインスタンス化は通常のクラスと同じく`new`演算子を使って行います。

{{book.console}}
```js
class Parent {

}
class Child extends Parent {

}
const instance = new Child();
```

### `super` {#class-super}

`extends`を使って定義した子クラスから親クラスを参照するには`super`というキーワードを利用します。
もっともシンプルな`super`を使う例としてコンストラクタの処理を見ていきます。

`class`構文でも紹介しましたが、クラスは必ず`constructor`メソッド（コンストラクタ）を持ちます。
これは、継承した子クラスでも同じです。

<!-- textlint-disable no-js-function-paren -->

次のコードでは、`Parent`クラスを継承した`Child`クラスのコンストラクタで、`super()`を呼び出しています。
`super()`は子クラスから親クラスの`constructor`メソッドを呼び出します。

{{book.console}}
```js
// 親クラス
class Parent {
    constructor(...args) {
        console.log("Parentコンストラクタの処理", ...args);
    }
}
// Parentを継承したChildクラスの定義
class Child extends Parent {
    constructor(...args) {
        // Parentのコンストラクタ処理を呼び出す
        super(...args);
        console.log("Childコンストラクタの処理", ...args);
    }
}
const child = new Child("引数1", "引数2");
// "Parentコンストラクタの処理", "引数1", "引数2"
// "Childコンストラクタの処理", "引数1", "引数2"
```

`class`構文でのクラス定義では、`constructor`メソッド（コンストラクタ）で何も処理しない場合は省略できることを紹介しました。
これは、継承した子クラスでも同じです。

次のコードの`Child`クラスのコンストラクタでは、何も処理を行っていません。
そのため、`Child`クラスの`constructor`メソッドの定義を省略できます。

{{book.console}}
```js
class Parent {}
class Child extends Parent {}
```

このように子クラスで`constructor`を省略した場合は次のように書いた場合と同じ意味になります。
`constructor`メソッドの引数をすべて受け取り、そのまま`super`へ引数の順番を維持して渡します。

{{book.console}}
```js
class Parent {}
class Child extends Parent {
    constructor(...args) {
        super(...args); // 親クラスに引数をそのまま渡す
    }
}
```

### コンストラクタの処理順は親クラスから子クラスへ {#constructor-order}

コンストラクタの処理順は、親クラスから子クラスへと順番が決まっています。

`class`構文では必ず親クラスのコンストラクタ処理（`super()`の呼び出し）を先に行い、その次に子クラスのコンストラクタ処理を行います。
子クラスのコンストラクタでは、`this`を触る前に`super()`で親クラスのコンストラクタ処理を呼び出さないと`SyntaxError`となるためです。

次のコードでは、`Parent`と`Child`でそれぞれインスタンス（`this`）の`name`プロパティに値を書き込んでいます。
子クラスでは先に`super()`を呼び出してからでないと`this`を参照できません。
そのため、コンストラクタの処理順は`Parent`から`Child`という順番に限定されます。

<!-- textlint-enable no-js-function-paren -->

{{book.console}}
```js
class Parent {
    constructor() {
        this.name = "Parent";
    }
}
class Child extends Parent {
    constructor() {
        // 子クラスでは`super()`を`this`に触る前に呼び出さなければならない
        super();
        // 子クラスのコンストラクタ処理
        // 親クラスで書き込まれた`name`は上書きされる
        this.name = "Child";
    }
}
const parent = new Parent();
console.log(parent.name); // => "Parent"
const child = new Child();
console.log(child.name); // => "Child"
```

### プロトタイプ継承 {#prototype-inheritance}

次のコードでは`extends`キーワードを使って`Parent`クラスを継承した`Child`クラスを定義しています。
`Parent`クラスでは`method`を定義しているため、これを継承している`Child`クラスのインスタンスからも呼び出せます。

{{book.console}}
```js
class Parent {
    method() {
        console.log("Parent#method");
    }
}
// `Parent`を継承した`Child`を定義
class Child extends Parent {
    // methodの定義はない
}
// `Child`のインスタンスは`Parent`のプロトタイプメソッドを継承している
const instance = new Child();
instance.method(); // "Parent#method"
```

このように、子クラスのインスタンスから親クラスのプロトタイプメソッドもプロトタイプチェーンの仕組みによって呼び出せます。

`extends`によって継承した場合、子クラスのプロトタイプオブジェクトの`[[Prototype]]`内部プロパティには親クラスのプロトタイプオブジェクトが設定されます。
このコードでは、`Child.prototype`オブジェクトの`[[Prototype]]`内部プロパティには`Parent.prototype`が設定されます。

これにより、プロパティを参照する場合には次のような順番でオブジェクトを探索しています。

1. `instance`オブジェクト自身
2. `Child.prototype`（`instance`オブジェクトの`[[Prototype]]`の参照先）
3. `Parent.prototype`（`Child.prototype`オブジェクトの`[[Prototype]]`の参照先）

このプロトタイプチェーンの仕組みにより、`method`プロパティは`Parent.prototype`オブジェクトに定義されたものを参照します。

このようにJavaScriptでは`class`構文と`extends`キーワードを使うことでクラスの**機能**を継承できます。
`class`構文ではプロトタイプオブジェクトを参照する仕組みによって継承が行われています。
そのため、この継承の仕組みを**プロトタイプ継承**と呼びます。

### 静的メソッドの継承 {#static-inheritance}

インスタンスとクラスのプロトタイプオブジェクトとの間にはプロトタイプチェーンがあります。
クラス自身（クラスのコンストラクタ）も親クラス自身（親クラスのコンストラクタ）との間にプロトタイプチェーンがあります。

簡単に言えば、静的メソッドも継承されるということです。

{{book.console}}
```js
class Parent {
    static hello() {
        return "Hello";
    }
}
class Child extends Parent {}
console.log(Child.hello()); // => "Hello"
```

`extends`によって継承した場合、子クラスのコンストラクタの`[[Prototype]]`内部プロパティには親クラスのコンストラクタが設定されます。
このコードでは、`Child`コンストラクタの`[[Prototype]]`内部プロパティに`Parent`コンストラクタが設定されます。

つまり、先ほどのコードでは`Child.hello`プロパティを参照した場合には、次のような順番でオブジェクトを探索しています。

1. `Child`コンストラクタ
2. `Parent`コンストラクタ（`Child`コンストラクタの`[[Prototype]]`の参照先）

クラスのコンストラクタ同士にもプロトタイプチェーンの仕組みがあるため、子クラスは親クラスの静的メソッドを呼び出せます。

### `super`プロパティ {#super-property}

<!-- textlint-disable no-js-function-paren -->

子クラスから親クラスのコンストラクタ処理を呼び出すには`super()`を使います。
同じように、子クラスのプロトタイプメソッドからは、`super.プロパティ名`で親クラスのプロトタイプメソッドを参照できます。

次のコードでは、`Child#method`の中で`super.method()`と書くことで`Parent#method`を呼び出しています。
このように、子クラスから継承元の親クラスのプロトタイプメソッドは`super.プロパティ名`で参照できます。

{{book.console}}
```js
class Parent {
    method() {
        console.log("Parent#method");
    }
}
class Child extends Parent {
    method() {
        console.log("Child#method");
        // `this.method()`だと自分(`this`)のmethodを呼び出して無限ループする
        // そのため明示的に`super.method()`とParent#methodを呼び出す
        super.method();
    }
}
const child = new Child();
child.method(); 
// コンソールには次のように出力される
// "Child#method"
// "Parent#method"
```

プロトタイプチェーンでは、インスタンスからクラス、さらに親のクラスと継承関係をさかのぼるようにメソッドを探索すると紹介しました。
このコードでは`Child#method`が定義されているため、`child.method`は`Child#method`を呼び出します。
そして`Child#method`は`super.method`を呼び出しているため、`Parent#method`が呼び出されます。

クラスの静的メソッド同士も同じように`super.method()`と書くことで呼び出せます。
次のコードでは、`Parent`を継承した`Child`から親クラスの静的メソッドを呼び出しています。

<!-- textlint-enable no-js-function-paren -->

{{book.console}}
```js
class Parent {
    static method() {
        console.log("Parent.method");
    }
}
class Child extends Parent {
    static method() {
        console.log("Child.method");
        // `super.method()`で`Parent.method`を呼びだす
        super.method();
    }
}
Child.method(); 
// コンソールには次のように出力される
// "Child.method"
// "Parent.method"
```

### 継承の判定 {#instanceof}

あるクラスが指定したクラスをプロトタイプ継承しているかは`instanceof`演算子を使って判定できます。

次のコードでは、`Child`のインスタンスは`Child`クラスと`Parent`クラスを継承したオブジェクトであることを確認しています。

{{book.console}}
```js
class Parent {}
class Child extends Parent {}

const parent = new Parent();
const child = new Child();
// `Parent`のインスタンスは`Parent`のみを継承したインスタンス
console.log(parent instanceof Parent); // => true
console.log(parent instanceof Child); // => false
// `Child`のインスタンスは`Child`と`Parent`を継承したインスタンス
console.log(child instanceof Parent); // => true
console.log(child instanceof Child); // => true
```

<!-- Note: instanceof演算子とは`[[Prototype]]`プロパティ

- `instanceof`演算子は`[[Prototype]]`プロパティを見ている
- <https://tc39.github.io/ecma262/#sec-ordinaryhasinstance>
- `Symbol.hasInstance`によって詳細は変わるため絶対とは言い切れない
- <https://tc39.github.io/ecma262/#sec-symbol.hasinstance>

-->

より具体的な継承の使い方については「[ユースケース:Todoアプリ][]」の章で見ていきます。

## ビルトインオブジェクトの継承 {#extends-built-in}

ここまで自身が定義したクラスを継承してきましたが、ビルトインオブジェクトのコンストラクタも継承できます。
ビルトインオブジェクトには`Array`、`String`、`Object`、`Number`、`Error`、`Date`などのコンストラクタがあります。
`class`構文ではこれらのビルトインオブジェクトを継承できます。

次のコードでは、ビルトインオブジェクトである`Array`を継承して独自のメソッドを加えた`MyArray`クラスを定義しています。
継承した`MyArray`は`Array`の性質であるメソッドや状態管理についての仕組みを継承しています。
継承した性質に加えて、`MyArray#first`や`MyArray#last`といったアクセッサプロパティを追加しています。

{{book.console}}
```js
class MyArray extends Array {
    get first() {
        if (this.length === 0) {
            return undefined;
        } else {
            return this[0];
        }
    }

    get last() {
        if (this.length === 0) {
            return undefined;
        } else {
            return this[this.length - 1];
        }
    }
}

// Arrayを継承しているのでArray.fromも継承している
// Array.fromはIterableなオブジェクトから配列インスタンスを作成する
const array = MyArray.from([1, 2, 3, 4, 5]);
console.log(array.length); // => 5
console.log(array.first); // => 1
console.log(array.last); // => 5
```

`Array`を継承した`MyArray`は、`Array`が元々持つ`length`プロパティや`Array.from`メソッドなどを継承しているので利用できます。

## まとめ {#conclusion}

この章ではクラスについて学びました。

- JavaScriptのクラスはプロトタイプベース
- クラスは`class`構文で定義できる
- クラスで定義したメソッドはプロトタイプオブジェクトとプロトタイプチェーンの仕組みで呼び出せる
- アクセッサプロパティはgetterとsetterのメソッドを定義することでプロパティのように振る舞う
- クラスは`extends`で継承できる
- クラスのプロトタイプメソッドと静的メソッドはどちらも継承される

[プロトタイプオブジェクト]: ../prototype-object/README.md
[Arrow Functionでコールバック関数を扱う]: ../function-this/README.md#arrow-function-callback
[関数とthis]: ../function-this/README.md
[問題: `this`を含むメソッドを変数に代入した場合]: ../function-this/README.md#assign-this-function
[Map/Set]: ../map-and-set/README.md
[ユースケース:Todoアプリ]: ../../use-case/todoapp/README.md
[^1]: `class`構文でしか実現できない機能はなく、読みやすさやわかりやさのために導入された構文という側面もあるため、JavaScriptの`class`構文は糖衣構文（シンタックスシュガー）と呼ばれることがあります。
