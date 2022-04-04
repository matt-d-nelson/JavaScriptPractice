let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`; // '.' = empty space, '#' = wall, '@' = player, '=' = lava that moves horizontally, '+' = lava, 'o' = coin

class Level { //class of object to store level information
    constructor(plan) {
        let rows = plan.trim().split("\n").map(l => [...l]); //.trim removes whitespace, .split("\n") splits the plan at every newline, .map transforms each line into an array 
        //This results in a nested array that stores coordinates of every character, rows[0][0] is the top left corner (rows[y][x])
        this.height = rows.length; //height property stores how many rows (height of level)
        this.width = rows[0].length; //width property stores how many characters are in each row (width of level)
        this.startActors = []; //array for moving objects

        this.rows = rows.map((row, y) => { //second argument in map passes the array index //use map on the outer array (index gives y coordinate)
            return row.map((ch, x) => { //use map on inner array (index gives x coordinate)
                let type = levelChars[ch]; //sets type to the property value of ch in the levelChars object
                if (typeof type == "string") return type; //if it is a string, return it
                this.startActors.push( //else push it to the startActors array
                    type.create(new Vec(x, y), ch)); //create a new vector object for it 
                return "empty"; //return an empty spot for where the actor was
            });
        });
    }
}

console.log(simpleLevelPlan.trim().split("\n").map(l => [...l]));

class State { //persistant state structure that when updating the game's state, creates a new state leaving the old one intact
    constructor(level, actors, status) {
        this.level = level;
        this.actors = actors;
        this.status = status;
    }

    static start(level) { //static method to call when the game is first started //cannot be called on the object
        return new State(level, level.startActors, "playing");
    }

    get player() { //get method to return the player Vec
        return this.actors.find(a => a.type == "player");
    }
}

class Vec { //class of object to store information about moving actors
    constructor(x, y) { //coordinates
        this.x = x;
        this.y = y;
    }
    plus(other) { //method to add to coordinates
        return new Vec(this.x + other.x, this.y + other.y);
    }
    times(factor) { //method to scale coordinates
        return new Vec(this.x * factor, this.y * factor);
    }
}

class Player {
    constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
    }

    get type() { return "player"; }

    static create(pos) {
        return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0,0)); //Because the player is one and a half squares high, set its innitial position to be half a square above the @
    }
}

Player.prototype.size = new Vec(0.8, 1.5); //create a size on the prototype because it will never change

class Lava {
    constructor(pos, speed, reset) {
        this.pos = pos;
        this.speed = speed;
        this.reset = reset;
    }

    get type() {return "Lava";}

    static create(pos, ch) { //creates new lava object based on the ch passed into it
        if (ch == "=") {
            return new Lava(pos, new Vec(2, 0));
        } else if (ch == "|") {
            return new Lava(pos, new Vec(0, 2));
        } else if (ch == "v") {
            return new Lava(pos, new Vec(0, 3), pos)
        }
    }
}

Lava.prototype.size = new Vec(1,1);

class Coin {
    constructor(pos, basePos, wobble) {
        this.pos = pos;
        this.basePos = basePos;
        this.wobble = wobble;
    }

    get type() {return "coin";}

    static create(pos) { //Makes the coin bounce in place
        let basePos = pos.plus(new Vec(0.2, 0.1));
        return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
    }
}

Coin.prototype.size = new Vec(0.6, 0.6);

const levelChars = {
    ".": "empty",
    "#": "wall",
    "+": "lava",
    "@": Player,
    "o": Coin,
    "=": Lava,
    "|": Lava,
    "v": Lava,
};

function elt(name, attrs, ...children) { //helper function to create an element and assign it attributes and child nodes
    let dom = document.createElement(name);
    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }
    for (let child of children) {
        dom.appendChild(child);
    }
    return dom;
}

class DOMDisplay {
    constructor(parent, level) {
        this.dom = elt("div", {class: "game"}, drawGrid(level));
        this.actorLayer = null;
        parent.appendChild(this.dom);
    }
    clear() { this.dom.remove(); }
}

const scale = 20;

function drawGrid(level) {
    return elt("table", { //background is drawn as a table element
        class: "background",
        style: `width: ${level.width * scale}px`
    }, ...level.rows.map(row =>
        elt ("tr", {style: `height: ${scale}px`}, ...row.map(type => elt("td", {class: type}))) //
    ));
}

function drawActors(actors) { //function to draw actors
    return elt("div", {}, ...actors.map(actor => {
        let rect = elt("div", {class: `actor ${actor.type}`});
        rect.style.width = `${actor.size.x * scale}px`;
        rect.style.height = `${actor.size.y * scale}px`;
        rect.style.left = `${actor.pos.x * scale}px`;
        rect.style.top = `${actor.pos.y * scale}px`;

    }))
}

DOMDisplay.prototype.syncState = function(state) { //method to make the DOM display a given state, update actor locations
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `gmae ${state.status}`;
    this.scrollPlayerIntoView(state);
}

DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
    let width = this.dom.clientWidth;
    let height = this.dom.clientHeight;
    let margin = width / 3;

    // The viewport
    let left = this.dom.scrolLeft, right = left + width;
    let top = this.dom.scrollTop, bottom = top + height;

    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5)).times(scale);

    if (center.x < left + margin) {
        this.dom.scrollLeft = center.x - margin;
    } else if (center.x > right - margin) {
        this.dom.scrollLeft = center.x + margin - width;
    }
    if (center.y < top + margin) {
        this.dom.scrollTop = center.y - margin;
    } else if (center.y > bottom - margin) {
        this.dom.scrollTop = center.y + margin - height;
    }
};

let simpleLevel = new Level(simpleLevelPlan);
let display = new DOMDisplay(document.body, simpleLevel);
display.syncState(State.start(simpleLevel));