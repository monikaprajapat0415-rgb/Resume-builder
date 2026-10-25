import { P, H, L, O, N, C, S, task, check, lesson } from './helpers.js';

const S6 = 'Connecting Everything';
const S7 = 'Advanced Topics';

export const lessons = [
  // ------------------------------------------------------------ 32
  lesson(S6, 'sign-in-and-register-pages-with-protected-routes', 'Sign In and Register Pages with Protected Routes in React', 'Build real sign-in and registration screens, restore a session from a saved token, protect private pages, handle expired tokens, and sign out.', '', [
    P("It is time to remove the temporary demo login from lessons 28 to 31 and let real people create accounts. This lesson connects the pieces from the back end (register, login, `/auth/me`, 401 answers) to React: pages for signing in and registering, a way to **restore a session** after a refresh, **protected routes**, and a clean **sign out**."),

    H("The auth context, for real"),
    S(32, 'client/src/context/AuthContext.jsx'),
    L(
      "**On first load**, if a token is saved, it asks the server `GET /api/auth/me`. A valid answer restores the user; an error removes the bad token. Only then is `ready` set to `true`. A saved token is a *claim*, so the server must confirm it.",
      "**`signIn` and `register`** call the API, save the token with `setToken`, and set `user`.",
      "**`signOut`** deletes the token and clears the user. Because the token is stateless, “signing out” only forgets it on this device. The server has no session to end.",
      "**A listener for `jt:unauthorized`.** If any request later gets a `401` (an expired token, for instance), the API helper fires this event and the context signs the person out, so they land on the login page with no extra code in any page.",
    ),
    S(32, 'client/src/api.js'),
    P("Look at the 401 branch in `api()`. It dispatches the event only when a token existed and the request was not the login itself, because a wrong password on the login form is not an expired session."),
    H("Protecting pages"),
    S(32, 'client/src/components/ProtectedRoute.jsx'),
    P("`ProtectedRoute` is a layout route. It waits while `ready` is false, redirects to `/login` when there is no user, and otherwise draws `<Outlet />`, the protected page. `<Navigate replace state={{ from }} />` remembers where the person wanted to go, so after signing in we can send them there. `replace` avoids leaving the redirect in the back-button history."),
    N("Hiding screens in React is **user experience, not security**. Anyone can open the browser tools and change what the page shows. The real protection is the server, which checks the token and the owner on every request (lessons 21 and 22)."),
    S(32, 'client/src/App.jsx'),
    H("The two forms"),
    S(32, 'client/src/pages/LoginPage.jsx'),
    S(32, 'client/src/pages/RegisterPage.jsx'),
    L(
      "Use the right **input types and `autoComplete`** values (`email`, `current-password`, `new-password`). Password managers and phone keyboards rely on them, and they make signing in much easier.",
      "If someone is already signed in and opens `/login`, `<Navigate to=\"/\" />` sends them to the app.",
      "The login page navigates to `location.state?.from`, then falls back to `/`.",
      "Registration shows the server's field errors (`err.details`) under each field, using the same pattern as the job form.",
      "Both disable the button while waiting, and show failures in a `role=\"alert\"` paragraph.",
    ),
    S(32, 'client/src/components/Header.jsx'),
    P("The header now shows either the app link or the sign-in links, and, when signed in, the person's name and a **Sign out** button. Names come from the server and are drawn through JSX, which escapes them automatically. Never insert user-written text with `dangerouslySetInnerHTML`: it is the way cross-site scripting happens in React apps."),
    ...task(
      "Delete any saved `jt_token` from `localStorage` (Application tab) and open the app. You should land on the login page.",
      "Create an account on the register page. Try a short password and a repeated email first.",
      "Sign out, then try to open `/` directly. You are redirected, then returned after signing in.",
      "In the browser tools, change the saved token to garbage and reload. What happens?",
    ),
    ...check("Registration and login work and show field errors.", "A protected page redirects signed-out visitors and returns them after login.", "A bad or expired token signs the person out."),
    H("Summary"),
    L("Restore sessions by asking the server who the saved token belongs to.", "`ProtectedRoute` redirects visitors who are not signed in. This is a convenience; the server enforces the rules.", "A global `401` event signs the person out in one place."),
  ], [
    { q: 'Where should I store the JWT in the browser?', a: 'localStorage is simple and common, but scripts on the page can read it, so any XSS bug could steal it. An httpOnly cookie cannot be read by scripts but needs CSRF protection. Pick one with the trade-off in mind; lesson 40 lists cookies as a next step.' },
    { q: 'How do I sign out when the token is stateless?', a: 'You forget the token on the client. The server cannot end it earlier unless you keep a list of revoked tokens, which most small apps do not need if tokens expire soon.' },
    { q: 'Is a protected route in React real security?', a: 'No. It only hides screens. A person can still call your API directly, so the server must check the token and the owner on every request.' },
  ], 'react protected routes, react login page, react jwt authentication, react auth context, react sign out'),

  // ------------------------------------------------------------ 33
  lesson(S6, 'react-dashboard-stats-filters-and-pagination-in-the-url', 'A React Dashboard: Statistics, Filters and Pagination Stored in the URL', 'Show the API statistics, add search, status filter and sorting, paginate, and keep all of it in the URL so a page can be shared, bookmarked and reloaded.', '', [
    P("The API can already search, filter, sort, paginate and count. This lesson gives it a face. The interesting design decision is **where the state lives**. Instead of keeping the search text and page number in component state, we keep them in the **address bar**: `/?status=applied&q=bank&page=2`. That gives you three things for free: the back button works, reloading keeps your place, and the person can bookmark or share a view."),

    H("The hook follows the URL"),
    S(33, 'client/src/hooks/useJobs.js'),
    L(
      "It takes `{ q, status, sort, page, limit }` and builds the query string with `URLSearchParams`, which also takes care of encoding special characters.",
      "The effect depends on `query` (a string) and `version` (a number). When the filters change, the query changes and the effect fetches again. When data changes (a job is added, deleted or moved), `reload()` increases `version`, which runs the effect again so the list **and the statistics** refresh.",
      "It loads the list and the statistics together with `Promise.all`, and aborts the old requests in the cleanup. That is what prevents the classic search bug: you type `ba` then `bank`, and the slower first answer arrives last and overwrites the right one.",
    ),
    H("The page reads the URL"),
    S(33, 'client/src/pages/JobsPage.jsx'),
    P("`useSearchParams()` works like `useState` for the query string: it returns the current parameters and a function to change them. The page reads `q`, `status`, `sort` and `page` from it, with sensible defaults, and hands them to `useJobs`. `setFilter` copies the current parameters, applies the change, and **drops `page`**. If you are on page 4 and choose a status with only two pages of results, staying on page 4 would show nothing. `replace: true` replaces the current history entry rather than adding one, so typing in the search box does not create dozens of back-button steps."),
    H("Small, focused components"),
    S(33, 'client/src/components/StatsBar.jsx'),
    S(33, 'client/src/components/Filters.jsx'),
    S(33, 'client/src/components/Pagination.jsx'),
    L(
      "**`StatsBar`** shows the numbers from `/api/jobs/stats`. `interviewRate` can be `null` (lesson 19), and the bar shows “–” instead of a number that would mean nothing. It sits inside `<section aria-label=...>` so screen readers can find it.",
      "**`Filters`** is a `role=\"search\"` form with labelled controls. It does not own any state: it receives the values and a single `onChange`, so it is easy to reuse and test.",
      "**`Pagination`** disables Previous and Next at the ends and announces the page with `aria-live=\"polite\"`.",
    ),
    P("Notice the “no results” messages. “No job matches these filters” and “No jobs yet” are different situations that need different words, so the code distinguishes them with a `filtered` flag. The count line also changes between “1 job” and “3 jobs”. Details like this are what make a screen feel finished."),
    N("The search box in this lesson sends a request on every keystroke. It works, because the aborted requests keep the answers in order, but it makes more requests than needed. Lesson 35 adds a **debounce** to fix that."),
    ...task(
      "Run `npm run seed` on the server, sign in as `demo@example.com`, and explore the dashboard.",
      "Apply a filter, go to page 2, and reload. You should stay where you were.",
      "Copy the address and open it in a private window after signing in: the same view appears.",
      "Add a “Clear filters” button that empties all the parameters.",
    ),
    ...check("Search, status and sort change the list and the address.", "Changing a filter resets to page 1.", "Adding or moving a job updates the statistics too."),
    H("Summary"),
    L("Keep list state in the URL with `useSearchParams` so views can be shared and reloaded.", "Abort old requests so slow answers cannot overwrite new ones.", "Write separate messages for “nothing yet” and “nothing matches”."),
  ], [
    { q: 'Why keep filters in the URL instead of in state?', a: 'The back button, reload, bookmarks and shared links all work for free, and the URL always shows the exact view. State kept in a component is lost on reload.' },
    { q: 'Why reset the page when a filter changes?', a: 'The new result set may have fewer pages. If you stay on page 4 of a result that only has 2, the screen would be empty and confusing.' },
    { q: 'What is the problem with searching on every keystroke?', a: 'It sends many requests, and answers can arrive out of order. Aborting old requests solves the ordering, and a debounce (lesson 35) reduces the number of requests.' },
  ], 'react search params, react pagination, react dashboard tutorial, react filters url state, usesearchparams'),

  // ------------------------------------------------------------ 34
  lesson(S6, 'responsive-styling-and-accessibility-in-react', 'Responsive Styling and Accessibility: Mobile First CSS, Focus, Contrast and Dark Mode', 'Style the app for phones first, make it keyboard friendly, respect reduced motion and dark mode, and move focus after page changes.', '', [
    P("Many of the people using a job tracker use it on a phone, often on a slow connection, sometimes with large text or a screen reader, and sometimes in a dim room. Design for them first and the app is better for everyone. This lesson replaces the basic styles with a responsive, accessible stylesheet and adds three small changes to the layout."),

    H("Mobile first"),
    S(34, 'client/src/index.css'),
    P("**Mobile first** means the base rules are written for a narrow screen, and `@media (min-width: 600px)` blocks *add* room for bigger ones. The form is one column on a phone and two on a tablet. The statistics are two columns, then four, then seven. This is easier than the other way round, and phones get the least CSS to process."),
    L(
      "**Flexible units and layout.** `grid` with `1fr` columns, `flex-wrap`, `max-width` and no fixed widths mean nothing sticks out of a 390 px screen. Test by opening the browser tools and choosing a phone size. The page must never scroll sideways.",
      "**Touch targets.** Buttons and inputs have `min-height: 44px`, because fingers are less precise than a mouse pointer.",
      "**Logical properties** such as `margin-inline-start` and `inset-inline-start` flip automatically for right-to-left languages like Arabic, so the same CSS serves them.",
    ),
    H("Colour, contrast and dark mode"),
    P("Text needs enough contrast against its background to be read in sunlight and by people with low vision. The muted text colour was darkened from the first version for that reason, and the status badges pair dark text with a light background. A quick check is to use the contrast checker in the browser tools. The `prefers-color-scheme: dark` block swaps the custom properties when the device is set to dark mode, so the whole interface follows with a few lines, because every colour comes from a variable."),
    N("Never use colour alone to carry meaning. The status badges also contain the **word** (`applied`, `offer`), and invalid fields have a thicker border *and* a text message, so people who cannot tell the colours apart lose nothing."),
    H("Focus and keyboard use"),
    L(
      "`:focus-visible` draws a clear outline for keyboard users and stays out of the way for mouse users. **Never** remove the outline without replacing it.",
      "A **skip link** (“Skip to content”) is the first thing a keyboard user can reach. It is hidden above the page until it gets focus. It lets them jump past the header on every page.",
      "After a page change in a single page app, nothing tells a screen reader that the page changed. The layout now **moves focus to `<main>`** when the address changes, so the new content is read out.",
    ),
    S(34, 'client/src/components/Layout.jsx'),
    P("`tabIndex={-1}` makes `main` focusable by code without adding it to the Tab order, and `focus({ preventScroll: true })` avoids the page jumping. Together with `id=\"main\"` they give the skip link a target."),
    H("Respect the person's settings"),
    P("The last rule in the stylesheet switches off animations and transitions when the device asks for **reduced motion**. Some people feel dizzy or sick from movement on screen. The same attention applies to text size: use `rem` or relative sizes so the browser's font-size setting works."),
    H("A quick accessibility test you can do today"),
    O(
      "Put the mouse away and do the whole flow with Tab, Shift+Tab, Enter and the arrow keys.",
      "Zoom the page to 200 percent. Nothing should overlap or be cut off.",
      "Turn on a screen reader (VoiceOver on macOS and iOS, TalkBack on Android, NVDA on Windows) and listen to one page.",
      "Run the Lighthouse accessibility audit in Chrome and fix what it reports.",
    ),
    ...task(
      "Copy the new stylesheet and layout, then check the app at 390 px, 768 px and a wide screen.",
      "Switch your computer to dark mode and reload.",
      "Tab through the home page. Is there a visible focus outline at every step?",
      "Fix any text that fails the contrast checker in the browser tools.",
    ),
    ...check("No sideways scrolling at 390 px.", "A visible focus ring on every interactive element.", "Dark mode and reduced motion are respected."),
    H("Summary"),
    L("Write CSS for phones first and add `min-width` media queries for larger screens.", "Keep contrast high, never rely on colour alone, and keep focus outlines.", "Add a skip link, move focus on page change, and respect reduced motion and dark mode."),
  ], [
    { q: 'What does mobile first mean?', a: 'You write the default styles for a small screen and use min-width media queries to add layout for larger ones. The smallest, simplest layout is the base, and bigger screens add to it.' },
    { q: 'How big should buttons be on a phone?', a: 'Aim for about 44 by 44 CSS pixels, which is a widely used guideline for touch targets, so people can tap them without hitting the wrong thing.' },
    { q: 'Why move focus to main after a page change?', a: 'In a single page app the browser does not reload, so screen readers get no signal that a new page appeared. Moving focus to the main content announces it and puts keyboard users in the right place.' },
  ], 'responsive css mobile first, react accessibility, wcag contrast, focus visible, prefers-color-scheme dark mode'),

  // ------------------------------------------------------------ 35
  lesson(S7, 'react-performance-memo-debounce-and-code-splitting', 'React Performance: memo, Debounce and Code Splitting with lazy', 'Stop unnecessary redraws with memo, cut requests with a debounce hook, and shrink the first download by loading pages only when needed.', '', [
    P("Performance advice often starts with the wrong lesson: “optimise everything”. The right order is to **measure first**, fix what is slow, and leave the rest alone. Most small apps are fast without any tricks. But three techniques are cheap, safe and worth knowing, because they solve problems you will meet: unnecessary redraws, too many requests, and a big first download."),

    H("1. Debounce: wait until typing stops"),
    S(35, 'client/src/hooks/useDebounce.js'),
    P("`useDebounce(value, delay)` returns a copy of `value` that only changes after the original has stopped changing for `delay` milliseconds. Each change starts a timer, and the cleanup function cancels the previous one, so only the last one fires. Typing “bank” sends one request instead of four."),
    S(35, 'client/src/components/Filters.jsx'),
    P("The search box now shows what you type **at once** from local `text` state, so typing never feels laggy, and only the debounced value is passed up, which updates the URL and triggers the request. The second effect handles the other direction: if the address changes by itself (the back button, “clear filters”), the box follows it. Read the two effects carefully: they are written so they cannot overwrite what you are typing."),
    H("2. memo: skip redraws that would change nothing"),
    S(35, 'client/src/components/JobCard.jsx'),
    P("When a parent component draws again, all its children draw again too, even if their props are the same. For a handful of cards that is nothing. For fifty cards that each contain a `<select>`, it adds up. `memo(JobCard)` tells React to skip drawing a card when its props are **identical to last time**."),
    P("This only works if the props really are the same. That is why earlier lessons took care of two things. Jobs are replaced only when they change (the spread in `changeStatus`, never mutation), so an unchanged `job` object is the same reference. And `changeStatus` is wrapped in `useCallback`, so its identity is stable. If the page passed a new inline function such as `onStatusChange={(id, s) => ...}` on each draw, `memo` would do nothing. Performance work is often just consistency."),
    N("Do not wrap everything in `memo`, `useMemo` and `useCallback` “just in case”. Each one has a cost and makes code harder to read. Use them when you have measured a slow screen (React Developer Tools has a Profiler), or, as here, where a list of many similar items is clearly the hot spot."),
    H("3. Code splitting: download less at the start"),
    S(35, 'client/src/App.jsx'),
    P("A single bundle contains the code of every page, so the person downloads the registration form even if they only wanted to sign in. `lazy(() => import('./pages/X.jsx'))` tells the bundler to put that page in its **own file**, which is fetched the first time the route is needed. `<Suspense fallback=...>` shows something while it loads. The build output shows the result: instead of one large file you will see a small file per page."),
    H("Measure the result"),
    L(
      "Run `npm run build` in `client` and compare the list of files and their sizes before and after.",
      "In the browser's Network tab, throttle to “Slow 3G” and reload the login page. Only the login code should be fetched.",
      "In the Performance and Lighthouse panels you will see numbers such as first paint. Treat them as a guide, not a score to chase.",
    ),
    ...task(
      "Run the app and type quickly in the search box. In the Network tab, count the requests before and after the debounce (undo it to compare).",
      "Open React Developer Tools, enable “Highlight updates when components render”, and change one status. With `memo`, only one card flashes.",
      "Build the client and note how many JavaScript files appear. Open the login page and see which are loaded.",
    ),
    ...check("Fast typing sends one request, not one per letter.", "Changing a status redraws one card.", "The build shows separate files for the pages."),
    H("Summary"),
    L("Measure first. Fix only real problems.", "Debounce user input; memoise list items when props are stable; split code by page.", "memo only helps when props keep the same identity: keep objects and functions stable."),
  ], [
    { q: 'Should I use memo, useMemo and useCallback everywhere?', a: 'No. They cost memory and make code harder to read. Use them when a profiler shows a real slowdown, or for a long list of identical items as in this lesson.' },
    { q: 'What does a debounce do?', a: 'It waits until a value stops changing for a short time before acting on it. For a search box it turns many keystrokes into one request.' },
    { q: 'What is code splitting?', a: 'Building your JavaScript into several files so that the browser only downloads the code for the page it needs. React.lazy and dynamic import() do it for routes.' },
  ], 'react performance, react memo tutorial, react debounce hook, react lazy suspense code splitting, optimize react app'),
];
