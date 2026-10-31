// React interview questions, part 1: basics, JSX and components, state and events.
import { mk } from './lib.mjs';
const A = mk('react');
const B = 'React basics', J = 'React JSX, components and props', S = 'React state and events';

export const r1 = [
  A(B, 'fresher', 'What is React, and why do people use it?',
`React is a JavaScript library from Meta for building user interfaces out of small reusable pieces called components. You describe what the screen should look like for the current data, and React updates the real page when the data changes.

People use it because components make large interfaces easier to organise, it has a huge community and ecosystem, and the same ideas carry over to mobile with React Native. It is a library, not a full framework, so routing and data tools are added separately.`),
  A(B, 'fresher', 'What is the virtual DOM, and how does React use it?',
`The virtual DOM is a lightweight JavaScript description of the interface that React keeps in memory. When state changes, React builds a new description, compares it with the previous one (called reconciliation or diffing), and applies only the differences to the real DOM.

The point is not that it is magically fast, but that you write code as "this is the UI for this state" and React works out the smallest set of real changes.`),
  A(B, 'fresher', 'What is the difference between a library and a framework? Is React one or the other?',
`With a library you call the code when you need it. With a framework, the framework defines the structure and calls your code. React is a library focused on the view layer. It does not include routing, form handling or data fetching, so teams add tools such as React Router and TanStack Query.

Frameworks built on React, such as Next.js, add routing, server rendering and more on top.`),
  A(B, 'fresher', 'How do you create a new React project?',
`The common choice today is Vite: npm create vite@latest my-app -- --template react, then npm install and npm run dev. Create React App is no longer recommended for new projects. For a full-stack app with routing and server rendering, many teams start with a framework such as Next.js or React Router.

The project has an index.html, a main entry file that mounts the app with createRoot, and a src folder with your components.`),
  A(B, 'fresher', 'What does ReactDOM.createRoot do?',
`createRoot connects React to a real DOM element on the page. You pass it the root element, for example document.getElementById('root'), and call render with your top-level component: createRoot(el).render(<App />).

It is the entry point of a client-side React app. It replaced the older ReactDOM.render and enables modern React features such as concurrent rendering.`),
  A(B, 'both', 'What are the main benefits and drawbacks of React?',
`Benefits: reusable components, a clear one-way data flow, a large ecosystem, good tooling and many jobs. Drawbacks: you must choose and combine other libraries, the first load can be heavy for client-only apps, and beginners find hooks and rendering rules confusing at first.

A balanced answer shows you understand the trade-offs, such as using server rendering for pages that need SEO.`),
  A(B, 'both', 'What is one-way data flow in React?',
`Data moves down from parent to child through props. Children cannot change a parent's data directly. When a child needs to cause a change, the parent passes down a function (a callback) and the child calls it.

This makes it easy to follow where data comes from and where it changes. It is why state is often "lifted up" to the nearest common parent.`),
  A(B, 'both', 'What happens when you call setState (or a state setter) in React?',
`The setter schedules a re-render. React calls your component function again with the new state, builds a new description of the UI, and updates the DOM where it changed. State updates may be batched, so several updates in one event usually cause one render.

The state variable does not change immediately inside the same render, so reading it right after calling the setter gives the old value.`),
  A(B, 'experienced', 'Explain what reconciliation is and how keys help.',
`Reconciliation is how React decides what to update when a component re-renders: it compares the new element tree with the old one. Elements of the same type at the same position are updated, and different types are replaced. For lists, React uses keys to match items between renders.

Stable unique keys let React keep each item's state and DOM when items are reordered, added or removed. Using the array index as key can cause wrong state or flicker when the list changes order.`),
  A(J, 'fresher', 'What is JSX?',
`JSX is a syntax that lets you write HTML-like markup inside JavaScript. Tools such as Vite with Babel or SWC turn it into normal JavaScript function calls. It is not HTML: for example you write className instead of class, and htmlFor instead of for.

You can put any JavaScript expression inside curly braces: <h1>Hello {user.name}</h1>.`),
  A(J, 'fresher', 'What are the rules of JSX?',
`A component must return one parent element or a fragment (<>...</>). Every tag must be closed, including <img /> and <input />. Attributes use camelCase, such as onClick and className. You cannot use statements like if or for inside JSX, but you can use expressions: ternaries, &&, and map.

Curly braces switch from markup to JavaScript.`),
  A(J, 'fresher', 'What is a component? What is the difference between a function and a class component?',
`A component is a reusable piece of the UI. A function component is a JavaScript function that returns JSX. A class component is a class with a render method and lifecycle methods.

Modern React uses function components with hooks for almost everything. Class components still work and appear in older code, and error boundaries still need a class (or a library).`),
  A(J, 'fresher', 'What are props, and can a component change its own props?',
`Props are the inputs a parent passes to a component, like function arguments: <Button label="Save" />. Inside, you read them from the props object or destructure them: function Button({ label }).

Props are read-only. A component must not change them. If a value needs to change over time, it belongs in state, either in this component or in a parent.`),
  A(J, 'fresher', 'What is the children prop?',
`children holds whatever you put between a component's opening and closing tags: <Card><p>Hello</p></Card>. The Card component receives it as props.children and decides where to render it.

It is how you build wrapper components such as cards, layouts and modals that accept any content.`),
  A(J, 'fresher', 'How do you render a list in React, and why do you need a key?',
`Use map on the array and return an element for each item: items.map((item) => <li key={item.id}>{item.name}</li>). The key is a special prop that gives each item a stable identity so React can update the right element when the list changes.

Use a unique, stable value such as a database id, not a random number generated on each render.`),
  A(J, 'both', 'What is a fragment and why would you use it?',
`A fragment lets a component return several elements without adding an extra wrapper node to the DOM. The short form is <>...</>. When you need to give it a key, for example in a list, use <Fragment key={id}>.

It keeps the HTML clean and avoids invalid structures, such as a div inside a table row.`),
  A(J, 'both', 'What are default props and how do you set default values today?',
`Default values for props are normally set with default parameters in the destructuring: function Button({ size = 'md' }). The old defaultProps property on function components is deprecated in newer React, so avoid it for new code.

Defaults keep a component usable when the parent does not pass every prop.`),
  A(J, 'both', 'What is prop drilling, and how can you avoid it?',
`Prop drilling means passing a prop through many layers of components that do not use it, just to reach a deep child. It makes code harder to change.

Options: use composition (pass the child component or children from above), put the data in Context, or use a state library. Do not reach for Context too early: sometimes restructuring the components is the simplest fix.`),
  A(J, 'both', 'What is the difference between controlled and uncontrolled components?',
`A controlled component has its value in React state: the input shows state and an onChange handler updates it, so React is the single source of truth. An uncontrolled component keeps its value in the DOM, and you read it when needed with a ref or FormData.

Controlled inputs are good for live validation and dependent fields. Uncontrolled inputs are simpler for basic forms and file inputs.`),
  A(J, 'experienced', 'What is component composition, and why does React prefer it to inheritance?',
`Composition means building complex components by combining simpler ones: passing children, passing components or render functions as props, and wrapping behaviour in custom hooks. React favours it because it is flexible and keeps components decoupled, while inheritance creates tight links between classes.

For example, instead of a SpecialButton extending Button, make a Button that takes props and children, and wrap it where needed.`),
  A(J, 'experienced', 'What is a higher-order component, and have hooks replaced it?',
`A higher-order component (HOC) is a function that takes a component and returns a new component with added behaviour, such as withAuth(Page). They were common for sharing logic before hooks.

Custom hooks now handle most of those cases in a simpler way and avoid wrapper nesting. HOCs still appear in older code and some libraries, so you should be able to read them.`),
  A(S, 'fresher', 'What is state, and how is it different from props?',
`State is data that a component owns and that can change over time, such as the text in an input or whether a menu is open. Props are data passed in from a parent and are read-only for the child.

When state changes, React re-renders the component. When a parent re-renders and passes new props, the child re-renders too.`),
  A(S, 'fresher', 'How does useState work?',
`useState takes an initial value and returns an array with the current value and a setter function: const [count, setCount] = useState(0). Calling setCount(5) stores the new value and re-renders the component.

When the new value depends on the old one, pass a function: setCount((c) => c + 1). This is safe even when updates are batched.`),
  A(S, 'fresher', 'How do you handle events in React?',
`Pass a function to an event prop in camelCase: <button onClick={handleClick}>. React calls it with a synthetic event object that behaves like the browser event. Write onClick={handleClick}, not onClick={handleClick()}, which would run the function during render.

For arguments, use an arrow function: onClick={() => remove(item.id)}. Use event.preventDefault() on a form submit to stop the page reload.`),
  A(S, 'fresher', 'Why should you not change state directly?',
`React decides to re-render only when you call the setter with a new value. Changing an object or array in place (items.push(x)) does not tell React anything changed, and the UI may not update. It also breaks features that compare old and new values.

Create a new copy: setItems([...items, x]) for arrays, setUser({ ...user, name }) for objects.`),
  A(S, 'both', 'What is "lifting state up"?',
`When two components need the same data, move the state to their closest common parent and pass it down as props, along with functions to change it. For example, a search box and a results list both need the search text, so the parent keeps it.

It keeps one source of truth. If it leads to passing props through many levels, consider Context or a store.`),
  A(S, 'both', 'Why can a state update seem to use an old value, and how do you fix it?',
`State inside a render is a snapshot. If you call setCount(count + 1) three times in one handler, all three use the same old count, so the result is only +1. Use the updater form, setCount((c) => c + 1), which receives the latest value each time.

The same snapshot idea applies to closures in timers and effects: they can capture old state unless you use updater functions, refs or correct dependencies.`),
  A(S, 'both', 'What is state batching in React?',
`React groups several state updates that happen in the same event or tick into a single re-render for better performance. In React 18 and later this automatic batching also applies inside promises, timeouts and native event handlers.

You rarely need to do anything. In the rare case where you must read the DOM right after an update, flushSync forces a synchronous render, but use it sparingly.`),
  A(S, 'both', 'When should you use useReducer instead of useState?',
`useReducer is useful when state has several related values, or when the next state depends on complex rules. You dispatch actions such as { type: 'add', item }, and a pure reducer function returns the new state. This keeps all update logic in one place and makes it easier to test.

For a simple toggle or a text input, useState is enough.`),
  A(S, 'experienced', 'How do you decide where state should live?',
`Start with the nearest component that uses it. If siblings need it, lift it to their parent. If many distant components need it, use Context or a store. Separate kinds of state: UI state (modals, inputs), server data (use a data library such as TanStack Query) and URL state (filters and pages belong in the URL so links work).

Avoid duplicating state; derive values during render instead of storing them in another state variable.`),
  A(S, 'experienced', 'What does it mean to derive state, and why is it better than syncing it with an effect?',
`Derived values can be calculated from existing state or props during render, such as filteredItems from items and a search string, or fullName from first and last name. Storing them in separate state and updating them in useEffect adds extra renders and bugs when they get out of sync.

Calculate during render, and use useMemo only if the calculation is truly expensive.`),
];
