import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('dist', { recursive: true });
writeFileSync('dist/build-info.txt', 'built ok\n');
console.log('build finished');
