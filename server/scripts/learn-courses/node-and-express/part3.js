import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';

const S3 = 'Data, Login and Going Live';

export const lessons = [
  // ---------------------------------------------------------------- 11
  les(S3, 'environment-variables-and-saving-data-to-a-file', 'Environment Variables and Saving Your Data to a File', 'Env Variables and a File Store in Node.js',
    'Keep settings and secrets out of your code with environment variables and a .env file, and save API data to a JSON file so it survives a restart.', [
    P("Two problems remain in the task API. The settings, such as the port number, are written inside the code, and the data vanishes every time the server restarts. In this lesson you will fix both. First you will learn about **environment variables**, the standard way to give a program its settings and secrets. Then you will move the data into a small store that saves tasks to a JSON file."),
    H("Why settings do not belong in code"),
    P("Your program runs in different places: your laptop, a test machine and a live server. Each place needs different values: the port, the address of the database, the secret used for logins. If these values sit inside your code, you must edit the code for each place, and passwords end up in git, where many people can see them and where they stay in the history forever. The fix is to keep settings **outside** the code, in the environment, and have the code read them."),
    H("process.env"),
    P("Every running program has a set of **environment variables**: named values given to it by the system that starts it. In Node.js they are in the object `process.env`. All values are strings, or `undefined` when missing. Read the port like this."),
    C('js', `const port = Number(process.env.PORT) || 3000;`),
    P("The `Number(...)` converts text to a number. If `PORT` is not set, `Number(undefined)` is `NaN`, which counts as false, so `|| 3000` supplies the default. Hosting services and process managers often set `PORT` for you, which is why the code should always read it."),
    H("A .env file"),
    P("Typing variables in the terminal for every run is tedious. The usual solution is a text file named `.env` in the project folder, with one `NAME=value` per line. Recent versions of Node.js can load it directly with the flag `--env-file=.env`, which is what the `start` and `dev` scripts from lesson 2 use. You do not need an extra package."),
    C('text', `# .env  (never commit this file)
PORT=3100
JWT_SECRET=change-me-to-a-long-random-string
DATA_FILE=./data/tasks.json`),
    L("Add `.env` to `.gitignore` **now**, before your first commit.", "Commit a copy named `.env.example` with the variable names and harmless sample values, so other people know what to set.", "No spaces around `=`, and no quotes needed for simple values.", "On a live server, do not upload a `.env` file at all if your host has a place to set environment variables. Use that instead."),
    N("If you ever commit a real secret by mistake, deleting it in the next commit is not enough, because it stays in the history. Change the secret straight away, as if it had been stolen."),
    H("Fail early when something is missing"),
    P("If a required setting is missing, the program should stop at start-up with a clear message, and not fail in a confusing way later. You will see this in the final `server.js` in lesson 15, where a missing or short `JWT_SECRET` stops the server."),
    H("A store that saves to a file"),
    P("Now the data. We move all work with tasks into a separate module, a **store**. The routes will call the store and will not care how data is kept. Today the store uses a file. In the next lesson, you can replace it with a database without changing the routes much. That is why separating the two is a good habit."),
    C('js', code('lesson11-store.js')),
    P("Take your time with this file. `createStore(file)` returns an object with five functions. The `ready` promise loads the file once at start-up. If the file does not exist, which is normal the first time, `ENOENT` is ignored and the list starts empty. Any other error is thrown, so a damaged file is not silently replaced. Each function starts with `await ready`, so requests that arrive during start-up wait for the data to load. After each change, `save()` writes the whole list to the file. The next id is the highest id so far plus one, so ids stay unique after a restart."),
    P("Now use the store in the server. The routes become short, because the store does the work and `checkTask` from lesson 10 does the validation. Put `validate.js` (from lesson 10) and `store.js` (this lesson's store) in the project folder next to `server.js`."),
    C('js', code('lesson11-server.js')),
    P("Start the server with `npm run dev`, create a task, then stop the server and start it again. The task is still there, and `data/tasks.json` contains it."),
    C('bash', `curl -X POST http://localhost:3100/api/tasks -H "Content-Type: application/json" -d '{"title":"Saved"}'
curl http://localhost:3100/api/tasks`),
    C('text', `{"id":1,"title":"Saved","done":false,"createdAt":"2026-10-28T04:10:56.259Z"}
[{"id":1,"title":"Saved","done":false,"createdAt":"2026-10-28T04:10:56.259Z"}]`),
    P("The dates in your output will show the time of your own request. Create the `data` folder first if it does not exist, because `writeFile` creates files but not folders."),
    H("Honest limits of a file store"),
    L("It rewrites the whole file on every change, so it slows down as data grows.", "If two changes arrive at the same moment, the second write can overwrite the first. Writes of tiny files are quick, so this is rare in a practice project, but it is a real risk on a busy server.", "It lives on one machine. If you run several copies of the server, each has its own data.", "There are no searches, indexes or relationships.", "On many hosting services, the file system is wiped on every deploy. A file store is for learning and tiny tools. Anything that matters belongs in a database, which is the next lesson."),
    ...task("Create `.env` and `.env.example`, and add `.env` to `.gitignore`.", "Use `process.env.PORT` in the server and start it on a different port by changing `.env`.", "Add `store.js` and move the routes to use it. Create a task, restart the server and check that it survived.", "Delete `data/tasks.json` and start the server. Check it starts with an empty list and does not crash."),
    ...check("`npm run dev` starts on the port from `.env`.", "A task created before a restart is still listed after it.", "`git status` does not list `.env`."),
  ], A('Settings and data outside the code', [
    n('env', '.env file', 'port, secrets', 0, 0, 'data'), n('proc', 'process.env', 'read at start-up', 1, 0, 'tool'),
    n('app', 'Your server', 'routes + store', 2, 0, 'app'), n('file', 'tasks.json', 'saved data', 3, 0, 'out'),
  ], [
    { say: 'Settings and secrets live in a .env file that is not committed to git.', on: ['env'] },
    { say: 'Node loads the file and your code reads the values from process.env.', flow: ['env>proc:--env-file'] },
    { say: 'The server uses the settings and calls the store to work with tasks.', flow: ['proc>app:settings'] },
    { say: 'The store saves the tasks to a file after every change, so they survive a restart.', flow: ['app>file:save'] },
  ]), [
    faq('Why not put secrets directly in the code?', 'Code is shared and stored in git, so a secret in it can leak and stays in the history. Environment variables keep secrets outside the code and let each machine use its own values.'),
    faq('Do I need the dotenv package?', 'Not with current Node.js versions. The --env-file flag loads a .env file for you. The dotenv package is still common in older projects.'),
  ]),

  // ---------------------------------------------------------------- 12
  les(S3, 'mongodb-and-mongoose-for-your-api', 'MongoDB and Mongoose: Store Your API Data in a Real Database', 'MongoDB and Mongoose with Express',
    'Connect your Express API to MongoDB with Mongoose: schemas, models, CRUD queries, validation and bad ids. Use a local install or an Atlas cluster.', [
    P("A file is fine for learning, but real applications keep data in a database. MongoDB is a popular choice for Node.js projects, and it is the M in the MERN stack. It stores data as **documents**, which look like JavaScript objects, grouped in **collections**, which are like tables. **Mongoose** is a library that sits between your code and MongoDB and adds structure: schemas, validation and handy query functions. In this lesson you will replace the file store with MongoDB."),
    N("Set-up note: the code in this lesson follows the Mongoose documentation. You need a running MongoDB to try it. Install the free Community Server on your computer, or create a free cluster on MongoDB Atlas, the company's hosted service. Both are explained on mongodb.com. The free hosted tier has limits and its terms can change, so check the current page. Never use production data while you practise."),
    H("Install and connect"),
    P("Install the library in your project, and add the connection string to `.env`. For a local server it looks like `mongodb://127.0.0.1:27017/taskapi`. Atlas gives you a longer address that includes a user name and a password, and so it is a secret: it belongs in `.env` and never in git."),
    C('bash', `npm install mongoose`),
    C('text', `# .env
MONGODB_URI=mongodb://127.0.0.1:27017/taskapi`),
    C('js', code('lesson12-connect.js')),
    P("`mongoose.connect` returns a promise. `await` it before you start the server, so no request arrives before the database is ready. The option `serverSelectionTimeoutMS` makes the program fail after five seconds if it cannot reach the database, and not wait for a long time. In `server.js`, put the connect step before `app.listen`."),
    H("Schemas and models"),
    P("A **schema** describes the shape of a document: its fields, their types and rules. A **model** is built from a schema and gives you the functions to read and write that collection. Mongoose creates the collection from the model name, in lowercase and plural, so `Task` becomes `tasks`."),
    C('js', code('lesson12-models.js')),
    L("`required` with a message: saving without a title fails with that message.", "`trim` removes spaces at both ends. `maxlength` limits the length.", "`default: false` fills in `done` when it is not given.", "`timestamps: true` adds `createdAt` and `updatedAt` and keeps them up to date.", "Mongoose adds an `_id` field to every document. It is an `ObjectId`, a 24-character identifier, and not a small number like our earlier ids."),
    P("You can check a document without a database by calling `await new Task({ title: '   ' }).validate()`. It rejects with an error whose `errors.title.message` is `title is required`, because trimming leaves an empty text. A document with the title ` Read docs ` passes, and its title becomes `Read docs`. Schema rules are a second layer of protection after your own `checkTask` function."),
    H("The routes with Mongoose"),
    P("The routes now call the model. Compare them with the store version. Every function is async, which Express 5 handles for us."),
    C('js', code('lesson12-routes.js')),
    P("Look at the functions used. `Task.find(filter)` returns the matching documents, `.sort({ createdAt: -1 })` puts the newest first and `.limit(100)` caps the list, so one request can never pull in a million documents. `findById` finds one. `Task.create(value)` validates and inserts. `findByIdAndUpdate` changes a document, and the option `returnDocument: 'after'` returns the new version, while `runValidators: true` applies the schema rules to updates, which Mongoose does not do by default. `findByIdAndDelete` removes it."),
    P("The small `validId` middleware matters. If a client calls `/api/tasks/abc`, Mongoose cannot turn `abc` into an `ObjectId`, and it throws a `CastError`. We check with `mongoose.isValidObjectId` first and answer 404, which is what the client should see."),
    H("Handling database errors"),
    L("A **duplicate key** error (code `11000`) happens when a unique field repeats, for example two users with the same email. Catch it and answer 409.", "A **validation** error from Mongoose has the name `ValidationError`. Answer 400.", "A connection problem is a server problem. Let it reach the error handler, which answers 500 and logs the details."),
    H("Safety rules for databases"),
    L("Never build a query from raw request data. For example, `Task.find(req.body)` lets a client send operators such as `{ \"$gt\": \"\" }` and change the meaning of the query. This kind of attack is called NoSQL injection. Pick the fields you accept yourself, as `checkTask` does, and check that they are the types you expect.", "Do not let clients choose which fields to update. `checkTask` copies only `title` and `done`.", "Use a database user with only the rights the app needs, never an admin account.", "Limit the size of lists with `.limit()` and paging.", "Keep backups, and test restoring one."),
    P("When you are ready, ask which indexes your queries need. An index lets MongoDB find documents without reading the whole collection. A field you search or sort by often, such as `owner` or `createdAt`, is a candidate. Add `index: true` to the field, and measure before you add many, since indexes cost space and slow down writes."),
    ...task("Set up MongoDB locally or on Atlas. Put the connection string in `.env`.", "Install Mongoose, add `models.js` and connect before `app.listen`.", "Replace the store with the Mongoose routes. Create, read, update and delete a task with curl, and look at the document in a viewer such as MongoDB Compass.", "Try `/api/tasks/abc` and a valid-looking id that does not exist. Both should give 404."),
    ...check("A task you created is still there after you restart the server.", "Updating `done` returns the document with the new value.", "`/api/tasks/abc` returns 404 JSON and not a 500 error."),
  ], A('Express, Mongoose and MongoDB', [
    n('route', 'Express route', 'validate input', 0, 0, 'app'), n('model', 'Mongoose model', 'schema rules', 1, 0, 'tool'),
    n('db', 'MongoDB', 'documents', 2, 0, 'data'), n('json', 'JSON response', 'to the client', 3, 0, 'out'),
  ], [
    { say: 'An Express route receives a request and checks the input.', on: ['route'] },
    { say: 'It calls the Mongoose model, for example Task.create or Task.find.', flow: ['route>model:call'] },
    { say: 'Mongoose applies the schema rules and sends the query to MongoDB, which stores or returns documents.', flow: ['model>db:query'] },
    { say: 'The result comes back and the route sends it to the client as JSON.', flow: ['db>json:result'] },
  ]), [
    faq('What is the difference between MongoDB and Mongoose?', 'MongoDB is the database. Mongoose is a Node.js library that adds schemas, validation and convenient query functions on top of it.'),
    faq('Why is my _id not a number?', 'MongoDB creates a 24-character ObjectId for every document. Treat it as text, and check ids with mongoose.isValidObjectId before querying.'),
  ]),

  // ---------------------------------------------------------------- 13
  les(S3, 'user-login-with-password-hashing-and-jwt', 'User Login: Password Hashing and JSON Web Tokens', 'Login in Node.js: Password Hashing and JWT',
    'Add registration and login to your API: hash passwords with bcrypt, issue and verify JSON Web Tokens, and keep each person’s tasks private.', [
    P("So far anyone can read and change every task. A real app needs accounts, and it needs to know who is making each request. In this lesson you will add registration, login and a check that protects the task routes, so each user sees only their own tasks. Authentication is easy to get subtly wrong, so we will go slowly and explain the reason for each choice."),
    H("Rule one: never store a password"),
    P("A database can be stolen, and staff can read it. If it holds real passwords, every account is at risk, and because people reuse passwords, accounts on other sites too. Instead, store a **hash**: the result of a one-way mathematical function. You cannot turn a hash back into the password, but you can hash what the user types at login and compare the two. Use a slow function made for passwords, such as **bcrypt**, which also adds a random **salt** so that two users with the same password have different hashes. Never use plain SHA or MD5 for passwords, and never invent your own method."),
    C('bash', `npm install bcryptjs jsonwebtoken`),
    P("We use `bcryptjs`, a pure JavaScript version that installs without a compiler on any system. The `bcrypt` package is faster, but it has native parts. The functions are the same: `bcrypt.hash(password, 10)` and `bcrypt.compare(password, hash)`. The number 10 is the cost: higher is slower and harder to break."),
    H("Rule two: prove who you are with a token"),
    P("HTTP has no memory. Each request stands alone, so after login, the client needs a way to prove its identity on every later request. One common way is a **JSON Web Token (JWT)**. At login, the server creates a signed text that contains the user's id and an expiry time. The client sends it back in the `Authorization` header with every request: `Authorization: Bearer <token>`. The server checks the signature with its secret. If the signature is valid and the token has not expired, the server trusts the contents. Nobody can change the contents without the secret, because the signature would no longer match."),
    L("A JWT is signed, **not encrypted**. Anyone who holds it can read what is inside. Never put passwords or private data in it.", "The secret must be long and random, and stored only in the environment. Whoever has it can create tokens for any user.", "Give tokens a short life, as we do with `expiresIn: '1h'`. A stolen token then stops working soon.", "Always use HTTPS in production, so tokens and passwords cannot be read on the way."),
    H("The login routes"),
    P("The router handles registration and login. Read it carefully, especially the comments in the text below the code."),
    C('js', code('final-routes-auth.js')),
    L("The check of the email and password length happens **before** any work is done. The minimum of 8 characters is a modest rule. Longer is better, and it is wise to allow long passphrases.", "The email is lowercased, so `Asha@Example.com` and `asha@example.com` are the same account.", "A duplicate email returns `409 Conflict`.", "At login, a wrong email and a wrong password give **the same** message. A different message would tell an attacker which emails have accounts.", "`await bcrypt.compare` is slow on purpose, so guessing is slow."),
    N("In this course the users are kept in a `Map` in memory, so they disappear when the server restarts. That is only to keep the lesson short. In a real application, store users in your database, with a unique index on the email, as lesson 12 showed. The hashing and tokens work in exactly the same way."),
    H("The check that protects routes"),
    P("This middleware reads the header, verifies the token and sets `req.user`. Any route placed after it can trust `req.user`. If the token is missing or wrong, it answers 401 and the route never runs."),
    C('js', code('final-middleware-auth.js')),
    H("Each user sees only their own tasks"),
    P("Logging in is not enough. The routes must also use `req.user.id` so that one user cannot read or change another user's tasks. In the store, every function now takes the owner's id, and finds a task only if both the id and the owner match. Other users' tasks then look like they do not exist, so the answer is 404 and not 403. Here is the complete store. Compare it with lesson 11: every function now takes `ownerId` first."),
    C('js', code('final-store.js')),
    P("And the task router. The first argument of each store call is `req.user.id`, which the middleware set. Create a task, and the owner is stored with it."),
    C('js', code('final-routes-tasks.js')),
    P("The app mounts everything: the auth routes are open, and the task routes sit behind `requireAuth`."),
    C('js', `app.use('/api/auth', authRouter({ secret, users }));
app.use('/api/tasks', requireAuth(secret), tasksRouter(store));`),
    H("Try the whole flow"),
    C('bash', `# 1. register and keep the token
curl -X POST http://localhost:3100/api/auth/register -H "Content-Type: application/json" -d '{"email":"asha@example.com","password":"correct-horse"}'

# 2. no token: refused
curl -X POST http://localhost:3100/api/tasks -H "Content-Type: application/json" -d '{"title":"x"}'

# 3. with the token: works
curl -X POST http://localhost:3100/api/tasks -H "Authorization: Bearer PASTE_TOKEN_HERE" -H "Content-Type: application/json" -d '{"title":"Learn Express"}'`),
    C('text', `{"token":"eyJhbGciOiJIUzI1NiIs..."}
{"error":"Log in first"}
{"id":1,"ownerId":1,"title":"Learn Express","done":false,"createdAt":"2026-10-28T04:08:15.718Z"}`),
    P("The token in your output will be a different long text. We also tested the other cases: registering the same email twice returns 409 with `That email is already registered`, a wrong password returns 401 with `Wrong email or password`, and a bad token returns 401. Notice that the task response includes `ownerId`. For this exercise that is harmless, but in a real API you would decide which fields to send, and leave out internal ones."),
    H("What this does not cover"),
    L("**Logout and revoking tokens.** A pure JWT cannot be cancelled before it expires. Short lifetimes help. Bigger apps add refresh tokens or a server-side list.", "**Where the client keeps the token.** Browser storage is easy but readable by any script on the page. A cookie with the `HttpOnly` flag is safer against script theft but needs protection against cross-site requests. Each choice has trade-offs. Read about both before you build a real front end.", "**Password reset, email checks, two-step login.** Use a tested service or library for these, and do not write them from scratch for real users.", "**Roles.** Add a `role` to the token for things like admin pages and check it in a middleware."),
    ...task("Install `bcryptjs` and `jsonwebtoken` and add the auth router and the `requireAuth` middleware.", "Register two users. Create a task as the first user and check that the second user cannot see it, and gets 404 when asking for its id.", "Decode the middle part of a token with `Buffer.from(part, 'base64url').toString()` and look at what is inside. Confirm that there is no password in it.", "Set `expiresIn` to `'5s'`, wait, and try again. You should get the message about an expired token."),
    ...check("Registering returns 201 and a token, and registering the same email returns 409.", "A request without a token gets 401, and with a valid token it works.", "The second user cannot read, change or delete the first user's tasks."),
  ], A('Login and token check', [
    n('login', 'Login', 'email + password', 0, 0, 'user'), n('hash', 'bcrypt compare', 'checks the hash', 1, 0, 'check'),
    n('token', 'JWT token', 'signed, expires', 2, 0, 'data'), n('guard', 'requireAuth', 'verifies each request', 3, 0, 'app'),
  ], [
    { say: 'The user sends an email and a password to the login route.', on: ['login'] },
    { say: 'The server compares the password with the stored hash using bcrypt. The real password is never stored.', flow: ['login>hash:compare'] },
    { say: 'If it matches, the server signs a token that holds the user id and an expiry time.', flow: ['hash>token:sign'] },
    { say: 'On later requests, the client sends the token. The requireAuth middleware verifies it before any task route runs.', flow: ['token>guard:send'] },
  ]), [
    faq('Why hash passwords instead of encrypting them?', 'Encryption can be reversed with a key. A hash cannot be reversed, so a stolen database does not give attackers the passwords. Use a slow password hash such as bcrypt.'),
    faq('Is a JWT secret or private?', 'The signature stops people changing it, but the contents are only encoded, not encrypted. Anyone with the token can read it, so never put private data in it.'),
  ]),

  // ---------------------------------------------------------------- 14
  les(S3, 'secure-your-express-api-cors-helmet-rate-limit', 'Secure Your Express API: CORS, Helmet and Rate Limiting', 'Secure an Express API: CORS, Helmet, Limits',
    'Harden your Express API: set CORS for your front end, add Helmet headers, limit repeated requests, cap body size and avoid common mistakes.', [
    P("An API on the internet will be probed by strangers and by automated scripts within hours. You do not need to be a security expert to block the most common problems. A few well-known libraries and some careful habits remove a great deal of risk. This lesson adds them to the task API, and ends with a checklist to use before every launch. Security is never finished, and no list can promise that an app is safe. Treat this as a solid beginning."),
    H("CORS: allow your front end, and only it"),
    P("Browsers have a rule: a web page may only call APIs on its **own origin** (the same protocol, domain and port) unless the API says otherwise. If your React app runs at `http://localhost:5173` and your API at `http://localhost:3100`, the browser blocks the calls. The API opts in with **CORS** headers, and the `cors` package sets them. Allow the exact origin of your front end, and not every origin."),
    C('bash', `npm install cors helmet express-rate-limit`),
    C('js', `app.use(cors({ origin: allowedOrigin || false }));   // false: no cross-origin access`),
    L("CORS is enforced by **browsers**. It does not protect your API from `curl` or scripts. Authentication and validation do that.", "Do not use `origin: '*'` together with logins, unless you understand the effect.", "When you test with curl and a different `Origin` header, the server still answers. A string origin makes the package always send your configured origin, and it is the **browser** that refuses to give the response to a page from another origin.", "Read the allowed origin from `.env`, so development and production can differ."),
    H("Helmet: safer headers"),
    P("`helmet` is a middleware that sets a group of HTTP headers that tell browsers to be careful. For example, `X-Content-Type-Options: nosniff` stops browsers guessing types, `Strict-Transport-Security` asks them to use HTTPS, and `Content-Security-Policy` limits where scripts may load from. It is one line, and it is a good default for any Express app. Express also announces itself with an `X-Powered-By: Express` header, which only helps attackers, so switch it off with `app.disable('x-powered-by')`."),
    H("Rate limiting"),
    P("Without a limit, a script can try thousands of passwords a minute against your login, or overload your server. `express-rate-limit` counts requests per client address and answers `429 Too Many Requests` after a limit. Use a strict limit on login and registration, and a more relaxed one for the rest."),
    C('js', `const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  limit: 20,                  // 20 requests per window per client
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter, authRouter({ secret, users }));`),
    P("We tested it: the first 20 login attempts get `401` (wrong password), and the 21st and 22nd get `429` with a `Retry-After` header. The store behind this limiter is the memory of one process. If you run several copies of your server, or restart often, use a shared store such as Redis. Also, behind a proxy like nginx, every request seems to come from the proxy's address unless you tell Express to trust it with `app.set('trust proxy', 1)`. Do that only when a proxy really sits in front of Node, because otherwise clients can fake their address."),
    H("Limit what you accept"),
    L("`express.json({ limit: '10kb' })`: a task needs only a few hundred bytes. A small limit prevents huge bodies from using up memory. Bigger bodies get `413`, which our error handler explains.", "Validate every field, as in lesson 10.", "Cap list sizes and page through them.", "Do not let users choose file paths or run commands with their input."),
    H("The full app so far"),
    P("Here is the whole `app.js` with everything combined. It exports a function that builds the app, which is useful for testing in the next lesson, and it is the only place that knows the order of middleware."),
    C('js', code('final-app.js')),
    P("Read the order. Security headers and CORS come first, then the body parser, then the logger. The login routes are limited. The task routes need a login. The 404 handler and the error handler are last. We checked the headers with curl and saw `Content-Security-Policy`, `Strict-Transport-Security` and `X-Content-Type-Options`, and no `X-Powered-By`."),
    H("Habits that protect you"),
    L("**Keep secrets out of git** and out of logs. Do not log passwords, tokens or full request bodies.", "**Keep dependencies updated.** Run `npm audit` regularly and read what it says before you run automatic fixes.", "**Use HTTPS** everywhere in production.", "**Give each secret one job**, and replace it if you think it leaked.", "**Check ownership** of every record, not just login.", "**Return the same error for a wrong email and a wrong password.**", "**Run the app as a normal user**, not as root, on your server.", "**Back up your data** and test restoring."),
    N("These steps reduce common risks. They do not make an app unhackable. If your app holds sensitive data such as health, payment or children's information, rules and laws apply in many countries, and you should get qualified advice."),
    ...task("Install `cors`, `helmet` and `express-rate-limit` and add them to `app.js` in the order shown.", "Run `curl -I` on `/api/health` and check for the security headers. Check that `X-Powered-By` is gone.", "Send 22 wrong logins in a loop and watch the status change to 429.", "Send a JSON body of more than 10 kilobytes and see the 413 response."),
    ...check("The health check response has `X-Content-Type-Options` and no `X-Powered-By`.", "The 21st login attempt within 15 minutes returns 429.", "A request with an oversized body returns 413 with a JSON message."),
  ], A('Layers of protection', [
    n('req', 'Request', 'from anywhere', 0, 0, 'user'), n('helmet', 'Helmet + CORS', 'headers, allowed origin', 1, 0, 'tool'),
    n('limit', 'Rate limit', 'too many? 429', 2, 0, 'check'), n('auth', 'Login + validation', 'only valid data', 3, 0, 'app'),
  ], [
    { say: 'Requests arrive from anywhere on the internet, some friendly and some not.', on: ['req'] },
    { say: 'Helmet adds safe headers and CORS only lets your own front end call the API from a browser.', flow: ['req>helmet:first'] },
    { say: 'The rate limiter slows down clients that send too many requests, which blocks password guessing.', flow: ['helmet>limit:then'] },
    { say: 'Login checks and validation make sure only the right people send only valid data to your routes.', flow: ['limit>auth:then'] },
  ]), [
    faq('Does CORS protect my API from attackers?', 'No. CORS is enforced by browsers to protect users of web pages. Scripts and tools such as curl ignore it, so you still need authentication, validation and rate limits.'),
    faq('What is a good rate limit?', 'It depends on your app. Use a strict limit for login and registration, such as a few dozen attempts per 15 minutes per client, and a more relaxed one for ordinary routes. Watch real traffic and adjust.'),
  ]),

  // ---------------------------------------------------------------- 15
  les(S3, 'test-and-deploy-your-node-api', 'Test and Deploy Your Node.js API: node:test, pm2 and nginx', 'Test and Deploy a Node.js API',
    'Write API tests with the built-in node:test runner, then take your Express API live with pm2, an nginx proxy, HTTPS and a launch checklist.', [
    P("You now have a working API with validation, login and security. Two jobs remain, and both are about trust. **Tests** let you change code without fear, because a failing test tells you what you broke. **Deployment** puts the API on a server where other people can reach it. In this final lesson you will write tests with the test runner that is built into Node.js, then walk through the steps to run the API on a Linux server."),
    H("Make the app testable"),
    P("In lesson 14, `app.js` exports a function `createApp` and does not call `listen`. A separate `server.js` reads the settings, creates the app and starts it. This split is what makes testing easy: a test can create its own app with its own settings, start it on a random free port and talk to it with `fetch`, with no need for any extra library."),
    C('js', code('final-server.js')),
    P("The server file also does two production jobs. It refuses to start without a long enough secret. And it listens for `SIGTERM`, the signal that process managers send to stop a program, and closes the server tidily so running requests can finish."),
    H("Tests with node:test"),
    P("Node.js includes a test runner. A test is a function with a name. `assert` checks that things are as expected. The file below tests the main paths: a login is required, a user can register and create a task, bad input is rejected, and a task can be updated and deleted."),
    C('js', code('final-api.test.js')),
    P("Look at the structure. `test.before` starts the app on port `0`, which means the system picks any free port, and `test.after` stops it. The small `call` helper sends JSON and adds the token when we have one. Each `test(...)` block checks one behaviour. The tests run in order and share the `token` variable, which is simple, but it also means that one failure can cause later ones to fail. For bigger suites, give each test its own setup."),
    C('bash', `npm test`),
    C('text', `ok 1 - tasks need a login
ok 2 - register, then create and read a task
ok 3 - bad input is rejected with 400
ok 4 - a task can be updated and deleted
# tests 4
# pass 4
# fail 0`),
    P("The real output also shows timings and other details, and the timings will be different on your computer. The `test` script runs `node --test`, which finds files that end in `.test.js` and runs them. Make a habit of running the tests before every commit. When you find a bug, write a test that fails because of it, then fix the code until the test passes. The bug can then never return unnoticed."),
    H("Preparing for production"),
    L("Set `NODE_ENV=production`. Express and many libraries then switch to faster, safer behaviour. For example, the default error page no longer shows stack traces.", "Install only what you need: `npm install --omit=dev`.", "Set every secret and setting in the server's environment: `JWT_SECRET`, `MONGODB_URI` or `DATA_FILE`, `CLIENT_ORIGIN`, `PORT`.", "Use a **long random** `JWT_SECRET` that exists only on the server. You can make one with `node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\"`.", "Use a database, not a JSON file, for anything you cannot afford to lose."),
    H("Keep it running with pm2"),
    P("If you start the API with `node server.js` in a terminal, it stops when you close the terminal or when it crashes. A **process manager** keeps it running, restarts it after a crash and starts it again after a reboot. **pm2** is a popular one for Node.js. These commands run on your server."),
    C('bash', `npm install -g pm2
pm2 start server.js --name taskapi --node-args="--env-file=.env"
pm2 logs taskapi          # watch the logs
pm2 restart taskapi       # after deploying new code
pm2 save                  # remember the list of processes
pm2 startup               # prints a command to start pm2 on boot`),
    P("The program listens on a port on the server, such as 3100. You do not want visitors to type that port, and you want HTTPS."),
    H("Put nginx in front"),
    P("A **reverse proxy**, usually nginx, accepts connections on the normal ports 80 and 443, handles HTTPS, and passes requests to your Node.js program on its own port. Here is a minimal server block. It is a sketch to adapt, and not a complete production setup."),
    C('nginx', `server {
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`),
    L("Get a free certificate for HTTPS from Let's Encrypt, with a tool such as `certbot`, and let it set up the renewal.", "Because nginx now sits in front, add `app.set('trust proxy', 1)` to the app, so the rate limiter sees real client addresses and not the proxy's.", "Only open ports 80 and 443 to the world. Keep the Node port closed in the firewall.", "`example.com` is a placeholder. Use your own domain."),
    H("Health checks and logs"),
    P("The `/api/health` route gives monitoring tools and load balancers something to call. Check it after each deploy. Read logs with `pm2 logs`, and watch for repeated errors. Do not log passwords, tokens or personal data. For a busy service, send logs to a central service, so they survive a server loss."),
    H("A deploy routine"),
    O("Run the tests on your machine. Commit and push.", "On the server, pull the new code: `git pull`.", "Install what is needed: `npm install --omit=dev`.", "Restart: `pm2 restart taskapi`.", "Check `/api/health` and read the first lines of the logs.", "If something is wrong, go back to the last good commit and restart."),
    H("Before you launch: a short checklist"),
    L("Tests pass, and secrets are not in git.", "HTTPS works, and the secret is long and random.", "CORS allows only your front end.", "Rate limits are on for login and registration.", "The database has a restricted user, and backups run.", "Errors show a general message to clients and full detail in the logs.", "You know who to call, and what to do, if something breaks."),
    H("Where to go next"),
    P("You now know the core of back-end work with Node.js: modules, async code, Express, validation, storage, login, security, tests and deployment. Next, connect a front end. Our [MERN stack course](/learn/mern-stack-full-course) builds a complete app with React on top of an API like this one. Add features to your task API: due dates, tags, paging, password reset with email. And read the official documentation for Node.js, Express and Mongoose when you meet something new, because it is the most reliable source. The [career roadmaps](/roadmaps) show how this skill fits into back-end and full stack roles."),
    ...task("Add `test` and `start` scripts, write the tests above and run `npm test`.", "Write a new test for a case of your own, for example that a second user cannot read the first user's task, and make it pass.", "Make a plan for deployment of your API: where it would run, where the secrets would be kept, and how you would roll back.", "If you have a server, deploy the API with pm2 and check `/api/health`."),
    ...check("`npm test` shows all tests passing.", "The server refuses to start when `JWT_SECRET` is missing, and prints a clear message.", "You can describe, in your own words, what pm2 and nginx each do."),
  ], A('From your laptop to a live API', [
    n('tests', 'Tests pass', 'npm test', 0, 0, 'check'), n('server', 'Server', 'git pull, install', 1, 0, 'tool'),
    n('pm2', 'pm2', 'keeps Node running', 2, 0, 'app'), n('nginx', 'nginx + HTTPS', 'public address', 3, 0, 'out'),
  ], [
    { say: 'Before anything goes live, the tests must pass on your machine.', on: ['tests'] },
    { say: 'On the server you pull the new code and install the packages you need.', flow: ['tests>server:deploy'] },
    { say: 'A process manager such as pm2 starts the API, restarts it after a crash and starts it again after a reboot.', flow: ['server>pm2:start'] },
    { say: 'nginx accepts public HTTPS requests and passes them to your Node.js program.', flow: ['pm2>nginx:behind'] },
  ]), [
    faq('Why export createApp instead of calling listen in app.js?', 'It lets tests create their own app and start it on a random port, without side effects. The separate server.js reads settings and starts the real server.'),
    faq('Why do I need nginx if Node can serve requests itself?', 'nginx handles HTTPS, standard ports, compression and static files efficiently, and protects the Node process from direct exposure. It is a common and well-tested setup, though not the only one.'),
  ]),
];
