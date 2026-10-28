import { readFile, writeFile } from 'node:fs/promises';

// A tiny store that keeps everything in memory and, if you give it a file, saves after each change.
export function createStore(file) {
  let tasks = [];
  let nextId = 1;
  let ready = Promise.resolve();

  if (file) {
    ready = readFile(file, 'utf8')
      .then((text) => {
        tasks = JSON.parse(text);
        nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      })
      .catch((err) => {
        if (err.code !== 'ENOENT') throw err;      // no file yet is fine, anything else is not
      });
  }

  const save = () => (file ? writeFile(file, JSON.stringify(tasks, null, 2)) : Promise.resolve());

  return {
    async list(ownerId) { await ready; return tasks.filter((t) => t.ownerId === ownerId); },
    async get(ownerId, id) { await ready; return tasks.find((t) => t.id === id && t.ownerId === ownerId); },
    async create(ownerId, data) {
      await ready;
      const task = { id: nextId++, ownerId, title: data.title, done: false, createdAt: new Date().toISOString() };
      tasks.push(task);
      await save();
      return task;
    },
    async update(ownerId, id, data) {
      await ready;
      const task = tasks.find((t) => t.id === id && t.ownerId === ownerId);
      if (!task) return undefined;
      Object.assign(task, data);
      await save();
      return task;
    },
    async remove(ownerId, id) {
      await ready;
      const before = tasks.length;
      tasks = tasks.filter((t) => !(t.id === id && t.ownerId === ownerId));
      if (tasks.length === before) return false;
      await save();
      return true;
    },
  };
}
