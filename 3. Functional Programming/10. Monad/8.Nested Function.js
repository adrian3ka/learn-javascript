function outerFunction(s) {
    console.log(s)
    return function innerFunction(x) { //returning another function instead of value
        console.log(x)
    }
}

var catchFunction = outerFunction("Adrian")

console.log(catchFunction.name) // innerFunction

catchFunction("Eka")