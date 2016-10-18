console.log('es-2015 - functions');

'use strict'

let inc = x => x + 1;
console.log(inc(1)); // output: 2

let inc_analog = function(x) { return x + 1; }
console.log(inc_analog(1)); // output: 2

//-----------

// If multiple arguments, you need to wrap them in brackets

let sum = (a, b) => a + b;
console.log(sum(1, 2));

//-----------



