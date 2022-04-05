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

DOMDisplay.prototype.scrollPlayerIntoView = function(state) { //method to ensure that the player actor is always in camera
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

Level.prototype.touches = function(pos, size, type) {
    //ciel and floor to get any grid location where an actor is
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

    //loop through x and y coords of coliding boxes
    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
            let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height; //conditons where isOutside would be true or false
            let here = isOutside ? "wall" : this.rows[y][x]; //if the actor is outside, treat the grid like a wall so they can't go outside, otherwise get the type at this x,y coordinate
            if (here == type) return true; //if here matches the given type, return true
        }
    }
    return false;
}

State.prototype.update = function(time, keys) { //function to update game state, passed a time step and what keys are held down
    let actors = this.actors.map(actor => actor.update(time, this, keys)); //calls update method on all actors creating an array of updated actors
    let newState = new State(this.level, actors, this.status);

    if (newState.status != "playing") return newState; //potentially stops the game if in a different state

    let player = newState.player;
    if (this.level.touches(player.pos, player.size, "lava")) { //if the player is touching lava, return a lost state
        return new State(this.level, actors, "lost");
    }

    for (let actor of actors) {
        if (actor != player && overlap(actor, player)) { //if any actors (excluding the player) are overlapping the player
            newState = actor.collide(newState); //run the collision code on the collided object 
        }
    }
    return newState;
};

function overlap(actor1, actor2) {
    return actor1.pos.x + actor1.size.x > actor2.pos.x &&
        actor1.pos.x < actor2.pos.x + actor.size.x &&
        actor1.pos.y + actor1.size.y > actor2.pos.y &&
        actor1.pos.y < actor2.pos.y + actor2.size.y;
}

Lava.prototype.collide = function(state) {
    return new State(state.level, state.actors, "lost");
};

Coin.prototype.collide = function(state) {
    let filtered = state.actors.filter(a => a != this);
    let status = state.status;
    if (!filtered.some(a => a.type == "coin")) status = "won";
    return new State(state.level, filtered, status);
};

Lava.prototype.update = function(time, state) {
    let newPos = this.pos.plus(this.speed.times(time)); //update the position of the lava
    if (!state.level.touches(newPos, this.size, "wall")) { //if it hasn't hit a wall
        return new Lava(newPos, this.speed, this.reset); //advance its position
    } else if (this.reset) { //if it has a reset value
        return new Lava(this.reset, this.speed, this.reset); //reset its position
    } else { 
        return new Lava(this.pos, this.speed.times(-1)); //have it bounce off the wal
    }
};

const wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.update = function(time) { //Update coin wobble position
    let wobble = this.wobble + time * wobbleSpeed;
    let wobblePos = Math.sin(wobble) * wobbleDist;
    return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
};

const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function(time, state, keys) {
    let xSpeed = 0;
    if (keys.ArrowLeft) xSpeed -= playerXSpeed; //adjusting x based on what keys are pressed
    if (keys.ArrowRight) xSpeed += playerXSpeed;
    let pos = this.pos;
    let movedX = pos.plus(new Vec(xSpeed * time, 0));
    if (!state.level.touches(movedX, this.size, "wall")) { //if not colliding with a wall
        pos = movedX; //commit movement
    }

    let ySpeed = this.speed.y + time * gravity; //more complicated than x because of gravity
    let movedY = pos.plus(new Vec(0, ySpeed * time)); //store potential movement
    if (!state.level.touches(movedY, this.size, "wall")) { //if the actor isn't going to to hit a wall
        pos = movedY; //commit movement
    } else if (keys.ArrowUp && ySpeed > 0) { //if the upArrow is pressed and the actor is touching a wal
        ySpeed = -jumpSpeed; //set -jumpSpeed to move upward
    } else { //else if the actor is touching a wall and no keys are pressed
        ySpeed = 0; //set ySpeed to 0
    }
    return new Player(pos, new Vec(xSpeed, ySpeed)); 
};

function trackKeys(keys) {
    let down = Object.create(null); //innitialize empty object
    function track(event) {
        if (keys.includes(event.key)) { //if the one of keys that are being tracked is part of the event
            down[event.key] = event.type == "keydown"; //set down at event.key to be true or false if its a keydown or keyup
            event.preventDefault(); //prevent the page from scrolling because of the arrow press
        }
    }
    window.addEventListener("keydown", track); //listen for the key press
    window.addEventListener("keyup", track); //listen for the 
    return down;
}

const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);
