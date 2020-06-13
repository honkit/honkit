---
author: azu
description: "JavaScriptのObjectはオブジェクトの基礎となるものです。オブジェクトとプロパティの作成、更新、削除などの基本的な操作について紹介します。"
---

# オブジェクト {#object}

オブジェクトはプロパティの集合です。プロパティとは名前（キー）と値（バリュー）が対になったものです。
プロパティのキーには文字列または`Symbol`が利用でき、値には任意のデータを指定できます。
また、1つのオブジェクトは複数のプロパティを持てるため、1つのオブジェクトで多種多様な値を表現できます。

今までも登場してきた、配列や関数などもオブジェクトの一種です。
JavaScriptには、あらゆるオブジェクトの元となる`Object`というビルトインオブジェクトがあります。
ビルトインオブジェクトは実行環境に組み込まれたオブジェクトのことです。
`Object`というビルトインオブジェクトはECMAScriptの仕様で定義されているため、あらゆるJavaScriptの実行環境で利用できます。

<!-- Note: ビルトインオブジェクト

- あくまでECMAScriptの定義にあるビルトインオブジェクトをビルトインオブジェクトという
- https://tc39.es/ecma262/#sec-built-in-object

 -->

この章では、オブジェクトの作成や扱い方、`Object`というビルトインオブジェクトについて見ていきます。

## オブジェクトを作成する {#create-object}

オブジェクトを作成するには、オブジェクトリテラル（`{}`）を利用します。

```js
// プロパティを持たない空のオブジェクトを作成
const obj = {};
```

オブジェクトリテラルでは、初期値としてプロパティを持つオブジェクトを作成できます。
プロパティは、オブジェクトリテラル（`{}`）の中にキーと値を`:`（コロン）で区切って記述します。

```js
// プロパティを持つオブジェクトを定義する
const obj = {
    // キー: 値
    "key": "value"
};
```

オブジェクトリテラルのプロパティ名（キー）はクォート（`"`や`'`）を省略できます。
そのため、次のように書いても同じです。

```js
// プロパティ名（キー）はクォートを省略することが可能
const obj = {
    // キー: 値
    key: "value"
};
```

ただし、変数の識別子として利用できないプロパティ名はクォート（`"`や`'`）で囲む必要があります。

[import, prop-invalid.js](./src/prop-invalid.js)

```js
const obj = {
    // キー: 値
    "my-prop": "value" // OK
};
```

オブジェクトリテラルでは複数のプロパティ（キーと値の組み合わせ）を持つオブジェクトも作成できます。
複数のプロパティを定義するには、それぞれのプロパティを`,`（カンマ）で区切ります。

```js
const color = {
    // それぞれのプロパティは`,`で区切る
    red: "red",
    green: "green",
    blue: "blue"
};
```

プロパティの値に変数名を指定すれば、そのキーは指定した変数を参照します。

{{book.console}}
```js
const name = "名前";
// `name`というプロパティ名で`name`の変数を値に設定したオブジェクト
const obj = {
    name: name
};
console.log(obj); // => { name: "名前" }
```

またES2015からは、プロパティ名と値に指定する変数名が同じ場合は`{ name }`のように省略して書けます。
次のコードは、プロパティ名`name`に変数`name`を値にしたプロパティを設定しています。

{{book.console}}
```js
const name = "名前";
// `name`というプロパティ名で`name`の変数を値に設定したオブジェクト
const obj = {
    name
};
console.log(obj); // => { name: "名前" }
```

この省略記法は、モジュールや分割代入においても共通した表現です。
そのため、`{}`の中でプロパティ名が単独で書かれている場合は、この省略記法を利用していることに注意してください。

### `{}`は`Object`のインスタンスオブジェクト {#object-instance-object}

`Object`はJavaScriptのビルトインオブジェクトです。
オブジェクトリテラル（`{}`）は、このビルトインオブジェクトである`Object`を元にして新しいオブジェクトを作成するための構文です。

<!-- textlint-disable no-js-function-paren -->

