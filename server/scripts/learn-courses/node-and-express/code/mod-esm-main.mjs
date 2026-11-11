import describe, { add, PI } from './mod-esm-math.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

console.log(add(2, 3), PI, describe());
console.log(typeof __dirname);                                  // not defined in ES modules
const here = path.dirname(fileURLToPath(import.meta.url));      // the ES module way to get the folder
console.log(path.basename(here) !== '', import.meta.url.startsWith('file://'));

// Top-level await works in ES modules
const value = await Promise.resolve('top-level await works');
console.log(value);

// Using a CommonJS file from an ES module
const require = createRequire(import.meta.url);
const cjs = require('./mod-cjs-math.cjs');
console.log(cjs.add(10, 5));

// A dynamic import() also works from both worlds
const again = await import('./mod-esm-math.mjs');
console.log(Object.keys(again));
