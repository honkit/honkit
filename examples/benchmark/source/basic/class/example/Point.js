class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `x:${this.x}, y:${this.y}`;
    }
}

const point = new Point(3, 4);
console.log(point.x); // => 3
console.log(point.y); // => 4
console.log(point.toString()); // => `x:3, y:4`
