import { P, H, L, O, N, C, S, task, check, lesson } from './helpers.js';

const S3 = 'MongoDB and Mongoose';

export const lessons = [
  // ------------------------------------------------------------ 14
  lesson(S3, 'what-is-mongodb-documents-collections-atlas', 'What Is MongoDB? Documents, Collections, Atlas and mongosh', 'How MongoDB stores data as documents in collections, how it differs from SQL tables, how to get a free database, and the shell commands to insert, find, update, aggregate and delete.', '', [
    P("Until now the Job Tracker has kept its data in an array, which disappears when the server stops. A **database** keeps data safely on disk and lets many requests read and change it at once, quickly and without corrupting it. **MongoDB** is a *document database*. Instead of rows in tables, it stores **documents**, which look almost exactly like the JavaScript objects you already use, which is one of the reasons it fits so naturally into a JavaScript stack."),

    H("Documents, collections and databases"),
    L(
      "A **document** is one record: `{ company: 'Acme', role: 'Dispatcher', status: 'applied', tags: ['night shift'] }`. It can hold nested objects and arrays. It is stored in a format called BSON (binary JSON) that adds types such as dates and ids.",
      "A **collection** is a group of documents, similar to a table. Our app will have a `users` collection and a `jobs` collection.",
      "A **database** holds collections. Our app uses one called `job_tracker`.",
      "Every document has an **`_id`**, a unique value that MongoDB creates for you if you do not (an `ObjectId`, which is displayed as 24 hexadecimal characters).",
    ),
    H("How is that different from SQL?"),
    P("In a SQL database every row in a table has the same columns, set in advance, and you spread related data across tables and join them when reading. In MongoDB documents in the same collection may have different fields, and you often keep related data together inside one document. That flexibility is useful when the shape of data changes, but it is also a trap: without rules, a collection can fill up with inconsistent documents. That is why in lesson 16 we add a **schema** with Mongoose. Neither model is better in every case. SQL databases are excellent when data has many relationships, strict rules and reports across tables; document databases are comfortable when you read and write whole objects, as most web apps do."),
    H("Get a database: two options"),
    S(14, 'examples/14-mongodb/README.md'),
    P("**MongoDB Atlas** is the hosted service by the makers of MongoDB, and its free tier is enough for this course. You do not install anything, and later the same cluster can serve your deployed app. Two settings catch beginners out: the **Network Access** list must include your current IP address (or, for learning only, you may allow all addresses, but never do that for real data), and the **database user** is separate from your Atlas login. **Community Edition** runs on your own computer and works offline; it is free too."),
    N("Your connection string contains a password. Treat it like one: it goes in `.env`, never in code, never in Git, never in a screenshot. If it leaks, change the database user's password in Atlas at once."),
    H("Try the shell"),
    P("`mongosh` is MongoDB's command line. The script below inserts three jobs, searches them in several ways, changes one, groups and counts them, deletes one and drops its demo database. Read each part, because the operations are the same ones Mongoose will perform for you."),
    S(14, 'examples/14-mongodb/queries.mongosh.js'),
    L(
      "**`insertMany`** adds documents; the collection is created on first write.",
      "**`find(filter, projection)`** returns matching documents. Filters can use operators that start with `$`: `$in`, `$gte`, `$or`. A dotted path such as `'salary.min'` reaches inside a nested object, and `tags: 'bank'` matches an array that *contains* `'bank'`.",
      "**`updateOne(filter, update)`** needs an update operator like `$set` or `$push`; without one MongoDB would replace the whole document.",
      "**`aggregate`** runs a pipeline of stages. `$group` with `$sum: 1` counts documents per value. You will build the Job Tracker's statistics screen with exactly this in lesson 19.",
    ),
    ...task(
      "Create an Atlas free cluster (or install Community Edition) and copy the connection string.",
      "Install `mongosh` and run the script against your database: `mongosh \"<connection string>\" examples/14-mongodb/queries.mongosh.js`.",
      "Edit the script: add a `location` to each job and find only the jobs in one place.",
      "Write a pipeline that finds the highest `salary.max` per status.",
    ),
    ...check("The script prints the filtered jobs, the grouped counts and “left: 2”.", "You can connect with `mongosh` and list databases with `show dbs`."),
    H("Summary"),
    L("MongoDB stores JSON-like documents in collections; every document has an `_id`.", "Use Atlas (hosted) or Community Edition (local). Keep the connection string secret.", "Filters, `$set`/`$push` updates and aggregation pipelines are the core operations."),
  ], [
    { q: 'Is MongoDB better than SQL?', a: 'Neither is better in every case. MongoDB suits data you read and write as whole objects and whose shape changes. SQL databases suit strongly related data, strict rules and cross-table reports. Many real systems use both.' },
    { q: 'Is the free Atlas tier enough for learning?', a: 'Yes, for a course project. Limits and features change over time, so check the Atlas pricing page for the current free tier. Do not store real personal data on a free learning cluster.' },
    { q: 'What is an ObjectId?', a: 'It is MongoDB\'s default _id type: 12 bytes shown as 24 hex characters. It is unique and roughly increases over time because it begins with a timestamp. Mongoose gives it to you for every new document.' },
  ], 'what is mongodb, mongodb tutorial for beginners, mongodb atlas free, mongosh commands, mongodb vs sql'),

  // ------------------------------------------------------------ 15
  lesson(S3, 'connect-express-to-mongodb-with-mongoose', 'Connect Express to MongoDB with Mongoose', 'Install Mongoose, connect with a connection string from .env, start the server only after the database is ready, and show the database state in a health check.', '', [
    P("Your server can now talk HTTP. Next it must talk to MongoDB. You could use the official driver, which sends raw commands, but most MERN projects use **Mongoose**, a library on top of the driver. Mongoose adds three things you will want: **schemas** (rules for what a document must look like), **models** (objects that have methods like `find` and `create`), and helpful validation and error messages. This lesson only makes the connection. The next three use it."),

    H("The connection string"),
    S(15, 'server/.env.example'),
    P("A connection string is an address plus credentials plus the database name. Atlas gives you one starting with `mongodb+srv://`. A local one looks like `mongodb://127.0.0.1:27017/job_tracker`. The last part, after the final slash, is the **database name**; if it does not exist MongoDB creates it on first write. Put the real value in `server/.env`, and restart the server, because `.env` is not watched."),
    H("Connecting"),
    S(15, 'server/config/db.js'),
    P("`mongoose.connect(uri, options)` returns a promise. We wrap it in a function so the main file stays short and so tests (lesson 24) can pass a different address. The option `serverSelectionTimeoutMS: 8000` is a kindness to yourself: without it, a wrong address or a blocked IP makes the program hang for about 30 seconds before failing. With it you see the real error in 8 seconds. The `disconnected` listener logs when the connection drops, for example when your Wi-Fi does."),
    H("Start listening only when the database is ready"),
    S(15, 'server/index.js'),
    P("The server used to start with `app.listen` straight away. Now it first awaits `connectDB()` and only then listens, inside a `try/catch`. If the database is not available, the program prints a clear message and exits with `process.exit(1)`, instead of accepting requests it cannot serve. This **fail fast** habit is much better than a server that is “up” but returns errors on every call. (Top-level `await` works here because the project uses ES modules.)"),
    P("The health route now reports `mongoose.connection.readyState`. The value `1` means connected; `0` disconnected, `2` connecting, `3` disconnecting. Monitoring tools can call this route to know that the whole app, not only the web server, is healthy. In lesson 37 it will answer `503` when the database is down."),
    H("Common connection problems"),
    L(
      "**“bad auth” or “Authentication failed”**: the user name or password is wrong, or the password contains special characters that must be URL-encoded (`@` becomes `%40`).",
      "**Timeout or “ECONNREFUSED”**: for Atlas, your IP is not in Network Access; for local MongoDB, the service is not running.",
      "**It connects but you see no data in Atlas**: you are looking at a different database name than the one in the string.",
    ),
    ...task(
      "Run `npm install` in `server` (it adds Mongoose) and put your connection string in `server/.env` as `MONGODB_URI`.",
      "Start the server and call `/api/health`. You should see `db: connected`.",
      "Break the string on purpose (wrong password). How long does it take to fail, and what does it print?",
      "Stop your local MongoDB (or remove your IP from Atlas) while the server runs and watch the log.",
    ),
    ...check("The terminal prints “MongoDB connected: job_tracker”.", "`/api/health` answers `db: connected`.", "A wrong string makes the program exit within about 8 seconds with a clear message."),
    H("Summary"),
    L("Mongoose adds schemas, models and validation on top of the MongoDB driver.", "The connection string lives in `.env`; the part after the last slash is the database name.", "Connect first, listen second, and exit with a clear message if the database is down."),
  ], [
    { q: 'Do I need Mongoose, or can I use the MongoDB driver directly?', a: 'You can use the driver directly. Mongoose adds schemas, validation, defaults and convenient model methods, which suits most web apps and keeps data consistent. Some teams prefer the plain driver for more control.' },
    { q: 'Why does my password with an @ sign fail?', a: 'In a connection string the @ separates the credentials from the host, so one inside the password confuses the parser. URL-encode special characters (@ becomes %40) or choose a password without them.' },
    { q: 'Why wait for the database before calling listen?', a: 'A server that accepts requests but has no database fails every call in confusing ways. Failing at start with a clear message is easier to notice and fix, and process managers such as pm2 can restart it.' },
  ], 'mongoose connect, mongodb connection string, express mongodb tutorial, mongoose connect example'),

  // ------------------------------------------------------------ 16
  lesson(S3, 'mongoose-schemas-models-and-validation', 'Mongoose Schemas and Models: Types, Validation, Defaults and Timestamps', 'Describe what a Job looks like, add validation rules and defaults, hide internal fields in JSON output, and test the model without a server.', '', [
    P("A MongoDB collection will happily store anything. If one document has `company` and another has `Company` and a third has `company: 42`, MongoDB does not complain, and your React app will break in strange ways. A Mongoose **schema** is the rulebook that prevents this. A **model** is built from the schema and is the object you use to create, read, update and delete documents."),

    H("The Job schema"),
    S(16, 'server/models/Job.js'),
    P("Walk through it field by field."),
    L(
      "**`type`** converts values to that type when possible and rejects them when not. `String`, `Number`, `Date`, `Boolean`, `ObjectId` and arrays are the ones you will use.",
      "**`required: [true, 'message']`** fails validation when the field is missing or empty. The second item is the error message the client will see.",
      "**`trim: true`** removes spaces at both ends before saving, so `'  Acme '` is stored as `'Acme'`. Other helpful string options are `lowercase`, `minlength`, `maxlength` and `match` (a regular expression).",
      "**`enum`** lists the allowed values. Our `status` can only be one of five words. Anything else is rejected before it reaches the database.",
      "**`default`** fills a value when none is given. A new job starts as `saved`.",
    ),
    P("`salaryNote` is a string on purpose. As lesson 6 explained, advertised pay is written in many ways and converting it would lose information or show wrong numbers."),
    H("Timestamps and the toJSON transform"),
    P("`{ timestamps: true }` makes Mongoose maintain `createdAt` and `updatedAt` for you. You will sort by `createdAt` in lesson 18, and the React app uses `updatedAt` in lesson 31."),
    P("The `toJSON` setting controls what `res.json(job)` sends. `virtuals: true` adds `id`, a text version of `_id`, which is friendlier to React. The transform then deletes `_id` and `__v` (a version counter used internally). Shaping output in one place means no route can forget to hide something. In lesson 20 the same trick will hide password hashes, which is the reason it is worth learning now."),
    N("A schema only applies to writes that go through Mongoose. Anyone who connects to the database directly (with mongosh or Compass) can still write anything. Keep database credentials private and give application users only the permissions they need."),
    H("Using the model without a server"),
    P("You do not need Express to try a model. `new Job({...})` builds a document in memory, `validateSync()` checks the rules and returns the problems without touching the database, and `toJSON()` shows what would be sent. The script below does exactly that."),
    S(16, 'server/scripts/model-demo.js'),
    P("Run it with `node scripts/model-demo.js` from the `server` folder. You will see two validation messages (company and role are required, status is not allowed) and then a good job with its trimmed company and the default status. This is the same check that will run automatically every time a route creates or updates a job."),
    ...task(
      "Create `server/models/Job.js` from the lesson and run `node scripts/model-demo.js`.",
      "Add a `url` field (string, optional, must start with `http://` or `https://` using `match`). Test it with a good and a bad value in the demo script.",
      "Add a `source` field with `enum: ['website', 'referral', 'agency', 'other']` and a default of `other`.",
      "Make `appliedOn` default to nothing, and write down why a default of `Date.now` would be wrong for a job with status `saved`.",
    ),
    ...check("The demo prints one message per broken rule.", "The good job is trimmed and has `status: 'saved'` and an `id`."),
    H("Summary"),
    L("A schema defines types, rules and defaults; a model is what you query with.", "Validation messages from the schema become the field errors the client shows.", "`toJSON` decides what leaves the server, so hide internals there."),
  ], [
    { q: 'What is the difference between a schema and a model?', a: 'The schema describes the shape and rules of a document. The model is created from a schema with mongoose.model() and gives you the methods to work with a collection: create, find, update, delete.' },
    { q: 'Does MongoDB itself enforce my schema?', a: 'No. The schema is enforced by Mongoose in your application code. MongoDB also has its own optional validation rules, but Mongoose validation is the usual first line of defence. Anything written outside Mongoose is not checked by it.' },
    { q: 'What does timestamps: true do?', a: 'It adds createdAt and updatedAt fields and keeps them up to date automatically, so you can sort by newest and know when something last changed.' },
  ], 'mongoose schema, mongoose model, mongoose validation, mongoose enum default trim, mongodb schema design'),

  // ------------------------------------------------------------ 17
  lesson(S3, 'crud-with-mongoose-in-express', 'CRUD with Mongoose: Create, Read, Update and Delete in Express', 'Replace the in-memory array with MongoDB: use create, find, findById, findByIdAndUpdate and findByIdAndDelete, validate ids, and translate database errors into friendly answers.', '', [
    P("This is the lesson where the Job Tracker becomes real. The routes and the router stay exactly as they were. Only the body of each controller function changes, from “work on an array” to “work on MongoDB”. That is the payoff of the structure from lesson 11."),

    H("The four operations"),
    S(17, 'server/controllers/jobs.js'),
    L(
      "**Create**: `Job.create(data)` builds a document, runs validation and saves it. It returns the saved document, including its new `_id`.",
      "**Read**: `Job.find(filter)` returns an array; `Job.findById(id)` returns one document or `null`. Chain `.sort({ createdAt: -1 })` to order newest first.",
      "**Update**: `Job.findByIdAndUpdate(id, changes, options)`. The option `new: true` returns the document *after* the change (the default returns the old one). `runValidators: true` is essential: **update operations skip the schema rules unless you ask for them**, which would let `{ status: 'maybe' }` slip in.",
      "**Delete**: `Job.findByIdAndDelete(id)` removes it and returns the removed document, or `null`.",
    ),
    P("Every one of these is asynchronous, so every one needs `await`. Because the controller functions are `async` and Express 5 forwards rejected promises to the error handler, you do not need `try/catch` in each one. A validation failure inside `create` simply throws, and the error middleware answers."),
    H("Do not trust the body: pick the fields"),
    S(17, 'server/middleware/validate.js'),
    P("`pickJobFields` copies only the fields we allow. Passing `req.body` straight to `Job.create` is a classic security hole: a client could add fields you never meant to be settable. A whitelist makes the allowed fields explicit. (In lesson 22 the owner field is added by the server from the signed-in user and never read from the body, which is the most important use of this habit.)"),
    P("`checkId` is a **param middleware**: `router.param('id', checkId)` runs for every route that has `:id` in the path. A text that is not a valid ObjectId would otherwise make Mongoose throw a `CastError`. Here it answers `404` straight away, which also avoids confirming anything about how ids look."),
    S(17, 'server/routes/jobs.js'),
    H("Translating database errors"),
    S(17, 'server/middleware/error.js'),
    P("`translate` recognises the errors that Mongoose and MongoDB throw and turns them into friendly answers. A `ValidationError` becomes `400` with one message per field, in the same shape as lesson 12, so a React form can show them. A `CastError` becomes `400`. A MongoDB duplicate-key error (code `11000`, which you will meet for emails in lesson 20) becomes `409 Conflict`. Anything else stays a generic `500` and is logged."),
    N("`findByIdAndUpdate` with `new: true` and `runValidators: true` is the pair to remember. Forgetting `runValidators` is one of the most common ways invalid data gets into a Mongoose app."),
    ...task(
      "Start the server with your connection string and run `npm run smoke`.",
      "Open your database in Atlas (or Compass) and find the `jobs` collection that was created by the first `POST`.",
      "Restart the server and call `GET /api/jobs`. The data is still there. That is persistence.",
      "Try to update a job with `{ \"status\": \"maybe\" }`. Then remove `runValidators: true` from the update and try again. What changed?",
    ),
    ...check("The smoke script prints All checks passed.", "Data survives a server restart.", "An invalid status on update answers 400 with a message for `status`."),
    H("Summary"),
    L("`create`, `find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete` cover CRUD.", "Updates need `{ new: true, runValidators: true }`.", "Whitelist body fields; validate ids; translate database errors into 400, 404 and 409."),
  ], [
    { q: 'Why does my update accept invalid data?', a: 'Update methods such as findByIdAndUpdate do not run schema validators unless you pass runValidators: true. Add it to every update, and also use new: true to receive the changed document.' },
    { q: 'What is a CastError?', a: 'Mongoose throws it when it cannot convert a value to the schema type, most often a text that is not a valid ObjectId in a /:id route. Validate the id first and answer 404 or 400.' },
    { q: 'Should I use try/catch in every controller?', a: 'Not with Express 5. It passes errors thrown or rejected inside async handlers to your error middleware automatically. Use try/catch only when you need to clean up or handle a specific error locally.' },
  ], 'mongoose crud, express mongodb crud, findByIdAndUpdate runValidators, mongoose create find update delete'),

  // ------------------------------------------------------------ 18
  lesson(S3, 'search-filter-sort-pagination-and-indexes', 'Search, Filter, Sort and Paginate with Mongoose, and Why Indexes Matter', 'Build a list endpoint with text search, status filter, sorting and pages, protect it from abuse, and add indexes so it stays fast.', '', [
    P("A list of ten jobs is easy. A list of ten thousand cannot be sent in one answer, and a person cannot read it anyway. Real list endpoints let the client say **which** items (filter and search), **in what order** (sort) and **how many at a time** (pagination). This lesson gives `GET /api/jobs` all four, and shows the database feature that keeps it fast: **indexes**."),

    H("The query parameters"),
    P("The contract is `GET /api/jobs?q=bank&status=applied&sort=company&page=2&limit=10`. Everything is optional, and everything arrives as text in `req.query`. The controller below turns those texts into a MongoDB filter and options."),
    S(18, 'server/controllers/jobs.js'),
    H("Reading the controller"),
    L(
      "**Page and limit** are parsed with `parseInt` and clamped: the page is at least 1, the limit between 1 and 50. Clamping matters: without it a client could ask for `limit=1000000` and make your server fetch the whole collection into memory.",
      "**Status** is only used if it is one of the known values. Anything else is ignored rather than passed to the database.",
      "**Search** builds a case-insensitive regular expression over company, role and location with `$or`. The text is passed through `escapeRegex` first. Without it a visitor typing `C++` or `(` would break the pattern, and a crafted pattern could make the database do a lot of work (a *ReDoS* style attack). Escaping turns every special character into a literal one.",
      "**Sort** uses a lookup table, `SORTS`. The client sends a name such as `company`, and only names in the table work. Never pass a client-supplied value directly as a sort key.",
      "**The answer** includes `items`, `page`, `limit`, `total` and `pages`, so the client can draw page buttons without a second request.",
    ),
    P("Notice `Promise.all([find..., countDocuments(...)])`. The page of items and the total are independent questions, so they run at the same time, using the idea from lesson 4. `skip((page - 1) * limit).limit(limit)` is the classic way to paginate. It is simple and fine for thousands of documents. For very large collections, where skipping many documents becomes slow, teams switch to “cursor” pagination based on the last id seen."),
    H("Indexes"),
    S(18, 'server/models/Job.js'),
    P("Without an index, MongoDB answers “newest first” by looking at **every** document and sorting them (a *collection scan*). With an index on `createdAt`, it already has them in order and just reads the first page. An index is a separate, sorted structure that costs a little space and a little time on every write, but makes the matching reads dramatically faster. The second index, on `status` then `createdAt`, serves the very common question “only this status, newest first”."),
    P("A useful rule: build indexes for the queries your app actually runs, and put the field you *filter by equality* first and the field you *sort by* last. In lesson 22 both indexes will start with `user`, because every query will begin “this person's jobs”. You can ask MongoDB how it ran a query with `.explain('executionStats')` and look for `IXSCAN` (index used) versus `COLLSCAN` (everything read)."),
    N("A regular expression search such as the one above cannot use an ordinary index for a middle-of-text match, so it scans. That is fine for a personal tracker where each person has hundreds of jobs. For large-scale text search, use a text index or a dedicated search service."),
    H("Fake data to try it on"),
    S(18, 'server/scripts/seed.js'),
    ...task(
      "Run `npm run seed` to add 30 jobs, then try `GET /api/jobs?limit=5&page=3`.",
      "Search for `bank`, then filter with `status=interview`, then combine them.",
      "Try `limit=9999` and `page=-4`. What does the server do?",
      "Search for `c++` and for `(`. Confirm there is no error. Then temporarily remove `escapeRegex` and try again.",
    ),
    ...check("`total` and `pages` change with the filters.", "Out-of-range values are clamped, not an error or a crash.", "Special characters in the search box work as plain text."),
    H("Summary"),
    L("Filter, search, sort and paginate on the server, and always clamp and whitelist what the client sends.", "Escape user text before putting it in a regular expression.", "Index the fields you filter and sort on; check with `explain`."),
  ], [
    { q: 'What is an index in MongoDB?', a: 'A separate sorted structure that lets the database find or order documents without reading every one. It speeds up reads and slightly slows writes, so add indexes for the queries you really run.' },
    { q: 'Why escape the search text?', a: 'Because a regular expression treats characters such as ( + * ? specially. Unescaped, a visitor\'s search could throw an error or be crafted to make the database do expensive work. Escaping makes them plain characters.' },
    { q: 'Is skip and limit pagination good enough?', a: 'For thousands of documents, yes. For very large collections skip becomes slow because the database still walks past the skipped documents. Then use cursor-based pagination, filtering by the last seen id or date.' },
  ], 'mongoose pagination, mongodb search filter sort, mongodb indexes explained, express pagination api'),

  // ------------------------------------------------------------ 19
  lesson(S3, 'mongodb-aggregation-pipeline-for-statistics', 'MongoDB Aggregation: Count Jobs per Status for a Statistics Endpoint', 'Use an aggregation pipeline to group and count inside the database, fill in missing statuses, compute an honest percentage and avoid the route-order bug.', '', [
    P("The dashboard will show numbers: how many jobs in total, how many per status, and what share of applications reached an interview. You could fetch every job and count in JavaScript, but that moves all the data across the network to count it. A database is built to count quickly where the data lives. MongoDB's tool for that is the **aggregation pipeline**."),

    H("What a pipeline is"),
    P("A pipeline is a list of **stages**. Documents flow through the stages one after another, and each stage changes them: `$match` keeps some, `$group` combines them, `$sort` orders them, `$project` reshapes them, `$limit` cuts them. It is like a conveyor belt with a worker at each station, and it is the same idea as chaining `filter`, `map` and `reduce` on an array, but run inside the database."),
    S(19, 'server/controllers/stats.js'),
    H("Reading the controller"),
    L(
      "`{ $group: { _id: '$status', count: { $sum: 1 } } }` creates one output document per distinct `status` and adds 1 for every job that has it. The text `'$status'` (with a dollar sign) means *the value of the field `status`*.",
      "The result only has statuses that exist. If nobody has an `offer` yet, there is no `offer` row, and a screen that expects it would show a hole. So the code starts from an object with every status set to `0` and then fills in the counts. Designing the answer so the client never has to guess is good API manners.",
      "`interviewRate` is the share of *applications* that reached an interview or an offer. The word is chosen carefully: the denominator excludes jobs that are only `saved`, because you have not applied to those. And when there are no applications, the rate is `null` rather than `0%`, because zero would claim something false. Showing “–” on screen is more honest than showing a number that means nothing yet.",
    ),
    N("A statistic is only useful if it is true to what it says. “Interview rate” here is a personal measure of one person's search, not a promise about anyone's chances, and the screen should never present it as more than that."),
    H("The route-order bug"),
    S(19, 'server/routes/jobs.js'),
    P("Look at the comment next to `/stats`. Express checks routes in order, and `/:id` matches **any** one-segment path. If `/stats` came after `/:id`, a request for `/api/jobs/stats` would be treated as a job whose id is `stats`, and `checkId` would answer `404`. This bug is easy to create and confusing to see, so remember the rule from lesson 9: put specific routes before general ones."),
    H("Other pipeline stages worth knowing"),
    L(
      "`$match` first, as early as possible, so later stages see fewer documents (and can use indexes). In lesson 22 the first stage will be `$match: { user: ... }`.",
      "`$sort` and `$limit` for “top 5” questions.",
      "`$lookup` to join another collection, `$unwind` to turn an array into one document per item, and `$addFields` to compute new fields.",
      "`$dateToString` and `$group` together give counts per month: a nice next feature.",
    ),
    ...task(
      "Run `npm run seed` if you have not, then call `GET /api/jobs/stats`.",
      "Move the `/stats` route below `/:id` and call it again. Read the answer, then put it back.",
      "Add the average number of jobs per week. Hint: use `$group` on `$dateToString` or on the week of `createdAt`.",
      "Add `byLocation`: the three places with the most jobs, using `$group`, `$sort` and `$limit`.",
    ),
    ...check("`byStatus` has all five statuses, with zeros where there are none.", "`interviewRate` is `null` for an empty tracker and a whole number otherwise."),
    H("Summary"),
    L("An aggregation pipeline passes documents through stages such as `$match`, `$group` and `$sort` inside the database.", "Fill in missing groups so the client never has holes; use `null` for undefined ratios.", "Register specific routes (`/stats`) before `/:id`."),
  ], [
    { q: 'When should I use aggregation instead of counting in JavaScript?', a: 'Almost always for totals and groups, because the database counts where the data lives and only sends the small result. Fetching every document to count it in JavaScript wastes time and memory.' },
    { q: 'What does $sum: 1 do in $group?', a: 'It adds one for every document in the group, which counts them. To add up a field instead, use $sum with the field name, for example $sum: "$salary".' },
    { q: 'Why is interviewRate null sometimes?', a: 'Because with no applications there is nothing to divide by, and showing 0% would claim that none of your applications led anywhere. Null lets the screen show a dash, which is the honest answer.' },
  ], 'mongodb aggregation pipeline, mongodb group count, mongoose aggregate, express statistics endpoint'),
];
