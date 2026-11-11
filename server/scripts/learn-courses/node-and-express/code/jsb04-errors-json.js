// Error handling and JSON
function parseAge(text) {
  const age = Number(text);
  if (!Number.isInteger(age) || age < 0) throw new Error(`"${text}" is not a valid age`);
  return age;
}

try {
  console.log(parseAge('29'));
  console.log(parseAge('abc'));        // this throws, so the next line never runs
  console.log('not reached');
} catch (error) {
  console.log('Caught:', error.message);
} finally {
  console.log('finally always runs');
}

// A custom error type
class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; }
}
try {
  throw new ValidationError('Email is required', 'email');
} catch (error) {
  console.log(error.name, error.field, error instanceof ValidationError);
}

// Errors in async code need await inside try/catch
async function load() { throw new Error('network down'); }
try { await load(); } catch (error) { console.log('Async caught:', error.message); }

// JSON: text <-> objects
const user = { name: 'Asha', skills: ['js', 'sql'], joined: new Date('2026-01-15T00:00:00Z'), note: undefined, greet() {} };
const text = JSON.stringify(user);
console.log(text);                                    // undefined and functions are dropped, the date becomes text
console.log(JSON.stringify({ a: 1, b: [2, 3] }, null, 2));
console.log(JSON.parse('{"ok":true,"count":3}').count);
try { JSON.parse('{bad json}'); } catch (error) { console.log('Bad JSON:', error.name); }
