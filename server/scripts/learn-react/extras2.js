// Second set of extras: "Questions beginners ask", placed before "Your task". Plain words, short answers.
import { P, H, L } from './helpers.js';

const qa = (...pairs) => [H('Questions beginners often ask'), ...pairs.map(([q, a]) => P('**' + q + '** ' + a))];

export const extras2 = {
  'react-components-and-props-explained': qa(
    ['Can a component return nothing?', 'Yes. Return `null` and it shows nothing. This is useful for a component that decides not to appear, such as a banner with no message.'],
    ['How do I know when to make a new component?', 'Make one when a piece of the screen repeats, when it has one clear job, or when a component becomes hard to read. If you can give a part a good short name, such as `Avatar` or `PriceTag`, it is a good candidate.'],
    ['Why is my component name in capital letters?', 'It is how React tells your own components from HTML tags. `<card />` is looked up as an HTML tag called card, but `<Card />` is your function.'],
    ['Can props have the same name as HTML attributes?', 'Yes. Props are your own names. Many people use `title`, `src` and `label`. Just remember that a prop does nothing until your component uses it.'],
  ),
  'handling-events-in-react': qa(
    ['Why do I use an arrow function in onClick sometimes and not other times?', 'If the handler needs no argument, pass the function name: `onClick={handleSave}`. If you need to give it an argument, such as an id, wrap the call: `onClick={() => handleRemove(id)}`. The wrapper waits until the click before it calls your function.'],
    ['What is the difference between onChange and onInput?', 'In React you almost always use `onChange`. It fires on every key press in a text input, which is what you want for keeping state in step with the field.'],
    ['Can I use the same handler for many buttons?', 'Yes. Pass different arguments in the arrow function, or read information from the event, such as `event.currentTarget.dataset.id`. One handler for many items keeps your code short.'],
    ['Why does my page reload when I press a button in a form?', 'A button inside a form submits it by default. Add `type=\"button\"` to buttons that should not submit, and use `event.preventDefault()` in the submit handler.'],
  ),
  'conditional-rendering-in-react': qa(
    ['Which way should I choose?', 'Pick the one that makes the code easiest to read. A short ternary for text, `&&` for show-or-nothing, and early returns for whole screens. If you cannot read your own condition in one go, split it into a variable with a clear name, such as `const canEdit = user && user.isAdmin;`.'],
    ['Does hidden content still cost anything?', 'Content that is not rendered costs nothing, because it is not in the page. Content hidden with CSS is still in the page, and its component still runs.'],
    ['Can I render different components in a loop?', 'Yes. Inside `map`, you can use a ternary or an object map to choose a component for each item, for example a `Photo` or a `Video` depending on the `type` field.'],
    ['Is it fine to use switch?', 'Yes. A `switch` before the `return` is good for many cases. Keep each case short, and move big pieces into their own components.'],
  ),
  'react-forms-and-controlled-inputs': qa(
    ['Do I need a library for forms?', 'Not for small forms. Controlled inputs and a simple validation function are enough. Look at a library when your forms are large, have many steps or have many rules.'],
    ['Why does my number input give text?', 'The value of every input is text, even for `type=\"number\"`. Convert it with `Number(value)` when you need a number, and think about what to do when the field is empty.'],
    ['How do I show a password?', 'Keep a true or false state, such as `show`, and set `type={show ? \"text\" : \"password\"}`. Add a button with a clear label like “Show password”, and tell screen readers its state with `aria-pressed`.'],
    ['How do I stop people from sending a form twice?', 'Keep a `sending` state. Set it to true at the start of submit, disable the button while it is true, and set it to false when the request ends, whether it worked or not.'],
  ),
  'styling-react-apps-css-modules-tailwind': qa(
    ['Do I have to choose only one way?', 'No. Many projects mix them, for example Tailwind for layout and a small CSS file for a special animation. Just keep it consistent so other people can follow it.'],
    ['Why does my CSS Module class not work?', 'Check that the file ends with `.module.css`, that you imported it as an object, and that you wrote `styles.name` and not a string. Class names with dashes need brackets: `styles[\"my-class\"]`.'],
    ['How can I use a font?', 'Add the font files or a link in `index.html`, and set `font-family` on `body` in your global CSS. Always set a fallback font, such as `system-ui, sans-serif`.'],
    ['How do I add animation?', 'Start with plain CSS transitions, like `transition: background 0.2s`, for hover and focus changes. Respect people who ask for less motion with `prefers-reduced-motion`.'],
  ),
  'fetch-data-in-react-loading-error-states': qa(
    ['Why does my request run twice in development?', 'StrictMode runs effects twice on purpose. With the cleanup that cancels the old request, nothing breaks. It does not happen in the built site.'],
    ['Where should I keep the API address?', 'In an environment variable, such as `VITE_API_URL`, so you can change it between your computer and the live site without editing code.'],
    ['What about sending a login token?', 'Add it in your `api` helper, in one place, as a header such as `Authorization`. Do not copy it into every component, and never print it in logs.'],
    ['How do I refresh data after saving?', 'After a successful POST, either add the new item to state, or call your loading function again. Libraries such as TanStack Query do this with one call, as lesson 25 shows.'],
  ),
  'react-useref-hook-dom-access': qa(
    ['Can I have many refs in one component?', 'Yes. Make one `useRef` for each thing you need. For a list of items you can store the elements in an object inside one ref, or use a ref callback.'],
    ['Is it wrong to change the page directly with a ref?', 'For small things like focus and scrolling it is fine. Avoid using refs to change what is drawn, such as text or classes, because React will not know and may overwrite your changes. Use state for that.'],
    ['Does changing a ref cause a render?', 'No, and that is the point. If you need the screen to update, use state instead.'],
  ),
  'react-context-api-usecontext-explained': qa(
    ['Can I have more than one provider?', 'Yes, as many as you need. You can nest them, for example a theme provider inside an auth provider. Each context is separate.'],
    ['Where does the provider go?', 'Around the parts of the app that need the data. Often that is `main.jsx`, wrapped around `App`. You can also place a provider lower in the tree for one section.'],
    ['Can I change context from a child?', 'Yes, but through a function that the provider shares, such as `toggleTheme`. The provider owns the state, so changes go through it.'],
    ['Is context only for global data?', 'It is for data that many components share. It does not have to be for the whole app. A form with many parts can have a small context just for itself.'],
  ),
  'react-custom-hooks-reuse-logic': qa(
    ['Can a custom hook return JSX?', 'It can, but usually it should not. A hook shares logic. If you want to share a piece of screen, make a component instead.'],
    ['Can hooks call other hooks?', 'Yes. This is how bigger hooks are built, for example `useSearch` can use both `useDebounce` and `useFetch`.'],
    ['How do I test a custom hook?', 'Use `renderHook` from React Testing Library, as lesson 26 shows. Or test it through a small component that uses it.'],
    ['Should I share hooks between projects?', 'Good hooks are often copied between your own projects, or published as small packages. Libraries such as `usehooks-ts` and `react-use` also give you many ready-made hooks to read and learn from.'],
  ),
  'react-router-pages-links-navigation': qa(
    ['What is the difference between BrowserRouter and HashRouter?', '`BrowserRouter` gives clean addresses like `/about` and needs the server fallback to `index.html`. `HashRouter` puts the page after a `#`, like `/#/about`, and works on any host without extra setup, but the addresses look less clean.'],
    ['How do I go back with a button?', 'Call `navigate(-1)`, which works like the browser back button.'],
    ['How do I highlight the current link?', 'Use `NavLink`. It gives you `isActive` so you can add a class or style to the link of the current page.'],
    ['Can I read the URL from a deep component?', 'Yes. Call `useParams`, `useLocation` or `useSearchParams` in any component under the router. There is no need to pass the values down as props.'],
  ),
  'react-forms-validation-formdata-react-hook-form': qa(
    ['Can I use FormData with a controlled input?', 'You can, but it mixes two ways. Pick one way for each form so the code stays easy to understand.'],
    ['How do I validate on blur?', 'Add `onBlur` to the field and run the checks for that one field, then set only that field error. Clear it when the value becomes valid.'],
    ['How do I reset a form after submit?', 'For an uncontrolled form, call `event.currentTarget.reset()`. For a controlled form, set the state back to the starting object. In React 19 a form action resets the form for you after it finishes.'],
    ['What is Zod?', 'A small library for describing the shape of data and checking it, with clear errors. You can use the same rules in the browser and on a Node server.'],
  ),
  'react-state-management-redux-toolkit-zustand': qa(
    ['Can I use Redux and TanStack Query together?', 'Yes, and it is a common setup. TanStack Query handles server data, and Redux Toolkit or Zustand holds shared client state such as filters and the cart.'],
    ['Will a store make my app faster?', 'Not by itself. A store changes where state lives. It can reduce extra renders when you select small pieces, but it is not a speed tool.'],
    ['Is Redux hard to learn?', 'Redux Toolkit is much easier than the old Redux. If you understood `useReducer` in lesson 15, you already know the main idea of actions and reducers.'],
    ['Do I need to wrap Zustand in a provider?', 'No. A Zustand store is a hook you can import and use anywhere, which is part of why it is quick to start with.'],
  ),
};
