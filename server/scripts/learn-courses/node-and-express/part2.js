import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';

const S2 = 'Express';

export const lessons = [
  // ---------------------------------------------------------------- 6
  les(S2, 'your-first-express-server', 'Your First Express Server: Routes, Requests and Responses', 'Your First Express Server Step by Step',
    'Install Express, create a server with routes, learn what req and res contain, send text and JSON, and restart automatically while you edit with node --watch.', [
    P("Express is the most used web framework for Node.js. It is small, it has been around for many years and a huge amount of documentation and examples exist for it. Express does not change how Node works. It adds a clean way to describe which code answers which request. In this lesson you will build the same kind of server as in lesson 5, but with far less code."),
    H("Install and start"),
    P("Inside your `taskapi` folder, you already ran `npm install express` in lesson 2. If not, run it now. Create a file `server.js` with this code. This course uses Express 5, which is the current major version. Most of what you learn also applies to Express 4, and we point out the differences where they matter."),
    C('js', code('lesson06-server.js')),
    P("Start it with `node server.js`, or better, with `npm run dev` after you have added the scripts from lesson 2. Then test it."),
    C('bash', `curl http://localhost:3000/
curl http://localhost:3000/api/health`),
    C('text', `Hello from Express
{"ok":true,"time":"2026-10-28T04:00:00.000Z"}`),
    P("The time you see will be your current time. Now look at the code in four parts."),
    L("`express()` creates the **app**, an object that holds your routes and settings.", "`app.get(path, handler)` says: when a GET request arrives for this path, run this function. There are matching methods `app.post`, `app.patch`, `app.put` and `app.delete`.", "The handler receives `req` (the request) and `res` (the response).", "`app.listen(port, callback)` starts the server. The callback runs once it is ready."),
    H("The request object, req"),
    P("The request object describes what the client sent. You will use these parts all the time."),
    L("`req.method` and `req.originalUrl`: the method and the full URL path with the query string.", "`req.params`: values taken from the path, such as the `7` in `/api/tasks/7`. Lesson 7 covers this.", "`req.query`: values after the question mark, such as `?done=true`.", "`req.body`: the data sent in the body of a POST or PATCH. It needs a body parser, which lesson 8 covers.", "`req.get('Authorization')`: reads one request header.", "`req.ip`: the address of the client."),
    H("The response object, res"),
    P("You must send exactly one response for each request. If you never send one, the client waits until it times out. If you send two, Node throws an error. These are the methods you will use."),
    L("`res.send('text')` sends text, HTML or a buffer, and sets the content type for you.", "`res.json(object)` converts a JavaScript object into JSON and sets `Content-Type: application/json`. This is the main method for APIs.", "`res.status(404)` sets the status code and returns `res`, so you can chain: `res.status(404).json({ error: 'Not found' })`.", "`res.status(204).end()` sends an empty response, used after a delete.", "`res.set('Header-Name', 'value')` sets a header.", "`res.redirect('/other')` sends the client to another URL."),
    N("A very common beginner mistake: writing `res.json(...)` and then, in the next line, running more code that also calls `res.send`. After you respond, use `return`, as in `return res.status(404).json(...)`, so that the function stops."),
    H("Restart automatically while you work"),
    P("Node reads your file once at start-up. If you change the code, the old version keeps running until you restart. Instead of stopping and starting by hand, run `node --watch server.js`. Node watches the files it loaded and restarts whenever one changes. That is what the `dev` script from lesson 2 does."),
    H("Ports and the PORT variable"),
    P("We used the fixed port 3000. On a real server, you often cannot choose the port yourself, because a hosting service or a process manager gives it to you through an environment variable called `PORT`. Lesson 11 shows how to read it with a fallback, so the same code runs on your laptop and on a server."),
    H("Express 5 handles async errors"),
    P("In Express 4, if an `async` handler threw an error or rejected a promise, the error was not caught and you had to wrap every handler by hand. Express 5 catches rejected promises from handlers and passes them to the error handler for you. That makes async handlers much simpler, and you will rely on it from lesson 9."),
    H("Common problems"),
    L("**`Cannot GET /something`**: no route matches. Check the path and the method. A POST route does not answer a GET request.", "**The browser shows old content**: your code did not restart. Use `--watch`.", "**`EADDRINUSE`**: the port is already used by another copy of the server. Stop it.", "**`Error [ERR_MODULE_NOT_FOUND]`**: you forgot `.js` in a file import, or the package is not installed."),
    ...task("Create `server.js` with the code above and start it with `node --watch server.js`.", "Add a route `GET /api/hello/world` that returns `{ \"message\": \"Hello, world\" }`.", "Change the text of the home page while the server runs and refresh. Check that the change appears.", "Use `curl -i` on `/api/health` and find the `Content-Type` header."),
    ...check("The browser shows `Hello from Express` at `http://localhost:3000/`.", "`/api/health` returns JSON with `ok` set to `true`.", "After saving a change, the terminal shows that the server restarted and the new text appears."),
  ], A('Express answers a request', [
    n('req', 'Request', 'GET /api/health', 0, 0, 'data'), n('app', 'Express app', 'finds the route', 1, 0, 'tool'),
    n('handler', 'Your handler', '(req, res) => ...', 2, 0, 'app'), n('res', 'Response', 'res.json({ ok })', 3, 0, 'out'),
  ], [
    { say: 'A request arrives, for example GET /api/health.', on: ['req'] },
    { say: 'Express looks for a route that matches the method and the path.', flow: ['req>app:arrives'] },
    { say: 'It calls your handler function and gives it the request and response objects.', flow: ['app>handler:calls'] },
    { say: 'Your handler sends one response, for example with res.json.', flow: ['handler>res:sends'] },
  ]), [
    faq('What is the difference between res.send and res.json?', 'res.send sends text, HTML or a buffer. res.json converts an object to JSON and sets the JSON content type. Use res.json for APIs.'),
    faq('Why does my browser show the old version after I edit the code?', 'Node does not reload code by itself. Restart the server, or start it with node --watch so it restarts when files change.'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S2, 'express-routing-params-query-and-routers', 'Express Routing: URL Params, Query Strings and Routers', 'Express Routing, Params and Query Strings',
    'Learn how Express routes work: method and path, URL parameters, query strings, status codes, route order and splitting routes into files with Router.', [
    P("Routing means deciding which code answers which request. Each route is a combination of an HTTP method and a path. A good API uses the method to say what to do and the path to say which thing, for example `GET /api/tasks/7` means read task 7 and `DELETE /api/tasks/7` means remove it. In this lesson you will build read-only task routes with parameters and filters, and then learn how to organise routes in separate files."),
    H("Route parameters"),
    P("A segment of the path that starts with a colon is a **parameter**. Express puts the matching part of the real URL into `req.params`. For the route `/api/tasks/:id` and the request `/api/tasks/2`, `req.params.id` is the **text** `'2'`. Parameters are always strings, so convert them with `Number()` when you need a number."),
    H("Query strings"),
    P("The part of the URL after a question mark is the **query string**, such as `?done=true&sort=title`. Express parses it into `req.query`. Use the path for *which thing*, and the query string for *how to filter, sort or page the list*. Query values are also strings, and a key can come as an array if it is repeated, so check the value before using it. Try the next example."),
    C('js', code('lesson07-routes.js')),
    C('bash', `curl "http://localhost:3000/api/tasks?done=false"
curl http://localhost:3000/api/tasks/2
curl -i http://localhost:3000/api/tasks/99`),
    C('text', `[{"id":2,"title":"Learn Express","done":false},{"id":3,"title":"Build an API"...}]
{"id":2,"title":"Learn Express","done":false}
HTTP/1.1 404 Not Found
...
{"error":"Task not found"}`),
    P("Notice the filter. We compare `done` with the text `'true'` and `'false'`, because the query string only holds text. Any other value, such as `?done=maybe`, simply returns the full list here. In a stricter API you could answer 400. Notice also that the one-task route answers `404` with a JSON message when the id is not found. A request to `/api/tasks/abc` also gets 404, because `Number('abc')` is `NaN`, which matches no id."),
    N("Put quotation marks around a URL that contains `?` or `&` when you use curl, as above. Otherwise your terminal may treat the `&` as a command separator."),
    H("Choose good status codes"),
    L("`200` for a successful read or update.", "`201` after creating something, ideally with a `Location` header that gives its address.", "`204` for a successful delete with nothing to return.", "`400` when the client's data is invalid, `404` when the thing does not exist.", "Do not return `200` with a body that says `{ error: ... }`. Clients, tests and monitoring tools rely on the status code."),
    H("Route order matters"),
    P("Express tries routes **in the order you wrote them** and uses the first one that sends a response. A general route placed before a specific one can swallow requests. For example, if `/api/tasks/:id` comes before `/api/tasks/stats`, then a request to `/api/tasks/stats` is matched with `id` equal to `stats`. Put the specific routes first and the ones with parameters after them."),
    H("Express 5 path syntax"),
    P("Express 5 uses a stricter path syntax than Express 4. A plain `*` wildcard is no longer allowed, and `app.get('/old/*', ...)` throws an error on start-up. A wildcard must have a name, as in `/files/*splat`, and the matched parts are then found in `req.params.splat`. An optional part is written with braces, as in `/users{/:id}`, which matches both `/users` and `/users/7`. If you copy older Express 4 examples from the internet and get a `Missing parameter name` error, this is the reason."),
    H("Split routes into files with Router"),
    P("When an app grows past a few routes, one file becomes hard to read. Express has `Router`, a small mini-app that holds a group of routes. You write the routes with paths that are relative to the place where you mount the router."),
    C('js', `// routes/tasks.js
import { Router } from 'express';

export function tasksRouter() {
  const router = Router();
  router.get('/', (req, res) => res.json([]));          // GET /api/tasks
  router.get('/:id', (req, res) => res.json({}));       // GET /api/tasks/5
  return router;
}

// app.js
import { tasksRouter } from './routes/tasks.js';
app.use('/api/tasks', tasksRouter());`),
    P("In the router file, the route `'/'` means the root of wherever the router is mounted. `app.use('/api/tasks', ...)` mounts it under that prefix. Wrapping the router in a function, as we did here, lets you pass dependencies in, such as a data store, and it makes the code easy to test. The final project in this course uses exactly this layout, with one router for tasks and one for login."),
    H("Keep URLs predictable"),
    L("Use nouns in the plural for things: `/api/tasks`, `/api/users`.", "Do not put verbs in paths: prefer `POST /api/tasks` over `/api/createTask`.", "Use lowercase letters and hyphens.", "Keep a prefix such as `/api` or `/api/v1`, so you can add a front end on the same domain, and you can change the API later without breaking old clients."),
    ...task("Create `server.js` with the routes above and test the three curl commands.", "Add `?sort=title` support: when it is present, return the tasks sorted by title.", "Add a route `GET /api/tasks/stats` that returns how many tasks are done and how many are not. Put it **before** the `:id` route and test it. Then move it after and see what happens.", "Move the task routes into `routes/tasks.js` using `Router`."),
    ...check("`/api/tasks?done=true` returns only tasks that are done.", "`/api/tasks/99` returns status 404 with a JSON message.", "`/api/tasks/stats` returns your counts, not a 404."),
  ], A('Matching a URL to a route', [
    n('url', 'URL', '/api/tasks/2?x=1', 0, 0, 'data'), n('match', 'Route match', 'method + path', 1, 0, 'tool'),
    n('parts', 'params + query', 'id = 2, x = 1', 2, 0, 'app'), n('send', 'Response', '200 or 404', 3, 0, 'out'),
  ], [
    { say: 'The request URL has a path and an optional query string.', on: ['url'] },
    { say: 'Express compares the method and path with your routes in order and picks the first match.', flow: ['url>match:compare'] },
    { say: 'The values in the path go to req.params and the values after the question mark go to req.query.', flow: ['match>parts:extract'] },
    { say: 'Your code uses them to build the response, with the right status code.', flow: ['parts>send:respond'] },
  ]), [
    faq('Why is req.params.id a string?', 'URLs are text, so every parameter and query value arrives as a string. Convert it with Number() when you need a number, and check that the result is valid.'),
    faq('Why does the order of routes matter?', 'Express uses the first matching route. A general route written before a specific one can capture requests meant for the specific one.'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S2, 'express-middleware-explained', 'Express Middleware Explained: next(), Logging and express.json()', 'Express Middleware: next() and Logging',
    'Understand Express middleware: functions that run in order on every request. Write a logger, parse JSON bodies and apply middleware to chosen routes.', [
    P("Middleware is the idea that makes Express flexible. A middleware is a function that runs **between** the arrival of a request and your route handler. It can look at the request, change it, stop it with a response, or pass it on to the next function by calling `next()`. Logging, reading JSON bodies, checking logins, handling cross-origin requests and limiting traffic are all middleware. If you understand this lesson, the rest of Express becomes easy."),
    H("The shape of a middleware"),
    P("A middleware takes three arguments: `req`, `res` and `next`. It must do one of two things. Either it sends a response, which ends the chain, or it calls `next()`, which passes control on. If it does neither, the request hangs until the client gives up. You register middleware with `app.use`. Here is a small logger and a JSON body parser."),
    C('js', code('lesson08-middleware.js')),
    P("The first middleware records the start time, asks Node to run a function when the response is finished, and then calls `next()`. When the response finishes, it prints the method, the URL, the status code and the time taken. The second one, `express.json()`, is built into Express. It reads the request body, and if the content type is JSON, it parses it and puts the result in `req.body`. Then the route can use `req.body`. Try it."),
    C('bash', `curl -X POST http://localhost:3000/api/echo -H "Content-Type: application/json" -d '{"title":"Hi"}'`),
    C('text', `{"youSent":{"title":"Hi"}}`),
    P("The server terminal prints one line for each request, such as `POST /api/echo 200 9ms`. The number of milliseconds will differ on your computer. If you use Windows PowerShell, quoting rules for curl are different. A simple way is to test with a tool such as the REST Client extension for VS Code, or to use `curl.exe` with the data in a file. The code works the same."),
    H("Order is everything"),
    P("Middleware and routes run in the order you write them. The logger must be registered **before** the routes you want it to log. `express.json()` must come before any route that reads `req.body`. If you put a route first, its response ends the chain and the middleware below never runs. When something does not work, a good first check is the order of the `app.use` lines."),
    H("What express.json() does when things go wrong"),
    L("If the request has no JSON content type, `req.body` is `undefined` in Express 5, not an empty object. A line such as `req.body.title` then throws an error. Always check the body before you use it, which is what the validation helper in lesson 10 does.", "If the body is not valid JSON, the parser rejects the request with a 400 error. Without your own error handler, Express answers with an HTML page that contains a stack trace. Lesson 10 replaces that with a clean JSON message.", "By default, the parser accepts bodies up to 100 kilobytes. You can set a smaller limit with `express.json({ limit: '10kb' })`, which is a good protection for an API that only receives small objects."),
    H("Middleware for some routes only"),
    P("You do not have to apply middleware to everything. You can give a path to `app.use('/api', mw)`, or put middleware as an argument before a handler. We will do this in lesson 13 to protect the task routes and leave the login route open."),
    C('js', `function requireJson(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Send JSON with Content-Type: application/json' });
  }
  next();
}

app.post('/api/tasks', requireJson, (req, res) => {
  // runs only if requireJson called next()
});`),
    H("Middleware that other people wrote"),
    P("Many packages are middleware. You install them with npm and add them with `app.use`. Some you will use in this course: `cors` (lesson 14), `helmet` (security headers, lesson 14) and `express-rate-limit` (limit repeated requests, lesson 14). Express itself includes `express.json()`, `express.urlencoded()` for HTML form data, and `express.static('public')`, which serves files from a folder, such as a built React app or images."),
    H("Passing data along with the request"),
    P("A middleware can attach information to `req` so that later functions can use it. For example, an authentication middleware can set `req.user`, and then every route that comes after can read `req.user.id`. That is exactly how the login check in lesson 13 will work. Choose clear names, and do not overwrite built-in properties of `req`."),
    H("A word about error middleware"),
    P("There is a special kind of middleware with **four** parameters: `(err, req, res, next)`. Express recognises it by the count and uses it for errors. It must be registered **after** the routes. You will build one in lesson 10."),
    N("If you ever see `next is not a function` or a request that never finishes, check that each middleware either responds or calls `next()` exactly once, and that you did not forget the third parameter."),
    ...task("Add the logger and `express.json()` to your server and the `/api/echo` route. Send a JSON body with curl and check the log line.", "Move the logger below the echo route and see why it stops logging that route.", "Send an invalid JSON body such as `{bad` and see the HTML error. Keep this in mind for lesson 10.", "Write a middleware called `addRequestId` that sets `req.id` to a random value from `crypto.randomUUID()` and add it to the log line."),
    ...check("Each request prints one log line with method, URL, status and time.", "`/api/echo` returns the JSON you sent.", "Moving the logger after the route proves to you that order matters."),
  ], A('Middleware chain', [
    n('in', 'Request', 'arrives', 0, 0, 'data'), n('log', 'Logger', 'notes the time, next()', 1, 0, 'tool'),
    n('json', 'express.json()', 'fills req.body', 2, 0, 'tool'), n('route', 'Route handler', 'sends response', 3, 0, 'app'),
  ], [
    { say: 'A request comes in. Express runs your middleware in the order you wrote it.', on: ['in'] },
    { say: 'The logger notes the start time and calls next() to pass the request on.', flow: ['in>log:enter'] },
    { say: 'express.json() reads the body, parses the JSON and stores it in req.body.', flow: ['log>json:next()'] },
    { say: 'Finally the route handler runs and sends the response. If a middleware had responded earlier, the chain would have stopped there.', flow: ['json>route:next()'] },
  ]), [
    faq('What happens if middleware never calls next()?', 'If it also sends no response, the request hangs until the client times out. A middleware must either respond or call next().'),
    faq('Why is req.body undefined in my route?', 'The body parser did not run or did not match. Check that express.json() is registered before the route, and that the client sends the Content-Type: application/json header.'),
  ]),

  // ---------------------------------------------------------------- 9
  les(S2, 'build-a-rest-api-crud-routes', 'Build a REST API: Create, Read, Update and Delete Tasks', 'Build a REST API with Express: CRUD Routes',
    'Build a complete Express task API with routes to create, read, update and delete tasks, correct status codes and curl tests. Data is kept in memory first.', [
    P("Now you will put the pieces together. A **REST API** is a set of URLs where each URL stands for a thing, and the HTTP method says what to do with it. For the task list, the pattern is always the same: list, read one, create, update and delete. Programmers call these four jobs **CRUD**: create, read, update, delete. Almost every app you will ever build is CRUD with extra rules added on top."),
    H("The five routes"),
    L("`GET /api/tasks`: list all tasks. Answer `200`.", "`GET /api/tasks/:id`: one task. Answer `200`, or `404`.", "`POST /api/tasks`: create a task from the JSON body. Answer `201` with the new task.", "`PATCH /api/tasks/:id`: change some fields of a task. Answer `200` with the updated task, or `404`.", "`DELETE /api/tasks/:id`: remove it. Answer `204`, or `404`."),
    P("We start with the data in a plain JavaScript array in memory. That keeps the code simple. The data disappears when the server stops, and we fix that in lesson 11. Create `server.js` like this."),
    C('js', code('lesson09-crud.js')),
    P("Read each handler and notice the pattern. For the routes with an id, we find the task in the array, and if it does not exist, we `return` a 404 straight away. Then we do the work. `nextId++` gives each new task a new number, and the `++` adds one **after** the value is used. The delete route filters the task out and checks that the array became shorter, which tells us the task really existed."),
    H("Test every route with curl"),
    C('bash', `curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Ship it"}'
curl -X PATCH http://localhost:3000/api/tasks/3 -H "Content-Type: application/json" -d '{"done":true}'
curl -i -X DELETE http://localhost:3000/api/tasks/3
curl http://localhost:3000/api/tasks`),
    C('text', `{"id":3,"title":"Ship it","done":false}
{"id":3,"title":"Ship it","done":true}
HTTP/1.1 204 No Content
...
[{"id":1,"title":"Learn Node","done":true},{"id":2,"title":"Learn Express","done":false}]`),
    P("Each call matches what you expect: the new task has id 3, the update marks it done, the delete answers with status 204 and no body, and the last list is back to the two original tasks. Doing this by hand is slow but valuable. It shows you exactly what a front end will send."),
    H("What is still wrong?"),
    P("This API works for polite clients, but it trusts everything. Try sending an empty object to the create route."),
    C('bash', `curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{}'`),
    C('text', `{"id":4,"done":false}`),
    P("The server created a task with no title. Worse, a client could send `{ \"title\": 12345 }`, a huge text, or the wrong type for `done`, and `PATCH` would store it. Never trust data from outside your program. In the next lesson you will add validation and proper error handling. Other limits of this version: anyone can see and change every task, because there is no login yet, and everything is lost on restart."),
    H("PUT or PATCH?"),
    P("Both change an existing thing. **PUT** means replace the whole thing with the data sent, so the client must send every field. **PATCH** means change only the fields that were sent. For task apps, where you might only tick a box, PATCH is the more practical one. Many APIs support both. We use PATCH."),
    H("Why return the new object?"),
    P("After a create or an update, we send back the full task as the server now stores it. The client then has the id and any fields that the server added, so it does not need a second request. It is a small habit that makes front-end code much simpler."),
    H("Using the API from a front end"),
    P("A React app can now call this API with `fetch`. For example, `fetch('http://localhost:3000/api/tasks')` returns the list. A browser blocks requests from one origin to another unless the server allows it. That rule is called CORS and we will configure it in lesson 14, together with the other security settings."),
    ...task("Create `server.js` with the CRUD routes and test all five routes with curl.", "Send a PATCH to a task that does not exist. Check the status code is 404.", "Add `GET /api/tasks?done=false` support to the list route (you did it in lesson 7).", "Write down three kinds of bad data a client could send that this code would accept."),
    ...check("Create, update, delete and list all return the results shown above.", "The delete route returns 204 with no body, and a second delete of the same id returns 404.", "You listed at least three bad inputs the server does not reject yet."),
  ], A('CRUD on tasks', [
    n('post', 'POST', 'create a task', 0, 0, 'user'), n('get', 'GET', 'list or read', 1, 0, 'user'),
    n('patch', 'PATCH', 'change fields', 2, 0, 'user'), n('del', 'DELETE', 'remove a task', 3, 0, 'user'),
    n('api', 'Task API', '/api/tasks', 1, 1, 'app'), n('data', 'Task list', 'array in memory', 2, 1, 'data'),
  ], [
    { say: 'A client uses four kinds of requests to work with tasks: create, read, change and delete.', on: ['post', 'get', 'patch', 'del'] },
    { say: 'Each request goes to the same API address, and the method tells the API what to do.', flow: ['get>api:request'] },
    { say: 'The API reads or changes the list of tasks. For now the list lives in memory.', flow: ['api>data:read or write'] },
    { say: 'The API answers with a status code, such as 200, 201, 204 or 404, and usually the task as JSON.', on: ['api'] },
  ]), [
    faq('What does CRUD mean?', 'Create, read, update and delete: the four basic jobs most apps do with data. In HTTP they are POST, GET, PATCH or PUT, and DELETE.'),
    faq('Why return 201 instead of 200 after creating something?', '201 Created tells the client that a new resource was made. It is more precise than 200, and many tools and clients expect it.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S2, 'validation-and-error-handling-in-express', 'Validation and Error Handling in Express', 'Validate Input and Handle Errors in Express',
    'Never trust client data: validate request bodies, return clear 400 and 404 errors, and write one central Express error handler with no leaked stack traces.', [
    P("A server receives data from strangers, so everything in `req.body`, `req.params` and `req.query` must be treated as untrusted until you have checked it. Validation is your first line of defence against broken data and many attacks. Error handling is the second: it makes sure that when something fails, the client receives a clear, safe message and not a crash or a page of internal details. In this lesson you will add both to the task API."),
    H("Write a validation function"),
    P("You can use a library such as Zod or Joi, and many teams do. For a small API a short function is enough, and it shows exactly what validation means. This function checks a task. It returns either a clean value or an error message. The `partial` option is for PATCH, where fields are optional."),
    C('js', code('final-validate.js')),
    L("It checks the **type** of every field. A title must be a text, not a number or an array.", "It **trims** spaces and sets a **maximum length**.", "It builds a **new object** with only the allowed fields. Extra fields sent by the client, such as `id` or `ownerId`, are ignored. This stops a client from changing fields they should not control.", "It returns the first problem as a plain message that the client can show to a user."),
    H("Use it in the routes"),
    P("In the create and update routes, call it first, and answer 400 if there is an error. `400 Bad Request` means the client sent something wrong. Compare this with 500, which means the server itself failed. Never use 500 for bad input."),
    C('js', code('lesson10-crud.js')),
    H("404 for unknown routes"),
    P("When no route matches a request, Express sends a plain HTML message by default. For an API you want JSON. Add a middleware **after** all routes. Because it comes last, it only runs when nothing else answered."),
    H("One central error handler"),
    P("The error handler is a middleware with four parameters, registered **last**. Express sends to it any error that is thrown in a handler, passed to `next(err)`, or caused by a rejected promise in an async handler (this works automatically in Express 5). It is the one place where you decide how errors look to the client."),
    L("Errors you can predict, such as invalid JSON or a body that is too big, get a clear 400 or 413 message. Those errors come from `express.json()` and have an `err.type`.", "Everything else is a surprise. Log the full error on the **server** with `console.error`, and send the client only a general `Something went wrong` with status 500.", "Never send `err.stack` or `err.message` of unexpected errors to the client. They can reveal file paths, library versions and database details that help an attacker."),
    P("The sample above includes a route `GET /api/crash` that throws on purpose. Test the handler."),
    C('bash', `curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{}'
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{bad'
curl http://localhost:3000/api/crash
curl http://localhost:3000/nothing`),
    C('text', `{"error":"title is required"}
{"error":"Body is not valid JSON"}
{"error":"Something went wrong"}
{"error":"Not found"}`),
    P("Each failure now returns clean JSON with the right status code. In the server terminal you will see the full stack trace for the crash, which is what you want for debugging. The client never sees it. Remove the `/api/crash` route after testing, because it is only for practice."),
    H("Express 4 note"),
    P("If you ever work on an Express 4 project, async handlers need extra care. Wrap them, or call `next(err)` inside `catch`, because errors in promises are not caught by Express 4. That is the main reason many older tutorials contain wrappers such as `asyncHandler`. In Express 5 you do not need them."),
    H("Use consistent error responses"),
    L("Always the same shape, for example `{ \"error\": \"message\" }`, so the front end can handle all errors in one place.", "Use codes that people can act on: 400 invalid data, 401 not logged in, 403 not allowed, 404 not found, 409 conflict (for example, an email already used), 413 too large, 429 too many requests, 500 server error.", "Write messages for the person who will read them. They should say what to fix. They should not reveal how the server works."),
    N("Validation on the front end is for convenience. Validation on the server is for security. A client can always bypass your front end, so the server must check everything again."),
    ...task("Add `validate.js` and call `checkTask` in the create route. Test an empty body, a number as title and a 200-character title.", "Add the 404 middleware and the error handler at the end of the file. Test the four curl commands above.", "Change the validation to also accept an optional `priority` that must be `low`, `medium` or `high`.", "Make `GET /api/tasks/:id` return 400 when the id is not a whole number, and 404 when it is a number that does not exist."),
    ...check("An empty or wrong-typed title returns 400 with a clear message.", "Invalid JSON returns 400 JSON, not an HTML page.", "The crash route returns `Something went wrong`, and the stack trace is only in the server terminal."),
  ], A('Safe request handling', [
    n('in', 'Client data', 'untrusted', 0, 0, 'user'), n('val', 'Validate', 'type, length, fields', 1, 0, 'check'),
    n('work', 'Do the work', 'save, read, update', 2, 0, 'app'), n('err', 'Error handler', 'clean JSON message', 1, 1, 'tool'),
  ], [
    { say: 'Everything that arrives from a client is untrusted until you check it.', on: ['in'] },
    { say: 'The validation step checks types, length and allowed fields. Bad data is turned away with a 400 message.', flow: ['in>val:check'] },
    { say: 'Good data goes on to the real work, such as saving the task.', flow: ['val>work:valid'] },
    { say: 'If anything fails, the central error handler logs the details and sends a safe, short message to the client.', flow: ['val>err:invalid'] },
  ]), [
    faq('Should I use a validation library?', 'For bigger projects, yes: libraries like Zod or Joi save time and handle many cases. For a small API, a short function is enough and shows what validation does.'),
    faq('Why not send the error message to the client?', 'Unexpected error messages and stack traces can reveal file paths, library versions or database details that help attackers. Log them on the server and send a general message.'),
  ]),
];
