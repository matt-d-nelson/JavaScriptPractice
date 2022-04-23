/*
Usually when you buy something, you're asked whether your credit card number, phone number or answer to your most secret question is still correct. 
However, since someone could look over your shoulder, you don't want that shown on your screen. Instead, we mask it.

Your task is to write a function maskify, which changes all but the last four characters into '#'.
*/

function maskify(cc) {
    let returnArray = [];
    
    for(let i = 0; i < cc.length; i++) {
      if(i >= (cc.length-4)) {
        returnArray.push(cc[i]);
      } else {
        returnArray.push('#');
      }
    }
    return returnArray.join('');
  }

  console.log(maskify('4556364607935616'));
  console.log(maskify('1'));

/*
Digital root is the recursive sum of all the digits in a number.

Given n, take the sum of the digits of n. 
If that value has more than one digit, continue reducing in this way until a single-digit number is produced. 
The input will be a non-negative integer.
*/

function digital_root(n) {
    let nString = n.toString();
    while(nString.length > 1) {
        let nSum = 0;
        for(i = 0; i < nString.length; i++) {
            nSum += Number(nString[i]);
        }
        nString = nSum.toString();
    }
    return Number(nString);
}

console.log(digital_root(16));
console.log(digital_root(456));

/*
Check to see if a string has the same amount of 'x's and 'o's. 
The method must return a boolean and be case insensitive. 
The string can contain any char.
*/

function XO(str) {
    //code here
    let xTot = 0;
    let oTot = 0;
    for(i = 0; i < str.length; i++) {
        if (str[i].toLowerCase() == 'x') xTot++
        if (str[i].toLowerCase() == 'o') oTot++
    }
    return (xTot == oTot);
}

console.log(XO("ooxx"));
console.log(XO("ooxXm"));
console.log(XO("oookdjsfxx"));

/*
Write a function, persistence, that takes in a positive parameter num and returns its multiplicative persistence, 
which is the number of times you must multiply the digits in num until you reach a single digit.
*/

function persistence(num) {
  //code me
  let numString = num.toString()
  let persistenceTot = 0;
  while(numString.length > 1) {
    let newNum = 1;
    for(let i = 0; i < numString.length; i++) {
      newNum *= Number(numString[i]);
    }
    numString = newNum.toString();
    persistenceTot++;
  }
  return persistenceTot;
}

console.log(persistence(39));

/*
Write a function that will check if two given characters are the same case.

If either of the characters is not a letter, return -1
If both characters are the same case, return 1
If both characters are letters, but not the same case, return 0
*/

function sameCase(a, b){
  let singleLet = /^[A-Za-z]+$/;
  if(singleLet.test(a) && singleLet.test(b)) {
    if(a.toLowerCase() == a && b.toLowerCase() == b) return 1;
    if(a.toUpperCase() == a && b.toUpperCase() == b) return 1; 
  } else return -1;
  return 0;
}

console.log(sameCase(' ','6'));

/*
Well met with Fibonacci bigger brother, AKA Tribonacci.

As the name may already reveal, it works basically like a Fibonacci, but summing the last 3 (instead of 2) numbers of the sequence to generate the next. 
*/

function tribonacci(signature,n){
  //your code here
  switch (n) {
      case 0: return [];
      case 1: return [signature[0]];
      case 2: return [signature[0],signature[1]];
  }
  while (signature.length < n) {
    signature.push(signature[signature.length-1] + signature[signature.length-2] + signature[signature.length-3]);
  }
  return signature;
}

/*
Your task is to convert strings to how they would be written by Jaden Smith (every word is capitalized)
The strings are actual quotes from Jaden Smith, 
but they are not capitalized in the same way he originally typed them.
*/

String.prototype.toJadenCase = function () { 
  return this.split(" ").map(function(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

/*
Write an algorithm that takes an array and moves all of the zeros to the end, 
preserving the order of the other elements.
*/

function moveZeros(arr) {
  let returnArray = [];
  let zeroCount = 0;
  for(let i = 0; i < arr.length; i++) {
    returnArray.push(-1);
  }
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] === 0) {
      returnArray[returnArray.length-zeroCount-1] = arr[i];
      zeroCount++;
    } else {
      returnArray[i - zeroCount] = arr[i];
    }
  }
  return returnArray;
}

//built ins method
var moveZerosBuiltIn = function (arr) {
  return arr.filter(function(x) {return x !== 0}).concat(arr.filter(function(x) {return x === 0;}));
}

let testArr = [ 9, 0, 9, 0, 0, 9, 0 ];
moveZeros(testArr);
console.log(moveZeros(testArr));

/*
Your task is to sort a given string. 
Each word in the string will contain a single number. 
This number is the position the word should have in the result.
*/

function order(words){
  if(words.length === 0) return "";
  let wordsArray = words.split(' ');
  let returnArray = [];
  
  for(let i = 0;i < wordsArray.length; i++) {
    for(let n =0; n < wordsArray[i].length; n++) {
      if(!isNaN(wordsArray[i][n])) {
        returnArray[Number(wordsArray[i][n]-1)] = wordsArray[i];
      }
    }
  }
  return returnArray.join(' ');
}
let testWords = "h1 b3n nm2";
console.log(order(testWords));

//RegExpression version
function orderRE(words){
  
  return words.split(' ').sort(function(a, b){
      return a.match(/\d/) - b.match(/\d/);
   }).join(' ');
}    

/*
Implement the function unique_in_order which takes as argument a sequence and returns a list of items without any 
elements with the same value next to each other and preserving the original order of elements.
*/

var uniqueInOrder=function(iterable){
  //your code here - remember iterable can be a string or an array
  let returnArray = [];
  let previousVal = -1;
  
  for(let i = 0; i < iterable.length; i++) {
    if(iterable[i] !== previousVal) {
      returnArray.push(iterable[i]);
      previousVal = iterable[i];
    }
  }
  return returnArray;
}

let testUnique = 'AaaBBCCCC';
console.log(testUnique.length);
console.log(uniqueInOrder(testUnique));

/*
Implement the function which takes an array containing the names of people that like an item. 
It must return the display text as shown in the examples:
*/

function likes(names) {
  switch (names.length) {
    case 0: return "no one likes this";
    case 1: return `${names[0]} likes this`;
    case 2: return `${names[0]} and ${names[1]} like this`; 
    case 3: return `${names[0]}, ${names[1]} and ${names[2]} like this`; 
    default: return `${names[0]}, ${names[1]} and ${names.length-2} like this`; 
  }
}
