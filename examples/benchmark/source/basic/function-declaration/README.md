---
author: azu
description: "JavaScriptの関数を定義する方法について紹介します。関数やメソッドを定義する方法として関数宣言、関数式、Arrow Functionについて紹介します。また関数の引数の扱い方や関数とメソッドの違いについても紹介します。"
---
# 関数と宣言 {#function-and-declaration}

関数とは、ある一連の手続き（文の集まり）を1つの処理としてまとめる機能です。
関数を利用することで、同じ処理を毎回書くのではなく、一度定義した関数を呼び出すことで同じ処理を実行できます。

これまで利用してきたコンソール表示をするConsole APIも関数です。
`console.log`は「受け取った値をコンソールへ出力する」という処理をまとめた関数です。

この章では、関数の定義方法や呼び出し方について見ていきます。

## 関数宣言 {#function-declaration}

JavaScriptでは、関数を定義するために`function`キーワードを使います。
`function`からはじまる文は**関数宣言**と呼び、次のように関数を定義できます。

<!-- doctest:disable -->
```js
// 関数宣言
function 関数名(仮引数1, 仮引数2) {
    // 関数が呼び出されたときの処理
    // ...
    return 関数の返り値;
}
// 関数呼び出し
const 関数の結果 = 関数名(引数1, 引数2);
console.log(関数の結果); // => 関数の返り値
```

関数は次の4つの要素で構成されています。

- 関数名 - 利用できる名前は変数名と同じ（「[変数名に使える名前のルール][]」を参照）
- 仮引数 - 関数の呼び出し時に渡された値が入る変数。複数ある場合は`,`（カンマ）で区切る
- 関数の中身 - `{`と`}`で囲んだ関数の処理を書く場所
- 関数の返り値 - 関数を呼び出したときに、呼び出し元へ返される値

<!-- textlint-disable no-js-function-paren -->

宣言した関数は、`関数名()`と関数名にカッコをつけることで呼び出せます。
関数を引数と共に呼ぶ際は、`関数名(引数1, 引数2)`とし、引数が複数ある場合は`,`（カンマ）で区切ります。

<!-- textlint-enable no-js-function-paren -->

関数の中身では`return`文によって、関数の実行結果として任意の値を返せます。

次のコードでは、引数で受け取った値を2倍にして返す`multiple`という関数を定義しています。
`multiple`関数には`num`という仮引数が定義されており、`10`という値を引数として渡して関数を呼び出しています。
仮引数の`num`には`10`が代入され、その値を2倍にしたものを`return`文で返しています。

{{book.console}}
```js
function multiple(num) {
    return num * 2;
}
// `multiple`関数の返り値は、`num`に`10`を入れて`return`文で返した値
console.log(multiple(10)); // => 20
```

関数で`return`文が実行されると、関数内ではそれ以降の処理は行われません。
また関数が値を返す必要がない場合は、`return`文では返り値を省略できます。
`return`文の返り値を省略した場合は、未定義の値である`undefined`を返します。

```js
function fn() {
    // 何も返り値を指定してない場合は`undefined`を返す
    return;
    // すでにreturnされているため、この行は実行されません
}
console.log(fn()); // => undefined
```

関数が何も値を返す必要がない場合は、`return`文そのものを省略できます。
`return`文そのものを省略した場合は、`undefined`という値を返します。

{{book.console}}
```js
function fn() {
}

console.log(fn()); // => undefined
```

## 関数の引数 {#function-arguments}

JavaScriptでは、関数に定義した仮引数の個数と実際に呼び出したときの引数の個数が違っても、関数を呼び出せます。
そのため、引数の個数が合っていないときの挙動を知る必要があります。
また、引数が省略されたときに、デフォルトの値を指定するデフォルト引数という構文についても見ていきます。

### 呼び出し時の引数が少ないとき {#function-less-arguments}

定義した関数の仮引数よりも呼び出し時の引数が少ない場合、余った仮引数には`undefined`という値が代入されます。

次のコードでは、引数として渡した値をそのまま返す`echo`関数を定義しています。
`echo`関数は仮引数`x`を定義していますが、引数を渡さずに呼び出すと、仮引数`x`には`undefined`が入ります。

```js
function echo(x) {
    return x;
}

console.log(echo(1)); // => 1
console.log(echo()); // => undefined
```

複数の引数を受けつける関数でも同様に、余った仮引数には`undefined`が入ります。

