/**
 * 配列のようなlengthを持つクラス
 */
class ArrayLike {
    constructor(items = []) {
        this._items = items;
    }

    get items() {
        return this._items;
    }

    get length() {
        return this._items.length;
    }

    set length(newLength) {
        const currentItemLength = this.items.length;
        // 現在要素数より小さな`newLength`が指定された場合、指定した要素数となるように末尾を削除する
        if (newLength < currentItemLength) {
            this._items = this.items.slice(0, newLength);
        } else if (newLength > currentItemLength) {
            // 現在要素数より大きな`newLength`が指定された場合、指定した要素数となるように末尾に空要素を追加する
            this._items = this.items.concat(new Array(newLength - currentItemLength));
        }
    }
}

const arrayLike = new ArrayLike([1, 2, 3, 4, 5]);
console.log(arrayLike.length); // => 5
console.log(arrayLike.items.length); // => 5
// setter で lengthを変更
arrayLike.length = 10;
console.log(arrayLike.length); // => 10
console.log(arrayLike.items.length); // => 10
console.log(arrayLike.items.join(", ")); // => "1, 2, 3, 4, 5, , , , , "
arrayLike.length = 3;
console.log(arrayLike.length); // => 3
console.log(arrayLike.items.length); // => 3


// more test
console.log("more test");
const testArray = new ArrayLike();
console.log(testArray.length); // => 0
testArray.length = 10;
console.log(testArray.length); // => 10
const testArray2 = new ArrayLike([1, 2, 3]);
console.log(testArray2.length); // => 3
testArray.length = 0;
console.log(testArray.length); // => 0
