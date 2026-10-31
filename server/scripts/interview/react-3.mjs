// React interview questions, part 3: routing and forms, data and state libraries, testing/a11y/TypeScript, React 19 and architecture.
import { mk } from './lib.mjs';
const A = mk('react');
const R = 'React routing and forms', D = 'React data fetching and state libraries', T = 'React testing, accessibility and TypeScript', N = 'React 19 and architecture';

export const r3 = [
  A(R, 'fresher', 'What is React Router and what are its basic parts?',
`React Router is the most widely used routing library for React. It maps URLs to components. Basics: a router (createBrowserRouter with RouterProvider, or BrowserRouter), route definitions with a path and element, Link or NavLink for navigation without a page reload, and Outlet for nested routes.

Hooks such as useNavigate, useParams and useSearchParams read and change the URL.`),
  A(R, 'fresher', 'How do you read a URL parameter in React Router?',
`Define the route with a parameter, path="/users/:id", and read it in the component with const { id } = useParams(). The value is always a string, so convert it if you need a number.

For query strings like ?page=2, use useSearchParams.`),
  A(R, 'fresher', 'What is the difference between Link and an anchor tag?',
`A normal <a href> triggers a full page load. Link from React Router changes the URL and renders the new route on the client without reloading, which keeps app state and feels faster. NavLink adds an active style when its route matches.

Use a normal anchor for external sites.`),
  A(R, 'both', 'How do protected routes work?',
`Wrap protected pages in a component that checks whether the user is signed in and, if not, redirects with <Navigate to="/login" replace />. Often it is a layout route that renders <Outlet /> when allowed.

Remember that this only hides the UI. The server must still check permissions on every API request.`),
  A(R, 'both', 'What are nested routes and layout routes?',
`Nested routes put child routes inside a parent route, and the parent renders <Outlet /> where the child appears. A layout route has no path of its own and just wraps children with shared UI such as a navbar or sidebar.

It avoids repeating layout code and lets the layout stay mounted while the page changes.`),
  A(R, 'both', 'Why keep filters and pagination in the URL?',
`URL state makes the page shareable, bookmarkable, and compatible with the back button and refresh. Use useSearchParams to read and set values like ?q=react&page=2, and use those values as the source of truth instead of duplicating them in useState.`),
  A(R, 'fresher', 'What is a controlled form in React?',
`The input value comes from state and an onChange handler updates the state: <input value={name} onChange={(e) => setName(e.target.value)} />. React is the single source of truth, so you can validate while typing or disable a button until the form is valid.

On submit, call e.preventDefault() and use the state.`),
  A(R, 'fresher', 'How do you handle multiple inputs in one form?',
`Keep one state object and give each input a name attribute, then use one handler: setForm({ ...form, [e.target.name]: e.target.value }). Alternatively, use uncontrolled inputs and read everything with new FormData(e.target) on submit.`),
  A(R, 'both', 'When would you use React Hook Form or a similar library?',
`For larger forms with many fields and validation rules. React Hook Form uses mostly uncontrolled inputs, so typing does not re-render the whole form, and it integrates with schema validators like Zod. It reduces boilerplate for errors, touched state, and submit handling.

For a two-field form, plain state is simpler.`),
  A(R, 'both', 'How do you validate a form properly?',
`Validate on the client for fast feedback (required fields, formats, lengths), and always validate again on the server because client checks can be bypassed. Show errors next to the field, link them with aria-describedby, and do not rely on colour alone.

Schema libraries such as Zod let you share rules between client and server.`),
  A(R, 'experienced', 'What do React 19 form Actions change?',
`React 19 lets you pass a function to a form's action prop, and React handles the submit, pending state and form reset. Hooks such as useActionState, useFormStatus and useOptimistic help show results, pending state and instant optimistic updates.

Frameworks that run server code add Server Actions on top. Check the docs for the exact APIs in your setup.`),
  A(D, 'fresher', 'How do you show loading and error states when fetching data?',
`Keep state for data, loading and error. Set loading to true before the request, catch failures to set error, and set loading to false in finally. Render a spinner when loading, a message when there is an error, and the data otherwise.

Do not forget to handle an empty result as its own state.`),
  A(D, 'both', 'What does TanStack Query (React Query) give you over useEffect and fetch?',
`It manages server state: caching, background refetching, deduplicating identical requests, retries, pagination, mutations with cache invalidation, and loading and error flags. You write useQuery({ queryKey, queryFn }) instead of handling effects and race conditions yourself.

It separates server data from UI state, which keeps components simpler.`),
  A(D, 'both', 'What is the difference between server state and client state?',
`Client state is owned by the browser: a modal being open, a form draft, a selected tab. Server state lives on a backend, can change without you knowing, and needs caching and syncing. Treating server data as plain client state leads to stale data and a lot of manual code.

Use a data-fetching library for server state and useState or a small store for client state.`),
  A(D, 'both', 'When do you need Redux, Zustand or another state library?',
`When many components across the app share state, update logic is complex, or you need dev tools and predictable updates. Redux Toolkit is a structured, popular choice for large apps. Zustand is a small, simple store. Context plus useReducer is fine for modest cases.

Do not add a library until props, lifting state and Context stop being enough.`),
  A(D, 'both', 'What is Redux Toolkit and why is it recommended over plain Redux?',
`Redux Toolkit (RTK) is the official, opinionated way to write Redux. configureStore sets up the store with good defaults, createSlice generates actions and reducers with less boilerplate (and lets you write "mutating" code safely through Immer), and RTK Query handles data fetching and caching.`),
  A(D, 'both', 'What is optimistic UI and how can you build it?',
`Optimistic UI updates the screen immediately as if the server request will succeed, then fixes it if it fails. For example, a like button turns on at once. With TanStack Query you update the cache in onMutate and roll back in onError. React 19 offers useOptimistic for the same idea.

Always handle the failure case so users see the true state.`),
  A(D, 'experienced', 'How do you handle authentication tokens in a React app securely?',
`Prefer HttpOnly, Secure, SameSite cookies set by the server, since JavaScript cannot read them, which reduces token theft through XSS. Storing tokens in localStorage is simple but exposed to XSS. Protect against XSS (escape output, use a content security policy), add CSRF protection when using cookies, and keep short-lived access tokens with refresh.

The server must enforce authorisation. The client only controls what is shown.`),
  A(D, 'experienced', 'How would you structure API calls in a large React app?',
`Create a small API layer (one module with a shared fetch or axios instance for base URL, headers, error handling and token refresh), then wrap calls in data hooks such as useUsers or useCreateOrder built on TanStack Query. Components use hooks and never build URLs themselves.

This gives one place to change auth, logging and error format, and makes testing with mocks easier.`),
  A(T, 'fresher', 'How do you test a React component?',
`The common stack is Vitest or Jest with React Testing Library. Render the component, find elements the way a user would (by role, label or text), simulate actions with user-event, and assert on what appears: expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument().

Test behaviour, not implementation details like internal state.`),
  A(T, 'both', 'Why does Testing Library prefer getByRole over test ids?',
`Querying by role and accessible name checks what real users and assistive technology see, so tests break when the UI becomes inaccessible, not just when the markup changes. Test ids are a fallback when no better query exists.`),
  A(T, 'both', 'How do you mock API calls in component tests?',
`Use Mock Service Worker (MSW) to intercept network requests at the network level, so components use real fetch code and you only fake the server. You can also mock a module with vi.mock or jest.mock. Reset handlers between tests.

Network-level mocking tests more of the real code path than mocking the fetch function itself.`),
  A(T, 'both', 'What is accessibility (a11y) in React and what are the basics?',
`Making the UI usable for everyone, including keyboard and screen reader users. Basics: use semantic elements (button, nav, label), keep everything reachable by keyboard with visible focus, give images alt text, connect labels to inputs, manage focus in modals, keep enough colour contrast, and use ARIA only when native HTML cannot do the job.

Tools: the eslint jsx-a11y plugin, axe, and manual keyboard testing.`),
  A(T, 'both', 'How do you use TypeScript with React components?',
`Type the props with an interface or type: function Card({ title, onSelect }: { title: string; onSelect: (id: number) => void }). Hooks infer types in most cases, and you add generics when needed: useState<User | null>(null). Event types such as React.ChangeEvent<HTMLInputElement> type handlers.

It catches wrong props and missing fields at build time.`),
  A(T, 'experienced', 'What makes a good test strategy for a React app?',
`A mix: many fast unit tests for logic and hooks, component tests with Testing Library for behaviour, a few end-to-end tests with Playwright or Cypress for critical flows (sign in, checkout), and type checking and linting as a base layer.

Avoid testing implementation details, keep tests independent, and run them in CI so regressions are caught before release.`),
  A(N, 'both', 'What are React Server Components, in simple terms?',
`Server Components render on the server and send their output to the browser without shipping their JavaScript, so they can read databases or files directly and keep the client bundle smaller. Client Components (marked with "use client") handle interactivity and state.

They need a framework or bundler that supports them, such as Next.js, so check your framework docs.`),
  A(N, 'both', 'What is the difference between client-side rendering, server-side rendering and static generation?',
`Client-side rendering sends a mostly empty HTML page and builds the UI in the browser, which is simple but slower to first content and weaker for SEO. Server-side rendering builds HTML on each request. Static generation builds HTML ahead of time at build time.

SSR and SSG give faster first paint and better SEO. Frameworks like Next.js support all of these.`),
  A(N, 'both', 'What are error boundaries and how do you use them?',
`An error boundary catches errors thrown while rendering its children and shows a fallback UI instead of crashing the whole app. It is a class component with getDerivedStateFromError and componentDidCatch, or you can use a library such as react-error-boundary.

It does not catch errors in event handlers or async code, so handle those with try/catch.`),
  A(N, 'both', 'What are portals and when do you use them?',
`createPortal renders children into a different DOM node, such as document.body, while keeping them in the same React tree for events and context. It is used for modals, tooltips and dropdowns that must escape overflow or z-index limits of a parent.`),
  A(N, 'both', 'What is new in React 19 that a developer should know?',
`Highlights include Actions for forms and async transitions, new hooks (useActionState, useOptimistic, and the use API for reading promises and context), ref as a regular prop, built-in support for rendering document metadata like title and meta tags, and improvements to Suspense and error reporting.

Details can change between minor versions, so confirm in the official React blog and docs.`),
  A(N, 'experienced', 'How would you structure folders and code in a large React project?',
`Group by feature rather than by file type: each feature folder holds its components, hooks, API calls and tests, with a shared folder for common UI and utilities. Keep components small, put data access in hooks, use absolute imports, and enforce boundaries with lint rules.

The exact layout matters less than staying consistent and keeping related code together.`),
  A(N, 'experienced', 'How do you decide between building a single-page app and using a framework like Next.js?',
`A client-only SPA suits dashboards and tools behind a login where SEO is not important. A framework is a better fit when you need good SEO, fast first load, server rendering, file-based routing, or server-side data access. Consider team experience, hosting needs and complexity.

Many teams start with Vite for simplicity and move to a framework when requirements demand it.`),
  A(N, 'experienced', 'What security issues should a React developer think about?',
`XSS is the main one: React escapes values in JSX by default, but dangerouslySetInnerHTML, unsafe URLs (javascript: links) and third-party scripts can reintroduce it, so sanitise HTML with a library such as DOMPurify. Also: never put secrets in client code (everything shipped is public), keep dependencies updated, use a content security policy, and rely on the server for authorisation.`),
  A(N, 'experienced', 'How do you deploy a React app to production?',
`Run the build (npm run build) to produce static files, then serve them from a CDN or web server such as nginx, with a fallback to index.html so client-side routes work on refresh. Use hashed filenames with long cache headers for assets, short caching for index.html, HTTPS, and environment variables that are fixed at build time (for Vite, VITE_ prefix).

Add monitoring for errors and a CI pipeline that tests before deploying.`),
];
