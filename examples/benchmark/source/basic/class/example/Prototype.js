/**
 * - インスタンス: クラスから生成される
 * - クラス(コンストラクタ): クラスを定義
 * - プロトタイプ: クラスの定義時に自動的に作成される
 */
class MyClass {
    method() {
        // メソッドの処理
    }
}

// インスタンス を クラス から作る
const myInstance = new MyClass();
// インスタンス から クラス を取得する
console.log(myInstance.constructor === MyClass);
// インスタンス から クラスのプロトタイプ を取得する
console.log(Object.getPrototypeOf(myInstance) === MyClass.prototype);
// インスタンスのプロトタイプ
console.log(myInstance.prototype); // => undefined
