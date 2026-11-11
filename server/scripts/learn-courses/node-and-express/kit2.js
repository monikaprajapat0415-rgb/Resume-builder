// Shared bits for the lessons added in Nov 2026.
import { N, O, C } from '../kit.js';

export const RAN = N("The code in this lesson was run with Node.js 22 and its tests passed when the lesson was written. Library versions move, so run npm install and the tests on your own machine, and fix any small differences you see.");
export const PARTLY = (what) => N(`The code in this lesson was syntax-checked, but ${what} needs a service that was not available when the lesson was written, so that part was not run. The parts that do not need the service were run and their tests passed. Check the current documentation of the library before you rely on a detail.`);

// Steps to try a lesson's code in a fresh folder.
export const SETUP = (packages = '', extra = []) => O(
  'Make a folder and open it in a terminal. Run `npm init -y`, then open `package.json` and add `"type": "module"` so that `import` works.',
  ...(packages ? [`Install what the lesson needs: \`npm install ${packages}\`.`] : []),
  ...extra,
);

export const run = (cmd) => C('bash', cmd);
