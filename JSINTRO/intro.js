// This is a comment
console.log( 'Hello JS World!');
// Out first variable
let myName = 'Matt';
console.log(myName);
myName = 'somethingElse';
console.log(myName);
myName = 666;
console.log(myName);
// Boolean
let tired = true;
console.log(true);
console.log(myName, tired); // , Only works in the console to add a space in text

//
console.log('-------------------');
let x = 9;
let y = 234;
console.log(x/y);
console.log(x*y);
x++; //Increments (adds 1, same as 'x = x+1')
console.log(x);
x+=5;
console.log(x);

// Conditional
if(tired === true){
    console.log('get some coffee');
} //end if 
else {
    console.log('get to work.');
} //end else

let temp = 'medium';

if (temp === 'hot') {
    console.log('too hot');
} 
else if (temp === 'cold') {
    console.log('too cold');
} 
else {
    console.log('just right');
}
console.log('beet');

// constant
const pi = 3.14159;