次のコードでは、2つの引数を受け取り、それを配列として返す`argumentsToArray`関数を定義しています。
このとき、引数として1つの値しか渡していない場合、残る仮引数には`undefined`が代入されます。

```js
function argumentsToArray(x, y) {
    return [x, y];
}

console.log(argumentsToArray(1, 2)); // => [1, 2]
// 仮引数のxには1、yにはundefinedが入る
console.log(argumentsToArray(1)); // => [1, undefined]
```

### [ES2015] デフォルト引数 {#function-default-parameters}

デフォルト引数（デフォルトパラメータ）は、仮引数に対応する引数が渡されていない場合に、デフォルトで代入される値を指定できます。
次のように、仮引数に対して`仮引数 = デフォルト値`という構文で、仮引数ごとにデフォルト値を指定できます。

```js
function 関数名(仮引数1 = デフォルト値1, 仮引数2 = デフォルト値2) {

}
```

次のコードでは、渡した値をそのまま返す`echo`関数を定義しています。
先ほどの`echo`関数とは異なり、仮引数`x`に対してデフォルト値を指定しています。
そのため、引数を渡さずに`echo`関数を呼び出すと、`x`には`"デフォルト値"`が代入されます。

```js
function echo(x = "デフォルト値") {
    return x;
}

console.log(echo(1)); // => 1
console.log(echo()); // => "デフォルト値"
```

ES2015でデフォルト引数が導入されるまでは、OR演算子（`||`）を使ったデフォルト値の指定がよく利用されていました。

{{book.console}}
```js
function addPrefix(text, prefix) {
    const pre = prefix || "デフォルト:";
    return pre + text;
}

console.log(addPrefix("文字列")); // => "デフォルト:文字列"
console.log(addPrefix("文字列", "カスタム:")); // => "カスタム:文字列"
```

しかし、OR演算子（`||`）を使ったデフォルト値の指定にはひとつ問題があります。
OR演算子（`||`）では、左辺のオペランドがfalsyな値の場合に右辺のオペランドを評価します。
falsyな値とは、真偽値へと変換すると`false`となる次のような値のことです。

- `false`
- `undefined`
- `null`
- `0`
- `NaN`
- `""`（空文字列）

OR演算子（`||`）を使った場合、次のように`prefix`に空文字列を指定した場合にもデフォルト値が入ります。
これは書いた人が意図した挙動なのかがとてもわかりにくく、このような挙動はバグにつながることがあります。

{{book.console}}
```js
function addPrefix(text, prefix) {
    const pre = prefix || "デフォルト:";
    return pre + text;
}

// falsyな値を渡すとデフォルト値が入ってしまう
console.log(addPrefix("文字列")); // => "デフォルト:文字列"
console.log(addPrefix("文字列", "")); // => "デフォルト:文字列"
console.log(addPrefix("文字列", "カスタム:")); // => "カスタム:文字列"
```

デフォルト引数を使って書くことで、このような挙動は起きなくなるため安全です。
デフォルト引数では、引数が渡されなかった場合のみデフォルト値が入ります。

{{book.console}}
```js
function addPrefix(text, prefix = "デフォルト:") {
    return prefix + text;
}
// falsyな値を渡してもデフォルト値は代入されない
console.log(addPrefix("文字列")); // => "デフォルト:文字列"
console.log(addPrefix("文字列", "")); // => "文字列"
console.log(addPrefix("文字列", "カスタム:")); // => "カスタム:文字列"
```

### 呼び出し時の引数が多いとき {#function-more-arguments}

関数の仮引数に対して引数の個数が多い場合、あふれた引数は単純に無視されます。

次コードでは、2つの引数を足し算した値を返す`add`関数を定義しています。
この`add`関数には仮引数が2つしかありません。
そのため、3つ以上の引数を渡しても3番目以降の引数は単純に無視されます。

{{book.console}}
```js
function add(x, y) {
    return x + y;
}
add(1, 3); // => 4
add(1, 3, 5); // => 4
```

## 可変長引数 {#variable-arguments}

関数において引数の数が固定ではなく、任意の個数の引数を受け取りたい場合があります。
たとえば、`Math.max(...args)`は引数を何個でも受け取り、受け取った引数の中で最大の数値を返す関数です。
このような、固定した数ではなく任意の個数の引数を受け取れることを**可変長引数**と呼びます。

