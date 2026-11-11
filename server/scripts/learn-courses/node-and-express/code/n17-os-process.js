import os from 'node:os';
import process from 'node:process';

console.log('Platform:', process.platform, '| Node:', process.version);
console.log('CPU cores:', os.cpus().length >= 1);
console.log('Total memory > 0:', os.totalmem() > 0);
console.log('Arguments after the script name:', process.argv.slice(2));
console.log('PORT from the environment:', process.env.PORT ?? '(not set)');

process.on('exit', (code) => console.log('Exiting with code', code));
process.exitCode = 0;
