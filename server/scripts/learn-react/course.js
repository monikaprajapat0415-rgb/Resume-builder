import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';
import { lessons as p4 } from './part4.js';
import { lessons as p5 } from './part5.js';
import { lessons as p6 } from './part6.js';
import { lessons as p7 } from './part7.js';
import { extras } from './extras.js';
import { extras2 } from './extras2.js';
import { proseWords } from './helpers.js';

export const course = {
  title: 'React.js Full Course: Beginner to Advanced',
  slug: 'react-js-full-course',
  summary: 'Learn React from zero in 30 simple lessons: components, hooks, routing, data, testing, TypeScript and deployment. Easy words and code in every lesson.',
  description: 'Free React.js course for beginners. 30 lessons in simple English: JSX, props, state, hooks, forms, React Router, data fetching, performance, testing and deploy.',
  level: 'All levels',
  topic: 'Frontend',
  badge: 'RJS',
  tags: ['react', 'javascript', 'hooks', 'frontend', 'vite'],
  order: 31,
  published: true,
  metaTitle: 'React.js Course: Beginner to Advanced (Free)',
  keywords: 'react js course, learn react, react tutorial for beginners, react hooks tutorial, react course free, react beginner to advanced',
};

const META = {
  "what-is-react-and-why-use-it": "What Is React? Explained for Beginners",
  "set-up-react-with-vite-first-project": "Set Up React with Vite: First Project",
  "jsx-explained-simply": "JSX Explained Simply for Beginners",
  "react-components-and-props-explained": "React Components and Props Explained",
  "react-usestate-hook-explained": "React useState Hook Explained",
  "handling-events-in-react": "Handling Events in React: onClick, Forms",
  "conditional-rendering-in-react": "React Conditional Rendering Explained",
  "react-lists-and-keys-explained": "React Lists and Keys: map() Explained",
  "react-forms-and-controlled-inputs": "React Forms and Controlled Inputs",
  "styling-react-apps-css-modules-tailwind": "Styling React: CSS Modules, Tailwind",
  "react-useeffect-hook-explained": "React useEffect Explained Simply",
  "fetch-data-in-react-loading-error-states": "Fetch Data in React: Loading and Errors",
  "react-useref-hook-dom-access": "React useRef Hook Explained",
  "lifting-state-up-and-component-composition": "Lifting State Up and Composition in React",
  "react-usereducer-hook-explained": "React useReducer Explained with Examples",
  "react-context-api-usecontext-explained": "React Context API and useContext",
  "react-custom-hooks-reuse-logic": "React Custom Hooks: Reuse Your Logic",
  "react-router-pages-links-navigation": "React Router Tutorial: Pages and Links",
  "react-forms-validation-formdata-react-hook-form": "React Form Validation and FormData",
  "how-react-renders-rules-of-react-strictmode": "How React Renders: Re-renders, StrictMode",
  "react-performance-memo-usememo-usecallback": "React Performance: memo, useMemo",
  "react-lazy-suspense-code-splitting": "React lazy, Suspense and Code Splitting",
  "react-error-boundaries-portals-modals": "React Error Boundaries and Portals",
  "react-state-management-redux-toolkit-zustand": "Redux Toolkit vs Zustand for Beginners",
  "tanstack-query-react-data-fetching": "TanStack Query (React Query) Tutorial",
  "testing-react-vitest-testing-library": "Test React with Vitest and Testing Library",
  "react-accessibility-a11y-guide": "React Accessibility (a11y) Guide",
  "react-19-new-features-actions-use-optimistic": "React 19 New Features Explained",
  "react-with-typescript-beginners-guide": "React with TypeScript for Beginners",
  "react-project-structure-best-practices-deploy-next-steps": "React Best Practices, Deploy, Next Steps"
};
const DESC = {
  "what-is-react-and-why-use-it": "Learn what React is in easy words, why people use it, and the three big ideas: components, state and the virtual DOM.",
  "set-up-react-with-vite-first-project": "Install the tools, create your first React project with Vite, and learn what each file does. Run it in your browser.",
  "jsx-explained-simply": "Learn JSX in simple steps: the rules, curly braces, className and styles, and the small mistakes every beginner makes.",
  "react-components-and-props-explained": "Build components and send data to them with props. Learn defaults, children, and how to split a page into small parts.",
  "react-usestate-hook-explained": "Learn state with useState using a counter, a toggle and a text box, and why you must never change state directly.",
  "handling-events-in-react": "React to clicks, typing and form submit. Learn the event object, how to pass values, and the most common event mistakes.",
  "conditional-rendering-in-react": "Show different content with if, ternary, && and early return. Build loading, empty and error screens the easy way.",
  "react-lists-and-keys-explained": "Show lists with map, learn why keys matter, and filter, sort, add and remove items without breaking your state.",
  "react-forms-and-controlled-inputs": "Build forms the React way. Use controlled inputs, checkboxes, selects, simple checks and helpful error messages.",
  "styling-react-apps-css-modules-tailwind": "Compare plain CSS, CSS Modules, inline styles and Tailwind. Make pages that fit phones and support dark mode.",
  "react-useeffect-hook-explained": "Understand useEffect in plain words: side effects, the dependency array, cleanup, and when you do not need it.",
  "fetch-data-in-react-loading-error-states": "Load data from an API safely. Show loading and error messages, cancel old requests and send data with POST.",
  "react-useref-hook-dom-access": "Learn useRef: focus an input, scroll to an element, keep a timer id, and know when to use a ref and not state.",
  "lifting-state-up-and-component-composition": "Learn where state should live, how two components share data through a parent, and how children avoid prop drilling.",
  "react-usereducer-hook-explained": "Learn useReducer with a to-do list. Understand actions, reducers and when to choose it over useState.",
  "react-context-api-usecontext-explained": "Share data like the theme or user without passing props. Learn createContext, Provider and useContext with examples.",
  "react-custom-hooks-reuse-logic": "Write your own hooks: useToggle, useLocalStorage, useFetch and useDebounce. Reuse logic in many components.",
  "react-router-pages-links-navigation": "Build a multi-page app with React Router: routes, links, URL params, layouts, 404 page and protected routes.",
  "react-forms-validation-formdata-react-hook-form": "Go further with forms: FormData, clean validation, helpful errors, and when React Hook Form is worth using.",
  "how-react-renders-rules-of-react-strictmode": "See what happens when React draws a component. Learn pure components, re-renders, batching and StrictMode.",
  "react-performance-memo-usememo-usecallback": "Find slow parts and fix them with memo, useMemo, useCallback and debounce, without adding code you do not need.",
  "react-lazy-suspense-code-splitting": "Make the first load faster by loading code only when needed. Learn lazy, Suspense and route splitting.",
  "react-error-boundaries-portals-modals": "Stop one bug from crashing the whole page with error boundaries, and build safe modals and tooltips with portals.",
  "react-state-management-redux-toolkit-zustand": "Learn when you need a state library. See the same cart built with Redux Toolkit and with Zustand.",
  "tanstack-query-react-data-fetching": "Load, cache and update server data with TanStack Query. Learn useQuery, query keys, mutations and refetching.",
  "testing-react-vitest-testing-library": "Write tests that act like a user with Vitest and React Testing Library. Test forms, data loading and hooks.",
  "react-accessibility-a11y-guide": "Build apps everyone can use: real HTML, labels, keyboard use, focus, colour contrast and how to test it.",
  "react-19-new-features-actions-use-optimistic": "The main React 19 tools in simple words: form actions, useActionState, useOptimistic, use and ref as a prop.",
  "react-with-typescript-beginners-guide": "Learn TypeScript for React: type props, state, events, refs and API data, and understand the errors it shows.",
  "react-project-structure-best-practices-deploy-next-steps": "Organise a real project, follow clear best practices, deploy your app and plan what to learn next, such as Next.js."
};

const withExtras = (l) => {
  const add = [...(extras[l.slug] || []), ...(extras2[l.slug] || [])];
  if (!add || !add.length) return l;
  const i = l.content.findIndex((b) => b.type === 'heading' && b.text === 'Your task');
  const content = i < 0 ? [...l.content, ...add] : [...l.content.slice(0, i), ...add, ...l.content.slice(i)];
  return { ...l, content };
};

const minutes = (l) => {
  let code = 0;
  for (const b of l.content) if (b.type === 'code') code += b.text.split('\n').length;
  return Math.max(5, Math.round(proseWords(l) / 200 + code / 25));
};

export const lessons = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7].map(withExtras).map((l, i) => ({
  ...l, metaTitle: META[l.slug], description: DESC[l.slug], readTime: `${minutes(l)} min read`,
}));