{{book.console}}
```js
// Math.maxは可変長引数を受け取る関数
const max = Math.max(1, 5, 10, 20);
console.log(max); // => 20
```

可変長引数を実現するためには、Rest parametersか関数の中でのみ参照できる`arguments`という特殊な変数を利用します。

### [ES2015] Rest parameters {#rest-parameters}

Rest parametersは、仮引数名の前に`...`をつけた仮引数のことで、残余引数とも呼ばれます。
Rest parametersには、関数に渡された値が配列として代入されます。

次のコードでは、`fn`関数に`...args`というRest parametersが定義されています。
この`fn`関数を呼び出したときの引数の値が、`args`という変数に配列として代入されます。

{{book.console}}
```js
function fn(...args) {
    // argsは引数の値が順番に入った配列
    console.log(args); // => ["a", "b", "c"]
}
fn("a", "b", "c");
```

Rest parametersは、通常の仮引数と組み合わせても定義できます。
ほかの仮引数と組み合わせる際には、必ずRest parametersを末尾の仮引数として定義する必要があります。

次のコードでは、1番目の引数は`arg1`に代入され、残りの引数が`restArgs`に配列として代入されます。

{{book.console}}
```js
function fn(arg1, ...restArgs) {
    console.log(arg1); // => "a"
    console.log(restArgs); // => ["b", "c"]
}
fn("a", "b", "c");
```

Rest parametersは、引数をまとめた配列を仮引数に定義する構文でした。
一方で、配列を展開して関数の引数に渡すSpread構文もあります。

Spread構文は、配列の前に`...`をつけた構文のことで、関数には配列の値を展開したものが引数として渡されます。
次のコードでは、`array`の配列を展開して`fn`関数の引数として渡しています。

{{book.console}}
```js
function fn(x, y, z) {
    console.log(x); // => 1 
    console.log(y); // => 2 
    console.log(z); // => 3 
}
const array = [1, 2, 3];
// Spread構文で配列を引数に展開して関数を呼び出す
fn(...array);
// 次のように書いたのと同じ意味
fn(array[0], array[1], array[2]);
```

### `arguments` {#arguments}

可変長引数を扱う方法として、`arguments`という関数の中でのみ参照できる特殊な変数があります。
`arguments`は関数に渡された引数の値がすべて入った**Array-like**なオブジェクトです。
**Array-like**なオブジェクトは、配列のようにインデックスで要素へアクセスできます。
しかし、`Array`ではないため、実際の配列とは異なり`Array`のメソッドは利用できないという特殊なオブジェクトです。

次のコードでは、`fn`関数に仮引数が定義されていません。
しかし、関数の内部では`arguments`という変数で、実際に渡された引数を配列のように参照できます。

{{book.console}}
```js
function fn() {
    // `arguments`はインデックスを指定して各要素にアクセスできる
    console.log(arguments[0]); // => "a" 
    console.log(arguments[1]); // => "b" 
    console.log(arguments[2]); // => "c" 
}
fn("a", "b", "c");
```

Rest parametersが利用できる環境では、`arguments`変数を使うべき理由はありません。
`arguments`変数には次のような問題があります。

- Arrow Functionでは利用できない（Arrow Functionについては後述）
- Array-likeオブジェクトであるため、Arrayのメソッドを利用できない
- 関数が可変長引数を受けつけるのかを仮引数だけを見て判断できない

`arguments`変数は仮引数の定義とは関係なく、実際に渡された引数がすべて含まれています。
そのため、関数の仮引数の定義部分だけ見ても、実際に関数の要求する引数がわからないという問題を作りやすいです。
Rest parametersであれば、仮引数で可変長を受け入れるかが明確になります。

このように、可変長引数が必要な場合は`arguments`変数よりも、Rest parametersでの実装を推奨します。

## [ES2015] 関数の引数と分割代入 {#function-destructuring}

関数の引数においても分割代入（Destructuring assignment）が利用できます。
分割代入はオブジェクトや配列からプロパティを取り出し、変数として定義し直す構文です。

次のコードでは、関数の引数として`user`オブジェクトを渡し、`id`プロパティをコンソールへ出力しています。

{{book.console}}
```js
function printUserId(user) {
    console.log(user.id); // => 42
}
const user = {
    id: 42
};
printUserId(user);
```

関数の引数に分割代入を使うことで、このコードは次のように書けます。
次のコードの`printUserId`関数はオブジェクトを引数として受け取ります。
この受け取った`user`オブジェクトの`id`プロパティを変数`id`として定義しています。

