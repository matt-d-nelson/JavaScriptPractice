//-------------------------Regexp Golf-------------------------//
let carCat = /ca[rt]/;
console.log(carCat.test('big cat'));
console.log(carCat.test('cardboard'));
console.log(carCat.test('yellow'));

let popProp = /pr?op/;
console.log(popProp.test('proper'));
console.log(popProp.test('soda pop'));

let ferretFerryFerrari = /ferr(et|y|ari)/;
console.log(ferretFerryFerrari.test('ferret'));
console.log(ferretFerryFerrari.test('ferring'));

let ious = /ious\b/;
console.log(ious.test('iousness'));
console.log(ious.test('cautious'));

let punctuation = /\s[.,:;]/;
console.log(punctuation.test(' ,'));
console.log(punctuation.test('bloodlust,iron'));

let sixLetters = /\w{7}/;
console.log(sixLetters.test('not'));
console.log(sixLetters.test('nothing'));

let noEe = /\b[^\We]+\b/i;
console.log(noEe.test('let'));
console.log(noEe.test('Eating'));
console.log(noEe.test('grant'));

//-------------------------Quoting Style-------------------------//
let removeQuotes = /(^|\W)'|'(\W|$)/g;
console.log(removeQuotes.test('let\'s'));
console.log(removeQuotes.test('\'let\'s go to church\''));
let quotesTest = '\'testing to remove some quotes and replace them y\'all\'';
console.log(quotesTest.replace(removeQuotes,'"'));






