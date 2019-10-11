const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const outputArray = inputArray.reduce(function (accumulator, item) {
    console.log(accumulator, item)
    return [...accumulator, item * 2];
}, []);

console.log("Result : " ,outputArray)