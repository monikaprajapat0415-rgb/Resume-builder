// Checks the schemas without needing a database: validation and index definitions run in memory.
import { Post, User } from './db24-models.js';

const bad = new Post({ title: '', body: 'x', tags: [' JS ', 'Node'] });
const problems = await bad.validate().catch((error) => error);
console.log('Errors on:', Object.keys(problems.errors).sort());     // title and author are missing
console.log('Tags cleaned:', bad.tags);
console.log('Default status:', bad.status);

const user = new User({ name: 'A', email: 'ASHA@Example.com' });
const userProblems = await user.validate().catch((error) => error);
console.log('User errors on:', Object.keys(userProblems.errors));
console.log('Email lowercased:', user.email);

console.log('Post indexes:', Post.schema.indexes().map(([fields]) => Object.keys(fields).join('+')));