{{book.console}}
```js
// 第1引数のオブジェクトから`id`プロパティを変数`id`として定義する
function printUserId({ id }) {
    console.log(id); // => 42
}
const user = {
    id: 42
};
printUserId(user);
```

代入演算子（`=`）におけるオブジェクトの分割代入では、左辺に定義したい変数を定義し、右辺のオブジェクトから対応するプロパティを代入していました。
関数の仮引数が左辺で、関数に渡す引数を右辺と考えるとほぼ同じ構文であることがわかります。

```js
const user = {
    id: 42
};
// オブジェクトの分割代入
const { id } = user;
console.log(id); // => 42
// 関数の引数の分割代入
function printUserId({ id }) {
    console.log(id); // => 42
}
printUserId(user);
```

関数の引数における分割代入は、オブジェクトだけではなく配列についても利用できます。
次のコードでは、引数に渡された配列の1番目の要素が`first`に、2番目の要素が`second`に代入されます。

{{book.console}}
```js
function print([first, second]) {
    console.log(first); // => 1
    console.log(second); // => 2
}
const array = [1, 2];
print(array);
```

## 関数はオブジェクト {#first-class-function}

JavaScriptでは、関数は関数オブジェクトとも呼ばれ、オブジェクトの一種です。
関数はただのオブジェクトとは異なり、関数名に`()`をつけることで、関数としてまとめた処理を呼び出すことができます。

一方で、`()`をつけて呼び出されなければ、関数をオブジェクトとして参照できます。
また、関数はほかの値と同じように変数へ代入したり、関数の引数として渡すことが可能です。

次のコードでは、定義した`fn`関数を`myFunc`変数へ代入してから、呼び出しています。

{{book.console}}
```js
function fn() {
    console.log("fnが呼び出されました");
}
// 関数`fn`を`myFunc`変数に代入している
const myFunc = fn;
myFunc();
```

このように関数が値として扱えることを、**ファーストクラスファンクション**（第一級関数）と呼びます。

先ほどのコードでは、関数宣言をしてから変数へ代入していましたが、最初から関数を値として定義できます。
関数を値として定義する場合には、関数宣言と同じ`function`キーワードを使った方法とArrow Functionを使った方法があります。
どちらの方法も、関数を式（代入する値）として扱うため**関数式**と呼びます。

### 関数式 {#function-expression}

関数式とは、関数を値として変数へ代入している式のことを言います。
関数宣言は文でしたが、関数式では関数を値として扱っています。
これは、文字列や数値などの変数宣言と同じ定義方法です。

```js
// 関数式
const 関数名 = function() {
    // 関数を呼び出したときの処理
    // ...
    return 関数の返り値;
};
```

関数式では`function`キーワードの右辺に書く関数名は省略できます。
なぜなら、定義した関数式は変数名で参照できるためです。
一方、関数宣言では`function`キーワードの右辺の関数名は省略できません。

```js
// 関数式は変数名で参照できるため、"関数名"を省略できる
const 変数名 = function() {
};
// 関数宣言では"関数名"は省略できない
function 関数名() {
}
```

<!-- textlint-disable prh -->

このように関数式では、名前を持たない関数を変数に代入できます。
このような名前を持たない関数を**匿名関数**（または無名関数）と呼びます。

<!-- textlint-enable prh -->

もちろん関数式でも関数に名前をつけることができます。
しかし、この関数の名前は関数の外からは呼ぶことができません。
一方、関数の中からは呼ぶことができるため、再帰的に関数を呼び出す際などに利用されます。

{{book.console}}
```js
// factorialは関数の外から呼び出せる名前
// innerFactは関数の外から呼び出せない名前
const factorial = function innerFact(n) {
    if (n === 0) {
        return 1;
    }
    // innerFactを再帰的に呼び出している
    return n * innerFact(n - 1);
};
console.log(factorial(3)); // => 6
```

### [ES2015] Arrow Function {#arrow-function}

関数式には`function`キーワードを使った方法以外に、Arrow Functionと呼ばれる書き方があります。
名前のとおり矢印のような`=>`（イコールと大なり記号）を使い、匿名関数を定義する構文です。
次のように、`function`キーワードを使った関数式とよく似た書き方をします。

```js
// Arrow Functionを使った関数定義
const 関数名 = () => {
    // 関数を呼び出したときの処理
    // ...
    return 関数の返す値;
};
```

