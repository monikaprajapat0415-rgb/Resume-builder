import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';
import { RAN, SETUP, run } from './kit2.js';

const S = 'Express Structure and REST in Depth';

export const lessons = [
  // ---------------------------------------------------------------- 19
  les(S, 'express-project-structure-mvc-static-files-and-app-settings', 'Express Project Structure: MVC, Static Files and App Settings', 'Express Structure, MVC and Static Files',
    'Split an Express app into store, controller and routes files, serve static files, use app settings, and finish with a 404 handler and one error handler.', [
    P("A tutorial server often lives in one file, and that is fine for learning. A real project grows to dozens of routes, and one file becomes painful to read, test and change. This lesson shows a simple structure that you will see in most Express projects. It is usually called **MVC**, short for model, view and controller, though in an API the view is just JSON. The goal is not to follow a rule. The goal is that each file has one job, so you always know where to look."),
    H("Who does what"),
    L("**Store (model):** reads and writes data. It knows nothing about HTTP. Later you can swap it for MongoDB without touching anything else.", "**Controller:** receives the request values, calls the store, and decides the response and status code.", "**Routes:** a list that connects a method and a path, such as `GET /api/books/:id`, to a controller function.", "**App:** creates the Express app, adds middleware, mounts the routes, and adds the 404 and error handlers.", "**Server:** a tiny file that calls `app.listen`. Keeping it separate lets tests import the app without opening a port."),
    P("The separation has a practical payoff: you can test the controller with a fake store, or test the whole app with Supertest and no real port. Both are used later in the course. The example below is a small book API in four files plus a web page."),
    H("The store and the controller"),
    SETUP('express', ['Save the files below in one folder, with the names shown in the comments at the top of each block. Put the web page in a folder called `s19-public`.']),
    C('js', '// s19-store.js\n' + code('s19-store.js')),
    C('js', '// s19-controller.js\n' + code('s19-controller.js')),
    P("The store keeps books in an array and gives each an id. The controller functions take `(req, res)` and use the store. Notice that they are factory functions that receive the store as an argument. That is the simplest form of **dependency injection**: the controller does not create its own store, so a test can pass a different one."),
    H("Routes and the app"),
    C('js', '// s19-routes.js\n' + code('s19-routes.js')),
    C('js', '// s19-app.js\n' + code('s19-app.js')),
    P("Read the app file from the top. `app.disable('x-powered-by')` removes a header that tells everyone you use Express, which gives attackers a small hint for free. `app.set('trust proxy', 1)` tells Express that one proxy, such as nginx, sits in front, so `req.ip` and `req.protocol` show the real visitor. Without it, every visitor looks like the proxy. `json spaces` makes JSON replies readable while you develop; remove it in production to save bytes."),
    P("`express.static` serves the files of a folder as they are. A request to `/` returns `s19-public/index.html`, and a request to `/style.css` returns that file if it exists. Static files are meant for your front-end build, images and a favicon. Never point it at a folder that contains code or secrets, because every file inside is public."),
    H("404 and the error handler"),
    P("Express runs middleware in the order you add it. The two functions at the bottom of the app are the safety net. The first has no path, so it catches any request that no route handled, and returns a JSON 404. The second has **four** parameters, `(err, req, res, next)`. That fourth parameter is how Express recognises an error handler, so keep it even if you do not use `next`. Any error thrown in a route reaches it, and in Express 5 that includes errors from async functions. The handler logs the real error for you and sends the client a short, safe message. Lesson 33 expands this into a full logging and error system."),
    N("Order matters. Put the 404 handler after all routes and the error handler last. A route added after them is never reached."),
    H("Environment settings"),
    P("The behaviour of the app should change with the environment, not with edited code. `process.env.NODE_ENV` is `production` on a live server, and several libraries, including Express, use it to turn on faster, quieter behaviour. Read the port, database address and secrets from environment variables as well. Lesson 31 builds a validated configuration file for this."),
    RAN,
    P("The test for this lesson starts the app with Supertest, fetches the home page, creates a book, reads it back, deletes it, and checks that a missing id returns 404. It passes, and you can find it in the course code as `s19.test.js`."),
    ...task("Add a `PATCH /api/books/:id` route that changes only the fields sent.", "Add a second store file that saves the books in a JSON file and swap it in without changing the controller.", "Add a route that deliberately throws an error and check that the client sees only the safe message."),
    ...check("`GET /` returns the web page.", "A wrong URL returns a JSON 404, not an HTML error page.", "You can say which file you would open to change a status code, and which to change where data is saved."),
  ], A('Where each file fits', [
    n('route', 'Routes', 'method + path', 0, 0, 'tool'), n('ctrl', 'Controller', 'reads req, sends res', 1, 0, 'app'),
    n('store', 'Store', 'saves the data', 2, 0, 'store'), n('err', 'Error handler', 'safe 404 and 500', 3, 0, 'check'),
  ], [
    { say: 'The router matches the method and path and picks a controller function.', on: ['route'] },
    { say: 'The controller reads the request and decides what to do.', flow: ['route>ctrl:call'] },
    { say: 'The store reads or writes data. It knows nothing about HTTP.', flow: ['ctrl>store:data'] },
    { say: 'Anything that fails travels on to the error handler, which hides the details from clients.', flow: ['store>err:throws'] },
  ]), [
    faq('Is MVC required in Express?', 'No. Express has no fixed structure. MVC is a common convention because it keeps files small and testable.'),
    faq('Why separate app.js from server.js?', 'Tests can import the app and call it with Supertest without opening a network port.'),
    faq('Why does the error handler need four parameters?', 'Express decides a function is an error handler by counting its parameters. With three it is treated as normal middleware.'),
  ]),

  // ---------------------------------------------------------------- 20
  les(S, 'rest-api-design-status-codes-versioning-pagination-filtering-sorting-search', 'REST API Design: Status Codes, Versioning, Paging, Filtering and Search', 'REST API Design: Paging and Search',
    'Design a clean REST API in Express with correct status codes, URL versions, safe paging limits, filtering, sorting and search, with a tested working example.', [
    P("A REST API is a promise to other programmers, including the front-end developer who joins next year. If the URLs and replies are predictable, they can use your API without asking you questions. If they are not, every endpoint becomes a small mystery. This lesson collects the habits that make an API predictable, and shows each one in a tested example of 45 products."),
    H("Nouns for URLs, verbs for methods"),
    P("A URL names a **thing**, and the HTTP method says what to do with it. Use plural nouns: `/api/v1/products` is the collection and `/api/v1/products/7` is one item. `GET` reads, `POST` creates, `PUT` replaces, `PATCH` changes part of it, and `DELETE` removes it. Avoid verbs in paths such as `/getProducts` or `/deleteProduct`, because the method already says that. For relations, nest only one level: `/users/5/orders` is clear, while `/users/5/orders/9/items/3/notes` is a sign to flatten."),
    H("Status codes that tell the truth"),
    L("**200** OK for a successful read or update. **201** Created after a `POST`, with a `Location` header holding the new URL. **204** No Content for a delete.", "**400** when the request is malformed. **401** when the user is not logged in. **403** when the user is logged in but not allowed. **404** when the item does not exist.", "**409** Conflict when the request clashes with the current state, for example a duplicate email. **422** when the data is well-formed but fails the rules, for example a negative price.", "**429** when the client sent too many requests. **500** for your own bugs. Never send 200 with an error message inside; clients and monitoring tools trust the code."),
    P("The most common mistakes are using 200 for everything and mixing up 401 and 403. 401 really means *unauthenticated*: we do not know who you are. 403 means we know you, and the answer is still no."),
    H("Paging, filtering, sorting and search"),
    P("A list endpoint that returns every row works on your laptop and fails in production. The fix is **paging**: the client asks for a page and a size. The server must also set a **maximum size**, otherwise a client can ask for `limit=1000000`. In the code, `clamp` keeps numbers inside a safe range and falls back to a default when the value is not a number at all. Filtering, sorting and search then narrow the list. Sorting only accepts a short list of allowed field names, never a field name copied straight from the URL, because a free field name can expose private fields or break database queries."),
    SETUP('express', ['Save the code as `api.js`. The test below it needs `npm install -D supertest` and runs with `node --test`.']),
    C('js', code('r20-api.js')),
    P("Try these URLs once the app is listening: `/api/v1/products?page=2&limit=5`, `/api/v1/products?category=books&sort=price&order=desc`, and `/api/v1/products?q=item 0`. Return a small envelope with the data and the paging details, such as the current page, the size and the total count, so a front end can draw page buttons. For very large or fast-changing data, **cursor paging** (\"give me the items after this id\") is more stable than page numbers, but page numbers are simpler and enough for most projects."),
    C('js', code('r20.test.js')),
    C('text', `ok 1 - paging
ok 2 - limit is capped and bad numbers fall back
ok 3 - filter, sort and search
ok 4 - status codes
ok 5 - version 2 has its own shape`),
    H("Versioning"),
    P("Once other people use your API you cannot freely change replies, or their apps break. A **version in the URL**, `/api/v1` and `/api/v2`, lets you publish a new shape while the old one keeps working. The example has a version 2 that changes the shape of the list reply. Do not create a new version for every small change. Adding a new field is safe in the same version. Renaming or removing a field is the kind of change that needs v2. Announce the end date of an old version in advance, and keep it running until then."),
    N("Treat every query-string value as text that a stranger typed. Convert, check and clamp it before use, and only use values from a list you chose for sort and filter fields."),
    RAN,
    ...task("Add `DELETE /api/v1/products/:id` that returns 204, and 404 for a missing id.", "Add a `fields` query, for example `?fields=name,price`, that returns only the allowed fields.", "Return the total number of pages in the reply and write a test for the last page."),
    ...check("Your five tests pass.", "`limit=9999` returns at most 50 items.", "A bad `sort` value falls back to `id` instead of crashing."),
  ], A('One list request, safe at each step', [
    n('q', 'Query string', 'page, sort, q', 0, 0, 'user'), n('clean', 'Clamp and check', 'limits and allow-list', 1, 0, 'check'),
    n('db', 'Filter and sort', 'on the data', 2, 0, 'store'), n('reply', 'Page + totals', '200 with a small envelope', 3, 0, 'out'),
  ], [
    { say: 'The client sends page, limit, sort and search words in the URL.', on: ['q'] },
    { say: 'The server converts them, caps the limit and allows only known sort fields.', flow: ['q>clean:text in'] },
    { say: 'Only then are the filters, the sort and the page slice applied.', flow: ['clean>db:safe values'] },
    { say: 'The reply carries the items plus the page, size and total so a front end can draw page buttons.', flow: ['db>reply:200'] },
  ]), [
    faq('Should I use PUT or PATCH?', 'Use PUT when the client sends the complete new version of the item, and PATCH when it sends only the fields that change.'),
    faq('When do I need API versions?', 'When you must change or remove a field that other apps already use. Adding new fields normally needs no new version.'),
    faq('Page numbers or cursors?', 'Page numbers are simpler and fine for most apps. Cursors suit very large or constantly changing lists, where page numbers can skip or repeat items.'),
  ]),

  // ---------------------------------------------------------------- 21
  les(S, 'document-your-api-openapi-swagger-ui-and-postman', 'Document Your API: OpenAPI, Swagger UI and Postman', 'API Docs: OpenAPI, Swagger, Postman',
    'Describe an Express API in an OpenAPI file, serve interactive Swagger UI documentation, and test the same endpoints in Postman, with a tested working example.', [
    P("An API without documentation is only half finished. The front-end developer, the mobile developer and your own future self all need to know the URLs, the fields and the possible errors. Writing that in a chat message goes out of date in a week. The standard solution is an **OpenAPI** file: a machine-readable description of the API. Tools turn that one file into interactive pages, test requests and even client code."),
    H("What an OpenAPI file contains"),
    P("OpenAPI, which many people still call by its old name Swagger, is a JSON or YAML file with a fixed structure. It lists each path, each method on that path, the parameters it accepts, the body it expects, and every response it can return, with the status code and shape. The `components` section holds shapes you reuse, such as a `Product`, so you describe them once. The file for our product API is below. Read the `paths` first, then `components`."),
    C('json', code('r21-openapi.json')),
    P("Notice that the file documents the errors as well as the success cases. A client developer needs to know that a missing item returns 404 and that a wrong body returns 422 with a list of problems. Good documentation answers the question \"what can go wrong?\", not only \"what do I send?\"."),
    H("Serving interactive docs with Swagger UI"),
    P("**Swagger UI** reads the file and draws a web page where each endpoint can be opened, filled in and tried with a button. With the `swagger-ui-express` package it takes three lines. You also serve the raw file at `/openapi.json`, because other tools, such as Postman, can import it from there."),
    SETUP('express swagger-ui-express', ['Save the OpenAPI file as `r21-openapi.json` next to the code. For the test, install `npm install -D supertest`.']),
    C('js', code('r21-docs.js')),
    C('js', code('r21.test.js')),
    P("The test confirms that the spec is served as JSON and that the docs page loads. The docs usually live at a path such as `/docs`. In a real product, think about whether the documentation should be public. Public APIs benefit from open docs. For a private internal API, put the docs behind a login or serve them only in development, because they give an attacker a complete map of your endpoints."),
    H("Keeping the file true"),
    P("The danger is a document that disagrees with the code. There are two ways to avoid it. You can **write the spec first** and build the code to match, which makes the file the agreement between front end and back end. Or you can **generate** the spec from comments or schemas in the code, for example with Zod and a conversion library. Whichever you choose, add a test that checks real replies against the described shapes, and review the file in every pull request that changes an endpoint."),
    H("Testing by hand with Postman"),
    P("**Postman** is an app for sending requests and saving them. Import `http://localhost:3000/openapi.json` and it creates a collection with one request for every endpoint. Use an *environment* with a variable such as `baseUrl`, so the same collection works on your laptop and on the live server by switching one setting. Postman can also run simple checks on each reply, for example that the status is 201 and the body has an `id`, and can run a whole collection in a row, which is a gentle introduction to automated API tests. Insomnia and the VS Code extension Thunder Client do the same job, and `curl` always works from a terminal."),
    L("Document every status code you return, including 401, 403, 404 and 422.", "Give each field a type and one example value.", "Never put real passwords, tokens or customer data in examples.", "Commit the spec to Git so its history shows when the API changed."),
    RAN,
    N("The Swagger UI package ships its own copy of the front-end files and its version changes, so run the test again after you update it."),
    ...task("Add the `DELETE` operation to the file and see it appear in the docs page.", "Import the spec in Postman and send a request to create a product.", "Protect `/docs` so that it only loads when `NODE_ENV` is not `production`."),
    ...check("`/openapi.json` returns the spec.", "`/docs` shows every endpoint and the Try it out button works.", "You can say which status codes each endpoint can return without opening the code."),
  ], A('One file, three uses', [
    n('spec', 'openapi.json', 'the single truth', 0, 0, 'data'), n('ui', 'Swagger UI', 'docs you can try', 1, 0, 'out'),
    n('pm', 'Postman', 'import and test', 2, 0, 'tool'), n('dev', 'Front-end dev', 'reads and builds', 3, 0, 'user'),
  ], [
    { say: 'You describe the API once in an OpenAPI file and keep it in Git.', on: ['spec'] },
    { say: 'Swagger UI turns the file into pages where each endpoint can be tried.', flow: ['spec>ui:render'] },
    { say: 'Postman imports the same file into a ready collection of requests.', flow: ['ui>pm:import'] },
    { say: 'The front-end developer builds against the agreement without asking you.', flow: ['pm>dev:shared'] },
  ]), [
    faq('Is Swagger the same as OpenAPI?', 'OpenAPI is the specification. Swagger was its old name and is now the name of a set of tools, such as Swagger UI, that read it.'),
    faq('Should my API docs be public?', 'For a public API, yes. For an internal API, serve them only in development or behind a login.'),
    faq('How do I stop the docs going out of date?', 'Write the spec first or generate it from your schemas, and add a test that compares real replies with the described shapes.'),
  ]),

  // ---------------------------------------------------------------- 22
  les(S, 'file-uploads-in-express-with-multer-validation-and-cloud-storage', 'File Uploads in Express: Multer, Validation and Cloud Storage', 'File Uploads in Express with Multer',
    'Accept uploads safely in Express with Multer: size limits, checking real file types by their first bytes, random file names, and a storage driver for the cloud.', [
    P("Letting users upload files is one of the riskiest features you can add. A profile photo or a PDF resume feels harmless, but the file is data from a stranger that you will store, and perhaps show to other people. Careless upload code has led to servers being taken over, disks being filled and private files being leaked. This lesson shows the safe way, using the **Multer** package, and a tested example."),
    H("How uploads work"),
    P("A normal JSON body cannot carry a file well, so browsers use **multipart/form-data**, which splits a request into named parts, some text and some files. Express does not read this format, so Multer does. It reads the parts and gives you `req.file` for one upload or `req.files` for many. You choose where the bytes go: to the disk, or into memory as a Buffer."),
    H("Five rules for safe uploads"),
    L("**Set a size limit.** Without one, a single request can fill your memory or your disk. Here it is 1 MB.", "**Check the real type.** The `Content-Type` and the file name come from the client, who can lie. Look at the first bytes of the file, which are called the *magic number*. A PNG always starts with the same eight bytes, a PDF with `%PDF-`.", "**Use an allow-list** of types you accept, instead of a block-list of bad ones.", "**Make your own file name.** A random UUID plus the extension you decided. Never use the original name to build a path, because a name such as `../../app.js` is an attack called path traversal.", "**Do not serve uploads as code.** Store them outside your source folders, or in cloud storage, and send them with the correct type."),
    SETUP('express multer', ['Save the code as `upload.js`. The test needs `npm install -D supertest`.']),
    C('js', code('u22-upload.js')),
    P("Read the code in the order a request travels. Multer's `memoryStorage` puts the file in `req.file.buffer`, and the `limits` option stops anything over 1 MB. Then `sniff` compares the first bytes with the known signatures. If the result is not in the allow-list, the route replies 415 or 422 and nothing is saved. Only a passed file is given a random name and handed to the **storage driver**."),
    H("A storage driver keeps your options open"),
    P("Look at `localStorageDriver`: it has one method, `save`, that takes a buffer and a name and returns a URL. Everything else in the app uses that method only. When the project grows and local disk is no longer enough, because you have several servers or want a content delivery network, you write another driver with the same method that sends the file to Cloudinary, ImageKit or Amazon S3, and change one line where the app is created. That is the idea of a stable interface in front of a changeable detail, and project 8 in this course shows an ImageKit driver."),
    H("Handling Multer errors"),
    P("When a limit is exceeded, Multer raises a `MulterError`, such as `LIMIT_FILE_SIZE`. If you do nothing, the client sees a confusing 500. The example catches it and returns **413 Payload Too Large** with a clear message. Also reject requests that have no file at all, with 400."),
    C('js', code('u22.test.js')),
    P("The test sends a real PNG, a text file that pretends to be a PNG, a file that is too large, and a request with no file. Only the first is accepted. Run it with `node --test` and read what each case returns."),
    N("Cloud driver code for Cloudinary and ImageKit is shown in project 8 but was not run, because those services need an account and keys. Check their current documentation before you copy it."),
    H("Beyond the basics"),
    P("For large files, such as video, do not pass them through your server at all. Ask the cloud provider for a short-lived **signed upload URL**, and let the browser send the file straight to it. Your server only records the result. For images, resize and convert them on upload, because a 12 MB phone photo does not belong on a web page. For files that others will open, such as PDF resumes, consider a virus scan, which cloud storage services and tools like ClamAV can provide."),
    RAN,
    ...task("Add GIF support, including its magic bytes, and a test.", "Change the limit to 200 KB for a profile photo and watch the 413 reply.", "Write a second driver that saves into a `uploads-b` folder and swap it in."),
    ...check("A real PNG returns a URL and a fake PNG is refused.", "A big file returns 413.", "No saved file uses the name the user sent."),
  ], A('An upload passes four gates', [
    n('file', 'Multipart request', 'file + text', 0, 0, 'user'), n('limit', 'Size limit', 'Multer stops big files', 1, 0, 'check'),
    n('type', 'Real type check', 'first bytes, allow-list', 2, 0, 'check'), n('drv', 'Storage driver', 'random name, save', 3, 0, 'store'),
  ], [
    { say: 'The browser sends the file as multipart form data.', on: ['file'] },
    { say: 'Multer reads it and rejects anything above the size limit.', flow: ['file>limit:read'] },
    { say: 'The first bytes are compared with known file signatures, not the name the client gave.', flow: ['limit>type:buffer'] },
    { say: 'Only then is the file saved under a random name through the storage driver.', flow: ['type>drv:save'] },
  ]), [
    faq('Why check the first bytes instead of the file extension?', 'The extension and the Content-Type come from the client and can be faked. The first bytes are part of the real file format.'),
    faq('Should uploads go on my server disk?', 'It is fine for a small app. With several servers or a lot of files, use cloud storage, so every copy of your app sees the same files.'),
    faq('How do I handle very large uploads?', 'Use signed upload URLs so the browser sends the file directly to cloud storage, and only record the result on your server.'),
  ]),

  // ---------------------------------------------------------------- 23
  les(S, 'calling-third-party-apis-and-webhooks-timeouts-retries-and-signatures', 'Calling Third-Party APIs and Webhooks: Timeouts, Retries, Signatures', 'Third-Party APIs and Webhooks in Node',
    'Call other services from Node.js with timeouts and safe retries with backoff, and verify webhooks with an HMAC signature and a constant-time comparison.', [
    P("Almost every real back end talks to other services: a payment provider, an email service, a maps API, an AI model, a government database. Those services are outside your control. They are sometimes slow, sometimes down, and sometimes send you data you did not expect. A server that assumes they always work will fail in the worst possible moment. This lesson has two halves: calling other APIs defensively, and receiving **webhooks**, where another service calls you."),
    H("Calling an API: three habits"),
    P("Node 18 and later has `fetch` built in, so you need no extra package for simple calls. Raw `fetch` has no timeout, though, so a service that never answers can leave your request waiting forever and use up your server. Build one small wrapper function that every call goes through, and put these habits in it."),
    L("**A timeout.** `AbortSignal.timeout(2000)` cancels the request after two seconds.", "**Retries for temporary failures.** Network errors, 5xx replies and 429 (too many requests) are often gone a moment later, so try again.", "**No retry for your own mistakes.** A 400, 401, 403 or 404 will fail the same way every time, so retrying only wastes time.", "**Exponential backoff.** Wait a little, then longer, for example 50, 100, 200 milliseconds, so you do not hammer a service that is already struggling.", "**A limit on attempts,** then a clear error that the rest of your app can handle."),
    SETUP('', ['Save the code as `client.js`. The test uses only Node, with no extra packages.']),
    C('js', code('t23-client.js')),
    P("In `fetchJson`, a loop runs up to `retries + 1` times. Inside it, the `fetch` call carries the timeout signal. A 4xx reply other than 429 is thrown straight away. A network error, a timeout or a 5xx makes the loop sleep for `baseDelayMs * 2 ** attempt` and try again. The test starts a small fake server that fails twice and then answers, one that always returns 404, and one that is too slow, and checks that the wrapper behaves correctly in each case."),
    N("Only retry requests that are safe to repeat. A `GET` is safe. A `POST` that charges a card is not, unless the provider supports an **idempotency key**, a unique value you send so the provider ignores the repeat. Lesson 37 shows this."),
    H("Receiving webhooks"),
    P("A **webhook** is a request that a service sends to your server when something happens, for example \"payment succeeded\" or \"new commit pushed\". Instead of asking again and again, you give them a URL and they call it. The risk is obvious: anyone on the internet can send a request to that URL and claim that a payment succeeded. You must check that the request really came from the provider."),
    P("The usual method is an **HMAC signature**. You and the provider share a secret. For each webhook the provider calculates a hash of the exact body using the secret and sends it in a header. You calculate the same hash and compare. An attacker who does not know the secret cannot produce a matching signature. Three details matter. First, hash the **raw bytes** of the body, before `express.json()` changes them, or the hash will not match. Second, compare with `crypto.timingSafeEqual`, because an ordinary `===` stops at the first different character and can leak information through timing. Third, reject requests with a missing or wrong-length signature before comparing."),
    P("In Express, use `express.raw({ type: 'application/json' })` on the webhook route only, so the body arrives as a Buffer, verify it, and then `JSON.parse` it yourself. Always answer quickly with a 200 after you have verified and saved the event, and do slow work later in a queue, because providers resend if you take too long. Since they can resend, store the event id and ignore ids you have already handled."),
    RAN,
    ...task("Add jitter, a small random amount, to the backoff delay, and explain why it helps when many clients retry together.", "Make the wrapper read the `Retry-After` header on a 429.", "Write an Express route that receives a webhook, verifies the signature and answers 401 for a bad one."),
    ...check("All four tests pass.", "A 404 is tried once, not three times.", "You can say why the raw body is needed for the signature."),
  ], A('Safe calls out, trusted calls in', [
    n('app', 'Your server', 'wrapper with timeout', 0, 0, 'app'), n('api', 'Other service', 'may be slow or down', 1, 0, 'cloud'),
    n('hook', 'Webhook in', 'raw body + signature', 2, 0, 'data'), n('ok', 'Verified event', 'saved once, 200', 3, 0, 'check'),
  ], [
    { say: 'Calls to other services go through one wrapper with a timeout.', on: ['app'] },
    { say: 'Temporary failures are retried with a growing delay. 4xx errors are not retried.', flow: ['app>api:fetch + retry'] },
    { say: 'When a service calls you, the signature is checked against the raw body.', flow: ['api>hook:POST'] },
    { say: 'Only a verified, not-yet-seen event is saved and answered with 200.', flow: ['hook>ok:HMAC ok'] },
  ]), [
    faq('Which errors should I retry?', 'Network errors, timeouts, 5xx replies and 429. Do not retry 4xx errors such as 400 or 404, because they will fail again.'),
    faq('Why use timingSafeEqual?', 'A normal comparison stops at the first difference, and the time it takes can leak how much of a guess was correct. timingSafeEqual takes the same time either way.'),
    faq('What if the provider sends the same webhook twice?', 'Store the event id and skip ids you have already processed, so the work is done only once.'),
  ]),
];
