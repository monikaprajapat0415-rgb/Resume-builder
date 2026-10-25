import { P, H, L, O, N, C, S, task, check, lesson } from './helpers.js';

const S2 = 'Node.js and Express';

export const lessons = [
  // ------------------------------------------------------------ 8
  lesson(S2, 'npm-package-json-and-environment-variables', 'npm, package.json, Scripts and Environment Variables (dotenv)', 'How npm and package.json work, what dependencies and scripts are, how to run the server with automatic restarts, and how to keep settings and secrets in a .env file.', '', [
    P("Almost nobody writes a server from nothing. You use packages: small libraries other people wrote and published. **npm** is the tool that downloads them, and **package.json** is the file that lists what your project needs and how to run it. This lesson creates the `server` folder of the Job Tracker and sets up the two things every real project needs from day one: scripts to run it, and a safe way to keep settings out of the code."),

    H("package.json: the identity card of a project"),
    P("`npm init -y` creates a `package.json`. The fields that matter are these."),
    L(
      "**`\"type\": \"module\"`** switches the project to modern ES modules, so you write `import` and `export` instead of `require`. The whole course uses this.",
      "**`scripts`** are named commands. `npm run dev` runs the `dev` script. `start` and `test` are special: you can write `npm start` and `npm test` without `run`.",
      "**`dependencies`** are packages your program needs while it runs. **`devDependencies`** are only for development, such as test or build tools.",
      "Version numbers like `^5.2.1` mean “5.2.1 or any newer 5.x version”. The exact versions that were installed are recorded in `package-lock.json`, which you **should** commit: it makes everyone, including your server, install the same versions.",
    ),
    S(8, 'server/package.json'),
    H("Installing and the node_modules folder"),
    P("`npm install express` downloads Express and its own dependencies into `node_modules/` and adds it to `dependencies`. `npm install` with no name installs everything listed in `package.json`, which is what you run after cloning a project. Never edit `node_modules`, never commit it (the `.gitignore` already excludes it), and delete it freely if something seems broken: `npm install` rebuilds it."),
    N("Install packages only from names you trust. A package with a similar-looking name to a famous one can be malicious. Check the spelling and the download count, and prefer well-known libraries, especially for security tasks such as hashing passwords."),

    H("Restarting automatically while you work"),
    P("Node.js reads your code once, when it starts. To see a change you must stop and start again, which gets tiring. Since Node.js 18.11 there is a built-in fix: `node --watch index.js` restarts on every file change. That is our `dev` script, so you need no extra package such as nodemon."),

    H("Environment variables and .env"),
    P("Passwords, database addresses and secret keys must not be written in code, because code goes into Git and Git history is permanent. They also differ from computer to computer: your laptop uses a local database and your server uses a hosted one. The solution is **environment variables**, read in code as `process.env.NAME`."),
    P("During development it is awkward to set variables in the terminal each time, so the `dotenv` package reads a file called `.env` and loads its lines into `process.env`. The top line of `index.js` below does it: `import 'dotenv/config'`. The `.env` file stays on your machine (it is in `.gitignore`). What you do commit is `.env.example`, a copy with the names but no secrets, so that a new developer knows what to fill in."),
    S(8, 'server/.env.example'),
    S(8, 'server/index.js'),
    P("Always read numbers with `Number(...)` and give a sensible default, as in `Number(process.env.PORT) || 5000`. Environment variables are always text, and a missing one is `undefined`."),
    ...task(
      "Create `server/.env` by copying `.env.example` (do not commit it). Run `cd server && npm install && npm run dev`.",
      "Change `PORT` in `.env`. Because `node --watch` watches your code files and not `.env`, stop the server with Ctrl + C and start it again to see the new value.",
      "Run `npm run dev` with `NODE_ENV=production` set in your shell and read the second printed line.",
      "Check that `git status` does not list `.env` (it should be ignored) but does list `.env.example`.",
    ),
    ...check("The server prints the port from your `.env`.", "`git status` never shows `.env` or `node_modules`."),
    H("Summary"),
    L("`package.json` lists dependencies and scripts; commit `package-lock.json`.", "`node --watch` restarts on changes, with no extra package.", "Secrets and settings live in `.env`, never in Git; commit `.env.example` instead."),
  ], [
    { q: 'Should I commit package-lock.json?', a: 'Yes. It records the exact versions that were installed, so your teammates and your server install the same ones. Without it, a new install could pick a newer version and behave differently.' },
    { q: 'What is the difference between dependencies and devDependencies?', a: 'dependencies are needed when the app runs in production. devDependencies, such as test runners and build tools, are only needed while developing. On a server you can install with --omit=dev to skip them.' },
    { q: 'Why is .env not committed to Git?', a: 'It holds secrets such as database passwords. Anything committed stays in Git history even after you delete it, and anyone with access to the repository could read it. Commit .env.example with empty values instead.' },
  ], 'npm tutorial, package.json explained, dotenv node js, environment variables node, node watch'),

  // ------------------------------------------------------------ 9
  lesson(S2, 'your-first-express-server-and-routes', 'Your First Express Server: Routes, Parameters and Query Strings', 'Install Express 5, start a server, write routes for different methods, and read route parameters and query strings.', '', [
    P("In lesson 5 you wrote a REST server by hand and saw how much work it was. **Express** is a small, very widely used library that does that plumbing for you: it matches the method and path, parses the URL, and gives you simple tools to send the answer. The server you build from this lesson is the same one that runs the finished Job Tracker."),
    P("This course uses **Express 5**, the current major version. If you find older tutorials for Express 4, nearly everything still applies. The most useful difference is that Express 5 automatically passes errors from `async` functions to your error handler, which removes a lot of try/catch code (you will see it in lesson 12)."),

    H("The smallest server"),
    S(9, 'server/index.js'),
    P("Read it from the top. `express()` creates the **app**. `app.get(path, handler)` registers a route: when a `GET` request for that path arrives, Express calls the handler with two objects. `req` is the request: it holds the method, path, headers, parameters and body. `res` is the response: you call `res.json(...)` to send JSON, `res.status(201)` to set a status code, `res.sendFile(...)` to send a file. `app.listen(port, callback)` starts waiting for connections."),
    H("Route parameters and query strings"),
    P("Two ways to send small pieces of information in the address itself are used constantly."),
    L(
      "**Route parameters** are part of the path, marked with a colon: `/api/hello/:name`. A request for `/api/hello/Asha` gives `req.params.name === 'Asha'`. Use them to say *which* thing: `/api/jobs/64f...`.",
      "**Query strings** come after a question mark: `/api/hello/Asha?shout=true`. Express puts them in `req.query`, so `req.query.shout === 'true'`. Use them for *options*: search text, filters, sorting and page numbers. Remember that all values arrive as text.",
    ),
    P("The rule of thumb: the path identifies a resource, and the query string adjusts how you view it. That is exactly how the Job Tracker's list route will work: `GET /api/jobs?status=applied&page=2`."),
    H("Order matters"),
    P("Express checks routes in the order you wrote them and stops at the first match. If you put `/api/jobs/:id` before `/api/jobs/stats`, a request for `stats` is matched as an id. Put the specific routes first. You will meet this exact bug in lesson 19."),
    H("Try it in the browser and in the terminal"),
    P("A `GET` route can be opened in the browser address bar: `http://localhost:5000/api/health`. For everything else use `curl` or a tool such as the REST Client (lesson 13). `curl -i http://localhost:5000/api/hello/Asha?shout=true` shows the whole response including the headers."),
    N("If you see “EADDRINUSE”, another program is already using that port, often an old copy of your own server. Stop it with Ctrl + C, or change `PORT` in `.env`."),
    ...task(
      "Run `npm install` inside `server` (it now installs Express), then `npm run dev`.",
      "Open `/api/health` in the browser. Reload and watch `time` change.",
      "Call `/api/hello/Asha` and `/api/hello/Asha?shout=true`.",
      "Add a route `GET /api/add/:a/:b` that returns the sum. Remember that parameters are text: convert with `Number()`, and answer `400` if either is not a number.",
    ),
    ...check("`/api/health` returns `{ \"ok\": true, \"time\": ... }`.", "`shout=true` makes the message upper case.", "Your add route answers 400 for `/api/add/x/2`."),
    H("Summary"),
    L("`app.get(path, (req, res) => ...)` registers a route; `res.json()` answers.", "Parameters (`req.params`) identify; query strings (`req.query`) adjust. Both arrive as text.", "Routes are checked in order. Put specific paths before general ones."),
  ], [
    { q: 'What is the difference between req.params and req.query?', a: 'req.params holds values from the path itself (/jobs/:id). req.query holds values after the question mark (?page=2). Both are text, so convert numbers yourself.' },
    { q: 'Do I need Express, or can I use plain Node.js?', a: 'You can use plain Node.js, as lesson 5 showed, but you would write much more code for routing, parsing and errors. Express is small, popular and well documented, which is why most Node.js tutorials and jobs use it.' },
    { q: 'Why does my change not appear?', a: 'Node.js reads files once at start. Use npm run dev, which runs node --watch and restarts for you. If you edited .env, restart by hand because it is not watched.' },
  ], 'express js tutorial, express 5, express routes, req params req query, node express server'),

  // ------------------------------------------------------------ 10
  lesson(S2, 'express-middleware-json-cors-and-logging', 'Express Middleware: express.json, CORS and a Request Logger', 'How middleware works as a pipeline, why express.json and cors are needed, and how to write your own logger.', '', [
    P("**Middleware** is the most important idea in Express. A middleware is a function that sits between the incoming request and your route. It can look at the request, change it, send an answer by itself, or pass it on by calling `next()`. Think of a security desk at an office: every visitor passes the desk first, and the desk may let them through, write down their name, or turn them away."),
    P("Everything else in this back end is built from middleware: reading JSON, allowing the React app to call the API, logging, signing in, rate limiting, uploads and error handling. Once you understand one, you understand all of them."),

    H("The shape of a middleware"),
    S(10, 'server/middleware/logger.js'),
    P("It takes three arguments: `req`, `res` and `next`. It does its work and calls `next()`. If it forgot to call `next()` (and did not send an answer), the request would hang forever and the browser would spin. This logger uses an event from lesson 7: `res.on('finish', ...)` runs after the response has been sent, so it can report the final status code and the time taken."),
    H("Wiring the pipeline"),
    S(10, 'server/index.js'),
    P("`app.use(fn)` adds a middleware for every request. They run in the order you write them, then the matching route runs. Read the three in this file."),
    L(
      "**The logger** runs first, so that every request is logged, even ones that later fail.",
      "**`cors`** adds headers that tell the browser it is allowed to call this API from another address. A browser blocks a page at `localhost:5173` from reading answers from `localhost:5000` unless the server says that this origin is allowed. This is the browser's *same-origin policy*. Note that CORS only protects browsers: tools such as curl ignore it, so it is not a replacement for signing in.",
      "**`express.json()`** reads the body of a request whose `Content-Type` is `application/json`, parses it, and puts the result in `req.body`. Without it `req.body` is `undefined`. The `limit` of 100 kb rejects absurdly large bodies, which protects the server from being flooded.",
    ),
    H("Try the pipeline"),
    P("The route at the bottom of the file, `POST /api/echo`, shows that `req.body` works. Send it a body with curl: `curl -i -X POST localhost:5000/api/echo -H \"Content-Type: application/json\" -d '{\"hello\":\"world\"}'`. Then remove the `Content-Type` header and see that `youSent` becomes empty: Express only parses JSON when it is told the body is JSON."),
    H("Middleware for one route"),
    P("A middleware can also be placed in front of a single route: `app.get('/private', checkSomething, handler)`. You will use that for signing in (lesson 22), for rate limiting the login route (lesson 23) and for file uploads (lesson 36). Global middleware is for things every request needs; route middleware is for things only some routes need."),
    N("Order is a common source of bugs. `express.json()` must come *before* the routes that read `req.body`. The error handler (lesson 12) must come *after* the routes. When something does not work, print the order of your `app.use` lines."),
    ...task(
      "Run the server and call `/api/health`. Look at the logger line in the terminal.",
      "Send the echo request with and without the `Content-Type` header. Compare `req.body`.",
      "Write a new middleware `addRequestId` that creates a random id with `crypto.randomUUID()`, stores it on `req.id`, and sets an `X-Request-Id` response header. Add it before the logger and include the id in the log line.",
    ),
    ...check("Each request prints one line with the method, path, status and time.", "The echo route returns what you sent only when the JSON header is present.", "Your responses have an `X-Request-Id` header."),
    H("Summary"),
    L("Middleware is a function `(req, res, next)`: handle the request or call `next()`.", "Order matters: they run top to bottom, so put `express.json()` before the routes.", "CORS tells browsers which sites may call the API. It is not security by itself."),
  ], [
    { q: 'Why does my request hang forever?', a: 'A middleware or route neither sent a response nor called next(). Every path through your code must end in a response or a call to next.' },
    { q: 'What is CORS and why do I get a CORS error?', a: 'Browsers refuse to let a page read answers from another origin (different address or port) unless the server allows it with CORS headers. In this course the server allows the React address, and in production both are served from one origin so no CORS is needed.' },
    { q: 'Does CORS protect my API from attackers?', a: 'No. CORS is enforced by browsers only. Anyone can call your API with curl or a script. Protection comes from signing in, authorization checks, validation and rate limiting.' },
  ], 'express middleware, express.json, cors express, node request logger, express next function'),

  // ------------------------------------------------------------ 11
  lesson(S2, 'express-routers-and-controllers', 'Routers and Controllers: A Clean Express Project Structure', 'Split an Express app into routers and controllers so that it stays readable as it grows, using an in-memory jobs API.', '', [
    P("One file with every route works for a demo, but a real API has dozens of routes, and a 600-line `index.js` is hard to read, test and change. The standard answer is to split by responsibility. A **router** lists the paths of one feature and says which function handles each. A **controller** holds the functions that do the work. The main file only assembles them."),
    P("In this lesson you build the whole jobs API, with five routes (list, read, create, change, delete), storing jobs in an array in memory. That is not a real database, since everything vanishes when the server restarts, but it lets us focus on structure and replace the storage in lesson 17 without touching the routes."),

    H("The router"),
    S(11, 'server/routes/jobs.js'),
    P("`Router()` creates a mini app that can have routes and middleware of its own. Reading this file tells you the whole API of the feature at a glance: five lines, each with a method, a path and a handler. Notice that the paths here are relative: `'/'` and `'/:id'`. The main file decides the prefix."),
    H("The controller"),
    S(11, 'server/controllers/jobs.js'),
    P("Each exported function is one route handler. They are plain functions of `(req, res)`, so they are easy to read and, later, to test. For now they work on the `jobs` array. Look at how `getJob`, `updateJob` and `deleteJob` all start by finding the job and answering `404` when it does not exist. Repeating that pattern is a hint that it can be extracted into a helper, and in lesson 12 it will be."),
    H("Mounting it"),
    S(11, 'server/index.js'),
    P("`app.use('/api/jobs', jobsRouter)` says: any request whose path starts with `/api/jobs` goes to this router, with that prefix removed. So `GET /api/jobs/5` reaches `router.get('/:id')`. When you add users, files or statistics you add one line here and one new pair of files, and the rest of the app is untouched."),
    H("A rule of thumb for what goes where"),
    L(
      "**Routes**: paths, methods and which middleware runs. No logic.",
      "**Controllers**: read the request, call the data layer, choose the status code and the answer.",
      "**Models** (from lesson 16): how data looks and how it is stored.",
      "**Middleware** and **utils**: things reused by many routes.",
    ),
    P("This is a convention, not magic. Smaller apps sometimes merge two layers, and larger ones add a “service” layer between controllers and models. What matters is that you can say, for any piece of code, which layer it belongs to and find it fast."),
    N("Right now a request with a missing `company` creates a broken job, and an `id` like `abc` is treated as a number. Do not worry: lesson 12 adds validation and error handling. It is more instructive to see the problem first."),
    ...task(
      "Run the server and call `GET /api/jobs`, `GET /api/jobs/1`, and `GET /api/jobs/99`.",
      "Create a job with `POST` and a JSON body, then change its status with `PUT`, then delete it.",
      "Send a `POST` with an empty body `{}`. What was stored? Write down what you would want to happen instead.",
      "Add a third route file `routes/health.js` with its own router and mount it at `/api/health`.",
    ),
    ...check("All five routes answer with the right status codes (200, 201, 204, 404).", "An empty `POST` is accepted. You have seen the problem that lesson 12 fixes."),
    H("Summary"),
    L("Routers list paths; controllers do the work; `index.js` assembles them.", "`app.use('/api/jobs', router)` mounts a router under a prefix.", "Keeping layers separate lets you change storage later without touching routes."),
  ], [
    { q: 'Do I have to use a controllers folder?', a: 'No, it is a convention. Small apps can keep handlers next to routes. The benefit of separating them is that the route file reads like a table of contents and the handlers are easy to find and test.' },
    { q: 'What does mounting a router do to the path?', a: 'app.use("/api/jobs", router) removes the prefix before the router sees the path. So a request for /api/jobs/5 matches router.get("/:id") with id 5.' },
    { q: 'Why store data in an array first?', a: 'It lets you learn routing and structure without a database. Because the routes and controller functions keep the same names, switching to MongoDB in lesson 17 changes only the bodies of the controller functions.' },
  ], 'express router, express controllers, express project structure, mern folder structure, node rest api structure'),

  // ------------------------------------------------------------ 12
  lesson(S2, 'validation-and-error-handling-in-express', 'Validation and Error Handling in Express: HttpError and an Error Middleware', 'Never trust the client: check input, return helpful 400 answers with field errors, and send every failure through one error handler.', '', [
    P("The most important sentence in back end development is: **never trust the client**. Anyone can send anything to your API: missing fields, numbers where text is expected, a ten-megabyte string, JSON that is not JSON. If your code assumes good input, the first bad request either crashes the server or, worse, stores garbage. This lesson adds two protections to the jobs API: **validation** (check and clean the input) and **error handling** (turn every failure into a clear, safe answer)."),

    H("Validation: check, clean, then use"),
    S(12, 'server/middleware/validate.js'),
    P("`cleanJob` receives the body and does three things. It **checks** that required fields exist and have a sensible length. It **cleans** the values with `trim()`. And it **copies only the fields it knows**, so that if a client adds `{ \"admin\": true }`, that field is simply ignored. This last step prevents a class of bugs called *mass assignment*. Problems are collected in one object so the client can show all of them at once, not one per attempt."),
    P("The `partial` option exists for updates: when changing a job, every field is optional, but the ones you send must still be valid. That is why the function checks `body[field] === undefined && partial` first."),

    H("A custom error that carries a status"),
    S(12, 'server/utils/HttpError.js'),
    P("A normal `Error` has a message but no idea about HTTP. `HttpError` adds a `status` and optional `details`. Now any code, a controller, a validator or a middleware, can `throw new HttpError(404, 'Job not found')` and know the right answer will be sent. Throwing is better than writing `res.status(404).json(...)` and `return` in every place, because it stops the function immediately and keeps the happy path clean."),
    H("One place that answers every error"),
    S(12, 'server/middleware/error.js'),
    P("An **error-handling middleware** has *four* parameters, `(err, req, res, next)`. That is how Express recognises it, so keep all four even if `next` is unused. Express sends any thrown or passed error to it. It also receives errors from `async` functions in Express 5, so a rejected `await` ends up here without a `try/catch`."),
    L(
      "Known errors (those with a `status` below 500) are shown to the client with their message and details.",
      "Unknown errors are bugs. They are **logged** on the server, but the client only gets a generic “Something went wrong”. Showing the real message could leak file paths or database details to an attacker.",
      "`notFound` handles requests that matched no route and gives a JSON 404 instead of Express's default HTML page.",
    ),
    H("Using it in the controller"),
    S(12, 'server/controllers/jobs.js'),
    P("Compare this controller with lesson 11. The repeated `if (!job) return res.status(404)...` is now one small `find` function that throws. The create and update routes call `cleanJob`, so bad input never reaches the data. And `index.js` registers `notFound` after all the routes and `errorHandler` last of all, because Express treats the error middleware as the final stop."),
    S(12, 'server/index.js'),
    N("Never put error details such as stack traces in the response in production. They help attackers. Log them on the server instead, where only you can read them."),
    ...task(
      "Run the server. Send `POST /api/jobs` with `{ \"company\": \"\", \"status\": \"maybe\" }` and read the `details` object in the answer.",
      "Send invalid JSON (for example `{ \"company\": `) and confirm you get `400` with a clear message, not an HTML page.",
      "Call `GET /api/nothing` and `GET /api/jobs/999`. Both should answer 404 in JSON.",
      "Add a `location` field to `cleanJob` (optional, at most 120 characters).",
    ),
    ...check("Bad input answers 400 and tells you which fields are wrong.", "Unknown routes and missing jobs answer 404 as JSON.", "A deliberate bug (throw a normal Error in a route) answers 500 with a generic message and logs the details in your terminal."),
    H("Summary"),
    L("Check, clean and whitelist input; return all field errors together.", "Throw `HttpError` anywhere; one error middleware (four parameters, registered last) sends the answer.", "Log unknown errors on the server; never show their details to the client."),
  ], [
    { q: 'Why does the error middleware need four parameters?', a: 'Express decides that a function is an error handler by counting its parameters. With four (err, req, res, next) it is used for errors. With three it is a normal middleware, even if you meant it as an error handler.' },
    { q: 'Should validation be on the server or the client?', a: 'Both, for different reasons. Client validation gives quick, friendly feedback. Server validation is the one that protects you, because the client can be bypassed. Never rely only on the client.' },
    { q: 'Do I need a validation library?', a: 'Not for a small API like this. Libraries such as Zod or Joi help when you have many shapes of data, and the ideas are the same: describe the rules, check, and return clear errors. Doing it by hand once helps you understand what they do.' },
  ], 'express error handling, express validation, node api validation, http error middleware, mass assignment'),

  // ------------------------------------------------------------ 13
  lesson(S2, 'test-your-api-with-rest-client-and-smoke-script', 'Test Your API: REST Client, Postman, curl and a Smoke Script', 'Ways to try an API without a front end, from one-off requests to a script that checks a whole flow and prints PASS or FAIL.', '', [
    P("You now have a working API but no screen. How do you know it works? You call it. This lesson shows the three levels of testing an API by hand and by script, and gives you a **smoke script** you will keep using, extended, until the end of the course."),

    H("Level 1: one request at a time"),
    P("There are three common tools, and they all do the same job: build a request and show the response."),
    L(
      "**curl** is in every terminal. `curl -i -X POST localhost:5000/api/jobs -H \"Content-Type: application/json\" -d '{\"company\":\"Acme\",\"role\":\"Clerk\"}'` sends a POST and shows the status line and headers because of `-i`. It is best for quick checks and for scripts on a server.",
      "**Postman** and similar apps (Insomnia, Thunder Client) give you a window with saved requests. Good for exploring someone else's API.",
      "**The REST Client extension for VS Code** reads a plain `.http` file where each request is a few lines separated by `###`, and you click “Send Request”. The file is text, so you can commit it, and your whole team shares the same examples. We use it here.",
    ),
    S(13, 'server/requests.http'),
    P("Open this file in VS Code with the REST Client extension installed. The line `@base = http://localhost:5000/api` defines a variable used as `{{base}}` in every request. Run them in order and watch the answers. Pay special attention to the one with a deliberate mistake, which should answer `400` with a `details` object, and to the one for a job that does not exist, which should answer `404`."),
    H("Level 2: a script that checks the answers"),
    P("Clicking is fine for exploring, but you want a quick way to know that nothing has broken after a change. A **smoke test** runs the main paths through the real running server and reports PASS or FAIL. It is called a smoke test from electronics: switch it on and see whether smoke comes out. It does not prove the app is perfect; it quickly catches the obvious breakage."),
    S(13, 'server/scripts/smoke.js'),
    P("Read the two small helpers at the top. `check(name, ok)` prints a line and counts failures. `call(method, path, body)` wraps `fetch`, turns the body into JSON, and returns `{ status, data }`, so every test line is short. At the end, `process.exit(1)` when any check failed gives the script a non-zero exit code, which is what automated systems use to know that something broke. In lesson 22 the script learns to sign in, and in lesson 24 you will meet real automated tests."),
    H("Level 3: automated tests"),
    P("A smoke script needs a running server and checks the main flow. A real **automated test suite** starts its own copy of the app, uses its own database, runs dozens of small checks and runs on every change. You will build one in lesson 24. The tests will be easier to write because of how you structured the code today."),
    N("Test the unhappy paths as carefully as the happy ones. Most real bugs and most attacks live in what happens with missing, wrong or hostile input, not in what happens when everything is perfect."),
    ...task(
      "Start the server with `npm run dev`, then in a second terminal run `npm run smoke`.",
      "Break something on purpose: change the `404` in `getJob` to `500`, save, and run the smoke script. Which line fails?",
      "Add two checks to the script: `PUT` with an invalid status answers `400`, and `GET /api/jobs/abc` answers `404`.",
    ),
    ...check("Every line starts with PASS and the script ends with “All checks passed”.", "The deliberate break produces a FAIL line with the answer that came back."),
    H("Summary"),
    L("Use curl or a `.http` file for single requests.", "A smoke script runs the main flow and exits with a non-zero code on failure.", "Test bad input as carefully as good input."),
  ], [
    { q: 'What is the difference between a smoke test and unit tests?', a: 'A smoke test calls a running app over HTTP and checks the main flow quickly. Unit and integration tests run small pieces or a whole app in isolation, usually with their own database, and cover many more cases. You need both over time.' },
    { q: 'Can I test the API without writing code?', a: 'Yes. curl, Postman or the REST Client extension send single requests with no code. Writing a script is what lets you repeat the same checks after every change.' },
    { q: 'Why does the script call process.exit(1) on failure?', a: 'A non-zero exit code is how programs tell their caller that something failed. Build servers and scripts check it, so a failing smoke test can stop a deployment.' },
  ], 'test rest api, rest client vscode, postman alternative, api smoke test, curl post json'),
];
