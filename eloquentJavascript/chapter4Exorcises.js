//----------------------------------------The sum of range----------------------------------------//
/*
function range(start, end, step) {
    let result = [];
    for (let i = start; i <= end; i += step) {
        result.push(i);
    }
    return result;
}
*/

//Altered to accept 'step input and iterate up or down
function range(start, end, step) {
    let result = []
    let i = start;
    while (i != end) {
        result.push(i);
        i += step;
    }
    return result;
}

let test = range(3,13,2);
console.log(test);

function sum(nums) {
    let result = 0;
    for(let i = 0; i < nums.length; i++) {
        result += nums[i];
    }
    return result;
}

let testSum = sum(test);
console.log(testSum);

//----------------------------------------Reversing an array----------------------------------------//

function reverseArray(array) {
    let revArray = [];
    for(i = 0; i < array.length; i++) {
        revArray[i] = array[array.length-1-i]
    }
    return revArray;
}

console.log(reverseArray(test));

function reverseArrayInPlace(array) {
    for(i = 0; i < Math.floor(array.length/2); i++) {
        let temp = array[i]
        array[i] = array[array.length-1-i];
        array[array.length-1-i] = temp;
    }
}

reverseArrayInPlace(test);
console.log(test);

//---------------------------------------A List-----------------------------------------//

//Function to create a nested list from an array
function arrayToList(array) {
    function addBlob(i) {
        if (array[i+1] === undefined) {
            return {value: array[i], rest: null};
        } else {
            return {value: array[i], rest: addBlob(i + 1)};
        }
    }     
    return addBlob(0);
}
let testList = arrayToList(test);
console.log(testList);

//Function to add a blob to the front of a list
function prepend(list, val) {
    let tempArray = listToArray(list);
    tempArray.unshift(val);
    return arrayToList(tempArray);
}
let newList = prepend(testList, 44);
console.log(newList);

//Function to return the location of a value in a list
function nth(list, val) {
    function check(l,n) {
        if (l.value === val) {
            return `Value ${val} is at index ${n}`;
        }
        if (l.rest === null) {
            return `Value ${val} not in list`; 
        }
        return check(l.rest,n+1);
    }
    return check(list,0);
}

console.log(nth(newList, 3));

//Function to create an array from the nested list
function listToArray(list) {
    let returnArray = [];
    function addIndex(l) {
        returnArray.push(l.value);
        if (l.rest != null) {
            addIndex(l.rest);
        }
    }
    addIndex(list);
    return returnArray
}

let testArray = listToArray(testList);
console.log(testArray);

//---------------------------------------Deep Comparison-----------------------------------------//

function deepEqual(val1, val2) {
    if (val1 === val2) return true;
    if (val1 == null || typeof val1 != "object" || val2 == null || typeof val2 != "object") return false;
    let keys1 = Object.keys(val1);
    let keys2 = Object.keys(val2);
    if (keys1.length != keys2.length) return false;
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(val1[key],val2[key])) return false;
    }
    return true;
}

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));