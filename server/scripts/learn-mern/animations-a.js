const n = (id, label, sub, col, row, kind) => ({ id, label, sub, col, row, kind });
const A = (title, nodes, steps) => ({ title, nodes, steps });

export const a = {
  'what-is-the-mern-stack': A('A request through the MERN stack', [
    n('user', 'Browser', 'the visitor', 0, 0, 'user'), n('react', 'React', 'draws the screen', 1, 0, 'app'),
    n('express', 'Express + Node', 'the API', 2, 0, 'tool'), n('mongo', 'MongoDB', 'stores the data', 3, 0, 'store'),
  ], [
    { say: 'A visitor opens the site. The browser loads your React app, which draws the screens.', on: ['user', 'react'] },
    { say: 'React asks the API for the list of jobs, using fetch.', flow: ['react>express:GET /api/jobs'] },
    { say: 'Express, running on Node.js, receives the request and decides what to do.', on: ['express'] },
    { say: 'Express asks MongoDB for the saved documents.', flow: ['express>mongo:find()'] },
    { say: 'The data returns as JSON and React shows it. The whole stack uses one language: JavaScript.', flow: ['mongo>express:documents', 'express>react:JSON'] },
  ]),
  'set-up-your-tools-for-mern': A('Your development setup', [
    n('code', 'VS Code', 'your editor', 0, 0, 'app'), n('node', 'Node.js + npm', 'runs JavaScript', 1, 0, 'tool'),
    n('git', 'Git', 'saves history', 2, 0, 'check'), n('db', 'MongoDB', 'local or Atlas', 3, 0, 'store'),
  ], [
    { say: 'You write code in an editor such as VS Code.', on: ['code'] },
    { say: 'Node.js runs that code outside the browser, and npm installs packages.', flow: ['code>node:run'] },
    { say: 'Git records every change, so you can go back and share the project.', flow: ['node>git:commit'] },
    { say: 'MongoDB, installed locally or hosted on Atlas, keeps your data.', on: ['db'] },
    { say: 'The check script prints the version of each tool, so you know the setup is ready.', on: ['node', 'git', 'db'] },
  ]),
  'modern-javascript-for-mern': A('Modern JavaScript in one example', [
    n('data', 'Array of jobs', 'plain objects', 0, 0, 'data'), n('arrow', 'Arrow function', 'job => job.title', 1, 0, 'tool'),
    n('destr', 'Destructuring', 'const { title } =', 2, 0, 'app'), n('mod', 'Modules', 'import / export', 3, 0, 'out'),
  ], [
    { say: 'Real apps pass around arrays of objects, such as a list of jobs.', on: ['data'] },
    { say: 'Arrow functions with map and filter transform lists without a loop.', flow: ['data>arrow:map, filter'] },
    { say: 'Destructuring pulls fields out of an object in one line.', flow: ['arrow>destr:unpack'] },
    { say: 'Modules split code into files. export shares a value and import uses it.', flow: ['destr>mod:export'] },
    { say: 'const by default, let when a value changes, and never var. The spread syntax copies without changing the original.', on: ['data', 'mod'] },
  ]),
  'asynchronous-javascript-promises-async-await': A('Waiting without freezing', [
    n('call', 'Your code', 'async function', 0, 0, 'app'), n('queue', 'Event loop', 'keeps things moving', 1, 1, 'tool'),
    n('net', 'Network', 'takes time', 1, 0, 'data'), n('res', 'Result', 'resolved promise', 2, 0, 'out'),
  ], [
    { say: 'Some jobs take time, such as a network request. JavaScript must not freeze while it waits.', on: ['call'] },
    { say: 'Your code starts the request with fetch and gets a promise: a placeholder for a future value.', flow: ['call>net:fetch()'] },
    { say: 'Meanwhile the event loop keeps the page responsive and runs other code.', on: ['queue'] },
    { say: 'When the reply arrives, the promise resolves.', flow: ['net>res:resolved'] },
    { say: 'await pauses only your function, and try/catch handles a failure. The result comes back to your code.', flow: ['res>queue:continue', 'queue>call:await'] },
  ]),
  'http-json-and-rest-basics': A('Anatomy of a REST call', [
    n('client', 'Client', 'browser or script', 0, 0, 'user'), n('route', 'Route', 'POST /api/jobs', 1, 0, 'app'),
    n('work', 'Server work', 'validate and save', 2, 0, 'tool'), n('status', 'Status code', '201 Created', 3, 0, 'check'),
  ], [
    { say: 'A request has a method, a path, headers and sometimes a JSON body.', on: ['client'] },
    { say: 'The method says what to do: GET reads, POST creates, PATCH changes and DELETE removes.', flow: ['client>route:POST + JSON'] },
    { say: 'The server matches the method and the path to a route and runs its code.', flow: ['route>work:handler'] },
    { say: 'The reply carries a status code: 2xx means success, 4xx means the request was wrong, 5xx means the server failed.', flow: ['work>status:result'] },
    { say: 'The body of the reply is JSON, and the client reads it.', flow: ['status>work:JSON'] },
  ]),
  'plan-the-job-tracker-project': A('Plan before you code', [
    n('feat', 'Features', 'what users need', 0, 0, 'user'), n('api', 'API routes', 'the list of URLs', 1, 0, 'tool'),
    n('model', 'Data model', 'Job and User', 2, 0, 'store'), n('folders', 'Folders', 'client and server', 3, 0, 'out'),
  ], [
    { say: 'Start with what people need to do: sign in, add jobs, filter them and attach a resume.', on: ['feat'] },
    { say: 'Each feature becomes API routes, written down before any code.', flow: ['feat>api:routes'] },
    { say: 'The routes decide what data we keep, so we design the Job and the User.', flow: ['api>model:fields'] },
    { say: 'Then we choose a folder layout: one folder for the server and one for the client.', flow: ['model>folders:structure'] },
    { say: 'A short plan costs minutes and saves hours of rewriting.', on: ['feat', 'folders'] },
  ]),
  'node-js-basics-modules-files-events': A('What Node.js gives you', [
    n('script', 'Your script', 'node file.js', 0, 0, 'app'), n('mods', 'Modules', 'fs, path, events', 1, 0, 'tool'),
    n('disk', 'Files', 'read and write', 2, 0, 'store'), n('proc', 'process', 'env, argv, exit', 3, 0, 'data'),
  ], [
    { say: 'Node.js runs JavaScript on your computer, not in a browser.', on: ['script'] },
    { say: 'Built-in modules give you powers the browser does not have.', flow: ['script>mods:import'] },
    { say: 'The fs module reads and writes files. Use the path module to build paths that work on every system.', flow: ['mods>disk:readFile'] },
    { say: 'The process object gives you arguments, environment variables and the exit code.', flow: ['disk>proc:info'] },
    { say: 'Events let one part of a program announce something and others react.', on: ['mods'] },
  ]),
  'npm-package-json-and-environment-variables': A('From package.json to a running app', [
    n('pkg', 'package.json', 'name, scripts', 0, 0, 'data'), n('npm', 'npm install', 'downloads packages', 1, 0, 'tool'),
    n('mods', 'node_modules', 'never in Git', 2, 0, 'store'), n('env', '.env file', 'secret, not in Git', 3, 0, 'check'),
  ], [
    { say: 'package.json lists the name, the scripts and the packages your project needs.', on: ['pkg'] },
    { say: 'npm install reads that list and downloads the packages.', flow: ['pkg>npm:read'] },
    { say: 'They are saved in node_modules, a folder that is ignored by Git and can always be recreated.', flow: ['npm>mods:save'] },
    { say: 'Secrets and settings go in a .env file that dotenv loads into process.env. It is never committed.', flow: ['mods>env:dotenv'] },
    { say: 'The .env.example file shows other people the names they must fill in, without the secrets.', on: ['env', 'pkg'] },
  ]),
  'your-first-express-server-and-routes': A('A request meets a route', [
    n('req', 'Request', 'GET /api/jobs/7', 0, 0, 'user'), n('app', 'Express app', 'checks the routes', 1, 0, 'tool'),
    n('route', 'Route /jobs/:id', 'req.params.id = 7', 2, 0, 'app'), n('res', 'Response', 'res.json(...)', 3, 0, 'out'),
  ], [
    { say: 'A request arrives with a method and a path.', on: ['req'] },
    { say: 'Express checks its routes from the top, looking for the first match.', flow: ['req>app:method + path'] },
    { say: 'The path /jobs/:id matches, and the :id part is saved in req.params.', flow: ['app>route:match'] },
    { say: 'Query strings such as ?status=applied are in req.query. The handler reads them and builds a reply.', on: ['route'] },
    { say: 'res.json sends the answer with a status code, and the request is finished.', flow: ['route>res:res.json'] },
  ]),
  'express-middleware-json-cors-and-logging': A('The middleware pipeline', [
    n('in', 'Request', 'arrives', 0, 0, 'user'), n('log', 'Logger', 'notes it', 1, 0, 'check'),
    n('json', 'express.json', 'reads the body', 2, 0, 'tool'), n('route', 'Route', 'your handler', 3, 0, 'app'),
  ], [
    { say: 'Middleware are functions that every request passes through, one after another.', on: ['in'] },
    { say: 'The logger records the method, the path and later the time taken, and then calls next().', flow: ['in>log:next()'] },
    { say: 'express.json turns the JSON body into req.body. Without it, req.body is empty.', flow: ['log>json:next()'] },
    { say: 'Finally the route handler runs and sends the response. cors, added earlier in the line, lets the browser app call this API.', flow: ['json>route:handler'] },
    { say: 'If a middleware does not call next() or reply, the request hangs. Order matters.', on: ['log', 'json'] },
  ]),
  'express-routers-and-controllers': A('Router, controller, model', [
    n('index', 'index.js', 'mounts routers', 0, 0, 'app'), n('router', 'Router', 'URL to function', 1, 0, 'tool'),
    n('ctrl', 'Controller', 'does the work', 2, 0, 'check'), n('data', 'Data layer', 'array, then database', 3, 0, 'store'),
  ], [
    { say: 'As the API grows, one big file becomes hard to read. We split it by responsibility.', on: ['index'] },
    { say: 'index.js only mounts routers: /api/jobs goes to the jobs router.', flow: ['index>router:/api/jobs'] },
    { say: 'A router lists the URLs and the functions that answer them, and nothing else.', on: ['router'] },
    { say: 'Controllers hold the logic: read the input, do the work, send the reply.', flow: ['router>ctrl:call'] },
    { say: 'Controllers talk to the data layer. When we move to MongoDB, only this part changes.', flow: ['ctrl>data:read, write'] },
  ]),
  'validation-and-error-handling-in-express': A('One place for errors', [
    n('req', 'Request', 'maybe bad', 0, 0, 'user'), n('val', 'Validation', 'cleanJob()', 1, 0, 'check'),
    n('err', 'HttpError', 'status + message', 2, 0, 'tool'), n('mw', 'Error middleware', 'one JSON shape', 3, 0, 'out'),
  ], [
    { say: 'Never trust what a client sends. A request may have missing fields or the wrong types.', on: ['req'] },
    { say: 'Validation checks the input and keeps only the fields we allow.', flow: ['req>val:body'] },
    { say: 'On a problem we throw an HttpError with a status such as 400 and a clear message.', flow: ['val>err:throw'] },
    { say: 'One error middleware at the end catches every error and sends the same JSON shape.', flow: ['err>mw:next(err)'] },
    { say: 'Unexpected errors become a plain 500 with no stack trace for the visitor. The details go in the log.', on: ['mw'] },
  ]),
  'test-your-api-with-rest-client-and-smoke-script': A('Prove the API works', [
    n('file', 'requests.http', 'REST Client', 0, 0, 'app'), n('curl', 'curl or Postman', 'one-off checks', 1, 0, 'tool'),
    n('api', 'Your API', 'running locally', 2, 0, 'store'), n('smoke', 'smoke.js', 'checks every route', 3, 0, 'check'),
  ], [
    { say: 'After writing routes, try them. A .http file lets VS Code send requests with one click.', flow: ['file>curl:send'] },
    { say: 'curl and Postman do the same from a terminal or an app.', flow: ['curl>api:request'] },
    { say: 'Look at both the status code and the body in each reply.', on: ['api'] },
    { say: 'A smoke script repeats all the checks automatically, so you can run it after every change.', flow: ['smoke>api:all routes'] },
    { say: 'If it prints a failure, you know which route broke before a user finds it.', on: ['smoke'] },
  ]),
  'what-is-mongodb-documents-collections-atlas': A('How MongoDB stores data', [
    n('db', 'Database', 'jobtracker', 0, 0, 'store'), n('col', 'Collection', 'jobs', 1, 0, 'app'),
    n('doc', 'Document', 'JSON-like object', 2, 0, 'data'), n('shell', 'mongosh', 'run queries', 3, 0, 'tool'),
  ], [
    { say: 'A MongoDB server holds databases. Atlas is a hosted service that runs it for you.', on: ['db'] },
    { say: 'A database holds collections, which are like tables.', flow: ['db>col:contains'] },
    { say: 'A collection holds documents. Each one is a JSON-like object with an _id.', flow: ['col>doc:contains'] },
    { say: 'Documents in one collection need not have identical fields. Mongoose will add structure later.', on: ['doc'] },
    { say: 'mongosh lets you try insertOne, find and updateOne by hand to see how it works.', flow: ['shell>doc:find()'] },
  ]),
  'connect-express-to-mongodb-with-mongoose': A('Connect, then listen', [
    n('env', '.env', 'MONGODB_URI', 0, 0, 'check'), n('db', 'connectDB()', 'mongoose.connect', 1, 0, 'tool'),
    n('atlas', 'MongoDB', 'Atlas or local', 2, 0, 'store'), n('srv', 'app.listen', 'starts after', 3, 0, 'app'),
  ], [
    { say: 'The connection string is a secret, so it lives in the .env file.', on: ['env'] },
    { say: 'On start, connectDB reads it and calls mongoose.connect.', flow: ['env>db:URI'] },
    { say: 'Mongoose opens a connection to the database. If this fails the app stops with a clear message.', flow: ['db>atlas:connect'] },
    { say: 'Only after a successful connection do we start listening for requests.', flow: ['atlas>srv:connected'] },
    { say: 'This order means a visitor never reaches an API that has no database behind it.', on: ['srv'] },
  ]),
  'mongoose-schemas-models-and-validation': A('Schema to model to documents', [
    n('schema', 'Schema', 'fields and rules', 0, 0, 'check'), n('model', 'Model', 'mongoose.model', 1, 0, 'tool'),
    n('doc', 'Document', 'new Job({...})', 2, 0, 'data'), n('col', 'jobs collection', 'saved in MongoDB', 3, 0, 'store'),
  ], [
    { say: 'A schema describes a Job: its fields, their types, required fields, defaults and allowed values.', on: ['schema'] },
    { say: 'mongoose.model turns the schema into a model, the tool we use to read and write jobs.', flow: ['schema>model:compile'] },
    { say: 'Creating a document with the model checks it against the schema. Bad data is rejected with a ValidationError.', flow: ['model>doc:create, validate'] },
    { say: 'timestamps adds createdAt and updatedAt for free.', on: ['doc'] },
    { say: 'save() writes the document into the collection.', flow: ['doc>col:save()'] },
  ]),
  'crud-with-mongoose-in-express': A('CRUD: four verbs, four calls', [
    n('post', 'POST /jobs', 'Job.create', 0, 0, 'app'), n('get', 'GET /jobs/:id', 'Job.findById', 1, 0, 'tool'),
    n('patch', 'PATCH /jobs/:id', 'findByIdAndUpdate', 2, 0, 'check'), n('del', 'DELETE /jobs/:id', 'findByIdAndDelete', 3, 0, 'out'),
  ], [
    { say: 'Create, read, update and delete are the four things almost every app does with data.', on: ['post', 'get', 'patch', 'del'] },
    { say: 'POST creates a job with Job.create. Only the allowed fields are taken from the body.', on: ['post'] },
    { say: 'GET finds one job by its id. A malformed id gives 400 and a missing job gives 404.', flow: ['post>get:then read'] },
    { say: 'PATCH updates with runValidators on, so the rules apply to changes too.', flow: ['get>patch:then change'] },
    { say: 'DELETE removes the job and replies 204 with no body.', flow: ['patch>del:then remove'] },
  ]),
  'search-filter-sort-pagination-and-indexes': A('A query that stays fast', [
    n('q', 'Query string', 'q, status, page', 0, 0, 'user'), n('filter', 'Build filter', 'safe regex', 1, 0, 'tool'),
    n('idx', 'Index', 'skips a full scan', 2, 0, 'check'), n('page', 'One page', 'plus the total', 3, 0, 'out'),
  ], [
    { say: 'The client sends options in the URL: a search word, a status, a sort and a page.', on: ['q'] },
    { say: 'The server turns them into a filter. Search text is escaped, so it cannot be used as a regex attack.', flow: ['q>filter:options'] },
    { say: 'An index lets MongoDB jump to matching documents instead of reading all of them.', flow: ['filter>idx:uses'] },
    { say: 'skip and limit return one page, and the total count tells the client how many pages there are.', flow: ['idx>page:skip, limit'] },
    { say: 'The limit is capped, so nobody can ask for a million rows at once.', on: ['page'] },
  ]),
  'mongodb-aggregation-pipeline-for-statistics': A('An aggregation pipeline', [
    n('all', 'All jobs', 'of this user', 0, 0, 'store'), n('match', '$match', 'keep my jobs', 1, 0, 'check'),
    n('group', '$group', 'count per status', 2, 0, 'tool'), n('out', 'Statistics', 'sent as JSON', 3, 0, 'out'),
  ], [
    { say: 'Sometimes we need numbers about the data, not the documents themselves.', on: ['all'] },
    { say: 'An aggregation is a pipeline: each stage gets the output of the stage before it.', flow: ['all>match:documents'] },
    { say: '$match keeps only the jobs we want, here the ones that belong to the user.', on: ['match'] },
    { say: '$group puts them into buckets by status and counts each bucket.', flow: ['match>group:filtered'] },
    { say: 'We shape the result into a simple object, and add an interview rate, for the dashboard.', flow: ['group>out:counts'] },
  ]),
};
