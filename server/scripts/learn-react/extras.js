// Extra explanation blocks, inserted just before "Your task" in a lesson. They keep each lesson above 1,000 words of text.
import { P, H, L, O, N, C } from './helpers.js';

export const extras = {
  'set-up-react-with-vite-first-project': [
    H("What happens when you run npm run dev?"),
    P("It helps to know what is going on behind the scenes, so the tool does not feel like magic. When you run the command, Vite starts a small web server on your computer. When your browser asks for `index.html`, Vite sends it. The page then asks for `main.jsx`. Vite turns your JSX into plain JavaScript on the fly, and sends that to the browser. It does the same for every file the browser asks for. Because it only works on the files that are needed, it starts in a moment even for big projects."),
    P("When you save a file, Vite tells the browser which module changed, and the browser swaps just that piece. This is called **hot module replacement**. If you keep a counter at 7 and change the colour of a heading, the counter often stays at 7. That saves a lot of time every day."),
  ],
  'jsx-explained-simply': [
    H("Walk through one component line by line"),
    P("Let us read a small component slowly, as the browser and React would. Here it is again, with a bit more detail:"),
    C('jsx', `function Profile() {
  const name = 'Asha';
  const skills = ['React', 'CSS'];
  return (
    <section>
      <h2>{name}</h2>
      <p>I know {skills.length} things.</p>
    </section>
  );
}`),
    O(
      "React calls the function `Profile()`. It is just a normal function call.",
      "The first two lines make two ordinary variables. There is nothing special about them yet.",
      "The `return` gives back JSX. Vite has already changed it into function calls, so the result is a plain description of a `section` with an `h2` and a `p`.",
      "When React meets `{name}`, it runs the JavaScript inside the braces, gets the text `Asha`, and puts it in the heading.",
      "For `{skills.length}`, it works out the number 2 and shows it inside the sentence.",
      "React then updates the real page so it matches this description.",
    ),
    P("Once you see JSX as “JavaScript that describes the page”, the rules stop feeling random. A tag name that starts with a capital letter is a function to call. Curly braces are a hole where JavaScript goes. And one parent is needed because a function can return only one value."),
  ],
  'react-components-and-props-explained': [
    H("A complete example, step by step"),
    P("Let us build a small team page, and watch how props travel. We have three pieces: an `App` that owns the data, a `TeamList` that shows many people, and a `Person` that shows one."),
    C('jsx', `function Person({ name, role }) {
  return <li>{name} is a {role}.</li>;
}

function TeamList({ people }) {
  return (
    <ul>
      {people.map((p) => <Person key={p.id} name={p.name} role={p.role} />)}
    </ul>
  );
}

function App() {
  const people = [
    { id: 1, name: 'Asha', role: 'designer' },
    { id: 2, name: 'Ravi', role: 'developer' },
  ];
  return <TeamList people={people} />;
}`),
    P("Follow the data. `App` makes the list and passes it to `TeamList` as the prop `people`. `TeamList` goes through the list and, for each item, passes `name` and `role` to a `Person`. `Person` finally shows them. The data moves **down**, one level at a time, and nobody changes it on the way. If a name looks wrong on the page, you know to look at the data in `App`."),
    P("Notice how each piece is easy to understand alone. `Person` knows nothing about teams. You could use it on an about page, in a contact list or in a chat. This is the real power of components: small, simple and used in many places."),
  ],
  'react-usestate-hook-explained': [
    H("One more example: a like button"),
    P("To finish, here is a small component that joins three ideas from this lesson: state, an event and a conditional message."),
    C('jsx', `function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  function handleClick() {
    setLiked(!liked);
    setCount((c) => (liked ? c - 1 : c + 1));
  }

  return (
    <button onClick={handleClick} aria-pressed={liked}>
      {liked ? 'Liked' : 'Like'} ({count})
    </button>
  );
}`),
    P("There are two pieces of state, and both change in one click. React waits until the handler finishes, and then draws once. The text on the button comes from state, and `aria-pressed` tells screen readers whether the button is on or off. Try to find the other places in your own projects where a small piece of state like this would help."),
  ],
  'handling-events-in-react': [
    H("A worked example: a tiny color picker"),
    P("Let us put several events in one small component. It has buttons that choose a colour, a text box for a label, and a form that saves the choice."),
    C('jsx', `function ColorPicker() {
  const [color, setColor] = useState('tomato');
  const [label, setLabel] = useState('');
  const [saved, setSaved] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!label.trim()) return;
    setSaved([...saved, { id: crypto.randomUUID(), label: label.trim(), color }]);
    setLabel('');
  }

  return (
    <div>
      {['tomato', 'seagreen', 'royalblue'].map((c) => (
        <button key={c} type="button" onClick={() => setColor(c)} style={{ background: c, color: 'white' }}>
          {c}
        </button>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Name this colour" />
        <button type="submit">Save</button>
      </form>
      <ul>
        {saved.map((s) => <li key={s.id} style={{ color: s.color }}>{s.label}</li>)}
      </ul>
    </div>
  );
}`),
    P("There are four kinds of events in this one small component: `onClick` on the colour buttons (with an argument), `onChange` on the input, `onSubmit` on the form, and the state updates that follow. Each event calls a function, the function changes state, and React draws the new screen. That loop is how every React app works. Notice also that the colour buttons have `type=\"button\"`, so they do not submit the form by mistake."),
  ],
  'conditional-rendering-in-react': [
    H("Putting it together: a small account menu"),
    P("Here is a menu that uses several of the ideas from this lesson at once: an early return, a ternary and `&&`."),
    C('jsx', `function AccountMenu({ user, loading, unread }) {
  if (loading) return <p>Checking your account...</p>;
  if (!user) return <a href="/login">Sign in</a>;

  return (
    <div>
      <p>Hello, {user.name}!</p>
      {unread > 0 && <p role="status">You have {unread} new messages.</p>}
      {user.isAdmin ? <a href="/admin">Admin area</a> : <a href="/account">My account</a>}
    </div>
  );
}`),
    P("Each line has one clear job. The first two lines handle the unusual cases and finish early. After that, the code only thinks about a signed-in user. This habit, handling the odd cases first, keeps components flat and easy to read, even when they grow."),
  ],
  'react-lists-and-keys-explained': [
    H("Why the key matters: a small experiment"),
    P("You can see the effect of keys yourself. Make a list of three items where each has an input box. Use the **index** as the key, and add a button that adds a new item at the **start** of the list. Type something in the first box, and then press the button. You will notice that the text you typed stays in the first position, even though it now belongs to a different item. React matched the boxes by position, so the typed text stayed in the first box."),
    P("Now change the key to the item's `id` and try again. The typed text moves along with its item, which is what you expect. This is the whole story of keys: they tell React which item is which, so the right state stays with the right item. It is a small change in the code and prevents very confusing bugs."),
  ],
  'react-forms-and-controlled-inputs': [
    H("Walk through a keystroke"),
    P("Controlled inputs are easier to trust when you follow one key press from start to finish. Say the person types the letter “A” in an empty name field."),
    O(
      "The browser fires a change event on the input.",
      "React calls your `onChange` handler with the event. `event.target.value` is now `A`.",
      "Your handler calls `setName('A')`. React stores the new value and plans a draw.",
      "React calls your component again. This time `name` is `A`.",
      "The input is drawn with `value={name}`, so it shows `A`. Everything that uses `name`, such as a counter of characters, shows the new value too.",
    ),
    P("This happens fast enough that you never notice it. The key idea is that the input never keeps its own text. It always shows what is in state. That is why the state and the screen cannot disagree, and why you can do things like change the text to capitals as people type, limit the length, or clear the field from code."),
    H("A small example: capital letters and a limit"),
    C('jsx', `<input
  value={code}
  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
  placeholder="Enter a six letter code"
/>`),
    P("The text is changed **before** it is saved in state, so the field always shows capital letters and never more than six of them. With a normal uncontrolled input you would need extra code to do this. Because the input is controlled, it is one line."),
  ],
  'styling-react-apps-css-modules-tailwind': [
    H("A small example that uses everything"),
    P("Here is a pricing card that is responsive, has a state-based style and supports dark mode through CSS variables. The CSS file uses a CSS Module:"),
    C('css', `/* Plan.module.css */
.plan {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  background: var(--bg);
  color: var(--text);
}
.featured {
  border-color: #2563eb;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
}`),
    C('jsx', `import styles from './Plan.module.css';
import clsx from 'clsx';

function Plan({ name, price, featured }) {
  return (
    <article className={clsx(styles.plan, featured && styles.featured)}>
      <h3>{name}</h3>
      <p>{price} per month</p>
    </article>
  );
}`),
    P("The card uses CSS variables for its colours, so dark mode needs no extra code in the component. The `featured` style is added only when the prop is true. And because it is a CSS Module, the class names cannot clash with any other file. This is a good pattern to copy in your own projects."),
  ],
  'fetch-data-in-react-loading-error-states': [
    H("A checklist for every screen that loads data"),
    P("Before you call a data screen finished, walk through this short list. It catches most of the problems people find in real apps."),
    L(
      "**First load:** does the person see a loading message, and not a blank page?",
      "**Success:** is the data shown, and do the keys and empty cases work?",
      "**Failure:** turn off your internet or break the URL. Is there a clear message and a way to try again?",
      "**Slow network:** use throttling in the browser tools. Does the page still look right?",
      "**Quick changes:** click between items quickly. Does the page always end on the item you clicked last?",
      "**Leaving the page:** does the request stop, or at least not cause an error in the console?",
    ),
    P("If every answer is yes, your screen is in good shape. Libraries such as TanStack Query (lesson 25) give you most of these answers for free, but you now understand what they do for you."),
  ],
  'react-useref-hook-dom-access': [
    H("A worked example: a chat box"),
    P("Here is a small chat that uses a ref twice: to scroll to the newest message, and to put the cursor back in the input after sending."),
    C('jsx', `function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    setMessages([...messages, { id: crypto.randomUUID(), text: text.trim() }]);
    setText('');
    inputRef.current.focus();
  }

  return (
    <div>
      <ul>
        {messages.map((m) => <li key={m.id}>{m.text}</li>)}
      </ul>
      <div ref={endRef} />
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
}`),
    P("The messages and the text are **state**, because the screen shows them. The two refs only point at real elements, so we can call browser methods on them. After each new message the effect scrolls an empty `div` at the bottom into view. After sending, the input gets focus again, so the person can keep typing without clicking. This is a good picture of the right split: state for what is shown, refs for reaching into the page."),
  ],
  'lifting-state-up-and-component-composition': [
    H("A quick way to decide where state lives"),
    P("When you are unsure, ask these three questions in order. They give a clear answer most of the time."),
    O(
      "**Which components use this data?** Write them down, even if there is only one.",
      "**What is their closest common parent?** Look at your component tree and find the lowest component that contains all of them.",
      "**Is that parent too far up?** If the answer is a very high component, check whether you can restructure with composition, or whether the data is really shared app-wide, which suits context.",
    ),
    P("If only one component uses the data, keep the state inside it. If two siblings use it, put it in their parent. If many components in different branches use it, think about context. Following these steps stops two common problems: state kept too high, so the whole page redraws, and state copied in two places, so the numbers disagree."),
  ],
  'react-usereducer-hook-explained': [
    H("Following one dispatch"),
    P("Let us follow a single click through the to-do reducer so that nothing feels hidden. The person ticks the box of the task with id 7."),
    O(
      "The checkbox calls `dispatch({ type: 'toggled', id: 7 })`.",
      "React calls `tasksReducer(currentTasks, { type: 'toggled', id: 7 })`.",
      "The reducer finds the `'toggled'` case. It goes through the list with `map`, and for the task with id 7 it returns a **new object** with `done` flipped. All other tasks are returned as they are.",
      "The reducer returns a **new array**. React sees that the state is a different object, and draws the component again.",
      "The list is drawn from the new array, and the box for task 7 shows as ticked.",
    ),
    P("The component never needed to know how toggling works. If you later decide that ticking a task should also record the time it was finished, you change one case in the reducer, and nothing else. That is the real benefit: the rules live in one place."),
  ],
  'react-context-api-usecontext-explained': [
    H("Following the value through the tree"),
    P("It is useful to picture what happens when someone clicks the theme button. The button lives deep inside the page, and the provider is at the very top."),
    O(
      "The button calls `toggleTheme`, a function that came from the context.",
      "That function belongs to the provider, so it calls `setTheme` in the provider's own state.",
      "The provider's state changes, so the provider renders again, and puts a new `value` into the context.",
      "React finds every component that called `useContext` for this context, and draws them again with the new value.",
      "Components that do not read the context are left alone, unless their parent redrew.",
    ),
    P("This shows an important point: the state still lives in an ordinary `useState`. The context is only the **delivery system** that brings the value, and the functions to change it, to every place that needs them. You can think of the provider as a small power station, and `useContext` as the plug in each room."),
    H("A rule of thumb for choosing"),
    L(
      "If you pass a prop through **one or two** levels, keep passing props. It is clear and simple.",
      "If you pass the same prop through **three or more** levels that do not use it, try composition first.",
      "If many unrelated components need the same value, such as the user or the theme, use context.",
    ),
  ],
  'react-custom-hooks-reuse-logic': [
    H("When to make a custom hook: a short guide"),
    P("Beginners sometimes make hooks for everything, and sometimes never make one. A simple guide helps you find the right time."),
    L(
      "You wrote the **same state and effect** in two places. This is the clearest sign. Move it into a hook.",
      "A component is **long** because one piece of logic, such as a timer or a listener, takes many lines. A hook with a good name hides the details and makes the component easy to read.",
      "The logic is something you can **name in a few words**, such as “keeps a value in storage” or “knows if the user is online”.",
    ),
    P("Do not make a hook if you only call one built-in hook and there is no real logic around it. `function useCount() { return useState(0); }` adds nothing. A hook should hide some work, not just rename a function."),
    P("A final tip: after you write a hook, use it from **two different components** to check that it works well with separate state in each. If the hook only works for one place, it is probably not general enough yet, and you may want to change its inputs."),
  ],
  'react-router-pages-links-navigation': [
    H("A small complete app"),
    P("Here is how the pieces fit together in one small file. It has a layout, three pages, a product page that reads the URL and a page for unknown addresses."),
    C('jsx', `import { BrowserRouter, Routes, Route, NavLink, Outlet, useParams, Link } from 'react-router-dom';

const products = [
  { id: '1', name: 'Notebook' },
  { id: '2', name: 'Pen' },
];

function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink> <NavLink to="/products">Products</NavLink>
      </nav>
      <main><Outlet /></main>
    </>
  );
}

function Products() {
  return (
    <ul>
      {products.map((p) => <li key={p.id}><Link to={'/products/' + p.id}>{p.name}</Link></li>)}
    </ul>
  );
}

function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  if (!product) return <p>Product not found.</p>;
  return <h1>{product.name}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<h1>Welcome</h1>} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}`),
    P("Read it from the bottom. The router watches the address. The layout draws the menu, and the `Outlet` shows the page that matches. The product page reads the id from the address and finds its data, and shows a message if the id is unknown. That last check matters: someone can type any address, so a page that uses a parameter must always handle a missing item."),
  ],
  'react-forms-validation-formdata-react-hook-form': [
    H("Choosing your approach: a short guide"),
    P("You now know three ways to build a form. Here is how to pick between them for a real project."),
    L(
      "**Controlled inputs with state:** best when the screen must react while people type, for example a live character counter, instant formatting or a search that filters as you type.",
      "**`FormData` with a validation function:** best for most normal forms, such as contact, sign-up and settings. Short code, no state for each field, and an easy function to test.",
      "**React Hook Form:** best for large forms with many rules, many steps or dynamic fields, where you want less code and fewer redraws.",
    ),
    P("Whatever you choose, the same good habits apply: clear labels, helpful messages, the right input types, a disabled button while sending, and a second check on the server. A form that is easy to use is worth more than a clever one."),
  ],
  'react-lazy-suspense-code-splitting': [
    H("A real example of the numbers"),
    P("Here is the kind of difference splitting can make. Imagine an app with a home page, a dashboard with a chart library, and an admin area. Before splitting, the build produces one file of about 900 kilobytes. Every visitor downloads all of it, even those who never open the dashboard. After making the dashboard and admin pages lazy, the main file might drop to about 250 kilobytes, and the chart code is a separate file of 500 kilobytes that only loads for people who open the dashboard. A visitor to the home page now downloads about a quarter of what they did before."),
    P("These numbers are only an example. Your own results depend on your libraries and pages. The point is the method: build, look at the file sizes, split the biggest parts that are not needed on the first screen, and build again to compare. A few minutes of work can make the first visit much faster, especially on a phone with a slow connection."),
  ],
  'react-error-boundaries-portals-modals': [
    H("Where to put error boundaries"),
    P("A common question is how many boundaries an app needs. A good plan has three layers."),
    O(
      "**One around the whole app.** This is the last safety net. If everything else fails, the visitor sees a friendly page with a reload button, not a white screen.",
      "**One around each page or route.** If one page crashes, the menu and the layout stay, and the visitor can go to another page.",
      "**Small ones around risky widgets,** such as a chart, a map, a comments box or any part that depends on data you do not control.",
    ),
    P("Always **report** what the boundary catches. A boundary that hides errors but never tells you about them means you will not know that visitors are having problems. Send the error to a logging service, or at least to your server logs. Then fix the cause, not just the message."),
  ],
  'react-state-management-redux-toolkit-zustand': [
    H("A decision in three questions"),
    P("When you start a new feature and wonder whether you need a store, ask these questions in order."),
    O(
      "**Is it data from a server?** Use a data library. Do not copy it into a store.",
      "**Does only one component, or one parent and child, use it?** Use local state or props.",
      "**Do many far-apart components change it, and do the rules take real effort?** Now a store such as Zustand or Redux Toolkit is a good fit.",
    ),
    P("Notice that most data fails the first two tests. That is normal. A well-built app often has very little global client state: maybe the user, a cart, and a few settings. Keeping the store small makes the app easier to understand, and easier to move to a different tool if you ever need to."),
  ],
  'tanstack-query-react-data-fetching': [
    H("Before and after: the same screen"),
    P("Look at what you wrote in lesson 12 for a simple list: three pieces of state, an effect, a try and catch block, a finally block, and an abort controller. That was about thirty lines, and it still did not cache, retry or refresh. With `useQuery` the same screen is a few lines, and it gains all of those features. This is the reason the library is so popular: it removes code you would write over and over, and does it better than most hand-written versions."),
    P("It is still worth understanding the manual way first, as you did in lesson 12. When you know what loading, error and race conditions are, the library makes sense, and you can find the cause when something goes wrong. Learn the problem first, then the tool that solves it."),
  ],
  'react-with-typescript-beginners-guide': [
    H("A tiny TypeScript story"),
    P("Here is why people like TypeScript, in a small story. A teammate renames the field `name` to `fullName` in the `User` type. In plain JavaScript, nothing tells you which of your thirty components used `user.name`. Some of them silently show `undefined` on the page, and you only find out when a visitor complains. In TypeScript, the moment the type changes, the editor underlines every place that still says `user.name`. You fix them in a few minutes, and nothing reaches your visitors."),
    P("That is the main benefit: **mistakes show up while you write, not after you publish**. It is a safety net for changing code, and the bigger the project, the more it helps. For a tiny practice app you may not need it, and that is fine. Many people learn React first and add TypeScript in the next project."),
    H("How to move from JavaScript step by step"),
    L(
      "Start a new project with the `react-ts` template, and write only simple types at first: props, and state with a generic.",
      "Let TypeScript guess types where it can, and write types for function parameters and data from the network.",
      "Read each error calmly. They are hints about real mistakes.",
      "Add more advanced types, such as generics and utility types, only when you need them.",
    ),
  ],
  'react-router-pages-links-navigation-extra': [],
};
