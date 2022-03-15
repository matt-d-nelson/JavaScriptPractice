//Looping a triange
let block = '#';
while (block.length < 7) {
    console.log(block);
    block += '#';
}

//FizzBuzz
for (i = 1; i <= 100; i++) {
    if ((i % 3 == 0) && (i % 5 == 0)) {
        console.log('FizzBuzz');
    } 
    else if (i % 3 == 0) {
        console.log('Fizz');
    }
    else if (i % 5 == 0) {
        console.log('Buzz');
    }
    else {
        console.log(i);
    }
}

//Chessboard
let size = 8;
for (i = 0; i < size; i++) {
    let row = '';
    for (n = 0; n < size; n++) {
        if (i % 2 == 0) {
            if (n % 2 == 0) {
                row += '#';
            } else {
                row += ' ';
            }
        } else {
            if (n % 2 == 0) {
                row += ' ';
            } else {
                row += '#';
            }          
        }
    }
    console.log(row);
}
//Alt - Only check once for odd numbers by adding i and n togeather
let board = '';
for (i = 0; i < size; i++) {
    for (n = 0; n < size; n++) {
        if ((i + n) % 2 == 0) {
            board += ' ';
        } else {
            board += '#';
        }
    }
    board += '\n';
}
console.log(board);