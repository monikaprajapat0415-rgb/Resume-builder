import { P, H, L, O, N, C, task, check, lesson } from './helpers.js';

const S3 = 'Advanced React';

export const lessons = [
  // ---------------------------------------------------------------- 21
  lesson(S3, 'react-performance-memo-usememo-usecallback', 'React Performance: memo, useMemo, useCallback and When Not to Use Them', 'Learn how to find slow parts of a React app and fix them with memo, useMemo, useCallback, virtual lists and debounce, without adding needless code.', '', [
    P("Most React apps are fast enough with no special work. But sometimes a page feels slow: typing lags, a list stutters, or a click takes a moment. This lesson explains **why** that happens and how to fix it with a few simple tools. It also explains the most important rule: **measure first, then optimise**."),

    H("Step 1: find the real problem"),
    P("Do not add `memo` and `useMemo` everywhere “just in case”. They add code and need care, and often change nothing. Find the slow part first:"),
    L(
      "Open **React Developer Tools** and use the **Profiler** tab. Click record, do the slow action, stop, and look at which components rendered and how long each took.",
      "Test with **CPU throttling** in the browser tools (Performance tab), because your computer is faster than many visitors' phones.",
      "Look at the **Network** tab. Many slow pages are slow because of large images, large JavaScript files or slow requests, not because of React.",
    ),
    P("A common order of fixes, from most to least effective: send **less data and less code** first (smaller images, code splitting), then make the work **smaller** (show only what is visible), and only then **skip renders** with memo."),

    H("Why components render too much"),
    P("From the last lesson: when a component renders, its children render too, even if their props did not change. Usually that is cheap. But if a child is slow (a big chart or a long list), re-rendering it every time the parent changes is wasteful. For example, typing in a text box in the parent redraws the whole big list on every key press."),
    C('jsx', `function Page() {
  const [text, setText] = useState('');
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <BigList />     {/* renders again on every key press */}
    </div>
  );
}`),

    H("Fix 1: move state down"),
    P("The best and simplest fix needs no tools. Put the state in a smaller component that only contains the part that needs it:"),
    C('jsx', `function SearchBox() {
  const [text, setText] = useState('');
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}

function Page() {
  return (
    <div>
      <SearchBox />
      <BigList />     {/* no longer renders when typing */}
    </div>
  );
}`),
    P("Now typing only redraws `SearchBox`. Another version of this trick is to pass the slow part in as `children`, since children made by the parent above are not redrawn when the small component's state changes."),

    H("Fix 2: React.memo"),
    P("`memo` wraps a component so React **skips rendering it when its props are the same** as last time."),
    C('jsx', `import { memo } from 'react';

const BigList = memo(function BigList({ items }) {
  return (
    <ul>
      {items.map((item) => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
});`),
    P("React compares each prop with the old one using “is it the same value?”. For numbers and strings that is clear. For **objects, arrays and functions**, a new one is made on every render, so they are **never** the same as before, even if they look the same. That makes `memo` useless unless you keep those props steady. That is the job of the next two hooks."),

    H("Fix 3: useMemo for expensive work"),
    P("`useMemo` remembers the **result** of a calculation, and recalculates only when its dependencies change."),
    C('jsx', `function ProductList({ products, query }) {
  const visible = useMemo(() => {
    return products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [products, query]);

  return <ul>{visible.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}`),
    P("If another state in this component changes, `visible` is not recalculated, because `products` and `query` are the same. It is useful for really heavy work, such as filtering thousands of items, and for keeping an object or array **steady** so that a `memo` child does not redraw."),
    C('jsx', `// Keep an object steady for a memo child
const style = useMemo(() => ({ color: theme === 'dark' ? 'white' : 'black' }), [theme]);
return <MemoChild style={style} />;`),

    H("Fix 4: useCallback for steady functions"),
    P("`useCallback` is the same as `useMemo`, but for **functions**. It gives the same function again unless a dependency changes:"),
    C('jsx', `const MemoRow = memo(function Row({ item, onRemove }) {
  return <li>{item.name} <button onClick={() => onRemove(item.id)}>x</button></li>;
});

function List() {
  const [items, setItems] = useState(initialItems);

  const handleRemove = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return <ul>{items.map((item) => <MemoRow key={item.id} item={item} onRemove={handleRemove} />)}</ul>;
}`),
    P("Notice we used the function form of `setItems`, so the callback does not need `items` in its dependencies, and it stays the same forever. Without `useCallback`, `handleRemove` would be a new function every render, and `memo` on `MemoRow` would do nothing."),
    N("`useMemo` and `useCallback` on their own do not make your app faster. They only help when they keep a value steady for something that **compares** it: a `memo` component, another hook's dependency list, or an expensive calculation. Using them without a reason only adds code."),

    H("The React Compiler"),
    P("React now has a **compiler**, a build tool that adds this kind of memoisation automatically. When it is turned on in your project, you will need to write `useMemo`, `useCallback` and `memo` much less. It is still good to know what they do, because you will meet them in existing code. Check the official React docs to see how to enable the compiler in your tool, as the steps change."),

    H("Fix 5: show less (virtualise long lists)"),
    P("If a list has thousands of rows, even fast components are slow, because the browser has to make thousands of elements. The fix is to draw only the rows you can **see**, plus a few extra. This is called **virtualisation** or windowing. Libraries such as `react-window` and TanStack Virtual do it for you. For lists of a few hundred rows, you do not need it. Pagination (showing 20 at a time) is simpler and also good for users."),

    H("Fix 6: do not do work on every key press"),
    P("Searching or filtering on every key press can be heavy. Two helpers:"),
    L(
      "**Debounce:** wait until the person stops typing for a moment (see `useDebounce` in lesson 17).",
      "**`useDeferredValue`:** a React hook that lets the input stay quick while the slow list catches up a little later.",
    ),
    C('jsx', `import { useDeferredValue } from 'react';

function Search({ items }) {
  const [text, setText] = useState('');
  const deferred = useDeferredValue(text);
  const results = items.filter((i) => i.name.includes(deferred));
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <ul>{results.map((i) => <li key={i.id}>{i.name}</li>)}</ul>
    </div>
  );
}`),
    P("The input updates at once. The list uses the slightly older `deferred` value, and React updates it when it has time, so typing never feels stuck."),

    H("Other quick wins"),
    L(
      "**Images:** use modern sizes and formats, set `width` and `height`, and add `loading=\"lazy\"` for images below the fold.",
      "**Code splitting:** load a page's code only when needed (next lesson).",
      "**Keys:** stable keys avoid recreating list items.",
      "**Avoid heavy work while rendering:** do not sort or parse big data in the body without `useMemo`, if it is truly big.",
      "**Production build:** always test speed with `npm run build` and `npm run preview`. The development version is much slower on purpose.",
    ),

    H("A simple decision list"),
    O(
      "Is the app really slow? If not, stop.",
      "Find the slow part with the Profiler.",
      "Can you move state down, or pass the slow part as children? Do that first.",
      "Is a heavy child redrawing with the same props? Add `memo`, and make object and function props steady.",
      "Is a calculation heavy? Use `useMemo`.",
      "Is a list very long? Paginate or virtualise.",
    ),

    H("Common mistakes"),
    L(
      "Adding `memo`, `useMemo` and `useCallback` everywhere before measuring.",
      "Wrapping a component in `memo` but passing a new object or function each time, so it never skips.",
      "Wrong dependency arrays in `useMemo` and `useCallback`, which give old values.",
      "Measuring speed in the development build.",
      "Using the array index as a key in long lists that change.",
    ),
    ...task(
      "Make a page with a text box and a list of 2,000 items. Notice the lag when typing, and fix it by moving the state down.",
      "Wrap the list item in `memo`, add `useCallback` for a remove button, and check with the Profiler that rows no longer redraw.",
      "Try `useDeferredValue` for a filter box.",
      "Run the Profiler before and after each change and write down the difference.",
    ),
    ...check("Typing in the box does not make the whole list render in the Profiler.", "Removing one item redraws only the changed parts.", "You can say why `memo` needs steady props."),
    H("Summary"),
    L(
      "Measure first with the Profiler. Many slow pages are slow because of big images and big code, not renders.",
      "The simplest fix is to move state down. Then use `memo`, `useMemo` and `useCallback` where they really help.",
      "`memo` needs steady props. Objects and functions must be kept steady with `useMemo` and `useCallback`.",
      "For very long lists, paginate or virtualise. Use debounce or `useDeferredValue` for typing.",
    ),
  ], [
    { q: 'When should I use useMemo and useCallback?', a: 'When a value must stay steady for a memo component or a dependency list, or when a calculation is truly heavy. Not by default.' },
    { q: 'Does React.memo always make my app faster?', a: 'No. It only helps if the component is slow and its props are the same between renders. New objects and functions as props break it.' },
    { q: 'Why is my app slower in development?', a: 'The development build adds extra checks and runs some code twice. Test speed with the production build.' },
    { q: 'What is virtualisation?', a: 'Drawing only the list rows that are visible, so very long lists stay fast. Libraries such as react-window do it.' },
  ], 'react performance, react memo usememo usecallback, react optimization, react usedeferredvalue, react virtualized list'),

  // ---------------------------------------------------------------- 22
  lesson(S3, 'react-lazy-suspense-code-splitting', 'React Code Splitting: lazy, Suspense and Faster First Load', 'Make the first page load faster by loading code only when it is needed. Learn lazy, Suspense, route-based splitting and how to check bundle size.', '', [
    P("When you build a React app, all your code is joined into files called **bundles**. The browser must download and run them before the page works. If your app is large, the first visit can be slow, especially on a phone with a weak connection. **Code splitting** means loading only the code a visitor needs now, and loading the rest later."),

    H("The idea in plain words"),
    P("Think of a restaurant. You do not bring the whole kitchen to the table when someone sits down. You bring the menu first, and the food when it is ordered. In a website, the home page is the menu. The admin dashboard, the chart library and the settings page are dishes that only some visitors will order, so load them when asked."),

    H("Dynamic import"),
    P("JavaScript has a feature called **dynamic `import()`**. Unlike the normal `import` at the top of a file, it loads a file **when you call it** and returns a promise. The build tool (Vite) sees this and puts that file in a separate bundle."),
    C('js', `button.addEventListener('click', async () => {
  const { exportToPdf } = await import('./exportToPdf.js');
  exportToPdf(data);
});`),
    P("The PDF code is only downloaded when someone clicks the button. Visitors who never export never pay for it."),

    H("React.lazy and Suspense"),
    P("React gives you `lazy` to use this idea for **components**, and `Suspense` to show something while the code is loading."),
    C('jsx', `import { lazy, Suspense } from 'react';

const Reports = lazy(() => import('./Reports.jsx'));

function App() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading reports...</p>}>
        <Reports />
      </Suspense>
    </div>
  );
}`),
    L(
      "`lazy(() => import('./Reports.jsx'))` makes a component that loads on first use. The file must **export default** the component.",
      "`Suspense` shows its `fallback` until the lazy component is ready. Give a helpful fallback, such as a spinner or a skeleton that has the same size as the real content, so the page does not jump.",
      "You can put several lazy components inside one `Suspense`, and it waits for all.",
    ),

    H("The best place to split: routes"),
    P("The most useful and simple place is at the **page level**. Each route becomes its own bundle, so a visitor to the home page does not download the code of the admin pages."),
    C('jsx', `import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home.jsx'));
const Products = lazy(() => import('./pages/Products.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

function App() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}`),
    P("One `Suspense` around all the routes is enough to start. You can add smaller ones later around slow parts, so the rest of the page stays visible."),
    N("For the page a visitor lands on first, such as the home page, you may prefer **not** to make it lazy, since it is needed at once anyway. Splitting helps the other pages."),

    H("Split heavy libraries too"),
    P("Big libraries, such as chart tools, rich text editors, maps and PDF makers, are often the largest part of a bundle. Load them only where they are used:"),
    C('jsx', `const Chart = lazy(() => import('./Chart.jsx'));   // Chart.jsx imports the big chart library

function Stats({ show }) {
  return show ? (
    <Suspense fallback={<div style={{ height: 300 }}>Loading chart...</div>}>
      <Chart />
    </Suspense>
  ) : null;
}`),

    H("Preload: load before it is needed"),
    P("A lazy page loads when the person goes there, which can feel like a small delay. You can load it a little earlier, for example when the person moves the mouse over the link:"),
    C('jsx', `const loadProducts = () => import('./pages/Products.jsx');
const Products = lazy(loadProducts);

<Link to="/products" onMouseEnter={loadProducts} onFocus={loadProducts}>Products</Link>`),
    P("The browser keeps the loaded file, so when the page is requested it is ready at once. This keeps the benefit of splitting without the wait."),

    H("What happens when loading fails?"),
    P("A lazy file can fail to load, for example if the person goes offline, or if you deployed a new version and the old file name no longer exists. React then throws an error. You should catch it with an **error boundary**, which the next lesson covers, and show a message such as “Could not load this page. Please reload.”"),

    H("Check your bundle size"),
    P("Look at what `npm run build` prints. Vite shows each file and its size, and warns when a file is larger than 500 kilobytes. Many teams also use a visual tool, such as `rollup-plugin-visualizer`, which draws a map of what is in your bundle, so you can spot a single huge package."),
    L(
      "Prefer smaller libraries, or import only the part you need (for example one function, not the whole utility library).",
      "Remove packages you no longer use.",
      "Compress images, and use modern formats.",
      "Make sure your server sends files compressed (gzip or brotli) and with good cache headers. Files with a hash in their name can be cached for a long time.",
    ),

    H("Measure the result"),
    P("Open the browser tools on the **Network** tab, turn on throttling (for example “Fast 4G”), reload the page, and look at how many kilobytes were downloaded before the page shows. Compare before and after splitting. Also test with a real phone if you can. Tools like Lighthouse in Chrome give a score and tips."),

    H("Common mistakes"),
    L(
      "Forgetting `export default` in a file used with `lazy`.",
      "No `Suspense` around a lazy component, which gives an error.",
      "A fallback that is much smaller than the real content, so the page jumps when it loads.",
      "Making tiny components lazy, which adds many small requests for no gain.",
      "Not handling load failures.",
    ),
    ...task(
      "Take your router app from lesson 18 and make each page lazy.",
      "Run `npm run build` before and after. Compare the size of the main file.",
      "Add a preload on hover for one link.",
      "In the browser Network tab, check that a page's file loads only when you open that page.",
    ),
    ...check("The first load downloads less code than before.", "Each page's own file appears in the Network tab only when you visit it.", "The fallback appears briefly, then the page."),
    H("Summary"),
    L(
      "Code splitting loads code only when it is needed, so the first visit is faster.",
      "Use `lazy(() => import('./Page.jsx'))` and wrap the result in `Suspense` with a fallback.",
      "Split at routes first, then heavy libraries. Preload on hover to avoid delays.",
      "Check bundle size and always handle load failures.",
    ),
  ], [
    { q: 'What is code splitting?', a: 'Dividing your app code into several files and loading each one only when the visitor needs it, so the first page loads faster.' },
    { q: 'Do I need Suspense with lazy?', a: 'Yes. Suspense shows a fallback while the lazy component loads. Without it React throws an error.' },
    { q: 'Where should I split my code?', a: 'Start with routes (one bundle per page), then split heavy libraries such as charts and editors.' },
    { q: 'Why does the page jump when a lazy component loads?', a: 'The fallback is smaller than the real content. Make the fallback about the same size, for example a skeleton.' },
  ], 'react lazy suspense, react code splitting, react bundle size, vite code splitting, react performance first load'),

  // ---------------------------------------------------------------- 23
  lesson(S3, 'react-error-boundaries-portals-modals', 'React Error Boundaries and Portals: Safe Crashes, Modals and Tooltips', 'Stop one broken component from crashing the whole page with error boundaries, and build accessible modals and tooltips with portals.', '', [
    P("Things go wrong in real apps: a server sends strange data, a component has a bug, a lazy file fails to load. Without a plan, one small error can turn the **whole page white**. In this lesson you will learn **error boundaries**, which keep the rest of the page working, and **portals**, which let a component draw somewhere else in the page, for example for a modal."),

    H("What happens when a component throws"),
    P("If an error happens while React is rendering a component (for example `user.name` when `user` is `null`), React removes the whole component tree from the screen. The visitor sees a blank page. That is much worse than a small message in one box."),
    P("An **error boundary** is a component that catches such errors in the components below it, and shows a **fallback** instead. The rest of the page keeps working."),

    H("Writing an error boundary"),
    P("Error boundaries are the one thing in React that still must be a **class component**, because there is no hook for it yet. You write it once and use it everywhere:"),
    C('jsx', `import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Send this to a log or to an error service
    console.error('Caught by boundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <p role="alert">Something went wrong in this part of the page.</p>;
    }
    return this.props.children;
  }
}`),
    L(
      "`getDerivedStateFromError` runs when a child throws, and sets `hasError` to true, so the next render shows the fallback.",
      "`componentDidCatch` is where you **report** the error, to the console or to a monitoring service.",
      "`render` shows the fallback when there is an error, and the normal children otherwise.",
    ),
    P("You can also use the ready-made package `react-error-boundary`, which gives you the same with a function-friendly API and a handy reset button. Many teams use it."),

    H("Using it"),
    C('jsx', `function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback={<p>The chart could not be shown.</p>}>
        <SalesChart />
      </ErrorBoundary>
      <ErrorBoundary>
        <Comments />
      </ErrorBoundary>
    </div>
  );
}`),
    P("If `SalesChart` crashes, only that box shows the message. The header and the comments stay. This is the idea: **put boundaries around parts that can fail independently**. A good plan is one boundary around the whole app as a last safety net, and smaller ones around risky parts such as widgets, charts and lazy pages."),

    H("What error boundaries do not catch"),
    L(
      "**Errors in event handlers** (a click handler that throws). Use a normal `try` and `catch` there.",
      "**Errors in async code**, such as inside `fetch` promises or `setTimeout`. Catch them yourself and put the error in state, as in the fetching lesson.",
      "**Server rendering errors**, and errors in the boundary itself.",
    ),
    C('jsx', `function SaveButton() {
  const [error, setError] = useState('');
  async function handleClick() {
    try {
      await save();
    } catch (err) {
      setError('Could not save. Please try again.');
    }
  }
  return (
    <>
      <button onClick={handleClick}>Save</button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}`),

    H("A retry button"),
    P("A fallback is more useful with a way to try again. Use a `key` to reset the boundary and its children:"),
    C('jsx', `function Widget() {
  const [attempt, setAttempt] = useState(0);
  return (
    <ErrorBoundary
      key={attempt}
      fallback={<button onClick={() => setAttempt(attempt + 1)}>Something failed. Try again</button>}
    >
      <SalesChart />
    </ErrorBoundary>
  );
}`),
    P("When `attempt` changes, the `key` changes, so React makes a brand new boundary with no error. The chart tries to load again."),

    H("Portals: draw somewhere else"),
    P("A modal (a box that appears above the page) is a problem if it sits deep in your component tree. A parent with `overflow: hidden` or a `z-index` can cut it off or hide it. A **portal** lets a component render its output in a **different place in the real page**, such as directly under `<body>`, while still being part of the same React tree. That means props, state and context still work normally."),
    C('jsx', `import { createPortal } from 'react-dom';

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title}
           onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}`),
    P("`createPortal(jsx, container)` draws the JSX inside `container`, here `document.body`. The click on the dark backdrop closes the modal, and `stopPropagation` makes sure that clicking inside the box does not."),

    H("Making a modal accessible"),
    P("A modal that looks fine can still be hard to use. These points matter for people who use keyboards and screen readers:"),
    L(
      "Give the box `role=\"dialog\"`, `aria-modal=\"true\"` and a name through `aria-label` or `aria-labelledby`.",
      "**Move focus** into the modal when it opens, and **return focus** to the button that opened it when it closes.",
      "Close with the **Escape** key.",
      "**Trap the focus** inside while it is open, so Tab does not move to the page behind.",
      "Stop the page behind from scrolling while the modal is open.",
    ),
    C('jsx', `import { useEffect, useRef } from 'react';

function useEscape(onClose, active) {
  useEffect(() => {
    if (!active) return;
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, active]);
}`),
    P("Getting all of these right by hand is work. The built-in HTML `<dialog>` element does a lot of it for you (focus handling, Escape and a backdrop) when opened with `showModal()`, and libraries like Radix UI or React Aria give tested, accessible modals. For production apps, using one of them is often the wisest choice."),

    H("Other good uses of portals"),
    L(
      "**Tooltips and dropdown menus** that must not be clipped by a parent.",
      "**Toast messages** (small notices at a corner of the screen).",
      "**Full-screen loading overlays.**",
    ),

    H("Common mistakes"),
    L(
      "Having no error boundary, so one bug makes the whole page white.",
      "Expecting a boundary to catch errors in click handlers or in `fetch`. Use `try` and `catch`.",
      "A fallback with no way to retry or leave.",
      "A modal without Escape, focus handling and a role.",
      "Using a modal when a simple inline message would be kinder.",
    ),
    ...task(
      "Add the `ErrorBoundary` to your app and create a component that throws on a button click state to test it.",
      "Add a retry button using `key`.",
      "Build a `Modal` with a portal, an Escape key close and a backdrop click close.",
      "Move focus into the modal on open, and back to the button on close.",
    ),
    ...check("A crash in one widget leaves the rest of the page working.", "Pressing Escape closes the modal.", "After the modal closes, focus returns to the button that opened it."),
    H("Summary"),
    L(
      "An error boundary catches errors from components below it and shows a fallback instead of a white page.",
      "It does not catch errors in event handlers or async code, so use `try` and `catch` there.",
      "A portal draws a component into another place in the page, such as `document.body`, and is ideal for modals and tooltips.",
      "Make modals accessible with a role, focus handling and Escape, or use a tested library.",
    ),
  ], [
    { q: 'What is an error boundary?', a: 'A component that catches errors from the components below it while rendering, and shows a fallback instead of crashing the whole page.' },
    { q: 'Why is there no hook for error boundaries?', a: 'React does not yet have a hook for it, so an error boundary is written as a class. The react-error-boundary package gives an easy version.' },
    { q: 'What is a React portal?', a: 'A way to draw a component into a different part of the real page, such as document.body, while it stays part of the same React tree.' },
    { q: 'Why does my modal get cut off?', a: 'A parent with overflow hidden or a lower z-index can hide it. Render the modal with a portal into document.body.' },
  ], 'react error boundary, react createportal modal, react accessible modal, react error handling, react fallback ui'),

  // ---------------------------------------------------------------- 24
  lesson(S3, 'react-state-management-redux-toolkit-zustand', 'React State Management: Redux Toolkit and Zustand Explained for Beginners', 'Learn when a state library is worth it, and see the same shopping cart built with Redux Toolkit and with Zustand, step by step.', '', [
    P("So far we kept state with `useState`, `useReducer` and context. For many apps that is enough. But as an app grows, you may want one **central store** that any component can read and change, with good tools. In this lesson we look at the two most popular choices: **Redux Toolkit** and **Zustand**."),

    H("Do you need a state library?"),
    P("Most beginners reach for a library too early. First, ask what kind of state you have:"),
    L(
      "**Local UI state** (a toggle, a text box): use `useState`. Keep it local.",
      "**Server data** (lists from an API): use a data library like TanStack Query (next lesson). This is the biggest source of state in many apps, and a state library is *not* the best tool for it.",
      "**Shared client state** (the cart, the signed-in user, filters used on many pages): this is where a store helps.",
    ),
    P("A library may be worth adding when many components far apart change the same data, when the update rules are complex, or when you want good debugging tools. If a few contexts do the job, keep them."),

    H("Redux in one picture"),
    P("Redux keeps all shared state in **one store**. Components do not change it directly. They **dispatch actions**, and **reducers** (pure functions) make the new state, the same idea you learned in the `useReducer` lesson. Redux Toolkit (RTK) is the modern, official way to write Redux. It removes most of the old boilerplate."),
    C('bash', `npm install @reduxjs/toolkit react-redux`),

    H("A cart with Redux Toolkit"),
    P("Step 1: make a **slice**, which holds the state, the reducers and the actions of one feature together:"),
    C('js', `// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    added(state, action) {
      const found = state.items.find((i) => i.id === action.payload.id);
      if (found) {
        found.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removed(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    cleared(state) {
      state.items = [];
    },
  },
});

export const { added, removed, cleared } = cartSlice.actions;
export default cartSlice.reducer;`),
    P("Look: inside the reducers it seems we **change** the state with `push` and `+= 1`. That is allowed here, because RTK uses a library called Immer behind the scenes. Immer lets you write simple “changes”, and it turns them into safe, new copies for you. This works **only** inside `createSlice` reducers."),
    P("Step 2: make the store and give it to the app:"),
    C('jsx', `// store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: { cart: cartReducer },
});

// main.jsx
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);`),
    P("Step 3: read and change the store in components, with `useSelector` and `useDispatch`:"),
    C('jsx', `import { useSelector, useDispatch } from 'react-redux';
import { added, removed } from './cartSlice';

function CartCount() {
  const count = useSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  return <span>Cart ({count})</span>;
}

function ProductCard({ product }) {
  const dispatch = useDispatch();
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => dispatch(added(product))}>Add to cart</button>
    </div>
  );
}`),
    L(
      "`useSelector(fn)` picks the part of the state you need. The component redraws only when **that picked value** changes.",
      "`useDispatch()` gives the `dispatch` function. `added(product)` makes the action `{ type: 'cart/added', payload: product }`.",
      "Select the **smallest** piece you need, not the whole state, so fewer components redraw.",
    ),
    P("Redux also has excellent developer tools (the Redux DevTools browser extension), where you can see every action, and go back in time. For big teams and complex apps this is very valuable."),

    H("The same cart with Zustand"),
    P("**Zustand** is a very small library with almost no setup. There is no provider and no actions to write. You make a **store as a hook**:"),
    C('bash', `npm install zustand`),
    C('js', `// useCartStore.js
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],

  add: (product) =>
    set((state) => {
      const found = state.items.find((i) => i.id === product.id);
      if (found) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    }),

  remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}));`),
    C('jsx', `import { useCartStore } from './useCartStore';

function CartCount() {
  const count = useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));
  return <span>Cart ({count})</span>;
}

function ProductCard({ product }) {
  const add = useCartStore((state) => state.add);
  return <button onClick={() => add(product)}>Add to cart</button>;
}`),
    P("The store is a hook. Components pick what they need with a selector, and call the functions in the store directly. With Zustand you still update state the immutable way (a new array or object), unless you add its `immer` helper. There is no provider, so the setup is tiny."),

    H("Redux Toolkit or Zustand?"),
    L(
      "**Zustand:** small, easy, fast to learn. A great choice for small and medium apps, and for a few shared values.",
      "**Redux Toolkit:** more structure, great devtools, and a large community and ecosystem. A good fit for large apps and big teams that value strict patterns.",
      "**Context + useReducer:** zero extra libraries, fine when state is small and changes rarely.",
    ),
    P("Neither is “better”. If you are unsure, start with the simplest one that works, because it is easy to move to a bigger tool later. The ideas you learned (actions, reducers, selectors, immutability) are the same."),

    H("Rules that work with any store"),
    L(
      "**Keep local state local.** Do not put a text box value in the global store.",
      "**Keep server data in a data library**, not in your store (see lesson 25).",
      "**Store the minimum**, and calculate the rest with selectors.",
      "**Select small pieces** to avoid extra renders.",
      "**Never put non-serialisable things** (functions, class instances) in a Redux store.",
    ),

    H("Saving the store"),
    P("To keep the cart after a reload, save it in `localStorage`. Zustand has a `persist` helper for this. In Redux you subscribe to the store or use a library such as `redux-persist`. Do not save sensitive data in `localStorage`."),

    H("Common mistakes"),
    L(
      "Adding a library before you need it.",
      "Putting every little value in the global store.",
      "Selecting the whole state in `useSelector`, which redraws the component on any change.",
      "Changing the state outside `createSlice` reducers in Redux, which breaks the rules.",
      "Storing API data in the store and writing loading and error code by hand.",
    ),
    ...task(
      "Build the cart with Redux Toolkit: slice, store, provider, `useSelector`, `useDispatch`.",
      "Build the same cart with Zustand. Compare how many files and lines each needed.",
      "Show the total price using a selector.",
      "Install the Redux DevTools extension and watch the actions as you click Add.",
    ),
    ...check("The cart count is the same in the header and the cart page, in both versions.", "In the Redux DevTools you can see each action.", "Only components that use changed data redraw."),
    H("Summary"),
    L(
      "Use a state library only for shared client state that is complex. Keep local state local, and use a data library for server data.",
      "Redux Toolkit: slices, `configureStore`, `useSelector` and `useDispatch`. Immer lets you write simple updates inside slices.",
      "Zustand: a store as a hook with `create`, no provider, tiny setup.",
      "Select small pieces of state, store the minimum, and keep actions clear.",
    ),
  ], [
    { q: 'Do I need Redux in 2026?', a: 'Not for most small apps. Local state, context and a data library cover many cases. Redux Toolkit is still a good choice for large apps that need structure and strong tools.' },
    { q: 'What is the difference between Redux and Zustand?', a: 'Zustand is smaller and simpler, with no provider and few concepts. Redux Toolkit has more structure, tools and conventions, which help large teams.' },
    { q: 'Why can I change state inside createSlice?', a: 'Redux Toolkit uses Immer, which turns your simple changes into safe immutable updates. It works only inside createSlice reducers.' },
    { q: 'Should API data go in the store?', a: 'Usually no. A data library such as TanStack Query handles caching, loading and refreshing for you.' },
  ], 'react state management, redux toolkit tutorial, zustand tutorial, react redux vs zustand, react global state'),

  // ---------------------------------------------------------------- 25
  lesson(S3, 'tanstack-query-react-data-fetching', 'TanStack Query (React Query): Fetching, Caching and Updating Server Data', 'Replace hand-written loading and error code with TanStack Query. Learn useQuery, query keys, caching, mutations, invalidation and optimistic updates.', '', [
    P("In lesson 12 you wrote data loading by hand: loading state, error state, cancelling old requests. It works, but you repeat it in every component, and many things are still missing: caching, refreshing, retrying, and keeping the screen in step after a change. **TanStack Query**, also called **React Query**, solves all of this. It is one of the most useful libraries in the React world."),

    H("Server state is different"),
    P("Data that comes from a server is not like your own UI state. It lives somewhere else, it can change without you knowing, it can be shared by many components, and it can become **stale** (out of date). Handling that with `useState` and `useEffect` is hard to do well. TanStack Query is built for exactly this kind of state, so you can stop writing that code."),

    H("Install and set up"),
    C('bash', `npm install @tanstack/react-query`),
    C('jsx', `// main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);`),
    P("The `QueryClient` is the cache. The provider makes it available to every component, like the context you saw before."),

    H("useQuery: reading data"),
    C('jsx', `import { useQuery } from '@tanstack/react-query';

async function fetchPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  if (!response.ok) throw new Error('Request failed');
  return response.json();
}

function Posts() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p role="alert">Could not load posts. <button onClick={() => refetch()}>Try again</button></p>;

  return <ul>{data.map((post) => <li key={post.id}>{post.title}</li>)}</ul>;
}`),
    P("Compare this with lesson 12: there is no `useEffect`, no three `useState` calls, and no `AbortController`. You give two things:"),
    L(
      "**`queryKey`**: an array that **names** this data. It works like an address in the cache.",
      "**`queryFn`**: a function that returns a promise with the data. If it throws, the query is in the error state.",
    ),
    P("You get back flags such as `isPending`, `isError`, `data` and `error`, and a `refetch` function. Note that `fetch` does not throw on a 404, so we check `response.ok` and throw ourselves."),

    H("Query keys: the heart of caching"),
    P("The key identifies the data. Two components that ask for the same key share **one** request and **one** cached result. If the key has a variable in it, a new value means a new query:"),
    C('jsx', `function Post({ id }) {
  const { data } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetch('/api/posts/' + id).then((r) => r.json()),
  });
  return <h2>{data?.title}</h2>;
}`),
    P("When `id` changes from 1 to 2, the key changes from `['post', 1]` to `['post', 2]`, so TanStack Query loads post 2. If you go back to post 1, it shows the **cached** result at once and refreshes it quietly in the background. That is why apps built with it feel fast. Race conditions, where old data overwrites new data, are handled for you."),

    H("Stale data and refetching"),
    P("Cached data is marked **stale** after a time, and by default that time is zero, so data refetches in the background when a component mounts, when the window gets focus again, and when the connection comes back. You can change this with `staleTime`, how long the data counts as fresh:"),
    C('jsx', `useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
  staleTime: 5 * 60 * 1000,    // fresh for 5 minutes
});`),
    P("For data that rarely changes, use a long `staleTime`. For live data such as prices, use a short one, or add `refetchInterval`. Failed requests are also **retried** a few times by default, which is kind to flaky connections."),

    H("useMutation: changing data"),
    P("Reading uses `useQuery`. **Creating, updating and deleting** use `useMutation`:"),
    C('jsx', `import { useMutation, useQueryClient } from '@tanstack/react-query';

function AddPost() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  const mutation = useMutation({
    mutationFn: (newPost) =>
      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      }).then((r) => {
        if (!r.ok) throw new Error('Save failed');
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTitle('');
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    mutation.mutate({ title });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Add'}</button>
      {mutation.isError && <p role="alert">Could not save. Please try again.</p>}
    </form>
  );
}`),
    L(
      "`mutate(data)` runs the `mutationFn`.",
      "`isPending`, `isError` and `isSuccess` tell you the state, so you can disable the button and show messages.",
      "`onSuccess` runs when it works. Here we call **`invalidateQueries`**, which marks every query with the key `['posts']` as stale, so the list **reloads by itself** and shows the new post.",
    ),
    P("This is a very nice pattern: after any change, you invalidate the related keys, and the screen stays correct without you wiring state by hand."),

    H("Optimistic updates (a short look)"),
    P("Sometimes you want the screen to change **at once**, before the server answers, for example when ticking a to-do item. This is an **optimistic update**. You update the cache straight away, and if the server fails, you put the old data back. TanStack Query supports this with `onMutate` and `onError`, and there is a guide in its documentation. Use it for actions that almost always succeed. It is a small thing that makes an app feel very fast."),

    H("Where to put your queries"),
    P("Do not write fetch code inside every component. Put your query functions in one file (such as `api.js`), and wrap a query in a **custom hook**, as in lesson 17:"),
    C('jsx', `// hooks/usePosts.js
export function usePosts() {
  return useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
}

// in a component
const { data, isPending } = usePosts();`),
    P("Now every component that needs posts shares one cache entry and one request, and changing how posts are fetched happens in one place."),

    H("Developer tools"),
    P("TanStack Query has a devtools panel (`@tanstack/react-query-devtools`) that shows every query, whether it is fresh or stale, and its cached data. It is a great way to learn what the library is doing."),

    H("When not to use it"),
    L(
      "For a tiny app with one simple request, plain `fetch` in an effect is fine.",
      "For data that never comes from a server, use normal state.",
      "If you use a framework such as Next.js, it has its own data tools, which you can still combine with TanStack Query.",
    ),

    H("Common mistakes"),
    L(
      "Forgetting to throw on non-OK responses in `queryFn`, so errors look like success.",
      "Putting a changing value in `queryFn` but not in `queryKey`, so the cache shows the wrong data. **Everything the query depends on belongs in the key.**",
      "Copying query data into `useState`. Use `data` directly.",
      "Not invalidating after a mutation, so the list stays old.",
      "Forgetting the `QueryClientProvider`.",
    ),
    ...task(
      "Install the library and rewrite the posts list from lesson 12 with `useQuery`. Compare the number of lines.",
      "Add a page for one post using `['post', id]`. Go back and forth and notice the instant cached result.",
      "Add a form with `useMutation` that creates a post and invalidates the list.",
      "Add the devtools and watch queries become stale.",
    ),
    ...check("The list shows Loading, then the data, and an error with a retry button when the URL is wrong.", "Going back to a visited page shows data at once.", "A new item appears in the list after saving, with no manual refresh."),
    H("Summary"),
    L(
      "TanStack Query manages server state: caching, refetching, retries and cancelling are built in.",
      "`useQuery({ queryKey, queryFn })` reads data. The key names the data, and everything the query depends on goes in it.",
      "`useMutation` changes data, and `invalidateQueries` refreshes the related lists.",
      "Wrap queries in custom hooks and keep them in one place.",
    ),
  ], [
    { q: 'What is TanStack Query used for?', a: 'For loading and changing data from a server, with caching, refetching, retries and loading and error states built in.' },
    { q: 'Is React Query the same as TanStack Query?', a: 'Yes. React Query was renamed TanStack Query when it grew to support other frameworks. The React package is @tanstack/react-query.' },
    { q: 'What is a query key?', a: 'An array that names a piece of data in the cache. Queries with the same key share one request and one result. Put every variable the query depends on in it.' },
    { q: 'Do I still need Redux if I use TanStack Query?', a: 'Often not for server data. You may still use a small store for shared client state.' },
  ], 'tanstack query tutorial, react query usequery, react query usemutation, react data fetching library, react query caching'),
];
