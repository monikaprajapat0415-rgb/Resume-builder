import { readFile, writeFile } from 'node:fs/promises';

// Keeps tasks in memory and, if you give it a file, saves after every change.
export function createStore(file) {
  let tasks = [];
  let nextId = 1;

  const ready = file
    ? readFile(file, 'utf8')
        .then((text) => {
          tasks = JSON.parse(text);
          nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
        })
        .catch((err) => {
          if (err.code !== 'ENOENT') throw err;   // no file yet is fine, anything else is not
        })
    : Promise.resolve();

  const save = () => (file ? writeFile(file, JSON.stringify(tasks, null, 2)) : Promise.resolve());

  return {
    async list() { await ready; return tasks; },
    async get(id) { await ready; return tasks.find((t) => t.id === id); },
    async create(data) {
      await ready;
      const task = { id: nextId++, title: data.title, done: false, createdAt: new Date().toISOString() };
      tasks.push(task);
      await save();
      return task;
    },
    async update(id, data) {
      await ready;
      const task = tasks.find((t) => t.id === id);
      if (!task) return undefined;
      Object.assign(task, data);
      await save();
      return task;
    },
    async remove(id) {
      await ready;
      const before = tasks.length;
      tasks = tasks.filter((t) => t.id !== id);
      if (tasks.length === before) return false;
      await save();
      return true;
    },
  };
}
