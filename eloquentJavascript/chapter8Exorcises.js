//----------------------------------Primitive Multiply----------------------------------//

class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(num1, num2) {
    let randPercent = Math.floor(Math.random()*100);
    if (randPercent <= 20) {
        return num1 * num2;
    } else {
        throw new MultiplicatorUnitFailure("System Failure!");
    }
}

function tryAndTryAgain(num1, num2) {
    for (;;) {
        try {
            let product = primitiveMultiply(num1,num2);
            console.log("Product of numbers is:", product);
            break;
        } catch (e) {
            if (e instanceof MultiplicatorUnitFailure) {
                console.log('System Failure, try again');
            } else {
                throw e;
            }
        }
    }
}

tryAndTryAgain(2,3);

//----------------------------------The Locked Box----------------------------------//

const box = {
    locked: true,
    unlock() { this.locked = false; },
    lock() { this.locked = true;  },
    _content: [],
    get content() {
      if (this.locked) throw new Error("Locked!");
      return this._content;
    }
  };
  
  function withBoxUnlocked(body) {
    // Your code here.
    let isLocked = box.locked;
    try {
        box.unlock();
        body();
    } finally {
        if (isLocked) {
            box.lock();
        }
    }
  }
  
  withBoxUnlocked(function() {
    box.content.push("gold piece");
  });

  console.log(box._content);
  
  try {
    withBoxUnlocked(function() {
      throw new Error("Pirates on the horizon! Abort!");
    });
  } catch (e) {
    console.log("Error raised: " + e);
  }

  console.log(box.locked);
  box.unlock();
  withBoxUnlocked( function() {
    box.content.push("gold piece");
  });
  console.log(box._content);
  console.log(box.locked);
