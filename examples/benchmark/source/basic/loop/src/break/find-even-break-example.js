// 引数の`num`が偶数ならtrueを返す
function isEven(num) {
    return num % 2 === 0;
}
// 引数の`numbers`に偶数が含まれているならtrueを返す
function isEvenIncluded(numbers) {
    let isEvenIncluded = false;
    for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i];
        if (isEven(num)) {
            isEvenIncluded = true;
            break;
        }
    }
    return isEvenIncluded;
}
const array = [1, 5, 10, 15, 20];
console.log(isEvenIncluded(array)); // => true
