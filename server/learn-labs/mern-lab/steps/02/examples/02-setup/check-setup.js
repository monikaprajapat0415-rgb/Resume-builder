// Lesson 2: check that your computer is ready.   Run:  node examples/02-setup/check-setup.js
import { execSync } from 'node:child_process';

const major = Number(process.versions.node.split('.')[0]);
const tools = [
  { name: 'Node.js', check: () => `v${process.versions.node}`, ok: () => major >= 20, help: 'Install the LTS version from nodejs.org' },
  { name: 'npm', check: () => execSync('npm -v').toString().trim(), ok: () => true, help: 'npm comes with Node.js' },
  { name: 'Git', check: () => execSync('git --version').toString().trim(), ok: () => true, help: 'Install Git from git-scm.com' },
];

let allGood = true;
for (const t of tools) {
  try {
    const version = t.check();
    const good = t.ok();
    if (!good) allGood = false;
    console.log(`${good ? 'OK     ' : 'UPGRADE'} ${t.name}: ${version}${good ? '' : '  -> ' + t.help}`);
  } catch {
    allGood = false;
    console.log(`MISSING ${t.name}  -> ${t.help}`);
  }
}
console.log(allGood ? '\nYou are ready for lesson 3.' : '\nFix the lines above, then run this again.');
