const { add, PI } = require('./mod-cjs-math.cjs');
const path = require('node:path');

console.log(add(2, 3), PI);
console.log(typeof __dirname, path.basename(__filename));      // __dirname and __filename exist in CommonJS
console.log(typeof module, typeof exports);
