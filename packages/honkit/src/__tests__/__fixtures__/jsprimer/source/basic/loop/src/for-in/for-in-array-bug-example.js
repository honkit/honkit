const numbers = [5, 10];
let total = 0;
for (const num in numbers) {
    // 0 + "0" + "1" という文字列結合が行われる
    total += num;
}
console.log(total); // => "001"