オブジェクトリテラル以外の方法として、`new`演算子を使うことで、`Object`から新しいオブジェクトを作成できます。
次のコードでは、`new Object()`でオブジェクトを作成していますが、これは空のオブジェクトリテラルと同じ意味です。

{{book.console}}
```js
// プロパティを持たない空のオブジェクトを作成
// = `Object`からインスタンスオブジェクトを作成
const obj = new Object();
console.log(obj); // => {}
```

オブジェクトリテラルのほうが明らかに簡潔で、プロパティの初期値も指定できるため、`new Object()`を使う利点はありません。

`new Object()`でオブジェクトを作成することは、「`Object`のインスタンスオブジェクトを作成する」と言います。
しかしながら、`Object`やインスタンスオブジェクトなどややこしい言葉の使い分けが必要となってしまいます。
そのため、この書籍ではオブジェクトリテラルと`new Object`どちらの方法であっても、単に「オブジェクトを作成する」と呼びます。

オブジェクトリテラルは、`Object`から新しいインスタンスオブジェクトを作成していることを意識しておくとよいでしょう。

<!-- textlint-enable no-js-function-paren -->

## プロパティへのアクセス {#property-access}

オブジェクトのプロパティにアクセスする方法として、ドット記法（`.`）を使う方法とブラケット記法（`[]`）があります。
それぞれの記法で、オブジェクトの右辺へプロパティ名を指定すると、その名前を持ったプロパティの値を参照できます。

{{book.console}}
```js
const obj = {
    key: "value"
};
// ドット記法で参照
console.log(obj.key); // => "value"
// ブラケット記法で参照
console.log(obj["key"]); // => "value"
```

ドット記法（`.`）では、プロパティ名が変数名と同じく識別子の命名規則を満たす必要があります（詳細は「[変数と宣言][]」の章を参照）。

[import, prop-dot-invalid.js](./src/prop-dot-invalid.js)

一方、ブラケット記法では、`[`と`]`の間に任意の式を書けます。
そのため、識別子の命名規則とは関係なく、任意の文字列をプロパティ名として指定できます。
ただし、プロパティ名は文字列へと暗黙的に変換されることに注意してください。

{{book.console}}
```js
const obj = {
    key: "value",
    123: 456,
    "my-key": "my-value"
};

console.log(obj["key"]); // => "value"
// プロパティ名が数字からはじまる識別子も利用できる
console.log(obj[123]); // => 456
// プロパティ名にハイフンを含む識別子も利用できる
console.log(obj["my-key"]); // => "my-value"
```

また、ブラケット記法ではプロパティ名に変数も利用できます。
次のコードでは、プロパティ名に`myLang`という変数をブラケット記法で指定しています。

{{book.console}}
```js
const languages = {
    ja: "日本語",
    en: "英語"
};
const myLang = "ja";
console.log(languages[myLang]); // => "日本語"
```

ドット記法ではプロパティ名に変数は利用できないため、プロパティ名に変数を指定した場合はブラケット記法を利用します。
基本的には簡潔なドット記法（`.`）を使い、ドット記法で書けない場合はブラケット記法（`[]`）を使うとよいでしょう。

## [ES2015] オブジェクトと分割代入 {#object-destructuring}

同じオブジェクトのプロパティを何度もアクセスする場合に、何度も`オブジェクト.プロパティ名`と書くと冗長となりやすいです。
そのため、短い名前で利用できるように、そのプロパティを変数として定義し直すことがあります。

次のコードでは、変数`ja`と`en`を定義し、その初期値として`languages`オブジェクトのプロパティを代入しています。

{{book.console}}
```js
const languages = {
    ja: "日本語",
    en: "英語"
};
const ja = languages.ja;
const en = languages.en;
console.log(ja); // => "日本語"
console.log(en); // => "英語"
```

このようなオブジェクトのプロパティを変数として定義し直すときには、分割代入（Destructuring assignment）が利用できます。

オブジェクトの分割代入では、左辺にオブジェクトリテラルのような構文で変数名を定義します。
右辺のオブジェクトから対応するプロパティ名が、左辺で定義した変数に代入されます。

