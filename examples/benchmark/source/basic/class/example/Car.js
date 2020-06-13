class Car {
    constructor(maker, serialNumber) {
        this.maker = maker;
        this.serialNumber = serialNumber;
    }

    isEquals(car) {
        return car.maker === this.maker && car.serialNumber === this.serialNumber;
    }
}

// main
const car1 = new Car("Tesla", "Model S");
const car2 = new Car("Mazda", "3i");
const car3 = new Car("Mazda", "3i");
console.log(car1.isEquals(car2)); // => false
console.log(car2.isEquals(car3)); // => true
