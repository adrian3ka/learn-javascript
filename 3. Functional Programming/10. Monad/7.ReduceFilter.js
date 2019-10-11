const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const outputArray = inputArray.reduce(function (accumulator, item) {
    if (item % 2 == 0) {
        console.log(accumulator, item)
        return [...accumulator, item];
    }
    return accumulator;
}, []);

console.log("Result : " ,outputArray)