次のコードでは、先ほどのコードと同じように`languages`オブジェクトから`ja`と`en`プロパティを取り出して変数として定義しています。
代入演算子のオペランドとして左辺と右辺それぞれに`ja`と`en`と書いていたのが、分割代入では一箇所に書くことができます。

{{book.console}}
```js
const languages = {
    ja: "日本語",
    en: "英語"
};
const { ja, en } = languages;
console.log(ja); // => "日本語"
console.log(en); // => "英語"
```

## プロパティの追加 {#add-property}

オブジェクトは、一度作成した後もその値自体を変更できるというミュータブル（mutable）の特性を持ちます。
そのため、作成したオブジェクトに対して、後からプロパティを追加できます。

プロパティの追加方法は単純で、作成したいプロパティ名へ値を代入するだけです。
そのとき、オブジェクトに指定したプロパティが存在しないなら、自動的にプロパティが作成されます。

プロパティの追加はドット記法、ブラケット記法どちらでも可能です。

{{book.console}}
```js
// 空のオブジェクト
const obj = {};
// `key`プロパティを追加して値を代入
obj.key = "value";
console.log(obj.key); // => "value"
```

先ほども紹介したように、ドット記法は変数の識別子として利用可能なプロパティ名しか利用できません。

一方、ブラケット記法は`object[式]`の`式`の評価結果を文字列にしたものをプロパティ名として利用できます。
そのため、次のものをプロパティ名として扱う場合にはブラケット記法を利用します。

- 変数
- 変数の識別子として扱えない文字列（詳細は「[変数と宣言][]」の章を参照）
- Symbol

{{book.console}}
```js
const key = "key-string";
const obj = {};
// `key`の評価結果 "key-string" をプロパティ名に利用
obj[key] = "value of key";
// 取り出すときも同じく`key`変数を利用
console.log(obj[key]); // => "value of key"
```

ブラケット記法を用いたプロパティ定義は、オブジェクトリテラルの中でも利用できます。
オブジェクトリテラル内でのブラケット記法を使ったプロパティ名は**Computed property names**と呼ばれます。
Computed property namesはES2015から導入された記法ですが、`式`の評価結果をプロパティ名に使う点はブラケット記法と同じです。

次のコードでは、Computed property namesを使い`key`変数の評価結果である`"key-string"`をプロパティ名にしています。

{{book.console}}
```js
const key = "key-string";
// Computed Propertyで`key`の評価結果 "key-string" をプロパティ名に利用
const obj = {
    [key]: "value"
};
console.log(obj[key]); // => "value"
```

JavaScriptのオブジェクトは、作成後にプロパティが変更可能というmutableの特性を持つことを紹介しました。
そのため、関数が受け取ったオブジェクトに対して、勝手にプロパティを追加できてしまいます。

次のコードは、`changeProperty`関数が引数として受け取ったオブジェクトにプロパティを追加している悪い例です。

{{book.console}}
```js
function changeProperty(obj) {
    obj.key = "value";
    // いろいろな処理...
}
const obj = {};
changeProperty(obj); // objのプロパティを変更している
console.log(obj.key); // => "value"
```

このように、プロパティを初期化時以外に追加してしまうと、そのオブジェクトがどのようなプロパティを持っているかがわかりにくくなります。
そのため、できる限り作成後に新しいプロパティは追加しないほうがよいでしょう。
オブジェクトの作成時のオブジェクトリテラルの中でプロパティを定義することを推奨します。

### プロパティの削除 {#remove-property}

オブジェクトのプロパティを削除するには`delete`演算子を利用します。
削除したいプロパティを`delete`演算子の右辺に指定して、プロパティを削除できます。

{{book.console}}
```js
const obj = {
    key1: "value1",
    key2: "value2"
};
// key1プロパティを削除
delete obj.key1;
// key1プロパティが削除されている
console.log(obj); // => { "key2": "value2" }
```

### [コラム] constで定義したオブジェクトは変更可能 {#const-and-object}