Arrow Functionには書き方にいくつかのパターンがありますが、`function`キーワードに比べて短く書けるようになっています。
また、Arrow Functionには省略記法があり、次の場合にはさらに短く書けます。

- 関数の仮引数が1つのときは`()`を省略できる
- 関数の処理が1つの式である場合に、ブロックと`return`文を省略できる
    - その式の評価結果を`return`の返り値とする

<!-- textlint-disable eslint -->

{{book.console}}
```js
// 仮引数の数と定義
const fnA = () => { /* 仮引数がないとき */ };
const fnB = (x) => { /* 仮引数が1つのみのとき */ };
const fnC = x => { /* 仮引数が1つのみのときは()を省略可能 */ };
const fnD = (x, y) => { /* 仮引数が複数のとき */ };
// 値の返し方
// 次の２つの定義は同じ意味となる
const mulA = x => { return x * x; }; // ブロックの中でreturn
const mulB = x => x * x;            // 1行のみの場合はreturnとブロックを省略できる
```

<!-- textlint-enable eslint -->

Arrow Functionについては次のような特徴があります。

- 名前をつけることができない（常に匿名関数）
- `this`が静的に決定できる（詳細は「[関数とスコープ][]」の章で解説します）
- `function`キーワードに比べて短く書くことができる
- `new`できない（コンストラクタ関数ではない）
- `arguments`変数を参照できない

たとえば`function`キーワードの関数式では、値を返すコールバック関数を次のように書きます。
配列の`map`メソッドは、配列の要素を順番にコールバック関数へ渡し、そのコールバック関数が返した値を新しい配列にして返します。

{{book.console}}
```js
const array = [1, 2, 3];
// 1,2,3と順番に値が渡されコールバック関数（匿名関数）が処理する
const doubleArray = array.map(function(value) {
    return value * 2; // 返した値をまとめた配列ができる
});
console.log(doubleArray); // => [2, 4, 6]
```

Arrow Functionでは処理が1つの式だけである場合に、`return`文を省略し暗黙的にその式の評価結果を`return`の返り値とします。
また、Arrow Functionは仮引数が1つである場合は`()`を省略できます。
このような省略はコールバック関数を多用する場合にコードの見通しを良くします。

次のコードは、先ほどの`function`キーワードで書いたコールバック関数と同じ結果になります。

{{book.console}}
```js
const array = [1, 2, 3];
// 仮引数が1つなので`()`を省略できる
// 関数の処理が1つの式なので`return`文を省略できる
const doubleArray = array.map(value => value * 2);
console.log(doubleArray); // => [2, 4, 6]
```

Arrow Functionは`function`キーワードの関数式に比べて、できることとできないことがはっきりしています。
たとえば、`function`キーワードでは非推奨としていた`arguments`変数を参照できますが、Arrow Functionでは参照できなくなっています。
Arrow Functionでは、人による解釈や実装の違いが生まれにくくなります。

また、`function`キーワードとArrow Functionの大きな違いとして、`this`という特殊なキーワードに関する挙動の違いがあります。
`this`については「[関数とスコープ][]」の章で解説しますが、Arrow Functionではこの`this`の問題の多くを解決できるという利点があります。

そのため、Arrow Functionで問題ない場合はArrow Functionで書き、そうでない場合は`function`キーワードを使うことを推奨します。

## [コラム] 同じ名前の関数宣言は上書きされる {#function-overwrite}

関数宣言で定義した関数は、関数の名前でのみ区別されます。
そのため、同じ名前の関数を複数回宣言した場合には、後ろで宣言された関数によって上書きされます。

次のコードでは、`fn`という関数名を2つ定義していますが、最後に定義された`fn`関数が優先されています。
また、仮引数の定義が異なっていても、関数の名前が同じなら上書きされます。

<!-- textlint-disable eslint -->

{{book.console}}
<!-- babelのパースエラーを回避 https://github.com/asciidwango/js-primer/issues/711 -->
<!-- doctest:disable -->
```js
function fn(x) {
    return `最初の関数 x: ${x}`;
}
function fn(x, y) {
    return `最後の関数 x: ${x}, y: ${y}`;
}
console.log(fn(2, 10)); // => "最後の関数 x: 2, y: 10"
```

<!-- textlint-enable eslint -->

