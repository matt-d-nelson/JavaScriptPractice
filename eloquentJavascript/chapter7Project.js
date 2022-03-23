const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
  ];

  function buildGraph(edges) {
      let graph = Object.create(null); //Create an empty object with no inheritance from Object.prototype and bind it to graph
      function addEdge(from, to) { 
          if (graph[from] == null) { //Checks to see if an array has already been declared for a location
              graph[from] = [to]; //If not, it innitializes the array and adds the to location into it
          } else {
              graph[from].push(to); //If so, it adds the to location to the end of the array
          }
      }
      for (let [from, to] of edges.map(r => r.split('-'))) { //Splits every element at '-' in the input array into another array formatted as [from,to]
          addEdge(from, to); //Adds lines between the from and to locations to the 2 dimentional graph array
          addEdge(to, from); //Adds lines between the to and from locations to the 2 dimentional graph array
      }
      return graph;
  }

  const roadGraph = buildGraph(roads);
  console.table(roadGraph);

  class VillageState { //Constructor to create the state of the vilage with the robot's and parcel's locations
      constructor(place, parcels) { //Creates a new object with place and parcels perameters
          this.place = place; //The current place that the delivery robot is at
          this.parcels = parcels; //The current location and delivery address of the parcels 
      }
      move(destination) {
          if (!roadGraph[this.place].includes(destination)) { //If there is not a road from the current location to the destination (if the roadGraph at this.place doesn't include the destination value)
              return this; //Return this same state because there is no meaningfull move to make
          } else { 
              let parcels = this.parcels.map(p => { //Creates a new array based on the input function, stores in parcels property
                  if (p.place != this.place) return p; //If the robot is not at the location of the parcel, it does not pick it up (or he has not already collected it), so it remains at the same place
                  return {place: destination, address: p.address}; //Otherwise, update the place property of the parcel. The address stays the same
              }).filter(p => p.place != p.address); //Filters out the parcels that have reached their destination (place = address)
              return new VillageState(destination, parcels); //Returns new VillageState
          }
      }
  }

  let first = new VillageState(
      "Post Office",
      [{place: "Post Office", address: "Alice's House"}]
  );
  let next = first.move("Alice's House");
  console.log(next.place);
  console.log(next.parcels);
  console.log(first.place);

  function runRobot(state, robot, memory) { //Function that takes the VillageState, the robot that will deliver the parcels, and the memory from when the robot was run previously
      for (let turn = 0;; turn++) { //No end state for the loop because we are not sure how many turns it will take to deliver all the parcels.
          if (state.parcels.length == 0) { //If all the parcels are delivered
              //console.log(`Done in ${turn} turns`); //Log a message into the console saying how many turns it took //Commented out for exercise
              return turn; //Added for measuing a robot exercise
              break; //Break out of the loop because all parcels are delivered and there is no other end statement
          }
          let action = robot(state, memory); //robot is a function that is put into this function //Run that function with the given state and memory
          state = state.move(action.direction); //Run the move function on the VillageState object with the direction produced by the given robot function and stored into the action var
          memory = action.memory; //Store the robots updated memory
          //console.log(`Moved to ${action.direction}`); //Log an update of movement to the console //Commented out for exercise
      }
  }

  function randomPick(array) { //Supply function with an array
      let choice = Math.floor(Math.random() * array.length); //Create a random integer from 0 to the length of the array
      return array[choice]; //Return the array at the random integer
  }

  function randomRobot(state) {
      return {direction: randomPick(roadGraph[state.place])}; //Return a random direction from the potential directions at the state's current location
  }

  VillageState.random = function(parcelCount = 5) { //Create a static method for VillageState to create a random state with the given amount of parcels
      let parcels = []; //Innitialize an empty parcels array
      for (let i = 0; i < parcelCount; i++) {  //Loop to create an address and place for each parcel
          let address = randomPick(Object.keys(roadGraph)); //pick a random address from the roadGraph array
          let place; //Innitialize an empty place var
          do {
              place = randomPick(Object.keys(roadGraph)); //Pick a random starting place for each parcel
          } while (place == address); //Keep picking a new place until it doesn't match the address (so parcels can't be addressed to their starting location)
          parcels.push({place, address}); //Add the newly generated parcel object to the parcels array
      }
      return new VillageState("Post Office", parcels); //Return the randomly generated VillageState starting at the post office (of course) with the generated parcels
  };

  //runRobot(VillageState.random(), randomRobot);

  function findRoute(graph, from, to) { //Pathfinding function that takes a graph, from, and to values
      let work = [{at: from, route: []}]; //Creates a work object with at being the from value and route being an empty array
      for (let i = 0; i < work.length; i++) { 
          let {at, route} = work[i]; 
          for (let place of graph[at]) { //For each potential move at the current location
              if (place == to) return route.concat(place); //If a potential move is the address location add this place to the route array //Ultimate return value of this function
              if (!work.some(w => w.at == place)) { //If the current place is not a place we have explored before
                  work.push({at: place, route: route.concat(place)}); //We add the place to the work array telling us that we need to search that location
              }
          }
      }
  }

  function goalOrientedRobot({place, parcels}, route) { //takes VillageState and route
      if (route.length == 0) { //If no moves have been made
          let parcel = parcels[0] //Set parcel to equal the first parcel in the parcels array
          if (parcel.place != place) { //If the robot is not at the location of that parcel
              route = findRoute(roadGraph, place, parcel.place); //find a route to it
          } else {
              route = findRoute(roadGraph, place, parcel.address); //Otherwise find a route to its delivery address
          }
      }
      return {direction: route[0], memory: route.slice(1)}; //return begining of the route array for the direction and the memory of the route with index 0 sliced off
  }

  //runRobot(VillageState.random(), goalOrientedRobot, []);

  //-----------------------------------------------Measuring a Robot-----------------------------------------------//

  function compareRobots(r1, r2) {
      let r1Results = [];
      let r2Results = [];
      for (i = 0; i < 100; i++) {
          let randState = VillageState.random();
          r1Results.push(runRobot(randState, r1, []));
          r2Results.push(runRobot(randState, r2, []));
      }
      let r1Average = (r1Results.reduce((a,b) => a + b)/r1Results.length);
      let r2Average = (r2Results.reduce((a,b) => a + b)/r2Results.length);
      console.log(`Robot 1's average is ${r1Average}`);
      console.log(`Robot 2's average is ${r2Average}`);

  }

  //compareRobots(randomRobot, goalOrientedRobot);

  //-----------------------------------------------Robot Efficiency-----------------------------------------------//

  function closestParcel({place,parcels}) {
        //Find closest parcel
        let closestPar = [];
        for (i = 0; i < parcels.length; i++) {
            let curParcel = findRoute(roadGraph, place, parcels[i].place);
            if ((i === 0) || (curParcel.length < closestPar)) {
                closestPar = curParcel;
            }
        }
        return closestPar; 
  }

  function closestAddress({place,parcels}) {
    //Find closest parcel
    let closestAdd = [];
    for (i = 0; i < parcels.length; i++) {
        let curParcel = findRoute(roadGraph, place, parcels[i].address);
        if ((i === 0) || (curParcel.length < closestAdd)) {
            closestAdd = curParcel;
        }
    }
    return closestAdd; 
}

  function newRoute({place,parcels}) {
      //Find parcels at our current location and store them in an array
      let heldParcels = [];
      for (i = 0; i < parcels.length; i++) {
          if (parcels[i].place == place) {
              heldParcels.push(parcels[i]);
          }
      }
      if (heldParcels.length > 0) {
          parcels = heldParcels
          return closestAddress({place,parcels});
      }
      return closestParcel({place,parcels});
  }

  function betterRobot({place, parcels}, route) {
      //Find closest parcel
      if (route.length == 0) { 
          route = newRoute({place,parcels});
      }
      return {direction: route[0], memory: route.slice(1)};
  }

  //compareRobots(betterRobot, goalOrientedRobot);
  
  function lazyRobot({place, parcels}, route) {
    if (route.length == 0) {
      let routes = parcels.map(parcel => {
        if (parcel.place != place) {
          return {route: findRoute(roadGraph, place, parcel.place),
                  pickUp: true};
        } else {
          return {route: findRoute(roadGraph, place, parcel.address),
                  pickUp: false};
        }
      });
  
      function score({route, pickUp}) {
        return (pickUp ? 0.5 : 0) - route.length;
      }
      route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route;
    }
  
    return {direction: route[0], memory: route.slice(1)};
  }

  compareRobots(lazyRobot, goalOrientedRobot);
  
  //-----------------------------------------------Robot Efficiency-----------------------------------------------//

  class PGroup {
    constructor(members) {
      this.members = members;
    }
  
    add(value) {
      if (this.has(value)) return this;
      return new PGroup(this.members.concat([value]));
    }
  
    delete(value) {
      if (!this.has(value)) return this;
      return new PGroup(this.members.filter(m => m !== value));
    }
  
    has(value) {
      return this.members.includes(value);
    }
  }