先ほどのコード例で、`const`で宣言したオブジェクトのプロパティがエラーなく変更できていることがわかります。
次のコードを実行してみると、値であるオブジェクトのプロパティが変更できていることがわかります。

{{book.console}}
```js
const obj = { key: "value" };
obj.key = "Hi!"; // constで定義したオブジェクト(`obj`)が変更できる
console.log(obj.key); // => "Hi!"
```

JavaScriptの`const`は値を固定するのではなく、変数への再代入を防ぐためのものです。
そのため、次のような`obj`変数への再代入は防げますが、変数に代入された値であるオブジェクトの変更は防げません（「[変数と宣言のconstについて][]」を参照）。

```js
const obj = { key: "value" };
obj = {}; // => SyntaxError
```

作成したオブジェクトのプロパティの変更を防止するには`Object.freeze`メソッドを利用する必要があります。
`Object.freeze`はオブジェクトを凍結します。凍結されたオブジェクトでプロパティの追加や変更を行うと例外が発生するようになります。

ただし、`Object.freeze`メソッドを利用する場合は必ずstrict modeと合わせて使います。
strict modeではない場合は、凍結されたオブジェクトのプロパティを変更しても例外が発生せずに単純に無視されます。

{{book.console}}
[import, freeze-property-invalid.js](./src/freeze-property-invalid.js)

## プロパティの存在を確認する {#confirm-property}

JavaScriptでは、存在しないプロパティに対してアクセスした場合に例外ではなく`undefined`を返します。
次のコードは、`obj`には存在しない`notFound`プロパティにアクセスしているため、`undefined`という値が返ってきます。

{{book.console}}
```js
const obj = {};
console.log(obj.notFound); // => undefined
```

このように、JavaScriptでは存在しないプロパティへアクセスした場合に例外が発生しません。
プロパティ名を間違えた場合に単に`undefined`という値を返すため、間違いに気づきにくいという問題があります。

次のようにプロパティ名を間違えていた場合にも、例外が発生しません。
さらにプロパティ名をネストしてアクセスした場合に、初めて例外が発生します。

{{book.console}}
```js
const widget = {
    window: {
        title: "ウィジェットのタイトル"
    }
};
// `window`を`windw`と間違えているが、例外は発生しない
console.log(widget.windw); // => undefined
// さらにネストした場合に、例外が発生する
// `undefined.title`と書いたのと同じ意味となるため
console.log(widget.windw.title); // => TypeError: widget.windw is undefined
// 例外が発生した文以降は実行されません
```

`undefined`や`null`はオブジェクトではないため、存在しないプロパティへアクセスすると例外が発生してしまいます。
あるオブジェクトがあるプロパティを持っているかを確認する方法として、次の3つがあります。

- `undefined`との比較
- `in`演算子
- `hasOwnProperty`メソッド

### プロパティの存在確認: undefinedとの比較 {#compare-to-undefined}

存在しないプロパティへアクセスした場合に`undefined`を返すため、実際にプロパティアクセスすることでも判定できそうです。
次のコードでは、`key`プロパティの値が`undefined`ではないという条件式で、プロパティが存在するかを判定しています。

{{book.console}}
```js
const obj = {
    key: "value"
};
// `key`プロパティが`undefined`ではないなら、プロパティが存在する?
if (obj.key !== undefined) {
    // `key`プロパティが存在する?ときの処理
    console.log("`key`プロパティの値は`undefined`ではない");
}
```

しかし、この方法はプロパティの値が`undefined`であった場合に、プロパティそのものが存在するかを区別できないという問題があります。
次のコードでは、`key`プロパティの値が`undefined`であるため、プロパティが存在しているにもかかわらずif文の中は実行されません。

{{book.console}}
```js
const obj = {
    key: undefined
};
// `key`プロパティの値が`undefined`である場合
if (obj.key !== undefined) {
    // この行は実行されません
}
```

このような問題があるため、プロパティが存在するかを判定するには`in`演算子か`hasOwnProperty`メソッドを利用します。

### プロパティの存在確認: in演算子を使う {#in-operator}

