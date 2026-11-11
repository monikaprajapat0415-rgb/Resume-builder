// JavaScript you need before Node: destructuring, spread, closures, higher-order functions, promises.
const user = { name: 'Asha', age: 29, city: 'Pune', skills: ['js', 'sql'] };

// Destructuring pulls values out by name or position.
const { name, city } = user;
const [first, ...others] = user.skills;
console.log(name, city, first, others);

// Spread copies; rest collects.
const older = { ...user, age: user.age + 1 };
const sum = (...numbers) => numbers.reduce((total, n) => total + n, 0);
console.log(older.age, user.age, sum(1, 2, 3));

// A closure remembers the variables around it.
function counter() {
  let count = 0;
  return () => ++count;
}
const next = counter();
next();
console.log('count', next());

// A higher-order function takes or returns a function.
const double = (n) => n * 2;
const numbers = [1, 2, 3, 4, 5, 6];
const result = numbers.filter((n) => n % 2 === 0).map(double);
console.log(result);

// Callbacks, then the same idea with promises and async/await.
const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function main() {
  try {
    const [a, b] = await Promise.all([wait(20, 'A'), wait(10, 'B')]);
    console.log(a, b);
    await Promise.reject(new Error('Something failed'));
  } catch (error) {
    console.log('Caught:', error.message);
  }
}
main();
