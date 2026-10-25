import { P, H, L, O, N, C, task, check, lesson } from './helpers.js';

const S1 = 'Start Here';

export const lessons = [
  // ---------------------------------------------------------------- 3
  lesson(S1, 'jsx-explained-simply', 'JSX Explained Simply: Write HTML Inside JavaScript', 'Learn what JSX is, the rules you must follow, how to show values with curly braces, and the small mistakes every beginner makes.', '', [
    P("JSX looks like HTML, but it lives inside a JavaScript file. It is the way most React developers describe what a component should show. At first it feels strange to mix HTML and JavaScript. After a short time it feels natural, because the code that decides what to show and the code that shows it sit together."),

    H("What JSX really is"),
    P("JSX stands for JavaScript XML. It is not HTML, and browsers cannot read it. Your build tool (Vite) changes it into plain JavaScript before the browser sees it. This line of JSX:"),
    C('jsx', `const title = <h1 className="big">Hello</h1>;`),
    P("becomes a normal function call, roughly `React.createElement('h1', { className: 'big' }, 'Hello')`. You never need to write that by hand. JSX is just a friendly way to write it. Knowing this explains the rules below, because JSX follows JavaScript rules, not HTML rules."),

    H("Rule 1: return one parent element"),
    P("A component can return only one thing. If you want to return two headings, wrap them in a parent. The parent can be a `div`, or a **fragment**, which is an empty tag that adds nothing to the page."),
    C('jsx', `function Intro() {
  return (
    <>
      <h1>Welcome</h1>
      <p>Glad you are here.</p>
    </>
  );
}`),
    P("The `<>` and `</>` are the fragment. Use a fragment when you do not want an extra `div` in your page. The round brackets after `return` let you write the JSX over many lines safely."),

    H("Rule 2: close every tag"),
    P("In HTML you can write `<br>` or `<img src=\"a.png\">` with no closing. In JSX every tag must be closed. Either write a closing tag, or end the tag with a slash:"),
    C('jsx', `<img src="logo.png" alt="Company logo" />
<input type="text" />
<br />`),

    H("Rule 3: use curly braces to show JavaScript"),
    P("This is the most important JSX skill. Inside curly braces `{}` you can write any JavaScript **expression**, which is anything that gives a value. A variable, a calculation, a function call or a condition all work."),
    C('jsx', `function Profile() {
  const name = 'Asha';
  const age = 24;
  return (
    <section>
      <h2>{name}</h2>
      <p>Next year I will be {age + 1}.</p>
      <p>My name has {name.length} letters.</p>
      <p>Shouting: {name.toUpperCase()}</p>
    </section>
  );
}`),
    P("You can use curly braces in two places: **as the content** between tags (like `{name}` above), and **as the value of an attribute**, like `src={imageUrl}`. You cannot use them for the tag name, and you cannot put a statement such as `if` or `for` inside them. Statements do not give a value. Use a `?:` expression instead. You will see this in the lesson on conditional rendering."),
    N("Quotes give a fixed text: `alt=\"Logo\"`. Curly braces give a changing value: `alt={product.name}`. A common mistake is writing `alt=\"{product.name}\"`, which shows the words `{product.name}` instead of the name."),

    H("Rule 4: some attribute names are different"),
    P("Because JSX is JavaScript, some HTML words are already taken by JavaScript. And all attribute names use camelCase, which means the first word is small and each next word starts with a capital letter."),
    L(
      "`class` becomes **`className`**, because `class` is a JavaScript word.",
      "`for` on a label becomes **`htmlFor`**.",
      "`onclick` becomes **`onClick`**, and `onchange` becomes **`onChange`**.",
      "`tabindex` becomes **`tabIndex`**, and `maxlength` becomes **`maxLength`**.",
    ),
    P("Good news: if you forget, React shows a clear warning in the browser console that names the right word."),

    H("Styles as objects"),
    P("The `style` attribute does not take a string in React. It takes an object, and the object has its own curly braces. That is why you see double braces: the outer pair means “JavaScript here”, and the inner pair is the object."),
    C('jsx', `<p style={{ color: 'tomato', fontSize: '20px', marginTop: 10 }}>
  Styled text
</p>`),
    P("CSS names with a dash become camelCase (`font-size` becomes `fontSize`). Numbers are treated as pixels. For more than a few styles, use a CSS file instead, as lesson 10 shows."),

    H("Comments in JSX"),
    P("Inside the tags you cannot use `//` or `<!-- -->`. Use curly braces and a normal comment:"),
    C('jsx', `<div>
  {/* This comment will not show on the page */}
  <p>Visible text</p>
</div>`),

    H("Showing lists and objects"),
    P("You can show strings and numbers directly. You can also show an array of strings, and React puts them next to each other. But you cannot show a plain object. If you try `{user}` where `user` is `{ name: 'Asha' }`, React throws an error that says objects are not valid as a React child. Show the parts you want instead: `{user.name}`."),
    P("Values like `true`, `false`, `null` and `undefined` show **nothing**. This is useful for conditions, and it is also a trap: the number `0` does show. We will see this trap again in the conditional rendering lesson."),

    H("Components in JSX"),
    P("Tags that start with a small letter, like `div` or `p`, are normal HTML elements. Tags that start with a **capital letter**, like `Welcome` or `ProductCard`, are your own components. That is why component names must start with a capital: it is how React tells them apart."),
    C('jsx', `function Welcome() {
  return <h2>Welcome!</h2>;
}

function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}`),

    H("Common beginner mistakes"),
    L(
      "**Two parents:** returning `<h1>` and `<p>` side by side without a wrapper. Fix: wrap them in a fragment.",
      "**Forgetting to close a tag:** `<input>` must be `<input />`.",
      "**Using `class`:** use `className`.",
      "**Quotes around braces:** `src=\"{url}\"` shows the text `{url}`. Remove the quotes.",
      "**Lowercase component:** `<welcome />` is treated as an HTML tag. Use `<Welcome />`.",
      "**Statements inside braces:** you cannot write `{if (x) ...}`. Use `{x ? a : b}`.",
    ),
    ...task(
      "Make a component `Card` with a name, a job title and a year of birth stored in variables. Show them, and show the age using a calculation.",
      "Add an image with `alt` text taken from the name variable.",
      "Give one heading an inline style with a colour and a bigger font size.",
      "Break a rule on purpose (remove a closing tag) and read the error message.",
    ),
    ...check("The card shows the name, the job title and a correct age.", "Your image has alt text that changes if you change the variable.", "You can say in your own words why `class` is `className`."),
    H("Summary"),
    L(
      "JSX is a way to write HTML-like code inside JavaScript. Vite turns it into plain JavaScript.",
      "Return one parent (or a fragment), close all tags, and use camelCase attributes such as `className` and `onClick`.",
      "Use `{}` to show any JavaScript expression. The style attribute takes an object.",
      "Component names start with a capital letter.",
    ),
  ], [
    { q: 'Is JSX required to use React?', a: 'No, but almost everyone uses it. It is much easier to read than the plain JavaScript it becomes.' },
    { q: 'Why do I see double curly braces in style?', a: 'The outer braces mean JavaScript starts here. The inner braces are the JavaScript object that holds the styles.' },
    { q: 'Why does my component not show up?', a: 'Check that its name starts with a capital letter, that you imported it, and that you wrote it as a tag, like <Welcome />, not as Welcome.' },
    { q: 'What is a fragment?', a: 'A fragment, written <>...</>, groups elements without adding an extra element to the page.' },
  ], 'jsx explained, react jsx tutorial, jsx rules, react className, curly braces react'),

  // ---------------------------------------------------------------- 4
  lesson(S1, 'react-components-and-props-explained', 'React Components and Props Explained with Examples', 'Learn how to build components, pass data with props, use default values, children, and split a page into small reusable pieces.', '', [
    P("Components are the heart of React. Once you can split a page into components and pass data between them, you can build almost any screen. This lesson shows how, with small, clear examples."),

    H("What is a component?"),
    P("A component is a JavaScript function that returns JSX. It has a name that starts with a capital letter. You use it like an HTML tag. Components can be used again and again, and they can use other components inside them."),
    C('jsx', `function Greeting() {
  return <p>Hello there!</p>;
}

function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <Greeting />
    </div>
  );
}`),
    P("This shows the greeting three times. But three identical greetings are not very useful. We want each greeting to show a different name. That is the job of props."),

    H("Props: giving data to a component"),
    P("**Props** (short for properties) are the inputs of a component, like the arguments of a function. The parent writes them like HTML attributes. The child receives them as one object."),
    C('jsx', `function Greeting(props) {
  return <p>Hello, {props.name}! You are {props.age} years old.</p>;
}

function App() {
  return (
    <div>
      <Greeting name="Asha" age={24} />
      <Greeting name="Ravi" age={31} />
    </div>
  );
}`),
    P("Notice the difference between `name=\"Asha\"` (text, in quotes) and `age={24}` (a number, in curly braces). If the value is not a plain string, use curly braces. This is true for numbers, booleans, arrays, objects and functions."),

    H("Destructuring props"),
    P("Writing `props.name` again and again is long. Most people use **destructuring**, a JavaScript feature that pulls values out of an object into variables. You do it right in the function brackets:"),
    C('jsx', `function Greeting({ name, age }) {
  return <p>Hello, {name}! You are {age} years old.</p>;
}`),
    P("This does exactly the same, and it also shows at the top which props the component needs. We will use this style from now on."),

    H("Default values"),
    P("If a parent forgets to pass a prop, its value is `undefined`. You can give a default value in the destructuring:"),
    C('jsx', `function Button({ label = 'Click me', color = 'blue' }) {
  return <button style={{ background: color, color: 'white' }}>{label}</button>;
}

// <Button />                      shows "Click me"
// <Button label="Save" color="green" />`),

    H("Props are read-only"),
    P("A component must never change its own props. Props belong to the parent. If a child needs data that changes, it uses **state**, which you will meet in the next lesson. This rule keeps data flow simple: data goes down, and you can always find where a value came from. If you try to assign `props.name = 'x'`, React will give an error."),

    H("Passing different kinds of values"),
    C('jsx', `<Profile
  name="Asha"
  isAdmin={true}
  skills={['React', 'CSS', 'SQL']}
  address={{ city: 'Pune', country: 'India' }}
  onSave={() => console.log('saved')}
/>`),
    P("A prop can be text, a number, a true or false value, an array, an object, or even a function. Passing a function is how a child tells its parent that something happened, as you will see in the lessons on events and lifting state."),
    P("For a `true` prop you can write just the name: `<Profile isAdmin />` means the same as `isAdmin={true}`."),

    H("Children: putting content inside a component"),
    P("Sometimes you want to put things between the opening and closing tags of your component, like you do with a `div`. React gives these to the component as a special prop called `children`."),
    C('jsx', `function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function App() {
  return (
    <Card title="Today's tip">
      <p>Drink some water.</p>
      <button>Done</button>
    </Card>
  );
}`),
    P("The `Card` does not know what is inside it. This makes it a very flexible building block. Boxes, layouts, modals and panels are often made this way."),

    H("Splitting a page into components"),
    P("A good habit: look at a design and draw boxes around the parts that repeat, or that have one clear job. Each box can be a component. Here is a small profile page split into pieces:"),
    C('jsx', `function Avatar({ src, name }) {
  return <img src={src} alt={name} width="64" height="64" />;
}

function UserInfo({ user }) {
  return (
    <div>
      <Avatar src={user.photo} name={user.name} />
      <h3>{user.name}</h3>
      <p>{user.job}</p>
    </div>
  );
}

function App() {
  const user = { name: 'Asha', job: 'Designer', photo: '/asha.png' };
  return <UserInfo user={user} />;
}`),
    P("A rule of thumb: if a part of the screen is used in more than one place, or if a function grows over about fifty lines, think about splitting it. Do not split too early either. A tiny component used once is not always better."),

    H("Where to put components"),
    L(
      "Put each component in its own file, named after it: `Avatar.jsx` holds `Avatar`.",
      "Use `export default Avatar;` at the bottom, and `import Avatar from './Avatar.jsx';` at the top of the file that uses it.",
      "Group files in folders such as `src/components`. Keep it simple until the project grows.",
    ),
    P("**Never define a component inside another component.** It looks like it works, but React will make a new copy on every draw, and any state inside it is lost. Always write components at the top level of a file."),

    H("Common mistakes"),
    L(
      "Forgetting the capital letter, so `<card>` is treated as an HTML tag.",
      "Writing `age=\"24\"` and then trying to add to it: it is text, not a number. Use `age={24}`.",
      "Changing props inside the child. Copy the value into state if you need to change it.",
      "Defining a component inside another one.",
      "Passing a function call instead of a function: `onSave={save()}` runs it at once. Use `onSave={save}` or `onSave={() => save(id)}`.",
    ),
    ...task(
      "Create a `ProductCard` component that takes `name`, `price` and an optional `inStock` prop (default `true`). Show “Out of stock” when it is false.",
      "Use it three times with different data.",
      "Create a `Box` component that wraps its `children` in a border, and put a `ProductCard` inside it.",
    ),
    ...check("Three different cards appear on the page.", "Changing `inStock` to `false` changes the message.", "The `Box` draws a border around any content you put inside."),
    H("Summary"),
    L(
      "A component is a function with a capital letter that returns JSX.",
      "Props are read-only inputs. Use destructuring, defaults and curly braces for non-text values.",
      "`children` is the content placed inside a component's tags.",
      "Split the screen into small pieces, each in its own file, and never define a component inside another.",
    ),
  ], [
    { q: 'What is the difference between props and state?', a: 'Props come from the parent and cannot be changed by the child. State belongs to the component and can change over time.' },
    { q: 'Can I pass a function as a prop?', a: 'Yes. It is how a child component tells its parent that something happened, such as a button click.' },
    { q: 'How many props are too many?', a: 'There is no fixed number, but if a component needs many props, think about passing one object, or splitting it into smaller components.' },
    { q: 'Why can I not change props?', a: 'Props belong to the parent. Letting children change them would make data hard to follow. Use state for data that changes.' },
  ], 'react components, react props, react children prop, react destructuring props, react component example'),

  // ---------------------------------------------------------------- 5
  lesson(S1, 'react-usestate-hook-explained', 'React useState Explained: Make Your Page React to Change', 'Understand state and the useState hook with a counter, a toggle and a text box. Learn why you must never change state directly.', '', [
    P("So far our components show fixed data. Real pages change: a counter goes up, a menu opens, a message appears. To remember data that changes, a component needs **state**. In this lesson you will learn state with the `useState` hook, step by step, using small examples."),

    H("Why a normal variable does not work"),
    P("Let us try to build a counter with a plain variable. It looks right, but it does not work:"),
    C('jsx', `function Counter() {
  let count = 0;

  function add() {
    count = count + 1;
    console.log(count);
  }

  return <button onClick={add}>Clicked {count} times</button>;
}`),
    P("If you click, the console shows 1, 2, 3, but the button always says 0. There are two reasons. First, React does not know that `count` changed, so it does not draw the component again. Second, even if it did, a function component starts from the top each time it is drawn, so `let count = 0` would run again and reset the number. We need a place where React can keep the value safe between draws, and where changing it tells React to draw again. That place is state."),

    H("The useState hook"),
    P("A **hook** is a special function whose name starts with `use`. Hooks let a component use React features. `useState` gives a component a piece of state."),
    C('jsx', `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`),
    P("Let us read the key line, `const [count, setCount] = useState(0);`:"),
    L(
      "`useState(0)` creates a piece of state and says its **first value is 0**.",
      "It returns an array with two things. The first is the **current value**, which we call `count`. The second is a **function to change it**, which we call `setCount`.",
      "We use array destructuring to give them names. You can choose any names, but the pattern `[thing, setThing]` is the usual way.",
    ),
    P("When you click, `setCount(count + 1)` tells React: “the new value is one more”. React stores it, draws the component again, and this time `count` is 1. The button shows “Clicked 1 times”. The same happens for each click."),

    H("What happens when state changes"),
    O(
      "You call the setter function, for example `setCount(5)`.",
      "React saves the new value.",
      "React calls your component function again (a re-render).",
      "This time `useState` gives back the new value.",
      "React compares the new result with the old one and updates the page where it is different.",
    ),
    P("The big idea: you never change the page yourself. You change the state, and the page follows."),

    H("State can be any type"),
    P("State is not only for numbers. Here are a few common kinds:"),
    C('jsx', `const [name, setName] = useState('');            // text
const [isOpen, setIsOpen] = useState(false);     // true or false
const [items, setItems] = useState([]);          // a list
const [user, setUser] = useState(null);          // an object, or nothing yet
const [form, setForm] = useState({ email: '', age: 0 });  // an object`),

    H("Example: a toggle"),
    C('jsx', `function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close menu' : 'Open menu'}
      </button>
      {isOpen && (
        <ul>
          <li>Home</li>
          <li>About</li>
        </ul>
      )}
    </div>
  );
}`),
    P("Each click flips `isOpen` between `true` and `false`. The text on the button and the list both depend on it. You wrote no code to show or hide anything by hand. You only described what to show for each value."),

    H("Example: a text box"),
    C('jsx', `function Hello() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}`),
    P("Every key press makes a change event. The handler reads the new text with `event.target.value` and puts it in state. The input shows what is in state through its `value`. This pattern is called a **controlled input**, and the forms lesson explains it fully."),

    H("The golden rule: never change state directly"),
    P("State is read-only. You must always use the setter. If you write `count = count + 1` or `items.push('x')`, React does not notice, and the screen does not change. For numbers and text this is easy. For arrays and objects, you must **make a new copy** and pass the copy to the setter."),
    C('jsx', `// Add to an array: make a new array
setItems([...items, 'new item']);

// Remove from an array
setItems(items.filter((item) => item !== 'old item'));

// Change an object: copy it, then replace one field
setUser({ ...user, name: 'Asha' });

// Change one item in a list
setItems(items.map((item) => item.id === 3 ? { ...item, done: true } : item));`),
    P("The three dots `...` are called the **spread** syntax. They copy all the items of an array, or all the fields of an object, into a new one. React decides whether something changed by checking if the value is a **new** object, so a copy is required. This idea is called **immutability**, and it is one of the most important habits to learn."),

    H("State updates are not instant"),
    P("Calling the setter does not change the variable in the code that is running right now. It asks React to draw again with the new value. This surprises many beginners:"),
    C('jsx', `function Demo() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // still the OLD value
  }
  return <button onClick={handleClick}>{count}</button>;
}`),
    P("The console shows the old number, because that variable belongs to the draw that is already finished. The new value arrives in the next draw."),
    P("There is a second problem. If you call `setCount(count + 1)` three times in a row, you get +1, not +3, because each call used the same old `count`. When the new value depends on the old value, pass a function. React gives it the latest value:"),
    C('jsx', `setCount((current) => current + 1);
setCount((current) => current + 1);
setCount((current) => current + 1); // now it really adds 3`),
    N("Rule of thumb: if the new state depends on the old state, use the function form `setX((old) => ...)`."),

    H("Where should state live?"),
    L(
      "Each `useState` call belongs to one component. Two copies of `Counter` have two separate counts.",
      "Keep state as **small** as you can. Do not store data you can work out from other data. For example, store the list, and calculate its length when you need it.",
      "If two components need the same state, move it to their closest shared parent. Lesson 14 covers this.",
    ),
    P("Also remember the rules of hooks: call them only at the **top level** of a component, never inside an `if`, a loop, or a nested function. And call them only inside components or custom hooks. React depends on the order of the hook calls staying the same on every draw."),

    H("Common mistakes"),
    L(
      "Changing state directly (`count++`, `items.push(...)`).",
      "Forgetting to copy an object or array before changing it.",
      "Expecting the variable to change right after calling the setter.",
      "Calling hooks inside conditions or loops.",
      "Storing something you could calculate, which makes two values that can get out of step.",
    ),
    ...task(
      "Build a counter with three buttons: add one, subtract one, and reset to zero.",
      "Build a to-do list with an input and an Add button. Keep the list in state and add items using the spread syntax.",
      "Add a Remove button to each item using `filter`.",
    ),
    ...check("The counter never goes wrong when you click quickly.", "New to-do items appear at once and the input still works.", "Removing an item removes only that item."),
    H("Summary"),
    L(
      "State is data that changes. `useState(initial)` returns the value and a setter.",
      "A call to the setter makes React draw the component again with the new value.",
      "Never change state directly. Make a new array or object with spread, `map` or `filter`.",
      "If the new value depends on the old one, use `setX((old) => ...)`.",
    ),
  ], [
    { q: 'Why do I need useState instead of a normal variable?', a: 'A normal variable resets every time the component is drawn, and changing it does not tell React to draw again. State is kept safe between draws, and changing it with the setter makes React update the screen.' },
    { q: 'Why is my state not updating right after I set it?', a: 'The setter asks React to draw again with the new value. The variable in the running code still holds the old value. The new one is available in the next draw.' },
    { q: 'Can I have many useState calls in one component?', a: 'Yes. Use one for each separate piece of data, or use one object when the pieces always change together.' },
    { q: 'What is the difference between useState and a variable inside useEffect?', a: 'State is meant for data that the screen shows. A normal variable or a ref is better for values that do not need to cause a redraw.' },
  ], 'react usestate, react state tutorial, react hooks for beginners, usestate array object update, react counter example'),

  // ---------------------------------------------------------------- 6
  lesson(S1, 'handling-events-in-react', 'Handling Events in React: Clicks, Typing and Forms Made Simple', 'Learn how to react to clicks, typing and form submit. Understand the event object, passing arguments, and the most common event mistakes.', '', [
    P("A page that never reacts is just a poster. Events are how people talk to your app: they click, type, hover, press keys and submit forms. In React, handling events is simple and looks like HTML, with a few small differences. This lesson shows each of them."),

    H("Your first event handler"),
    P("To react to a click, give the element an `onClick` prop. Its value is the **function** to run when the click happens."),
    C('jsx', `function Hello() {
  function handleClick() {
    alert('You clicked the button!');
  }

  return <button onClick={handleClick}>Say hello</button>;
}`),
    P("A good habit is to start the name of the handler with `handle`, such as `handleClick` or `handleSubmit`. It makes your code easy to read."),

    H("The most common mistake: calling the function"),
    P("Look at the difference between these two lines:"),
    C('jsx', `<button onClick={handleClick}>Right</button>      {/* passes the function */}
<button onClick={handleClick()}>Wrong</button>    {/* runs it at once */}`),
    P("The wrong version runs `handleClick()` while the page is being drawn, and passes its result to the button. Remember: **pass the function, do not call it.** Without brackets you give React the function to call later. With brackets you call it now."),

    H("Inline handlers"),
    P("For very short actions, you can write the function directly. An arrow function is the usual way:"),
    C('jsx', `<button onClick={() => setCount(count + 1)}>Add</button>`),
    P("If your handler is longer than one line, write a named function above, so the JSX stays easy to read."),

    H("Passing an argument"),
    P("Often you need to tell the handler which item was clicked. Wrap the call in an arrow function:"),
    C('jsx', `function List({ items, onRemove }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onRemove(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}`),
    P("The arrow function `() => onRemove(item.id)` waits until the click, then calls `onRemove` with the right id. Each button gets its own arrow function, so each remembers its own item."),

    H("The event object"),
    P("React gives your handler one argument: the **event object**. It holds details about what happened. The most useful parts are:"),
    L(
      "`event.target`: the element that caused the event. For an input, `event.target.value` is the text in it.",
      "`event.preventDefault()`: stops the browser's normal action, such as reloading the page when a form is submitted.",
      "`event.key`: for key events, the key that was pressed, such as `'Enter'`.",
      "`event.stopPropagation()`: stops the event from reaching parent elements.",
    ),
    C('jsx', `function Search() {
  const [text, setText] = useState('');

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      console.log('Searching for', text);
    }
  }

  return <input value={text} onChange={handleChange} onKeyDown={handleKeyDown} />;
}`),

    H("Form submit"),
    P("A form that is submitted makes the browser reload the page, which would throw away your state. Stop that with `preventDefault`:"),
    C('jsx', `function SignUp() {
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Sending', email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Join</button>
    </form>
  );
}`),
    P("Use `onSubmit` on the `form`, not `onClick` on the button. That way the form also works when the person presses Enter, and it works with screen readers and keyboards."),

    H("Common events"),
    L(
      "`onClick`: a click or tap.",
      "`onChange`: the value of an input changed. In React it fires on every key press.",
      "`onSubmit`: a form was submitted.",
      "`onKeyDown` and `onKeyUp`: a key was pressed or released.",
      "`onMouseEnter` and `onMouseLeave`: the pointer moved onto or off an element.",
      "`onFocus` and `onBlur`: an element got or lost focus.",
    ),

    H("Events travel up (bubbling)"),
    P("When you click a button inside a box, the click first happens on the button, then **bubbles up** to the box and then to its parents. If both have an `onClick`, both run. If you do not want the parent to know, call `event.stopPropagation()` in the child."),
    C('jsx', `<div onClick={() => console.log('box clicked')}>
  <button onClick={(e) => { e.stopPropagation(); console.log('button clicked'); }}>
    Click me
  </button>
</div>`),

    H("Child tells parent: functions as props"),
    P("A child component cannot change the state of its parent directly. Instead the parent passes a **function** as a prop, and the child calls it when something happens. This is how data flows up in React."),
    C('jsx', `function LikeButton({ onLike }) {
  return <button onClick={onLike}>Like</button>;
}

function Post() {
  const [likes, setLikes] = useState(0);
  return (
    <div>
      <p>{likes} likes</p>
      <LikeButton onLike={() => setLikes(likes + 1)} />
    </div>
  );
}`),
    P("A common name for such props is `onSomething`, like `onLike`, `onSave` or `onDelete`. It tells the reader that this prop is an event that the parent can listen to."),

    H("Good habits for events"),
    L(
      "Use real `button` elements for clicks, not a `div`. Buttons work with the keyboard and with screen readers for free. Add `type=\"button\"` to buttons inside forms that should not submit.",
      "Keep handlers short. If a handler grows, move the work into a normal function.",
      "Do not forget `preventDefault` in form submit handlers.",
      "Disable a button while a request is running, so people cannot click twice.",
    ),

    H("Common mistakes"),
    L(
      "Writing `onclick` (small letters). It must be `onClick`.",
      "Calling the function: `onClick={save()}`.",
      "Forgetting `event.preventDefault()` in a form, and then wondering why the page reloads.",
      "Using a `div` with `onClick` for something that is really a button.",
      "Reading `event` inside a delayed function after it ended. Copy what you need first: `const value = event.target.value`.",
    ),
    ...task(
      "Make a button that toggles a message between “On” and “Off”.",
      "Make a text box that shows how many characters have been typed.",
      "Make a small form with a name field. On submit, add the name to a list on the page, and clear the input.",
      "Add a child component `DeleteButton` that calls an `onDelete` prop, and use it to remove names.",
    ),
    ...check("The page does not reload when you submit the form.", "Pressing Enter in the input submits the form.", "Deleting a name removes only that name."),
    H("Summary"),
    L(
      "Events use camelCase props such as `onClick`. Pass a function, do not call it.",
      "Use an arrow function to pass arguments: `() => remove(id)`.",
      "The event object gives `target.value`, `key` and `preventDefault()`.",
      "Child components tell the parent about events through function props.",
    ),
  ], [
    { q: 'Why does my onClick run when the page loads?', a: 'You wrote onClick={handleClick()}, which calls the function at once. Write onClick={handleClick} or onClick={() => handleClick()}.' },
    { q: 'What is event.preventDefault() for?', a: 'It stops the normal browser action. In a form it stops the page from reloading when the form is submitted.' },
    { q: 'What is the difference between onChange in React and in HTML?', a: 'In React, onChange fires on every key press in a text input, so you can keep state in step with what the person types.' },
    { q: 'How does a child component change the parent state?', a: 'The parent passes a function as a prop. The child calls it, and the parent changes its own state inside that function.' },
  ], 'react events, react onclick, react form submit preventdefault, react event handler, react props function'),
];
