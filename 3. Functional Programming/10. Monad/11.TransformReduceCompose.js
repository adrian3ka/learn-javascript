// Out Last Method works, but very ugly if we have 10 nested function (map/filter) :(
// To be more readable
const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// helper

const mapping = f => reducing => (acc, item) => reducing(acc, f(item))
const filtering = predicate => reducing => (acc, item) => predicate(item) ? reducing(acc, item) : acc;


const compose = (...fns) => {
    console.log("=========Start Composing=========")
    fns = fns.reverse() //reverse it, we don't need to reverse the function
    return fns.reduce((accumulator, func) => {
        console.log("-------Reduce The Function-------")
        console.log(func.toString()) // we iterate over it
        return (...args) => {
            console.log(args.toString())
            return func(accumulator(...args))
        }
    }, x => x)
}

const transduce = (transform, reducing, initial, input) => {
    return input.reduce(transform(reducing), initial);
}

// example
const transform = compose(
    filtering(item => item % 2 === 0),
    mapping(item => item * 2),
    filtering(item => item < 10),
);

var output = transduce(transform, (acc,i) => [...acc,i], [], inputArray);


console.log(output)