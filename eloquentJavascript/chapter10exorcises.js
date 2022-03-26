//--------------------------A Modular Robot--------------------------//

//I would place the roads, buildGraph, and roadGraph into a seperate module.
//I would keep VillageState and the robot bindings togeather for sure because they are passing so many values between eachother.
//findRoute, randomPick could be seperate and similar functionality could be found in NPM packages.

//--------------------------Roads Module--------------------------//

const {buildGraph} = require("./graph");

const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

exports.roadGraph = buildGraph(roads.map(r => r.split("-")));



