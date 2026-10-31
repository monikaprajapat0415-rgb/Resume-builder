import { withLearn } from './lib.mjs';
import { r1 } from './react-1.mjs';
import { r2 } from './react-2.mjs';
import { r3 } from './react-3.mjs';
import { reactPractical } from './practical-react.mjs';

const LESSONS = {
  'React basics': 'what-is-react-and-why-use-it',
  'React JSX, components and props': 'react-components-and-props-explained',
  'React state and events': 'react-usestate-hook-explained',
  'React hooks and effects': 'react-useeffect-hook-explained',
  'React refs, context and custom hooks': 'react-context-api-usecontext-explained',
  'React performance': 'react-performance-memo-usememo-usecallback',
  'React routing and forms': 'react-router-pages-links-navigation',
  'React data fetching and state libraries': 'tanstack-query-react-data-fetching',
  'React testing, accessibility and TypeScript': 'testing-react-vitest-testing-library',
  'React 19 and architecture': 'react-19-new-features-actions-use-optimistic',
  'React practical coding': '',
};
export const reactQuestions = withLearn([...r1, ...r2, ...r3, ...reactPractical], 'react-js-full-course', LESSONS);
