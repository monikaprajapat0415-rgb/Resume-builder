import { P, H, L, O, N, C, S, task, check, lesson } from './helpers.js';

const S1 = 'Foundations';

export const lessons = [
  // ------------------------------------------------------------ 1
  lesson(S1, 'what-is-the-mern-stack', 'What Is the MERN Stack? How a Web Request Travels', 'What MongoDB, Express, React and Node.js each do, how they fit together, and a runnable script that follows one request from the browser to the database and back.', '', [
    P("The MERN stack is a popular way to build a complete web application using one language, JavaScript, from the screen the visitor sees to the database that keeps the data. The four letters are four tools: **M**ongoDB, **E**xpress, **R**eact and **N**ode.js. In this course you will use all four to build a real application, a job tracker where a person signs in, adds the jobs they applied for, searches and filters them, attaches the resume they sent, and sees simple numbers about their search. At the end you will put it on a server on the internet."),
    P("You do not need to know any of the four tools yet. You do need to be able to read basic JavaScript: variables, functions and objects. The next three lessons refresh the parts of modern JavaScript that every MERN app uses, so if you are rusty, you are in the right place. Every lesson comes with the exact source code for that point in the project, as a zip you can download from the top of the lesson, so you can always compare your work with a working copy."),

    H("The four parts and what each one is for"),
    L(
      "**React** runs in the visitor's browser. It draws the screens: lists, forms, buttons. It does not store anything permanently, because everything in the browser can be closed, cleared or changed by the visitor.",
      "**Node.js** is JavaScript running on a server, outside the browser. It is the engine that runs your back end code.",
      "**Express** is a small library that sits on top of Node.js. It receives requests such as “give me my jobs” and lets you write the code that answers them. A group of such answers is called an **API**.",
      "**MongoDB** is the database. It keeps the information safely on disk: people, jobs, notes. The server asks it for data and tells it what to save.",
    ),
    P("People often call React the **front end** and Node.js with Express the **back end**. The database is a third layer behind the back end. The important rule is this: the browser never talks to the database directly. It talks to your API, and your API talks to the database. That gap is where you check who the person is, what they are allowed to do, and whether the data they sent makes sense."),

    H("The journey of one request"),
    P("Suppose a signed-in person opens the “My jobs” page. Here is what happens, step by step."),
    O(
      "The browser loads the React app, which is just JavaScript, HTML and CSS files. React draws the page frame and shows “Loading…”.",
      "React calls `fetch('/api/jobs')`. This is an **HTTP request**: a message with a method (`GET`), a path (`/api/jobs`) and some headers, one of which says who is asking.",
      "The request travels over the internet to your server, where Node.js is listening. Express looks at the method and path and picks the matching route.",
      "The route checks the headers, finds the person, and asks MongoDB: “find the jobs that belong to this person”.",
      "MongoDB returns the documents. Express turns them into **JSON**, a text format both sides understand, and sends an **HTTP response** with a status code such as `200`.",
      "React receives the JSON, saves it in its state, and draws one card for every job. Loading is gone, jobs are on the screen.",
    ),
    P("Every feature in this course is a variation on this journey. Adding a job sends data the other way. Signing in sends an email and a password and gets back a token. Uploading a resume sends a file. Once the journey is clear in your head, MERN stops looking like four separate technologies and becomes one idea repeated."),

    H("See it run: a request in 40 lines"),
    P("Before installing anything, run this script. It uses only Node.js. It plays all three roles: a “database” (an array), a “server” (Node's built-in `http` module) and a “browser” (the built-in `fetch`). Each one prints what it is doing, so you can read the journey in your terminal."),
    S(1, 'examples/01-request-flow/trace.js'),
    P("The output follows the same order as the list above: the browser calls, the server receives, the database answers, the server replies, the browser draws a card for every job. In the real project the “database” becomes MongoDB, the “server” becomes Express (which saves you from writing the routing by hand), and the “browser” part becomes React components. Nothing else about the shape changes."),

    H("Why use the same language everywhere?"),
    P("Using JavaScript on both sides has real, practical benefits for a learner. You learn one language instead of three. You can move code between the two sides, such as a function that checks an email address. The data you send, JSON, is already JavaScript's own format, so there is no translation step. And the huge package ecosystem, npm, serves both sides."),
    P("It is also fair to say what MERN is not. It is not the only good choice, and it is not always the best one: large teams often prefer TypeScript, a SQL database, or a framework such as Next.js. The ideas you learn here carry over to all of them: routes, middleware, schemas, tokens, state, effects and deployment are the same ideas with different names."),
    N("A word about versions. Libraries change. This course uses Node.js 20 or newer, Express 5, Mongoose 9, React 19 and Vite 7, and the zips pin those versions in `package.json`. If a command in a lesson fails on your machine, check the version first."),

    ...task(
      "Download the solution zip for this lesson and unzip it.",
      "Open a terminal in the unzipped folder and run `node examples/01-request-flow/trace.js`.",
      "Change the `database` array: add a third job. Run the script again and check that a third card line appears.",
      "Add a new route in the script: `GET /api/jobs/count` that answers `{ count: 3 }`, and call it with a second `fetch`. This is your first API route.",
    ),
    ...check(
      "You see lines tagged `[browser]`, `[server]` and `[database]` in the order of the journey.",
      "The browser line says `got status 200` and the right number of jobs.",
    ),
    H("Summary"),
    L("React draws screens in the browser. Express on Node.js answers requests. MongoDB stores data.", "The browser never talks to the database. It talks to your API.", "Every feature is a request and a response with a status code, usually carrying JSON."),
  ], [
    { q: 'Do I need to know React or Node.js before this course?', a: 'No. You need basic JavaScript. The course teaches Node.js, Express, MongoDB and React from the start, and the next three lessons refresh the modern JavaScript you will use.' },
    { q: 'Is the MERN stack still worth learning?', a: 'Yes, as a way to learn how complete web applications work. The ideas (routes, middleware, schemas, tokens, components, state) apply to other stacks too. Which stack suits a job depends on the employer, so check the job adverts in your area.' },
    { q: 'Why does the browser not talk to MongoDB directly?', a: 'Anything in the browser can be read and changed by the visitor. Your API is the place where you check who is asking and whether the request is allowed and valid. Database passwords must never be in browser code.' },
  ], 'mern stack, what is mern, mern stack tutorial, mongodb express react node'),

  // ------------------------------------------------------------ 2
  lesson(S1, 'set-up-your-tools-for-mern', 'Set Up Your Tools: Node.js, npm, Git, VS Code and MongoDB', 'Install and check everything you need for the MERN course on Windows, macOS or Linux, with a script that tells you what is missing.', '', [
    P("A good setup saves hours later. This lesson lists exactly what to install, why, and how to check that it works. Nothing here is difficult, but small mistakes, such as an old version of Node.js, cause confusing errors later, so it is worth ten careful minutes now."),

    H("What you need"),
    L(
      "**Node.js 20 or newer** (the current LTS version is the safest choice). It runs your server and also the tools that build the React app. Download it from nodejs.org. It includes **npm**, the package manager.",
      "**A code editor.** Visual Studio Code is free and works well, but any editor is fine. Useful extensions: ESLint, Prettier and REST Client (we use it in lesson 13).",
      "**Git**, to save versions of your work and to deploy at the end. Install it from git-scm.com.",
      "**A modern browser** with developer tools: Chrome, Edge or Firefox. Press F12 to open them. You will use the Network and Console tabs often.",
      "**A MongoDB database** (lesson 14 shows both options: a free cloud database on Atlas, or MongoDB Community Edition on your computer). You do not need it yet.",
    ),
    H("Check your installation with a script"),
    P("Instead of typing three commands and reading three outputs, run the small script from the lab. It asks your computer for the versions of Node.js, npm and Git, and tells you what to fix."),
    S(2, 'examples/02-setup/check-setup.js'),
    P("Notice what the script does: `process.versions.node` is information Node.js gives about itself, and `execSync('npm -v')` runs a command exactly as if you had typed it in the terminal. You will use both ideas again."),

    H("Using the terminal"),
    P("You will type commands in a terminal for most of this course. On Windows use PowerShell or the terminal inside VS Code; on macOS and Linux use Terminal. The few commands you need on day one:"),
    L("`cd folder-name` moves into a folder, and `cd ..` moves up one level.", "`ls` (macOS and Linux) or `dir` (Windows) lists the files in the current folder.", "`node file.js` runs a JavaScript file.", "`npm install` downloads the packages listed in `package.json` into a `node_modules` folder.", "Ctrl + C stops a running program. You will use this every day."),
    N("Never commit `node_modules/` or `.env` files to Git. The `.gitignore` file in the lab already lists them. Secrets that reach Git history are very hard to take back."),

    H("Folder habits that help"),
    P("Keep the project in a folder whose path has no spaces or special characters, for example `C:\\projects\\mern-job-tracker` or `~/projects/mern-job-tracker`. Unzip each lesson's solution into a new folder rather than over your own work, so you can compare the two with your editor's “compare files” tool. When you are not sure why your code behaves differently from the lesson, comparing against the zip is the fastest way to find the one line that differs."),

    ...task(
      "Install Node.js (LTS), Git and VS Code.",
      "Unzip this lesson's solution and run `node examples/02-setup/check-setup.js`.",
      "Fix every line that says `UPGRADE` or `MISSING`, then run it again until it says you are ready.",
      "Run `git config --global user.name \"Your Name\"` and `git config --global user.email \"you@example.com\"` so your commits carry your name.",
    ),
    ...check("Each tool shows `OK` and the script ends with “You are ready for lesson 3.”", "`node -v` prints v20 or higher."),
    H("Summary"),
    L("You need Node.js 20+, an editor, Git and a browser. MongoDB comes in lesson 14.", "The terminal runs your programs; Ctrl + C stops them.", "Keep secrets and `node_modules` out of Git."),
  ], [
    { q: 'Which Node.js version should I install?', a: 'The current LTS (long term support) version, as long as it is version 20 or newer. LTS versions get fixes for longer and work with all the libraries in this course.' },
    { q: 'Can I use Windows for this course?', a: 'Yes. Everything works on Windows, macOS and Linux. Use PowerShell or the VS Code terminal on Windows. Commands that differ are noted in the lessons.' },
    { q: 'Do I need to pay for MongoDB?', a: 'No. MongoDB Community Edition is free to run on your own computer, and MongoDB Atlas has a free tier that is enough for this course. Check the Atlas site for the current limits.' },
  ], 'install node js, npm setup, vs code for mern, mern development environment'),

  // ------------------------------------------------------------ 3
  lesson(S1, 'modern-javascript-for-mern', 'Modern JavaScript You Need: let, const, Arrow Functions, Destructuring and Modules', 'The parts of modern JavaScript used in every MERN app, explained one by one, with a tour script you can run and change.', '', [
    P("MERN code is written in the JavaScript of the last ten years, often called ES6 or ES2015+. If you learned JavaScript from older tutorials, some of the syntax will look new. Everything below appears again and again in the server and in React, so it is worth meeting it once, calmly, before the project starts."),
    P("Run the tour file after reading each section and change values to see what happens. Learning by changing working code is faster than only reading."),

    H("const and let, never var"),
    P("`const` makes a variable that cannot be assigned again. `let` makes one that can. Use `const` by default and `let` only when the value must change, such as a counter. A `const` object can still be changed inside (you can add a property), but you cannot point the name at a different object. The old `var` has confusing scope rules, so modern code never uses it."),
    H("Template strings and objects"),
    P("Back ticks create template strings, which can hold values: `` `Applied to ${company}` ``. Objects group related values, and **shorthand** lets you write `{ role }` instead of `{ role: role }` when the variable has the same name. You will write this constantly when building API responses."),
    H("Destructuring and spread"),
    P("**Destructuring** pulls values out of objects and arrays into variables in one line: `const { role, salary: { max } } = job`. In React you will write `function JobCard({ job, onStatusChange })`, which is destructuring of the props object right in the parameter list."),
    P("**Spread** (`...`) copies the contents of an object or array into a new one. `{ ...job, status: 'interview' }` is a new object with all the old fields and a changed status, and the original is untouched. This matters a great deal: React state must be replaced, not edited in place, and spread is how you do it."),
    H("Arrow functions and array methods"),
    P("An arrow function is a short function: `(j) => j.status === 'applied'`. Combined with the array methods `map`, `filter`, `find` and `reduce`, it replaces most `for` loops. `map` turns every item into something else (a list of jobs into a list of cards), `filter` keeps some items, `find` returns the first match, and `reduce` folds a list into one value, such as counts per status."),
    H("Optional chaining and defaults"),
    P("`maybe.company?.name` returns `undefined` instead of crashing when `company` is missing. `??` gives a default only when the left side is `null` or `undefined`: `name ?? 'unknown'`. The older `||` replaces every falsy value, including `0` and an empty string, which is a common source of bugs, for example when a salary of 0 is replaced by a default."),
    H("Modules: import and export"),
    P("Each file is a module. `export` makes something available to other files, and `import` brings it in. In Node.js, use `\"type\": \"module\"` in `package.json` (the server in this course does) and write the `.js` extension in relative imports: `import { formatSalary } from './helpers.js'`."),
    H("The tour"),
    S(3, 'examples/03-javascript/es6-tour.js'),
    S(3, 'examples/03-javascript/helpers.js'),
    P("Run it with `node examples/03-javascript/es6-tour.js`. Read the output next to the code. Pay attention to the line that prints `undefined interview`: it proves that spread made a copy, because the original `job` still has no status."),

    ...task(
      "Run the tour and read each printed line against the code that produced it.",
      "Use `filter` and `map` together to print only the roles of jobs whose status is `applied`.",
      "Use `reduce` to total the `salary.max` of an array of three jobs.",
      "Write a function `withStatus(job, status)` that returns a copy of the job with a new status and never changes the original. Check that the original is unchanged.",
    ),
    ...check("`node` runs the file with no errors.", "Your `withStatus` returns a new object and the original job still has its old status."),
    H("Summary"),
    L("`const` by default, `let` when needed, never `var`.", "Destructuring takes values out; spread copies values in. Together they make non-mutating updates easy.", "`map`, `filter`, `find` and `reduce` replace most loops.", "Use `?.` and `??` for safe reads and honest defaults."),
  ], [
    { q: 'What is the difference between == and ===?', a: '`===` compares value and type without converting, so `1 === "1"` is false. `==` converts first and gives surprising results. Use `===` everywhere.' },
    { q: 'Why does React need me to copy objects instead of changing them?', a: 'React decides whether to redraw by checking if state is a new value. If you edit an object in place, the reference is the same and React may not notice. Spread creates a new object, so React sees the change.' },
    { q: 'Do I need to learn classes and prototypes first?', a: 'Not for this course. Modern React uses function components, and the server code here uses plain functions and modules. Classes are useful to know later.' },
  ], 'es6 tutorial, modern javascript, destructuring, spread operator, arrow functions, javascript modules'),

  // ------------------------------------------------------------ 4
  lesson(S1, 'asynchronous-javascript-promises-async-await', 'Asynchronous JavaScript: Callbacks, Promises, async/await and fetch', 'Why JavaScript does not wait, how promises and async/await work, how errors are caught, and how to run requests in parallel, with a script you can run.', '', [
    P("Some things take time: reading a file, calling a database, asking another server for data. JavaScript has one main thread, so if it waited for each slow task, everything else, including the page or the server, would freeze. Instead it starts the task, carries on, and comes back when the result is ready. This is **asynchronous** programming, and every MERN app is full of it: each database query, each API call and each file upload is asynchronous."),

    H("Callbacks: the first idea"),
    P("A **callback** is a function you give to something else to call later. `setTimeout(() => console.log('done'), 100)` means: run this function in 100 milliseconds. Callbacks work, but when one slow task depends on the result of another, you end up nesting them deeper and deeper, which is hard to read and hard to handle errors in."),
    H("Promises: a value that arrives later"),
    P("A **promise** is an object that stands for a result that is not ready yet. It is in one of three states: pending, fulfilled (it has a value), or rejected (it has an error). You attach handlers with `.then()` for success and `.catch()` for errors, and you can chain them. Most libraries you will use, including `fetch` and Mongoose, return promises."),
    H("async and await: promises that read like normal code"),
    P("Putting `async` in front of a function lets you use `await` inside it. `await` pauses that function (not the whole program) until the promise settles, then gives you the value. Errors become normal exceptions, so you catch them with `try / catch`. Compare the code in the file below: it does the same thing three ways."),
    S(4, 'examples/04-async/async-tour.js'),
    P("Run it and read the output order carefully. The promise result prints before the callback, because the promise takes 50 ms and the callback 100 ms. Understanding that things finish in the order of their delays, not in the order you wrote them, is the key idea of this lesson."),
    H("Run tasks at the same time"),
    P("If two things do not depend on each other, do not `await` them one after the other. `await Promise.all([a(), b()])` starts both at once and waits for both, so the total time is the slower of the two instead of the sum. You will use this pattern in lesson 18 to fetch a page of jobs and the total count in one go."),
    H("fetch: calling an API"),
    P("`fetch(url)` is built into every modern browser and into Node.js 18 and newer. It returns a promise of a **Response**. Two details trip up almost every beginner. First, `fetch` only rejects when the network fails; a `404` or `500` answer is still a successful fetch, so you must check `response.ok` yourself. Second, reading the body is also asynchronous: `await response.json()`. The tour file shows the whole sequence."),
    N("The most common async bug: forgetting `await`. The code then holds a promise instead of the value, and prints `Promise { <pending> }` or silently skips the work. When a value looks strange, check that you awaited it."),
    ...task(
      "Run the tour and note the order of the printed lines.",
      "Change the delay in the callback to 10 ms and run it again. Which line moves, and why?",
      "Write an `async` function `loadTwo()` that uses `Promise.all` to load two jobs, and time it with `console.time`. Then do it again with two separate awaits and compare the times.",
      "Make `fetch` fail on purpose by calling a port nothing listens on, and catch the error with `try / catch`.",
    ),
    ...check("You can predict the order of the output before you run the file.", "Your parallel version takes about as long as one request, not two."),
    H("Summary"),
    L("Slow tasks do not block JavaScript. They finish later and hand back a result.", "Promises represent that result; `async` and `await` make them readable.", "`try / catch` handles errors; `Promise.all` runs independent tasks together.", "`fetch` does not reject on 404 or 500; check `response.ok`."),
  ], [
    { q: 'Is async code the same as running things on several threads?', a: 'No. JavaScript runs your code on one thread. The waiting for files, networks and databases happens outside it, and your code continues when the result is ready.' },
    { q: 'When should I use Promise.all?', a: 'When tasks do not depend on each other, such as loading a list and a count. If one needs the result of the other, await them in order. Note that Promise.all rejects as soon as any one of them fails.' },
    { q: 'Why does fetch not throw an error for a 404?', a: 'Because from the network\'s point of view the request worked: the server answered. You decide what a 404 or 500 means in your app by checking response.ok or response.status.' },
  ], 'javascript promises, async await tutorial, javascript fetch, asynchronous javascript'),

  // ------------------------------------------------------------ 5
  lesson(S1, 'http-json-and-rest-basics', 'HTTP, JSON and REST: Methods, Status Codes and Routes', 'How HTTP requests and responses are built, what the methods and status codes mean, how REST organises an API, and a REST server written with no libraries.', '', [
    P("An API is a set of agreements: which addresses exist, what you can send to each, and what you get back. Almost all web APIs today follow the same conventions, called **REST**, which sit on top of **HTTP**. If you learn those conventions once, every API you meet will feel familiar, and your own API will be easy for others (and for your React app) to use."),

    H("An HTTP request"),
    P("A request has a **method** that says what you want to do, a **path** that says which thing you mean, **headers** that carry extra information, and sometimes a **body** that carries data. A response has a **status code**, headers and sometimes a body. The two are always a pair: one request, one response."),
    H("The methods"),
    L("`GET` reads data. It must never change anything. Browsers and caches rely on that.", "`POST` creates something new, with the data in the body.", "`PUT` replaces or changes something that exists. (`PATCH` is for partial changes; this course uses `PUT` for both to keep the API small.)", "`DELETE` removes something."),
    H("Status codes you will use"),
    L(
      "**200 OK**: it worked. **201 Created**: a new thing was made. **204 No Content**: it worked and there is nothing to send back (usual for delete).",
      "**400 Bad Request**: the data you sent is wrong. **401 Unauthorized**: we do not know who you are. **403 Forbidden**: we know you, but you may not do this. **404 Not Found**: no such thing. **409 Conflict**: it clashes with something that exists, such as an email already registered. **413 Payload Too Large**: a file or body is too big.",
      "**500 Internal Server Error**: a bug on our side. The first digit is the family: 2 means success, 4 means the client made a mistake, 5 means the server did.",
    ),
    P("Choosing the right code is part of good API design. A React app can then react correctly: show field errors on 400, send the person to the login page on 401, and show “not found” on 404."),

    H("JSON"),
    P("JSON is the text format for the body. It looks like a JavaScript object, but keys must be in double quotes and there are no functions or comments. `JSON.stringify(object)` makes text; `JSON.parse(text)` makes an object. Send the header `Content-Type: application/json` so the receiver knows how to read the body."),
    H("REST: nouns in the path, verbs in the method"),
    P("REST names things, not actions. The path says *what* (`/api/jobs` or `/api/jobs/42`), and the method says *what to do with it*. So you do not make a path like `/api/getAllJobs` or `/api/deleteJob`; you use `GET /api/jobs` and `DELETE /api/jobs/42`. Collections are plural nouns, and one item is the collection plus an id. This is the shape of the API you will build."),
    S(5, 'examples/05-http-rest/rest-without-express.js'),
    P("This file is a complete REST server using only Node.js. Read it twice. Notice how much code goes into reading the body, matching the path with a regular expression and setting the status and headers. Express (lesson 9) removes almost all of that work, and the logic of each route stays the same. Seeing the long way once makes you appreciate, and understand, what the library does."),
    ...task(
      "Run the server with `node examples/05-http-rest/rest-without-express.js`.",
      "In a second terminal, run the four `curl` commands from the comment at the top, one by one. Use `-i` so you see the status line and headers.",
      "Send a `POST` with an empty body and confirm you get `400` and a message.",
      "Add a `PUT /api/jobs/:id` route that changes `company` and `role`, and returns `404` for an unknown id.",
    ),
    ...check("`GET` returns the list with status 200.", "The `POST` returns 201 and the new job with an id.", "Deleting twice returns 204 and then 404."),
    H("Summary"),
    L("A request has a method, path, headers and maybe a body; a response has a status code and maybe a body.", "Use `GET` to read, `POST` to create, `PUT` to change, `DELETE` to remove.", "Status codes tell the client what happened: 2xx worked, 4xx your mistake, 5xx our bug.", "REST: plural nouns in the path, the method says the action."),
  ], [
    { q: 'What is the difference between 401 and 403?', a: '401 means the server does not know who you are (no or bad token). 403 means it knows you but you are not allowed to do that. In this course a job that belongs to someone else answers 404, so that we do not reveal that it exists.' },
    { q: 'Do I have to follow REST exactly?', a: 'No, it is a convention rather than a law. Following it makes your API predictable for other developers and tools, which is why we use it.' },
    { q: 'What is the difference between PUT and PATCH?', a: 'By the book, PUT replaces a whole item and PATCH changes only some fields. Many APIs, including the one in this course, use PUT for partial updates to keep things simple. What matters is that you document it and stay consistent.' },
  ], 'rest api tutorial, http status codes, http methods get post put delete, json api basics'),

  // ------------------------------------------------------------ 6
  lesson(S1, 'plan-the-job-tracker-project', 'Plan the Project: Features, API, Data Model and Folders', 'How to plan a full stack app before writing code: write the features, list the API routes, design the data and choose the folders. The Job Tracker plan you will follow for the rest of the course.', '', [
    P("Beginners often start with code and discover halfway that the pieces do not fit. Professionals spend a short time planning first, because changing a plan costs minutes and changing finished code costs days. The plan for a small app fits on one page. This lesson makes that page for the project you will build, and shows the thinking so you can repeat it for your own ideas."),

    H("Step 1: say what it does, in plain words"),
    P("Write the purpose as two sentences a friend would understand. For us: *A signed-in person keeps a list of the jobs they applied for, moves each one through a status, adds notes and the resume they sent, and sees a few numbers about their search. Nobody can see anyone else's jobs.* Notice the last sentence. It is a **rule**, and rules like it drive the design: it is why every job must belong to a user, and why every query must filter by that user."),
    H("Step 2: list the screens"),
    L("Sign in and Create account.", "My jobs: numbers at the top, search and filters, a list with pages, and an “Add a job” form.", "One job: edit the details, attach or replace the resume, delete.", "A “not found” page."),
    H("Step 3: turn screens into API routes"),
    P("For every thing a screen needs, write one route. A table is the clearest way. Look at the table in the plan file below: register, login, “who am I”, then the five job routes (list, add, read, change, delete), then statistics. Two details deserve attention. The list route takes **query parameters** for search, filter, sort and page, because the screen has those controls. And the statistics route is separate, because counting per status is a different question from listing jobs."),
    S(6, 'docs/PLAN.md'),
    H("Step 4: design the data"),
    P("Next, list what you must remember about each thing. A **User** has a name, an email that must be unique, and a password (stored only as a hash, never as text). A **Job** has an owner, a company, a role, a place, a status from a fixed list, a free-text pay note, notes, and later an attached resume. Think about what to store as text and what as a fixed choice: the status has five allowed values, so we will make the database enforce them. Pay is free text on purpose, because people write it as “£28k”, “₦150,000 per month” or “₹600 a day”, and forcing a number and currency would lose information."),
    H("Step 5: choose the folders"),
    P("Two apps in one repository keep everything together while keeping their tools apart. `server/` is the API with its own `package.json`. `client/` is the React app with its own. A small `package.json` at the top has shortcuts. The files below create that top-level shortcut file, so one command can install both apps and one command can start both."),
    S(6, 'package.json'),
    P("`npm run setup` installs both apps. `npm run dev` uses the `concurrently` package to run the server and the client together in one terminal. You will use it from lesson 25, when the client appears."),

    H("Why plan the “boring” rules first?"),
    P("Features are exciting, but **rules** are where real apps succeed or fail: who can see what, what happens with bad input, what is never stored. Writing three rules at the start (your own jobs only, no plain-text passwords, secrets in `.env`) means that you check every later lesson against them. Security added at the end is weaker than security designed at the start."),
    ...task(
      "Open `docs/PLAN.md` from the zip. Add one feature you would like (for example “interview date”) and write the route and the data field it needs.",
      "Draw the data model on paper: two boxes (User and Job) and an arrow from Job to User.",
      "Write three rules for your own app idea, in the same style as the plan.",
    ),
    ...check("Every screen has the routes it needs in the table.", "Every field has a reason, and every rule can be checked later."),
    H("Summary"),
    L("Plan in this order: purpose, screens, routes, data, folders.", "Write rules (ownership, secrets, passwords) before features.", "Keep API and client as two apps in one repository."),
  ], [
    { q: 'Is planning really needed for a small project?', a: 'A short plan is. Five minutes spent listing screens, routes and data prevents the most common problem: realising halfway that a field or a route is missing and having to change code in many places.' },
    { q: 'Why store the pay as text instead of a number?', a: 'Pay in adverts comes in many forms: per hour, per day, per month, in different currencies, sometimes as a range or “negotiable”. A text field keeps exactly what the advert said, and we do not guess or convert, which would risk showing wrong information.' },
    { q: 'Should the client and server be in one repository?', a: 'For a learning project and for small teams, yes: one place to clone, one history, easy to deploy together. Larger teams sometimes split them. The folders stay separate either way.' },
  ], 'plan a full stack app, api design, data model design, mern project structure'),

  // ------------------------------------------------------------ 7
  lesson(S1, 'node-js-basics-modules-files-events', 'Node.js Basics: Modules, Files, Paths, Events and process', 'What Node.js adds to JavaScript: file access, paths, events and information about the running program, with an example you can run.', '', [
    P("Node.js takes the JavaScript engine out of the browser and gives it abilities a browser deliberately does not have: reading and writing files, listening on network ports, and talking to the operating system. That makes it a good home for your back end. This lesson tours the few built-in parts you will meet in the rest of the course, so none of them feels strange later."),
    H("Built-in modules"),
    P("Node.js comes with modules that you import by name with the `node:` prefix: `node:fs` (files), `node:path` (paths), `node:os` (information about the computer), `node:http` (network servers), `node:events` and `node:crypto`. The prefix tells readers and tools that this is a built-in, not a package from npm."),
    H("Files and paths"),
    P("`fs/promises` gives you promise versions of the file functions, so you can `await` them: `readFile`, `writeFile`, `rm`, `mkdir`. Always build paths with `path.join(...)` instead of gluing strings with slashes, because Windows uses backslashes and macOS and Linux use forward slashes; `path.join` does the right thing on both. In ES modules there is no `__dirname`, so you create it from `import.meta.url` as the example does. You will do exactly this in lesson 36 when the server stores uploaded resumes."),
    H("Events"),
    P("`EventEmitter` lets one part of a program announce that something happened (`emit`) and other parts react (`on`). It is the idea behind many Node.js objects: servers emit `request`, streams emit `data`, Mongoose connections emit `disconnected`. You will use `res.on('finish', ...)` in the request logger in lesson 10."),
    H("process: the running program"),
    P("`process.env` holds **environment variables**: settings that come from outside your code, such as the port number or a database address. `process.argv` holds the command line words, `process.platform` the operating system, and `process.uptime()` how long the program has run. Environment variables are how you keep secrets and per-computer settings out of your source code, which is a rule you set in lesson 6."),
    S(7, 'examples/07-node/modules-and-files.js'),
    P("Run it with `node examples/07-node/modules-and-files.js hello world`. You will see the extra words in `process.argv`. Now run it with a variable set: on macOS and Linux `PORT=8080 node examples/07-node/modules-and-files.js`, on Windows PowerShell `$env:PORT=8080; node examples/07-node/modules-and-files.js`. The printed port changes without any change to the code. That is the whole point of configuration by environment."),
    N("Node.js reads each file once and caches it. If you edit a file while the program runs, nothing changes until you restart. Starting in lesson 8 you will use `node --watch`, which restarts for you."),
    ...task(
      "Run the example, then run it again with extra words and with `PORT` set.",
      "Write a script `count-jobs.js` that reads a JSON file of jobs, prints how many there are for each status, and writes the result to `report.json`.",
      "Make an `EventEmitter` that announces `job:added` and attach two listeners. Check that both run.",
    ),
    ...check("`process.env.PORT` shows your value when set and `(not set)` when not.", "Your script writes a valid `report.json`."),
    H("Summary"),
    L("Built-in modules (`node:fs`, `node:path`, `node:http`) give Node.js access to files, paths and the network.", "Use `path.join` for paths; read settings from `process.env`.", "Events let parts of a program react to each other."),
  ], [
    { q: 'What is the difference between Node.js and JavaScript in the browser?', a: 'The language is the same. Node.js adds file, network and operating system access, and has no page (no document or window). The browser has the page but, for safety, no direct file access.' },
    { q: 'Why use the node: prefix on imports?', a: 'It makes it clear that the import is a built-in module and cannot be confused with an npm package of the same name. It is optional but recommended.' },
    { q: 'What are environment variables?', a: 'Settings that live outside your code, in the shell or a .env file: ports, database addresses, secret keys. Your code reads them from process.env. This keeps secrets out of Git and lets the same code run in different places with different settings.' },
  ], 'node js basics, node fs path events, process.env, node js tutorial for beginners'),
];
