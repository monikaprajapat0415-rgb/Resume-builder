const n = (id, label, sub, col, row, kind) => ({ id, label, sub, col, row, kind });
const A = (title, nodes, steps) => ({ title, nodes, steps });

export const b = {
  'user-registration-and-password-hashing-with-bcrypt': A('Never store the password', [
    n('form', 'Sign-up form', 'email, password', 0, 0, 'user'), n('rules', 'Checks', 'format, length', 1, 0, 'check'),
    n('hash', 'bcrypt hash', 'salt + slow', 2, 0, 'tool'), n('db', 'users', 'only the hash', 3, 0, 'store'),
  ], [
    { say: 'A person sends an email and a password.', on: ['form'] },
    { say: 'The server checks the email format and a sensible password length first.', flow: ['form>rules:body'] },
    { say: 'The password is run through bcrypt: a one-way function with a random salt, made slow on purpose.', flow: ['rules>hash:password'] },
    { say: 'Only the hash is saved. Even we cannot read the password back, and a stolen database does not give the passwords away.', flow: ['hash>db:save hash'] },
    { say: 'The reply never includes the hash. A duplicate email gives a clear conflict error.', on: ['db'] },
  ]),
  'login-with-jwt-json-web-tokens': A('Log in and get a token', [
    n('user', 'Client', 'email + password', 0, 0, 'user'), n('check', 'compare()', 'bcrypt vs hash', 1, 0, 'check'),
    n('jwt', 'Sign a JWT', 'id + expiry', 2, 0, 'tool'), n('tok', 'Token', 'sent to client', 3, 0, 'out'),
  ], [
    { say: 'The client sends the email and the password.', on: ['user'] },
    { say: 'The server finds the user and compares the password with the stored hash.', flow: ['user>check:credentials'] },
    { say: 'If the email is unknown, a dummy hash is compared anyway, so the timing does not reveal which emails exist.', on: ['check'] },
    { say: 'On success the server signs a JSON Web Token with a secret. It holds the user id and an expiry time.', flow: ['check>jwt:valid'] },
    { say: 'The token goes back to the client, which sends it with later requests. The same message is used for every login failure.', flow: ['jwt>tok:token'] },
  ]),
  'protect-routes-and-ownership-checks': A('Only my data', [
    n('req', 'Request', 'Bearer token', 0, 0, 'user'), n('mw', 'protect', 'verify the token', 1, 0, 'check'),
    n('ctrl', 'Controller', 'uses req.user', 2, 0, 'app'), n('q', 'Query', 'always { user }', 3, 0, 'store'),
  ], [
    { say: 'A request to a protected route carries a token in the Authorization header.', on: ['req'] },
    { say: 'The protect middleware verifies the token and loads the user. No token or a bad one gives 401.', flow: ['req>mw:header'] },
    { say: 'It attaches the user to req.user and lets the request continue.', flow: ['mw>ctrl:next()'] },
    { say: 'Every database query includes the owner: find by id AND user. Never take the user id from the body.', flow: ['ctrl>q:with owner'] },
    { say: 'Another person\'s job gives 404, as if it did not exist. Nothing is leaked.', on: ['q'] },
  ]),
  'express-security-basics-helmet-rate-limit-nosql-injection': A('Layers of defence', [
    n('in', 'Request', 'from anyone', 0, 0, 'user'), n('rate', 'Rate limit', 'slows guessing', 1, 0, 'check'),
    n('clean', 'Input checks', 'no operators', 2, 0, 'tool'), n('safe', 'Safe reply', 'helmet headers', 3, 0, 'out'),
  ], [
    { say: 'Security is several small layers, not one big switch.', on: ['in'] },
    { say: 'A rate limiter on the login routes stops someone trying thousands of passwords.', flow: ['in>rate:count'] },
    { say: 'NoSQL injection sends objects like {"$gt": ""} instead of strings. We reject keys that start with $.', flow: ['rate>clean:body'] },
    { say: 'helmet adds security headers to every reply. TRUST_PROXY makes the limiter see the real visitor address.', flow: ['clean>safe:headers'] },
    { say: 'At start-up the app refuses to run in production with a weak or missing JWT secret.', on: ['safe'] },
  ]),
  'automated-api-tests-with-node-test-runner': A('A test run', [
    n('test', 'node --test', 'runs test files', 0, 0, 'tool'), n('app', 'App', 'created in memory', 1, 0, 'app'),
    n('db', 'Test database', 'emptied each run', 2, 0, 'store'), n('rep', 'Report', 'pass or fail', 2, 1, 'check'),
  ], [
    { say: 'Tests are code that checks your code. node --test needs no extra package.', on: ['test'] },
    { say: 'The tests import the app without starting a real server, and send requests to it.', flow: ['test>app:requests'] },
    { say: 'A separate test database is cleared before the tests, so each run starts from the same state.', flow: ['app>db:read, write'] },
    { say: 'Each test sends a request and asserts the status and the body, including the failure cases.', flow: ['db>app:data'] },
    { say: 'The report shows what passed. Run it before every deploy.', flow: ['app>rep:results'] },
  ]),
  'react-and-vite-setup-components-and-jsx': A('From JSX to the screen', [
    n('jsx', 'JSX', 'looks like HTML', 0, 0, 'app'), n('vite', 'Vite', 'dev server and build', 1, 0, 'tool'),
    n('comp', 'Components', 'small, reusable', 2, 0, 'check'), n('dom', 'Browser', 'shows the page', 3, 0, 'out'),
  ], [
    { say: 'In React you write the screen as components that return JSX, which looks like HTML inside JavaScript.', on: ['jsx'] },
    { say: 'Vite compiles the JSX and serves the app with instant reloads while you work.', flow: ['jsx>vite:compile'] },
    { say: 'A component is a function. Components can contain other components, like Header and JobCard.', flow: ['vite>comp:import'] },
    { say: 'React turns the components into elements in the page.', flow: ['comp>dom:render'] },
    { say: 'Custom components start with a capital letter, and JSX needs one parent element.', on: ['comp'] },
  ]),
  'react-props-state-and-events': A('Props down, events up', [
    n('parent', 'Parent', 'owns the state', 0, 0, 'app'), n('child', 'JobCard', 'receives props', 1, 0, 'check'),
    n('click', 'Click', 'user event', 2, 0, 'user'), n('state', 'New state', 'screen updates', 1, 1, 'out'),
  ], [
    { say: 'State is data that can change over time. The parent component keeps it with useState.', on: ['parent'] },
    { say: 'The parent passes data to a child through props. Props are read-only.', flow: ['parent>child:props'] },
    { say: 'The user clicks a button in the child, and an event handler runs.', flow: ['click>child:onClick'] },
    { say: 'The handler calls a function from the parent, which sets new state. We make a new array and never change the old one.', flow: ['child>parent:callback'] },
    { say: 'React sees the new state and draws the screen again.', flow: ['parent>state:re-render'] },
  ]),
  'react-lists-forms-and-controlled-inputs': A('A controlled input', [
    n('type', 'Typing', 'onChange', 0, 0, 'user'), n('state', 'State', 'the one truth', 1, 0, 'app'),
    n('input', 'Input value', 'shows the state', 2, 0, 'check'), n('submit', 'Submit', 'validate, send', 3, 0, 'out'),
  ], [
    { say: 'In a controlled input, React state is the single source of truth for what is in the field.', on: ['state'] },
    { say: 'Each key press fires onChange, which updates the state.', flow: ['type>state:new text'] },
    { say: 'The input shows the state through its value prop, so they always agree.', flow: ['state>input:value'] },
    { say: 'On submit we validate the state first and show clear messages next to the fields.', flow: ['input>submit:onSubmit'] },
    { say: 'Every input has a label tied to it, which helps screen readers and makes the click area larger. Lists use a stable key, the id.', on: ['input'] },
  ]),
  'react-useeffect-and-fetching-data-from-your-api': A('Fetch with loading and cleanup', [
    n('comp', 'Component', 'renders first', 0, 0, 'app'), n('eff', 'useEffect', 'runs after render', 1, 0, 'tool'),
    n('api', 'Your API', 'GET /api/jobs', 2, 0, 'store'), n('ui', 'Screen', 'loading, error, data', 3, 0, 'out'),
  ], [
    { say: 'A component first renders with no data, and shows a loading state.', on: ['comp', 'ui'] },
    { say: 'After rendering, useEffect starts the fetch. The dependency list says when to run it again.', flow: ['comp>eff:after render'] },
    { say: 'The request goes to the API, and the answer arrives later.', flow: ['eff>api:fetch'] },
    { say: 'The result is saved in state, and the screen shows the data, or a clear error with a retry.', flow: ['api>ui:data or error'] },
    { say: 'The cleanup function cancels the request if the component goes away, so old answers cannot overwrite new ones.', on: ['eff'] },
  ]),
  'react-router-pages-links-and-params': A('Pages without reloads', [
    n('url', 'URL', '/jobs/42', 0, 0, 'user'), n('router', 'Router', 'matches a route', 1, 0, 'tool'),
    n('layout', 'Layout', 'header + Outlet', 2, 0, 'check'), n('page', 'JobDetailPage', 'useParams: 42', 3, 0, 'app'),
  ], [
    { say: 'The address in the browser decides which page to show.', on: ['url'] },
    { say: 'React Router compares the URL with your list of routes.', flow: ['url>router:path'] },
    { say: 'The shared Layout draws the header once, and an Outlet shows the matching page inside it.', flow: ['router>layout:render'] },
    { say: 'The page reads the :id part of the URL with useParams, then loads that job.', flow: ['layout>page:Outlet'] },
    { say: 'Link and NavLink change the URL without a full page reload. An unknown path shows a not found page.', on: ['router'] },
  ]),
  'react-context-and-custom-hooks': A('Share state without props', [
    n('prov', 'AuthProvider', 'holds user, token', 0, 0, 'app'), n('ctx', 'Context', 'available below', 1, 0, 'tool'),
    n('use', 'useAuth()', 'a custom hook', 2, 0, 'check'), n('cmp', 'Any component', 'reads the user', 3, 0, 'out'),
  ], [
    { say: 'Some data is needed in many places, such as the signed-in user. Passing props through every level is tedious.', on: ['prov'] },
    { say: 'A context provider keeps the data and makes it available to everything inside it.', flow: ['prov>ctx:value'] },
    { say: 'A custom hook, useAuth, hides the context behind one simple call.', flow: ['ctx>use:useContext'] },
    { say: 'Any component calls useAuth and gets the user, with no props needed.', flow: ['use>cmp:user, login'] },
    { say: 'Hooks that fetch data, like useJobs, put the loading, error and reload logic in one reusable place.', on: ['use'] },
  ]),
  'react-crud-ui-create-edit-delete-with-the-api': A('Change data, then the screen', [
    n('ui', 'Form or button', 'user action', 0, 0, 'user'), n('api', 'api() helper', 'adds the token', 1, 0, 'tool'),
    n('srv', 'Server', 'POST, PATCH, DELETE', 2, 0, 'store'), n('state', 'State', 'list updated', 3, 0, 'out'),
  ], [
    { say: 'The person fills in a form, or presses Edit or Delete.', on: ['ui'] },
    { say: 'The click calls our api helper, which sends the request with the token and the JSON.', flow: ['ui>api:call'] },
    { say: 'The server validates and changes the data, then replies with the result.', flow: ['api>srv:request'] },
    { say: 'Only when the server confirms do we update the list in state, using new arrays.', flow: ['srv>state:response'] },
    { say: 'The button shows a saving state while it waits. Delete asks for confirmation, and failures show a message.', on: ['ui', 'state'] },
  ]),
  'sign-in-and-register-pages-with-protected-routes': A('A protected route', [
    n('visit', 'Visit /jobs', 'not signed in', 0, 0, 'user'), n('guard', 'ProtectedRoute', 'checks the user', 1, 0, 'check'),
    n('login', 'Login page', 'remembers where', 2, 0, 'app'), n('page', 'Jobs page', 'after sign-in', 3, 0, 'out'),
  ], [
    { say: 'A visitor who is not signed in opens a page that needs an account.', on: ['visit'] },
    { say: 'The ProtectedRoute wrapper looks at the auth context.', flow: ['visit>guard:no user'] },
    { say: 'No user: it redirects to the login page and remembers the address they wanted.', flow: ['guard>login:redirect'] },
    { say: 'After a successful login the token is saved, and the visitor goes back to the page they wanted.', flow: ['login>page:navigate'] },
    { say: 'If the server later replies 401, the app signs the person out and shows the login page again.', on: ['guard'] },
  ]),
  'react-dashboard-stats-filters-and-pagination-in-the-url': A('The URL is the state', [
    n('filter', 'Filters', 'search, status', 0, 0, 'user'), n('url', 'URL params', '?status=offer&page=2', 1, 0, 'check'),
    n('hook', 'useJobs', 'fetches on change', 2, 0, 'tool'), n('view', 'List + stats', 'updated', 3, 0, 'out'),
  ], [
    { say: 'The person types a search word or picks a status.', on: ['filter'] },
    { say: 'Instead of private state, the choice goes into the URL with useSearchParams.', flow: ['filter>url:set param'] },
    { say: 'The data hook watches the URL and fetches again whenever it changes.', flow: ['url>hook:params'] },
    { say: 'The list, the stats and the pagination update together.', flow: ['hook>view:data'] },
    { say: 'Because the URL holds the state, the back button, reload and a shared link all work. Typing is debounced.', on: ['url'] },
  ]),
  'responsive-styling-and-accessibility-in-react': A('One layout, every screen', [
    n('phone', 'Phone', 'base styles', 0, 0, 'user'), n('tab', 'Tablet', 'min-width media query', 1, 0, 'app'),
    n('desk', 'Desktop', 'more columns', 2, 0, 'tool'), n('a11y', 'Accessible', 'focus, contrast', 3, 0, 'check'),
  ], [
    { say: 'Mobile first: write the styles for a small screen first, with one column.', on: ['phone'] },
    { say: 'Add min-width media queries to use extra space on bigger screens.', flow: ['phone>tab:wider'] },
    { say: 'Grid and flexible sizes let cards fill the space without fixed widths.', flow: ['tab>desk:wider'] },
    { say: 'Accessibility is part of the same work: visible focus rings, labels, enough colour contrast and keyboard use.', flow: ['desk>a11y:also'] },
    { say: 'prefers-color-scheme adds a dark mode that follows the visitor\'s device. Test with the keyboard only.', on: ['a11y'] },
  ]),
  'react-performance-memo-debounce-and-code-splitting': A('Do less work', [
    n('type', 'Fast typing', 'many events', 0, 0, 'user'), n('deb', 'Debounce', 'waits 300 ms', 1, 0, 'tool'),
    n('memo', 'React.memo', 'skips same props', 2, 0, 'check'), n('lazy', 'lazy routes', 'load on demand', 3, 0, 'out'),
  ], [
    { say: 'Performance problems come from doing too much work, not from React being slow.', on: ['type'] },
    { say: 'A debounce hook waits until typing pauses, so one request is sent instead of one per key.', flow: ['type>deb:each key'] },
    { say: 'React.memo skips redrawing a card when its props did not change.', flow: ['deb>memo:fewer renders'] },
    { say: 'Code splitting with lazy loads a page only when it is visited, so the first load is smaller.', flow: ['memo>lazy:split'] },
    { say: 'Measure first with the browser tools and the build output, and only then optimise.', on: ['lazy'] },
  ]),
  'file-upload-with-multer-and-react': A('A safe upload', [
    n('form', 'FormData', 'file + size check', 0, 0, 'user'), n('multer', 'multer', 'limits, type filter', 1, 0, 'tool'),
    n('sig', 'Signature check', 'real PDF or docx?', 2, 0, 'check'), n('disk', 'uploads/', 'random file name', 3, 0, 'store'),
  ], [
    { say: 'React sends the chosen file in a FormData body. It already checked the size, as a courtesy.', on: ['form'] },
    { say: 'multer reads the upload, with a size limit, one file only and an extension filter.', flow: ['form>multer:multipart'] },
    { say: 'The server reads the first bytes of the file. A text file renamed to .pdf is rejected and deleted.', flow: ['multer>sig:first bytes'] },
    { say: 'A valid file is stored under a random name. Only the details go in MongoDB.', flow: ['sig>disk:save'] },
    { say: 'Downloads go through a route that checks ownership, and they are sent as attachments.', on: ['disk'] },
  ]),
  'production-ready-express-logging-graceful-shutdown-compression-indexes': A('Ready for real visitors', [
    n('log', 'JSON logs', 'no secrets', 0, 0, 'check'), n('health', '/api/health', '200 or 503', 1, 0, 'tool'),
    n('sig', 'SIGTERM', 'deploy stops app', 2, 0, 'user'), n('down', 'Clean shutdown', 'finish, close, exit', 3, 0, 'out'),
  ], [
    { say: 'In production each log line is a JSON object with the path, the status and the time. Passwords and tokens never appear.', on: ['log'] },
    { say: 'The health check checks the database. 503 means do not send traffic here.', flow: ['log>health:status'] },
    { say: 'When you deploy, the process manager sends SIGTERM to the old process.', flow: ['health>sig:later'] },
    { say: 'The server stops taking new connections, lets current requests finish, closes the database and exits.', flow: ['sig>down:server.close'] },
    { say: 'Indexes are built on purpose after a deploy, and text responses are compressed.', on: ['down'] },
  ]),
  'build-and-serve-the-react-app-from-express': A('One server for everything', [
    n('build', 'vite build', 'client/dist', 0, 0, 'tool'), n('static', 'Static files', 'assets cached 1 year', 1, 0, 'check'),
    n('api', '/api routes', 'JSON, 404 as JSON', 2, 0, 'app'), n('spa', 'index.html', 'for other GET paths', 3, 0, 'out'),
  ], [
    { say: 'The build turns your React source into a few hashed static files in client/dist.', on: ['build'] },
    { say: 'Express serves them. Hashed files in /assets are cached for a year, and index.html is never cached.', flow: ['build>static:serve'] },
    { say: 'Requests that start with /api go to the API, and an unknown API path is a JSON 404.', flow: ['static>api:/api'] },
    { say: 'Any other GET gets index.html, so React Router can draw deep links after a reload.', flow: ['api>spa:everything else'] },
    { say: 'One process and one origin: no CORS needed, and only one thing to deploy.', on: ['static', 'api', 'spa'] },
  ]),
  'deploy-a-mern-app-to-a-vps-with-pm2-nginx-and-https': A('The production setup', [
    n('user', 'Visitor', 'https://your-domain', 0, 0, 'user'), n('nginx', 'nginx', 'HTTPS, proxy', 1, 0, 'tool'),
    n('pm2', 'pm2 + Node', 'port 5000', 2, 0, 'app'), n('atlas', 'MongoDB Atlas', 'the database', 3, 0, 'store'),
  ], [
    { say: 'A visitor opens your domain. DNS points the name to your server.', on: ['user'] },
    { say: 'nginx receives the request on port 443 and handles the HTTPS certificate from Let\'s Encrypt.', flow: ['user>nginx:HTTPS'] },
    { say: 'nginx proxies the request to your Node app and passes the visitor address in headers.', flow: ['nginx>pm2:proxy'] },
    { say: 'pm2 keeps the app running, restarts it after a crash and starts it again after a reboot.', on: ['pm2'] },
    { say: 'The app reads and writes data in Atlas, and the deploy script ends by checking /api/health.', flow: ['pm2>atlas:queries'] },
  ]),
  'mern-capstone-checklist-and-next-steps': A('Before you ship', [
    n('check', 'Checklist', 'security, quality', 0, 0, 'check'), n('fix', 'Fix the gaps', 'secrets, tests', 1, 0, 'tool'),
    n('live', 'Live and shown', 'README, screenshots', 2, 0, 'out'), n('next', 'Next feature', 'with a test', 3, 0, 'app'),
  ], [
    { say: 'Go through the checklist: secrets, ownership checks, validation, tests, backups and monitoring.', on: ['check'] },
    { say: 'Fix every gap you find. Check the Git history too, because a committed secret stays there.', flow: ['check>fix:gaps'] },
    { say: 'Deploy, then write a README with screenshots, so others see what you built.', flow: ['fix>live:ship'] },
    { say: 'Pick one idea from the next steps list and build it with a test.', flow: ['live>next:improve'] },
    { say: 'Repeat. Small, finished and deployed projects teach more than unfinished big ones.', on: ['live', 'next'] },
  ]),
};
