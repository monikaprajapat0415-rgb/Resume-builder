// Variables, data types and operators
const course = 'Node.js';          // const: the name cannot be given a new value
let students = 120;                // let: the value can change
students = students + 5;

const price = 499.5;               // number (whole and decimal numbers are the same type)
const isOpen = true;               // boolean
const nothing = null;              // "empty on purpose"
let notSet;                        // undefined: no value yet
const big = 9007199254740993n;     // bigint, for very large whole numbers

console.log(course, students, price, isOpen, nothing, notSet);
console.log(typeof course, typeof price, typeof isOpen, typeof nothing, typeof notSet, typeof big);

// Operators
console.log(7 + 3, 7 - 3, 7 * 3, 7 / 2, 7 % 2, 2 ** 5);
console.log('5' + 3, '5' - 3);                 // + joins text, - converts to numbers
console.log(5 == '5', 5 === '5');              // loose and strict equality
console.log(0.1 + 0.2 === 0.3);                // decimals are stored approximately
console.log(Math.round((0.1 + 0.2) * 100) / 100 === 0.3);

// Truthy and falsy: values that count as false in a condition
const values = [0, '', null, undefined, NaN, 'hello', 42, [], {}];
console.log(values.map((v) => Boolean(v)));

// Logical operators and default values
const nickname = '' ;
console.log(nickname || 'Guest', nickname ?? 'Guest');   // || treats '' as false, ?? only null/undefined
const user = { profile: null };
console.log(user.profile?.city);                          // ?. stops safely instead of crashing

// Template strings
console.log(`${course} has ${students} students`);
