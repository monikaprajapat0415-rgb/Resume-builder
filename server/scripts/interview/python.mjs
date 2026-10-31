import { withLearn } from './lib.mjs';
import { p1 } from './py-1.mjs';
import { p2 } from './py-2.mjs';

const LESSONS = {
  'Python basics': 'what-is-python-install-and-first-program',
  'Python data types and strings': 'variables-numbers-strings-and-input',
  'Python control flow and functions': 'functions-in-python',
  'Python lists, dictionaries and sets': 'dictionaries-tuples-and-sets',
  'Python classes and OOP': 'classes-and-objects-in-python',
  'Python errors and files': 'handling-errors-with-try-except',
  'Python modules, packages and environments': 'modules-pip-and-virtual-environments',
  'Python advanced features': 'useful-python-standard-library',
  'Python data, testing and performance': 'analyse-a-csv-file-with-python',
};
export const pythonQuestions = withLearn([...p1, ...p2], 'python-for-beginners-course', LESSONS);
