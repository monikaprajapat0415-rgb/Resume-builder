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
};