`in`演算子は、指定したオブジェクト上に指定したプロパティがあるかを判定できます。

<!-- doctest:disable -->
```js
"プロパティ名" in オブジェクト; // true or false
```

次のコードでは`obj`に`key`プロパティが存在するかを判定しています。
`in`演算子は、プロパティの値は関係なく、プロパティが存在した場合に`true`を返します。

{{book.console}}
```js
const obj = { key: undefined };
// `key`プロパティを持っているならtrue
if ("key" in obj) {
    console.log("`key`プロパティは存在する");
}
```

### プロパティの存在確認: `hasOwnProperty`メソッド {#hasOwnProperty-method}

オブジェクトの`hasOwnProperty`メソッドは、オブジェクト自身が指定したプロパティを持っているかを判定できます。
この`hasOwnProperty`メソッドの引数には、存在を判定したいプロパティ名を渡します。

<!-- doctest:disable -->
```js
const obj = {};
obj.hasOwnProperty("プロパティ名"); // true or false
```

次のコードでは`obj`に`key`プロパティが存在するかを判定しています。
`hasOwnProperty`メソッドも、プロパティの値は関係なく、オブジェクトが指定したプロパティを持っている場合に`true`を返します。

{{book.console}}
```js
const obj = { key: "value" };
// `obj`が`key`プロパティを持っているならtrue
if (obj.hasOwnProperty("key")) {
    console.log("`object`は`key`プロパティを持っている");
}
```

`in`演算子と`hasOwnProperty`メソッドは同じ結果を返していますが、厳密には動作が異なるケースもあります。
この動作の違いを知るにはまずプロトタイプオブジェクトという特殊なオブジェクトについて理解する必要があります。
次の章の「[プロトタイプオブジェクト][]」で詳しく解説するため、次の章で`in`演算子と`hasOwnProperty`メソッドの違いを見ていきます。

## `toString`メソッド {#toString-method}

