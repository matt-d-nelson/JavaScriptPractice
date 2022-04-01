//-----------------------Chapter Code-----------------------//
function parseExpression(program) {
    program = skipSpace(program); //removes whitespace at front of string
    let match, expr; //declare match and expr vars
    if (match = /^"([^"]*)"/.exec(program)) { //regex to detect a string
      expr = {type: "value", value: match[1]}; //construct datastructure based on value type
    } else if (match = /^\d+\b/.exec(program)) { //regex to detect a number
      expr = {type: "value", value: Number(match[0])};
    } else if (match = /^[^\s(),#"]+/.exec(program)) { //regex to detect a word
      expr = {type: "word", name: match[0]};
    } else {
      throw new SyntaxError("Unexpected syntax: " + program); //if program doesn't match any of the regexs, throw syntax error
    }
  
    return parseApply(expr, program.slice(match[0].length)); //separate the section of program that was matched by the regex and pass to parseApply
  }
  
  function skipSpace(string) { //function to skip a spaces in a string
    //let first = string.search(/\S/); //find the first group of characters in a string
    let skippable = string.match(/^(\s|#.*)*/);
    if (skippable == -1) return ""; //if search returns -1 there are no groups of characters
    return string.slice(skippable[0].length); //slices off the whitespace and comments (#) before a group of characters and returns that value
  }
  
  function parseApply(expr, program) { 
    program = skipSpace(program); //trims whitespace
    if (program[0] != "(") { //if the first character is not a (, this is not an application so the input data is returned
      return {expr: expr, rest: program};
    }
  
    program = skipSpace(program.slice(1)); //slices off the beginning (, trims whitespace
    expr = {type: "apply", operator: expr, args: []}; //create an object with the type "apply" and the operator expression and arguments
    while (program[0] != ")") { //loop until we reach the closing ) of the application
      let arg = parseExpression(program); //runs parseExpression on the first value and stores it in arg
      expr.args.push(arg.expr); //pushes the expression to the args array in the expr object
      program = skipSpace(arg.rest); //trims whitespace on the rest of the program
      if (program[0] == ",") { //if there is a comma 
        program = skipSpace(program.slice(1)); //slice the comma off, trim whitespace, store in program var
      } else if (program[0] != ")") { //if there isn't a comma or closing )
        throw new SyntaxError("Expected ',' or ')'"); //throw a syntax error
      }
    }
    return parseApply(expr, program.slice(1)); //incase there are nested parenthesis ((2)(2)), parseApply is called again
  }
  
  function parse(program) { //condensed higher level function to parse a program
    let {expr, rest} = parseExpression(program); //run parseExpression and store results in declared obj var
    if (skipSpace(rest).length > 0) { //trim whitespace, if there are any other characters in 'rest' after parsing the program
      throw new SyntaxError("Unexpected text after program"); //throw syntax error
    }
    return expr; //return expr object 
  }

  console.log(parse("+(a, 10)")); //output below
  //    operator: {type: "word", name: "+"},
  //    args: [{type: "word", name: "a"},
  //           {type: "value", value: 10}]}
  
  var specialForms = Object.create(null); //declare specialForms as an object with no inheritance //specialForms will hold functions like 'if' and 'while'
  
  function evaluate(expr, scope) { //function to run the syntax tree returned from parse function //takes syntax tree and a scope object that associates names with values (variables)
    if (expr.type == "value") { //if the expression type is 'value'
      return expr.value; //the value is returned (e.g. 100 in will return 100)
    } else if (expr.type == "word") { //if the expression type is 'word'
      if (expr.name in scope) { //if the name of the expression is in the scope object (if it is a var)
        return scope[expr.name]; //return the value of the expr name in the scope object (the value that the variable is bound to)
      } else {
        throw new ReferenceError( //or throw an error saying that the value is undefined
          `Undefined binding: ${expr.name}`);
      }
    } else if (expr.type == "apply") { //if the expression is an application 
      let {operator, args} = expr; //store operator and args objects in new bindings
      if (operator.type == "word" && //if the operator type is a word
          operator.name in specialForms) { //and the operator name is in the specialForms object (e.g. 'if','while',)
        return specialForms[operator.name](expr.args, scope); //return the result of running the specialForms.operator.name with the expression args and current scope
      } else { //if it is a word that is not in specialForms (not a built in function)
        let op = evaluate(operator, scope);  //evaluates the operator object with the current scope and stores the value in op
        if (typeof op == "function") { //if the op is a function
          return op(...args.map(arg => evaluate(arg, scope))); //run the op with each arg evaluated to thier bound value as defined in the given scope
        } else {
          throw new TypeError("Applying a non-function."); //else throw an error
        }
      }
    }
  }
  
  specialForms.if = (args, scope) => { //built in 'if' method used within the evaluate function
    if (args.length != 3) { //expects exactly 3 arguments
      throw new SyntaxError("Wrong number of args to if"); //throws error if not
    } else if (evaluate(args[0], scope) !== false) { //if the first evaluated argument is not false
      return evaluate(args[1], scope); //return the evaluated second argument
    } else { //if the first arg is false
      return evaluate(args[2], scope); //return the evaluated third argument
    }
  };
  
  specialForms.while = (args, scope) => { //built in 'while' method
    if (args.length != 2) { //expects exactly 2 args
      throw new SyntaxError("Wrong number of args to while"); //throws error if not
    }
    while (evaluate(args[0], scope) !== false) { //while the first argument is not evaluating to false
      evaluate(args[1], scope); //evaluate the second argument
    }
  
    // Since undefined does not exist in Egg, we return false,
    // for lack of a meaningful result.
    return false; 
  };
  
  specialForms.do = (args, scope) => { //built in 'do' method
    let value = false; //declare value as false
    for (let arg of args) { //for every arg in the args object
      value = evaluate(arg, scope); //evaluate the current arg with the current scope
    }
    return value; //return the last evaluated argument
  };
  
  specialForms.define = (args, scope) => { //built in 'define' method to declare variables
    if (args.length != 2 || args[0].type != "word") { //expects two arguments, the first being a word (the variable name)
      throw new SyntaxError("Incorrect use of define"); //throws error if not
    }
    let value = evaluate(args[1], scope); //declares value as the return of evaluating the second argument
    scope[args[0].name] = value; //stores the argument name bound to the value in the given scope
    return value; //obligatory return
  };
  
  var topScope = Object.create(null); //innitialize the global scope object
  
  topScope.true = true; //set the true name to true
  topScope.false = false; //false name to false
  
  for (let op of ["+", "-", "*", "/", "==", "<", ">"]) { //loop through the array of evaluators
    topScope[op] = Function("a, b", `return a ${op} b;`); //create a function for each one and store them in the global scope
  }
  
  topScope.print = value => { //method to print values to the console
    console.log(value); //just a wrapper for console.log
    return value;
  };
  
  function run(program) { //function to run the program 
    return evaluate(parse(program), Object.create(topScope)); //parses the program and evaluates it with the global scope
  }

  //example of running a program
  //'do' evaluates everything
  //'define' creates bindings in the global scope
  //'while' does the interior code until the condition is met
  //'print' prints the total after the while breaks
  run(
    `do(define(total, 0),
        define(count, 1),
        while(<(count, 11),
            do(define(total, +(total, count)),
                define(count, +(count, 1)))),
        print(total))
    `);
    //outputs 55
  




  specialForms.fun = (args, scope) => { //built in method to define functions
    if (!args.length) { //if there are no arguments
      throw new SyntaxError("Functions need a body"); //thow an error
    }
    let body = args[args.length - 1]; //set body to equal the last argument
    let params = args.slice(0, args.length - 1).map(expr => { //slice off the functions body and create an array of the arguments to store in params
      if (expr.type != "word") { //expects argument names to be words
        throw new SyntaxError("Parameter names must be words"); //thow error if not
      }
      return expr.name; //load the array with the names 
    });
  
    return function() { //return the following constructed function
      if (arguments.length != params.length) { //if the supplied argument count is not what was defined
        throw new TypeError("Wrong number of arguments"); //thow an error
      }
      let localScope = Object.create(scope); //create a new local scope for the function (includes the global scope)
      for (let i = 0; i < arguments.length; i++) { //loop through the arguments
        localScope[params[i]] = arguments[i]; //add them to the local scope
      }
      return evaluate(body, localScope); //evauluate the function body with the arguments in the local scope
    };
  };

//-----------------------Arrays-----------------------//
topScope.array = function(...values) {
    return values;
}

topScope.size = function(array) {
    return array.length;
}

topScope.element = function(array, n) {
    return array[n];
}

//-----------------------Closure-----------------------//
//change made to skipSpace to ignore text after a #

//-----------------------Fixing Scope-----------------------//
specialForms.set = (args, env) => {
    if (args.length != 2 || args[0].type != "word") { //expects two arguments, the first being a word
      throw new SyntaxError("Bad use of set"); //throw error if not
    }
    let varName = args[0].name; //store the var name in varName
    let value = evaluate(args[1], env); //store the var value in value
  
    for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) { //set scope to equal the current scope(env) //exits loop if scope is null (we have reached the topScope) //set scope to equal the prototype of the current scope (the next most global scope)
      if (Object.prototype.hasOwnProperty.call(scope, varName)) { //if the current scope has the var
        scope[varName] = value; //set that var to equal the input value
        return value; //obligatory return
      }
    }
    throw new ReferenceError(`Setting undefined variable ${varName}`); //if var isn't found after looping through the whole scope, throw a referenceError
  };

  run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`);
