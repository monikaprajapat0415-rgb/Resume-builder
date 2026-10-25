import { P, H, L, O, N, C, task, check, lesson } from './helpers.js';

const S3 = 'Advanced React';

export const lessons = [
  // ---------------------------------------------------------------- 26
  lesson(S3, 'testing-react-vitest-testing-library', 'Testing React Apps with Vitest and React Testing Library', 'Learn why and how to test React components. Set up Vitest, write tests that act like a user, test forms, async data and hooks, and avoid fragile tests.', '', [
    P("A test is a small program that checks that your code still works. When you change something next month, tests tell you at once if you broke something else. Many beginners skip tests because they feel like extra work. In this lesson you will see that a few good tests are quick to write, and that they make changing code much less scary."),

    H("What should you test?"),
    P("Do not try to test everything. Test what **matters to the user**, and what is easy to break:"),
    L(
      "**Plain functions** with rules, such as validation or price calculations. These are the easiest and most valuable tests.",
      "**Components** the way a person uses them: the person sees text, clicks buttons and types in fields.",
      "**Important flows**: sign in, add to cart, submit a form, an error message after a failed request.",
    ),
    P("A good guide from the testing library's own creators: **test what the user sees and does, not how your code is built inside**. If you test internal details like state names, your tests break when you tidy your code, even though the app still works. Those are bad tests."),

    H("The tools"),
    L(
      "**Vitest** is the test runner. It works with Vite, so it needs almost no setup, and it is very fast. (Jest is an older, similar tool you may see in other projects.)",
      "**React Testing Library** draws your component in a fake browser and gives you ways to find things the way a user would: by text, by label and by role.",
      "**jest-dom** adds helpful checks like “is this in the page?”.",
      "**user-event** pretends to be a real person clicking and typing.",
    ),
    C('bash', `npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`),
    P("Then add this to `vite.config.js`, and a setup file:"),
    C('js', `// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});

// src/test/setup.js
import '@testing-library/jest-dom/vitest';`),
    C('json', `// package.json scripts
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}`),
    P("`npm test` starts Vitest in watch mode: it reruns the tests you changed as you save. `npm run test:run` runs once, which is what you use in a build."),

    H("Your first test: a plain function"),
    C('js', `// price.js
export function totalPrice(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// price.test.js
import { describe, it, expect } from 'vitest';
import { totalPrice } from './price';

describe('totalPrice', () => {
  it('adds up price times quantity', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 1 },
    ];
    expect(totalPrice(items)).toBe(25);
  });

  it('returns 0 for an empty cart', () => {
    expect(totalPrice([])).toBe(0);
  });
});`),
    L(
      "`describe` groups tests. `it` (or `test`) is one test with a clear sentence about what should happen.",
      "`expect(value).toBe(expected)` is an **assertion**. If it is not true, the test fails and shows you the difference.",
    ),

    H("Testing a component"),
    C('jsx', `// Counter.jsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add one</button>
    </div>
  );
}

// Counter.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

it('adds one when the button is clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Add one' }));

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});`),
    P("The test follows what a person does: draw the component, see “Count: 0”, click the button named “Add one”, see “Count: 1”. It says nothing about `useState`. If you later rewrite the counter with `useReducer`, this test still passes, which is exactly the point."),

    H("Finding things: the query priority"),
    P("Testing Library suggests finding elements the way people and assistive tools do. Use them in this order:"),
    O(
      "`getByRole('button', { name: 'Save' })`: the best. It also checks that your page is accessible.",
      "`getByLabelText('Email')`: for form fields.",
      "`getByText('Welcome')`: for text content.",
      "`getByPlaceholderText`, `getByAltText`, `getByTitle`: when the above do not fit.",
      "`getByTestId('x')`: last resort, using a `data-testid` attribute.",
    ),
    P("There are three families: **`getBy`** throws if the thing is missing, **`queryBy`** returns `null` (use it to check that something is **not** there), and **`findBy`** waits for it to appear (use it for async changes)."),

    H("Testing a form"),
    C('jsx', `it('shows an error for a short password and submits when valid', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<SignUpForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Email'), 'asha@example.com');
  await user.type(screen.getByLabelText('Password'), 'short');
  await user.click(screen.getByRole('button', { name: 'Create account' }));

  expect(screen.getByRole('alert')).toHaveTextContent('at least 8 characters');
  expect(onSubmit).not.toHaveBeenCalled();

  await user.clear(screen.getByLabelText('Password'));
  await user.type(screen.getByLabelText('Password'), 'longenough123');
  await user.click(screen.getByRole('button', { name: 'Create account' }));

  expect(onSubmit).toHaveBeenCalledTimes(1);
});`),
    P("`vi.fn()` makes a **mock function**: a fake function that remembers how it was called. We pass it in as `onSubmit` and check that it was (or was not) called. Notice also that finding fields **by label** forces your form to have proper labels."),

    H("Testing async data"),
    P("For components that load data, do not call the real server in a test. It would be slow and unreliable. Replace `fetch` with a fake:"),
    C('jsx', `import { vi } from 'vitest';

it('shows posts after loading', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ id: 1, title: 'First post' }],
  }));

  render(<Posts />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(await screen.findByText('First post')).toBeInTheDocument();
});

it('shows an error when the request fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

  render(<Posts />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Could not load');
});`),
    P("`findByText` waits (for up to a second by default) until the text appears. Testing both the happy path and the error path is important, because errors are where real apps break. For bigger projects, a tool called **MSW** (Mock Service Worker) fakes the network at a deeper level, so you do not need to stub `fetch` in every test."),

    H("Testing a custom hook"),
    C('jsx', `import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';

it('toggles the value', () => {
  const { result } = renderHook(() => useToggle(false));

  expect(result.current[0]).toBe(false);

  act(() => result.current[1]());

  expect(result.current[0]).toBe(true);
});`),
    P("`renderHook` runs your hook inside a tiny test component. `act` makes sure React has finished updating before you check the result. Testing Library's own helpers like `user.click` already wrap `act` for you."),

    H("Testing with context and a router"),
    P("A component that uses context or React Router needs the provider around it. Make a small helper:"),
    C('jsx', `import { MemoryRouter } from 'react-router-dom';

function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}`),
    P("`MemoryRouter` is a router that keeps the address in memory, so no real browser is needed."),

    H("What makes a good test"),
    L(
      "It has a **clear name** that reads like a sentence: “shows an error for a short password”.",
      "It tests **one idea**.",
      "It does **not depend on other tests** or on the order they run.",
      "It uses **no real network, timers or dates** when it can fake them.",
      "It would **still pass** if you rewrote the inside of the component but kept the behaviour.",
    ),
    P("Do not chase 100 percent coverage. A few tests on your most important paths are worth more than many tests on trivial things. When you fix a bug, **write a test that fails because of the bug first**. Then fix it. The bug can never silently return."),

    H("Beyond component tests"),
    L(
      "**End-to-end tests** with Playwright or Cypress open a real browser and click through your whole app, including the server. They are slower, so write a few for the most important journeys, such as sign up and checkout.",
      "**Continuous integration (CI)** runs your tests automatically on every push, for example with GitHub Actions, so a broken change is caught before it goes live.",
    ),

    H("Common mistakes"),
    L(
      "Testing internal state or function names instead of what the user sees.",
      "Using `getByTestId` for everything, which skips accessibility checks.",
      "Forgetting `await` with `user.click` and `findBy`, so the test checks too early.",
      "Calling real APIs in tests.",
      "Tests that depend on each other, or on the current date.",
    ),
    ...task(
      "Install Vitest and Testing Library, and write two tests for a `totalPrice` function.",
      "Write a test for a counter: click, and check the new text.",
      "Write a test for your sign-up form: a short password shows an error, and a good one calls `onSubmit`.",
      "Write a test for a component that loads data, with a fake `fetch`, for both success and failure.",
    ),
    ...check("`npm run test:run` passes and prints a list of your tests.", "Changing the inside of a component (for example from `useState` to `useReducer`) does not break its test.", "You can break a feature on purpose and see a test fail."),
    H("Summary"),
    L(
      "Test what users see and do. Start with plain functions, then the key components and flows.",
      "Use Vitest to run tests, React Testing Library to draw components, and user-event to click and type.",
      "Find elements by role, label and text. Use `findBy` for async changes and `queryBy` to check something is absent.",
      "Fake the network. Test both success and error paths. Run tests in CI.",
    ),
  ], [
    { q: 'Should I use Jest or Vitest?', a: 'Vitest works with Vite and needs little setup. Jest is older and also common. The API is very similar, so skills carry over.' },
    { q: 'What is React Testing Library?', a: 'A library that draws components in a test environment and finds elements the way a user would, by role, label and text.' },
    { q: 'How many tests should I write?', a: 'Enough to protect your important flows and rules. Chasing 100 percent coverage wastes time. When you fix a bug, add a test for it.' },
    { q: 'Why is my async test failing?', a: 'You probably forgot await, or used getBy instead of findBy for something that appears later.' },
  ], 'react testing library tutorial, vitest react, react unit testing, test react components, react testing best practices'),

  // ---------------------------------------------------------------- 27
  lesson(S3, 'react-accessibility-a11y-guide', 'React Accessibility (a11y): Build Apps Everyone Can Use', 'Learn the basics of accessible React: semantic HTML, keyboard use, labels, focus, colour contrast, ARIA, route changes and how to test.', '', [
    P("Accessibility, often written **a11y**, means making your app usable by **everyone**, including people who are blind, have low vision, cannot use a mouse, are deaf, or have trouble reading or focusing. It also helps people on a bright street, with one hand free, or with a slow connection. In many countries it is also a legal requirement for some kinds of sites. The good news: most of it is simple, and React makes it as easy as plain HTML."),

    H("Who benefits?"),
    L(
      "**Screen reader users** hear the page read aloud. They depend on correct structure and labels.",
      "**Keyboard users** move with Tab, Enter, Space and the arrow keys, with no mouse.",
      "**People with low vision** zoom the page, use large text, or need high colour contrast.",
      "**People with colour blindness** cannot rely on colour alone.",
      "**People with hearing loss** need captions for video and audio.",
      "**People with attention or reading difficulties** benefit from clear, simple, predictable pages.",
    ),

    H("Rule 1: use the right HTML element"),
    P("This is the most powerful rule. Browsers and screen readers already understand real HTML elements. A real `button` can be reached with Tab, pressed with Enter and Space, and is announced as a button, all for free. A `div` with an `onClick` has none of that."),
    C('jsx', `// Bad: looks like a button, but a keyboard and a screen reader cannot use it
<div className="btn" onClick={save}>Save</div>

// Good
<button type="button" onClick={save}>Save</button>`),
    L(
      "Use `button` for actions and `a` (or `Link`) for navigation.",
      "Use headings `h1` to `h6` in order, with one `h1` per page. They are the outline of your page.",
      "Use `nav`, `main`, `header`, `footer`, `section` and `article` for the page layout.",
      "Use `ul` and `li` for lists, and `table` with `th` for real tables of data.",
    ),
    P("These elements are called **semantic HTML**. Using them gives you most of accessibility with no extra code."),

    H("Rule 2: label everything"),
    L(
      "Every form field needs a visible `label`, connected with `htmlFor` and `id`. A placeholder is not a label.",
      "Every meaningful image needs `alt` text that says what it **means**. A decorative image gets an empty `alt=\"\"` so screen readers skip it.",
      "Buttons that show only an icon need a name: `<button aria-label=\"Close\">X</button>`.",
      "Links should make sense alone. “Read our pricing guide” is better than “click here”.",
    ),
    C('jsx', `<label htmlFor="email">Email address</label>
<input id="email" type="email" autoComplete="email" />

<img src={product.photo} alt={'Red running shoe, side view'} />
<img src="/divider.png" alt="" />`),
    P("In React, you can make unique ids with the `useId` hook, which is safe to use when a component appears many times on one page:"),
    C('jsx', `import { useId } from 'react';

function TextField({ label }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}`),

    H("Rule 3: the keyboard must work"),
    P("Put your mouse away and try your app with only the keyboard. Can you reach everything with Tab? Can you see where you are? Can you press every button with Enter or Space? Can you leave a modal with Escape?"),
    L(
      "Keep the **focus outline** visible. Never write `outline: none` without giving a clear replacement, such as a coloured ring with `:focus-visible`.",
      "The **Tab order** should follow the visual order. Avoid positive `tabIndex` values. Use `tabIndex={0}` only for rare custom controls, and `tabIndex={-1}` to allow focusing an element from code.",
      "Add a **skip link** at the top of the page that jumps to the main content, so keyboard users do not Tab through the whole menu on every page.",
      "Never trap focus, except inside an open modal, where it must stay until the modal closes.",
    ),
    C('jsx', `<a href="#main" className="skip-link">Skip to main content</a>
...
<main id="main" tabIndex={-1}>...</main>`),

    H("Rule 4: do not rely on colour alone"),
    L(
      "Text needs enough **contrast** with its background. The common guide is at least 4.5 to 1 for normal text, and 3 to 1 for large text. Browser tools can check this for you.",
      "Do not show an error only with red. Add an icon or text such as “Error: ...”.",
      "Links inside text should be underlined or otherwise clearly different, not only a different colour.",
      "Respect **reduced motion**: some people feel sick from animation. Use `@media (prefers-reduced-motion: reduce)` to turn it off.",
    ),

    H("ARIA: use it when HTML is not enough"),
    P("**ARIA** attributes add extra information for assistive technology. The first rule of ARIA is: **do not use ARIA if a normal HTML element can do the job**. Wrong ARIA is worse than none. When you really need it, these are the most common attributes:"),
    L(
      "`aria-label`: gives a name to an element that has no visible text.",
      "`aria-labelledby`: names an element using another element's text.",
      "`aria-describedby`: connects help or error text to a field.",
      "`aria-expanded` and `aria-controls`: tell if a menu or panel is open, and what it controls.",
      "`aria-live=\"polite\"` or `role=\"status\"`: announces changes, such as “Item added to cart”.",
      "`role=\"alert\"`: announces an important message at once, such as an error.",
      "`aria-hidden=\"true\"`: hides decoration from screen readers.",
    ),
    C('jsx', `function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div>
      <button aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        {title}
      </button>
      <div id={panelId} hidden={!open}>{children}</div>
    </div>
  );
}`),

    H("Announce changes"),
    P("When something changes on the page without a reload (a message, a count, a loaded list), a screen reader user may not notice. A **live region** announces it:"),
    C('jsx', `<p role="status" aria-live="polite">{cartCount} items in your cart</p>

{error && <p role="alert">{error}</p>}`),
    P("Keep announcements short, and do not announce every tiny change."),

    H("Single page apps: route changes"),
    P("In a normal website, loading a new page tells the screen reader that something changed. In a React app with a router, the page changes silently. Help the user by moving focus and updating the title:"),
    C('jsx', `import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function RouteAnnouncer() {
  const { pathname } = useLocation();
  const headingRef = useRef(null);

  useEffect(() => {
    document.title = 'Page: ' + pathname + ' | My App';
    document.querySelector('h1')?.focus();
  }, [pathname]);

  return null;
}
// give each page's <h1 tabIndex={-1}> so it can receive focus`),
    P("Also give every page a unique, helpful `document.title`."),

    H("Test accessibility"),
    L(
      "**Use only the keyboard** for a few minutes. It reveals most problems.",
      "**ESLint plugin `jsx-a11y`** warns about problems as you type (it is included in many React starters).",
      "**Lighthouse** (in Chrome) and the **axe DevTools** extension scan a page for common problems.",
      "**Turn on a screen reader**: VoiceOver on Mac and iPhone, TalkBack on Android, NVDA (free) on Windows. Even a short try is eye-opening.",
      "**React Testing Library** queries like `getByRole` and `getByLabelText` fail when your markup is not accessible.",
    ),
    N("Automated tools find only part of the problems, often said to be less than half. They are a good start, but they cannot tell if your `alt` text is helpful or if the page makes sense. Always add a manual check."),

    H("A quick checklist"),
    L(
      "Real `button`, `a`, `nav`, `main`, and heading elements in the right order.",
      "Every field has a label, every image has suitable `alt`.",
      "Everything works with the keyboard and the focus is always visible.",
      "Text contrast is good, and colour is never the only signal.",
      "Errors and changes are announced, and route changes are handled.",
      "Animation can be reduced, and text can be zoomed to 200 percent without breaking.",
    ),

    H("Common mistakes"),
    L(
      "Using `div` for buttons and links.",
      "Removing the focus outline.",
      "Using placeholder text as the only label.",
      "Adding ARIA that does not match what the element really does.",
      "Skipping heading levels or using headings only for size.",
      "Forgetting that route changes are silent.",
    ),
    ...task(
      "Unplug your mouse and use your app with only the keyboard. Write down every problem.",
      "Fix one: replace a `div` button with a real button, and add a visible focus style.",
      "Add a skip link and make sure every form field has a label.",
      "Run Lighthouse and fix the first three accessibility issues it reports.",
    ),
    ...check("You can reach and use every control with only the keyboard.", "A screen reader reads each field with its label.", "Lighthouse shows a high accessibility score and no contrast errors."),
    H("Summary"),
    L(
      "Use semantic HTML first: real buttons, links, headings and landmarks.",
      "Label fields, add `alt` text, keep focus visible, and make everything work with a keyboard.",
      "Do not rely on colour alone, and keep good contrast.",
      "Use ARIA only when needed, announce changes, handle route changes, and test with a keyboard, tools and a screen reader.",
    ),
  ], [
    { q: 'What is accessibility in web development?', a: 'Building websites and apps that people with disabilities, and everyone else, can use, including with keyboards, screen readers and zoom.' },
    { q: 'Do I need ARIA for everything?', a: 'No. Use semantic HTML first. Add ARIA only when HTML cannot do the job. Wrong ARIA can make things worse.' },
    { q: 'How do I test accessibility in React?', a: 'Use the keyboard only, run Lighthouse or axe, use the jsx-a11y ESLint plugin, and try a screen reader. Automated tools find only part of the problems.' },
    { q: 'What is the minimum colour contrast?', a: 'A common guide is 4.5 to 1 for normal text and 3 to 1 for large text. Browser developer tools can show the ratio.' },
  ], 'react accessibility, a11y react, react aria, accessible react app, react keyboard navigation'),

  // ---------------------------------------------------------------- 28
  lesson(S3, 'react-19-new-features-actions-use-optimistic', 'React 19 New Features: Actions, useActionState, useOptimistic, use and More', 'Learn the main new tools in React 19 in simple words: form actions, useActionState, useFormStatus, useOptimistic, the use API, ref as a prop and document metadata.', '', [
    P("React 19 added several features that make common jobs, such as forms and data loading, shorter and easier. You do not need them to build good apps, and older code that uses the earlier ways keeps working. But you will see these tools in new projects, so it is good to know what they do. This lesson explains each one with a small example."),
    N("React moves fast, and details can change between versions. This lesson covers the main ideas of React 19. For exact and current details, check the official React documentation at react.dev."),

    H("The big idea: Actions"),
    P("An **action** is a function that does something with data, usually asynchronous, such as sending a form to a server. React 19 lets you pass a function to a form's `action` prop. React runs it for you when the form is submitted, handles the “pending” period, and resets the form fields after a good submit."),
    C('jsx', `function Newsletter() {
  async function subscribe(formData) {
    const email = formData.get('email');
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }

  return (
    <form action={subscribe}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}`),
    P("Compare this with the forms in lessons 9 and 19: there is no `onSubmit`, no `preventDefault`, no `FormData` call, and no state for the fields. React gives your function the `FormData` for you. The form also works as a plain HTML form if JavaScript is slow to load."),

    H("useActionState: results, errors and pending"),
    P("An action usually needs to give something back, like an error message or a success note. `useActionState` connects an action to state:"),
    C('jsx', `import { useActionState } from 'react';

async function signUpAction(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (password.length < 8) {
    return { error: 'Your password needs at least 8 characters.' };
  }
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return { error: 'Could not create the account. Please try again.' };
  return { success: true };
}

function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, {});

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" required />

      <button disabled={isPending}>{isPending ? 'Creating...' : 'Create account'}</button>

      {state.error && <p role="alert">{state.error}</p>}
      {state.success && <p role="status">Account created. Welcome!</p>}
    </form>
  );
}`),
    L(
      "The action receives the **previous state** as its first argument, and the `FormData` as the second.",
      "Whatever the action **returns** becomes the new `state`.",
      "`useActionState` gives you `[state, formAction, isPending]`. Use `formAction` in the form, and `isPending` to disable the button.",
    ),
    P("Forms that need validation, errors and a loading state become much shorter. Remember, as always, to **validate again on the server**."),

    H("useFormStatus: a button that knows"),
    P("A submit button deep in a component tree can know whether its parent form is sending, without any props, using `useFormStatus` from `react-dom`:"),
    C('jsx', `import { useFormStatus } from 'react-dom';

function SubmitButton({ children }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Sending...' : children}</button>;
}

// use it inside any form
<form action={subscribe}>
  <input name="email" type="email" />
  <SubmitButton>Subscribe</SubmitButton>
</form>`),
    P("It must be used in a component that is **inside** the form, not in the component that renders the form itself."),

    H("useOptimistic: update at once, fix later"),
    P("When someone clicks a heart or sends a chat message, waiting for the server makes the page feel slow. An **optimistic update** shows the expected result **immediately**, and returns to the real state if the request fails. `useOptimistic` makes this easy:"),
    C('jsx', `import { useOptimistic, useState } from 'react';

function Messages({ initialMessages, sendToServer }) {
  const [messages, setMessages] = useState(initialMessages);
  const [optimistic, addOptimistic] = useOptimistic(
    messages,
    (current, newText) => [...current, { id: 'temp-' + newText, text: newText, sending: true }]
  );

  async function send(formData) {
    const text = formData.get('text');
    addOptimistic(text);                       // appears at once, marked "sending"
    const saved = await sendToServer(text);    // real request
    setMessages((current) => [...current, saved]);
  }

  return (
    <div>
      <ul>
        {optimistic.map((m) => (
          <li key={m.id} style={{ opacity: m.sending ? 0.5 : 1 }}>{m.text}</li>
        ))}
      </ul>
      <form action={send}>
        <input name="text" required />
        <button>Send</button>
      </form>
    </div>
  );
}`),
    P("The optimistic value is used **only while the action runs**. When it finishes, React uses the real `messages` again. If the request failed, the temporary message simply disappears, since the real state never included it. Show an error message to explain."),

    H("The use API"),
    P("`use` is a new function that reads a value that may not be ready yet. It can read a **promise**, and it can read **context**. When given a promise, it pauses the component until the promise is done, and shows the nearest `Suspense` fallback meanwhile."),
    C('jsx', `import { use, Suspense } from 'react';

function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);   // waits here
  return <ul>{comments.map((c) => <li key={c.id}>{c.text}</li>)}</ul>;
}

function Post({ commentsPromise }) {
  return (
    <Suspense fallback={<p>Loading comments...</p>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}`),
    P("An important point: the promise should be created **outside** the rendering component, for example by a parent, a router loader, a framework or a data library, and passed down. If you create a new promise inside the component that calls `use`, it will create a new one every render and loop. For most apps, a library such as TanStack Query or a framework handles this for you. Unlike other hooks, `use` can be called inside an `if` or a loop. When reading context, `use(MyContext)` works like `useContext`."),

    H("ref as a normal prop"),
    P("Before React 19, passing a ref through your own component needed `forwardRef`. Now `ref` is simply a prop that function components can receive:"),
    C('jsx', `function TextInput({ ref, label, ...rest }) {
  return (
    <label>
      {label}
      <input ref={ref} {...rest} />
    </label>
  );
}`),
    P("Refs can also have a **cleanup function** now: a ref callback may return a function that React calls when the element is removed."),

    H("Document metadata in components"),
    P("You can now write `title`, `meta` and `link` tags **anywhere in your components**, and React moves them into the `head` of the page for you:"),
    C('jsx', `function ProductPage({ product }) {
  return (
    <article>
      <title>{product.name} | My Shop</title>
      <meta name="description" content={product.summary} />
      <h1>{product.name}</h1>
    </article>
  );
}`),
    P("This replaces the need for a helper library for simple cases. Remember that a page drawn only in the browser is harder for search engines to read, so for pages that must rank well, think about server rendering."),

    H("Smaller improvements"),
    L(
      "**Context as a provider:** you can write `<ThemeContext value=\"dark\">` instead of `<ThemeContext.Provider value=\"dark\">`.",
      "**Better error reporting:** clearer messages, and options to report errors caught and not caught.",
      "**Support for custom elements** (web components).",
      "**Stylesheets and scripts:** better control of loading order and avoiding duplicates.",
      "**Preloading helpers** such as `preload` and `preconnect` in `react-dom`.",
    ),

    H("The React Compiler and Server Components"),
    P("Two bigger ideas go with this release. The **React Compiler** is a build tool that adds memoisation for you, so you write less `useMemo` and `useCallback`. **Server Components** let some components run only on the server and send results to the browser, which is used by frameworks such as Next.js. You do not need either to start. Learn them after you are comfortable with everything in this course."),

    H("Should you use these features now?"),
    L(
      "If you start a new project on React 19, yes: form actions and `useActionState` make forms shorter.",
      "If your project uses an older version, the old ways (`onSubmit`, `useState`) still work, and you can upgrade later.",
      "Keep using a data library for server data. `use` is a building block, not a replacement for caching.",
    ),

    H("Common mistakes"),
    L(
      "Calling `useFormStatus` in the same component that renders the form. It must be in a child.",
      "Creating the promise inside the component that calls `use`.",
      "Forgetting `name` on inputs, so the `FormData` has no values.",
      "Trusting only the client check. Always validate on the server.",
      "Using optimistic updates for actions that often fail.",
    ),
    ...task(
      "Make a newsletter form with a form action and no `onSubmit`.",
      "Rewrite your sign-up form with `useActionState` and show the pending state and error.",
      "Add a `SubmitButton` that uses `useFormStatus`.",
      "Add an optimistic message list that shows new messages at once.",
    ),
    ...check("The form works with no `preventDefault` code.", "The button is disabled and shows “Creating...” while the request runs.", "A new message appears immediately, and disappears if you make the fake request fail."),
    H("Summary"),
    L(
      "Form `action` takes a function that receives the `FormData`. `useActionState` adds result, error and pending state.",
      "`useFormStatus` lets a child button know that its form is sending. `useOptimistic` shows expected results at once.",
      "`use` reads a promise or context, and works with `Suspense`. `ref` is now a normal prop.",
      "You can render `title` and `meta` tags in components. The old ways still work.",
    ),
  ], [
    { q: 'What is new in React 19?', a: 'Form actions, useActionState, useFormStatus, useOptimistic, the use API, ref as a prop, document metadata in components, and other smaller improvements.' },
    { q: 'Do I have to upgrade to React 19?', a: 'No. Older ways keep working. Upgrade when you are ready, or start new projects on the latest version.' },
    { q: 'What is useOptimistic?', a: 'A hook that shows an expected result immediately while a request is running, and goes back to the real state if the request fails.' },
    { q: 'Is use the same as useEffect for fetching?', a: 'No. use reads a promise that was created outside the component and waits with Suspense. Data libraries or frameworks usually create and cache those promises.' },
  ], 'react 19 new features, react useactionstate, react form actions, react useoptimistic, react use api'),

  // ---------------------------------------------------------------- 29
  lesson(S3, 'react-with-typescript-beginners-guide', 'React with TypeScript: A Beginner Guide to Typing Props, State and Events', 'Learn TypeScript for React in simple steps: typing props, state, events, refs, hooks, context and API data, and understand the errors it finds for you.', '', [
    P("**TypeScript** is JavaScript with **types**. A type says what kind of value something is: a number, a piece of text, a list of users. TypeScript checks this while you write, and underlines mistakes in your editor **before** you run the app. Many React jobs ask for TypeScript, because it catches many bugs early and makes big projects easier to understand. This lesson shows the parts you need for React, with plain language."),

    H("Why use TypeScript?"),
    L(
      "It finds **typos and wrong values** as you type, such as `user.nmae` or passing a string where a number is needed.",
      "It gives **better auto-complete** in your editor, because it knows the shape of your data.",
      "It works as **living documentation**: you can see what props a component needs without opening it.",
      "It makes **changing code safer**, because the editor shows every place that must change.",
    ),
    P("The price is a little extra writing and a short time to learn. TypeScript is removed when your app is built, so the browser still runs plain JavaScript. It does not make code run faster or slower."),

    H("Start a TypeScript project"),
    C('bash', `npm create vite@latest my-ts-app -- --template react-ts
cd my-ts-app
npm install
npm run dev`),
    P("Files now end in `.ts` (plain code) and `.tsx` (code with JSX). Use `.tsx` for components."),

    H("The basic types"),
    C('ts', `const name: string = 'Asha';
const age: number = 24;
const isAdmin: boolean = false;
const tags: string[] = ['react', 'css'];       // a list of text
const scores: Array<number> = [1, 2, 3];       // the same idea
const pair: [string, number] = ['age', 24];    // a tuple: exact shape

let id: string | number = 5;                   // a union: one or the other
id = 'abc';                                    // fine

function double(n: number): number {
  return n * 2;
}`),
    P("TypeScript can often **guess** a type, so you do not always write it. `const age = 24` is already known to be a number. Write types where TypeScript cannot guess, such as function parameters."),

    H("Describing objects: type and interface"),
    C('ts', `type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;              // the ? means optional
  role: 'admin' | 'editor' | 'viewer';   // only these words are allowed
};

const user: User = { id: 1, name: 'Asha', email: 'a@b.com', role: 'admin' };
// user.role = 'boss';   // error: not one of the allowed words`),
    P("`interface` is almost the same and you will see both. A simple rule: use `type` or `interface` consistently in your project. The union of allowed words, like `'admin' | 'editor'`, is very useful for statuses and options."),

    H("Typing props"),
    C('tsx', `type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

function Button({ label, onClick, disabled = false, variant = 'primary' }: ButtonProps) {
  return (
    <button className={variant} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// <Button label="Save" onClick={save} />            fine
// <Button label="Save" />                           error: onClick is missing
// <Button label={5} onClick={save} />               error: label must be text`),
    P("Now the editor tells you exactly which props a component needs and what type each should be, with no need to open the file."),
    P("For components that take `children`, use `ReactNode`:"),
    C('tsx', `import type { ReactNode } from 'react';

type CardProps = {
  title: string;
  children: ReactNode;
};

function Card({ title, children }: CardProps) {
  return <section><h2>{title}</h2>{children}</section>;
}`),

    H("Typing state"),
    P("`useState` often guesses the type from the first value. When the first value does not show the full type, tell it with angle brackets (a **generic**):"),
    C('tsx', `const [count, setCount] = useState(0);                  // number, guessed
const [name, setName] = useState('');                   // string, guessed

const [user, setUser] = useState<User | null>(null);    // a User, or nothing yet
const [items, setItems] = useState<string[]>([]);       // an empty list of text`),
    P("`useState<User | null>(null)` says: this may hold a user or `null`. Now TypeScript makes you check for `null` before using it, which prevents the very common error “cannot read property of null”:"),
    C('tsx', `if (!user) return <p>Loading...</p>;
return <h1>{user.name}</h1>;     // safe: TypeScript knows user is a User here`),

    H("Typing events"),
    C('tsx', `import type { ChangeEvent, FormEvent } from 'react';

function Form() {
  const [email, setEmail] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={handleChange} />
    </form>
  );
}`),
    P("You do not have to remember these names. If you write the handler **inline**, TypeScript knows the type already: `onChange={(e) => setEmail(e.target.value)}`. You only need a name when you write the handler as a separate function. Your editor will tell you the right one when you hover over the prop."),

    H("Typing refs"),
    C('tsx', `import { useRef } from 'react';

const inputRef = useRef<HTMLInputElement>(null);

function focusInput() {
  inputRef.current?.focus();     // ?. because it could be null
}

<input ref={inputRef} />`),

    H("Typing API data"),
    P("Describe what you expect from the server, then use that type when you fetch:"),
    C('tsx', `type Post = { id: number; title: string; body: string };

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  if (!response.ok) throw new Error('Request failed');
  return response.json();
}

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}`),
    N("A type is only a promise you make to the editor. TypeScript **cannot check what the server really sends** while the app runs. If the server changes, the type can be wrong. For important data, check it at runtime with a library such as Zod, which can also create the type for you."),

    H("Typing context and custom hooks"),
    C('tsx', `type AuthContextValue = {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside an AuthProvider');
  return value;
}

// a generic custom hook
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initial;
  });
  return [value, setValue] as const;
}`),
    P("The `T` in `useLocalStorage<T>` is a **generic**: a placeholder for any type. `useLocalStorage('count', 0)` makes `T` a number, and `useLocalStorage('user', { name: '' })` makes it an object. One hook, many types, all checked."),

    H("Useful tools to know"),
    L(
      "**`Partial<User>`** makes all fields optional. Useful for updates.",
      "**`Pick<User, 'id' | 'name'>`** keeps only some fields, and **`Omit<User, 'email'>`** removes some.",
      "**`Record<string, number>`** is an object with text keys and number values.",
      "**`as const`** makes a value read-only and exact.",
      "**`unknown`** is a safe version of `any`. It forces you to check the type before using it.",
    ),

    H("Avoid any"),
    P("The type `any` turns off checking for that value. It is tempting when a type is hard, but each `any` removes the safety you came for. Use `unknown` and narrow it, or write a simple type. Turn on `strict` mode in `tsconfig.json` (Vite does it for you), so TypeScript is as helpful as possible."),

    H("Reading TypeScript errors"),
    P("Errors can look long. Read the **last line** first, because it states the real difference, and read **where** (file and line). Hover the red line in your editor for a clearer explanation. Most errors in the first weeks are: a value that might be `null`, a missing prop, a wrong type in a prop, or a typo in a field name. All are good catches."),

    H("Common mistakes"),
    L(
      "Using `any` to make errors go away.",
      "Typing `useState([])` with no type, which makes the list `never[]`. Write `useState<string[]>([])`.",
      "Forgetting that data from the network is not checked at runtime.",
      "Casting with `as` to silence an error, hiding a real problem.",
      "Not enabling strict mode.",
    ),
    ...task(
      "Create a Vite React TypeScript project and make a `Button` component with typed props, including a `variant` union.",
      "Create a `User` type, and a `UserCard` component that takes a `user` prop. Try passing a wrong field and read the error.",
      "Fetch posts from the sample API and type the result with a `Post` type.",
      "Make a generic `useLocalStorage<T>` hook and use it with a string and with an object.",
    ),
    ...check("The editor shows red lines when you pass a wrong prop, and the error message makes sense.", "Auto-complete shows the fields of your `User` type.", "`npm run build` runs with no TypeScript errors."),
    H("Summary"),
    L(
      "TypeScript adds types to JavaScript and finds mistakes in your editor before you run the app.",
      "Type props with `type` or `interface`, state with `useState<Type>()`, and events with `ChangeEvent` and similar types.",
      "Use unions for fixed options, `?` for optional fields, and generics for reusable hooks.",
      "Avoid `any`, check network data at runtime, and keep strict mode on.",
    ),
  ], [
    { q: 'Do I need TypeScript to use React?', a: 'No. React works with plain JavaScript. TypeScript is popular in teams and jobs because it catches many mistakes early.' },
    { q: 'Should I learn JavaScript before TypeScript?', a: 'Yes. TypeScript is JavaScript plus types, so you need the JavaScript basics first.' },
    { q: 'What does useState<User | null>(null) mean?', a: 'The state can hold a User object or null. TypeScript then makes you check for null before using it.' },
    { q: 'Does TypeScript run in the browser?', a: 'No. It is turned into plain JavaScript when you build the app. The browser never sees the types.' },
  ], 'react typescript tutorial, typescript react props, react tsx beginners, typescript usestate, typescript react events'),

  // ---------------------------------------------------------------- 30
  lesson(S3, 'react-project-structure-best-practices-deploy-next-steps', 'React Project Structure, Best Practices, Deployment and What to Learn Next', 'Organise a real React project, follow clear best practices, check performance and security, deploy your app, and plan your next steps such as Next.js.', '', [
    P("You now know the building blocks of React. This final lesson joins them together. You will learn how to **organise a real project**, the **habits** that keep code clean, how to **deploy** your app so others can use it, and what to **learn next**. Think of it as the guide to leave the course and start building."),

    H("Project structure"),
    P("There is no single correct structure. A good one is easy to understand and easy to change. Here is a simple layout that works well up to a medium-sized app:"),
    C('text', `src/
  main.jsx
  App.jsx
  api.js                 // fetch helper and API functions
  components/            // shared pieces: Button, Modal, Card
  pages/                 // one file per page: Home, Products, Login
  hooks/                 // custom hooks: useDebounce, useFetch
  context/               // providers: AuthContext, ThemeContext
  utils/                 // plain helper functions: formatDate, validate
  assets/                // images and fonts
  styles/                // global CSS`),
    P("When the app grows, many teams switch from grouping by **type** (all components together) to grouping by **feature**, where each feature has its own folder with its own components, hooks and tests:"),
    C('text', `src/
  features/
    cart/
      CartPage.jsx
      CartItem.jsx
      useCart.js
      cart.test.jsx
    auth/
      LoginPage.jsx
      AuthContext.jsx
  components/            // only truly shared UI`),
    P("The feature layout keeps related files together, so changing the cart means working in one folder. Start simple, and reorganise when it begins to hurt."),

    H("Naming and file habits"),
    L(
      "Components: `PascalCase`, in a file with the same name (`ProductCard.jsx`).",
      "Hooks: start with `use` (`useDebounce.js`).",
      "Functions and variables: `camelCase`. Constants such as a fixed list: `UPPER_CASE` if you like.",
      "One component per file, and keep files short. If a file grows past a few hundred lines, split it.",
      "Name things for **what they are**, not how they look: `PrimaryButton` is better than `BlueButton`.",
    ),

    H("Best practices"),
    O(
      "**Keep components small and focused.** One job each. If a component does too much, split it.",
      "**Keep state as low as possible**, and lift it only when needed. Calculate what you can instead of storing it.",
      "**Never change state directly.** Make copies.",
      "**Use real HTML elements** (button, a, nav, label) for accessibility and less code.",
      "**Handle loading, empty and error states** on every screen that loads data.",
      "**Use stable keys** in lists. Never random keys.",
      "**Clean up effects** (timers, listeners, requests).",
      "**Do not optimise early.** Measure first, then fix real problems.",
      "**Write a few tests** for your most important flows and rules.",
      "**Use ESLint and Prettier** so the whole team writes code in the same way.",
    ),

    H("Environment variables"),
    P("Settings like the address of your API change between your computer and the live site. Put them in `.env` files. In Vite, variables must start with `VITE_` to be available in the browser:"),
    C('bash', `# .env
VITE_API_URL=http://localhost:5000/api`),
    C('js', `const API_URL = import.meta.env.VITE_API_URL;`),
    N("**Everything in a React app is public.** Anyone can open the browser tools and read your JavaScript, including every `VITE_` variable. Never put passwords, private keys or secret tokens in React code. Keep secrets on a server, and let your React app talk to that server."),

    H("Security basics for React apps"),
    L(
      "React **escapes** values in JSX, which protects you from most script injection. But never use `dangerouslySetInnerHTML` with content you did not clean. If you must show HTML from users, clean it with a library such as DOMPurify.",
      "Check links built from user input: a `javascript:` link in an `href` can run code. Allow only `http` and `https` addresses.",
      "Store login tokens carefully. Cookies with the `HttpOnly` flag, set by the server, are safer than `localStorage`, which any script on the page can read.",
      "Keep your packages updated and run `npm audit` now and then.",
      "**The server must check every permission and validate every input.** Hiding a button in React protects nothing.",
    ),

    H("Check before you ship"),
    L(
      "Run `npm run build` and `npm run preview`, and test the real build.",
      "Run **Lighthouse** and fix the biggest problems for performance, accessibility and SEO.",
      "Test on a **real phone**, or at a narrow width of about 390 pixels, and check that nothing scrolls sideways.",
      "Try the app with the **keyboard only**.",
      "Look in the console for errors and warnings.",
      "Give each page a unique `title` and description.",
    ),

    H("Deploy your app"),
    P("`npm run build` makes a folder called `dist` with plain files (HTML, JavaScript and CSS). Any place that can serve files can host it. Your main options:"),
    L(
      "**Static hosting platforms** (several free and paid ones exist). You connect your Git repository, and they build and publish your site on every push. This is the easiest way for beginners. Compare their current free limits on their own sites, as these change.",
      "**Your own server** with nginx or similar, serving the `dist` folder. More work, and more control.",
      "**Together with your API:** let your Node server serve the `dist` folder, so one server runs everything.",
    ),
    P("Two things to remember for any host:"),
    L(
      "**Single page app fallback:** because React Router draws pages in the browser, a visit to `/products/3` must return `index.html`. Turn on the “rewrite all to index.html” setting on your host.",
      "**HTTPS:** most platforms give it free. Always use it.",
    ),
    C('nginx', `# nginx example: serve the dist folder with a fallback to index.html
server {
  listen 80;
  server_name example.com;
  root /var/www/my-app/dist;
  index index.html;

  location / {
    try_files $uri /index.html;
  }

  # Files with a hash in the name can be cached for a long time
  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
}`),

    H("SEO and React"),
    P("A plain React app sends an almost empty HTML file, and builds the page in the browser. Search engines can often run JavaScript, but it is slower and less reliable, and sharing links on social media shows poor previews. For pages that must rank well, like articles, product pages and landing pages, consider:"),
    L(
      "**A framework with server rendering**, such as Next.js, which sends complete HTML.",
      "**Pre-rendering** your key pages at build time.",
      "At the very least, a unique **title** and **description** per page, real links (`a` or `Link`), a sitemap, and fast loading.",
    ),
    P("For private dashboards behind a login, plain React is fine, because search engines do not need to see them."),

    H("Your next steps"),
    P("You have learned the core of React. Here is a good order to keep growing:"),
    O(
      "**Build projects.** A to-do app, a movie search, a weather app, a notes app with login, an expense tracker. Finish them, deploy them and put them in your portfolio. This matters more than any course.",
      "**Next.js**, a framework built on React. It adds file-based pages, server rendering, data loading and more. Most of what you learned here applies directly.",
      "**TypeScript** in every new project. It is common in jobs.",
      "**A backend**: Node.js and Express with a database such as MongoDB or PostgreSQL, so you can build full applications. Our MERN stack course does this step by step.",
      "**Testing and continuous integration** to keep a growing project healthy.",
      "**More advanced topics**: Server Components, animations (with CSS or a library such as Framer Motion), real-time features with WebSockets, and mobile apps with React Native.",
    ),

    H("How to keep learning well"),
    L(
      "Read the **official docs at react.dev**. They are clear and have many small examples.",
      "Read other people's code in open source projects, and try fixing small issues.",
      "Build the same project twice: once simple, once with better structure, and compare.",
      "Explain what you learn to someone else, or write about it. Teaching is the best test.",
      "Do not chase every new library. Learn the ideas first, because the ideas stay the same when the tools change.",
    ),

    H("A final project idea"),
    P("Build a **job tracker** with the tools of this course: pages with React Router, a list with filters kept in the URL, a form with validation, data loaded with TanStack Query, shared login state in context, a loading and error screen for every request, a dark mode, tests for the form and the list, and a deploy to a live address. Add one feature of your own, write a short README with screenshots, and show it. You will have used almost everything from these thirty lessons in a single real app."),

    H("Common mistakes to avoid"),
    L(
      "Putting secrets in React code or `VITE_` variables.",
      "Skipping the host's fallback to `index.html`, so reloads give 404 errors.",
      "Over-engineering: adding Redux, TypeScript and ten libraries to a tiny app.",
      "Never finishing projects. Small and finished beats big and unfinished.",
      "Trusting the front end for security.",
    ),
    ...task(
      "Take one of your projects and reorganise it into the folder layout above.",
      "Run a production build, preview it and run Lighthouse. Fix the top three issues.",
      "Deploy it to a free static host and open the live link on your phone.",
      "Write down your next three projects and the first step of each.",
    ),
    ...check("The live site loads over HTTPS and a reload on a deep page still works.", "The console has no errors or secret keys in the code.", "You have a short list of projects to build next."),
    H("Summary"),
    L(
      "Organise by type at first, then by feature as the app grows. Keep components small and named clearly.",
      "Follow the habits: low state, no direct changes, real HTML, loading and error states, clean effects, a few good tests.",
      "Never put secrets in React code. The server must check permissions. Build with `npm run build` and deploy the `dist` folder with a fallback to `index.html`.",
      "Keep building real projects, and learn Next.js, TypeScript and a backend next.",
    ),
  ], [
    { q: 'How should I structure a React project?', a: 'Start with folders for components, pages, hooks, context and utils. As the app grows, group files by feature so related code stays together.' },
    { q: 'How do I deploy a React app?', a: 'Run npm run build to create the dist folder, then upload it to a static host or serve it with nginx or your Node server. Add a fallback to index.html for client side routes.' },
    { q: 'Is it safe to store API keys in a React app?', a: 'No. Everything in the browser can be read by visitors. Keep secrets on a server and let the React app call your server.' },
    { q: 'What should I learn after React?', a: 'Build projects, then learn TypeScript, Next.js and a backend with Node.js and a database. Testing and deployment skills are also valuable.' },
  ], 'react project structure, react best practices, deploy react app, react vite deployment, what to learn after react'),
];
