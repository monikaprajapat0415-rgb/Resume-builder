import { P, H, L, O, N, C, task, check, lesson } from './helpers.js';

const S1 = 'Start Here';

export const lessons = [
  // ---------------------------------------------------------------- 7
  lesson(S1, 'conditional-rendering-in-react', 'Conditional Rendering in React: Show and Hide Things the Easy Way', 'Learn the four ways to show different content: if, the ternary operator, && and early return. Includes loading, empty and error screens.', '', [
    P("Real pages show different things at different times. A person who is signed in sees their name, and a visitor sees a Sign in button. A list that is empty shows a friendly message. A page that is loading shows a spinner. Showing different content depending on a condition is called **conditional rendering**. In React there is no special syntax for it. You use plain JavaScript, which makes it easy to learn."),

    H("Way 1: an if statement before the return"),
    P("A component is a function, so you can use `if` before you return. This is the clearest way when the screens are very different."),
    C('jsx', `function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h2>Welcome back!</h2>;
  }
  return <h2>Please sign in.</h2>;
}`),
    P("When the first `return` runs, the function stops, so the second line is only reached when `isLoggedIn` is false. This idea is called an **early return**, and it keeps code flat and easy to read."),

    H("Way 2: the ternary operator"),
    P("Inside JSX you cannot write an `if` statement, because curly braces accept only expressions. The **ternary operator** is an expression with three parts: `condition ? valueIfTrue : valueIfFalse`."),
    C('jsx', `function Status({ isOnline }) {
  return (
    <p>
      The user is {isOnline ? 'online' : 'offline'}.
    </p>
  );
}

function Badge({ isOnline }) {
  return (
    <span className={isOnline ? 'badge green' : 'badge grey'}>
      {isOnline ? <b>Online</b> : <i>Offline</i>}
    </span>
  );
}`),
    P("You can use a ternary for text, for attribute values, and for whole pieces of JSX. If you find yourself nesting one ternary inside another, stop: it becomes very hard to read. Use `if` or a small component instead."),

    H("Way 3: the && operator"),
    P("When you want to show something **or nothing**, use `&&`. In JavaScript, `a && b` gives `b` if `a` is true, and gives `a` if it is false. React shows nothing for `false`, so this works as a simple “show this only if” rule."),
    C('jsx', `function Inbox({ unread }) {
  return (
    <div>
      <h2>Inbox</h2>
      {unread > 0 && <p>You have {unread} new messages.</p>}
    </div>
  );
}`),
    N("Watch out for the number zero. If `unread` is 0, then `unread && ...` gives `0`, and React **shows the number 0** on the page. That is why we wrote `unread > 0 &&`, which gives a real true or false. Always make the left side a true or false value."),

    H("Way 4: save JSX in a variable"),
    P("For bigger choices, you can pick the content first and then show it:"),
    C('jsx', `function Panel({ role }) {
  let content;
  if (role === 'admin') {
    content = <AdminTools />;
  } else if (role === 'editor') {
    content = <EditorTools />;
  } else {
    content = <p>You can only read.</p>;
  }
  return <section>{content}</section>;
}`),
    P("Another handy way is an object that maps a value to a component:"),
    C('jsx', `const screens = {
  home: <Home />,
  about: <About />,
  contact: <Contact />,
};

function Page({ name }) {
  return screens[name] || <NotFound />;
}`),

    H("The three screens every data page needs"),
    P("When a page loads data, it is always in one of three situations: it is still loading, it failed, or it has data. If you forget one of them, people see a blank page or a crash. A good pattern is to handle the unusual cases first with early returns:"),
    C('jsx', `function JobList({ jobs, loading, error }) {
  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p role="alert">Sorry, we could not load the jobs. Please try again.</p>;
  if (jobs.length === 0) return <p>No jobs yet. Add your first one!</p>;

  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>{job.title}</li>
      ))}
    </ul>
  );
}`),
    P("Because each unusual case returns early, the last part of the function only has to think about the happy case. This is much easier to read than a deep chain of `if` and `else`. Also notice the **empty state**: an empty list is not an error, and a helpful message with a next step is kinder than a blank space."),

    H("Showing nothing"),
    P("A component can return `null` to show nothing. This is useful when a component decides not to appear:"),
    C('jsx', `function Banner({ message }) {
  if (!message) return null;
  return <div className="banner">{message}</div>;
}`),

    H("Hiding with CSS or removing from the page?"),
    P("With conditional rendering, a hidden element is **removed** from the page, and any state inside it is lost. When it comes back, it starts fresh. If you want to keep the state, or want a fade animation, you can hide the element with CSS instead (for example the `hidden` attribute or `display: none`). Choose based on what you need:"),
    L(
      "**Remove it** (conditional rendering): saves work and memory, resets the state.",
      "**Hide it** (CSS): keeps the state, allows animation, but the component still exists.",
    ),

    H("Choosing between the ways"),
    L(
      "Two very different screens: **early return** with `if`.",
      "Choose between two small things inside JSX: **ternary**.",
      "Show something or nothing: **&&** with a true/false left side.",
      "Many choices: a variable with `if/else`, a `switch`, or an object map.",
    ),

    H("Common mistakes"),
    L(
      "`{count && <List />}` when `count` can be `0`. It shows `0`. Use `count > 0 &&`.",
      "Nested ternaries that nobody can read. Use `if` or split into components.",
      "Trying to write `{if (x) {...}}` in JSX. Statements are not allowed inside braces.",
      "Forgetting the empty and error cases for data pages.",
      "Reading `user.name` when `user` can be `null`. Check `user &&` first, or use `user?.name`.",
    ),
    P("The last item uses **optional chaining**, written `?.`. It stops safely and gives `undefined` if the value before it is `null` or `undefined`, instead of crashing. It is very useful when data has not arrived yet."),
    ...task(
      "Make a `LoginButton` that shows “Log in” when signed out and “Log out” when signed in, using a ternary and state.",
      "Make a `Notice` component that returns `null` when its `message` prop is empty.",
      "Make a `UserList` that shows Loading, an error message, an empty message, or the list, depending on three props.",
      "Test the zero trap: show a count with `count && ...` and then fix it.",
    ),
    ...check("Each situation shows the right screen when you change the props by hand.", "No stray `0` appears on the page.", "No error in the console when the data is empty."),
    H("Summary"),
    L(
      "Conditional rendering is plain JavaScript: `if`, ternary `?:` and `&&`.",
      "Use early returns for loading, error and empty screens.",
      "Make the left side of `&&` a real true or false to avoid the stray `0`.",
      "Return `null` to show nothing, and use `?.` to read values that may be missing.",
    ),
  ], [
    { q: 'Can I use if inside JSX?', a: 'No, JSX curly braces accept expressions only. Use a ternary (condition ? a : b) or && inside JSX, or use if before the return.' },
    { q: 'Why does my page show a 0?', a: 'You wrote something like {count && <X />} and count was 0. React shows the number 0. Write {count > 0 && <X />}.' },
    { q: 'Does a hidden component keep its state?', a: 'If you remove it with conditional rendering, no, the state is lost. If you only hide it with CSS, the component stays and keeps its state.' },
    { q: 'What does ?. mean?', a: 'It is optional chaining. user?.name gives undefined if user is null or undefined, instead of crashing.' },
  ], 'react conditional rendering, react ternary, react && operator, react loading state, react early return'),

  // ---------------------------------------------------------------- 8
  lesson(S1, 'react-lists-and-keys-explained', 'Rendering Lists in React: map(), Keys, Filter and Sort Explained', 'Learn how to show a list of data with map, why keys matter, how to filter and sort without breaking state, and the mistakes that cause bugs.', '', [
    P("Almost every real app shows lists: products, messages, tasks, comments, search results. In React, you turn an array of data into a list of elements. You do it with a JavaScript method you may already know: `map`. This lesson explains how, and also the one thing beginners often miss: the **key**."),

    H("The map method in one minute"),
    P("`map` goes through an array and makes a new array by running a function on each item. It does not change the original array."),
    C('js', `const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);
// doubled is [2, 4, 6]`),
    P("In React we use `map` to turn data into JSX. React knows how to show an array of elements, one after the other."),

    H("Showing a list"),
    C('jsx', `const fruits = ['Apple', 'Banana', 'Mango'];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}`),
    P("The curly braces open JavaScript inside the `ul`. `fruits.map(...)` gives an array of `li` elements, and React shows them. Notice the round brackets after the arrow: they let us return JSX over several lines."),

    H("A list of objects"),
    P("Most real lists are arrays of objects. Each object has an `id` that makes it unique:"),
    C('jsx', `const products = [
  { id: 1, name: 'Notebook', price: 3 },
  { id: 2, name: 'Pen', price: 1 },
  { id: 3, name: 'Bag', price: 20 },
];

function ProductList() {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} name={product.name} price={product.price} />
      ))}
    </div>
  );
}`),
    P("Here every item becomes a `ProductCard` component. This is the most common shape: a list component that maps data into item components. Note that the `key` goes on the element returned **directly inside the map**, here the `ProductCard`."),

    H("What is a key and why does React want it?"),
    P("If you forget the key, React shows a warning in the console: “Each child in a list should have a unique key”. A **key** is a special prop that gives each item a name. React uses it to remember which item is which, between draws."),
    P("Imagine a list of three tasks, and you delete the first one. Without keys, React only knows there are now two items in a row, and may reuse the wrong boxes. With keys, React knows that task 1 is gone, and tasks 2 and 3 are the same as before. This matters most when items have state, such as an input with typed text, or a checkbox. Without good keys, the typed text can jump to the wrong item."),
    P("A key is not passed as a prop. Inside the component you cannot read `props.key`. If you need the id, pass it again with another name, such as `id={product.id}`."),

    H("Rules for keys"),
    L(
      "Keys must be **unique among the siblings** in the same list. They do not need to be unique in the whole app.",
      "Keys must be **stable**: the same item should keep the same key every time. Use an id from your data, such as a database id.",
      "**Do not make keys with `Math.random()`.** A new key every draw makes React throw away and re-make every item, which is slow and loses state.",
      "**Avoid the array index** as a key when the list can be re-ordered, filtered or changed. Index as a key is fine only for a list that never changes.",
    ),
    C('jsx', `// Good
{tasks.map((task) => <li key={task.id}>{task.text}</li>)}

// OK only for a fixed list that never changes
{days.map((day, index) => <li key={index}>{day}</li>)}

// Bad: a new key every draw
{tasks.map((task) => <li key={Math.random()}>{task.text}</li>)}`),
    P("If your data has no ids, give each item an id when you **create** it, for example with `crypto.randomUUID()`, and keep it in the data."),

    H("Keys with fragments"),
    P("If each item needs to return two elements side by side, you use a fragment. The short form `<>` cannot take a key, so use the long form:"),
    C('jsx', `import { Fragment } from 'react';

{items.map((item) => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.meaning}</dd>
  </Fragment>
))}`),

    H("Filtering a list"),
    P("`filter` makes a new array with only the items that pass a test. Combine it with `map` to show only some items. Do not remove items from your data just to hide them. Keep the full list in state, and filter when you draw."),
    C('jsx', `function ProductList({ products }) {
  const [onlyCheap, setOnlyCheap] = useState(false);

  const visible = onlyCheap ? products.filter((p) => p.price < 5) : products;

  return (
    <div>
      <label>
        <input type="checkbox" checked={onlyCheap} onChange={(e) => setOnlyCheap(e.target.checked)} />
        Only cheap items
      </label>
      <ul>
        {visible.map((p) => <li key={p.id}>{p.name} - {p.price}</li>)}
      </ul>
    </div>
  );
}`),
    P("The list `visible` is not state. It is **calculated** from state and props during the draw. This is a good habit: do not store in state what you can calculate."),

    H("Sorting a list"),
    P("Careful: the `sort` method **changes the array in place**. If you call it on state or props, you break the rule that data must not be changed. Make a copy first with the spread syntax, or use `toSorted` in modern browsers:"),
    C('jsx', `const sorted = [...products].sort((a, b) => a.price - b.price);
// or: const sorted = products.toSorted((a, b) => a.price - b.price);`),
    P("For text, sort with `a.name.localeCompare(b.name)`, which also handles letters from other languages correctly."),

    H("Showing a message for an empty list"),
    P("When the list is empty, show something helpful, as the conditional rendering lesson explained:"),
    C('jsx', `{visible.length === 0 ? (
  <p>No products match your search.</p>
) : (
  <ul>{visible.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
)}`),

    H("Adding and removing items"),
    P("Because state must not be changed directly, adding and removing use a new array:"),
    C('jsx', `// add
setTasks([...tasks, { id: crypto.randomUUID(), text: 'Buy milk', done: false }]);

// remove
setTasks(tasks.filter((t) => t.id !== idToRemove));

// toggle one
setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));`),
    P("You will use these three lines in almost every project you build. It is worth typing them until they feel natural."),

    H("Common mistakes"),
    L(
      "Forgetting the `key` and ignoring the warning.",
      "Putting the key on the wrong element: it belongs on the outermost element returned by `map`.",
      "Using the index as a key in a list that changes, which causes input values to jump around.",
      "Calling `sort` or `reverse` on state without copying.",
      "Writing `forEach` instead of `map`. `forEach` returns nothing, so nothing is shown.",
    ),
    ...task(
      "Make a list of five books with id, title and year. Show them with `map` and correct keys.",
      "Add a text box that filters the books by title.",
      "Add a button that sorts by year, without changing the original array.",
      "Add a message for when no book matches.",
    ),
    ...check("The console has no key warning.", "Typing in the filter updates the list at once.", "The sort button does not change the order of the original data."),
    H("Summary"),
    L(
      "Use `array.map(item => <Element key={item.id} />)` to show lists.",
      "Keys must be unique, stable and come from your data. Avoid random keys, and avoid the index for changing lists.",
      "Filter and sort a **copy**. Keep the full list in state, and calculate what to show.",
      "Add, remove and change items by making new arrays with spread, `filter` and `map`.",
    ),
  ], [
    { q: 'Why does React need keys?', a: 'Keys let React tell which item is which between draws, so it can update, move or remove the right items and keep their state correct.' },
    { q: 'Can I use the array index as the key?', a: 'Only for a list that never changes order, and never has items added or removed in the middle. Otherwise use a stable id from your data.' },
    { q: 'Why can I not read props.key?', a: 'Key is used by React itself and is not passed to your component. Pass the value again under another name if you need it.' },
    { q: 'How do I show nothing for an empty list?', a: 'Check the length. If it is zero, show a friendly message instead of an empty list.' },
  ], 'react lists keys, react map render list, react key prop, react filter sort list, react array state'),

  // ---------------------------------------------------------------- 9
  lesson(S1, 'react-forms-and-controlled-inputs', 'React Forms and Controlled Inputs: Text, Checkbox, Select and Submit', 'Build forms the React way. Learn controlled inputs, one handler for many fields, checkboxes, selects, radio buttons, and simple validation.', '', [
    P("Forms are how people give data to your app: they sign up, search, write comments and pay. In plain HTML the browser keeps the text typed in each input. In React we usually keep it in **state** instead, so the screen and the data always agree. This lesson teaches the most common way, called **controlled inputs**."),

    H("Controlled input: the idea"),
    P("A controlled input gets its value from React state, and tells React about every change. Two props make this work: `value` (what to show) and `onChange` (what to do when the person types)."),
    C('jsx', `function NameForm() {
  const [name, setName] = useState('');

  return (
    <form>
      <label htmlFor="name">Your name</label>
      <input
        id="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <p>You typed: {name}</p>
    </form>
  );
}`),
    P("Follow the loop: the person types a letter, `onChange` runs, `setName` saves the new text in state, React draws again, and the input shows the new `value`. The state is the **single source of truth**. If you set `value` but forget `onChange`, the input becomes read-only and React warns you."),
    P("Do you see the `label` with `htmlFor`? It connects the text to the input. Clicking the label focuses the input, and screen readers read the label out. Always add one. A placeholder is not a replacement for a label."),

    H("Many fields, one state object"),
    P("A form with ten fields should not need ten `useState` calls and ten handlers. Use one object, and give each input a `name`. One handler can then update any field:"),
    C('jsx', `function SignUpForm() {
  const [form, setForm] = useState({ name: '', email: '', country: 'India' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Form data:', form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">Sign up</button>
    </form>
  );
}`),
    P("The strange `[name]: value` is a **computed property name**. It uses the value of the variable `name` (such as `'email'`) as the key. And `...form` copies all the old fields first, so only one field is replaced. Remember the rule: never change state directly."),

    H("Checkboxes"),
    P("A checkbox uses `checked` instead of `value`, and you read `event.target.checked`:"),
    C('jsx', `const [agree, setAgree] = useState(false);

<label>
  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
  I accept the terms
</label>
<button disabled={!agree}>Continue</button>`),
    P("The `disabled` prop is tied to state, so the button works only after the box is ticked. This is a small taste of how state controls the page."),

    H("Select (dropdown)"),
    P("In React a select also uses `value` on the `select` element itself, not `selected` on each option:"),
    C('jsx', `<select value={country} onChange={(e) => setCountry(e.target.value)}>
  <option value="India">India</option>
  <option value="UK">United Kingdom</option>
  <option value="Canada">Canada</option>
</select>`),

    H("Radio buttons"),
    P("Radio buttons share one state value. Each radio is checked when its own value equals the state:"),
    C('jsx', `const [plan, setPlan] = useState('free');

{['free', 'pro'].map((p) => (
  <label key={p}>
    <input type="radio" name="plan" value={p} checked={plan === p} onChange={() => setPlan(p)} />
    {p}
  </label>
))}`),

    H("Textarea"),
    P("In HTML, a textarea has its text between tags. In React it is like an input: use `value` and `onChange`, and write it as a self-closing tag or with `value`:"),
    C('jsx', `<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />`),

    H("Simple validation"),
    P("Validation means checking that what the person typed makes sense. Check on submit, and show a clear message next to the field. Keep the errors in state:"),
    C('jsx', `function ContactForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    console.log('Sending', email);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)}
        aria-invalid={error ? 'true' : 'false'} aria-describedby="email-error" />
      {error && <p id="email-error" role="alert">{error}</p>}
      <button type="submit">Send</button>
    </form>
  );
}`),
    L(
      "`aria-invalid` and `aria-describedby` help screen readers know that the field has a problem and what it is.",
      "`role=\"alert\"` makes screen readers read the message when it appears.",
      "Write messages that help: say what to do, not only what went wrong.",
      "**Always validate again on the server.** The browser can be bypassed, so client checks are only a convenience.",
    ),

    H("Clearing the form after submit"),
    P("Because the form lives in state, clearing it is easy: set the state back to the starting value. Keep that value in one constant so you can reuse it."),
    C('jsx', `const empty = { name: '', email: '' };
const [form, setForm] = useState(empty);

function handleSubmit(event) {
  event.preventDefault();
  save(form);
  setForm(empty);
}`),

    H("Controlled or uncontrolled?"),
    P("There is another way: **uncontrolled** inputs, where the browser keeps the value and you read it only when needed, with a ref or with `FormData`. It is shorter for simple forms and for very large forms. Lesson 19 shows it. For most forms where you check the text as people type, controlled inputs are the easiest to understand."),

    H("Common mistakes"),
    L(
      "Setting `value` without `onChange`: the field becomes impossible to type in.",
      "Starting with `undefined`: `useState()` with no value makes the input uncontrolled, then controlled, and React warns. Start with `''`.",
      "Changing the form object directly instead of copying it.",
      "Using `onClick` on the submit button instead of `onSubmit` on the form.",
      "Forgetting the label, which hurts people who use screen readers.",
    ),
    ...task(
      "Build a sign-up form with name, email, a country dropdown and a checkbox “I agree”. Use one state object and one change handler.",
      "Disable the Submit button until the box is ticked.",
      "On submit, check that the name is not empty and the email has an `@`. Show an error message next to the field.",
      "After a good submit, show “Thanks, NAME!” and clear the form.",
    ),
    ...check("Every field can be typed in, and the page shows the changes at once.", "Errors appear next to the field and disappear after a correct submit.", "You can reach every field and the button using only the Tab key."),
    H("Summary"),
    L(
      "A controlled input has `value` from state and `onChange` that updates state.",
      "Use one state object and `[name]: value` to handle many fields with one function.",
      "Checkboxes use `checked`, selects use `value` on the select, and radios compare their value to state.",
      "Validate on submit with clear messages, add labels, and check again on the server.",
    ),
  ], [
    { q: 'What is a controlled input?', a: 'An input whose value comes from React state and whose changes are saved to state through onChange. The state is the single source of truth.' },
    { q: 'Why can I not type in my input?', a: 'You probably set value without onChange. The input shows the fixed value from state. Add an onChange that updates the state.' },
    { q: 'Should I use a form library?', a: 'For small forms, state is enough. For large forms with many rules, a library like React Hook Form can save time. Learn the basics first.' },
    { q: 'Why does React warn about controlled and uncontrolled inputs?', a: 'The value started as undefined and later became a string. Start with an empty string so the input is controlled from the start.' },
  ], 'react forms, react controlled input, react checkbox select radio, react form validation, react handle change'),

  // ---------------------------------------------------------------- 10
  lesson(S1, 'styling-react-apps-css-modules-tailwind', 'Styling React Apps: CSS, CSS Modules, Inline Styles and Tailwind', 'Compare the main ways to style React: plain CSS, CSS Modules, inline styles and Tailwind CSS. Learn dynamic classes, dark mode and responsive layouts.', '', [
    P("A page that works but looks bad is not a good page. React does not force one way to style. You choose. In this lesson we look at the four most common ways, and when each one is best. We also learn how to change styles when state changes, how to make a page work on phones, and how to add dark mode."),

    H("Way 1: a plain CSS file"),
    P("The simplest way. Write a normal CSS file, import it, and use `className` on your elements."),
    C('css', `/* Button.css */
.btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}
.btn:hover {
  background: #1d4ed8;
}`),
    C('jsx', `import './Button.css';

function Button({ children }) {
  return <button className="btn">{children}</button>;
}`),
    P("This works well for small projects. The weakness: CSS is **global**. A `.btn` rule affects every `.btn` in the whole app, even in other files. In a big project two people can use the same class name by accident, and styles clash."),

    H("Way 2: CSS Modules"),
    P("CSS Modules fix the clash. Name your file with `.module.css`. Vite then changes each class name to a unique one, so the style only applies where you import it."),
    C('css', `/* Card.module.css */
.card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}
.title {
  font-size: 1.25rem;
}`),
    C('jsx', `import styles from './Card.module.css';

function Card({ title, children }) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}`),
    P("`styles` is an object, and `styles.card` is the unique class name. You write normal CSS, and you get safety for free. This is a very good default for apps of any size."),

    H("Way 3: inline styles"),
    P("You met these in the JSX lesson. The `style` prop takes an object with camelCase names."),
    C('jsx', `<div style={{ width: progress + '%', background: 'seagreen', height: 8 }} />`),
    P("Inline styles are best for values that **change often** or come from data, like the width of a progress bar. They cannot do hover effects, media queries or other pseudo-classes, so do not use them for everything."),

    H("Way 4: Tailwind CSS"),
    P("Tailwind is a popular tool that gives you many small ready-made classes, such as `p-4` (padding) and `text-lg` (large text). You build a design by putting the classes right in your JSX, and you rarely write a CSS file."),
    C('jsx', `function Alert({ children }) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
      {children}
    </div>
  );
}`),
    P("Many people like Tailwind because it is fast to work with and keeps design consistent. Others find long class lists hard to read. Both views are fair. To add it to a Vite project, follow the install guide on the Tailwind website, since the steps change between versions."),

    H("Which one should you choose?"),
    L(
      "**Learning and small projects:** plain CSS or CSS Modules.",
      "**Team apps that must not clash:** CSS Modules.",
      "**Fast building with a consistent look:** Tailwind.",
      "**Values from data (widths, colours):** a small inline style on top of any of the above.",
    ),
    P("You can mix them. Many projects use Tailwind for most things, and an inline style for one special value. The most important thing is to be consistent inside one project."),

    H("Changing styles with state"),
    P("Styles are just strings in `className`, so you can change them with state and a ternary:"),
    C('jsx', `function Tab({ active, children, onClick }) {
  return (
    <button className={active ? 'tab tab-active' : 'tab'} onClick={onClick}>
      {children}
    </button>
  );
}`),
    P("With several conditions the string gets messy. A tiny helper called `clsx` joins class names and ignores false values:"),
    C('jsx', `import clsx from 'clsx';

<button className={clsx('btn', isPrimary && 'btn-primary', disabled && 'btn-disabled')}>
  Save
</button>`),

    H("Responsive design: mobile first"),
    P("Many visitors use a phone. Write the styles for a small screen first, then add rules for bigger screens with `min-width` media queries."),
    C('css', `.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;          /* phone: one column */
}
@media (min-width: 700px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1000px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}`),
    P("In Tailwind the same idea is written with prefixes: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Test your page by making the browser window narrow, or use the device mode in the browser tools. Make sure nothing makes the page scroll sideways at a width of about 390 pixels."),
    L(
      "Use relative sizes (`rem`, `%`, `fr`) rather than fixed pixel widths for layout.",
      "Set `max-width: 100%` on images so they never overflow.",
      "Make tap targets, such as buttons, at least about 44 pixels high.",
    ),

    H("Dark mode"),
    P("Many devices let people choose a dark theme. You can follow that choice with one media query and CSS variables:"),
    C('css', `:root {
  --bg: #ffffff;
  --text: #0f172a;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --text: #e2e8f0;
  }
}
body {
  background: var(--bg);
  color: var(--text);
}`),
    P("CSS variables (custom properties) are very useful. You change colours in one place, and the whole app follows. Always check colour contrast, so text is easy to read in both themes."),

    H("Helpful habits"),
    L(
      "Keep one global file for the basics: fonts, colours as variables, and a simple reset.",
      "Put component styles next to the component, for example `Card.jsx` and `Card.module.css`.",
      "Do not use `!important` unless you have no other choice.",
      "Do not hide the keyboard focus outline. If you change it, make it clearly visible.",
      "Use semantic HTML (`button`, `nav`, `main`) first, and style it second.",
    ),

    H("Common mistakes"),
    L(
      "Using `class` instead of `className`.",
      "Importing a CSS Module but writing a plain string: `className=\"card\"` instead of `className={styles.card}`.",
      "Expecting a plain CSS file to be limited to one component. It is global.",
      "Using fixed pixel widths that break on phones.",
      "Using inline styles for hover effects, which they cannot do.",
    ),
    ...task(
      "Make a `Card` component styled with a CSS Module: border, padding, rounded corners.",
      "Make a `Tab` row of three buttons where the clicked tab is highlighted using state.",
      "Make a grid of six cards that shows one column on a phone and three on a wide screen.",
      "Add dark mode with CSS variables and check the text is easy to read in both themes.",
    ),
    ...check("No sideways scrolling at 390 pixels wide.", "The chosen tab changes colour when clicked.", "Switching your device to dark mode changes the page colours."),
    H("Summary"),
    L(
      "Four ways to style: plain CSS, CSS Modules, inline styles and Tailwind. Pick one main way per project.",
      "CSS Modules give each component its own class names, so styles never clash.",
      "Use state and a ternary (or `clsx`) to change classes. Use inline styles only for values from data.",
      "Design for phones first, use CSS variables, and support dark mode.",
    ),
  ], [
    { q: 'Which way of styling is best in React?', a: 'There is no single best. CSS Modules are a safe default, and Tailwind is popular for fast building. Choose one main way for a project and stay consistent.' },
    { q: 'Why does my CSS affect other components?', a: 'A normal CSS file is global. Use CSS Modules, or use more specific class names, to keep styles inside one component.' },
    { q: 'Can I use Sass or other tools?', a: 'Yes. Vite supports Sass after you install it. The ideas in this lesson work the same.' },
    { q: 'How do I test that my page works on phones?', a: 'Narrow your browser window, or use the device mode in your browser tools, and check there is no sideways scrolling around 390 pixels wide.' },
  ], 'react css, react css modules, tailwind react, react dark mode, react responsive design'),
];
