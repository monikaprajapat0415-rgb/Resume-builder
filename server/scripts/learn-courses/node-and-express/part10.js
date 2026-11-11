import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';
import { RAN, PARTLY, SETUP, run } from './kit2.js';

const S = 'Testing, Debugging and Deployment';
const NOTRUN = (what) => N(`The ${what} in this lesson were written to follow the current documentation, but they were not run on a real server when the lesson was written, because that needs a machine, a domain or an account. Run them first on a test server, read each line, and check the current documentation of every tool before you use them for something that matters.`);

export const lessons = [
  // ---------------------------------------------------------------- 40
  les(S, 'debugging-node-apps-breakpoints-inspect-and-reading-stack-traces', 'Debugging Node Apps: Breakpoints, --inspect and Reading Stack Traces', 'Debugging Node.js: Breakpoints, Traces',
    'Debug Node.js properly: read stack traces, pause with breakpoints in VS Code and Chrome DevTools using --inspect, and find the bug in a practice file.', [
    P("Beginners debug by adding `console.log` everywhere, running again, and reading a wall of output. It works for small problems. For anything harder, the faster tool is a **debugger**: it pauses your program at a line you choose and lets you look at every variable at that moment. Learning it early repays you for the rest of your career. This lesson shows how, with a small file that has a real, typical bug in it."),
    H("Read the error first"),
    P("When Node crashes it prints a **stack trace**: the error message, then the chain of function calls that led to it, newest first. Read it in this order. First, the message and the error type, for example `TypeError: Cannot read properties of undefined (reading 'name')`. It tells you what went wrong. Second, the first line of the trace that points to *your* file, not to `node_modules` or `node:internal`. It tells you where. Then look at that line and ask what could be `undefined` or the wrong type there. Half of all bugs end here."),
    L("`ReferenceError`: you used a name that does not exist, often a typo or a missing import.", "`TypeError`: you used a value in a way it does not allow, often because it is `undefined` or `null`.", "`ERR_MODULE_NOT_FOUND` or `Cannot find module`: a wrong path or a missing package.", "`EADDRINUSE`: another process already uses that port.", "`UnhandledPromiseRejection`: a promise failed and nothing handled it."),
    H("A bug to practise on"),
    P("The function below should return the average of the order amounts. The result is wrong, and no error appears, which is exactly the kind of bug where a debugger helps."),
    C('js', code('d41-bug.js')),
    run('node d41-bug.js'),
    C('text', '3341683.3333333335'),
    P("An average of three orders worth about a hundred each should be near 133, not more than three million. Do not guess. Use the debugger."),
    H("Debugging in VS Code"),
    O("Open the folder in VS Code and open the file.", "Click in the left margin next to the line `total += order.amount;`. A red dot, a **breakpoint**, appears.", "Open the *Run and Debug* panel and choose *Run and Debug*, then *Node.js*. The program runs and **pauses** on your line.", "Look at the **Variables** panel. `order` is `{ amount: 100 }` and `total` is `0`. Press **Continue** twice more. On the second round, `order.amount` is the **text** `'250'`, and `total` becomes the text `'100250'`.", "Now you see it: adding a number and a string in JavaScript joins them as text. Fix it by converting with `Number(order.amount)`, or better, by validating the data when it enters, as in lesson 26."),
    P("The useful controls are: **Step over**, run this line and stop at the next; **Step into**, go inside the function that this line calls; **Step out**, finish the current function; and **Continue**, run until the next breakpoint. The **Watch** panel lets you type an expression such as `typeof order.amount` and see it update. A **conditional breakpoint**, set by right-clicking the red dot, pauses only when a condition is true, for example `order.amount === '250'`. That is the tool for the bug that appears only on record 8,000."),
    H("Debugging with --inspect"),
    P("Node has a debugger built in. Run `node --inspect-brk d41-bug.js`; `-brk` pauses at the first line. Then open `chrome://inspect` in Chrome, click *inspect* below your process, and the same stepping tools open in Chrome DevTools. This also works for a server that runs on another machine, when you forward the port through an SSH tunnel. Never open the debug port to the internet. Anyone who connects can run any code on your server."),
    H("Habits that save hours"),
    L("Make the bug **reproducible** before anything else. A bug that you can trigger on demand is half solved.", "Change **one** thing at a time, and test after each change.", "Shrink the problem: remove code until the smallest example still fails.", "Read the error message slowly and completely. Most of the answer is in it.", "Write a test for the bug before you fix it, so that it can never return unnoticed.", "Explain the problem aloud to someone, or to a rubber duck. This habit is famous because it works."),
    RAN,
    ...task("Fix the bug with `Number(order.amount)` and also add a check that rejects an amount that is not a number.", "Put a conditional breakpoint that stops only when `typeof order.amount === 'string'`.", "Start a small Express server with `node --inspect` and attach Chrome DevTools to it."),
    ...check("You found the string `'250'` with a breakpoint and not by guessing.", "You can say what step over and step into do.", "You know why the debug port must never be public."),
  ], A('From wrong answer to cause', [
    n('sym', 'Symptom', 'wrong number', 0, 0, 'user'), n('bp', 'Breakpoint', 'pause on the line', 1, 0, 'tool'),
    n('look', 'Inspect values', 'total, order.amount', 2, 0, 'data'), n('fix', 'Fix + test', 'so it stays fixed', 3, 0, 'check'),
  ], [
    { say: 'The result is wrong but nothing crashed, so there is no stack trace to read.', on: ['sym'] },
    { say: 'Set a breakpoint on the suspicious line and run in the debugger.', flow: ['sym>bp:pause'] },
    { say: 'Look at the real values. One amount is the text 250, so adding joins text instead of adding numbers.', flow: ['bp>look:variables'] },
    { say: 'Fix the cause, validate the input, and write a test so the bug cannot return.', flow: ['look>fix:change one thing'] },
  ]), [
    faq('Is console.log wrong?', 'No, it is quick and useful. A debugger is better when you need to see many values at one moment, or step through unknown code.'),
    faq('What is a breakpoint?', 'A marker on a line where the program pauses so that you can look at its variables and step forward.'),
    faq('Why is it dangerous to expose the inspect port?', 'Anyone who can connect to it can run code inside your process. Keep it on localhost and use an SSH tunnel.'),
  ]),

  // ---------------------------------------------------------------- 41
  les(S, 'testing-node-apis-jest-mocha-chai-supertest-and-mocking', 'Testing Node APIs: Jest, Mocha, Chai, Supertest and Mocking', 'Testing Node: Jest, Mocha, Supertest',
    'Write automated Node.js tests: unit tests with Jest, Mocha and Chai, API tests with Supertest, and mocks and stubs that replace payment and weather APIs.', [
    P("You have seen tests all through this course. This lesson gathers the ideas and shows the three tools that employers ask about: **Jest**, **Mocha with Chai**, and **Supertest**. Their names differ, but the structure is the same: set up some data, run the code, and check the result. A test is a small program that fails loudly when your code stops doing what you meant, so that you find out in a second on your laptop, not a week later from a customer."),
    H("What to test"),
    L("**Unit tests** check one small function or class with no network and no database. They are fast, so you can have thousands.", "**Integration tests** check several parts together, such as a route, the service and a test database.", "**API tests** send real HTTP requests to your app and check the status and the body. Supertest does this without opening a port.", "A good balance is many unit tests, a fair number of API tests, and a few end-to-end tests of the most important journeys, such as sign up and checkout."),
    H("The code under test"),
    P("The cart module below adds up prices in cents and charges a payment gateway. The gateway is a **dependency**, a thing the code needs from outside. In the test we do not want to charge a real card, so we pass a replacement."),
    C('js', code('t42-cart.cjs')),
    H("Mocks and stubs"),
    P("A **stub** is a fake that returns a fixed answer, such as a gateway that always says `ok: false`. A **mock** is a fake that also **records how it was used**, so you can ask afterwards: was `charge` called once, and with the amount 1000? The tools of each library create them for you. They work only because the code receives the gateway as an argument, which is why dependency injection in lesson 32 makes testing easy."),
    H("Jest"),
    P("**Jest** is the most widely used test runner. It includes the test runner, the `expect` assertions and mocking, so one package does everything. A test is `test('name', fn)`, tests are grouped with `describe`, and `jest.fn()` creates a mock."),
    SETUP('', ['Run `npm install -D jest`, save the module as `t42-cart.cjs` and the tests next to it, and run `npx jest`.']),
    C('js', code('t42-cart.jest.test.cjs')),
    C('text', `Tests:       4 passed, 4 total`),
    H("Mocha and Chai"),
    P("**Mocha** is a runner that does only that job, and it pairs with an assertion library such as **Chai**, which reads like English: `expect(result.paid).to.equal(false)`. For stubs and spies you add a library such as Sinon, or write a small stub by hand, as the example does. Many older codebases use Mocha, so you will meet it often."),
    SETUP('', ['Run `npm install -D mocha chai`, save the file with the extension `.mjs`, and run `npx mocha t42-cart.mocha.test.mjs`.']),
    C('js', code('t42-cart.mocha.test.mjs')),
    C('text', `3 passing`),
    H("Supertest and the built-in runner"),
    P("**Supertest** sends requests straight into an Express app. Node 20 and later also has a **built-in test runner**, `node:test`, with `mock.fn()`, so you can write tests with no extra packages except Supertest. The test below creates an app that depends on a weather service, replaces the service with a mock that says it is 38 degrees, and checks the advice. It then changes the mock to 22 degrees and checks again."),
    C('js', code('t42-api.test.js')),
    P("Run it with `node --test`. It passes. Notice that the test never calls the real weather service, so it is fast and does not break when the internet does."),
    H("Writing tests that help"),
    L("Test **behaviour**, not implementation details. A test that breaks when you rename a variable is a burden.", "Name tests as sentences: `rejects an empty cart and never calls the gateway`.", "Cover the **unhappy paths**: empty input, wrong types, missing permissions, and failures of the thing you depend on.", "Keep tests independent. One test must not need another to run first.", "Run them on every push, as lesson 44 shows. A test that is never run protects nobody."),
    N("Jest and Mocha are different runners. If you run all three styles with the plain `node --test` command, the Jest and Mocha files will fail, because their special functions such as `describe` and `jest.fn` belong to their own runners. Run each file with its own tool. The Jest file ran with 4 tests passing, the Mocha file with 3, and the Supertest file with the built-in runner."),
    RAN,
    ...task("Add a test that a gateway failure, a thrown error, makes `checkout` reject.", "Write the same cart test in the built-in `node:test` style.", "Check coverage with `npx jest --coverage` and add a test for a line that is not covered."),
    ...check("You can explain the difference between a stub and a mock.", "A test never calls a real payment or weather service.", "You can say why the gateway is a parameter."),
  ], A('Replace what you do not own', [
    n('t', 'Test', 'arrange, act, assert', 0, 0, 'user'), n('c', 'Code under test', 'cart + checkout', 1, 0, 'app'),
    n('m', 'Mock gateway', 'fake, records calls', 2, 0, 'tool'), n('as', 'Assertions', 'result and calls', 3, 0, 'check'),
  ], [
    { say: 'A test arranges data, runs the code and checks the result.', on: ['t'] },
    { say: 'The code receives its dependencies as arguments, so a test can pass fakes.', flow: ['t>c:call'] },
    { say: 'The mock gateway returns a fixed answer and remembers how it was called.', flow: ['c>m:charge(1000)'] },
    { say: 'The test checks both the result and that the gateway was used correctly.', flow: ['m>as:was it called once?'] },
  ]), [
    faq('Jest or Mocha?', 'Both are common. Jest is all-in-one and popular for new projects. Mocha with Chai is in many older codebases. The built-in node:test runner needs no packages.'),
    faq('What is the difference between a mock and a stub?', 'A stub returns fixed answers. A mock also records how it was called so a test can check that.'),
    faq('Does Supertest need the server to listen on a port?', 'No. You pass the Express app and it sends the request internally, which is faster and avoids port clashes.'),
  ]),

  // ---------------------------------------------------------------- 42
  les(S, 'deploy-node-to-a-vps-nginx-reverse-proxy-pm2-dns-and-lets-encrypt', 'Deploy Node to a VPS: nginx Reverse Proxy, PM2, DNS and Let\'s Encrypt', 'Deploy Node on a VPS: nginx, PM2 and HTTPS',
    'Put a Node.js app on the internet: rent a VPS, run it with PM2, put nginx in front as a reverse proxy, point a domain with DNS and add a free HTTPS certificate.', [
    P("An app that runs only on your laptop helps nobody. This lesson walks the classic route to production: a small rented Linux server, called a **VPS** (virtual private server), running your app behind nginx with HTTPS on your own domain. It is not the only way, and managed platforms are easier, but this route teaches how the internet actually fits together, and employers like people who have done it once."),
    H("The picture"),
    P("A visitor types your domain. **DNS** turns the name into the IP address of your server. The browser connects to port 443 where **nginx** listens. nginx handles HTTPS and passes the request on to your Node app, which listens only on `127.0.0.1:3000`, a port that the outside world cannot reach. **PM2** keeps the Node app running, restarts it if it crashes and starts it after a reboot. This layout is called a **reverse proxy**, and it is standard."),
    H("Step by step"),
    O("**Rent a server.** Pick a small Ubuntu LTS VPS from any provider. Add your SSH key during creation, because passwords are weak.", "**Log in and update.** `ssh user@SERVER_IP`, then `sudo apt update && sudo apt upgrade`. Create a normal user for the app, and do not run it as root.", "**Install Node.** Use the NodeSource instructions or a version manager such as nvm, and install a current LTS version of Node.", "**Firewall.** Allow only SSH, HTTP and HTTPS, for example with `ufw allow OpenSSH`, `ufw allow 'Nginx Full'` and `ufw enable`. Do not open port 3000.", "**Get the code.** `git clone` your repository into `/var/www/app`, run `npm ci --omit=dev`, and create the `.env` file on the server with the production secrets.", "**Run it with PM2.** Install it with `npm i -g pm2`, start with the config below, then run `pm2 save` and `pm2 startup` and follow what it prints, so the app starts after a reboot.", "**Set up nginx.** Install nginx and use the configuration below as a site file.", "**Point DNS.** In your domain provider's panel, add an **A record** for `api` (or `@`) that points to the server IP. It can take from a few minutes to a few hours to spread.", "**Add HTTPS.** Install Certbot and run `sudo certbot --nginx -d api.example.com`. It gets a free certificate from **Let's Encrypt**, edits the nginx file and sets automatic renewal."),
    H("PM2: keep it alive"),
    C('js', code('dep43-ecosystem.config.cjs')),
    P("`instances: 'max'` with `exec_mode: 'cluster'` starts one copy per CPU core, as lesson 18 described. `max_memory_restart` restarts a copy that grows too big, which is a safety net for a leak, not a cure. `pm2 reload` restarts the copies one at a time, so users see **no downtime**, while `pm2 restart` stops them all briefly. Useful commands are `pm2 status`, `pm2 logs`, and `pm2 monit`."),
    H("nginx: the reverse proxy"),
    C('nginx', code('dep43-nginx.conf')),
    P("The `upstream` block lists your Node copies. `proxy_pass` forwards requests to them. The `proxy_set_header` lines pass the real client address and the original protocol, and this is why the app sets `trust proxy` in lesson 19. The `Upgrade` and `Connection` lines allow WebSockets. `client_max_body_size` must match the upload limit in your app, or nginx will refuse large uploads with 413 before your code sees them."),
    H("Production checklist"),
    L("`NODE_ENV=production`, real secrets in the environment, and a strong `JWT_SECRET`.", "The database allows connections only from your server, not from the whole internet. On MongoDB Atlas, add the server IP to the access list.", "HTTPS only, with a redirect from port 80. Certbot can do it.", "Logs go somewhere you can read, with rotation, and `pm2 logs` is a start.", "Backups run and a restore has been tested, as lesson 44 explains.", "A `/health` route that you can use for monitoring."),
    NOTRUN('server commands, the PM2 configuration and the nginx configuration'),
    ...task("Rent the cheapest server you can, or use a free trial, and follow the steps with a spare domain or a subdomain.", "Check the certificate renewal with `sudo certbot renew --dry-run`.", "Open `/health` from your phone and then run `pm2 reload` while refreshing the page."),
    ...check("The site opens over HTTPS and port 3000 is not reachable from outside.", "The app survives a server reboot.", "You can draw the path from the browser to your Node app."),
  ], A('From browser to Node', [
    n('dns', 'DNS', 'name to IP', 0, 0, 'cloud'), n('ng', 'nginx', 'HTTPS + proxy', 1, 0, 'tool'),
    n('pm', 'PM2 copies', 'localhost:3000', 2, 0, 'app'), n('db', 'Database', 'Atlas or local', 3, 0, 'store'),
  ], [
    { say: 'The browser asks DNS which IP address your domain points to.', on: ['dns'] },
    { say: 'It connects to nginx on port 443. nginx ends the HTTPS and forwards the request.', flow: ['dns>ng:A record'] },
    { say: 'PM2 keeps several copies of your app running on a private port, and restarts them if they crash.', flow: ['ng>pm:proxy_pass'] },
    { say: 'The app talks to the database, which accepts connections only from this server.', flow: ['pm>db:private'] },
  ]), [
    faq('Why put nginx in front of Node?', 'It handles HTTPS, compression, static files and buffering very well, and it lets you run several copies of the app behind one address.'),
    faq('Is Let\'s Encrypt really free?', 'Yes, the certificates are free. They last 90 days and Certbot renews them automatically.'),
    faq('What is the difference between pm2 restart and pm2 reload?', 'Restart stops all copies and starts them again. Reload restarts them one at a time, so the app stays available.'),
  ]),

  // ---------------------------------------------------------------- 43
  les(S, 'docker-for-node-developers-dockerfile-compose-and-small-images', 'Docker for Node Developers: Dockerfile, Compose and Small Images', 'Docker for Node: Dockerfile and Compose',
    'Package a Node.js app in a Docker image with a multi-stage Dockerfile, run it with MongoDB and Redis using Docker Compose, and follow image safety rules.', [
    P("\"It works on my machine\" is a classic problem. The server has a different Node version, a missing package or a different setting. **Docker** removes the problem by packaging your app together with everything it needs, into an **image**. A **container** is a running copy of an image. The same image runs the same way on your laptop, on a colleague's laptop and on a server, which is why almost every company uses containers in some form."),
    H("Words to know"),
    L("**Image:** a read-only package: an operating system layer, Node, your code and its dependencies.", "**Container:** a running instance of an image. You can start many from one image.", "**Dockerfile:** a text file with the recipe to build an image.", "**Registry:** a place that stores images, such as Docker Hub or the registry of your cloud.", "**Volume:** storage that outlives a container, used for database files.", "**Compose:** a tool that starts several containers together from one file."),
    H("A good Dockerfile"),
    C('docker', code('dep44-Dockerfile')),
    P("This file uses a **multi-stage build**. The first stage installs the production dependencies. The second stage starts again from a clean small image and copies in only the result, so build tools do not end up in the final image. Several details matter. `node:22-alpine` is a small base image. `npm ci --omit=dev` installs exactly what the lock file says and leaves out the dev tools. `COPY package*.json` comes before `COPY . .`, so Docker can **reuse the cached layer** of installed packages when only your code changed, which makes rebuilds fast. `USER node` runs the app without root rights, which limits the damage if the app is attacked. The `HEALTHCHECK` lets Docker see whether the app is alive."),
    P("Also create a `.dockerignore` file so that `node_modules`, `.git` and especially `.env` are never copied into the image. A secret inside an image can be read by anyone who gets the image."),
    C('text', code('dep44-dockerignore.txt')),
    H("Compose: app, database and cache together"),
    C('yaml', code('dep44-docker-compose.yml')),
    P("Compose starts three containers. They can reach each other by **service name**: inside the app container, the database address is `mongo`, not `localhost`. The `volumes` entry stores the database files outside the container, so removing the container does not delete your data. The secret `JWT_SECRET` is read from your shell or a `.env` file, not written in the file."),
    O("Build and start everything: `docker compose up --build`. Add `-d` to run in the background.", "See the logs with `docker compose logs -f api`.", "Stop with `docker compose down`. Add `-v` only if you really want to delete the data volume."),
    N("Compose is excellent for development and for small single-server deployments. For many servers, teams move to a platform such as Kubernetes or a managed container service, which is a large topic of its own."),
    NOTRUN('Dockerfile and Compose file'),
    L("Pin a major Node version in `FROM`, and update it on purpose.", "Never put secrets in the Dockerfile or the image. Pass them at run time.", "Keep one process per container, and log to the console, because Docker collects it.", "Scan images with a tool such as `docker scout` or Trivy.", "Do not store uploads or database files inside a container without a volume."),
    ...task("Build the image for your own project and compare its size with a version that uses the full `node:22` image.", "Add a `.env.example` file that lists the variables without real values.", "Change the Compose file so that it also starts an nginx container in front of the app."),
    ...check("The image runs as the `node` user and not as root.", "Changing one source file does not reinstall every package on rebuild.", "Your `.env` file is listed in `.dockerignore`."),
  ], A('Image to container', [
    n('df', 'Dockerfile', 'the recipe', 0, 0, 'data'), n('img', 'Image', 'small, no dev tools', 1, 0, 'tool'),
    n('ct', 'Container', 'runs as user node', 2, 0, 'app'), n('cp', 'Compose', 'app + mongo + redis', 3, 0, 'out'),
  ], [
    { say: 'The Dockerfile lists the steps: base image, install packages, copy code.', on: ['df'] },
    { say: 'The build produces an image. A multi-stage build keeps build tools out of it.', flow: ['df>img:build'] },
    { say: 'A container is one running copy of the image, with limited rights.', flow: ['img>ct:run'] },
    { say: 'Compose starts the app together with its database and cache on a private network.', flow: ['ct>cp:services'] },
  ]), [
    faq('What is the difference between an image and a container?', 'An image is the packaged recipe. A container is a running instance of it. You can start many containers from one image.'),
    faq('Where should I keep database data?', 'In a volume. Anything written inside a container is lost when the container is removed.'),
    faq('Do I need Docker to deploy Node?', 'No. A VPS with PM2 works well, as in the previous lesson. Docker helps with identical environments and with larger teams.'),
  ]),

  // ---------------------------------------------------------------- 44
  les(S, 'ci-cd-with-github-actions-monitoring-backups-and-zero-downtime-releases', 'CI/CD with GitHub Actions, Monitoring, Backups and Zero-Downtime Releases', 'CI/CD, Monitoring and Backups for Node Apps',
    'Automate tests and deploys with GitHub Actions, release without downtime using PM2 reload, watch your app with logs and health checks, and back up the database.', [
    P("Deploying by hand, copying files and typing commands, works the first ten times. Then one evening you forget a step, or skip the tests, and the site is down. **CI/CD** replaces the manual steps with a script that runs the same way every time. This lesson covers that script, and the three habits that keep a live app healthy afterwards: monitoring, backups and careful releases."),
    H("CI and CD"),
    L("**Continuous integration (CI):** every push and pull request automatically installs the project and runs the tests and checks. A failing test blocks the merge.", "**Continuous delivery or deployment (CD):** when the checks pass on the main branch, the new version is automatically published to the server.", "The benefit is not speed alone. It is **confidence**: nobody can ship something that fails the tests by accident."),
    H("A GitHub Actions workflow"),
    P("GitHub Actions reads files in `.github/workflows`. The workflow below has two jobs. The `test` job runs on every push to `main` and on pull requests. It checks out the code, installs Node 22 with npm caching, runs `npm ci`, runs `npm audit` so that serious known vulnerabilities fail the build, and runs the tests. The `deploy` job runs only on `main` and only after `test` succeeded. It logs in to your server over SSH and runs the update commands."),
    C('yaml', code('dep45-ci.yml')),
    P("The values `secrets.SERVER_HOST`, `SERVER_USER` and `SERVER_SSH_KEY` come from the repository settings, under *Secrets*. They are never written in the file. Use a dedicated deploy key that can only access this server, not your personal key. The last command is `pm2 reload`, which restarts the app copies one by one, so the release has **no downtime**."),
    H("Safer releases"),
    L("**Roll back quickly.** Keep the previous version ready. With Git, redeploy the previous commit. With Docker, run the previous image tag.", "**Database changes need care.** Make them backwards compatible, such as adding a column first and removing the old one later, so old and new code work together during a release.", "**Graceful shutdown.** On `SIGTERM`, stop accepting new requests, finish the current ones, close the database and exit. PM2 and Docker both send that signal.", "**Release small and often.** A small change is easy to understand and to undo."),
    H("Monitoring: know before your users tell you"),
    L("**Health route:** `/health` answers 200 when the app and its database work. An external uptime service, such as UptimeRobot, checks it every minute and sends you a message.", "**Logs:** structured logs from lesson 33, kept somewhere searchable.", "**Errors:** a tool such as Sentry collects exceptions with the stack and context, and alerts you.", "**Metrics:** CPU, memory, response times and error rates. Tools such as Prometheus with Grafana, or the dashboards of your cloud, show trends. Event loop delay, from lesson 39, is a good Node-specific metric.", "**Alerts that people can act on.** Too many alerts teach everyone to ignore them."),
    H("Backups"),
    P("Databases are lost through mistakes, bugs, attacks and broken disks. A backup is the only cure, and a backup that was never tested is a hope, not a backup. The script below dumps the MongoDB database every night, compresses it, and deletes dumps older than 14 days."),
    C('bash', code('dep45-backup.sh')),
    L("Follow the **3-2-1 idea**: three copies, on two kinds of storage, with one copy in another place.", "Copy backups **off the server**, for example to a storage bucket. A backup on the same disk dies with the disk.", "Encrypt backups that contain personal data, and restrict who can read them.", "**Test the restore** on a separate machine, on a schedule. Write down how long it takes.", "MongoDB Atlas and most managed databases offer automatic backups. Turn them on and read what they include."),
    NOTRUN('workflow file and the backup script'),
    ...task("Add a CI workflow to a repository that only runs the tests, without the deploy job.", "Add a `/health` route that pings the database and returns 503 on failure.", "Run the backup script on a test database, then restore it into another database and compare the document counts."),
    ...check("A pull request with a failing test shows a red mark.", "The deploy job never runs on a failing build.", "You have restored a backup at least once."),
  ], A('Push to production, safely', [
    n('push', 'Push or PR', 'to GitHub', 0, 0, 'user'), n('ci', 'CI checks', 'install, audit, test', 1, 0, 'check'),
    n('cd', 'Deploy', 'SSH, pm2 reload', 2, 0, 'tool'), n('mon', 'Monitor + backup', 'alerts, restore tested', 3, 0, 'store'),
  ], [
    { say: 'Every push or pull request starts the workflow.', on: ['push'] },
    { say: 'CI installs the exact locked packages, audits them and runs the tests. A failure stops everything.', flow: ['push>ci:workflow'] },
    { say: 'Only a passing build on main is deployed, and pm2 reload replaces the copies one by one.', flow: ['ci>cd:green'] },
    { say: 'Health checks, logs and error alerts watch the result. Backups protect the data.', flow: ['cd>mon:running'] },
  ]), [
    faq('What is the difference between CI and CD?', 'CI runs checks on every change. CD publishes the version automatically after the checks pass.'),
    faq('What is zero-downtime deployment?', 'Replacing the running app without a period when users get errors, for example by restarting copies one at a time behind a balancer.'),
    faq('How often should I test a backup restore?', 'At least when you set it up and then on a regular schedule, such as every few months. An untested backup may not work when you need it.'),
  ]),

  // ---------------------------------------------------------------- 45
  les(S, 'typescript-prisma-redis-postgresql-and-aws-the-wider-node-stack', 'TypeScript, Prisma, Redis, PostgreSQL and AWS: The Wider Node Stack', 'TypeScript, Prisma, Redis, Postgres and AWS',
    'A guide to the tools around Node.js that job listings mention: TypeScript with Express, Prisma, Redis, PostgreSQL, AWS basics, Git and API docs.', [
    P("Job descriptions for Node developers list a long set of tools. Nobody learns all of them at once, and no one expects it. What they expect is that you understand what each tool is for, have used one or two properly, and can learn the rest when needed. This lesson is a map of the common ones, with one working TypeScript example, so that you know where each tool fits and what to learn next."),
    H("TypeScript"),
    P("**TypeScript** is JavaScript with types. You describe the shape of data, and the compiler warns you when code does not match it, before the program runs. In a back end this catches typos in field names, missing `await`s and wrong arguments. The nice trick used below is to write the validation rule once with Zod and **derive the type from it** with `z.infer`, so the runtime check and the compile-time type can never disagree."),
    C('ts', code('ts46-server.ts')),
    C('json', code('ts46-tsconfig.json')),
    P("Install `typescript` and the type packages with `npm install -D typescript @types/express @types/node`, and compile with `npx tsc`. In development, tools such as `tsx` run TypeScript files directly. The code above compiled without errors with the TypeScript compiler. Types exist only at compile time, so they do not replace validation of requests: that is why Zod is still used."),
    H("The rest of the map"),
    L("**Prisma and PostgreSQL:** the SQL route shown in lesson 26. Learn tables, relations, joins, indexes and migrations. This is the most common pairing in new TypeScript back ends.", "**Redis:** the shared in-memory store from lessons 34 and 35 for caching, sessions, rate limits and queues. Learn strings, hashes, expiry and how to keep keys organised.", "**AWS:** the largest cloud. Start with four services: **EC2** for virtual servers, **S3** for file storage, **RDS** for managed databases, and **IAM** for access control. Learn IAM carefully, because wrong permissions cause most cloud security incidents. Other clouds, Google Cloud and Azure, work along the same lines.", "**Git and GitHub:** branches, pull requests and code review. Use small commits with clear messages, and never commit secrets.", "**API documentation:** the OpenAPI file from lesson 21, kept in the repository.", "**Docker, CI/CD and monitoring:** the last three lessons."),
    H("How to learn the rest without being overwhelmed"),
    O("Choose **one stack** and build a real project on it from start to finish. A good choice is TypeScript, Express, PostgreSQL with Prisma, Redis for caching, Docker, and GitHub Actions.", "Add each new tool only when a real need appears in your project, such as slow lists, which need a cache, or a slow email, which needs a queue.", "Write down for each tool: what problem it solves, one alternative, and one limitation. This is the form interviewers ask in.", "Put the project online with a README, a live link, and a short description of the decisions that you made. That page is your best answer to \"tell me about a project\"."),
    N("Tools and versions change fast. Treat the tool names here as the current common choices at the time of writing, not as permanent truths, and check their official documentation before you start."),
    P("Your resume should show this work honestly. List the tools that you used in a real project, and be ready to explain how. A short list that you can defend is stronger than a long list of names. You can build a clean, ATS-friendly resume with our [resume templates](/templates), and check how it reads to an applicant tracking system with the [ATS checker](/features/ats-checker)."),
    RAN,
    ...task("Compile the TypeScript example and add a `GET /tasks` route with a typed response.", "Make a table of the tools in this lesson with the columns problem, alternative and limitation.", "Plan a project that uses at least TypeScript, one database and one cache."),
    ...check("`tsc` finishes without errors.", "You can say why TypeScript types do not replace request validation.", "You can name the problem that each tool in this lesson solves."),
  ], A('The map around Node', [
    n('lang', 'TypeScript', 'types at build time', 0, 0, 'tool'), n('data', 'Postgres + Prisma', 'SQL and migrations', 1, 0, 'store'),
    n('fast', 'Redis', 'cache, queue, limits', 2, 0, 'data'), n('cl', 'AWS + Docker', 'run it in the cloud', 3, 0, 'cloud'),
  ], [
    { say: 'TypeScript catches wrong field names and arguments before the app runs.', on: ['lang'] },
    { say: 'PostgreSQL with Prisma stores strongly connected data with migrations and typed queries.', flow: ['lang>data:types'] },
    { say: 'Redis speeds up reads and carries queues and counters shared by all copies.', flow: ['data>fast:cache'] },
    { say: 'Docker and a cloud such as AWS run the copies, with IAM controlling who can do what.', flow: ['fast>cl:deploy'] },
  ]), [
    faq('Do I need TypeScript to get a Node job?', 'Many employers prefer it, and it is common in new projects. Good JavaScript and a real project still get you interviews, and TypeScript is easy to add afterwards.'),
    faq('Which AWS services should I learn first?', 'EC2 for servers, S3 for files, RDS for databases and IAM for permissions. IAM matters most for safety.'),
    faq('Should I list every tool on my resume?', 'No. List the tools you used in a real project and can explain. A short, honest list beats a long list of names.'),
  ]),
];
