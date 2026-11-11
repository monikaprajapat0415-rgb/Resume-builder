const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'nodejs-express-course';
export const quizzes = {
  'what-is-nodejs-and-your-first-script': [
    Q('What is Node.js?', ['A runtime that runs JavaScript outside the browser', 'A new programming language', 'A web browser'], 0, 'It is not a new language and not a framework.'),
    Q('Which version should you download for learning and real projects?', ['LTS (long-term support)', 'The newest experimental build', 'Any very old version'], 0),
    Q('What kind of work suits Node.js well?', ['Programs that spend most of their time waiting for the network or a database', 'Heavy video editing on a single thread', 'Drawing graphics'], 0),
  ],
  'modules-npm-and-package-json': [
    Q('What does "type": "module" in package.json do?', ['Makes .js files ES modules so import and export work', 'Installs Express', 'Turns off errors'], 0),
    Q('Should you commit node_modules to git?', ['No, add it to .gitignore', 'Yes, always', 'Only on Fridays'], 0, 'Commit package.json and package-lock.json instead.'),
    Q('How many default exports can a file have?', ['One', 'As many as you like', 'None'], 0, 'A file can have many named exports but only one default export.'),
  ],
  'files-paths-and-built-in-modules': [
    Q('Why use path.join instead of joining paths with "/" by hand?', ['Windows and Linux use different separators', 'It is shorter', 'It encrypts the path'], 0),
    Q('What does the error code ENOENT mean?', ['The file or folder does not exist', 'No permission', 'It already exists'], 0),
    Q('What does readFile return without an encoding?', ['Raw bytes', 'Text', 'A number'], 0, 'Use the encoding \'utf8\' to get text.'),
  ],
  'async-javascript-promises-and-event-loop': [
    Q('What is a promise?', ['An object standing for a value that is not ready yet', 'A kind of loop', 'A type of file'], 0),
    Q('Why should you avoid long synchronous work in request code?', ['It blocks the thread and no other request is answered meanwhile', 'It uses more disk', 'It is not allowed by Node'], 0),
    Q('What happens if you forget await before a promise?', ['You get the promise object, not its value', 'The program stops', 'Nothing, it works the same'], 0),
  ],
  'your-first-http-server-with-node': [
    Q('What does a 404 status code mean?', ['The thing was not found', 'It worked', 'The server crashed'], 0, 'The 4xx codes mean the client made a mistake; 5xx means a server problem.'),
    Q('Which HTTP method is for reading data and should not change anything?', ['GET', 'POST', 'DELETE'], 0),
    Q('The error EADDRINUSE usually means…', ['Another program or an old copy of your server is using the port', 'Your file is missing', 'The password is wrong'], 0),
  ],
  'your-first-express-server': [
    Q('What does app.get(path, handler) say?', ['When a GET request arrives for this path, run this function', 'Download a file', 'Start the database'], 0),
    Q('What is req.query?', ['Values after the question mark in the URL, such as ?done=true', 'Values from the path', 'The response body'], 0),
    Q('What does res.json(object) do?', ['Sends the object as JSON and sets the content type', 'Reads a JSON file', 'Closes the server'], 0),
  ],
  'express-routing-params-query-and-routers': [
    Q('In the route /api/tasks/:id, what is req.params.id for /api/tasks/2?', ['The text \'2\'', 'The number 2', 'undefined'], 0, 'Parameters are always strings.'),
    Q('Which status code should follow a successful create?', ['201', '204', '404'], 0),
    Q('Why does route order matter?', ['Express uses the first route that sends a response', 'It does not', 'Express runs them all'], 0),
  ],
  'express-middleware-explained': [
    Q('A middleware must either send a response or…', ['call next()', 'restart the server', 'throw an error'], 0, 'Otherwise the request hangs until the client gives up.'),
    Q('Where must express.json() be placed?', ['Before any route that reads req.body', 'After all routes', 'It does not matter'], 0),
    Q('In Express 5, what is req.body if the request had no JSON content type?', ['undefined', 'An empty object', 'null'], 0),
  ],
  'build-a-rest-api-crud-routes': [
    Q('Which method and path create a new task?', ['POST /api/tasks', 'GET /api/tasks', 'DELETE /api/tasks/:id'], 0),
    Q('What status does the lesson use after a successful delete with nothing to return?', ['204', '200 with the whole list', '500'], 0),
    Q('Why is data kept in a plain array at first?', ['To keep the code simple; the data disappears when the server stops', 'Arrays are the best database', 'To avoid using routes'], 0),
  ],
  'validation-and-error-handling-in-express': [
    Q('Which status code should an API send for invalid input?', ['400', '500', '200'], 0, 'Never use 500 for bad input.'),
    Q('Why build a new object with only the allowed fields?', ['Extra fields like id or ownerId sent by the client are dropped', 'It runs faster', 'JSON requires it'], 0),
    Q('Where is the central error handler registered?', ['Last, after all routes', 'First', 'Inside each route'], 0),
  ],
  'environment-variables-and-saving-data-to-a-file': [
    Q('Why do settings and secrets not belong in the code?', ['Each place needs different values and secrets must not be committed', 'JavaScript cannot store text', 'They are faster in the environment'], 0),
    Q('What type are all values in process.env?', ['Strings (or undefined when missing)', 'Numbers', 'Booleans'], 0),
    Q('What should you commit instead of your real .env?', ['A .env.example with names and harmless sample values', 'Nothing at all', 'The real .env'], 0),
  ],
  'mongodb-and-mongoose-for-your-api': [
    Q('In MongoDB, data is stored as…', ['Documents grouped in collections', 'Rows and columns only', 'Plain text files'], 0),
    Q('What does a Mongoose schema describe?', ['The shape of a document: fields, types and rules', 'The server address', 'The HTTP routes'], 0),
    Q('Why await mongoose.connect before starting the server?', ['So no request arrives before the database is ready', 'It is required by JavaScript', 'It makes the server slower'], 0),
  ],
  'user-login-with-password-hashing-and-jwt': [
    Q('What should you store instead of a password?', ['A hash made with bcrypt', 'The password in plain text', 'The password in a cookie'], 0),
    Q('A JWT is…', ['Signed, but not encrypted, so never put secrets inside it', 'Encrypted and unreadable', 'A password'], 0),
    Q('Where should the JWT secret be stored?', ['Only in the environment, long and random', 'In the front-end code', 'In the README'], 0),
  ],
  'secure-your-express-api-cors-helmet-rate-limit': [
    Q('Does CORS protect your API from curl or scripts?', ['No, it is enforced by browsers only', 'Yes, completely', 'Only on Windows'], 0, 'You still need authentication and validation.'),
    Q('What does express-rate-limit answer after the limit is passed?', ['429 Too Many Requests', '200 OK', '301 Moved'], 0),
    Q('What does the helmet middleware do?', ['Sets HTTP headers that tell browsers to be careful', 'Hashes passwords', 'Connects to the database'], 0),
  ],
  'test-and-deploy-your-node-api': [
    Q('Why is it useful to have tests for your API?', ['They catch problems when you change the code', 'They make the server faster', 'They replace validation'], 0),
    Q('Which Node feature runs tests without extra packages, as in the course?', ['node --test', 'node --server', 'node --check-all'], 0),
    Q('Where should live-server settings and secrets come from?', ['Environment variables on the server', 'The code in the repository', 'A public file'], 0),
  ],
  'javascript-essentials-for-node-destructuring-closures-promises-and-the-event-loop': [
    Q('What does spread do in { ...user, age: 30 }?', ['Copies the properties into a new object, leaving user unchanged', 'Deletes the age from user', 'Changes the original user object'], 0),
    Q('What is a closure?', ['A function that remembers the variables around where it was created', 'A function that cannot be called', 'A way to close a file'], 0),
    Q('Why must you not block the event loop in a handler?', ['Every other user waits until it finishes', 'Node refuses to start', 'It deletes the cache'], 0),
  ],
  'node-core-modules-eventemitter-streams-buffers-os-and-process': [
    Q('Why use pipeline instead of .pipe()?', ['It passes errors along and cleans up all streams', 'It is the only way to read files', 'It makes files smaller'], 0),
    Q('What happens if an EventEmitter emits error and nothing listens?', ['Node throws and the process can crash', 'The error is ignored', 'The event is queued for later'], 0),
    Q('What is a Buffer?', ['A fixed block of raw bytes', 'A type of loop', 'A web page cache'], 0),
  ],
  'scaling-node-worker-threads-child-processes-and-the-cluster-module': [
    Q('Which tool fits a heavy JavaScript calculation?', ['A worker thread', 'The cluster module', 'A longer timeout'], 0),
    Q('Why use execFile with an argument array instead of exec with a built string?', ['User input cannot inject extra shell commands', 'It is always faster', 'It uses less memory'], 0),
    Q('Why does an in-memory session break when you run several copies of a server?', ['Each copy has its own memory', 'Sessions are not allowed in cluster mode', 'The port changes'], 0),
  ],
  'express-project-structure-mvc-static-files-and-app-settings': [
    Q('What does the controller do in the structure shown?', ['Reads the request, calls the store and decides the response', 'Saves the data to disk', 'Starts the server'], 0),
    Q('Why keep app.js and server.js separate?', ['Tests can import the app without opening a port', 'Express requires it', 'It makes routes faster'], 0),
    Q('How does Express recognise an error handler?', ['It has four parameters', 'Its name contains error', 'It is the first middleware'], 0),
  ],
  'rest-api-design-status-codes-versioning-pagination-filtering-sorting-search': [
    Q('Which status code means the user is logged in but not allowed?', ['403', '401', '404'], 0, '401 means not authenticated, 403 means not allowed.'),
    Q('Why set a maximum limit on a list endpoint?', ['A client could ask for a huge number of rows at once', 'It makes JSON smaller', 'HTTP requires it'], 0),
    Q('When do you need a new API version such as /v2?', ['When you must rename or remove something clients already use', 'Whenever you add a field', 'Every month'], 0),
  ],
  'document-your-api-openapi-swagger-ui-and-postman': [
    Q('What is an OpenAPI file?', ['A machine-readable description of your API', 'A database backup', 'A front-end framework'], 0),
    Q('What does Swagger UI do with the file?', ['Draws interactive docs where you can try each endpoint', 'Deploys the server', 'Encrypts the API'], 0),
    Q('Why document the error responses too?', ['Client developers need to know what can go wrong', 'It makes the file longer', 'Postman requires it'], 0),
  ],
  'file-uploads-in-express-with-multer-validation-and-cloud-storage': [
    Q('Why check the first bytes of an uploaded file?', ['The name and Content-Type come from the client and can be faked', 'It makes the upload faster', 'Multer cannot read the extension'], 0),
    Q('Why create your own random file name?', ['A user-supplied name can contain a path such as ../../ that escapes your folder', 'Random names are shorter', 'Browsers require it'], 0),
    Q('What does the storage driver idea give you?', ['You can switch from disk to cloud storage by changing one piece', 'Faster uploads', 'No size limits'], 0),
  ],
  'calling-third-party-apis-and-webhooks-timeouts-retries-and-signatures': [
    Q('Which failure should you retry?', ['A 503 reply or a network timeout', 'A 404 reply', 'A 400 reply'], 0),
    Q('Why does a webhook signature check need the raw body?', ['The hash is calculated over the exact bytes that were sent', 'JSON is not allowed in webhooks', 'The raw body is smaller'], 0),
    Q('Why use timingSafeEqual to compare signatures?', ['A normal comparison can leak information through timing', 'It is easier to read', 'It ignores case'], 0),
  ],
  'mongodb-relationships-populate-indexes-and-sql-versus-nosql': [
    Q('When should you reference instead of embed?', ['When the related data is large, shared or grows without limit', 'When the data is tiny and always read together', 'Never'], 0),
    Q('What does populate do?', ['Replaces a stored id with the referenced document using another query', 'Creates an index', 'Deletes old documents'], 0),
    Q('An index on { author: 1, createdAt: -1 } helps a query on which field alone?', ['author', 'createdAt', 'Both equally'], 0, 'A compound index is used from the left.'),
  ],
  'mongodb-aggregation-pipelines-and-transactions-in-node': [
    Q('Which stage keeps only matching documents, like find?', ['$match', '$group', '$project'], 0),
    Q('Why store money as whole numbers of cents?', ['Decimal fractions cannot always be stored exactly as floating-point numbers', 'Cents are shorter to type', 'MongoDB does not allow decimals'], 0),
    Q('What do MongoDB transactions need?', ['A replica set, such as MongoDB Atlas', 'A text index', 'A second database'], 0),
  ],
  'validate-requests-with-zod-and-meet-prisma-with-postgresql': [
    Q('Why validate on the server even if the front end validates?', ['Anyone can call the API without your front end', 'The server is faster', 'Browsers cannot validate'], 0),
    Q('Which status code fits well-formed data that breaks your rules?', ['422', '200', '304'], 0),
    Q('What is a Prisma migration?', ['A versioned script that changes the database structure step by step', 'A copy of the data', 'A type of query'], 0),
  ],
  'access-and-refresh-tokens-logout-and-role-based-access-control': [
    Q('Why is the access token short-lived?', ['If it leaks, the damage ends quickly', 'Short tokens are faster to sign', 'Browsers delete long tokens'], 0),
    Q('What is refresh token rotation?', ['Each use returns a new refresh token and cancels the old one', 'Changing the JWT secret daily', 'Sending the token in a cookie'], 0),
    Q('Where must a user role come from?', ['Your database, set by your server', 'The request body', 'A cookie the client can edit'], 0),
  ],
  'forgot-password-email-verification-and-otp-login-with-nodemailer': [
    Q('Why show the same message whether or not the email exists?', ['So attackers cannot discover which emails have accounts', 'It saves a database query', 'Email providers require it'], 0),
    Q('Why store only a hash of the reset token?', ['A leaked database cannot be used to reset accounts', 'Hashes are shorter', 'Nodemailer needs a hash'], 0),
    Q('What limits make a six-digit OTP safe enough?', ['Short expiry, one use and a limit on wrong tries', 'A longer font', 'Sending it twice'], 0),
  ],
  'cookies-sessions-and-sign-in-with-google-oauth': [
    Q('What does the httpOnly cookie flag do?', ['Hides the cookie from JavaScript on the page', 'Encrypts the cookie', 'Makes it last longer'], 0),
    Q('What must your server do with a Google ID token?', ['Verify its signature, audience, expiry and email_verified', 'Just decode it', 'Store it as the password'], 0),
    Q('What is an advantage of sessions over JWT?', ['Logging out is easy because you delete the server record', 'They need no storage at all', 'They work without cookies'], 0),
  ],
  'web-attacks-xss-csrf-nosql-injection-sanitisation-and-brute-force': [
    Q('What is the main defence against XSS?', ['Escape output so user text is not treated as code', 'Use longer passwords', 'Turn off cookies'], 0),
    Q('How does a double-submit CSRF token stop another site?', ['The other site can send the cookie but cannot read it to copy it into a header', 'It encrypts the request', 'It blocks all POST requests'], 0),
    Q('How can { "password": { "$ne": null } } break a login?', ['The query asks for a password that is not null, so it matches', 'It crashes MongoDB', 'It resets the password'], 0),
  ],
  'production-security-secrets-https-jwt-best-practices-helmet-and-audits': [
    Q('You committed a secret to Git by mistake. What first?', ['Change it at the provider, because Git keeps history', 'Delete the file only', 'Rename the repository'], 0),
    Q('Is a JWT encrypted?', ['No, it is signed but anyone can read it', 'Yes, always', 'Only with HS256'], 0),
    Q('What does npm audit check?', ['Installed packages for known vulnerabilities', 'Your code style', 'Your server uptime'], 0),
  ],
  'clean-architecture-in-express-repository-service-dependency-injection-and-solid': [
    Q('What does the service layer contain?', ['The business rules, with no HTTP or database details', 'Express routes', 'SQL queries'], 0),
    Q('What is dependency injection in this lesson?', ['Passing what a class needs, such as a repository, as an argument', 'Installing packages', 'A special framework'], 0),
    Q('When should you add more layers?', ['When you feel the pain they solve, such as rules scattered in handlers', 'Always, from the first route', 'Never'], 0),
  ],
  'error-handling-and-logging-in-express-winston-morgan-and-request-ids': [
    Q('What should the client see for a 500 server error?', ['A generic safe message, with the details in the log', 'The full stack trace', 'The database query'], 0),
    Q('What is a request id used for?', ['Finding every log line that belongs to one request', 'Authentication', 'Caching'], 0),
    Q('Why write logs as JSON?', ['Log tools can search and graph structured lines easily', 'JSON is shorter than text', 'Winston cannot write anything else'], 0),
  ],
  'caching-in-node-memory-cache-redis-and-cache-aside': [
    Q('What is the first step in cache-aside?', ['Look in the cache, and only on a miss load from the database', 'Write to the database', 'Delete the cache'], 0),
    Q('Why can two servers not share an in-memory cache?', ['Each process has its own memory', 'Memory caches are read only', 'Ports are different'], 0),
    Q('What should you do to a cache entry when the record is updated?', ['Delete or refresh it', 'Leave it until restart', 'Double its TTL'], 0),
  ],
  'background-jobs-in-node-queues-retries-cron-and-bullmq': [
    Q('Why use a job queue for sending 500 emails?', ['The web request can reply at once while a worker does the slow work', 'Emails are not allowed in routes', 'Queues are free'], 0),
    Q('What does idempotent mean for a job?', ['Running it twice has the same result as once', 'It never fails', 'It runs only at night'], 0),
    Q('Where does BullMQ keep its jobs?', ['In Redis', 'In the browser', 'In a text file'], 0),
  ],
  'real-time-apps-with-websockets-and-socket-io-rooms-auth-and-notifications': [
    Q('Where should a Socket.IO connection be authenticated?', ['In a middleware that verifies the JWT when it connects', 'In every message', 'Not at all'], 0),
    Q('What is a room used for here?', ['Sending to one user on all their devices', 'Storing files', 'Hashing passwords'], 0),
    Q('Why do sockets break across two servers without an adapter?', ['A socket lives on one process, so events must be shared', 'Sockets only work on port 80', 'WebSockets need HTTP/3'], 0),
  ],
  'payment-integration-basics-server-side-prices-webhooks-and-idempotency': [
    Q('Who decides the price of an order?', ['The server, from its own catalogue', 'The browser', 'The payment page URL'], 0),
    Q('When does an order become paid?', ['When a verified webhook from the provider says so', 'When the user returns to the success page', 'When the cart is full'], 0),
    Q('Why remember webhook event ids?', ['Providers can resend an event, and it must be applied once', 'To save memory', 'To sort orders'], 0),
  ],
  'scaling-node-apps-microservices-load-balancing-and-health-checks': [
    Q('What does stateless mean for a server copy?', ['No important data lives only in its own memory', 'It has no database', 'It never restarts'], 0),
    Q('What does a health check let a load balancer do?', ['Stop sending traffic to a broken copy', 'Compress responses', 'Encrypt traffic'], 0),
    Q('What should you try before splitting into microservices?', ['Measure and fix slow queries, indexes and caching', 'Rewrite in another language', 'Buy more domains'], 0),
  ],
  'node-performance-memory-leaks-and-blocking-the-event-loop': [
    Q('What is a memory leak in Node?', ['Memory you no longer need but still refer to, so it is never freed', 'Memory used by a server', 'A crashed process'], 0),
    Q('What is a common fix for a growing cache?', ['A maximum size and an expiry', 'A bigger server', 'More listeners'], 0),
    Q('Why is readFileSync in a request handler a problem?', ['It blocks every other request while it runs', 'It cannot read text files', 'It is not in Node'], 0),
  ],
  'debugging-node-apps-breakpoints-inspect-and-reading-stack-traces': [
    Q('Which part of a stack trace should you read first?', ['The error message and type, then the first line in your own file', 'The last line', 'The node_modules lines'], 0),
    Q('What does a breakpoint do?', ['Pauses the program on that line so you can inspect variables', 'Stops the server for good', 'Deletes the line'], 0),
    Q('Why must the --inspect port never be public?', ['Anyone who connects can run code in your process', 'It slows the server', 'It exposes the logs only'], 0),
  ],
  'testing-node-apis-jest-mocha-chai-supertest-and-mocking': [
    Q('What is the difference between a stub and a mock?', ['A mock also records how it was called', 'A stub is slower', 'They are the same'], 0),
    Q('Why does Supertest not need the server to listen on a port?', ['It sends the request straight into the Express app', 'It uses a hidden port', 'It does not send real requests'], 0),
    Q('Why pass the payment gateway as an argument?', ['A test can replace it with a fake', 'It is required by Jest', 'It makes charges free'], 0),
  ],
  'deploy-node-to-a-vps-nginx-reverse-proxy-pm2-dns-and-lets-encrypt': [
    Q('What does nginx do in front of Node?', ['Handles HTTPS and forwards requests to the app', 'Stores the database', 'Compiles JavaScript'], 0),
    Q('What is the difference between pm2 reload and pm2 restart?', ['Reload restarts copies one at a time to avoid downtime', 'Reload deletes the app', 'There is none'], 0),
    Q('What does a DNS A record do?', ['Points a domain name at a server IP address', 'Encrypts traffic', 'Starts PM2'], 0),
  ],
  'docker-for-node-developers-dockerfile-compose-and-small-images': [
    Q('What is the difference between an image and a container?', ['A container is a running instance of an image', 'They are the same', 'An image is a running process'], 0),
    Q('Why copy package.json before the rest of the code in a Dockerfile?', ['Docker can reuse the cached layer of installed packages', 'It is required by Node', 'It hides the code'], 0),
    Q('Where should database files live in Compose?', ['In a volume', 'Inside the container only', 'In the image'], 0),
  ],
  'ci-cd-with-github-actions-monitoring-backups-and-zero-downtime-releases': [
    Q('What does CI do?', ['Runs checks and tests automatically on every change', 'Buys a server', 'Writes the code'], 0),
    Q('Why test a backup restore?', ['An untested backup may not work when you need it', 'Restores are free', 'It speeds up the database'], 0),
    Q('What does the 3-2-1 backup idea suggest?', ['Three copies, two storage types, one in another place', 'Three servers a day', 'One copy only'], 0),
  ],
  'typescript-prisma-redis-postgresql-and-aws-the-wider-node-stack': [
    Q('Why is Zod still used with TypeScript?', ['Types exist only at compile time and do not check real requests', 'TypeScript cannot run', 'Zod replaces the compiler'], 0),
    Q('Which AWS service stores files?', ['S3', 'IAM', 'RDS'], 0),
    Q('How should you list tools on a resume?', ['Only those you used in a real project and can explain', 'Every tool you have heard of', 'Alphabetically, all of them'], 0),
  ],
  'project-1-crud-rest-api-for-users-with-validation-and-paging': [
    Q('Which status code fits a duplicate email?', ['409', '422', '204'], 0),
    Q('What is the difference between PUT and PATCH?', ['PUT replaces the whole item, PATCH changes only the fields sent', 'PUT is for reading', 'There is none'], 0),
    Q('What does the Location header on 201 hold?', ['The URL of the new item', 'The user password', 'The server name'], 0),
  ],
  'project-2-authentication-system-with-jwt-refresh-and-password-reset': [
    Q('Why does login give the same message for a wrong email and a wrong password?', ['It stops attackers learning which emails exist', 'It is shorter', 'bcrypt requires it'], 0),
    Q('What happens when a used refresh token is presented again?', ['It is refused and the user must log in again', 'It works once more', 'It is extended'], 0),
    Q('Why is bcrypt slow on purpose?', ['Every password guess costs an attacker time', 'To use more disk', 'To block the event loop'], 0),
  ],
  'project-3-blog-api-with-categories-comments-and-roles': [
    Q('Why check ownership as well as the role?', ['A role says what kind of user, ownership says whose data', 'Roles are not reliable', 'It is faster'], 0),
    Q('What does the public API return for a draft?', ['404', '200 with the draft', '403'], 0),
    Q('Who can publish a post?', ['Only an admin', 'Any author', 'Any reader'], 0),
  ],
  'project-4-e-commerce-backend-with-cart-orders-and-stock': [
    Q('Where does the checkout price come from?', ['The server’s own product data', 'The cart in the browser', 'The URL'], 0),
    Q('When is stock reduced?', ['Only after the payment works', 'When the item enters the cart', 'Before the charge'], 0),
    Q('Why is the payment provider passed into createApp?', ['A test can use a fake provider', 'Express requires it', 'To reduce prices'], 0),
  ],
  'project-5-employee-management-system-with-attendance-and-permissions': [
    Q('What is scoping in this project?', ['The same URL returns different rows depending on the role', 'Using a smaller database', 'Hiding buttons in the front end'], 0),
    Q('What does soft delete do?', ['Marks the record inactive and keeps the history', 'Removes the record forever', 'Moves it to the cloud'], 0),
    Q('Where should the attendance date come from?', ['The server clock in a fixed time zone', 'The client', 'The employee name'], 0),
  ],
  'project-6-real-time-chat-application-with-socket-io': [
    Q('How does the server know who sent a message?', ['From the verified token on the socket', 'From a field in the message', 'From the message text'], 0),
    Q('When is a user shown offline?', ['When their last socket closes', 'When any tab closes', 'After one minute'], 0),
    Q('Why load history over REST?', ['HTTP is easy to page, cache and secure like the rest of the API', 'Sockets cannot send text', 'It avoids tokens'], 0),
  ],
  'project-7-hotel-booking-system-with-availability-and-cancellations': [
    Q('When do two stays overlap?', ['Each one starts before the other ends', 'They have the same room number', 'They share the check-out day'], 0),
    Q('Can a guest arrive on another guest’s check-out day?', ['Yes, the check-out day is free', 'No, never', 'Only for suites'], 0),
    Q('What does a failed payment do to the reservation?', ['Marks it payment_failed so the room is not blocked', 'Confirms it anyway', 'Deletes the room'], 0),
  ],
  'project-8-file-upload-and-storage-api-with-quotas-and-cloud-drivers': [
    Q('Why return 404 for another user’s file?', ['A 403 would reveal that the file exists', 'It is faster', 'The file is deleted'], 0),
    Q('What does the storage quota prevent?', ['One account filling your disk or cloud bill', 'Slow downloads', 'Login failures'], 0),
    Q('What is a weakness of trusting the declared file type?', ['A client can lie about it', 'It is too strict', 'It uses more memory'], 0, 'Lesson 22 shows checking the first bytes instead.'),
  ],
  'project-9-saas-subscription-backend-with-plans-limits-and-billing-webhooks': [
    Q('What activates a paid plan?', ['A verified billing webhook', 'The user returning from checkout', 'A field in the subscribe request'], 0),
    Q('What is an entitlement check?', ['A server check that the plan allows the requested feature or amount', 'A discount code', 'A refund rule'], 0),
    Q('Why remember billing event ids?', ['A repeated event must not be applied twice', 'To sort invoices', 'To reduce prices'], 0),
  ],
  'project-10-microservices-app-with-gateway-events-and-health-checks': [
    Q('Why should services not read each other’s databases?', ['It couples them so changing one breaks the others', 'Databases cannot connect', 'It is slower'], 0),
    Q('When should you publish an event instead of calling a service?', ['When you do not need an answer', 'When you need the data now', 'Never'], 0),
    Q('What is the gateway’s role?', ['The only public door that checks the token and forwards requests', 'It stores user data', 'It sends notifications'], 0),
  ],
};
