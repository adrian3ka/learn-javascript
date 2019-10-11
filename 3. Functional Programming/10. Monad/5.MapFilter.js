const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const outputArray = inputArray
    .filter(i => i % 2 === 0)
    .map(i => i *2)
    .filter(i => i < 10)

console.log(outputArray);


//Operation Will Be Cost High Memory on large array data
/*
Legend :
  I    =>  1 data in array
  []   =>  stack parameter
  >>   =>  next function
  >[]> =>  processing function
//Functors
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
 */