//Min function
function Minimum (num1,num2) {
    if (num1 < num2) {
        return num1;
    }
    return num2; //returns for cases where num2 is less than or equal to num1
}

//Recursive function to test if a number is even or odd
function isEven (num) {
    if (num === 0) {
        return true;
    }
    if (num === 1) {
        return false;
    }
    if (num > 0) {
        return (isEven(num - 2));
    }
    return (isEven(num + 2));
}

//Iterative function to count 'B's in a string
function countBs (str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === 'B') {
            count++;
        }
    }
    return count;
}
//Generalized functions to count any character 
function countChar (str, c) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === c) {
            count++;
        }
    }
    return count;  
}

//Recursive version
function countBsRec (str,cnt) {
    let bS = 0;
    if (cnt < str.length-1) {
        bS += countBsRec(str,cnt+1);
    }
    if (str[cnt] === 'B') {
        return bS + 1;
    }
    return bS + 0;
}

console.log(countBsRec('BbbBkfdjsldkfjB', 0));