import { execFile, fork } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);

if (process.argv[2] === 'child') {
  // This branch runs in the child process.
  process.on('message', (message) => {
    process.send({ doubled: message.value * 2 });
    process.exit(0);
  });
} else {
  // 1. Run another program and read its output. Arguments are an array, never one joined string.
  const { stdout } = await execFileAsync('node', ['-e', 'console.log(6 * 7)']);
  console.log('Child program printed:', stdout.trim());

  // 2. Fork a Node process and talk to it with messages.
  const child = fork(fileURLToPath(import.meta.url), ['child']);
  child.on('message', (reply) => console.log('Forked child replied:', reply));
  child.send({ value: 21 });
}
