// Lesson 3: the modern JavaScript used in every MERN app.   Run:  node examples/03-javascript/es6-tour.js

// const and let (never var)
const company = 'Acme Logistics';
let attempts = 1;
attempts += 1;

// template strings
console.log(`Applied to ${company}, attempt ${attempts}`);

// objects, destructuring and shorthand
const job = { id: 7, role: 'Dispatcher', salary: { min: 18000, max: 24000 }, tags: ['night shift', 'local'] };
const { role, salary: { max }, tags: [firstTag] } = job;
console.log(role, max, firstTag);

// spread: copy and change without touching the original (React state depends on this)
const updated = { ...job, status: 'interview' };
console.log(job.status, updated.status); // undefined interview
const moreTags = [...job.tags, 'full time'];
console.log(moreTags);

// arrow functions and array methods
const jobs = [
  { id: 1, role: 'Teller', status: 'applied' },
  { id: 2, role: 'Dispatcher', status: 'interview' },
  { id: 3, role: 'Driver', status: 'applied' },
];
const applied = jobs.filter((j) => j.status === 'applied');
const roles = jobs.map((j) => j.role);
const firstInterview = jobs.find((j) => j.status === 'interview');
const counts = jobs.reduce((acc, j) => ({ ...acc, [j.status]: (acc[j.status] || 0) + 1 }), {});
console.log(applied.length, roles, firstInterview.role, counts);

// optional chaining and default values
const maybe = { company: { name: 'Northwind' } };
console.log(maybe.company?.name ?? 'unknown', maybe.owner?.name ?? 'no owner');

// ES modules: export in one file, import in another (see helpers.js)
import { formatSalary } from './helpers.js';
console.log(formatSalary(job.salary));