この関数定義の上書きは`function`キーワードでの関数宣言と`var`キーワードを使った関数式のみで発生します。
`let`や`const`では同じ変数名の定義はエラーとなるため、このような関数定義の上書きもエラーとなります。

このように、同じ関数名で複数の関数を定義することは基本的に意味がないため避けるべきです。
引数の違いで関数を呼び分けたい場合は、別々の名前で関数を定義するか関数の内部で引数の値で処理を分岐する必要があります。

### コールバック関数 {#callback}

関数はファーストクラスであるため、その場で作った匿名関数を関数の引数（値）として渡すことができます。
引数として渡される関数のことを**コールバック関数**と呼びます。
一方、コールバック関数を引数として使う関数やメソッドのことを**高階関数**と呼びます。

```js
function 高階関数(コールバック関数) {
    コールバック関数();
}
```

たとえば、配列の`forEach`メソッドはコールバック関数を引数として受け取る高階関数です。
`forEach`メソッドは、配列の各要素に対してコールバック関数を一度ずつ呼び出します。

{{book.console}}
```js
const array = [1, 2, 3];
const output = (value) => {
    console.log(value);
};
array.forEach(output);
// 次のように実行しているのと同じ
// output(1); => 1
// output(2); => 2
// output(3); => 3
```

毎回、関数を定義してその関数をコールバック関数として渡すのは、少し手間がかかります。
そこで、関数はファーストクラスであることを利用して、コールバック関数となる匿名関数をその場で定義して渡せます。

{{book.console}}
```js
const array = [1, 2, 3];
array.forEach((value) => {
    console.log(value);
});
```

コールバック関数は非同期処理においてもよく利用されます。
非同期処理におけるコールバック関数の利用方法については「[非同期処理][]」の章で解説します。

## メソッド {#method}

オブジェクトのプロパティである関数を**メソッド**と呼びます。
JavaScriptにおいて、関数とメソッドの機能的な違いはありません。
しかし、呼び方を区別したほうがわかりやすいため、ここではオブジェクトのプロパティである関数をメソッドと呼びます。

次のコードでは、`obj`の`method1`プロパティと`method2`プロパティに関数を定義しています。
この`obj.method1`プロパティと`obj.method2`プロパティがメソッドです。

```js
const obj = {
    method1: function() {
        // `function`キーワードでのメソッド
    },
    method2: () => {
        // Arrow Functionでのメソッド
    }
};
```

次のように空オブジェクトの`obj`を定義してから、`method`プロパティへ関数を代入してもメソッドを定義できます。

```js
const obj = {};
obj.method = function() {
};
```

<!-- textlint-disable no-js-function-paren -->

メソッドを呼び出す場合は、関数呼び出しと同様に`オブジェクト.メソッド名()`と書くことで呼び出せます。

<!-- textlint-enable no-js-function-paren -->

{{book.console}}
```js
const obj = {
    method: function() {
        return "this is method";
    }
};
console.log(obj.method()); // => "this is method"
```

### [ES2015] メソッドの短縮記法 {#shorthand-for-method}

先ほどの方法では、プロパティに関数を代入するという書き方になっていました。
ES2015からは、メソッドとしてプロパティを定義するための短縮した書き方が追加されています。

次のように、オブジェクトリテラルの中で `メソッド名(){ /*メソッドの処理*/ }` と書くことができます。

{{book.console}}
```js
const obj = {
    method() {
        return "this is method";
    }
};
console.log(obj.method()); // => "this is method"
```

この書き方はオブジェクトのメソッドだけではなく、クラスのメソッドと共通の書き方となっています。
メソッドを定義する場合は、できるだけこの短縮記法に統一したほうがよいでしょう。

## まとめ {#function-declaration-summary}

この章では、次のことについて学びました。

- 関数の宣言方法
- 関数を値として使う方法
- コールバック関数
- 関数式とArrow Function
- メソッドの定義方法

基本的な関数の定義や値としての関数について学びました。
JavaScriptでは、非同期処理を扱うことが多く、その場合にコールバック関数が使われます。
Arrow Functionを使うことで、コールバック関数を短く簡潔に書くことができます。

JavaScriptでのメソッドは、オブジェクトのプロパティである関数のことです。
ES2015からは、メソッドを定義する構文が追加されているため活用していきます。

[関数とスコープ]: ../function-scope/README.md
[非同期処理]: ../async/README.md
[変数名に使える名前のルール]: ../variables/README.md#variable-name
