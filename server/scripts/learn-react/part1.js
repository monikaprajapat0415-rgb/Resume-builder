import { P, H, L, O, N, C, task, check, lesson } from './helpers.js';

const S1 = 'Start Here';

export const lessons = [
  // ---------------------------------------------------------------- 1
  lesson(S1, 'what-is-react-and-why-use-it', 'What Is React? Why Use It and How It Works', 'Learn what React is in simple words, why so many sites use it, and the three big ideas behind it: components, state and the virtual DOM.', '', [
    P("React is a JavaScript library for building user interfaces. A user interface, or UI, is everything a person sees and touches on a screen: buttons, menus, lists, forms and pictures. React was made at Facebook and is now used by thousands of companies, from small shops to very large sites. If you want to build modern websites or apps, learning React is one of the most useful steps you can take."),
    P("This first lesson has no hard code. It explains the big ideas in easy words, so every later lesson makes sense. Take your time, because these ideas come back in every lesson."),

    H("The problem React solves"),
    P("Think about a shopping cart on a website. When you add a book, many things must change at the same time: the number on the cart icon, the list of items, the total price and maybe a message that says “Added!”. If you write this with plain JavaScript, you must find each part of the page and change it by hand. Miss one part, and the page shows wrong numbers. As the page grows, this gets messy and slow to fix."),
    P("React gives you a different way to think. You do not change the page by hand. Instead, you describe what the page should look like for the data you have right now. When the data changes, React works out what must change on the screen and updates only those parts. You say **what** you want, and React takes care of **how**."),
    N("A simple way to remember it: with plain JavaScript you give the browser step-by-step orders. With React you give it a picture of the result, and React makes the screen match the picture."),

    H("Big idea 1: components"),
    P("A **component** is a small, reusable piece of the screen. A button can be a component. A product card can be a component. A whole page can be a component made of smaller ones. You build a page the way you build with building blocks: small pieces joined into bigger pieces."),
    P("Here is why this is powerful. Imagine a shop page that shows twenty products. You write one `ProductCard` component, and use it twenty times with different data. If you later want to change how a card looks, you change it in one place, and all twenty cards change."),
    P("In React a component is just a JavaScript function that returns what should be shown. Here is the smallest example:"),
    C('jsx', `function Welcome() {
  return <h1>Hello, welcome to my site!</h1>;
}`),
    P("The strange part that looks like HTML inside JavaScript is called **JSX**. You will learn it in lesson 3. For now, just see that a component is a function, and its name starts with a capital letter."),

    H("Big idea 2: data flows down"),
    P("Components get information from their parent through **props**. Props are like the settings you give to a function. A parent component can say to a `ProductCard`: “show this name and this price”. The card shows it. The card cannot change the props it receives. Data goes in one direction, from parent to child, which makes the app easy to follow. When something goes wrong, you can trace where the data came from."),
    C('jsx', `function ProductCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Price: {props.price}</p>
    </div>
  );
}

// Using it:
// <ProductCard name="Notebook" price={3} />`),

    H("Big idea 3: state"),
    P("Some data changes while the person uses the page: the text in a search box, the items in a cart, or whether a menu is open. In React this changing data is called **state**. State belongs to a component. When the state changes, React draws the component again with the new data. This is called a **re-render**."),
    P("You do not tell the page “change this text to 5”. You change the state to 5, and the page shows 5 because the component describes the page from its state. This is the main idea of React, and the most common way to get stuck at first. If you remember one thing, remember this: **the screen is a result of the data**."),

    H("What is the virtual DOM?"),
    P("The browser keeps the page as a tree of objects called the **DOM** (Document Object Model). Changing the real DOM can be slow if you do it too much. React keeps a light copy of the page in memory, called the **virtual DOM**. When your state changes, React makes a new virtual copy, compares it with the old one, and finds the small differences. Then it changes only those differences in the real page. This comparing step is called **reconciliation**."),
    P("You do not need to manage this. It is helpful to know it exists, because it explains why React is fast enough for large pages, and why you should never change the page by hand when React owns it."),

    H("React is a library, not a full framework"),
    P("React only handles the screen. It does not decide how you send data to a server, how you move between pages, or how you style your app. For those jobs you choose other tools, such as React Router for pages. This gives you freedom, but it also means you must learn a few extra tools. This course covers the most important ones."),
    P("You may also hear about **Next.js**. It is a framework built on top of React that adds pages, server rendering and more. Learning React first is the right order, because Next.js is React with extra features."),

    H("Where is React used?"),
    L(
      "**Websites** such as online shops, news sites and dashboards.",
      "**Mobile apps**, using a sister tool called React Native, which uses the same ideas.",
      "**Admin tools and dashboards**, where data changes often and screens are full of forms and tables.",
      "**Job markets:** React is one of the most requested skills in front end job adverts. Check adverts in your own country to see how common it is near you.",
    ),

    H("What you need to know before you start"),
    P("You should know basic HTML and CSS, and the basics of JavaScript: variables, functions, arrays, objects and the `if` statement. If you know a little about arrow functions and array methods like `map`, that helps a lot, and we will explain them again when they come up. You do not need to be an expert. Many people learn JavaScript and React together."),
    P("If some JavaScript words are new, do not worry. Each lesson explains its own small steps, and each lesson has a short task to try. Practice is the best teacher, so type the code yourself instead of only reading it."),

    H("How this course is organised"),
    L(
      "**Start Here (lessons 1 to 10):** the basics: setup, JSX, components, props, state, events, lists, forms and styling.",
      "**Hooks and Data (lessons 11 to 20):** useEffect, fetching data, refs, reducers, context, custom hooks, routing and forms.",
      "**Advanced React (lessons 21 to 30):** speed, code splitting, error handling, state libraries, data libraries, testing, accessibility, new React 19 features, TypeScript and a final guide to real projects.",
    ),
    P("Each lesson uses short sentences and plain words, has code you can copy, a task and a small check list, and ends with a summary and common questions. Every lesson also has an animation at the top that shows the main idea step by step."),

    H("Tips for learning faster"),
    L(
      "**Type the code.** Copying and pasting teaches your fingers nothing. Typing makes you notice details.",
      "**Break things on purpose.** Remove a bracket and read the error. Errors are the best teachers and you will meet them often.",
      "**Build small things.** A counter, a to-do list, a notes app. Small finished projects beat big unfinished ones.",
      "**Read errors slowly.** React usually tells you the file and line. Read the first line first.",
      "**Come back.** If a lesson feels hard, finish it, move on, and return later. Ideas settle with time.",
    ),
    ...task(
      "Write in one sentence what a component is, in your own words.",
      "Think of a website you use daily. List three parts of it that could be components.",
      "Think of one piece of data on that site that changes while you use it. That is state.",
    ),
    ...check("You can explain components, props and state to a friend without using code.", "You know why React says “describe the screen, do not change it by hand”."),
    H("Summary"),
    L(
      "React is a JavaScript library for building user interfaces from small reusable components.",
      "Props send data down from parent to child. State is data that changes, and a change makes the component draw again.",
      "React keeps a virtual copy of the page and updates only what changed in the real page.",
      "React handles the screen only. You add other tools for pages, data and more.",
    ),
  ], [
    { q: 'Is React a framework or a library?', a: 'React is a library. It handles the user interface only. A framework such as Next.js is built on React and adds more, like page routing and server rendering.' },
    { q: 'Do I need to learn JavaScript before React?', a: 'Yes, the basics. You need variables, functions, arrays, objects and conditions. You can learn a few more things, such as array methods and arrow functions, while learning React.' },
    { q: 'What is the virtual DOM in simple words?', a: 'It is a light copy of the page that React keeps in memory. React compares the old and new copy and changes only the small parts of the real page that are different.' },
    { q: 'Is React free?', a: 'Yes. React is free and open source. The tools in this course are free too.' },
  ], 'what is react, react for beginners, react js tutorial, react components props state, virtual dom explained'),

  // ---------------------------------------------------------------- 2
  lesson(S1, 'set-up-react-with-vite-first-project', 'Set Up React with Vite: Your First Project Step by Step', 'Install Node.js, create a React project with Vite, understand every file and folder, and run your app in the browser.', '', [
    P("Before you write React, you need a place to write and run it. In this lesson you will install the tools, create a new project and look at what each file does. After this lesson you will have a working React app on your computer that updates the moment you save a file."),

    H("What you need"),
    L(
      "**Node.js** (version 20 or newer). It lets JavaScript run on your computer, and it comes with **npm**, a tool that downloads packages.",
      "**A code editor.** VS Code is free and a very popular choice.",
      "**A browser** such as Chrome, Edge or Firefox.",
      "**A terminal.** On Windows you can use PowerShell or the terminal inside VS Code. On Mac and Linux use the Terminal app.",
    ),
    P("To check Node.js, open the terminal and type the commands below. Each should print a version number. If the command is not found, install Node.js from its official website and open a new terminal window."),
    C('bash', `node --version
npm --version`),

    H("What is Vite?"),
    P("Writing React needs a **build tool**. Browsers do not understand JSX, and your code is split across many files. A build tool turns your files into something the browser can run, and gives you a fast development server. **Vite** (say “veet”) is the tool most people use today. It starts in a second, and when you save a file the browser updates without a full reload. This is called hot reloading."),
    P("Older tutorials may tell you to use **Create React App**. It is no longer the best choice for new projects, so we use Vite."),

    H("Create the project"),
    P("In the terminal, go to the folder where you keep your projects and run this command. It asks a few questions. Choose **React** as the framework and **JavaScript** as the language."),
    C('bash', `npm create vite@latest my-first-app
cd my-first-app
npm install
npm run dev`),
    P("`npm create vite@latest my-first-app` makes a new folder with the starter files. `npm install` downloads the packages the project needs into a folder called `node_modules`. `npm run dev` starts the development server. The terminal shows an address such as `http://localhost:5173`. Open it in your browser and you will see the Vite and React starter page with a counter button."),
    N("Leave the dev server running while you work. To stop it, press Ctrl and C in the terminal. To start it again, run `npm run dev`."),

    H("A tour of the folders and files"),
    P("Open the project in VS Code. You will see a few files and folders. This is what matters:"),
    L(
      "**`index.html`**: the one page of your app. It has an empty `<div id=\"root\">` and a script tag that loads your code. React draws everything inside that div.",
      "**`package.json`**: the list of packages and the scripts like `dev` and `build`.",
      "**`src/main.jsx`**: the front door. It tells React to draw your `App` component inside the root div.",
      "**`src/App.jsx`**: your first component. This is where you will start writing.",
      "**`src/App.css` and `src/index.css`**: styles.",
      "**`public/`**: files that are copied as they are, such as the site icon.",
      "**`node_modules/`**: the downloaded packages. Never edit it and never put it in Git.",
    ),
    P("Here is `main.jsx`. It is short, and it is worth understanding line by line:"),
    C('jsx', `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);`),
    L(
      "`import ... from` brings code from another file or package. We bring in React tools and our own `App`.",
      "`createRoot` connects React to the real element with the id `root` in `index.html`.",
      "`.render(...)` tells React what to show. We show `<App />`.",
      "`StrictMode` is a helper that gives extra warnings while you develop. It does nothing in the final site. In development it runs some code twice on purpose, to help you find mistakes.",
    ),

    H("Make your first change"),
    P("Open `src/App.jsx`, delete everything in it, and write this simple component instead:"),
    C('jsx', `function App() {
  return (
    <main>
      <h1>My first React app</h1>
      <p>I am learning React with simple steps.</p>
    </main>
  );
}

export default App;`),
    P("Save the file. The browser changes at once, with no reload. Try changing the words, and watch the page follow. That quick feedback is why Vite is nice to learn with."),
    P("Notice `export default App`. It makes this function available to other files, and `main.jsx` imports it. Each component usually lives in its own file, and the file name matches the component name."),

    H("The scripts in package.json"),
    L(
      "**`npm run dev`** starts the development server with hot reloading.",
      "**`npm run build`** makes the final, small, fast files in a folder called `dist`. You upload these when you publish your site.",
      "**`npm run preview`** serves the `dist` folder locally, so you can test the real build.",
      "**`npm run lint`** (if present) checks your code for common mistakes with ESLint.",
    ),

    H("Useful editor and browser tools"),
    L(
      "**React Developer Tools** is a free browser extension. It adds two tabs to the browser tools: Components and Profiler. You can click a component and see its props and state. It is very useful for finding why something is not showing.",
      "**ESLint** warns you when you break a rule, for example when you forget a key in a list.",
      "**Prettier** formats your code so it looks the same every time. Many people turn on “format on save” in VS Code.",
    ),

    H("Common problems and quick fixes"),
    L(
      "**“npm is not recognised”:** Node.js is not installed, or the terminal was open before you installed it. Close it and open a new one.",
      "**Blank page:** open the browser console (press F12) and read the first red error. It usually names the file and line.",
      "**“Failed to resolve import”:** the file path or the file name has a typo. Paths are case-sensitive on many systems, so `app.jsx` and `App.jsx` can be different files.",
      "**Port already in use:** Vite will choose the next free port, such as 5174, and show it in the terminal.",
      "**Changes not showing:** check that you saved the file, and that the file you edit is the one `main.jsx` imports.",
    ),
    ...task(
      "Create a new Vite React project and run it in the browser.",
      "Replace the content of `App.jsx` with your own heading and a short paragraph about yourself.",
      "Create a new file `src/Footer.jsx` that exports a `Footer` component, then import and use it inside `App`.",
      "Run `npm run build` and look inside the `dist` folder.",
    ),
    ...check("The browser shows your own heading without a reload when you save.", "The footer text appears under your paragraph.", "`npm run build` ends without errors and makes a `dist` folder."),
    H("Summary"),
    L(
      "Install Node.js, create a project with `npm create vite@latest`, run `npm install`, then `npm run dev`.",
      "`index.html` has the root div, `main.jsx` connects React to it, and `App.jsx` is your first component.",
      "Use `npm run build` to make the files you publish.",
      "Install React Developer Tools. It helps you see props and state.",
    ),
  ], [
    { q: 'Why Vite and not Create React App?', a: 'Vite starts much faster, updates the page quicker when you save, and is actively used for new projects. Create React App is old and is no longer the recommended way to start.' },
    { q: 'What is node_modules and can I delete it?', a: 'It holds the packages your project uses. You can delete it safely and run npm install to get it back. Never put it in Git.' },
    { q: 'What is the difference between npm run dev and npm run build?', a: 'dev starts a fast local server for working on your app. build makes small optimised files in the dist folder that you upload to a host.' },
    { q: 'Do I have to use VS Code?', a: 'No. Any editor works. VS Code is free and has many helpful extensions, so most beginners choose it.' },
  ], 'react vite setup, create react app vite, install react, react project structure, react for beginners'),
];
