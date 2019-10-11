const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// helper
const mapping = function (tranformFn) {
    //console.log(tranformFn.toString())
    return  function f(reduceFn) {
        //console.log(reduceFn.toString())
        return function f1(accumulator, item) {
            //console.log(accumulator, item)
            return  reduceFn(accumulator, tranformFn(item))
        }
    }
}

const filtering = function (testFn) {
    return function f(reduceFn) {
        return function f1(accumulator, item) {
            if (testFn(item))
                return  reduceFn(accumulator, item)
            return accumulator
        }
    }
}

// example

var output = inputArray.reduce(
    mapping(item => item * 2) // this is returning f function that receive reduceFn
    (function (accumulator, item) { // it receives the params from reduce
        return [...accumulator, item]
    }) // this is returning f1 function that receive (accumulator, item) behave like callback for reduce
    ,[]
);

console.log(output)

var output = inputArray.reduce(
    mapping(item => item * 2)
    ((accumulator, item) => [...accumulator, item]),
    []
);

console.log(output)

var output = inputArray.reduce(filtering(item => item % 2 === 0)(
    (accumulator, item) => {
        console.log(accumulator)
        return [...accumulator, item]
    }
), [])

console.log(output)

//Write a function like slide 5
// Don't look below


var output = inputArray.reduce(
    filtering(item => item % 2 === 0)(
        mapping(item => item * 2 ) (
            filtering( item => item < 10) ((accumulator, item) => {
                return[...accumulator, item]
            })
        )
    )
    , []
)

console.log(output)

//Operation Will Be Cost High Memory on large array data
/*
Legend :
  I    =>  1 data in array
  []   =>  stack parameter
  >>   =>  next function
  >[]> =>  processing function
//Functors (we are not doing this)
    [III]  >> [] >> [] >> []

    [II]  >> [I] >> [] >> []
    [I]  >> [II] >> [] >> []
    []  >> [III] >> [] >> []

    [] >> [II] >> [I] >> []
    [] >> [I] >> [II] >> []
    [] >> [] >> [III] >> []


    [] >> [II] >> [I] >> []
    [] >> [I] >> [II] >> []
    [] >> [] >> [III] >> []

    [] >> [] >> [II] >> [I]
    [] >> [] >> [I] >> [II]
    [] >> [] >> [] >> [III]

//Monad (we are doing this)
    [III] >[]> >[]> >[]> []

    [II] >[I]> >[]> >[]> []
    [II] >[]> >[I]> >[]> []
    [II] >[]> >[]> >[I]> []
    [II] >[]> >[]> >[]> [I]

    [I] >[I]> >[]> >[]> [I]
    [I] >[]> >[I]> >[]> [I]
    [I] >[]> >[]> >[I]> [I]
    [I] >[]> >[]> >[]> [II]

    [] >[I]> >[]> >[]> [II]
    [] >[]> >[I]> >[]> [II]
    [] >[]> >[]> >[I]> [II]
    [] >[]> >[]> >[]> [III]
 */