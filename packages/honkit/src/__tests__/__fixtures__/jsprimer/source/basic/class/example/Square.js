class Rectangle {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    getArea() {
        return this.height * this.width;
    }
}

// classはhoistingしないため、かならずRectangleの後に書かないといけない
class Square extends Rectangle {
    constructor(length) {
        super(length, length);
    }
}

/**
 * Note:
 * Squareは次の性質を満たさないといけない
 *
 * - Immutable
 * - https://softwareengineering.stackexchange.com/questions/238176/why-would-square-inheriting-from-rectangle-be-problematic-if-we-override-the-set
 * - setした場合は、Squareの変更はRectangleとしての性質を満たないことがある
 * - 性質として継承できても、機能としての継承は別という話
 */
const square = new Square(3);
console.log(square.getArea()); // => 9
