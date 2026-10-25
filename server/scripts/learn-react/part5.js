import { P, H, L, O, N, C, task, check, lesson } from './helpers.js';

const S2 = 'Hooks and Data';

export const lessons = [
  // ---------------------------------------------------------------- 16
  lesson(S2, 'react-context-api-usecontext-explained', 'React Context API Explained: Share Data Without Passing Props', 'Learn createContext, Provider and useContext with a theme and a login example. Know when context is right, and what to watch for.', '', [
    P("In the lifting state lesson we met **prop drilling**: passing data through many components that do not use it. Context is React's built-in way to make some data available to **any** component below a certain point, without passing props through every level. Think of it as a shared board in a building that every room can read."),

    H("When is context a good choice?"),
    P("Use context for data that many components at different levels need, and that does not change very often. Typical examples:"),
    L(
      "The **current user** who is signed in.",
      "The **theme**: light or dark.",
      "The chosen **language**.",
      "A **shopping cart** used by the header, the product pages and the checkout.",
    ),
    P("Do not use context for everything. If only a parent and child need a value, props are simpler and clearer."),

    H("The three steps"),
    O(
      "**Create** the context with `createContext(defaultValue)`.",
      "**Provide** a value with `<Context.Provider value={...}>` around the part of the page that needs it.",
      "**Use** the value in any component below with `useContext(Context)`.",
    ),

    H("Example: a theme"),
    P("First we create the context, in its own file:"),
    C('jsx', `// ThemeContext.jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}`),
    P("`ThemeProvider` is a normal component that keeps the theme in state and shares it. `children` is whatever you put inside it. We also export a small helper, `useTheme`, so other components do not need to know about `useContext` or the context object. It is a custom hook, which lesson 17 explains."),
    P("Next we wrap the app once, near the top:"),
    C('jsx', `// main.jsx
createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);`),
    P("Now any component, at any depth, can read the theme:"),
    C('jsx', `function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}

function Page() {
  const { theme } = useTheme();
  return <main className={theme}>Hello!</main>;
}`),
    P("No props travel through the layers between. When `toggleTheme` runs, the provider's state changes, and every component that uses the context draws again with the new value."),

    H("Example: the signed-in user"),
    C('jsx', `const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(name) { setUser({ name }); }
  function logout() { setUser(null); }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return value;
}`),
    P("The check in `useAuth` is a helpful habit. If you forget to wrap your app in the provider, you get a clear error message instead of a confusing `undefined`."),
    C('jsx', `function Header() {
  const { user, logout } = useAuth();
  return user ? (
    <p>Hello {user.name} <button onClick={logout}>Log out</button></p>
  ) : (
    <p>Please sign in.</p>
  );
}`),

    H("How context finds its value"),
    P("`useContext` looks **up** the tree for the nearest provider of that context. You can even put a provider inside another one to change the value for one part of the page only. If there is no provider above, you get the **default value** from `createContext(defaultValue)`."),

    H("A performance warning"),
    P("When the value in a provider changes, **every component that reads that context draws again**. In the examples above we wrote `value={{ theme, toggleTheme }}`, which makes a new object on every draw of the provider, so all readers redraw even when nothing really changed. For small apps this is fine. In bigger apps you can keep the value steady with `useMemo`, which lesson 21 covers:"),
    C('jsx', `const value = useMemo(() => ({ user, login, logout }), [user]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;`),
    L(
      "Split big contexts: one for the user, one for the theme, one for the cart. A change in one does not redraw the readers of the others.",
      "Keep rarely changing and often changing data in different contexts.",
      "Put the provider as low in the tree as it can be, only around the parts that need it.",
    ),

    H("Context and useReducer together"),
    P("For bigger shared state, combine them. The reducer holds the rules, and the context shares the state and `dispatch`:"),
    C('jsx', `const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}`),
    P("This is a small, complete state manager with no extra library. For very large apps or special needs you can reach for Redux Toolkit or Zustand, which lesson 24 introduces."),

    H("Context is not a database"),
    P("Context only **shares** state with components. The state itself still lives in `useState` or `useReducer` inside the provider. If you need data from a server, load it (lesson 12) and then put the result in the provider, or use a data library (lesson 25)."),

    H("Common mistakes"),
    L(
      "Forgetting the provider, so the component gets the default value (often `null`).",
      "Putting everything in one giant context, so every change redraws everything.",
      "Using context for data that only one parent and child share, where props are simpler.",
      "Making the value a new object every draw without thinking about performance in a larger app.",
      "Trying to change a context value directly. You must call the function the provider shares, which changes the provider's state.",
    ),
    ...task(
      "Build a `ThemeProvider` with a toggle button, and show the theme name in two different components.",
      "Build an `AuthProvider` with `login` and `logout`, and show different content in a header for each case.",
      "Make `useTheme` throw a helpful error when used outside a provider.",
      "Create a `CartProvider` with `useReducer` and show the number of items in the header and in a cart page.",
    ),
    ...check("Both components change when you press the toggle.", "Using the hook outside a provider shows your clear error message.", "The cart count in the header always matches the cart page."),
    H("Summary"),
    L(
      "Context shares data with any component below a provider, with no prop drilling.",
      "Steps: `createContext`, wrap with `Provider value={...}`, read with `useContext`.",
      "Wrap the context in a custom hook, and check that a provider exists.",
      "A changed value redraws every reader. Split contexts and keep values steady in big apps.",
    ),
  ], [
    { q: 'What is the React Context API used for?', a: 'To share data such as the user, theme or language with many components at different levels, without passing props through every level.' },
    { q: 'Does context replace Redux?', a: 'For small and medium apps, context with useReducer is often enough. Redux and similar libraries add tools and optimisations that help in large apps.' },
    { q: 'Why do all my components redraw when context changes?', a: 'Every component that reads a context draws again when its value changes. Split big contexts into smaller ones, and keep the value steady.' },
    { q: 'Where should I put the provider?', a: 'Around the smallest part of the tree that needs the data. Often that is the top of the app, for things like the user and theme.' },
  ], 'react context api, react usecontext, react createcontext provider, react prop drilling solution, react theme context'),

  // ---------------------------------------------------------------- 17
  lesson(S2, 'react-custom-hooks-reuse-logic', 'React Custom Hooks: Reuse Logic Between Components', 'Learn to write your own hooks. Build useToggle, useLocalStorage, useFetch and useDebounce, and learn the rules that keep hooks safe.', '', [
    P("You already use hooks that React gives you: `useState`, `useEffect` and others. React also lets you make **your own hooks**. A custom hook is a normal JavaScript function that uses other hooks and lets you **reuse logic** in many components. Components share their screens, and custom hooks share their behaviour."),

    H("What is a custom hook?"),
    P("A custom hook is a function whose name starts with `use`, and which calls other hooks inside. That is all. The name matters: it tells React, and the lint rules, that the function follows the rules of hooks. Each component that calls a custom hook gets **its own separate copy** of the state inside it. Hooks share the logic, not the data."),

    H("Example 1: useToggle"),
    P("Many components have a true or false switch: a menu, a modal, a password field. Instead of writing the same state and handler each time, write a hook once:"),
    C('jsx', `import { useState } from 'react';

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((value) => !value);
  return [on, toggle];
}`),
    C('jsx', `function Menu() {
  const [open, toggleOpen] = useToggle(false);
  return (
    <div>
      <button onClick={toggleOpen}>{open ? 'Close' : 'Open'}</button>
      {open && <ul><li>Home</li><li>About</li></ul>}
    </div>
  );
}`),
    P("The hook returns an array, just like `useState`. You can return an object instead when there are many values. Choose what is easier to read for the person using the hook."),

    H("Example 2: useLocalStorage"),
    P("Saving a value in the browser, so that it is still there after a reload, needs a little code that you will want in many places. Put it in a hook:"),
    C('jsx', `import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage may be full or blocked: ignore */
    }
  }, [key, value]);

  return [value, setValue];
}`),
    C('jsx', `function Settings() {
  const [name, setName] = useLocalStorage('username', '');
  return <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />;
}`),
    P("Two details to notice. First, `useState(() => ...)` takes a **function**, called **lazy initial state**. React runs it only on the first draw, so we read storage once, not on every draw. Second, `try` and `catch` protect us, because storage can be blocked, for example in private browsing. Never store passwords or private data in `localStorage`, because any script on the page can read it."),

    H("Example 3: useFetch"),
    P("Loading, error and data appeared in the data lesson. Wrap them once:"),
    C('jsx', `import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    async function load() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Status ' + response.status);
        setData(await response.json());
      } catch (err) {
        if (err.name !== 'AbortError') setError('Could not load data.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}`),
    C('jsx', `function Posts() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/posts?_limit=3');

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;
  return <ul>{data.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}`),
    P("The component is now only a few lines, and it still handles loading, errors and cancelling. If you later improve `useFetch`, every component gets the improvement. For big apps, a library like TanStack Query (lesson 25) gives you a more complete version of this idea."),

    H("Example 4: useDebounce"),
    P("When someone types in a search box, you do not want to send a request on every key press. A **debounce** waits until the person pauses:"),
    C('jsx', `import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`),
    C('jsx', `function Search() {
  const [text, setText] = useState('');
  const search = useDebounce(text, 400);

  const { data } = useFetch('/api/search?q=' + encodeURIComponent(search));
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}`),
    P("Each key press sets a new timer and cancels the old one with the cleanup. Only when the person stops typing for 400 milliseconds does `debounced` change, and only then does the search start. `encodeURIComponent` makes the text safe to use in a URL."),

    H("Example 5: useWindowSize and useOnline"),
    P("Hooks are very good at wrapping browser features that need a listener and a cleanup:"),
    C('jsx', `export function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return online;
}`),
    P("Now any component can show a banner such as “You are offline” with a single line: `const online = useOnline();`."),

    H("The rules of hooks"),
    L(
      "Call hooks **only at the top level** of a component or a custom hook. Never inside `if`, loops, nested functions or after an early `return`.",
      "Call hooks **only from React components or custom hooks**, never from normal functions.",
      "Name custom hooks starting with `use`.",
    ),
    P("React remembers state by the **order** of the hook calls. If the order could change between draws, React would give the wrong state to the wrong hook. The ESLint plugin `eslint-plugin-react-hooks` checks these rules for you. Keep it on."),

    H("How to design a good hook"),
    L(
      "Give it **one clear job** and a clear name: `useDebounce`, not `useStuff`.",
      "Accept **simple inputs** (a key, a URL, a delay) and return **simple outputs**.",
      "Make it work for the first draw, for changes and for cleanup.",
      "Do not make a hook just to move code around. Make one when logic repeats, or when it makes a component much easier to read.",
    ),

    H("Where to keep hooks"),
    P("Put them in a `hooks` folder inside `src`, one file for each hook, named after it, for example `src/hooks/useDebounce.js`. A custom hook file needs no JSX, so `.js` is fine."),

    H("Common mistakes"),
    L(
      "Calling a hook inside a condition or loop.",
      "Forgetting that each call of a hook has its own separate state, and expecting two components to share data (use context for that).",
      "Missing cleanup for listeners and timers in the hook.",
      "Forgetting dependencies in the effect inside the hook.",
      "Naming the function without `use`, so the lint rules cannot help.",
    ),
    ...task(
      "Write `useToggle` and use it for a menu and for a show/hide password button.",
      "Write `useLocalStorage` and keep a dark mode choice after reload.",
      "Write `useDebounce` and use it for a search box that filters a local list.",
      "Write `useOnline` and show a banner when the internet is lost (turn the network off in your browser tools to test).",
    ),
    ...check("Each hook works in two components at the same time, with separate state.", "The saved choice survives a reload.", "Typing quickly in the search box does not filter on every key press."),
    H("Summary"),
    L(
      "A custom hook is a function starting with `use` that calls other hooks, so you can reuse logic.",
      "Each call gets its own state. Hooks share logic, not data.",
      "Good candidates: toggles, storage, fetching, debounce, browser listeners.",
      "Follow the rules of hooks: top level only, and only in components or other hooks.",
    ),
  ], [
    { q: 'What is a custom hook in React?', a: 'A function whose name starts with use and which calls other hooks. It lets you reuse state and effect logic in many components.' },
    { q: 'Do two components that use the same custom hook share state?', a: 'No. Each component gets its own copy of the state. To share data, use context or lift state up.' },
    { q: 'Why must hook names start with use?', a: 'It tells React and the lint tools that the function follows the rules of hooks, so mistakes can be found early.' },
    { q: 'Is it safe to store data in localStorage?', a: 'It is fine for simple choices like a theme. Never store passwords or private data there, because scripts on the page can read it.' },
  ], 'react custom hooks, usedebounce react, uselocalstorage hook, react usefetch hook, rules of hooks'),

  // ---------------------------------------------------------------- 18
  lesson(S2, 'react-router-pages-links-navigation', 'React Router: Multiple Pages, Links, Params, Layouts and Protected Routes', 'Build a multi-page React app with React Router. Learn routes, Link, URL parameters, nested layouts, navigation, a 404 page and protected routes.', '', [
    P("A real website has many pages: home, about, product pages, a login page. A React app is made of one HTML file, so how do we show different pages? We use **React Router**, the most used routing library for React. It changes what the screen shows when the address changes, **without** reloading the page. That makes the app feel fast."),
    N("This lesson uses React Router version 6 or newer, with the `react-router-dom` package. Names and some details can change between versions, so check the official docs if something differs."),

    H("Install and set up"),
    C('bash', `npm install react-router-dom`),
    P("Wrap your app in a **router** once, in `main.jsx`:"),
    C('jsx', `import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);`),
    P("`BrowserRouter` watches the address bar and tells your app when it changes."),

    H("Routes: which component for which address"),
    C('jsx', `import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}`),
    P("Each `Route` pairs a `path` with an `element`. React Router shows the one that matches the address. The path `*` matches anything else, so it is perfect for a **404 page**. Always add one."),

    H("Links without reloading"),
    P("A normal `<a href>` makes the browser load a whole new page and your state is lost. Use `Link` instead, which changes the address and shows the new page **without a reload**:"),
    C('jsx', `import { Link, NavLink } from 'react-router-dom';

function Menu() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
      <NavLink to="/products">Products</NavLink>
    </nav>
  );
}`),
    P("`NavLink` is a `Link` that knows when it matches the current page, so you can style the active link. For links to **other websites**, keep using a normal `<a href>`."),

    H("URL parameters"),
    P("A shop has one page design for many products, such as `/products/1` and `/products/2`. Put a **parameter** in the path with a colon, and read it with `useParams`:"),
    C('jsx', `<Route path="/products/:id" element={<ProductPage />} />

import { useParams } from 'react-router-dom';

function ProductPage() {
  const { id } = useParams();
  return <h1>Product number {id}</h1>;
}`),
    P("Parameters are always **strings**, so convert with `Number(id)` if you need a number. Use the id to load the right data, as in the fetching lesson."),

    H("Query strings (search parameters)"),
    P("The part after a question mark, like `/products?category=books&page=2`, is the query string. It is perfect for filters, search and pages, because people can **share** and **bookmark** the exact view, and the back button works."),
    C('jsx', `import { useSearchParams } from 'react-router-dom';

function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'all';

  return (
    <div>
      <p>Showing: {category}</p>
      <button onClick={() => setParams({ category: 'books' })}>Books</button>
      <button onClick={() => setParams({})}>All</button>
    </div>
  );
}`),
    P("It works like `useState`, but the state lives in the **address**. Keeping filters in the URL, rather than in private state, is a very good habit."),

    H("Shared layouts with nested routes"),
    P("Most pages share a header and a footer. Instead of repeating them, make a **layout route**. It draws the shared parts and an `Outlet`, where the matching child page appears."),
    C('jsx', `import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <Menu />
      <main>
        <Outlet />
      </main>
      <footer>Copyright</footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}`),
    P("The layout stays on the screen while only the content in the `Outlet` changes. The menu is not drawn again from nothing, so things like its state stay."),

    H("Moving with code: useNavigate"),
    P("Sometimes you must change page from code, for example after a form is saved:"),
    C('jsx', `import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    // ... check the login
    navigate('/dashboard');
  }
  return <form onSubmit={handleSubmit}>...</form>;
}`),
    P("`navigate(-1)` goes back one page, like the back button. `navigate('/x', { replace: true })` replaces the current page in the history, so the back button does not return to it. That is useful after a login."),
    P("For a simple redirect while drawing, return `<Navigate to=\"/login\" />`."),

    H("Protected routes"),
    P("Some pages should be open only to signed-in people. Make a small component that checks, and redirects if needed:"),
    C('jsx', `import { Navigate, Outlet, useLocation } from 'react-router-dom';

function RequireAuth() {
  const { user } = useAuth();        // from the context lesson
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

// in the routes
<Route element={<RequireAuth />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/settings" element={<Settings />} />
</Route>`),
    P("If there is no user, we send the visitor to the login page and remember where they wanted to go in `state`. After login, you can send them back with `navigate(location.state?.from?.pathname || '/')`."),
    N("Hiding a page in React only changes what the browser shows. **A visitor can still read any code you send to the browser.** Your server must check permissions for the data itself. Never trust the front end alone."),

    H("Scroll and titles"),
    L(
      "When the page changes, the scroll position can stay where it was. Add a small component that calls `window.scrollTo(0, 0)` when `useLocation().pathname` changes.",
      "Set a different `document.title` on each page. It helps people and search engines. A client-side React app is harder for search engines to read than normal HTML, so for pages that must rank well, think about server rendering with a framework such as Next.js.",
      "Move focus to the main heading after a change, to help keyboard and screen reader users.",
    ),

    H("Data routers (a short note)"),
    P("Newer versions of React Router also have a **data router** style, with `createBrowserRouter`, loaders and actions, which load data before showing a page. It is a good next step once you know the basics here. The ideas (routes, links, params, layouts) are the same."),

    H("Deploy note"),
    P("With client-side routing, a visit directly to `/products/3` asks the **server** for that path. Your server or host must send `index.html` for unknown paths, or visitors see a 404 on reload. Most hosts have a setting for this, called “single page app fallback” or a rewrite rule."),

    H("Common mistakes"),
    L(
      "Using `<a href>` for inside links, which reloads the page.",
      "Forgetting the `*` route for 404.",
      "Forgetting to render `<Outlet />` in the layout, so child pages never appear.",
      "Treating `useParams` values as numbers. They are strings.",
      "Forgetting the host fallback, so a page reload gives a server 404.",
    ),
    ...task(
      "Make an app with Home, About and Products pages, a shared layout with a menu, and a 404 page.",
      "Add `/products/:id` and show the id. Link to three products.",
      "Add a category filter that lives in the query string.",
      "Add a fake login with context, a protected Dashboard page, and a redirect back after login.",
    ),
    ...check("Changing pages does not reload the browser.", "Reloading on `/products/2` still works in the dev server.", "Visiting the Dashboard while signed out sends you to the login page."),
    H("Summary"),
    L(
      "React Router shows different components for different addresses without reloading.",
      "Use `Routes` and `Route`, `Link` and `NavLink`, `useParams`, `useSearchParams` and `useNavigate`.",
      "Layout routes with `Outlet` share headers and footers.",
      "Protect routes with a wrapper that redirects, and always check permissions on the server too.",
    ),
  ], [
    { q: 'Why use Link instead of an anchor tag?', a: 'Link changes the page without a full reload, so your state and speed are kept. A normal anchor makes the browser load a whole new page.' },
    { q: 'How do I read an id from the URL?', a: 'Define the route with a parameter, like /products/:id, and read it with useParams. It is always a string.' },
    { q: 'Why do I get a 404 when I reload a page after deploying?', a: 'The server looks for a real file at that path. Set up a fallback so unknown paths return index.html and let React Router show the page.' },
    { q: 'Are protected routes secure?', a: 'They only change what the browser shows. Anything sent to the browser can be read. Your server must also check permissions for the data.' },
  ], 'react router tutorial, react router v6, react protected routes, react router params, react router nested routes'),

  // ---------------------------------------------------------------- 19
  lesson(S2, 'react-forms-validation-formdata-react-hook-form', 'Advanced React Forms: FormData, Validation Rules and React Hook Form', 'Go beyond basic forms. Use uncontrolled forms with FormData, write clean validation, show helpful errors, and learn when React Hook Form helps.', '', [
    P("In lesson 9 you built forms with controlled inputs, where every key press goes through state. That is great to learn the idea, but it is not the only way, and for big forms it can be too much code. In this lesson you will learn the shorter way with `FormData`, how to write clean validation, and how a form library can help."),

    H("The browser already knows your form"),
    P("A normal HTML form already keeps the values of its fields. When the person submits, the browser can hand you all values at once with `FormData`. You do not need state for every field."),
    C('jsx', `function ContactForm() {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);   // { name: '...', email: '...', message: '...' }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Name <input name="name" required /></label>
      <label>Email <input name="email" type="email" required /></label>
      <label>Message <textarea name="message" /></label>
      <button type="submit">Send</button>
    </form>
  );
}`),
    L(
      "Every input needs a **`name`**. That name becomes the key in the data.",
      "`event.currentTarget` is the form itself.",
      "`Object.fromEntries(formData)` turns the form data into a plain object.",
      "There is no state at all, and no redraw while the person types.",
    ),
    P("Checkboxes with the same name give several values. Use `formData.getAll('hobby')` to read them as an array. A file input gives a `File` object, so you can send the whole `formData` to a server with `fetch(url, { method: 'POST', body: formData })`. Do not set the `Content-Type` header yourself in that case, because the browser must add the right boundary."),

    H("Use the browser's own validation first"),
    P("HTML gives you free checks: `required`, `type=\"email\"`, `minLength`, `maxLength`, `min`, `max` and `pattern`. The browser shows a message and stops the submit. This is a good first layer, and it works without any JavaScript."),
    C('jsx', `<input name="age" type="number" min="18" max="99" required />
<input name="code" pattern="[0-9]{6}" title="Six digits" required />`),
    P("The built-in bubbles look different in each browser, and you cannot style them easily. When you need your own messages, add `noValidate` to the form and write your own checks."),

    H("Writing your own validation function"),
    P("Put the rules in **one plain function** that takes the data and returns an object of errors. It is easy to read and easy to test, and it does not depend on React."),
    C('js', `export function validateSignUp(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 letters).';
  }
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email || '')) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.password || data.password.length < 8) {
    errors.password = 'Your password needs at least 8 characters.';
  }
  return errors;
}`),
    C('jsx', `import { useState } from 'react';
import { validateSignUp } from './validate';

function SignUpForm() {
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const found = validateSignUp(data);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setDone(true);   // here you would send data to the server
  }

  if (done) return <p role="status">Thank you! Your account is ready.</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Name" name="name" error={errors.name} />
      <Field label="Email" name="email" type="email" error={errors.email} />
      <Field label="Password" name="password" type="password" error={errors.password} />
      <button type="submit">Create account</button>
    </form>
  );
}

function Field({ label, name, type = 'text', error }) {
  const errorId = name + '-error';
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined} />
      {error && <p id={errorId} role="alert">{error}</p>}
    </div>
  );
}`),
    P("The `Field` component keeps the label, the input and the error together, so every field is accessible without extra work. You wrote the rules once in `validateSignUp`, and you can test it with plain calls."),

    H("When to show errors"),
    L(
      "**On submit:** the simplest. Show all errors together, and move focus to the first wrong field.",
      "**On blur** (when the person leaves a field): friendlier for long forms. Do not show an error while the person is still typing their first attempt.",
      "**Clear the error** as soon as the value becomes valid, so people see they fixed it.",
    ),
    P("Write messages that tell people **what to do**: “Please enter a valid email address” is better than “Invalid input”. Do not blame the person. And never rely only on colour, since some people cannot tell red from green: always include text."),

    H("Server validation always"),
    N("Anything checked in the browser can be skipped by someone who sends the request directly. **The server must check everything again.** Show server errors in the same style: for example, if the server says the email is already used, put that message next to the email field."),
    C('jsx', `const response = await fetch('/api/signup', { method: 'POST', body: formData });
if (response.status === 409) {
  setErrors({ email: 'This email is already registered. Try signing in.' });
  return;
}`),

    H("React Hook Form: when a library helps"),
    P("For large forms with many rules, a library saves time. **React Hook Form** is popular because it uses uncontrolled inputs, so the form does not redraw on every key press. You register fields and get errors from it:"),
    C('bash', `npm install react-hook-form`),
    C('jsx', `import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit(data) {
    await fakeLogin(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" type="email"
        {...register('email', { required: 'Email is required' })} />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <label htmlFor="password">Password</label>
      <input id="password" type="password"
        {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })} />
      {errors.password && <p role="alert">{errors.password.message}</p>}

      <button disabled={isSubmitting}>Log in</button>
    </form>
  );
}`),
    P("`register('email', rules)` connects an input to the form and gives it its rules. `handleSubmit` runs your function only when all rules pass. `isSubmitting` is true while your async function runs, which is handy for disabling the button. For complex rules, you can combine it with a schema library such as Zod. Start with the plain way in this lesson, and add a library when your forms become big."),

    H("Good form habits"),
    L(
      "Every input has a visible `label`. A placeholder disappears when typing, so it is not a label.",
      "Use the right `type` and `autoComplete` values (`email`, `tel`, `current-password`, `one-time-code`). Phones then show the right keyboard and can fill in details.",
      "Disable the submit button while sending, and show progress.",
      "Do not clear a long form when an error happens. Keep what people typed.",
      "Keep forms short. Every extra field loses some people.",
    ),

    H("Common mistakes"),
    L(
      "Forgetting `name` on inputs, so `FormData` is empty.",
      "Setting the `Content-Type` header when sending `FormData`.",
      "Checking only in the browser and not on the server.",
      "Showing errors only in red with no text.",
      "Using `value` without `onChange`, or mixing controlled and uncontrolled inputs in the same field.",
    ),
    ...task(
      "Build the sign-up form with `FormData`, `noValidate` and the `validateSignUp` function. Add a confirm password field to the rules.",
      "Move focus to the first field with an error after a failed submit (use a ref or `querySelector`).",
      "Show an error from a fake server response, such as “email already used”.",
      "Rebuild the login form with React Hook Form and compare the code.",
    ),
    ...check("Every error appears next to its field, and disappears when fixed.", "A keyboard user can reach and fix every field.", "You can read the form values without any `useState` for fields."),
    H("Summary"),
    L(
      "`FormData` reads all fields of a form on submit. Give every input a `name`.",
      "Use HTML validation as a first layer, and write one plain validation function for your own messages.",
      "Show clear, helpful text errors next to fields and connect them with `aria-describedby`.",
      "Always validate again on the server. Use React Hook Form when forms get large.",
    ),
  ], [
    { q: 'Should I use controlled or uncontrolled inputs?', a: 'Use controlled inputs when the screen must react as people type. Use FormData and uncontrolled inputs for simple or very large forms where you only need the values on submit.' },
    { q: 'Do I need React Hook Form?', a: 'Not for small forms. It helps with large forms and many rules, and it avoids a redraw on every key press.' },
    { q: 'Is client side validation enough?', a: 'No. Anyone can send a request without your form. The server must always validate the data again.' },
    { q: 'Why is FormData empty?', a: 'Inputs without a name attribute are not included. Give every input a name.' },
  ], 'react form validation, react formdata, react hook form tutorial, uncontrolled form react, accessible forms react'),

  // ---------------------------------------------------------------- 20
  lesson(S2, 'how-react-renders-rules-of-react-strictmode', 'How React Renders: Pure Components, Re-renders, Batching and StrictMode', 'Understand what happens when React draws a component: render and commit, why components must be pure, what causes a re-render, and how batching works.', '', [
    P("You can build many things in React without knowing how it works inside. But when something does not behave as you expect, a clear picture of **how React draws** will save you hours. This lesson explains rendering in simple steps, and the rules that make React code predictable."),

    H("What does “render” mean?"),
    P("In React, **rendering** means React **calls your component function** to find out what should be on the screen. It is not the same as drawing pixels. Rendering is only the thinking part. The function returns JSX, which is a description of the screen."),
    P("A render and the following update happens in three steps:"),
    O(
      "**Trigger:** something asks for a draw. This is either the first draw of the app, or a state change.",
      "**Render:** React calls your component (and the components inside it) and gets their JSX.",
      "**Commit:** React compares the new result with the old one, and changes **only the differences** in the real page.",
    ),
    P("If the render result is the same as last time, React changes nothing on the page, even though your function ran."),

    H("What causes a re-render?"),
    L(
      "A component's own **state** changes (a setter is called with a **different** value).",
      "Its **parent** renders. By default, when a component renders, **all the components inside it render too**, even if their props did not change.",
      "A **context** it reads changes.",
    ),
    P("That second point surprises people. React renders children by default because it is usually cheap, and because checking every component would also cost time. If a render is truly slow, you can reduce it with `memo`, which lesson 21 covers. Do not worry about it until you see a real problem."),
    N("A component re-rendering is **not** a bug. Rendering is just calling a function. The expensive part, changing the real page, only happens for real differences."),

    H("Pure components"),
    P("The key rule of React: **a component must be a pure function of its props and state**. “Pure” means:"),
    L(
      "**Same inputs, same output.** With the same props, state and context, a component always returns the same JSX.",
      "**No side effects while rendering.** Rendering must not change anything outside the component, such as a global variable, the page, or a server.",
    ),
    P("Compare these two:"),
    C('jsx', `// Impure: changes something outside, and gives a different result on each draw
let count = 0;
function Bad() {
  count = count + 1;
  return <p>Draw number {count} at {Date.now()}</p>;
}

// Pure: depends only on its props
function Good({ count }) {
  return <p>Count is {count}</p>;
}`),
    P("React may call your component more than once, may pause a draw, or may throw one away and start again. This only works if rendering has no hidden effects. The place for effects is **event handlers** and **`useEffect`**, as we saw before."),

    H("Local changes are fine"),
    P("A component may change things it **created itself** during the same render. For example, building a new array and filling it is fine:"),
    C('jsx', `function Names({ people }) {
  const names = [];                         // made during this render
  for (const person of people) {
    names.push(person.name);                // fine
  }
  return <p>{names.join(', ')}</p>;
}`),
    P("What is not fine is changing the **props or state**, or things made before this render."),

    H("Immutability: never change, always replace"),
    P("React finds out whether a value changed by checking if it is a **new object**. So we must not change arrays and objects in state or props. We make a new copy. This is the reason for `[...items, newItem]` and `{ ...user, name: 'x' }`."),
    C('jsx', `// Wrong: same array object, React sees no change
items.push('x');
setItems(items);

// Right: a new array
setItems([...items, 'x']);`),
    P("For deep objects, copying every level by hand gets long. A small library called **Immer** (used inside Redux Toolkit and available as `useImmer`) lets you write “changes” in a safe way. Learn the plain way first."),

    H("State is a snapshot"),
    P("Each render has its own copy of the state, like a photo taken at that moment. Inside a render, and inside the event handlers made during it, the values do not change, even if you call a setter. That is why this prints the old number, and why three `setCount(count + 1)` calls add only one:"),
    C('jsx', `function Demo() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);   // asks for 1
    setCount(count + 1);   // asks for 1 again, not 2
    setCount(count + 1);   // still 1
    console.log(count);    // 0, the snapshot of this render
  }
  return <button onClick={handleClick}>{count}</button>;
}`),
    P("The fix is the function form: `setCount((c) => c + 1)`, which works on the **latest** value instead of the snapshot."),

    H("Batching: many updates, one render"),
    P("If you call several setters in one event, React waits until the handler finishes, then renders **once** with all the new values. This is called **batching**. It makes your app faster, and since React 18 it works everywhere, even inside timers and after `fetch`."),
    C('jsx', `function handleSubmit() {
  setName('');        // no render yet
  setEmail('');       // no render yet
  setSent(true);      // now React renders once with all three changes
}`),
    P("So you do not need to worry about “too many renders” when you set a few states together."),

    H("Infinite loops"),
    P("If you set state **during** a render, for example `setCount(count + 1)` directly in the body of the component, React renders again, which sets state again, and so on forever. React stops it with an error: “Too many re-renders”. State must be set in event handlers or effects, not while rendering. The same happens with an effect that sets state and has no dependency array."),

    H("StrictMode: your safety net"),
    P("`StrictMode` is the wrapper you saw in `main.jsx`. In development only, it:"),
    L(
      "Renders each component **twice** to find impure code. If your component prints something or changes a variable during render, you will see the double result.",
      "Runs each effect, then its cleanup, then the effect again, to test that cleanup works.",
    ),
    P("This is on purpose, to help you. It does nothing in the built site, so it costs your visitors nothing. If you see something happen twice in development, check whether your code is pure and has a cleanup, instead of removing `StrictMode`."),

    H("Keys and identity"),
    P("React remembers state by the **position** of a component in the tree, and by its **key**. If a component stays in the same place, it keeps its state. If it moves to a different place, or you give it a different key, React throws away the old one and makes a new one. This gives you a nice trick: to **reset** a component's state, change its key."),
    C('jsx', `<ProfileForm key={userId} userId={userId} />   {/* a new form for each user */}`),
    P("It also explains a bug: defining a component **inside** another component makes a brand new component type on every render, so its state is lost each time. Always define components at the top level of the file."),

    H("A simple way to debug renders"),
    L(
      "Add `console.log('Card render')` at the top of a component and watch how often it runs.",
      "Use the **Profiler** tab in React Developer Tools to record a session and see what rendered and how long it took.",
      "Ask: what triggered this? (state, parent, context). Then ask: is the work slow enough to matter? Most of the time it is not.",
    ),

    H("Common mistakes"),
    L(
      "Changing a variable outside the component during render.",
      "Changing state directly instead of making a new copy.",
      "Setting state in the body of the component, which causes a loop.",
      "Defining components inside components.",
      "Worrying about re-renders before measuring a real problem.",
    ),
    ...task(
      "Add a `console.log` in a parent and a child component. Click a button in the parent that changes its state, and watch which components log.",
      "Break purity on purpose: change a global variable in a component, and see the double change in development.",
      "Make a `Profile` form that resets when you change its `key`.",
      "Click a button that calls `setCount(count + 1)` three times, then fix it with the function form.",
    ),
    ...check("You can explain trigger, render and commit in your own words.", "You know why a child renders when its parent renders.", "The count increases by 3 after you use the function form."),
    H("Summary"),
    L(
      "Rendering means calling your component. React then compares results and changes only the differences in the page.",
      "A re-render is caused by state, a parent render, or a context change. It is normal and usually cheap.",
      "Components must be pure: same inputs give the same output, with no side effects while rendering.",
      "Never change state or props. Make copies. State is a snapshot per render, and updates are batched.",
    ),
  ], [
    { q: 'Why does my component render twice in development?', a: 'StrictMode renders twice on purpose to help you find impure code. It does not happen in the built site.' },
    { q: 'Is a re-render a problem?', a: 'No. Re-rendering only calls your function. The page changes only where the result is different. Optimise only when you measure a real slowness.' },
    { q: 'Why must components be pure?', a: 'React may call a component more than once, or pause and restart a render. Pure components give the same result every time, so this is safe.' },
    { q: 'How can I reset a component state?', a: 'Give it a different key. React then throws away the old component and makes a new one with fresh state.' },
  ], 'how react renders, react rendering explained, react pure components, react strictmode, react batching'),
];
