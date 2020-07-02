// `number`が偶数ならtrueを返す
function isEven(num) {
    return num % 2 === 0;
}
// `numbers`に含まれている偶数だけを取り出す
function filterEven(numbers) {
    const results = [];
    for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i];
        // 偶数ではないなら、次のループへ
        if (!isEven(num)) {
            continue;
        }
        // 偶数を`results`に追加
        results.push(num);
    }
    return results;
}
const array = [1, 5, 10, 15, 20];
console.log(filterEven(array)); // => [10, 20]
