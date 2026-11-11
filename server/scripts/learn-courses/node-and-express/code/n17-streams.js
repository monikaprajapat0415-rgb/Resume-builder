import fs from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import os from 'node:os';
import path from 'node:path';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'streams-'));
const input = path.join(dir, 'in.txt');
const output = path.join(dir, 'out.txt');
fs.writeFileSync(input, 'hello\nstreams\nare\nuseful\n');

// A Transform changes each chunk as it passes through.
const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

// pipeline connects the streams and cleans up if one fails. Memory stays small for any file size.
await pipeline(fs.createReadStream(input), upper, fs.createWriteStream(output));
console.log(fs.readFileSync(output, 'utf8').trim().split('\n'));

// Buffers hold raw bytes.
const buffer = Buffer.from('Node', 'utf8');
console.log(buffer, buffer.length, buffer.toString('hex'), buffer.toString('base64'));
console.log(Buffer.concat([buffer, Buffer.from(' JS')]).toString());
fs.rmSync(dir, { recursive: true });
