// Out Last Method works, but very ugly if we have 10 nested function (map/filter) :(
// To be more readable
const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// helper

const mapping = f => reducing => (acc, item) => reducing(acc, f(item))
const filtering = predicate => reducing => (acc, item) =>
    predicate(item) ? reducing(acc, item) : acc;


const compose = (...fns) => {
    return fns.reduce((accumulator, func) => {
        return (...args) => func(accumulator(...args))
    }, x => x)
}

// example -> we have to do it backward

/* do like slide 5
    .filter(i => i % 2 === 0)
    .map(i => i *2)
    .filter(i => i < 10)

 */
const transform = compose(
    filtering(item => item < 10),
    mapping(item => item * 2),
    filtering(item => item % 2 === 0)
);

var output = inputArray.reduce(
    transform((accumulator, item) => {
        return [...accumulator, item];
    }), []
)

console.log(output)