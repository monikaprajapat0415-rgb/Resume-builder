import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';

const S1 = 'Node.js Basics';

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'what-is-nodejs-and-your-first-script', 'What Is Node.js? Install It and Run Your First Script', 'What Is Node.js? Install and First Script',
    'Learn what Node.js is, what it is used for, how to install it, and how to run JavaScript on your own computer outside the browser. Beginner friendly.', [
    P("JavaScript began as a language that runs inside web browsers. It made buttons click and menus open. **Node.js** takes the same language and lets it run on a computer or server, outside the browser. That one change means a person who knows JavaScript can also write the back end of a website: the part that stores data, checks passwords and answers requests from the front end."),
    P("Node.js is not a new language and it is not a framework. It is a **runtime**: a program that reads your JavaScript file and runs it. Under the hood it uses V8, the same engine that runs JavaScript in Chrome, plus a library of tools for things a browser does not allow, such as reading files, opening network connections and starting servers. In this course you will use Node.js to build a real back end, a small task API with login, step by step."),
    H("What people build with Node.js"),
    L("**Web servers and APIs** that a website or a mobile app talks to. This is what you will build.", "**Command line tools**, for example scripts that rename a thousand files or clean a spreadsheet export.", "**Build tools.** Many front end tools you may already use, such as Vite and webpack, run on Node.js.", "**Real-time apps** such as chat, using web sockets.", "**Automation and scheduled jobs**, such as sending a daily report."),
    P("Node.js is a good fit when your program spends most of its time waiting for things, such as the network or a database. It is less suited to heavy number crunching on a single thread, such as video editing. We will see why in the lesson on async code."),
    H("Install Node.js"),
    P("Go to the official website, nodejs.org, and download the version marked **LTS**. LTS means long-term support: it receives security fixes for a long time, so it is the safe choice for learning and for real projects. Run the installer and keep the default options. This course needs Node.js 20.11 or newer, and newer LTS versions are fine. If you already have Node.js, you only need to check the version."),
    P("Open a terminal. On Windows, use PowerShell or the Terminal app. On macOS, use Terminal. On Linux, use your usual terminal. Then type these two commands."),
    C('bash', `node -v
npm -v`),
    P("Each prints a version number such as `v22.12.0` for Node and `10.9.0` for npm. The numbers on your computer will probably be different, and that is fine. **npm** is Node's package manager. It comes with Node and downloads libraries that other people wrote. You will use it from the next lesson."),
    N("If the terminal says the command is not found, close it and open a new one. The installer changes your system path, and an old window does not see the change. If it still fails, run the installer again."),
    H("The REPL: try JavaScript instantly"),
    P("Type `node` on its own and press Enter. You get a prompt where you can type JavaScript and see the result straight away. This is called the REPL (read, evaluate, print, loop). It is great for quick experiments."),
    C('text', `> 2 + 3
5
> const prices = [120, 80, 650]
undefined
> prices.reduce((a, b) => a + b, 0)
850
> .exit`),
    P("Press Ctrl+C twice, or type `.exit`, to leave. The REPL is for testing small ideas. Real programs live in files."),
    H("Your first script"),
    P("Create a new folder called `taskapi` for the whole course, and open it in your editor (VS Code is a popular free choice). Create a file named `hello.js` with the code below."),
    C('js', code('lesson01-hello.js')),
    P("Run it from the terminal, in the same folder, and add two extra words after the file name."),
    C('bash', `node hello.js one two`),
    C('text', `Hello, Asha! You have studied for 3 hours.
Node is running
[ 'one', 'two' ]`),
    P("Look at what happened. `console.log` printed to the terminal instead of the browser console. The backtick string with `${name}` is a template string, which puts a variable inside text. And `process.argv` is a list of the words typed on the command line. We removed the first two entries with `slice(2)`, because those are the path to Node and the path to your script. `process` is a global object that Node gives you. It describes the running program."),
    H("What is different from the browser?"),
    L("There is **no** `window` and **no** `document`. A server has no web page. Code that touches the page, such as `document.getElementById`, will fail.", "There **is** a `process` object, a way to read files, and a way to start a server.", "Your code runs **once**, on your machine, and you control the version of Node. In a browser, your code runs on every visitor's device and version.", "The rest of the language is the same: variables, functions, arrays, objects, classes, promises, `async` and `await`."),
    P("Because the language is the same, you can already read most of the code in this course. The new part is the tools Node provides, and the habits of back-end work: validating input, handling errors and protecting data."),
    H("Where this course goes"),
    P("There are 15 lessons. First the basics: modules, files and async code. Then plain Node servers, then Express, a library that makes servers easier to write. Then you build and test a small task API with login, store data in a file and in MongoDB, protect it, and get it ready for a server. Every code sample in the course was run before it was written here."),
    ...task("Install the LTS version of Node.js and run `node -v` and `npm -v`.", "Create the folder `taskapi` and the file `hello.js`. Change the name and the number of hours.", "Run `node hello.js` with three words after it and check that all three appear in the list.", "Open the REPL, work out the total of three numbers with `reduce`, and leave with `.exit`."),
    ...check("`node -v` prints a version that starts with `v20` or higher.", "Running `node hello.js one two` prints your greeting and the list `[ 'one', 'two' ]`.", "You can explain in one sentence why `document` does not exist in Node.js."),
  ], A('From file to running program', [
    n('code', 'hello.js', 'your JavaScript', 0, 0, 'data'), n('node', 'Node.js', 'runtime, V8 engine', 1, 0, 'tool'),
    n('os', 'Your computer', 'files, network', 2, 0, 'app'), n('out', 'Terminal output', 'console.log', 3, 0, 'out'),
  ], [
    { say: 'You write a JavaScript file, such as hello.js.', on: ['code'] },
    { say: 'You run it with the node command. Node reads the file and runs it with the V8 engine.', flow: ['code>node:node hello.js'] },
    { say: 'Node can use your computer directly: files, the network and the command line.', flow: ['node>os:uses'] },
    { say: 'The results appear in the terminal, because console.log writes there and not in a browser.', flow: ['os>out:prints'] },
  ]), [
    faq('Is Node.js a programming language?', 'No. The language is JavaScript. Node.js is a runtime that runs JavaScript outside the browser and adds tools for files, networks and servers.'),
    faq('Which Node.js version should I install?', 'The current LTS (long-term support) version from nodejs.org. It gets security fixes for a long time. This course needs Node.js 20.11 or newer.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S1, 'modules-npm-and-package-json', 'Modules, npm and package.json Explained', 'Node.js Modules, npm and package.json',
    'Understand ES modules with import and export, how npm installs packages, what package.json and node_modules are, and how to add scripts to your project.', [
    P("As a program grows, you cannot keep everything in one file. A **module** is simply a file whose code you can use from other files. Node.js supports the same module system as modern browsers, called **ES modules**, with `import` and `export`. In this lesson you will split code into files, start a proper project with `package.json`, install your first package and add scripts."),
    H("Turn on ES modules"),
    P("Node can read two module styles. The older one, CommonJS, uses `require`. The newer one, ES modules, uses `import`. Most new code and most documentation now use `import`, so this course does too. To tell Node that your project uses it, create a `package.json` file. The easiest way is to let npm do it. Run this inside `taskapi`."),
    C('bash', `npm init -y
npm pkg set type=module`),
    P("`npm init -y` creates `package.json` with default answers. `npm pkg set type=module` adds one line, `\"type\": \"module\"`, which makes every `.js` file in the project an ES module. Without that line, using `import` gives an error such as *Cannot use import statement outside a module*."),
    H("Export and import"),
    P("Create `math.js`. It shares three things: a named function, a named constant, and a default export."),
    C('js', code('lesson02-math.js')),
    P("A file can have many **named** exports but only one **default** export. Now create `app.js` and use them."),
    C('js', code('lesson02-app.js')),
    C('bash', `node app.js`),
    C('text', `5 0.18 118
number`),
    P("Three rules to remember. First, named imports go inside curly braces and must match the exported names. A default import has no braces, and you choose any name for it. Second, for your own files you must write the **file extension**, `./math.js`, and not just `./math`. Browsers and bundlers sometimes let you skip it, but Node does not. Third, paths for your own files start with `./` or `../`. A name with no dot, such as `express`, means a package from `node_modules`."),
    N("The check on the last line, `typeof os.cpus().length`, prints `number` whatever your computer is, so the output is the same for everybody. Printing the real number of processor cores would differ per machine."),
    H("Built-in modules and the node: prefix"),
    P("Node ships with many modules that need no installation, such as `node:fs` for files, `node:path` for file paths, `node:os` for facts about the computer, `node:http` for servers, `node:crypto` for security tools and `node:test` for tests. Write the `node:` prefix when you import them, as in `import os from 'node:os'`. It shows the reader, and Node, that this is built in and not a package from the internet."),
    H("npm and packages"),
    P("Most real projects use packages that other people wrote and shared on the npm registry, a huge public library. To add one, use `npm install`. Try it with the package we will use later."),
    C('bash', `npm install express`),
    P("Three things happen. A folder named `node_modules` appears with the package and everything it needs. `package.json` gets a `dependencies` section that lists `express` with a version. And a file named `package-lock.json` records the exact versions installed, so every computer gets the same result."),
    L("**`node_modules`** can be huge. Never edit it by hand and never commit it to git. Add `node_modules` to `.gitignore`.", "**`package.json`** lists what your project needs. Commit it.", "**`package-lock.json`** locks exact versions. Commit it too.", "To rebuild `node_modules` on another computer, run `npm install` and npm reads the two files."),
    P("Some packages are needed only while you develop, such as test or formatting tools. Install those with `npm install --save-dev name`, and npm lists them under `devDependencies`. On a server, `npm install --omit=dev` skips them."),
    H("Version numbers"),
    P("A version such as `5.3.0` has three parts: major, minor and patch. A patch is a bug fix. A minor adds features without breaking old code. A major may break old code. In `package.json` you will see something like `^5.1.0`. The caret means npm may install newer minor and patch versions, but not a new major one. That protects you from surprise breaking changes while still receiving fixes."),
    H("npm scripts"),
    P("The `scripts` section of `package.json` holds short names for commands. Add these three. We will create the files they use in later lessons, so do not run them yet."),
    C('json', `"scripts": {
  "start": "node --env-file=.env server.js",
  "dev": "node --watch --env-file=.env server.js",
  "test": "node --test"
}`),
    P("Run `npm start` or `npm test` directly. Other names need `run`, for example `npm run dev`. The flag `--watch` restarts the program every time you save a file, so you do not need a separate tool. The flag `--env-file=.env` loads settings from a file named `.env`. You will meet it in lesson 11."),
    H("Safety with packages"),
    P("A package is code from strangers, and it runs with your permissions. Choose well-known packages with many users and recent updates. Read the name carefully, because fake packages with names that look like popular ones exist. Run `npm audit` now and then to see reported problems in what you have installed, and keep dependencies updated."),
    ...task("Run `npm init -y` and `npm pkg set type=module` in `taskapi`.", "Create `math.js` and `app.js` as shown and run `node app.js`.", "Change `TAX` to `0.05`, run again, and check that the price of 100 changes.", "Run `npm install express`, then look at `package.json` and the new files.", "Create `.gitignore` containing the line `node_modules`."),
    ...check("`node app.js` prints `5 0.18 118` and then `number`.", "`package.json` shows `\"type\": \"module\"` and a `dependencies` section with `express`.", "Deleting `node_modules` and running `npm install` brings it back."),
  ], A('Your project at a glance', [
    n('pkg', 'package.json', 'name, scripts, deps', 0, 0, 'data'), n('npm', 'npm install', 'downloads packages', 1, 0, 'tool'),
    n('mods', 'node_modules', 'library code', 2, 0, 'app'), n('app', 'Your files', 'import ... from', 3, 0, 'out'),
  ], [
    { say: 'package.json describes your project and lists the packages it needs.', on: ['pkg'] },
    { say: 'npm install reads that list and downloads the packages from the npm registry.', flow: ['pkg>npm:read list'] },
    { say: 'The packages are stored in the node_modules folder. Do not edit it and do not commit it.', flow: ['npm>mods:saves'] },
    { say: 'Your own files then load those packages and your other files with import.', flow: ['mods>app:import'] },
  ]), [
    faq('What is the difference between dependencies and devDependencies?', 'dependencies are needed to run the app. devDependencies are only for development, such as test tools. Install them with --save-dev.'),
    faq('Why must I write the file extension in imports?', 'In Node.js ES modules, import paths for your own files must include the extension, such as ./math.js. Without it, Node cannot find the file.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S1, 'files-paths-and-built-in-modules', 'Working with Files and Paths: fs, path and JSON', 'Read and Write Files in Node.js with fs',
    'Read and write files with node:fs/promises, build safe file paths with node:path, store data as JSON and handle errors such as a missing file.', [
    P("A browser page is not allowed to read files from your disk. Node.js is. That makes it good for tools that process files, and for small apps that save data in a file. In this lesson you will use two built-in modules, `node:fs/promises` to read and write files, and `node:path` to build file paths, and you will store data as JSON. The file store you write here is the same idea we use for the task API later."),
    H("Reading and writing a file"),
    P("The `fs` module has older callback functions and newer promise functions. Use the promise version, `node:fs/promises`. It works with `async` and `await`, which you will study in the next lesson. In ES modules you can use `await` at the top level of a file, so this works as it is."),
    C('js', code('lesson03-files.js')),
    C('bash', `node files.js`),
    C('text', `1 Learn Node
ENOENT ENOENT: no such file or directory, open `),
    P("Walk through it line by line. `writeFile` creates the file, or replaces it if it exists. `readFile` with the encoding `'utf8'` returns text, and without an encoding it returns raw bytes. `JSON.stringify(tasks, null, 2)` turns the array into text with two-space indentation, which is easy to read. `JSON.parse` turns the text back into JavaScript objects. The last part reads a file that does not exist, and the `catch` block shows the error. The text in the output above is cut short because the real message continues with the full path of the missing file, which is different on every computer."),
    H("Build paths with the path module"),
    P("Never join paths by hand with `'/'` or `'\\'`. Windows and Linux use different separators. `path.join` does it correctly for the system it runs on. And never depend on the **current folder**, which is wherever you started the program. If you run `node` from another folder, a path like `./tasks.json` points to a different place. Instead, build paths from the folder that contains the script."),
    L("`import.meta.dirname` is the folder of the current file. It is available in current Node versions (20.11 and newer).", "`path.join(import.meta.dirname, 'tasks.json')` builds a full path to a file beside your script.", "`path.extname('photo.png')` returns `.png`, and `path.basename('/a/b/c.txt')` returns `c.txt`.", "`path.resolve('data')` turns a relative path into an absolute one, starting from the current folder."),
    H("Error codes"),
    P("When a file operation fails, the error has a `code`. The most common are `ENOENT` (the file or folder does not exist), `EACCES` (no permission) and `EEXIST` (it already exists). Check `err.code` to decide what to do. A missing file at start-up is often fine, for example the first time the app runs, and the program should create an empty list. Any other error should stop the program or be reported."),
    C('js', `async function loadTasks(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];   // first run: no file yet
    throw err;                              // anything else is a real problem
  }
}`),
    P("The last line, `throw err`, passes the problem on instead of hiding it. Silent failures are the hardest bugs to find."),
    H("Other useful file functions"),
    L("`readdir(folder)` lists the names inside a folder.", "`mkdir(folder, { recursive: true })` creates a folder and any missing parent folders, and does nothing if it already exists.", "`appendFile(file, text)` adds text to the end of a file. It suits simple logs.", "`rename`, `copyFile` and `rm` move, copy and delete files. Be careful with `rm`: it does not use a recycle bin.", "`stat(file)` returns information such as size and last modified time."),
    H("Limits of storing data in a file"),
    P("A JSON file is a very good way to learn, and it is fine for a tiny personal tool. But it has real limits. The whole file must be rewritten on every change. If two requests write at the same moment, one change can be lost. It cannot search large data quickly. And if the program crashes in the middle of writing, the file can be left half written. Databases solve these problems. Later in this course you will use a file first, because it is simple, and then MongoDB."),
    N("Never save passwords, tokens or secrets as plain text in a file that is committed to git or served to the public. We will deal with secrets properly in lesson 11."),
    ...task("Create `files.js` as shown and run it. Open `tasks.json` in your editor and look at it.", "Add a second task to the array and run again. Check that the file has two tasks.", "Write a function `loadTasks(file)` that returns an empty list when the file is missing, and test it with a file name that does not exist.", "Use `appendFile` to write a line with the current date and time to `log.txt` each time the script runs."),
    ...check("`node files.js` prints `1 Learn Node` and then an `ENOENT` line.", "`tasks.json` contains your tasks with two-space indentation.", "`loadTasks('nothing.json')` returns `[]` instead of crashing."),
  ], A('Saving and loading data', [
    n('obj', 'JS object', 'tasks array', 0, 0, 'data'), n('json', 'JSON text', 'JSON.stringify', 1, 0, 'tool'),
    n('file', 'tasks.json', 'writeFile', 2, 0, 'app'), n('back', 'Objects again', 'readFile + parse', 3, 0, 'out'),
  ], [
    { say: 'Your data lives in memory as JavaScript objects and arrays.', on: ['obj'] },
    { say: 'JSON.stringify turns it into text that can be saved.', flow: ['obj>json:stringify'] },
    { say: 'writeFile saves the text in a file on disk.', flow: ['json>file:writeFile'] },
    { say: 'Later, readFile and JSON.parse bring the data back as objects.', flow: ['file>back:readFile'] },
  ]), [
    faq('What does ENOENT mean?', 'It means the file or folder does not exist. It is the usual error code when you read a missing file.'),
    faq('Why use path.join instead of joining strings?', 'path.join uses the right separator for the operating system and cleans up extra slashes, so the same code works on Windows, macOS and Linux.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S1, 'async-javascript-promises-and-event-loop', 'Async JavaScript in Node: Promises, async/await and the Event Loop', 'Async Node.js: Promises, await, Event Loop',
    'Understand why Node.js is asynchronous, how promises and async/await work, how to handle errors, run tasks in parallel and avoid blocking the event loop.', [
    P("Almost everything useful in a server takes time: reading a file, asking a database, calling another service. If the program stopped and waited for each one, a single slow request would freeze every other visitor. Node.js avoids this with **asynchronous** code. This lesson is the most important idea in the whole course, so take your time."),
    H("One thread and an event loop"),
    P("Your JavaScript runs on a single thread, which means one line at a time. But slow work, such as file and network operations, is handed to the operating system. While the system works, Node carries on with other code. When the work is done, the result is put in a queue, and the **event loop** takes it from the queue and runs your code that was waiting for it. Think of a waiter in a restaurant. The waiter does not stand at the kitchen door until your meal is ready. They take your order, serve other tables, and bring your food when the kitchen calls."),
    P("This design handles thousands of waiting connections with little memory. The price is one rule: **never block the thread** with long work. If you run a loop that takes five seconds, no other request is answered for five seconds."),
    H("Promises"),
    P("A **promise** is an object that stands for a value that is not ready yet. It is in one of three states: pending, fulfilled (with a value) or rejected (with an error). You attach code to it with `.then` for success and `.catch` for failure. Most modern Node functions, including `fs/promises` and `fetch`, return promises."),
    H("async and await"),
    P("`async` and `await` let you write promise code that reads from top to bottom. Putting `await` before a promise pauses **that function** until the promise settles, and gives you the value. The program as a whole is not paused: other work continues. You can use `await` only inside an `async` function, or at the top level of an ES module file. Run this example."),
    C('js', code('lesson04-async.js')),
    C('bash', `node async.js`),
    C('text', `1 start
2 end of script
2.5 promise
3 timer
{ id: 1, name: 'Asha' }
caught: No user 2
parallel ok true Asha Asha`),
    P("Study the order of the first four lines. The code runs from top to bottom: line `1`, then it schedules a timer and a promise, then line `2`. Only after the main script finishes does Node run the waiting work. Promise callbacks run **before** timer callbacks, even a timer set to zero milliseconds. This surprises many beginners, and you do not need to memorise it. Just remember that async results never appear in the middle of your current code."),
    H("Handling errors"),
    P("When an awaited promise is rejected, `await` throws the error, and you catch it with an ordinary `try` and `catch`, as shown with `getUser(2)`. If you forget, an unhandled rejection can crash your program or leave a request hanging. Two habits help: use `try` and `catch` where you can do something useful about the error, and let other errors travel upwards to one central place. In Express, that central place is an error handler, which you will build in lesson 10."),
    H("Sequential or parallel?"),
    P("Two awaits one after the other run one after the other. If the two tasks do not depend on each other, start both first and wait for both together with `Promise.all`. In the example, two 50 ms calls finish in about 50 ms in total, not 100 ms. If one promise in `Promise.all` rejects, the whole thing rejects. Use `Promise.allSettled` when you want every result, whether it worked or failed."),
    C('js', `// slower: one after the other
const a = await getUser(1);
const b = await getUser(2);

// faster when independent: both at once
const [x, y] = await Promise.all([getUser(1), getUser(1)]);`),
    H("A common mistake: forgetting await"),
    P("If you forget `await`, you get a promise object instead of the value. You will see output such as `Promise { <pending> }`, and a later line fails with an odd error. When a value looks strange, check that every async call has `await`. Another mistake is using `await` inside `forEach`. The loop does not wait. Use a `for...of` loop, or `Promise.all` with `map`."),
    H("Do not block the event loop"),
    L("Avoid long synchronous work in request code, such as huge loops or reading a big file with `readFileSync`.", "Functions ending in `Sync` block the thread. They are fine in a start-up script, but not while serving requests.", "For truly heavy computing, use worker threads or a separate service."),
    N("You do not need to understand every detail of the event loop to write good Node code. The practical rules are: use `await` for slow work, use `Promise.all` for independent work, catch errors, and never run long loops inside a request."),
    ...task("Create `async.js` and run it. Predict the order of the first four lines before you run it.", "Add `getUser(3)` and `getUser(4)` inside `Promise.all` and measure the time with `Date.now()`.", "Change `Promise.all` to `Promise.allSettled` and print the results. Make one of the calls fail on purpose.", "Remove one `await` on purpose and see what is printed. Then put it back."),
    ...check("The first four lines print in the order `1`, `2`, `2.5`, `3`.", "The parallel version takes about 50 ms, not 100 ms, and prints `parallel ok true`.", "You can say what `await` does in your own words."),
  ], A('The event loop in action', [
    n('code', 'Your code', 'runs one line at a time', 0, 0, 'user'), n('os', 'System work', 'files, network, timers', 1, 0, 'tool'),
    n('queue', 'Queue', 'finished results wait', 2, 0, 'data'), n('loop', 'Event loop', 'runs waiting code', 3, 0, 'app'),
  ], [
    { say: 'Your code runs on one thread. When it asks for slow work, it does not wait.', on: ['code'] },
    { say: 'The slow work is handed to the system, such as reading a file or waiting for the network.', flow: ['code>os:start'] },
    { say: 'When the work is done, its result is put in a queue.', flow: ['os>queue:done'] },
    { say: 'The event loop takes results from the queue and runs the code that was waiting, such as the code after await.', flow: ['queue>loop:next'] },
  ]), [
    faq('Is Node.js single-threaded?', 'Your JavaScript runs on one thread, but slow work like file and network operations is done by the system and its results come back through the event loop. Heavy computing can still block it.'),
    faq('When should I use Promise.all?', 'When you have several independent async tasks. Start them together and wait for all, which is faster than awaiting them one after the other.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S1, 'your-first-http-server-with-node', 'Your First HTTP Server with Plain Node.js', 'Build a Plain Node.js HTTP Server',
    'Learn how HTTP requests and responses work and build a small server with node:http. See why frameworks like Express exist and how to test with curl.', [
    P("Before using Express, it is worth building one tiny server with only what Node provides. It takes five minutes, and afterwards Express will make sense, because you will see the work that it does for you. In this lesson you will learn how a web request is structured, write a server with the built-in `node:http` module and test it with `curl`."),
    H("What happens in a web request"),
    P("HTTP is the conversation between a client, such as a browser, a phone app or `curl`, and a server. The client sends a **request**: a **method** (what to do), a **path** (which thing), headers (extra information) and sometimes a body (data). The server sends back a **response**: a **status code** (how it went), headers and usually a body. Learn these methods first."),
    L("**GET** reads data. It should not change anything.", "**POST** creates something new, usually with data in the body.", "**PUT** and **PATCH** change something that exists. PUT replaces it, PATCH changes part of it.", "**DELETE** removes something."),
    P("And these status codes. The first digit tells the story: 2 means success, 3 means redirect, 4 means the client made a mistake, and 5 means the server had a problem."),
    L("**200 OK**: it worked. **201 Created**: something new was made. **204 No Content**: it worked and there is nothing to send back.", "**400 Bad Request**: the request data is wrong. **401 Unauthorized**: log in first. **403 Forbidden**: you are logged in but not allowed. **404 Not Found**: no such thing.", "**429 Too Many Requests**: slow down. **500 Internal Server Error**: the server broke."),
    H("A server in a few lines"),
    P("Create `server.js` in a new folder, or in `taskapi` for this lesson."),
    C('js', code('lesson05-server.js')),
    P("`http.createServer` takes a function that runs for **every** request. It receives `req`, which describes the request, and `res`, which you use to answer. `res.writeHead` sets the status code and headers, and `res.end` sends the body and finishes the response. `server.listen(3000)` starts waiting for connections on port 3000. A port is like a door number on your computer. Run it."),
    C('bash', `node server.js`),
    C('text', `Listening on http://localhost:3000`),
    P("The program does not finish. It keeps running and waiting for requests. Leave it running, open a **second** terminal, and test it with `curl`, a command line tool for making requests. Windows 10 and 11, macOS and most Linux systems include it. Or just open the address in a browser."),
    C('bash', `curl http://localhost:3000/
curl http://localhost:3000/api/time
curl -i http://localhost:3000/nope`),
    C('text', `Hello from plain Node
{"iso":"2026-10-28T04:00:00.000Z"}
HTTP/1.1 404 Not Found
...
{"error":"Not found"}`),
    P("The time in your output will be the time on your computer. The `-i` flag makes curl print the status line and headers as well. Stop the server with Ctrl+C in the first terminal."),
    N("If you see an error saying the address is already in use (`EADDRINUSE`), another program, or an old copy of your server, is using port 3000. Stop it, or change the number."),
    H("Why people use Express"),
    P("Look at what you had to do by hand. You compared `req.method` and `req.url` with an `if` chain. You set the content type each time. You turned objects into JSON text yourself. For a real API, you would also have to read the request body in pieces, parse the JSON, split the query string from the path, pull out values from URLs such as `/api/tasks/7`, handle errors in one place and check logins. That is a lot of repeated, easy-to-get-wrong code."),
    P("Express is a small, popular library that handles all this for you. It is built directly on `node:http`, so everything you learned here still applies. In the next lesson you will build the same server in about half the lines."),
    H("Do not leave the server open to the world"),
    P("By default, a server started on your own computer is reachable from your own machine, and on some systems also from the local network, depending on your firewall. While learning, that is fine. Do not put real passwords or private data into a practice server, and never expose a practice server to the internet."),
    ...task("Create `server.js` and start it. Test all three URLs with curl or the browser.", "Add a route `GET /api/hello` that returns `{ \"message\": \"Hello\" }` as JSON.", "Change the port to 3010 and test again.", "Use `curl -i` and find the status code and the `Content-Type` header of each response."),
    ...check("`curl http://localhost:3000/` prints `Hello from plain Node`.", "An unknown path returns status 404 and a JSON error.", "You can name one thing Express would do for you that you wrote by hand here."),
  ], A('One request, one response', [
    n('client', 'Client', 'browser, app, curl', 0, 0, 'user'), n('req', 'Request', 'GET /api/time', 1, 0, 'data'),
    n('server', 'Your server', 'createServer', 2, 0, 'app'), n('res', 'Response', '200 + JSON', 3, 0, 'out'),
  ], [
    { say: 'A client, such as a browser, a phone app or curl, wants some data.', on: ['client'] },
    { say: 'It sends a request with a method and a path, for example GET /api/time.', flow: ['client>req:sends'] },
    { say: 'Your server function runs for the request and decides what to answer.', flow: ['req>server:arrives'] },
    { say: 'It sends a response with a status code and a body, and the client shows or uses it.', flow: ['server>res:answers'] },
  ]), [
    faq('What is the difference between 401 and 403?', '401 means the client is not logged in or has no valid login. 403 means the client is logged in but is not allowed to do that action.'),
    faq('Do I need Express to build a server?', 'No. node:http is enough, but you must write much repeated code for routing, JSON bodies and errors. Express removes most of that.'),
  ]),
];
