//Checks to see if it is Christmas Eve
function timeForMilkAndCookies(date) {
	if ((date.getMonth() === 11) && (date.getDate() === 24)) {
        return true
    }
    return false
}

//API promise
let promise = new Promise( (resolve, reject) => {
    setTimeout(( ) => {
        resolve('Am I right?')
    }, 1000)
})

//Check if array 1 can be nested into array 2
function canNest(arr1, arr2) {
	if ((Math.min(...arr1) > Math.min(...arr2)) && (Math.max(...arr1) < Math.max(...arr2))) {
        return true
    }
    return false
}

