const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const outputArray = [];

for (var i = 0 ; i < inputArray.length; i++) {
    if (inputArray[i] % 2 === 0) {
        outputArray.push(inputArray[i]);
    }
}

console.log(outputArray);
