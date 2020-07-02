const array = [1, 2, 3];
console.log(array.length); // => 3
// `const`で宣言された変数には再代入できない
array = []; // TypeError: invalid assignment to const `array' が発生
