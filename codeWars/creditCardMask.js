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