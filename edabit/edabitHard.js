//A boomerang is an integer, followed by an integer that is greater than or less than that integer, followed by an integer === to the first. This function counts the number of boomerangs in an array. 
function countBoomerangs(arr) {
	let tBoom = 0;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] != arr[i+1]) {
            if (arr[i] === arr[i+2]) {
                tBoom++;
            }
        }
    }
    return tBoom
}

//Left Shift by Powers of Two
function shiftToLeft(x, y) {
	return x * Math.pow(2,y)
}

//Return 'Boom' is 7 is in an array
function sevenBoom(arr) {
    const isSev = arr.toString();
    if (isSev.includes('7')) {
        return 'Boom!'
    }
    return 'there is no 7 in the array'
}

//Sort an array of objects by an int property
function sortDrinkByPrice(drinks) {
	let drinksSorted = drinks.map((x) => x); //This is how an array VALUE is copied and not just its reference ID
    for(let i = 0; i < drinks.length; i++) {
        let greaterThan = 0;
        for (let n = 0; n < drinks.length; n++) {
            if (drinks[i].price > drinks[n].price) {
                greaterThan++;
            }
        }
        drinksSorted[greaterThan] = drinks[i]; 
    }
    return drinksSorted;
}
//Alt method using .sort()
function sortDrinkByPriceAlt(drinks) {
    return drinks.sort((a,b)=> a.price - b.price)
}

//Regular expressions
const REGEXP = /red flag|blue flag/;

