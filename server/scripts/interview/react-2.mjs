// React interview questions, part 2: hooks and effects, refs/context/custom hooks, performance.
import { mk } from './lib.mjs';
const A = mk('react');
const H = 'React hooks and effects', C = 'React refs, context and custom hooks', P = 'React performance';

export const r2 = [
  A(H, 'fresher', 'What are hooks, and what are the rules of hooks?',
`Hooks are functions such as useState and useEffect that let function components use state and other React features. There are two rules: call hooks only at the top level of a component or custom hook (not inside loops, conditions or nested functions), and call them only from React function components or custom hooks.

React relies on the call order being the same on every render. The eslint-plugin-react-hooks package checks these rules for you.`),
  A(H, 'fresher', 'What does useEffect do?',
`useEffect runs code after React has rendered and updated the screen. It is for synchronising with things outside React: fetching data, subscribing to events, timers, or changing the document title.

You pass a function and a dependency array. The effect re-runs when a dependency changes. It can return a cleanup function that React runs before the next effect and when the component unmounts.`),
  A(H, 'fresher', 'What does the dependency array of useEffect mean?',
`It lists the reactive values (props, state, and variables derived from them) that the effect uses. With no array the effect runs after every render. With an empty array [] it runs once after the first render. With values it runs when any of them change.

Do not leave out dependencies to silence a warning. Fix the cause instead, for example by moving a function inside the effect.`),
  A(H, 'fresher', 'Why does an effect run twice in development?',
`In StrictMode, React intentionally mounts, unmounts and mounts components again in development to help you find effects that are not cleaned up properly. It does not happen in production.

If running twice breaks your code, the fix is a proper cleanup function (abort the fetch, remove the listener), not removing StrictMode.`),
  A(H, 'fresher', 'What is the cleanup function in useEffect, and when does it run?',
`Return a function from the effect to undo what it set up: clearInterval, removeEventListener, unsubscribe, or abort a request. React calls it before re-running the effect because dependencies changed, and when the component unmounts.

Without cleanup you get memory leaks, duplicate listeners, and updates from stale requests.`),
  A(H, 'both', 'How do you fetch data in a React component with useEffect?',
`Start the request inside the effect, store the result in state, and track loading and error states. Add an AbortController or an ignore flag in cleanup so a slow old response cannot overwrite a newer one.

For real apps, a library such as TanStack Query handles caching, retries and race conditions, so you write much less effect code.`),
  A(H, 'both', 'What are race conditions in effects and how do you prevent them?',
`If a dependency changes quickly (for example a search term), several requests are in flight, and an older one may finish last and overwrite newer data. Prevent it by aborting the previous request in cleanup using AbortController, or by setting let ignore = false and setting it to true in cleanup, then only calling setState when not ignored.`),
  A(H, 'both', 'When should you NOT use useEffect?',
`Not for calculating values from props or state (do it during render), not for responding to a user event (put the logic in the event handler), and not for resetting state when a prop changes (use a key). Effects are for synchronising with external systems.

Overusing effects causes extra renders and tangled logic. The official guide "You Might Not Need an Effect" explains this well.`),
  A(H, 'both', 'What is the difference between useEffect and useLayoutEffect?',
`useEffect runs after the browser has painted. useLayoutEffect runs after the DOM updates but before the browser paints, so you can measure layout and change it without a visible flicker. It blocks painting, so use it only when needed, such as measuring an element's size for a tooltip position.

Neither runs on the server during server rendering.`),
  A(H, 'both', 'How does useReducer work?',
`const [state, dispatch] = useReducer(reducer, initialState). The reducer is a pure function (state, action) => newState. You call dispatch({ type: 'add', payload }) and React runs the reducer and re-renders with the result.

It centralises update rules, which is clearer than many setState calls when the next state depends on the action type.`),
  A(H, 'both', 'What is a stale closure in React, and how do you fix it?',
`A function created during a render keeps the values from that render. If an interval or event listener is set up once, it may keep reading an old state value. Fixes: use the updater form setCount((c) => c + 1), list the right dependencies so the effect re-subscribes, or store the latest value in a ref.`),
  A(H, 'experienced', 'What is useEffectEvent and what problem does it solve?',
`In recent React versions, useEffectEvent lets you extract logic that reads the latest props or state inside an effect without making that value a dependency, so the effect does not re-run needlessly (for example, logging a visit with the current theme but only reconnecting when the room changes).

It is relatively new, so check the React documentation for the exact version and current status before relying on it.`),
  A(H, 'experienced', 'How do you subscribe to an external store safely?',
`Use useSyncExternalStore. You pass a subscribe function and a function that returns the current snapshot, and React keeps the component consistent with the store, including during concurrent rendering and server rendering.

State libraries such as Redux and Zustand use it internally. Writing the same thing with useEffect and useState can cause tearing, where parts of the UI show different values.`),
  A(H, 'experienced', 'What is the difference between useTransition and useDeferredValue?',
`Both keep the UI responsive during heavy updates. useTransition wraps a state update you control (startTransition(() => setQuery(x))) and marks it as non-urgent, giving you an isPending flag. useDeferredValue takes a value you receive, such as a prop, and returns a version that lags behind during urgent updates.

Use the first when you own the setter, the second when you only have the value.`),
  A(C, 'fresher', 'What is useRef used for?',
`useRef returns an object { current } that stays the same across renders, and changing it does not cause a re-render. Common uses: getting a DOM element (inputRef.current.focus()), and storing values that should persist without triggering rendering, such as a timer id or the previous value.`),
  A(C, 'fresher', 'What is Context and when would you use it?',
`Context lets a parent share a value with all components below it without passing props at every level. You create it with createContext, provide a value with a Provider, and read it with useContext.

Good uses: theme, current user, language. It is not a complete state manager, and every consumer re-renders when the value changes.`),
  A(C, 'fresher', 'What is a custom hook?',
`A custom hook is a function whose name starts with "use" and that calls other hooks, so you can reuse stateful logic between components. For example useLocalStorage(key) or useDebounce(value, delay).

It shares logic, not state: each component calling the hook gets its own separate state.`),
  A(C, 'both', 'What is forwardRef and how does it change in React 19?',
`A ref normally cannot be passed to a function component as a prop. forwardRef let a component receive a ref and attach it to an inner element, for example an input inside a custom field component.

In React 19, function components can receive ref as a normal prop, so forwardRef is no longer needed in new code. It still works in older versions.`),
  A(C, 'both', 'What is the difference between useRef and useState?',
`Both keep values between renders, but changing state triggers a re-render, while changing ref.current does not. Use state for data shown on screen. Use a ref for values the UI does not display (timer ids, previous values, DOM nodes).

Do not read or write ref.current during rendering for values that affect output.`),
  A(C, 'both', 'How can Context cause performance problems, and how do you reduce them?',
`When the Provider value changes, every component that reads that context re-renders. If you pass a new object each render, like value={{ user, setUser }}, all consumers update on every parent render.

Fixes: memoise the value with useMemo, split into smaller contexts (state and dispatch separately), keep fast-changing data out of context, or use a store with selectors.`),
  A(C, 'both', 'How do you write a useDebounce hook?',
`Keep the debounced value in state and update it in an effect after a timeout, clearing the timeout in cleanup:

useEffect(() => { const id = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(id); }, [value, delay]);

Use the debounced value to trigger a search request so you do not call the API on every keystroke.`),
  A(C, 'both', 'How do you pass data between sibling components?',
`Lift the state to their common parent and pass the value and a setter down as props. If the components are far apart, use Context or a state library. For one-off cases like "focus that input," a parent can hold a ref.

Avoid trying to make siblings talk directly: React's data flow goes through the tree.`),
  A(C, 'both', 'What is useImperativeHandle?',
`It customises what a ref exposes to the parent. Instead of giving the parent the whole DOM node, you expose a small API such as { focus, reset }. It is rarely needed and is a last resort: prefer props and state for communication.`),
  A(C, 'experienced', 'How would you design a reusable custom hook with a good API?',
`Give it a clear single purpose, accept options as an object, return a stable shape (a tuple for two values, an object for more), and keep returned functions stable with useCallback when consumers put them in dependencies. Handle cleanup and race conditions inside, avoid hidden global state, and document what triggers re-renders.

Write tests for it with renderHook from React Testing Library.`),
  A(C, 'experienced', 'What patterns exist for sharing logic between components, and how do they compare?',
`Custom hooks (usually best), composition with children and slots, render props, and higher-order components. Hooks avoid wrapper nesting and are easy to test. Render props still help when a component must control what to render with shared data. HOCs fit cross-cutting wrappers in legacy code.

Pick the simplest that keeps data flow obvious.`),
  A(P, 'fresher', 'Why does a component re-render, and is re-rendering always bad?',
`A component re-renders when its state changes, when its parent re-renders, or when a context it reads changes. Re-rendering is normal and often cheap. It becomes a problem only when it is slow or visibly laggy.

Measure with the React DevTools Profiler before optimising.`),
  A(P, 'fresher', 'What does React.memo do?',
`React.memo wraps a component and skips re-rendering it if its props are shallowly equal to the previous ones. It helps for components that are expensive to render and receive the same props often.

It is useless if you pass a new object, array or function as a prop every time, unless those are memoised too.`),
  A(P, 'both', 'What is the difference between useMemo and useCallback?',
`useMemo caches the result of a calculation between renders: useMemo(() => expensive(a), [a]). useCallback caches a function itself: useCallback(() => doIt(a), [a]), which is the same as useMemo(() => () => doIt(a), [a]).

Use them for expensive calculations or to keep stable references passed to memoised children or used in effect dependencies. They are not free, so do not wrap everything.`),
  A(P, 'both', 'What is the React Compiler, and does it replace useMemo and useCallback?',
`The React Compiler is a build-time tool that automatically memoises components and values so you need fewer manual useMemo, useCallback and React.memo calls. It works when your code follows the rules of React.

It is opt-in and its status and setup change, so check the official docs for your version. Manual memoisation can still be useful in some cases, such as effect dependency control.`),
  A(P, 'both', 'How do you lazy-load components in React?',
`Use React.lazy with dynamic import and wrap the component in Suspense: const Settings = lazy(() => import('./Settings')); then <Suspense fallback={<Spinner />}><Settings /></Suspense>. The bundler splits that code into a separate file that loads when first rendered.

Route-level splitting gives the biggest win with the least effort.`),
  A(P, 'both', 'How do you render a very long list efficiently?',
`Render only what is visible with list virtualisation (windowing), using a library such as TanStack Virtual or react-window. Also use stable keys, memoise row components, and paginate or infinite-scroll data from the server.

Rendering thousands of DOM nodes is the real cost, not the map call.`),
  A(P, 'both', 'Why can inline objects and functions as props hurt memoisation?',
`A new object or function is created on each render, so its reference differs every time, and React.memo sees "changed" props and re-renders the child. Fix by moving constants outside the component, or memoising with useMemo and useCallback when the child is memoised.

If the child is not memoised, this does not matter.`),
  A(P, 'experienced', 'How would you find and fix a slow React page?',
`Reproduce it, record with the React DevTools Profiler to see which components render and how long they take, and check the browser Performance panel for long tasks. Common fixes: move state closer to where it is used, split components so updates are local, memoise expensive parts, virtualise lists, lazy-load code, and debounce inputs.

Measure again afterwards to confirm the change helped.`),
  A(P, 'experienced', 'What is Suspense, and how does it relate to concurrent rendering?',
`Suspense lets a component wait for something (lazy code, or data from a Suspense-enabled library or framework) and shows a fallback until it is ready. Concurrent rendering lets React prepare updates in the background and interrupt them if something more urgent happens, which keeps the UI responsive.

Together with transitions, you can keep the old screen visible instead of flashing a loading state.`),
  A(P, 'experienced', 'How do keys affect performance and correctness beyond lists?',
`Changing a component's key tells React to unmount the old instance and mount a new one, which resets its state. That is a clean way to reset a form when the selected item changes: <Profile key={userId} />.

Bad keys in lists (index or random values) cause unnecessary remounts or state attached to the wrong item.`),
];