オブジェクトの`toString`メソッドは、オブジェクト自身を文字列化するメソッドです。
`String`コンストラクタ関数を使うことでも文字列化できます。
この2つにはどのような違いがあるのでしょうか？（`String`コンストラクタ関数については「[暗黙的な型変換](../implicit-coercion/README.md#to-string)」を参照）

実は`String`コンストラクタ関数は、引数に渡されたオブジェクトの`toString`メソッドを呼び出しています。
そのため、`String`コンストラクタ関数と`toString`メソッドの結果はどちらも同じになります。

{{book.console}}
```js
const obj = { key: "value" };
console.log(obj.toString()); // => "[object Object]"
// `String`コンストラクタ関数は`toString`メソッドを呼んでいる
console.log(String(obj)); // => "[object Object]"
```

このことは、オブジェクトに`toString`メソッドを再定義してみるとわかります。
独自の`toString`メソッドを定義したオブジェクトを`String`コンストラクタ関数で文字列化してみます。
すると、再定義した`toString`メソッドの返り値が、`String`コンストラクタ関数の返り値になることがわかります。

{{book.console}}
```js
// 独自のtoStringメソッドを定義
const customObject = {
    toString() {
        return "custom value";
    }
};
console.log(String(customObject)); // => "custom value"
```

## [コラム] オブジェクトのプロパティ名は文字列化される {#object-property-is-to-string}

オブジェクトのプロパティへアクセスする際に、指定したプロパティ名は暗黙的に文字列に変換されます。
ブラケット記法では、オブジェクトをプロパティ名に指定することもできますが、これは意図したようには動作しません。
なぜなら、オブジェクトを文字列化すると`"[object Object]"`という文字列になるためです。

次のコードでは、`keyObject1`と`keyObject2`をブラケット記法でプロパティ名に指定しています。
しかし、`keyObject1`と`keyObject2`はどちらも文字列化すると`"[object Object]"`という同じプロパティ名となります。
そのため、プロパティは意図せず上書きされてしまいます。

{{book.console}}
```js
const obj = {};
const keyObject1 = { a: 1 };
const keyObject2 = { b: 2 };
// どちらも同じプロパティ名（"[object Object]"）に代入している
obj[keyObject1] = "1";
obj[keyObject2] = "2";
console.log(obj); //  { "[object Object]": "2" }
```

唯一の例外として、Symbolだけは文字列化されずにオブジェクトのプロパティ名として扱えます。

{{book.console}}
```js
const obj = {};
// Symbolは例外的に文字列化されず扱える
const symbolKey1 = Symbol("シンボル1");
const symbolKey2 = Symbol("シンボル2");
obj[symbolKey1] = "1";
obj[symbolKey2] = "2";
console.log(obj[symbolKey1]); // => "1"
console.log(obj[symbolKey2]); // => "2"
```

基本的にはオブジェクトのプロパティ名は文字列として扱われることを覚えておくとよいでしょう。
また、`Map`というビルトインオブジェクトはオブジェクトをキーとして扱えます（詳細は「[Map/Set][]」の章で解説します）。

<!-- 仕様: ToPropertyKeyによって文字列化されている

- https://github.com/asciidwango/js-primer/pull/854
- https://tc39.es/ecma262/#sec-topropertykey

 -->

## オブジェクトの静的メソッド {#static-method}

最後にビルトインオブジェクトである`Object`の静的メソッドについて見ていきましょう。
**静的メソッド**（スタティックメソッド）とは、インスタンスの元となるオブジェクトから呼び出せるメソッドのことです。

これまでの`toString`メソッドなどは、`Object`のインスタンスオブジェクトから呼び出すメソッドでした。
これに対して、静的メソッドは`Object`そのものから呼び出せるメソッドです。

ここでは、オブジェクトの処理でよく利用されるいくつかの**静的メソッド**を紹介します。

### オブジェクトの列挙 {#enumeration}

最初に紹介したように、オブジェクトはプロパティの集合です。
そのオブジェクトのプロパティを列挙する方法として、次の3つの静的メソッドがあります。

- `Object.keys`メソッド: オブジェクトのプロパティ名の配列にして返す
- `Object.values`メソッド<sup>[ES2017]</sup>: オブジェクトの値の配列にして返す
- `Object.entries`メソッド<sup>[ES2017]</sup>: オブジェクトのプロパティ名と値の配列の配列を返す

それぞれ、オブジェクトのキー、値、キーと値の組み合わせを配列にして返します。

{{book.console}}
<!-- doctest:meta:{ "ECMAScript": "2017" } -->
```js
const obj = {
    "one": 1,
    "two": 2,
    "three": 3
};
// `Object.keys`はキーの列挙した配列を返す
console.log(Object.keys(obj)); // => ["one", "two", "three"]
// `Object.values`は値を列挙した配列を返す
console.log(Object.values(obj)); // => [1, 2, 3]
// `Object.entries`は[キー, 値]の配列を返す
console.log(Object.entries(obj)); // => [["one", 1], ["two", 2], ["three", 3]]
```

これらの列挙する静的メソッドと配列の`forEach`メソッドなどを組み合わせれば、プロパティに対して反復処理ができます。
次のコードでは、`Object.keys`メソッドで取得したプロパティ名の一覧をコンソールへ出力しています。

{{book.console}}
```js
const obj = {
    "one": 1,
    "two": 2,
    "three": 3
};
const keys = Object.keys(obj);
keys.forEach(key => {
    console.log(key);
});
// 次の値が順番に出力される
// "one"
// "two"
// "three"
```

### オブジェクトのマージと複製 {#copy-and-merge}

`Object.assign`メソッド<sup>[ES2015]</sup>は、あるオブジェクトを別のオブジェクトに代入（assign）できます。
このメソッドを使うことで、オブジェクトの複製やオブジェクト同士のマージができます。

`Object.assign`メソッドは、`target`オブジェクトに対して、1つ以上の`sources`オブジェクトを指定します。
`sources`オブジェクト自身が持つ列挙可能なプロパティを第一引数の`target`オブジェクトに対してコピーします。
`Object.assign`メソッドの返り値は、`target`オブジェクトになります。

<!-- doctest:disable -->
```js
const obj = Object.assign(target, ...sources);
```

#### オブジェクトのマージ {#merge}

具体的なオブジェクトのマージの例を見ていきます。

次のコードでは、新しく作った空のオブジェクトを`target`にしています。
この空のオブジェクト（`target`）に`objectA`と`objectB`をマージしたものが、`Object.assign`メソッドの返り値となります。

{{book.console}}
```js
const objectA = { a: "a" };
const objectB = { b: "b" };
const merged = Object.assign({}, objectA, objectB);
console.log(merged); // => { a: "a", b: "b" }
```

第一引数には空のオブジェクトではなく、既存のオブジェクトも指定できます。
第一引数に既存のオブジェクトを指定した場合は、そのオブジェクトのプロパティが変更されます。

次のコードでは、第一引数に指定された`objectA`に対してプロパティが追加されています。

{{book.console}}
```js
const objectA = { a: "a" };
const objectB = { b: "b" };
const merged = Object.assign(objectA, objectB);
console.log(merged); // => { a: "a", b: "b" }
// `objectA`が変更されている
console.log(objectA); // => { a: "a", b: "b" }
console.log(merged === objectA); // => true
```

空のオブジェクトを`target`にすることで、既存のオブジェクトには影響を与えずマージしたオブジェクトを作ることができます。
そのため、`Object.assign`メソッドの第一引数には、空のオブジェクトリテラルを指定するのが典型的な利用方法です。

このとき、プロパティ名が重複した場合は、後ろのオブジェクトのプロパティにより上書きされます。
JavaScriptでは、基本的に処理は先頭から後ろへと順番に行います。
そのため、空のオブジェクトへ`objectA`を代入してから、その結果に`objectB`を代入するという形になります。

{{book.console}}
```js
// `version`のプロパティ名が被っている
const objectA = { version: "a" };
const objectB = { version: "b" };
const merged = Object.assign({}, objectA, objectB);
// 後ろにある`objectB`のプロパティで上書きされる
console.log(merged); // => { version: "b" }
```

#### オブジェクトのspread構文でのマージ {#object-spread-syntax}

ES2018では、オブジェクトのマージを行うオブジェクトの`...`（spread構文）が追加されました。
ES2015で配列の要素を展開する`...`（spread構文）はサポートされていましたが、オブジェクトに対してもES2018でサポートされました。
オブジェクトのspread構文は、オブジェクトリテラルの中に指定したオブジェクトのプロパティを展開できます。

オブジェクトのspread構文は、`Object.assign`とは異なり必ず新しいオブジェクトを作成します。
なぜならspread構文はオブジェクトリテラルの中でのみ記述でき、オブジェクトリテラルは新しいオブジェクトを作成するためです。

次のコードでは`objectA`と`objectB`をマージした新しいオブジェクトを返します。

{{book.console}}
```js
const objectA = { a: "a" };
const objectB = { b: "b" };
const merged = { 
    ...objectA,
    ...objectB
};
console.log(merged); // => { a: "a", b: "b" }
```

プロパティ名が被った場合の優先順位は、後ろにあるオブジェクトが優先されます。
そのため同じプロパティ名を持つオブジェクトをマージした場合には、後ろにあるオブジェクトによってプロパティが上書きされます。

{{book.console}}
<!-- doctest:disable -->
```js
// `version`のプロパティ名が被っている
const objectA = { version: "a" };
const objectB = { version: "b" };
const merged = { 
    ...objectA,
    ...objectB,
    other: "other"
};
// 後ろにある`objectB`のプロパティで上書きされる
console.log(merged); // => { version: "b", other: "other" }
```

#### オブジェクトの複製 {#copy}

<!-- textlint-disable preset-ja-technical-writing/max-ten -->
<!-- Object.assignの引数と、で並び順を合わせるため例外的に許可 -->

JavaScriptには、オブジェクトを複製する関数は用意されていません。
しかし、新しく空のオブジェクトを作成し、そこへ既存のオブジェクトのプロパティをコピーすれば、それはオブジェクトの複製をしていると言えます。
次のように、`Object.assign`メソッドを使うことでオブジェクトを複製できます。

<!-- textlint-enable preset-ja-technical-writing/max-ten -->

{{book.console}}
```js
// 引数の`obj`を浅く複製したオブジェクトを返す
const shallowClone = (obj) => {
    return Object.assign({}, obj);
};
const obj = { a: "a" };
const cloneObj = shallowClone(obj);
console.log(cloneObj); // => { a: "a" }
// オブジェクトを複製しているので、異なるオブジェクトとなる
console.log(obj === cloneObj); // => false
```

注意点として、`Object.assign`メソッドは`sources`オブジェクトのプロパティを浅くコピー（shallow copy）する点です。
shallow copyとは、`sources`オブジェクトの直下にあるプロパティだけをコピーするということです。
そのプロパティの値がオブジェクトである場合に、ネストした先のオブジェクトまでも複製するわけではありません。

{{book.console}}
```js
const shallowClone = (obj) => {
    return Object.assign({}, obj);
};
const obj = { 
    level: 1,
    nest: {
        level: 2
    },
};
const cloneObj = shallowClone(obj);
// `nest`オブジェクトは複製されていない
console.log(cloneObj.nest === obj.nest); // => true
```

逆にプロパティの値までも再帰的に複製してコピーすることを、深いコピー（deep copy）と呼びます。
deep copyは、再帰的にshallow copyすることで実現できます。
次のコードでは、`deepClone`を`shallowClone`を使うことで実現しています。

{{book.console}}
```js
// 引数の`obj`を浅く複製したオブジェクトを返す
const shallowClone = (obj) => {
    return Object.assign({}, obj);
};
// 引数の`obj`を深く複製したオブジェクトを返す
function deepClone(obj) {
    const newObj = shallowClone(obj);
    // プロパティがオブジェクト型であるなら、再帰的に複製する
    Object.keys(newObj)
        .filter(k => typeof newObj[k] === "object")
        .forEach(k => newObj[k] = deepClone(newObj[k]));
    return newObj;
}
const obj = { 
    level: 1,
    nest: {
        level: 2
    }
};
const cloneObj = deepClone(obj);
// `nest`オブジェクトも再帰的に複製されている
console.log(cloneObj.nest === obj.nest); // => false
```

このように、JavaScriptのビルトインメソッドは浅い（shallow）実装のみを提供し、深い（deep）実装は提供していないことが多いです。
言語としては最低限の機能を提供し、より複雑な機能はユーザー側で実装するという形式を取るためです。

JavaScriptは言語仕様で定義されている機能が最低限であるため、それを補うようにユーザーが作成した小さな機能を持つライブラリが数多く公開されています。
それらのライブラリはnpmと呼ばれるJavaScriptのパッケージ管理ツールで公開され、JavaScriptのエコシステムを築いています。
ライブラリの利用については「[ユースケース: Node.jsでCLIアプリケーション][]」の章で紹介します。

## まとめ {#conclusion}

この章では、オブジェクトについて学びました。

- `Object`というビルトインオブジェクトがある
- `{}`（オブジェクトリテラル）でのオブジェクトの作成や更新方法
- プロパティの存在確認する`in`演算子と`hasOwnProperty`メソッド
- オブジェクトのインスタンスメソッドと静的メソッド

JavaScriptの`Object`は他のオブジェクトのベースとなるオブジェクトです。
次の「[プロトタイプオブジェクト][]」の章では、`Object`がどのようにベースとして動作しているのかを見ていきます。

[ループと反復処理]: ../loop/README.md "ループと反復処理"
[変数と宣言]: ../variables/README.md "変数と宣言"
[クラス]: ../class/README.md "クラス"
[プロトタイプオブジェクト]: ../prototype-object/README.md "クラス"
[変数と宣言のconstについて]: ../variables/README.md#const
[ユースケース: Node.jsでCLIアプリケーション]: ../../use-case/nodecli/README.md
[Map/Set]: ../map-and-set/README.md
