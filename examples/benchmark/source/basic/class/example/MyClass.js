// クラス宣言文
class MyClass1 {
    constructor() {

    }
}

const myInstance1 = new MyClass1();

// クラス宣言式
// `class クラス名` クラス名は省略できる
const MyClass2 = class {
    constructor() {

    }
};
const myInstance2 = new MyClass2();

// # constructorの省略
// `constructor`は何もしないなら省略できる
class MyClassShort1 {}

const myInstance3 = new MyClassShort1();

// # クラスは関数として呼べない
// 一方クラスは関数として呼び出すことはできない
MyClassShort1();// => TypeError: Class constructor MyClassShort1 cannot be invoked without 'new'
