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
	return x*Math.pow(2,y)
}

