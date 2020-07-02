// `RegExp`コンストラクタは実行時にパターンが評価され、例外が発生する
function main() {
    // `[`は対となる`]`を組み合わせる特殊文字であるため、単独で書けない
    const invalidPattern = new RegExp("[");
}

// `main`関数を呼び出すことで初めて例外が発生する
main();