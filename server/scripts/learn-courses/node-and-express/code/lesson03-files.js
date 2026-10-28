import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const file = path.join(import.meta.dirname, 'tasks.json');
const tasks = [{ id: 1, title: 'Learn Node', done: false }];
await writeFile(file, JSON.stringify(tasks, null, 2));
const text = await readFile(file, 'utf8');
const back = JSON.parse(text);
console.log(back.length, back[0].title);
try {
  await readFile(path.join(import.meta.dirname, 'missing.json'), 'utf8');
} catch (err) {
  console.log(err.code, err.message.slice(0,40));
}
