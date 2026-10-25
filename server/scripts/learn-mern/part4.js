import { P, H, L, O, N, C, S, task, check, lesson } from './helpers.js';

const S4 = 'Authentication and Security';

export const lessons = [
  // ------------------------------------------------------------ 20
  lesson(S4, 'user-registration-and-password-hashing-with-bcrypt', 'User Registration and Password Hashing with bcrypt', 'Create the User model, hash passwords so they are never stored as text, validate the email, and handle duplicate accounts with a 409 answer.', '', [
    P("So far anyone can read and change every job. The Job Tracker needs accounts, so each person sees only their own jobs. That requires two ideas that are often confused. **Authentication** answers “who are you?”. **Authorization** answers “what are you allowed to do?”. This lesson and the next two build authentication; lesson 22 adds the authorization rule that keeps people apart."),
    P("We start with the part that has the largest cost if you get it wrong: storing passwords. The rule is absolute. **Never store a password.** Store a *hash* of it."),

    H("What a hash is, and why bcrypt"),
    P("A **hash function** turns any text into a fixed-length scramble, and it only works in one direction: you can get from the password to the hash, but not back. To check a login, you hash what the person typed and compare it with the stored hash. If a thief steals your database, they get hashes, not passwords."),
    P("But ordinary fast hashes (such as SHA-256) can be guessed at billions per second by a modern graphics card. Password hashing needs the opposite: it must be **deliberately slow**. **bcrypt** was designed for that. It adds a random **salt** to each password, so two people with the same password get different hashes, and it has a **cost** setting that makes each guess take real time. We use `bcryptjs`, a pure JavaScript version that installs everywhere without compiling anything."),
    S(20, 'server/models/User.js'),
    L(
      "**`email`** is `lowercase` and `trim`med, so `Ana@Example.com ` and `ana@example.com` are the same account, and `unique: true` creates a unique **index** so MongoDB itself refuses a second account with the same email.",
      "**`match`** is a light format check. Do not try to validate email addresses perfectly with a regular expression; the only real proof an address works is sending a message to it (a feature for later).",
      "**`select: false`** on `passwordHash` means that queries do not return it unless you explicitly ask with `.select('+passwordHash')`. A forgotten `.select` can then never leak it.",
      "The `toJSON` transform deletes `passwordHash` as a second safety net, in case a document with the hash ever gets sent.",
    ),
    H("The register controller"),
    S(20, 'server/controllers/auth.js'),
    P("The password is checked **before** hashing: at least 8 characters, and at most 72. The upper limit is a bcrypt detail: it only reads the first 72 bytes, so a longer password adds nothing, and a very long one wastes server time. `bcrypt.hash(password, 12)` produces the hash. The number 12 is the **cost**: each increase of 1 doubles the time. Around 10 to 12 is common today, and it should be raised over the years as computers get faster."),
    P("`User.create` fails if the email already exists, and MongoDB reports that with the error code `11000`. The error handler from lesson 17 turns that into `409 Conflict` with a message for the `email` field, so a registration form can show “That email is already used”."),
    S(20, 'server/routes/auth.js'),
    N("Do not put a minimum like “must contain a symbol” and a maximum like 12 characters. Long passphrases are stronger than short complicated ones. Guidance from security organisations favours length, allowing every character, and checking against lists of known leaked passwords where possible."),
    ...task(
      "Run `npm install` in `server` (it adds `bcryptjs`), then register with `POST /api/auth/register` and a JSON body of name, email and password.",
      "Look at the `users` collection in Atlas. Find the `passwordHash` and see that it starts with `$2a$12$`.",
      "Register the same email again. What status do you get? Try `ANA@example.com` in capitals.",
      "Register the same password for two different emails and compare the two hashes. Why are they different?",
    ),
    ...check("A good registration answers 201 with the user and no `passwordHash`.", "A short password answers 400 with a message for `password`.", "A repeated email answers 409."),
    H("Summary"),
    L("Authentication is who you are; authorization is what you may do.", "Store a slow, salted hash (bcrypt), never the password.", "Make emails lowercase and unique; hide the hash by default and in JSON."),
  ], [
    { q: 'Why not encrypt passwords instead of hashing them?', a: 'Encryption can be reversed with the key, so a thief who gets the key and the data gets every password. A hash cannot be reversed. You only ever need to check a guess against it, never to read the original.' },
    { q: 'What is the bcrypt cost factor?', a: 'It controls how slow hashing is. Each increase of 1 doubles the time. Pick a value that takes roughly a tenth of a second or more on your server (10 to 12 is common) and raise it as hardware improves.' },
    { q: 'Why bcryptjs and not bcrypt?', a: 'bcryptjs is pure JavaScript and installs on any system with no build tools. The native bcrypt package is faster but needs compilation. For most apps the difference does not matter. The hashes are compatible.' },
  ], 'bcrypt password hashing node, mongoose user model, express registration, never store passwords, bcryptjs tutorial'),

  // ------------------------------------------------------------ 21
  lesson(S4, 'login-with-jwt-json-web-tokens', 'Login with JWT: Sign In, Issue a Token and Avoid Timing Leaks', 'How JSON Web Tokens work, how to sign and verify them, and how to write a login that gives the same answer for a wrong email and a wrong password.', '', [
    P("The person has an account. Now they must prove who they are, and your server must remember that for the next request. HTTP has no memory: each request stands alone. So after a correct login the server hands the client a **token**: a small piece of text that the client sends back with every later request, like a wristband at an event."),

    H("What a JWT is"),
    P("A **JSON Web Token** has three parts separated by dots: a *header*, a *payload* and a *signature*. The payload holds claims such as “the user id is 64f... and this expires in seven days”. The signature is made with a secret that only your server knows. When a token comes back, the server recomputes the signature: if the payload was changed, or the token was made by someone without the secret, the signature will not match and the token is rejected."),
    N("The payload of a JWT is encoded, **not encrypted**. Anyone who holds the token can read it by pasting it into a decoder. Never put passwords, emails you want private or other sensitive data in it. Put only what you need, usually the user id. The security is in the signature."),
    S(21, 'server/utils/token.js'),
    P("`jwt.sign(payload, secret, { expiresIn })` creates a token. We store the user id in `sub` (short for “subject”), a standard claim name. `jwt.verify(token, secret)` returns the payload or throws if the token is invalid or expired. The function `secret()` refuses to run when `JWT_SECRET` is missing, because a missing secret would silently make every token forgeable."),
    S(21, 'server/.env.example'),
    P("Make the secret long and random, as the comment in the file shows. If it is guessable, anyone can create tokens for any user. If you change it, every existing token stops working, which is a handy emergency button after a leak."),

    H("The login controller"),
    S(21, 'server/controllers/auth.js'),
    L(
      "**The same message for both failures.** If the answer were “no such email” for one and “wrong password” for the other, an attacker could use the form to find out which emails have accounts (called *user enumeration*). So both cases answer `401 Email or password is wrong`.",
      "**The same time for both failures.** Comparing a password with bcrypt takes noticeable time, while “no such user” would return instantly, and that difference can be measured. So when the email is unknown we still call `bcrypt.compare` against a throw-away `DUMMY_HASH`. This is the idea behind a *timing attack* defence.",
      "**`.select('+passwordHash')`** is how we ask for the hash that is hidden by default.",
      "**Type checks.** `typeof email === 'string'` stops a client from sending an object instead of text. Lesson 23 will explain why that matters.",
      "**Register now also returns a token**, so a new person is signed in straight away.",
    ),
    S(21, 'server/routes/auth.js'),
    H("Where does the client keep the token?"),
    P("The React app (lesson 32) will keep the token in `localStorage` and send it in an `Authorization: Bearer <token>` header. This is simple and common, and it has a known trade-off: JavaScript on the page can read `localStorage`, so a cross-site scripting (XSS) bug could steal the token. The alternative, an `httpOnly` cookie, cannot be read by scripts but needs protection against cross-site request forgery. Neither is free. For this course we use the header approach and keep the pages free of unsafe HTML; lesson 40 lists the cookie version as a next step."),
    ...task(
      "Run `npm install` in `server` (adds `jsonwebtoken`). Add a long `JWT_SECRET` to `.env`.",
      "Log in with the right password and copy the token. Paste it into a JWT decoder and read the payload: find `sub`, `iat` (issued at) and `exp` (expires).",
      "Change one character of the token and try to `jwt.verify` it in a small script. What error do you get?",
      "Log in with a wrong email and with a wrong password. Compare the status, message and the time taken.",
    ),
    ...check("A correct login answers 200 with `token` and `user`.", "Wrong email and wrong password give the same 401 message.", "The decoded token shows `sub` and an expiry but no password or email."),
    H("Summary"),
    L("A JWT is signed, not secret: store only the user id and an expiry in it.", "Sign with a long random secret from `.env`; verify on every request.", "Answer wrong email and wrong password identically, and take the same time doing it."),
  ], [
    { q: 'Is a JWT encrypted?', a: 'No. It is signed, so it cannot be changed without detection, but anyone holding it can read the payload. Keep sensitive data out of it.' },
    { q: 'How long should a token last?', a: 'Short enough that a stolen one stops working soon, long enough that people are not signed out all the time. Seven days is a common simple choice for small apps. Bigger systems use short-lived access tokens plus refresh tokens.' },
    { q: 'Why not say "email not found" on login?', a: 'It tells an attacker which email addresses have accounts, which helps phishing and guessing. A single message for every failure reveals nothing.' },
  ], 'jwt authentication node js, json web token tutorial, express login, jsonwebtoken sign verify, user enumeration'),

  // ------------------------------------------------------------ 22
  lesson(S4, 'protect-routes-and-ownership-checks', 'Protect Routes and Keep Users Apart: Auth Middleware and Ownership Checks', 'Write the middleware that reads the token, load the signed-in user, link every job to its owner, and prove that one person cannot read or change another person\'s jobs.', '', [
    P("Tokens exist. Now every private route must require one, and each query must be limited to the person it belongs to. This lesson contains the most important rule of the whole project, stated in lesson 6: **a person can only ever see and change their own jobs**. Authentication alone does not give you that. Many real data leaks come from apps that check *that* you are signed in, but not *whose* data you are asking for."),

    H("The protect middleware"),
    S(22, 'server/middleware/auth.js'),
    L(
      "It reads the `Authorization` header, expects the form `Bearer <token>`, and answers `401` if it is missing.",
      "`verifyToken` throws for a forged or expired token; we turn that into a `401` with a helpful message.",
      "`User.findById(payload.sub)` loads the person. If the account was deleted after the token was issued, we refuse, so tokens of deleted accounts are useless.",
      "On success it puts the user on `req.user` and calls `next()`. Every later function can say `req.user._id` and know it came from a verified token, not from anything the client typed.",
    ),
    P("Notice that this `async` middleware throws `HttpError` and does not call `next(err)` itself. Express 5 forwards the rejection to the error handler for you."),
    H("Linking jobs to users"),
    S(22, 'server/models/Job.js'),
    P("`user: { type: ObjectId, ref: 'User', required: true, index: true }` is a **reference**: it stores the owner's `_id`. The `ref` tells Mongoose which model it points to, so later you could use `.populate('user')` to fetch the owner's details. The `toJSON` transform now also deletes `user`, because the client does not need it. The indexes from lesson 18 now start with `user`, because every query now begins with “this person's jobs”."),
    H("Scoping every query"),
    S(22, 'server/controllers/jobs.js'),
    P("Read the changes against lesson 18. The list starts its filter with `{ user: req.user._id }`. Reading, updating and deleting one job use `findOne({ _id, user })`, `findOneAndUpdate({ _id, user }, ...)` and `findOneAndDelete({ _id, user })`. If the id belongs to someone else, the result is `null` and the answer is `404`, exactly as if the job did not exist. We use `404` rather than `403` on purpose: a `403` would confirm to a stranger that the id exists."),
    P("And in `createJob`, the owner is added by the server: `{ ...pickJobFields(req.body), user: req.user._id }`. The owner is **never** read from the body. If it were, a client could create jobs in someone else's account by sending `\"user\": \"...\"`. `pickJobFields` already drops that field, and putting `user` after the spread makes the rule impossible to break by accident."),
    S(22, 'server/controllers/stats.js'),
    P("The statistics controller shows a subtle detail. In an aggregation, Mongoose does **not** convert an id string to an ObjectId for you, so `$match` needs the real `ObjectId`. `req.user._id` already is one, which is another reason to take the id from the loaded user and not from a string."),
    S(22, 'server/routes/jobs.js'),
    P("`router.use(protect)` at the top applies the middleware to every route below it, so a new route added later is protected by default. Secure by default is safer than remembering to add a guard each time. The auth router uses `protect` only on `GET /me`, which returns the signed-in user and is what the React app calls to restore a session."),
    S(22, 'server/routes/auth.js'),
    H("Proving it works"),
    P("The updated smoke script (and `requests.http`) now registers two people, Ana and Ben. Ana creates a job. Ben tries to read, change and delete it and must get `404` each time. This is the test that matters most in the whole project. Add something like it for every resource you ever build."),
    S(22, 'server/scripts/smoke.js'),
    N("`npm run seed` now creates a demo account `demo@example.com` with the password `Demo12345` and 30 jobs. The React lessons use it until the real login screen arrives in lesson 32. It is for local learning only: never create a known account like this on a real server."),
    ...task(
      "Run `npm run seed`, then `npm run smoke` against your running server.",
      "Call `GET /api/jobs` with no token, with a made-up token, and with a real one. Compare the answers.",
      "Create a job as one user. Copy its id, and request it with another user's token. What status do you get?",
      "Try to create a job with `\"user\": \"<another user's id>\"` in the body. Check in the database which user owns it.",
    ),
    ...check("The smoke script passes all of its checks, including “another user cannot read Ana's job (404)”.", "A token for a deleted user is refused."),
    H("Summary"),
    L("`protect` verifies the token and puts the user on `req.user`.", "Every query includes the owner; the owner comes from the token, never the body.", "Answer 404 for someone else's data, and apply `protect` with `router.use` so new routes are safe by default."),
  ], [
    { q: 'Why not return 403 for another user\'s job?', a: '403 tells the caller the thing exists but is forbidden, which leaks information. Answering 404 treats it as if it does not exist for them. Use 403 when the resource is known to the user but an action is not allowed.' },
    { q: 'Is checking the token enough to protect data?', a: 'No. It proves who is asking. You must also make every query only touch data that belongs to that person (or that their role allows). Missing the second step is a very common cause of data leaks.' },
    { q: 'What does router.use(protect) do?', a: 'It adds protect as middleware for every route defined after it on that router, so all of them require a valid token. Routes added later are protected automatically.' },
  ], 'express jwt middleware, protect routes node, authorization vs authentication, mongoose ref user, broken access control'),

  // ------------------------------------------------------------ 23
  lesson(S4, 'express-security-basics-helmet-rate-limit-nosql-injection', 'Express Security Basics: helmet, Rate Limiting, NoSQL Injection and Config Checks', 'Add safe HTTP headers, slow down password guessing, refuse MongoDB operator objects in input, and fail at start when configuration is missing.', '', [
    P("A working login is not a secure login. Real APIs are scanned and attacked within hours of going online, usually by automated scripts, not by someone who knows your app. This lesson adds four protections, each small, that stop the most common automated attacks. None of them is a substitute for the ones you already have (hashing, token checks, ownership), and together they make a solid base."),

    H("1. Safe headers with helmet"),
    S(23, 'server/index.js'),
    P("`helmet()` is one line that sets a group of HTTP response headers that tell browsers to behave safely: do not guess content types (`X-Content-Type-Options`), do not allow your pages inside frames on other sites (clickjacking), only use HTTPS, and apply a Content Security Policy. It also removes the `X-Powered-By: Express` header that advertises your technology. It is cheap, it rarely causes problems, and it is the first thing a security review looks for."),
    H("2. Rate limiting"),
    S(23, 'server/middleware/security.js'),
    P("Without a limit, a script can try thousands of passwords a minute against `/api/auth/login`. `express-rate-limit` counts requests per IP address in a time window and answers `429 Too Many Requests` once a person goes over. We apply it to `/api/auth` only (20 attempts per 15 minutes), because that is where guessing happens. `standardHeaders` tells the client how many tries remain."),
    P("One production detail catches many people. Behind nginx or a host's load balancer, every request appears to come from the proxy's address, so *everyone shares one limit*. Setting `TRUST_PROXY=1` tells Express to read the real visitor address from the `X-Forwarded-For` header. Only set it when you really are behind one proxy; otherwise a visitor could fake the header."),
    H("3. NoSQL injection"),
    P("In SQL, the famous attack is typing `' OR 1=1 --` into a form. MongoDB has a cousin. Remember that filters use operator objects like `{ $gt: '' }`. If your login does `User.findOne({ email: req.body.email })` and a client sends the JSON `{ \"email\": { \"$gt\": \"\" } }`, the filter becomes “email greater than empty text”, which matches the first user. The attacker never needed an email."),
    P("Two defences are used together. First, **check types**: lesson 21's login already refuses anything that is not a `string`. Second, `rejectOperators` in `security.js` walks through the JSON body and refuses any key that starts with `$` or contains a dot, at any depth. Our app never needs such keys from clients, so refusing them is safe."),
    H("4. Fail at start when configuration is wrong"),
    S(23, 'server/config/env.js'),
    P("`checkEnv` stops the server immediately, with a clear message, if `MONGODB_URI` or `JWT_SECRET` is missing, and, in production, if the secret is short or still has the example value. A server that starts with a missing secret and then fails on the first login is much harder to debug than one that refuses to start."),
    H("A short security checklist"),
    L(
      "Hash passwords; use long random secrets from `.env`.",
      "Check the token **and** the owner on every private route.",
      "Validate and whitelist all input; clamp numbers; escape text used in regular expressions.",
      "Limit request size (`express.json({ limit })`) and request rate.",
      "Keep dependencies updated; run `npm audit` now and then and read what it says before changing anything.",
      "Never log passwords, tokens or full request bodies.",
    ),
    N("Security is a process, not a feature. This course shows the fundamentals that stop the most common problems. For an app that holds sensitive data, add an independent security review."),
    ...task(
      "Run `npm install` in `server` (adds `helmet` and `express-rate-limit`). Restart and call any route with `curl -i` to see the new headers.",
      "Send eleven wrong logins in a row with `AUTH_RATE_LIMIT=10` set in `.env`. Which request is the first to answer 429?",
      "Send `{ \"email\": { \"$gt\": \"\" }, \"password\": \"x\" }` to login. What do you get?",
      "Remove `JWT_SECRET` from `.env` and start the server. Read the message.",
    ),
    ...check("Responses carry `X-Content-Type-Options` and no `X-Powered-By`.", "The 11th wrong login within the window answers 429.", "The operator-object login answers 400."),
    H("Summary"),
    L("helmet sets safe headers; rate limiting slows guessing; operator objects are refused.", "Behind a proxy set `TRUST_PROXY=1` so limits use real visitor addresses.", "Fail fast at start when required settings are missing."),
  ], [
    { q: 'What is NoSQL injection?', a: 'Sending a MongoDB operator object, such as { "$gt": "" }, where the code expects text, so that the query matches more than intended. Defend by checking input types and refusing keys that start with $.' },
    { q: 'Does helmet make my app secure?', a: 'It makes browsers handle your responses more safely and removes some information leaks. It does not replace authentication, validation or authorization. Think of it as one inexpensive layer.' },
    { q: 'Why does the rate limit need TRUST_PROXY behind nginx?', a: 'Behind a proxy every request seems to come from the proxy\'s IP address, so all visitors would share one limit. TRUST_PROXY tells Express to use the forwarded visitor address instead.' },
  ], 'express security best practices, helmet express, express rate limit, nosql injection mongodb, node js security'),

  // ------------------------------------------------------------ 24
  lesson(S4, 'automated-api-tests-with-node-test-runner', 'Automated API Tests with the Built-in Node.js Test Runner', 'Split app from server so tests can start the app, run against a throw-away database, and check authentication, ownership, validation and pagination.', '', [
    P("A smoke script is a good start, but you have to remember to run it, and it only covers one path. **Automated tests** run all your checks with one command, in a clean database, and fail loudly the moment a change breaks something. They are what lets you change code next month without fear. Since Node.js 20 the test runner is built in (`node:test`), so you need no extra library."),

    H("Step 1: separate the app from the server"),
    S(24, 'server/app.js'),
    S(24, 'server/index.js'),
    P("Until now `index.js` built the app **and** started it. A test must not start a server on port 5000 or connect to your real database. So the app moves into `app.js`, which only builds and exports it, and `index.js` becomes a small file that checks the config, connects and calls `listen`. A test can now `import { app }`, start it on a random free port with `app.listen(0)`, and connect to a different database. This split is a very common structure in real projects."),
    H("Step 2: the tests"),
    S(24, 'server/test/api.test.js'),
    L(
      "**`describe` and `it`** group and name the checks. Names should read like sentences: “keeps people apart”.",
      "**`before` and `after`** run once around the group. We connect to the **test** database, wipe it, build its indexes, start the app on a random port, and at the end wipe it again and stop.",
      "**`MONGODB_URI_TEST`** is a separate address in `.env`. The tests drop the whole database, so the script refuses to run without it. **Never point it at real data.** (If the variable is missing the file says so and exits cleanly.)",
      "**`assert/strict`** compares values with strict equality (`assert.equal`, `assert.deepEqual`, `assert.ok`).",
      "**A small `api()` helper** wraps `fetch` so each check is short, and `signUp()` makes a fresh user and returns its token.",
    ),
    P("One line deserves a note: `Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()))`. `dropDatabase()` also deletes the **unique index** on email, and Mongoose only builds indexes when it first sees a model, not again. Without rebuilding it, the “duplicate email” test would pass or fail depending on timing. Tests that sometimes fail for no visible reason (called *flaky*) are worse than no tests, so it pays to find the cause. This one was found while writing this very course."),
    H("What to test"),
    P("Look at the list of checks. The suite covers the **happy path** (register, log in, create, list, update, delete), the **unhappy paths** (wrong password, duplicate email, invalid input, no token, a garbage token), the **security rules** (operator objects refused, one user cannot see another's jobs), and **behaviour** (pagination and statistics). When you add a feature, add its tests in the same change. When you find a bug, write the test that fails first, then fix it."),
    N("Tests are code and need the same care. Keep each test independent: one that depends on another's leftovers will break when the order changes. This is why every test above creates its own user."),
    H("Run them"),
    P("Add `MONGODB_URI_TEST=mongodb://127.0.0.1:27017/job_tracker_test` (or a separate Atlas database) to `.env`, then run `npm test`. The script `node --test --test-concurrency=1` finds files in a `test` folder, and the concurrency of 1 runs files one at a time so they do not wipe each other's database."),
    ...task(
      "Add `MONGODB_URI_TEST` to `.env` and run `npm test`. Read the report.",
      "Write a test that registering with a 73-character password answers 400.",
      "Write a test that `GET /api/jobs?limit=9999` returns at most 50 items.",
      "Break something on purpose (for example remove `{ user: req.user._id }` from `listJobs`) and watch which test catches it.",
    ),
    ...check("`npm test` ends with `# fail 0`.", "Breaking the owner filter makes “keeps people apart” fail."),
    H("Summary"),
    L("Export the app from `app.js`; start it from `index.js`. Tests import the app.", "Use a separate test database and rebuild its indexes after dropping it.", "Test happy paths, unhappy paths and security rules; keep every test independent."),
  ], [
    { q: 'Do I need Jest or Mocha?', a: 'Not for this project. The built-in node:test runner has describe, it, before, after and assertions. Jest and Vitest offer extra features such as mocking and watch mode, which you can add later if you need them.' },
    { q: 'Why must tests use a separate database?', a: 'Tests create and delete data and here even drop the whole database. Running them against real data would destroy it. Always give tests their own throw-away database address.' },
    { q: 'What is a flaky test?', a: 'A test that sometimes passes and sometimes fails without any change to the code, often because of timing or leftover state. Fix the cause or delete the test, since people stop trusting a suite that cries wolf.' },
  ], 'node js test runner, express api testing, node:test tutorial, integration tests express mongodb, mongoose testing'),
];
