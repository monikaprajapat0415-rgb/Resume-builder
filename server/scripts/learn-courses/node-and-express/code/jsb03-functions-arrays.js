// Functions, arrays, objects and array methods
function add(a, b = 0) { return a + b; }            // default value
const multiply = (a, b) => a * b;                    // arrow function
const square = (x) => x * x;                         // one expression: no braces needed
console.log(add(2, 3), add(2), multiply(4, 5), square(6));

const orders = [
  { id: 1, item: 'Keyboard', price: 1500, paid: true },
  { id: 2, item: 'Mouse', price: 500, paid: false },
  { id: 3, item: 'Monitor', price: 9000, paid: true },
  { id: 4, item: 'Cable', price: 200, paid: true },
];

console.log(orders.map((o) => o.item));                               // new array of items
console.log(orders.filter((o) => o.paid).length);                     // paid orders
console.log(orders.find((o) => o.price > 5000)?.item);                // first match
console.log(orders.some((o) => !o.paid), orders.every((o) => o.price > 100));
console.log(orders.reduce((sum, o) => sum + o.price, 0));             // total of all prices
console.log([...orders].sort((a, b) => b.price - a.price).map((o) => o.item));   // copy, then sort
console.log(orders.map((o) => o.price).includes(500), orders.findIndex((o) => o.id === 3));

// Objects
const product = { name: 'Pen', price: 10 };
product.stock = 50;                                   // add a property
delete product.price;                                 // remove one
console.log(product, Object.keys(product), Object.entries(product));
console.log('stock' in product, product.price);

// Arrays: push, pop, slice, splice
const list = ['a', 'b', 'c'];
list.push('d');
console.log(list.pop(), list.slice(1, 3), list);
