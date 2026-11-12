import { part1 } from './angular-1.mjs';
import { part2 } from './angular-2.mjs';
import { part3 } from './angular-3.mjs';
import { part4 } from './angular-4.mjs';
import { angularPractical } from './practical-angular.mjs';
import { reactPractical } from './practical-react.mjs';
import { reactQuestions } from './react.mjs';
import { nodeQuestions } from './node.mjs';
import { pythonQuestions } from './python.mjs';
import { sqlQuestions } from './sql.mjs';
import { devops1 } from './devops-1.mjs';

// Each question can link to the course (and lesson) that teaches it. The category decides the link:
// { 'Category name': 'lesson-slug' } for a lesson, or '' to link to the course page. The link is only shown while the course or lesson is published.
const withLearn = (list, course, byCategory = {}) => list.map((q) => ({ ...q, learnCourse: course, learnLesson: byCategory[q.category] || '' }));

export const angularQuestions = withLearn([...part1, ...part2, ...part3, ...part4, ...angularPractical], 'angular-tutorial');
export const devopsQuestions = [...devops1];
export { reactQuestions, nodeQuestions, pythonQuestions, sqlQuestions };
export const allInterviewQuestions = [...angularQuestions, ...reactQuestions, ...nodeQuestions, ...pythonQuestions, ...sqlQuestions, ...devopsQuestions];
