// Lesson 7: Node.js building blocks.   Run:  node examples/07-node/modules-and-files.js
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { EventEmitter } from 'node:events';
import { fileURLToPath } from 'node:url';

// path: build file paths that work on Windows, macOS and Linux
const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(os.tmpdir(), 'job-tracker-demo.json');
console.log('this file lives in', path.basename(here));

// fs: read and write files (promise version, so we can await it)
await fs.writeFile(file, JSON.stringify([{ company: 'Acme', role: 'Clerk' }], null, 2));
const jobs = JSON.parse(await fs.readFile(file, 'utf8'));
console.log('read back:', jobs);
await fs.rm(file);

// events: one part of a program announces something, another part reacts
const bus = new EventEmitter();
bus.on('job:added', (job) => console.log('send a confirmation for', job.company));
bus.emit('job:added', { company: 'Northwind' });

// process: information about the running program
console.log('Node', process.version, 'on', process.platform);
console.log('PORT from the environment:', process.env.PORT ?? '(not set)');
console.log('arguments you passed:', process.argv.slice(2));
