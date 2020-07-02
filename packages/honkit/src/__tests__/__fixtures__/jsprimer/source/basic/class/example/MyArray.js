class MyArray extends Array {
    get first() {
        if (this.length === 0) {
            return undefined;
        } else {
            return this[0];
        }
    }

    get last() {
        if (this.length === 0) {
            return undefined;
        } else {
            return this[this.length - 1];
        }
    }
}

const array = MyArray.from([1, 2, 3, 4, 5]);
console.log(array.first); // => 1
console.log(array.last); // => 5
