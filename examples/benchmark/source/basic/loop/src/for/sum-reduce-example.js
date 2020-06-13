function sum(numbers) {
    return numbers.reduce((total, num) => {
        return total + num;
    }, 0); // 初期値が0
}

sum([1, 2, 3, 4, 5]); // => 15
