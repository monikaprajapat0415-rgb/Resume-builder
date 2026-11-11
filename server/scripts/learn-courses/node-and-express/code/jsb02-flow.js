// Conditions and loops
function grade(score) {
  if (score >= 90) return 'A';
  else if (score >= 75) return 'B';
  else if (score >= 50) return 'C';
  return 'Fail';
}
console.log(grade(95), grade(80), grade(60), grade(20));

function dayType(day) {
  switch (day) {
    case 'Sat':
    case 'Sun':
      return 'weekend';
    default:
      return 'weekday';
  }
}
console.log(dayType('Sun'), dayType('Mon'));

const age = 20;
console.log(age >= 18 ? 'adult' : 'minor');          // the ternary operator

// for loop
let total = 0;
for (let i = 1; i <= 5; i++) total += i;
console.log('Sum 1..5 =', total);

// while loop and break
let n = 1;
while (true) {
  n *= 2;
  if (n > 100) break;
}
console.log('First power of 2 above 100:', n);

// for...of for arrays, for...in for object keys
const tools = ['node', 'express', 'mongo'];
for (const tool of tools) console.log('tool:', tool);
const person = { name: 'Asha', city: 'Pune' };
for (const key in person) console.log(key, '=', person[key]);

// continue skips one round
for (let i = 1; i <= 5; i++) {
  if (i % 2 === 0) continue;
  console.log('odd', i);
}
