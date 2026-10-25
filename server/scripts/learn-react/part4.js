import { P, H, L, O, N, C, task, check, lesson } from './helpers.js';

const S2 = 'Hooks and Data';

export const lessons = [
  // ---------------------------------------------------------------- 11
  lesson(S2, 'react-useeffect-hook-explained', 'React useEffect Explained: Side Effects, Dependencies and Cleanup', 'Understand useEffect in simple words: what a side effect is, how the dependency array works, how to clean up, and when you do not need an effect at all.', '', [
    P("A component's main job is to describe the screen from its props and state. But sometimes a component must also do something **outside** that job: talk to a server, set a timer, listen to the window size, or change the page title. These actions are called **side effects**. React gives us the `useEffect` hook for them. It is one of the hooks people find hardest, so we go slowly, with a clear mental picture."),

    H("What is a side effect?"),
    P("A side effect is anything a component does that reaches outside its own drawing work. Drawing (rendering) must be pure: the same props and state must always give the same JSX, and drawing must not change anything else. Examples of side effects:"),
    L(
      "Fetching data from a server.",
      "Setting a timer with `setTimeout` or `setInterval`.",
      "Adding an event listener to the `window`.",
      "Changing `document.title`.",
      "Saving something in `localStorage`.",
      "Connecting to a chat server (a WebSocket).",
    ),
    P("You must not do these directly in the body of your component, because the body runs on every draw. Imagine fetching data in the body: the fetch would run on every draw, and when the data arrives you set state, which causes another draw, which fetches again, which loops forever. `useEffect` lets you say: “do this **after** the screen is drawn, and only when needed”."),

    H("Your first effect"),
    C('jsx', `import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = 'You clicked ' + count + ' times';
  });

  return <button onClick={() => setCount(count + 1)}>Clicked {count}</button>;
}`),
    P("`useEffect` takes a function. React draws the component first, puts it on the screen, and **then** runs your function. Here the title of the browser tab changes after each draw. This is the shape of every effect: a function that React calls after drawing."),

    H("The dependency array"),
    P("As written, that effect runs after **every** draw. Often that is too much. The second argument, the **dependency array**, tells React when to run it again."),
    C('jsx', `useEffect(() => { /* A */ });                 // after every draw
useEffect(() => { /* B */ }, []);             // only once, after the first draw
useEffect(() => { /* C */ }, [userId]);       // after the first draw, and again when userId changes`),
    P("Think of the array as the list of things the effect **uses**. If any item in the list is different from last time, React runs the effect again. If none changed, React skips it."),
    L(
      "**No array:** run after every draw. Rarely what you want.",
      "**Empty array `[]`:** run once when the component first appears (it “mounts”).",
      "**With values:** run on the first draw, and again whenever one of the values changes.",
    ),
    N("The rule is simple: put in the array **every prop, state and variable from your component that the effect uses**. The ESLint plugin for React hooks checks this for you and warns when something is missing. Do not turn the warning off. If you lie about the dependencies, the effect can use old values and cause bugs that are hard to find."),

    H("An effect that fetches data"),
    C('jsx', `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/users/' + userId)
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, [userId]);

  if (!user) return <p>Loading...</p>;
  return <h2>{user.name}</h2>;
}`),
    P("When the component first appears, it fetches user number 1. If the parent later passes `userId` 2, the array has a new value, so React runs the effect again and loads user 2. The next lesson shows a complete and safe version of this, with errors and cancelling."),

    H("Cleanup: stop what you started"),
    P("Some effects start something that keeps running: a timer, a listener, a connection. If you never stop it, you get a **leak**: timers pile up and old listeners keep running after the component is gone. To stop it, return a **cleanup function** from the effect. React calls it before running the effect again, and when the component is removed."),
    C('jsx', `function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);   // cleanup
  }, []);

  return <p>{time.toLocaleTimeString()}</p>;
}`),
    P("When `Clock` appears, the interval starts. When `Clock` is removed from the page, React calls the returned function, and the interval stops. Without the cleanup, the timer would try to change the state of a component that no longer exists."),
    C('jsx', `function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <p>The window is {width}px wide.</p>;
}`),

    H("The order of events"),
    P("It helps to picture what React does in order for the effect with the `userId` dependency:"),
    O(
      "The component draws for the first time. React shows it on the screen.",
      "React runs the effect function.",
      "Later, `userId` changes, and the component draws again.",
      "Before running the effect again, React runs the **cleanup** of the previous effect.",
      "React runs the effect again with the new value.",
      "When the component is removed, React runs the last cleanup.",
    ),

    H("Why does my effect run twice in development?"),
    P("In development, `StrictMode` (which you saw in `main.jsx`) deliberately runs each effect, its cleanup and the effect again, once, right after the component first appears. It looks strange, but it is a helpful test: it checks that your cleanup really undoes your effect. If your effect works with this extra round, it will also work when a component appears and disappears many times in real life. This extra run only happens in development and never in the built site."),

    H("You might not need an effect"),
    P("Effects are overused by beginners. Many things people put in an effect have a simpler way:"),
    L(
      "**Calculating a value from props or state:** just calculate it while drawing. `const total = price * quantity;` needs no effect and no extra state.",
      "**Reacting to a click:** put the code in the event handler, not in an effect that watches state.",
      "**Resetting state when a prop changes:** give the component a different `key`, and React will make a fresh one.",
      "**Sending data after a form submit:** do it in the submit handler.",
    ),
    P("Use an effect only to **synchronise with something outside React**: the network, the browser, a timer, a library. If you are only moving data between your own state and props, you probably do not need one."),

    H("Common mistakes"),
    L(
      "**Missing dependency array:** the effect runs after every draw, and if it sets state it can loop forever.",
      "**Lying about dependencies:** leaving out a value the effect uses, which gives old data.",
      "**Forgetting cleanup** for timers, listeners and connections.",
      "**Making the effect function `async`:** an effect must return nothing or a cleanup function, but an async function returns a promise. Put an async function inside the effect and call it.",
      "**Using an effect for something that can be calculated** while drawing.",
    ),
    C('jsx', `// Right way to use async in an effect
useEffect(() => {
  async function load() {
    const response = await fetch('/api/data');
    setData(await response.json());
  }
  load();
}, []);`),
    ...task(
      "Make a component that shows the current window width and cleans up its listener.",
      "Make a timer that counts seconds and stops when you hide it with a button.",
      "Change the page title to show the number of items in a to-do list.",
      "Open the browser console, add a `console.log` in the effect and its cleanup, and watch the order.",
    ),
    ...check("The timer stops when the component is removed (no more logs).", "The window width updates as you resize the browser.", "You can say in one sentence what each of the three dependency array forms does."),
    H("Summary"),
    L(
      "`useEffect` runs code after the screen is drawn, for work outside React such as fetching, timers and listeners.",
      "The dependency array decides when it runs again: none means every draw, `[]` means once, values mean when they change.",
      "Return a cleanup function to stop timers and remove listeners.",
      "Do not use an effect for things you can calculate, or for reacting to clicks.",
    ),
  ], [
    { q: 'What is the dependency array in useEffect?', a: 'It is a list of values the effect uses. React runs the effect again only when one of them has changed since the last draw.' },
    { q: 'Why does useEffect run twice?', a: 'In development StrictMode runs effects, cleanup and effects again once to check that your cleanup works. It does not happen in the real built site.' },
    { q: 'Can the effect function be async?', a: 'No. Define an async function inside the effect and call it, because an effect must return nothing or a cleanup function.' },
    { q: 'When should I not use useEffect?', a: 'When you can calculate a value while drawing, or when the code belongs in an event handler such as a click or a form submit.' },
  ], 'react useeffect, useeffect dependency array, useeffect cleanup, react side effects, useeffect infinite loop'),

  // ---------------------------------------------------------------- 12
  lesson(S2, 'fetch-data-in-react-loading-error-states', 'Fetching Data in React: fetch, Loading, Errors and Cancelling Requests', 'Load data from an API the right way. Handle loading and errors, avoid old responses, cancel requests, and send data with POST.', '', [
    P("Almost every real app talks to a server. A shop loads products, a news site loads articles, a dashboard loads numbers. In this lesson you will learn how to load data in React in a way that is safe: you will show a loading message, handle errors, and avoid a few bugs that catch many people."),

    H("The fetch function"),
    P("`fetch` is built into the browser. It sends a request and gives back a **promise**, a placeholder for a result that arrives later. You wait for it with `await` inside an `async` function."),
    C('js', `async function loadPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  if (!response.ok) {
    throw new Error('Request failed with status ' + response.status);
  }
  const posts = await response.json();
  return posts;
}`),
    L(
      "`fetch(url)` starts the request.",
      "`response.ok` is true for success statuses (200 to 299). **`fetch` does not throw on a 404 or 500.** It only throws when the network itself fails. So you must check `response.ok` yourself.",
      "`response.json()` reads the body and turns the JSON text into JavaScript data. It is also a promise, so we `await` it.",
    ),

    H("The three states of a request"),
    P("While waiting, a component is in one of three situations: **loading**, **error** or **success**. Keep one piece of state for each of the first two, and one for the data:"),
    C('jsx', `import { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if (!response.ok) throw new Error('Status ' + response.status);
        setPosts(await response.json());
      } catch (err) {
        setError('Could not load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <ul>
      {posts.map((post) => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}`),
    P("Read it slowly. We start with `loading` true. Inside `try` we fetch and check the status. If anything fails, `catch` sets a friendly message (do not show raw technical errors to visitors). `finally` runs in both cases and turns off loading. Then, below, we use early returns, as the conditional rendering lesson showed, so each screen is clear."),

    H("The old response problem (race condition)"),
    P("Imagine a page that loads user data when `userId` changes. The person clicks user 1, then quickly user 2. Two requests are in flight. If the answer for user 1 arrives **after** the answer for user 2, the page shows user 1's data while the heading says user 2. This is a **race condition**, and it is a real bug in real apps."),
    P("The fix is to use the cleanup function of the effect to cancel the old request. The browser gives us `AbortController` for this:"),
    C('jsx', `function User({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setUser(null);
    setError('');

    async function load() {
      try {
        const response = await fetch('/api/users/' + userId, { signal: controller.signal });
        if (!response.ok) throw new Error('Status ' + response.status);
        setUser(await response.json());
      } catch (err) {
        if (err.name !== 'AbortError') setError('Could not load this user.');
      }
    }
    load();

    return () => controller.abort();   // cancel the old request
  }, [userId]);

  if (error) return <p role="alert">{error}</p>;
  if (!user) return <p>Loading...</p>;
  return <h2>{user.name}</h2>;
}`),
    P("When `userId` changes, React runs the cleanup first, which calls `controller.abort()`. The old request stops, and `fetch` throws an `AbortError`. We ignore that special error because it is not a real problem. Only the newest request can set the state. This small pattern makes your data loading safe."),
    N("This is also what makes `StrictMode` happy: the double run in development starts a request, cancels it, and starts it again. With cleanup, nothing breaks."),

    H("Sending data with POST"),
    P("To create something on a server, send a POST request with a JSON body. Do this in an event handler (such as form submit), not in an effect:"),
    C('jsx', `async function handleSubmit(event) {
  event.preventDefault();
  setSaving(true);
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Status ' + response.status);
    const saved = await response.json();
    setNotes([...notes, saved]);
    setText('');
  } catch (err) {
    setError('Could not save your note.');
  } finally {
    setSaving(false);
  }
}`),
    L(
      "`method: 'POST'` says we are creating.",
      "The `Content-Type` header tells the server the body is JSON.",
      "`JSON.stringify` turns your JavaScript object into JSON text.",
      "A `saving` state lets you disable the button, so people cannot click twice.",
    ),

    H("Put the logic in one helper"),
    P("If every component repeats `fetch`, headers and error checks, you get a lot of copied code. Write a small helper once:"),
    C('js', `// api.js
export async function api(path, options = {}) {
  const response = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) {
    throw new Error('Request failed: ' + response.status);
  }
  return response.status === 204 ? null : response.json();
}

// use it
// const notes = await api('/notes');
// await api('/notes', { method: 'POST', body: { text: 'Buy milk' } });`),
    P("Now each component can focus on its screen. Later you can add things like a login token in one place. In lesson 25 you will meet a library, TanStack Query, that does loading, errors, caching and refreshing for you, and you will see how much code it saves."),

    H("Good habits"),
    L(
      "Always show a loading state, an error state and an empty state.",
      "Show friendly messages to people, and write the technical details to the console.",
      "Cancel or ignore old requests when inputs change.",
      "Never put secret keys in React code. Everything in the browser can be read by visitors. Keep secrets on a server.",
      "For text search, wait until the person stops typing (debounce) before sending a request. Lesson 21 shows how.",
    ),

    H("Common mistakes"),
    L(
      "Not checking `response.ok` and then trying to read a 404 page as data.",
      "Making the effect function `async` directly.",
      "Forgetting the dependency array, so the fetch runs after every draw in a loop.",
      "No loading state, so the page flashes or shows an empty list that looks like “no data”.",
      "Forgetting `JSON.stringify` and the `Content-Type` header for POST.",
    ),
    ...task(
      "Load five posts from the sample API above and show Loading, an error message and the list.",
      "Break the URL on purpose and check that your error message shows.",
      "Add a button that loads the next five posts, and make sure old responses cannot overwrite new ones.",
      "Create a small `api` helper and use it in your component.",
    ),
    ...check("You see Loading first, then the posts.", "A wrong URL shows your friendly error and not a crash.", "Clicking the button quickly never shows posts in the wrong order."),
    H("Summary"),
    L(
      "Use `fetch` inside an effect (or an event handler for POST). Check `response.ok`, because fetch does not throw on 404 or 500.",
      "Keep loading, error and data state, and show each one clearly.",
      "Use `AbortController` and the effect cleanup to avoid showing old responses.",
      "Put repeated fetch code in one helper, and never put secrets in React code.",
    ),
  ], [
    { q: 'Why does fetch not throw an error for a 404?', a: 'Fetch only fails when the network fails. A 404 or 500 is still a valid response, so you must check response.ok yourself.' },
    { q: 'What is a race condition in data fetching?', a: 'Two requests are sent, and the older one finishes last, so old data replaces new data. Cancel old requests with AbortController to avoid it.' },
    { q: 'Should I use axios instead of fetch?', a: 'Fetch is built in and enough for most apps. Axios adds some convenience, but you do not need it. Learn fetch first.' },
    { q: 'Where should I call fetch: in an effect or an event handler?', a: 'Use an effect to load data when a component appears or its inputs change. Use an event handler for actions such as submitting a form.' },
  ], 'react fetch data, react api call, react loading error state, abortcontroller react, react post request'),

  // ---------------------------------------------------------------- 13
  lesson(S2, 'react-useref-hook-dom-access', 'React useRef Explained: Access the DOM and Keep Values Without Redrawing', 'Learn useRef in plain words: focus an input, scroll to an element, keep timers and previous values, and know when to choose a ref instead of state.', '', [
    P("State is for data that the screen shows. But sometimes you need to remember something that the screen does **not** show, or reach a real element on the page. For these cases, React gives you `useRef`. It is small, but very useful once you understand it."),

    H("What is a ref?"),
    P("A **ref** is a box that holds a value. You make one with `useRef(initialValue)`. It returns an object with a single field, `current`, that holds the value."),
    C('jsx', `import { useRef } from 'react';

const box = useRef(0);
console.log(box.current);   // 0
box.current = 5;            // change it`),
    P("Two facts make refs special:"),
    L(
      "React **keeps** the ref between draws, so the value is not lost, just like state.",
      "Changing `ref.current` does **not** make React draw the component again, unlike state.",
    ),
    P("So a ref is like a private notebook: you can write in it and read from it, but writing does not tell the screen to change."),

    H("Use 1: focus an input"),
    P("The most common use is to reach a real element in the page. Give the element a `ref` prop. After the element is drawn, React puts it in `ref.current`."),
    C('jsx', `function SearchBox() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={handleClick}>Focus the search box</button>
    </div>
  );
}`),
    P("Before the first draw, `inputRef.current` is `null`. After the page is drawn, it points to the real input element, so you can call browser methods such as `.focus()`. You can only use it in event handlers and effects, not while drawing."),
    P("A common case: focus the first field of a form when the page opens."),
    C('jsx', `useEffect(() => {
  inputRef.current.focus();
}, []);`),
    P("Another case: when a form shows an error, move the focus to the first wrong field. That helps people who use keyboards or screen readers."),

    H("Use 2: scroll to an element"),
    C('jsx', `function Page() {
  const bottomRef = useRef(null);

  return (
    <div>
      <button onClick={() => bottomRef.current.scrollIntoView({ behavior: 'smooth' })}>
        Go to the bottom
      </button>
      <div style={{ height: 1500 }}>Long content</div>
      <p ref={bottomRef}>You reached the bottom!</p>
    </div>
  );
}`),
    P("A chat window uses the same trick: after a new message is added, scroll the last message into view."),

    H("Use 3: keep a value that does not affect the screen"),
    P("Some values must survive between draws, but do not change what is on the screen. A timer id is the classic example:"),
    C('jsx', `function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const timerId = useRef(null);

  function start() {
    if (timerId.current) return;            // already running
    timerId.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stop() {
    clearInterval(timerId.current);
    timerId.current = null;
  }

  useEffect(() => stop, []);   // stop when the component goes away

  return (
    <div>
      <p>{seconds} seconds</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}`),
    P("The `seconds` value is **state**, because the screen shows it. The `timerId` is a **ref**, because the screen does not show it, and we do not want a redraw when we set it."),

    H("Use 4: remember the previous value"),
    C('jsx', `function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Price({ price }) {
  const before = usePrevious(price);
  return <p>Now {price}, before {before}</p>;
}`),
    P("The hook returns the value **from the last draw**, because the effect updates the ref only after the draw is done. This small custom hook is a nice example of a ref storing a value quietly."),

    H("Ref or state: how to choose"),
    L(
      "If the screen must change when the value changes, use **state**.",
      "If you only need to remember it, or hold a real element, use a **ref**.",
      "Never read or write `ref.current` while the component is drawing. Do it in event handlers or effects.",
    ),
    N("A very common mistake is to use a ref to avoid a redraw when the data really is shown on the screen. Then the screen goes out of date. If the person can see it, it should be state."),

    H("Refs and other components"),
    P("A ref on your own component does not work the same way as on a plain element. In React 19 you can pass `ref` as a normal prop to your own components:"),
    C('jsx', `function FancyInput({ ref, ...props }) {
  return <input ref={ref} className="fancy" {...props} />;
}

function Form() {
  const ref = useRef(null);
  return (
    <>
      <FancyInput ref={ref} />
      <button onClick={() => ref.current.focus()}>Focus</button>
    </>
  );
}`),
    P("In older versions of React (18 and before) you had to wrap the component in a function called `forwardRef`. You may see that in older code. It does the same job."),

    H("Uncontrolled inputs with refs"),
    P("You can read an input's value with a ref instead of keeping it in state. This is called an **uncontrolled** input. It is shorter for simple cases, because you do not redraw on every key press:"),
    C('jsx', `function QuickForm() {
  const emailRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Email is', emailRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} type="email" defaultValue="" />
      <button>Send</button>
    </form>
  );
}`),
    P("Notice `defaultValue` instead of `value`: it sets only the starting text, and the browser keeps control after that."),

    H("Common mistakes"),
    L(
      "Reading `ref.current` when it is still `null`, for example during the first draw. Use it in handlers and effects.",
      "Using a ref for data that the screen shows, so the screen does not update.",
      "Forgetting `.current`. The ref is an object. The value is in `ref.current`.",
      "Writing to `ref.current` while drawing. It makes the component unpredictable.",
      "Using refs to change the page in ways React should handle. Prefer state for anything that changes what is drawn.",
    ),
    ...task(
      "Make a form that focuses the name field when the page opens.",
      "Make a button that scrolls smoothly to a section at the bottom of the page.",
      "Make a stopwatch with Start, Stop and Reset buttons using a ref for the timer id.",
      "Show the previous value of a counter using `usePrevious`.",
    ),
    ...check("The cursor is in the name field when the page opens.", "The stopwatch stops when you press Stop and does not run twice when you press Start twice.", "No timers keep running after the component is removed."),
    H("Summary"),
    L(
      "`useRef(initial)` gives an object with `current`. React keeps it between draws, and changing it does not cause a redraw.",
      "Put a ref on an element to get the real DOM node, for example to focus it or scroll it into view.",
      "Use refs for timer ids, previous values and other things the screen does not show.",
      "If the screen shows it, use state, not a ref.",
    ),
  ], [
    { q: 'What is the difference between useRef and useState?', a: 'Changing state makes the component draw again. Changing a ref does not. Use state for data the screen shows, and a ref for values you only need to remember.' },
    { q: 'Why is ref.current null?', a: 'The element has not been drawn yet. Refs are filled after the first draw, so use them inside event handlers or effects.' },
    { q: 'What is forwardRef?', a: 'In React 18 and older, it was the way to pass a ref through your own component. In React 19, you can pass ref as a normal prop.' },
    { q: 'Should I use refs to read form values?', a: 'You can, for simple forms. This is called uncontrolled input. For forms that check values as people type, controlled inputs with state are easier.' },
  ], 'react useref, useref focus input, react ref dom, react uncontrolled input, react forwardref'),

  // ---------------------------------------------------------------- 14
  lesson(S2, 'lifting-state-up-and-component-composition', 'Lifting State Up and Component Composition in React', 'Learn where state should live, how two components can share data through a parent, and how composition with children avoids passing props through many levels.', '', [
    P("As an app grows, you meet a new question: **where should this state live?** Two components far apart might need the same data. This lesson shows the simple rule that answers most of these questions, and a second idea, composition, that keeps your code clean."),

    H("The problem: two components, one value"),
    P("Imagine a page with a temperature input in Celsius and a display of the same temperature in Fahrenheit. Each is a separate component. They both need the same number. If each keeps its own state, they will disagree. The numbers must come from **one place**."),

    H("Lifting state up"),
    P("The rule: **move the state to the closest parent that is shared by the components that need it**. The parent keeps the state and passes the value down with props. When a child wants to change it, the parent also passes down a function."),
    C('jsx', `function TemperatureApp() {
  const [celsius, setCelsius] = useState(20);

  return (
    <div>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitDisplay celsius={celsius} />
    </div>
  );
}

function CelsiusInput({ value, onChange }) {
  return (
    <label>
      Celsius
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function FahrenheitDisplay({ celsius }) {
  const fahrenheit = (celsius * 9) / 5 + 32;
  return <p>That is {fahrenheit.toFixed(1)} degrees Fahrenheit.</p>;
}`),
    P("The state lives in `TemperatureApp`. `CelsiusInput` has no state of its own: it shows the `value` it is given, and calls `onChange` when the person types. `FahrenheitDisplay` calculates its answer from the same number. Because there is only one copy of the data, the two parts can never disagree. This is called **a single source of truth**."),
    P("Also notice that `fahrenheit` is not state. It is calculated from `celsius`. Do not store in state what you can calculate."),

    H("Data down, events up"),
    P("This is the basic rhythm of React:"),
    L(
      "**Data goes down:** parents pass values to children as props.",
      "**Events go up:** children call functions given by the parent, and the parent changes its state.",
    ),
    P("It keeps the app easy to follow. When a value looks wrong, you look at the component that owns the state. There is only one place to check."),

    H("How high should state go?"),
    P("Not too high, not too low. Keep state as **close to where it is used** as you can, and lift it only when two or more components really need it. If you put everything at the top, every small change redraws a lot and the code is hard to read. A good test: ask “who needs to know this?”, and find the lowest component that is a parent of all of them."),

    H("The problem of passing props down many levels"),
    P("Sometimes the component that needs the data is deep in the tree. You end up passing a prop through many components that do not use it, only to hand it on. People call this **prop drilling**."),
    C('jsx', `<Page user={user}>
  <Header user={user}>
    <Menu user={user}>
      <Avatar user={user} />   {/* only Avatar uses it */}
    </Menu>
  </Header>
</Page>`),
    P("For two or three levels this is fine and clear. For many levels there are two good fixes. The first is **composition**, shown next. The second is **context**, which lesson 16 covers."),

    H("Composition: pass components as children"),
    P("Instead of passing data down through the middle layers, build the part that needs the data at the top, and pass it **as children or as a prop**. The middle layers then do not need to know about it."),
    C('jsx', `function Page({ user }) {
  return (
    <Layout
      header={<Header avatar={<Avatar user={user} />} />}
    />
  );
}

function Layout({ header }) {
  return <div>{header}</div>;
}

function Header({ avatar }) {
  return <nav>{avatar}</nav>;
}`),
    P("`Page` has the data and builds `Avatar` itself. `Layout` and `Header` only place whatever they are given. No prop drilling, and these components become more reusable, because they can hold anything."),
    P("This idea, **composition over configuration**, is a very React way to think. Instead of a component with many options (`showIcon`, `iconPosition`, `iconColor`), give it a place where you can put anything:"),
    C('jsx', `function Panel({ title, actions, children }) {
  return (
    <section>
      <header>
        <h2>{title}</h2>
        <div>{actions}</div>
      </header>
      {children}
    </section>
  );
}

<Panel title="Settings" actions={<button>Save</button>}>
  <p>Choose your options below.</p>
</Panel>`),

    H("Moving state back down"),
    P("Sometimes a part of the state is only used by one child, but was lifted to a parent too early. Moving it back down makes the parent simpler. Example: the text in a search box is used only by the search box, until you press Search. Keep the text inside the box, and only send the final text up on submit."),

    H("Derived data and a single source of truth"),
    L(
      "Keep **minimal state**: the smallest set of values that describes the situation.",
      "Calculate everything else while drawing: totals, filtered lists, counts, labels.",
      "Never keep the same fact in two places. Copies drift apart. If two components need it, they get it from one owner.",
    ),
    C('jsx', `// Bad: two copies that can get out of step
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);

// Good: calculate the count
const [items, setItems] = useState([]);
const count = items.length;`),

    H("A worked example: a shopping page"),
    P("A shop page has a product list and a cart summary in the header. Both depend on the same cart. The page component owns the cart state, passes the cart to the header (to show the count), and passes an `onAdd` function to each product. When someone clicks Add on a product, the product calls `onAdd(product)`. The page adds the product to the cart with a new array. React draws again, and the header shows the new count. No component keeps its own copy of the cart. You will build this in the task below."),

    H("Common mistakes"),
    L(
      "Keeping the same value in two components, so they show different numbers.",
      "Lifting state too high, so the whole page redraws for a small change.",
      "Forgetting to pass the handler down, so the child cannot change the parent.",
      "Storing derived data in state, such as a count or a filtered list.",
      "Passing the setter itself to deep children everywhere instead of a clear `onSomething` function.",
    ),
    ...task(
      "Build the temperature example above and add a Kelvin display.",
      "Build a small shop: a list of three products, each with an Add button, and a header showing how many items are in the cart. Keep the cart state in the page.",
      "Add a `Panel` component with `title`, `actions` and `children`, and use it twice.",
    ),
    ...check("All displays change together when the input changes.", "The cart count in the header always matches the items added.", "No state is stored that could be calculated."),
    H("Summary"),
    L(
      "When two components need the same state, move it to their closest shared parent. This keeps one source of truth.",
      "Data goes down with props. Events go up with function props.",
      "Keep state minimal and calculate the rest while drawing.",
      "Use composition (`children` and component props) to avoid long chains of props.",
    ),
  ], [
    { q: 'What does lifting state up mean?', a: 'Moving the state from a child to the closest parent that is shared by all the components that need it, and passing it down with props.' },
    { q: 'What is prop drilling?', a: 'Passing props through many levels of components that do not use them, only to reach a deep child. Composition or context can fix it.' },
    { q: 'When should I use composition instead of context?', a: 'Try composition first. Pass components as children or props from the top. Use context when many components at different depths really need the same data.' },
    { q: 'Where should state live?', a: 'As low as possible, but high enough that every component that needs it can reach it through a shared parent.' },
  ], 'lifting state up react, react prop drilling, react composition children, react single source of truth, react state management basics'),

  // ---------------------------------------------------------------- 15
  lesson(S2, 'react-usereducer-hook-explained', 'React useReducer Explained: Manage Complex State with Actions', 'Learn useReducer step by step with a shopping cart. Understand actions, the reducer function, and when it is better than useState.', '', [
    P("`useState` is perfect for simple values. But when a component has many pieces of state that change together, or many ways to change them, the code can become messy. The `useReducer` hook gives you a tidy way to organise it. It is a favourite for complex state, and it is also the idea behind Redux, which you will meet later."),

    H("The problem: too many setters"),
    P("Look at a to-do list that can add, toggle, delete and clear finished tasks. With `useState`, handlers each have their own logic spread around the component:"),
    C('jsx', `function addTask(text) { setTasks([...tasks, { id: Date.now(), text, done: false }]); }
function toggleTask(id) { setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); }
function deleteTask(id) { setTasks(tasks.filter((t) => t.id !== id)); }
function clearDone() { setTasks(tasks.filter((t) => !t.done)); }`),
    P("This is fine for four. For fifteen kinds of changes, or when the state has many fields, it is hard to see all the rules in one place. `useReducer` moves all of the rules into **one function**."),

    H("The idea: actions and a reducer"),
    L(
      "An **action** is a small object that describes **what happened**, for example `{ type: 'added', text: 'Buy milk' }`. It does not change anything. It is a message.",
      "A **reducer** is a function that takes the **current state** and an **action**, and returns the **new state**. All of the rules are in it.",
      "`dispatch` is the function you call to send an action to the reducer.",
    ),
    P("You can think of it like a shop: customers (your components) do not walk to the shelves and change the stock. They hand a note (an action) to the shopkeeper (the reducer), who updates the stock by the rules."),

    H("A first example: the counter"),
    C('jsx', `import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}`),
    P("`useReducer(reducer, initialState)` returns the current state and `dispatch`. When you call `dispatch({ type: 'increment' })`, React calls `reducer(currentState, thatAction)` and uses the returned object as the new state, then draws again. The `switch` lists every way the state can change, in one readable place."),

    H("The rules of a reducer"),
    L(
      "**It must be pure:** the same state and action always give the same result. No fetching, no random numbers, no changing outside things inside it.",
      "**It must not change the old state.** Return a **new** object or array. Copy with spread, `map` and `filter`, just as in the state lessons.",
      "**Always return something.** If an action is not known, throw an error or return the old state.",
    ),

    H("A real example: a to-do list"),
    C('jsx', `const initial = [];

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added':
      return [...tasks, { id: action.id, text: action.text, done: false }];
    case 'toggled':
      return tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'deleted':
      return tasks.filter((t) => t.id !== action.id);
    case 'cleared':
      return tasks.filter((t) => !t.done);
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

function TodoApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initial);
  const [text, setText] = useState('');

  function handleAdd(event) {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: 'added', id: crypto.randomUUID(), text: text.trim() });
    setText('');
  }

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button>Add</button>
      </form>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: 'toggled', id: t.id })} />
              {t.text}
            </label>
            <button onClick={() => dispatch({ type: 'deleted', id: t.id })}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch({ type: 'cleared' })}>Clear finished</button>
    </div>
  );
}`),
    P("The component only says **what happened** (`added`, `toggled`, `deleted`). It does not know how the list changes. All the rules live in `tasksReducer`. You can read that one function and understand every change. You can even move it to its own file and test it without React, because it is a plain function."),
    P("Notice that the form text uses a normal `useState`. You can mix them: use `useState` for simple, local values and `useReducer` for the state with many rules. The id is made **before** dispatching, because a reducer must be pure and cannot make random ids itself."),

    H("Action names"),
    P("Name actions after **what happened**, in the past tense: `'added'`, `'deleted'`, `'form_submitted'`, rather than commands like `'setTasks'`. This keeps the reducer about events and makes logs easy to read. You may send extra data in the action, such as `id` or `text`, often named `payload`."),

    H("useState or useReducer?"),
    L(
      "**useState** is shorter for simple, independent values: a toggle, a text box, a counter.",
      "**useReducer** shines when the next state depends on the old one in several ways, when state has many related fields, or when you want all the rules in one place that is easy to test.",
      "**Start with useState.** Move to `useReducer` when your handlers start to look like a pile of rules.",
    ),
    P("A bonus: when many deep components need to change the state, you can pass `dispatch` down instead of many handler functions. React keeps `dispatch` the same between draws, so it is also safe in effects. Together with context (lesson 16), `useReducer` gives you a small state manager without any library."),

    H("A form state example"),
    C('jsx', `function formReducer(state, action) {
  switch (action.type) {
    case 'field_changed':
      return { ...state, values: { ...state.values, [action.name]: action.value } };
    case 'submit_started':
      return { ...state, status: 'sending', error: '' };
    case 'submit_failed':
      return { ...state, status: 'idle', error: action.message };
    case 'submit_succeeded':
      return { values: { name: '', email: '' }, status: 'done', error: '' };
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

const start = { values: { name: '', email: '' }, status: 'idle', error: '' };`),
    P("Here the form has values, a status and an error that change together. With four named actions, each step of the form is easy to read: a field changed, sending started, sending failed, sending worked. The status can be `idle`, `sending` or `done`, so there are no impossible combinations like “loading” and “done” both true."),

    H("Common mistakes"),
    L(
      "Changing the state inside the reducer (`state.count++` or `tasks.push(...)`). Return a new value.",
      "Making ids or calling `fetch` inside the reducer. Do those before dispatching.",
      "Forgetting a `return` in a case, so the new state becomes `undefined`.",
      "Writing actions as commands that hide meaning, such as `'set'`.",
      "Using `useReducer` for a single toggle, which is more code than needed.",
    ),
    ...task(
      "Build the counter with a `step` field, and an action `'step_changed'`.",
      "Build the to-do list above, and add an action `'edited'` that changes the text of a task.",
      "Build a shopping cart reducer with actions `'added'`, `'quantity_changed'` and `'removed'`, and show the total price.",
      "Write the reducer in a separate file and test it with a few plain function calls in the console.",
    ),
    ...check("The list stays correct after any mix of actions.", "The reducer never changes the old state (you always return a new array or object).", "You can find every possible change of the state in one function."),
    H("Summary"),
    L(
      "`useReducer(reducer, initial)` gives `[state, dispatch]`. Call `dispatch(action)` and React runs the reducer to get the new state.",
      "An action describes what happened. A reducer is a pure function `(state, action) => newState`.",
      "Never change old state in a reducer. Return new arrays and objects.",
      "Start with `useState`. Use `useReducer` when state logic becomes complex.",
    ),
  ], [
    { q: 'When should I use useReducer instead of useState?', a: 'When the state has many related fields or many kinds of updates, and you want all the rules in one place that is easy to read and test. For simple values, useState is shorter.' },
    { q: 'What is an action?', a: 'A small object that describes what happened, such as { type: "added", text: "Buy milk" }. It is sent to the reducer with dispatch.' },
    { q: 'Why must a reducer be pure?', a: 'React may call it more than once and expects the same result for the same input. Doing outside work inside it, like fetching, makes it unpredictable.' },
    { q: 'Is useReducer the same as Redux?', a: 'The idea is the same: actions and a reducer. Redux adds a global store, tools and extra features for large apps. useReducer works inside one component tree.' },
  ], 'react usereducer, useReducer example, react reducer action dispatch, usereducer vs usestate, react complex state'),
];
