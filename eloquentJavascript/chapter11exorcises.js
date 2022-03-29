//-----------------------Tracking the Scalpel-----------------------//
async function findScalpel(nest) {
    let current = nest.name;
    for (;;) { //for loop that will loop until the scalpel is found
        let next = await anyStorage(nest, current, "scalpel"); //Because we are in an async function, we can use await without declaring a promise
        if (next === current) { //If the next nest returns a scalpel location of the nest we are currently at
            return current; //Return this nest because the scalpel is here
        }
        current = next; //Else loop again on the next nest
    }
}

//-----------------------Building Promise.all-----------------------//

function Promise_all(promises) {
    return new Promise((resolve, reject) => {
        let results = []; //Innitialize an empty results array
        let pending = promises.length; //Innitialize a pending var to decrease within the loop //We can't use the for loop end condition because the loop might end before all the promises are resolved
        for (let i = 0; i < promises.length; i++) { //Loop through promises array
            promises[i].then(result => { //calculate each of the promises
                results[i] = result; //Load them into the return array
                pending--; //Decrement pending by one
                if (pending == 0) resolve(results) //If there are no more pending promises, resolve the results
            }).catch(reject); //Catch any rejected results of the resolved promises
        }
        if (promises.length == 0) resolve(results);
    });
}
