
console.log("------Reduce-------")
Array.prototype.MyReduce = function (callback, starting) {
    //receive callback (receive accumulator and current item) and starting
    var acc = starting === undefined ? [] : starting
    for (var i = 0 ; i < this.length ; i++) {
        acc = callback.call(this, acc, this[i])
    }

    return acc
}

var input = [1,2,3,4]


var output = input.MyReduce(function(accumulator, item) {
    return [...accumulator, item * 2]
},[]);

console.log(output)

var orders = [
    { amount: 250 },
    { amount: 400 },
    { amount: 100 },
    { amount: 325 },
];

var totalAmount = orders.MyReduce((sum, order) => { return sum + order.amount }, 0);
console.log(totalAmount);

console.log("------Map-------")
Array.prototype.MyMap = function (callback) {
    //receive callback (receive current obj)
    var result = this.MyReduce(function (accumulator, item) {
        return [...accumulator, callback(item)]
    }, [])

    return result
}

var animals = [
    { name: "Fluffykins", species: "rabbit" },
    { name: "Caro", species: "dog" },
    { name: "Hamilton", species: "dog" },
    { name: "Harold", species: "fish" },
    { name: "Ursula", species: "cat" },
    { name: "Jimmy", species: "fish" },
];

var names = animals.MyMap( (animal) => animal.name);
console.log(names);

console.log("------Filter-------")
Array.prototype.MyFilter = function (callback) {
    //receive callback (receive current obj)
    var result = this.MyReduce(function (accumulator, item) {
        if (callback(item))
            return [...accumulator, item]
        return accumulator
    }, [])

    return result
}

var isDog = function(animal) {
    return animal.species === 'dog'
}

var dogs = animals.MyFilter(isDog)
console.log(dogs);

console.log("------Reduce Right-------")
const array1 = [[0, 1], [2, 3], [4, 5]].reduceRight(
    (accumulator, currentValue) => {
        return accumulator.concat(currentValue)
    }, []
);

console.log(array1);
// expected output: Array [4, 5, 2, 3, 0, 1]

Array.prototype.MyReduceRight = function (callback, starting) {
    var result = this.reverse().MyReduce((accumulator, item) => {
        return callback(accumulator, item)
    }, starting)

    return result
}

const array2 = [[0, 1], [2, 3], [4, 5]].MyReduceRight(
    (accumulator, currentValue) => {
        return accumulator.concat(currentValue)
    }
)
console.log(array2);