//A Vector Type
//-----------------------------------------A Vector Type-----------------------------------------//
class Vec {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    plus(otherVec) {
        return new Vec(
            this.x + otherVec.x,
            this.y + otherVec.y
        );
    }
    minus(otherVec) {
        return new Vec(
            this.x - otherVec.x,
            this.y - otherVec.y
        );
    }
    get length() { //getter property to compute length of vector from 0,0
        return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2)); //a2 + b2 = c2 buisiness
    }
}

let testVec = new Vec(2,3);
let otherTestVec = new Vec(4,5);
console.log(testVec);
console.log(otherTestVec);
console.log(testVec.length);
console.log(testVec.minus(otherTestVec));

//-----------------------------------------Groups-----------------------------------------//
class Group {
    constructor () {
        this.vals = []
    }
    add(v) {
        if (!this.vals.includes(v)) {
            this.vals.push(v);
        }
    }
    delete(v) {
        if (this.vals.includes(v)) {
            this.vals.splice(this.vals.indexOf(v),1);
        }
    }
    has(v) {
        return this.vals.includes(v)
    }
    get span() {
        return this.vals.length;
    }
    static from(iterable) {
        let newGroup = new Group();
        for (let i = 0; i < iterable.length; i++) {
            newGroup.add(iterable[i]);
        }
        return newGroup;
    }
}

let testGroup = new Group();
testGroup.add(3);
testGroup.add('foo');
testGroup.add(3);
testGroup.add(56);
testGroup.add(4);
testGroup.delete('foo');
console.log(testGroup.has(563));
console.log(testGroup);

let testIterable = [3,4,3,4,5,62,23,'foo','foo','foo','bar'];
let testNewGroup = Group.from(testIterable);
console.log(testNewGroup);

//-----------------------------------------Iterable Groups-----------------------------------------//
class GroupIterator {
    constructor(group) {
        this.index = 0;
        this.group = group;
    }
    next() {
        if (this.index === this.group.span) {
            return {done: true};
        }
        let result = {
            index: this.index, 
            value: this.group.vals[this.index], 
            done:false
        };
        this.index++;
        return result;
    }
}

Group.prototype[Symbol.iterator] = function() { //This defines the Group class as an iterator and provides the function to iterate with.
    return new GroupIterator(this);
}

for (let value of Group.from(["a", "b", "c"])) {
    console.log(value);
}

//-----------------------------------------Borrowing a Method-----------------------------------------//
let genericMap = {hasOwnProperty: true};
console.log(Object.prototype.hasOwnProperty.call(genericMap, 'hasOwnProperty'));