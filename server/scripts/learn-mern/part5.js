import { P, H, L, O, N, C, S, task, check, lesson } from './helpers.js';

const S5 = 'React Fundamentals';

export const lessons = [
  // ------------------------------------------------------------ 25
  lesson(S5, 'react-and-vite-setup-components-and-jsx', 'React and Vite Setup: Components and JSX', 'Create the React app with Vite, understand how main.jsx starts it, write your first components in JSX, and set up the dev proxy to the Express API.', '', [
    P("The back end is finished enough to be useful. Now the screens. **React** is a library for building user interfaces out of small, reusable pieces called **components**. Instead of finding elements and changing them by hand, you describe what the screen should look like for the current data, and React updates the page to match. This is the biggest idea in React, and the next six lessons build on it."),
    P("We use **Vite** to run and build the app. It starts in a moment, reloads the browser as you edit, and produces a small, fast production build. Create React App is no longer the recommended way to start, and Vite is the common replacement."),

    H("The files Vite gives you"),
    S(25, 'client/package.json'),
    S(25, 'client/index.html'),
    S(25, 'client/src/main.jsx'),
    L(
      "**`index.html`** is the only HTML page. It has an empty `<div id=\"root\">` and loads `main.jsx` as a module. Everything else is drawn by JavaScript.",
      "**`main.jsx`** is the entry point. `createRoot(...).render(<App />)` tells React to take control of the `root` div and draw the `App` component inside it. `StrictMode` runs some checks in development (and runs effects twice on purpose, to help you find bugs).",
      "**`package.json`** lists React, ReactDOM, the Vite plugin for React, and Vite. The scripts are `dev`, `build` and `preview`.",
    ),
    H("The proxy to your API"),
    S(25, 'client/vite.config.js'),
    P("In development the React app runs on port 5173 and the API on 5000. A page on one port that calls another is a cross-origin request, which needs CORS. The `proxy` setting avoids that: Vite forwards any request that starts with `/api` to the Express server, so the browser sees only one address. Your React code can then call `fetch('/api/jobs')` with a plain path, and in production, when Express serves the built app (lesson 38), the same code works without any change."),

    H("Components and JSX"),
    S(25, 'client/src/components/Header.jsx'),
    P("A component is a **function that returns JSX**. JSX looks like HTML but is JavaScript underneath: each tag becomes a function call. Four rules cover most of what you need."),
    L(
      "A component's name starts with a capital letter (`Header`), which is how React tells it from an ordinary HTML tag (`header`).",
      "A component returns **one** root element. Wrap siblings in a parent, or in an empty fragment `<>...</>`.",
      "Use `className` instead of `class`, and `htmlFor` instead of `for`, because `class` and `for` are reserved words in JavaScript.",
      "Put any JavaScript expression inside curly braces: `{year}`, `{items.length}`, `{isOpen ? 'Hide' : 'Show'}`. Statements such as `if` and `for` do not go in braces; use the conditional `? :`, `&&`, or `.map()` for lists.",
    ),
    S(25, 'client/src/components/JobCard.jsx'),
    S(25, 'client/src/App.jsx'),
    P("`App` is the root component. It renders a `Header`, and two `JobCard`s, using each like an HTML tag. Right now both cards show the same text. In the next lesson, **props** let each card receive its own data. Notice also how the layout is described, not constructed: there is no code that says “create an element and append it”."),
    H("The styles"),
    S(25, 'client/src/index.css'),
    P("We use one plain CSS file. The custom properties at the top (`--brand` and friends) make colours easy to change in one place. In lesson 34 the file is replaced by a polished responsive version."),
    N("Components must be pure during rendering: given the same inputs, return the same JSX, and do not change things outside themselves. Side effects such as fetching data belong in event handlers and in `useEffect`, which come in lessons 26 and 28."),
    ...task(
      "Run `npm run setup` from the project root (or `npm install` inside `client`), then `npm run dev` inside `client`. Open the address Vite prints.",
      "Change the text in `Header.jsx` and save. Watch the browser update without a reload.",
      "Create a `Footer` component that shows the year, and use it in `App`.",
      "Open the browser tools, Network tab, and find the request for `main.jsx`. See how Vite serves your source files in development.",
    ),
    ...check("The browser shows the header and two cards.", "Editing a component updates the page immediately (this is called hot reloading)."),
    H("Summary"),
    L("`index.html` + `main.jsx` start React; `App` is the root component.", "A component is a capitalised function returning one JSX element; braces hold JavaScript expressions.", "The Vite proxy sends `/api` calls to Express, so the same URLs work in development and production."),
  ], [
    { q: 'Why use Vite instead of Create React App?', a: 'Vite starts and reloads much faster and is actively maintained, while Create React App is no longer the recommended starting point. The React code you write is the same either way.' },
    { q: 'What is JSX?', a: 'A syntax that lets you write HTML-like markup inside JavaScript. A build step turns each tag into a function call. It is not required, but nearly every React project uses it.' },
    { q: 'Why does React run my effects twice in development?', a: 'StrictMode does it on purpose to help you find effects that are not cleaned up properly. It only happens in development, never in the production build.' },
  ], 'react vite tutorial, react jsx explained, react components, vite proxy api, react for beginners'),

  // ------------------------------------------------------------ 26
  lesson(S5, 'react-props-state-and-events', 'React Props, State and Events: useState and Updating Without Mutation', 'Pass data into components with props, keep changing data in state, handle events, and update state without changing the old value, with a status picker that works on screen.', '', [
    P("A screen that never changes is just a page. Real apps respond: you click, type, choose. React gives you three tools for that, and nearly everything else in the library builds on them. **Props** carry data *into* a component. **State** is data that belongs to a component and can *change*. **Events** are how the user's actions reach your code."),

    H("Props: inputs for a component"),
    S(26, 'client/src/components/StatusBadge.jsx'),
    P("Props are passed like HTML attributes, `<StatusBadge status=\"applied\" />`, and received as one object, which we usually destructure right in the parameter list: `function StatusBadge({ status })`. Props are **read only**. A component must never change its own props, because they belong to its parent. If something has to change, the parent changes it and passes new props down."),
    S(26, 'client/src/components/JobCard.jsx'),
    P("`JobCard` now receives two props: a `job` object, and a function `onStatusChange`. Passing a function as a prop is the way a child tells its parent that something happened. The card does not know how the list is stored, and it does not need to. This is the pattern: **data flows down as props; events flow up as function calls**."),

    H("State: data that changes"),
    S(26, 'client/src/App.jsx'),
    P("`const [jobs, setJobs] = useState(SAMPLE)` creates a piece of state. `useState` returns a pair: the current value, and a function that sets a new one. When you call the setter, React remembers the new value and **runs the component again** to draw the screen for it. You never edit the page by hand. You change the state and the page follows."),
    H("Never change state in place"),
    P("The most important rule in this lesson: **do not mutate state.** `jobs[0].status = 'offer'` followed by `setJobs(jobs)` does nothing useful, because React checks whether the value is *a different one* and finds the same array. You must give it a new array and new objects for what changed. That is why lesson 3 taught spread and `map`."),
    C('javascript', `// Wrong: changes the existing object, so React may not notice
jobs[0].status = 'offer'; setJobs(jobs);

// Right: a new array, and a new object only for the job that changed
setJobs((current) => current.map((j) => (j.id === id ? { ...j, status } : j)));`),
    P("Notice that the setter was given a **function** `(current) => ...`. Use that form whenever the new state depends on the old one. It always receives the latest value, even if several updates happen close together, which a plain `setJobs(jobs.map(...))` can miss."),

    H("Events"),
    P("Attach a handler with a camel-case prop: `onClick`, `onChange`, `onSubmit`. You pass the **function itself**, not the result of calling it: `onClick={save}` is right, `onClick={save()}` runs `save` during drawing and is a bug. For inputs, `e.target.value` holds what the person typed. In `JobCard`, the `<select>`'s `onChange` calls the parent's function with the job id and the chosen status."),
    H("Keys"),
    P("When you draw a list with `.map()`, give every item a **`key`** that is stable and unique among its siblings: here `key={job.id}`. React uses keys to tell which item is which when the list changes, so it keeps the right state with the right item. Do not use the array index as a key for lists that can be reordered or have items removed."),
    N("State is **per component instance** and is lost when the component is removed from the page. Data that must survive a refresh belongs on the server (lesson 28 onwards) or in browser storage."),
    ...task(
      "Run the app. Change a job's status with the dropdown and watch the badge colour change.",
      "Add a state variable `showOnlyActive` and a checkbox that hides jobs whose status is `rejected`. Use `.filter()` while drawing; do not delete from the array.",
      "Add a button to each card that cycles the status to the next one in the list.",
      "Open React Developer Tools (a browser extension) and look at the state of `App` while you click.",
    ),
    ...check("Choosing a status changes only that card.", "You can explain why `setJobs((current) => ...)` is safer than `setJobs(jobs.map(...))`."),
    H("Summary"),
    L("Props flow down and are read only; functions passed as props let children report events up.", "`useState` gives a value and a setter; calling the setter redraws the component.", "Never mutate state: create new arrays and objects, and give list items stable keys."),
  ], [
    { q: 'What is the difference between props and state?', a: 'Props are inputs a component receives from its parent and must not change. State is data the component owns and can change. When state changes React draws the component again.' },
    { q: 'Why does my state not update when I change an object?', a: 'React compares by reference. If you edit the same object and set it again, it looks unchanged. Create a new object or array (spread, map, filter) and set that instead.' },
    { q: 'Why do list items need keys?', a: 'Keys let React match old and new items when a list changes, so it can keep the right state and DOM with the right item. Use a stable unique id, not the index, when items can move or be removed.' },
  ], 'react props and state, react usestate tutorial, react events, react immutable state update, react keys list'),

  // ------------------------------------------------------------ 27
  lesson(S5, 'react-lists-forms-and-controlled-inputs', 'React Lists and Forms: Controlled Inputs, Validation and Accessible Labels', 'Build the job form with controlled inputs, validate before sending, show errors next to fields, and make the form usable with a keyboard and a screen reader.', '', [
    P("Forms are where most web apps spend most of their time, and where most bugs and accessibility problems live. In React the standard approach is the **controlled input**: the input's value always comes from state, and every keystroke goes back into state. React is then the single source of truth, so you can validate, reset or change what is shown at any moment."),

    H("The form component"),
    S(27, 'client/src/components/JobForm.jsx'),
    L(
      "**`values`** holds what is in the fields. **`errors`** holds a message per field. Both are state.",
      "**One `change` function for all fields.** Each input has a `name` that matches a key in `values`, so `e.target.name` says which field changed, and `[e.target.name]: e.target.value` is a *computed key* that updates it. That avoids one handler per field.",
      "**`e.preventDefault()`** in `submit` stops the browser's default of sending the form and reloading the page.",
      "**`noValidate`** on the form turns off the browser's pop-up bubbles so that our own messages, which can match the site's style and language, are used. The server validates too (lesson 12), so nothing depends on this.",
    ),
    H("Accessibility is not optional"),
    P("Several small details here make the form usable by everybody, and they cost almost nothing."),
    L(
      "Every input has a **`<label htmlFor>`** that matches the input's `id`. Clicking the label focuses the field, and screen readers announce it. Placeholder text is not a label: it disappears when you type.",
      "**`aria-invalid`** marks a field with a problem, and the red border uses the same attribute in CSS, so the visual and the semantic state cannot drift apart.",
      "Error text sits right under its field. For messages that appear after an action, the next lessons add `role=\"alert\"` so screen readers announce them.",
      "Use a real `<button type=\"submit\">` inside a real `<form>`: Enter then submits the form for free.",
    ),
    H("Using the form and drawing the list"),
    S(27, 'client/src/App.jsx'),
    P("`App` gives the form an `onSubmit` function and adds the new job to the list with a spread: `[{ ...values, id: Date.now() }, ...cur]`. The list is drawn with `.map()` and a `key`. Notice the three states of the list: items exist; nothing exists yet (we show a friendly message); and, in lesson 28, loading. Always design all three, because an empty screen with no explanation looks like a bug."),
    P("The job is still only added to the **screen**. Reload the page and it is gone. Saving it on the server is lesson 31. Doing it in steps keeps each idea clear."),
    H("Where should state live?"),
    P("A common beginner question is where to put state. A good rule is: **put it in the closest component that needs it, and lift it up only when two siblings need to share it.** The form's `values` are only used by the form, so they live there. The list of jobs is used by the list and by the form's submit handler, so it lives in `App`, their common parent."),
    N("Do not store values that you can calculate from other state. `jobs.length` is derived from `jobs`, so calculate it while drawing instead of keeping a separate `count` that can fall out of step."),
    ...task(
      "Run the app. Submit the empty form and read the errors. Fix one field and submit again.",
      "Use the keyboard only: tab through the fields, choose a status with the arrow keys, and submit with Enter.",
      "Add a `Pay` field (`salaryNote`) and a `Notes` textarea to the form.",
      "Add a check that blocks company names longer than 120 characters, with a message.",
    ),
    ...check("Errors appear under the fields and clear when the form is valid.", "A new job appears at the top and the form resets.", "You can complete the whole flow without a mouse."),
    H("Summary"),
    L("A controlled input reads its value from state and writes every change back.", "One `onChange` with computed keys can serve all fields.", "Labels, `aria-invalid` and real buttons make a form usable for everyone."),
  ], [
    { q: 'What is a controlled input?', a: 'An input whose value is set by React state and updated on every change event. React is the single source of truth, which makes validation, resetting and conditional logic simple.' },
    { q: 'Why not use the browser\'s built-in validation?', a: 'You can, and it is a good fallback. Custom validation lets you control the wording, placement and styling, and matches the server\'s messages. In either case the server must validate again.' },
    { q: 'Is a placeholder enough as a label?', a: 'No. A placeholder disappears when you type and is not reliably announced by screen readers. Use a visible label connected with htmlFor and id.' },
  ], 'react forms controlled inputs, react form validation, react accessible forms, react onchange handler'),

  // ------------------------------------------------------------ 28
  lesson(S5, 'react-useeffect-and-fetching-data-from-your-api', 'useEffect and Fetching Data from Your API: Loading, Errors and Cleanup', 'Call the Express API from React, handle loading and error states, cancel requests that are no longer needed, and write a small api() helper.', '', [
    P("The screen so far shows made-up data. Time to connect React to the API you built. Fetching data is a **side effect**: something that reaches outside the component. React gives you the hook `useEffect` for that. It runs your code **after** the component has been drawn, and lets you clean up afterwards."),

    H("One place for talking to the API"),
    S(28, 'client/src/api.js'),
    L(
      "`api(path, options)` adds the `/api` prefix, the JSON header and the `Authorization` token, so no component repeats that.",
      "It throws an `ApiError` with the **status**, the **message** and the field **details** from the server whenever the answer is not OK. Remember that `fetch` itself does not fail on 400 or 500 (lesson 4).",
      "`204 No Content` returns `null`, because there is no body to parse.",
      "The token is read from `localStorage`. Lesson 32 sets it when the person signs in.",
    ),
    H("useEffect"),
    S(28, 'client/src/App.jsx'),
    P("`useEffect(fn, [dependencies])` runs `fn` after drawing. The **dependency array** controls when it runs again. With `[]` it runs once, when the component first appears. With `[id]` it runs again whenever `id` changes. With no array it runs after every draw, which is rarely what you want. The rule that avoids most bugs: **list every value from the component that the effect uses.**"),
    P("The function you return from the effect is its **cleanup**. It runs before the next run and when the component disappears. Here we use it to call `controller.abort()`. An `AbortController` cancels a request that is no longer needed, for example when the person leaves the page before the answer arrives. Without it, the late answer would try to update a component that no longer exists, or, worse, an older request could finish **after** a newer one and show stale data (a *race condition*)."),
    H("Three states: loading, error, data"),
    P("Network calls take time and can fail. The component keeps three pieces of state, `jobs`, `loading` and `error`, and draws something sensible for each. A blank screen is not an acceptable loading state, and a silent failure is not an acceptable error state. The error message ends with a hint about the likely cause, which saves a beginner a lot of time."),
    N("For this lesson only, the effect signs in as the demo account created by `npm run seed` so that a token exists. This is **temporary**, and lesson 32 replaces it with real sign-in pages. Never ship a hard-coded login."),
    P("The effect cannot be an `async` function directly, because it must return either nothing or a cleanup function, and an `async` function returns a promise. So we define an `async function load()` inside and call it, as the file shows."),
    H("What about the form?"),
    P("It still only changes the screen, and is marked with a comment. Saving through the API comes in lesson 31, after you have met routing and shared state. Reload the page and the form's jobs disappear, while the server's jobs return. That difference is worth seeing with your own eyes."),
    ...task(
      "Start the server, run `npm run seed`, then start the client. You should see 30 jobs from your database.",
      "Stop the server and reload. Read the error message. Start it again.",
      "Slow the network in the browser's Network tab (choose “Slow 3G”) and watch the loading message.",
      "Add `console.log('effect ran')` inside the effect. Why does it print twice in development? (Hint: lesson 25.)",
    ),
    ...check("The list shows the jobs from MongoDB.", "With the server stopped, a clear error replaces the list.", "Reloading brings back the saved jobs, not the ones you added on screen."),
    H("Summary"),
    L("Wrap `fetch` in one `api()` helper that sets headers and throws `ApiError`.", "`useEffect` runs after drawing; the dependency array says when to run again; the returned function cleans up.", "Always draw loading, error and empty states."),
  ], [
    { q: 'Why can\'t I make useEffect\'s callback async?', a: 'An effect must return nothing or a cleanup function. An async function always returns a promise, which React would treat as an invalid cleanup. Define an async function inside the effect and call it.' },
    { q: 'What goes in the dependency array?', a: 'Every value from the component (props, state, functions) that the effect reads. An empty array means "run once on mount". Leaving values out causes stale data bugs.' },
    { q: 'Why abort requests in the cleanup?', a: 'To avoid updating state after the component is gone and to prevent a slow old request from overwriting a newer answer. AbortController cancels the fetch when the effect cleans up.' },
  ], 'react useeffect fetch, react fetch api example, react loading error state, abortcontroller react, react data fetching'),

  // ------------------------------------------------------------ 29
  lesson(S5, 'react-router-pages-links-and-params', 'React Router: Pages, Links, URL Parameters and a Shared Layout', 'Turn one screen into several pages with React Router 7: routes, a layout with an Outlet, NavLink, useParams and a catch-all 404 page.', '', [
    P("One screen is not an app. We want a list page, a page for one job, and later sign-in pages, each with its own address that can be bookmarked and shared. A **single page application** (SPA) does this without reloading: **React Router** watches the address bar and draws the right component, and links change the address without asking the server for a new page."),

    H("Set up the router"),
    S(29, 'client/src/main.jsx'),
    P("`BrowserRouter` wraps the app and makes the current address available to everything below it. The `react-router-dom` package is added in `package.json`; run `npm install` after you copy it."),
    H("Declare the routes"),
    S(29, 'client/src/App.jsx'),
    L(
      "`<Routes>` picks the **best matching** route for the current address.",
      "`<Route index element={<JobsPage />} />` is the page at the parent's own path (`/`).",
      "`path=\"jobs/:id\"` has a **parameter**: `/jobs/64f...` matches, and the part after `/jobs/` is called `id`.",
      "`path=\"*\"` matches everything else, so unknown addresses get your own 404 page and not a blank screen.",
      "The routes are **nested** inside `<Route element={<Layout />}>`. A route without a path that only has an element is a *layout route*.",
    ),
    H("A layout with an Outlet"),
    S(29, 'client/src/components/Layout.jsx'),
    P("`<Outlet />` is the hole where the matching child page is drawn. The header stays on screen while the page under it changes. Nothing is reloaded, and the header is not drawn again from scratch. In lesson 32 the same idea gives us a `ProtectedRoute` that wraps all private pages."),
    S(29, 'client/src/components/Header.jsx'),
    P("`<NavLink>` is a link that does not reload the page, and it adds the class `active` when it points to the current page, so you can style the current item. The `end` prop makes `/` match only the exact address and not every address that starts with `/`. For links that do not need the active style use `<Link>`. Never use a plain `<a href>` for pages inside your app, because that asks the server for a whole new page."),
    H("The list and detail pages"),
    S(29, 'client/src/pages/JobsPage.jsx'),
    S(29, 'client/src/pages/JobDetailPage.jsx'),
    P("`useParams()` returns the parameters from the address: `const { id } = useParams()`. The detail page fetches that job in an effect that lists `id` in its dependency array. If the person goes straight from one job's address to another, the effect runs again. A `404` from the API is turned into a friendly message with a link back, instead of a raw error."),
    S(29, 'client/src/pages/NotFoundPage.jsx'),
    N("A single page application needs the **server** to cooperate. If someone reloads `/jobs/123`, the browser asks the server for exactly that path, which is not a real file. In development Vite handles this. In production lesson 38 makes Express answer every non-API path with `index.html`."),
    ...task(
      "Run `npm install` in `client` and open the app. Click “Open details” on a job. Watch the address change and notice that the page does not reload.",
      "Use the browser's back and forward buttons. They work, because the router uses the history API.",
      "Type a wrong address such as `/nothing`. You should see the 404 page.",
      "Add an `/about` route with a simple page and a `NavLink` for it.",
    ),
    ...check("The address changes without a full reload.", "The header stays while the page changes.", "Unknown addresses show your 404 page."),
    H("Summary"),
    L("`BrowserRouter`, `Routes` and `Route` map addresses to components; `:id` creates a parameter.", "A layout route with `<Outlet />` shares a header across pages.", "Use `Link` and `NavLink` for in-app navigation, and add a `*` route for 404."),
  ], [
    { q: 'What is the difference between Link and NavLink?', a: 'Both navigate without reloading. NavLink also knows whether it points to the current page and adds an active class (and aria-current), so you can style the current menu item.' },
    { q: 'Why do I get a 404 from the server when I refresh a page?', a: 'Because the browser asks the server for that path, and a single page app has only one real page. The server must send index.html for every path that is not an API route. Vite does it in development, and lesson 38 does it in production.' },
    { q: 'What is the Outlet for?', a: 'It marks where a layout route draws the matching child route, so shared parts like the header stay while only the page changes.' },
  ], 'react router tutorial, react router v7, react router outlet navlink, useparams react, single page application routing'),

  // ------------------------------------------------------------ 30
  lesson(S5, 'react-context-and-custom-hooks', 'React Context and Custom Hooks: Sharing Auth State and Reusing Data Logic', 'Share the signed-in user with every component through context, extract data loading into a custom hook, and keep pages short.', '', [
    P("Two problems appear as the app grows. First, many components need the same information, such as who is signed in, and passing it as props through every level (called *prop drilling*) is tedious and fragile. Second, the same loading logic gets copied from page to page. React answers the first with **context** and the second with **custom hooks**."),

    H("Context: share without passing props"),
    S(30, 'client/src/context/AuthContext.jsx'),
    L(
      "`createContext(null)` makes a context. A **provider** component puts a value into it, and any component below the provider can read that value, however deep.",
      "`AuthProvider` owns the state (`user` and `ready`) and offers them through `value`. `children` is whatever you wrap it around.",
      "`useAuth()` is a **custom hook**: a function whose name starts with `use` that calls other hooks (`useContext` here). It reads the context and throws a clear error if you forget to wrap the app in the provider.",
      "`ready` is `false` until the first attempt to sign in has finished. Pages can wait for it, so they do not flash a “signed out” screen to someone who is, in fact, signed in.",
    ),
    S(30, 'client/src/main.jsx'),
    P("Here `AuthProvider` wraps `App`, inside `BrowserRouter` so that later code can navigate. As before, the effect signs in as the demo user. It is **temporary** and lives in one place now, rather than in every page, which makes it easy to remove in lesson 32."),
    N("Context is for values many components need and that change rarely, such as the user, a theme or the language. Putting fast-changing data (like what is in a text box) in context makes every component below it redraw. Keep that kind of state local."),

    H("Custom hooks: reuse logic"),
    S(30, 'client/src/hooks/useJobs.js'),
    P("`useJobs` moves the list loading out of the page. It uses `useAuth` to wait for the sign-in, `useState` for the data, loading and error, and `useEffect` to fetch with an abort controller. It returns what a page needs: `jobs`, `loading`, `error`. A custom hook is just a function, and every component that calls it gets its **own** copy of the state. They share the *code*, not the *data*."),
    P("`useCallback` wraps `load` so that the function keeps the same identity between draws. That matters here because `load` appears in an effect's dependency array: a new function on every draw would make the effect run again and again."),
    S(30, 'client/src/pages/JobsPage.jsx'),
    P("Compare this page with lesson 29. It went from about 35 lines of effects and states to a single call, `useJobs()`. The page now says **what** to show; the hook knows **how** to get it. This is the main reason to write a custom hook: make the pages read like a description of the screen."),
    S(30, 'client/src/pages/JobDetailPage.jsx'),
    ...task(
      "Run the app and check that it behaves like lesson 29, with the loading logic now in the hook.",
      "Add a `useDocumentTitle(title)` hook that sets `document.title` in an effect, and use it in both pages.",
      "In React Developer Tools, find `AuthProvider` and its state.",
      "Temporarily remove `AuthProvider` from `main.jsx` and read the error that `useAuth` throws.",
    ),
    ...check("Behaviour is the same as before, with less code in the pages.", "`useAuth` explains the mistake when the provider is missing."),
    H("Summary"),
    L("Context shares a value with all components below a provider; use it for rarely changing data like the user.", "A custom hook is a `use...` function that reuses stateful logic. Each caller gets its own state.", "Wrap functions in `useCallback` when they are dependencies of an effect."),
  ], [
    { q: 'When should I use context instead of props?', a: 'When many components at different depths need the same value, such as the current user, theme or language. For data used by one parent and its direct children, props are simpler and clearer.' },
    { q: 'Do two components using the same hook share state?', a: 'No. Each call to a hook creates its own state. A hook shares logic, not data. To share data, lift the state up or put it in context.' },
    { q: 'Why does a hook have to start with use?', a: 'It is a convention that tools rely on: the linter checks that hooks follow the rules (only call them at the top level of components and other hooks), and readers recognise them instantly.' },
  ], 'react context api, react custom hooks, useContext tutorial, react auth context, avoid prop drilling'),

  // ------------------------------------------------------------ 31
  lesson(S5, 'react-crud-ui-create-edit-delete-with-the-api', 'CRUD in React: Create, Edit and Delete Jobs Through the API', 'Save new jobs on the server, edit them with the same form, delete with confirmation, and update the status instantly with an optimistic update that rolls back on failure.', '', [
    P("Everything the person does on screen must now reach the database: add, change and delete. The three things to get right in a real app are the same three you have met on the server: **the happy path**, **the unhappy path** (show the server's field errors and failures), and **the waiting** (show that something is happening and prevent double clicks)."),

    H("The hook now changes data"),
    S(31, 'client/src/hooks/useJobs.js'),
    L(
      "**`createJob`** waits for the server, which creates the real `id`, then puts the **saved** job at the top of the list. We do not invent an id on the client any more.",
      "**`changeStatus`** is an **optimistic update**: it changes the screen at once, then sends the request. If the server refuses, it puts the old job back and shows an error. The screen feels instant, and the truth is restored if something goes wrong. Use this style for small, low-risk changes, and not for things like payments.",
      "**`removeJob`** waits for the server first, and then removes the job from the list, since deleting is not something to guess.",
      "All three are wrapped in `useCallback`, so they keep their identity. That will matter for performance in lesson 35.",
    ),
    H("A form that adds and edits"),
    S(31, 'client/src/components/JobForm.jsx'),
    P("The same component now serves both purposes. `initial` fills the fields (empty for adding, the job for editing), `submitLabel` changes the button text, and `onSubmit` returns a **promise**. While it runs, `saving` is true: the button is disabled and says “Saving…”, which stops double submissions. If the server answers with field errors, `err.details` goes straight into the `errors` state, so a message appears under the right field. If it answers with another error, the message is shown below the button inside `role=\"alert\"`, which screen readers announce."),
    S(31, 'client/src/pages/JobsPage.jsx'),
    P("Deleting uses `window.confirm` here. It is basic but accessible and quick to build. A custom dialog is nicer and is a good exercise. Before you delete anything, ask."),
    H("The edit page"),
    S(31, 'client/src/pages/JobDetailPage.jsx'),
    P("The detail page shows the form filled with the job. The `key={job.updatedAt}` on `JobForm` makes React build a fresh form whenever the saved job changes, so the fields always show what the server holds. The save answer is stored back in `job`, and a “Saved.” note uses `role=\"status\"`. After a delete it calls `navigate('/')` to go back to the list."),
    N("Treat the server as the truth. After an update, show what the server returned, not what you sent: the server may have trimmed a value or applied a default."),
    H("Handling failure like a professional"),
    L(
      "Never leave the person guessing: loading text, disabled buttons and clear messages.",
      "Keep the failed input in the form so they can fix it, instead of clearing it.",
      "Roll back optimistic changes when the server says no.",
      "Do not show raw technical errors. The API's messages were written to be shown.",
    ),
    ...task(
      "Add a job through the form. Reload: it is still there (it is in MongoDB now).",
      "Open the job, change the notes and save. Check the document in Atlas.",
      "Stop the server and try to change a status. Does the old status come back, with an error message?",
      "Submit the form with a company longer than 120 characters. Where does the message appear?",
    ),
    ...check("New, edited and deleted jobs survive a reload.", "A failed status change is rolled back with a message.", "The submit button is disabled while saving."),
    H("Summary"),
    L("Create and delete wait for the server; small changes can be optimistic with a rollback.", "One form component serves adding and editing through `initial` and `onSubmit`.", "Show saving, field errors and failures, and display what the server returned."),
  ], [
    { q: 'What is an optimistic update?', a: 'Changing the screen immediately, assuming the server will accept the change, and undoing it if the server refuses. It makes small actions feel instant. Avoid it where a wrong guess has real cost.' },
    { q: 'Why wait for the server when creating a job?', a: 'Because the server creates the real id and applies its own cleaning and defaults. Showing the saved version keeps the screen true to the data.' },
    { q: 'How do I stop double submissions?', a: 'Disable the submit button while the request is in progress, using a saving state, and show a "Saving…" label. The server can also protect itself with unique indexes or idempotent routes.' },
  ], 'react crud tutorial, react optimistic update, react form edit and create, react delete confirmation, mern crud'),
];
