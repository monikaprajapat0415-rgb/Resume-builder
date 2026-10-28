import price, { add, TAX } from './math.js';
import os from 'node:os';
console.log(add(2, 3), TAX, price(100));
console.log(typeof os.cpus().length);
