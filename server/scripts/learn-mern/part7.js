import { P, H, L, O, N, C, S, task, check, lesson } from './helpers.js';

const S7 = 'Advanced Topics';
const S8 = 'Deploy and Launch';

export const lessons = [
  // ------------------------------------------------------------ 36
  lesson(S7, 'file-upload-with-multer-and-react', 'File Upload with Multer and React: Attach a Resume to a Job Safely', 'Accept a PDF or Word file with multer, check size, type and the real file signature, store it under a random name, and let the owner download or remove it from React.', '', [
    P("People often want to keep the resume they sent with each application. File upload is a feature that looks simple and hides several security traps, because you are letting strangers put files on your server. This lesson builds it carefully: only the owner can attach or read a file, only PDF and Word files are accepted, the size is limited, and the name on disk is never chosen by the client."),

    H("How an upload travels"),
    P("A browser sends a file in a request with the content type `multipart/form-data`: a body made of parts, one for each field, each with its own headers. `express.json()` does not understand it, so we use **multer**, a middleware that reads the parts, saves the file and puts the details in `req.file`. The other form fields end up in `req.body`."),
    H("The upload middleware"),
    S(36, 'server/middleware/upload.js'),
    L(
      "**Limits**: `fileSize` is 2 MB and `files` is 1. Without a size limit, one visitor could fill your disk.",
      "**A random file name** made with `crypto.randomBytes(16)`. The client's file name is never used as a path. A name such as `../../etc/passwd` or `evil.js` cannot clash with another file or leave the folder. We keep the original name only as text to show the person.",
      "**`fileFilter`** accepts only the extensions `.pdf`, `.doc` and `.docx`.",
      "**The magic bytes check.** The extension and the type the browser reports are claims made by the client, and a person can rename any file to `.pdf`. `looksLikeAllowedFile` reads the first bytes of the saved file: a PDF starts with `%PDF-`, a `.docx` is a zip and starts with `PK`, an old `.doc` has its own signature. A file that does not match is deleted.",
      "**`removeFile`** only deletes names matching the exact pattern we generate, so it can never be tricked into deleting another file.",
    ),
    N("Never serve uploaded files from a public folder with their stored names, and never allow types such as `.html`, `.svg` or `.js`: a browser that opens them can run the code in the context of your site. Here every download goes through a route that checks ownership and sends the file as an attachment."),
    H("The data and the controller"),
    S(36, 'server/models/Job.js'),
    P("The file stays on disk and only its details go in MongoDB, in a small embedded `resume` object. The `toJSON` transform shows the client only `name`, `size` and `uploadedAt`. It hides `storedName`, the real file name."),
    S(36, 'server/controllers/files.js'),
    L(
      "**`ownJob`** finds the job **with the owner filter** from lesson 22. All three routes use it, so another person's job gives a `404`, whatever they try.",
      "**Upload** checks the signature, deletes the old file if there is one, saves the new details, and, if anything fails, removes the new file so that no orphan stays on disk (the `catch` block).",
      "**Download** uses `res.download(path, originalName)`, which sets `Content-Disposition: attachment` so the browser saves the file with the person's own file name.",
      "**Delete** removes the file and the details together. Deleting the whole job also removes its file (see `controllers/jobs.js` in this lesson).",
    ),
    S(36, 'server/routes/jobs.js'),
    P("`upload.single('resume')` is **route middleware** in front of the handler, as lesson 10 described: the string must match the form field name used by the client. Errors from multer, such as a file that is too large, are turned into friendly answers by the error handler (`413` for size, `400` for the rest)."),
    H("The React side"),
    S(36, 'client/src/api.js'),
    P("`api()` now accepts a `FormData` body and **does not set** the `Content-Type` header. The browser sets it and adds the *boundary* that separates the parts. If you set it yourself, the boundary is missing and the upload fails. `downloadFile` exists because a plain `<a href>` cannot send our `Authorization` header: it fetches the file with the token and saves it from memory."),
    S(36, 'client/src/components/ResumeFile.jsx'),
    P("The component checks the size on the client first (a courtesy that saves the upload time), then sends the file with `new FormData()` and `append('resume', file)`. `e.target.value = ''` resets the input so that choosing the same file twice still fires a change. The server checks everything again, because the client can be bypassed."),
    S(36, 'client/src/pages/JobDetailPage.jsx'),
    ...task(
      "Run `npm install` in `server` (adds `multer`), and attach a PDF to a job on its detail page. Download it again.",
      "Rename a text file to `fake.pdf` and try to upload it. Read the message.",
      "Try a file larger than 2 MB, and a `.exe` file.",
      "Look in `server/uploads`. What are the files called? Delete the job and check that its file is gone.",
    ),
    ...check("A real PDF is accepted and downloads with its original name.", "A fake PDF, a big file and a wrong type are refused with clear messages.", "A second user cannot download the first user's file."),
    H("Summary"),
    L("Use multer for `multipart/form-data`; limit size and count; filter by extension.", "Check the file's first bytes, store it under a random name, and serve it only through an owner-checked route.", "In React send a `FormData` and let the browser set the content type."),
  ], [
    { q: 'Why check the first bytes of a file?', a: 'The file name and the type reported by the browser are controlled by the sender. The first bytes (the signature) are much harder to fake while keeping a useful file, so they give a stronger check that a PDF really is a PDF.' },
    { q: 'Why not use the original file name on the server?', a: 'It can contain path tricks such as ../, clash with existing files, or have a dangerous extension. A random generated name avoids all of that. Keep the original name as text only, to show people.' },
    { q: 'Why does my React upload fail with a missing boundary error?', a: 'You set the Content-Type header yourself. For FormData let the browser set it, because it adds the boundary string that separates the parts of the body.' },
  ], 'multer file upload express, react file upload, secure file upload node, upload pdf node js, formdata fetch'),

  // ------------------------------------------------------------ 37
  lesson(S7, 'production-ready-express-logging-graceful-shutdown-compression-indexes', 'Production-Ready Express: Structured Logs, Graceful Shutdown, Compression and Indexes', 'Prepare the server for the real world: JSON logs without secrets, clean shutdown, a real health check, gzip, and building indexes on purpose.', '', [
    P("Code that works on your laptop is not yet code that is ready for real visitors. Production needs things that are easy to forget because nothing looks broken without them: logs you can search when something goes wrong, a server that stops cleanly instead of cutting people off mid-request, a health check that tells the truth, and a database that has the right indexes. This lesson adds all of them with small changes."),

    H("1. Logs you can read at 3 a.m."),
    S(37, 'server/utils/logger.js'),
    P("In development a person reads the terminal, so a readable line is best. In production the logs are collected and searched by tools, so **one JSON object per line** (with `time`, `level`, `message` and fields) is best: you can filter by status code or find slow requests with a search. The tiny logger does both, chosen by `NODE_ENV`."),
    S(37, 'server/middleware/logger.js'),
    L(
      "It logs the **path only** (`req.path`), not the full URL. A query string can contain private information, such as a search for a person's name.",
      "It never logs the **body or the headers**. They contain passwords and the `Authorization` token, and logs are copied around far more freely than databases are.",
      "It records the status and the time in milliseconds, which is enough to find slow and failing routes.",
    ),
    H("2. Shutting down politely"),
    S(37, 'server/index.js'),
    P("When you deploy a new version, the process manager sends the old process a `SIGTERM` signal. If the program simply dies, any requests being answered at that moment fail. The handler here does it properly: it **stops accepting new connections and waits for the current ones to finish** (`server.close`), closes the database connection, and exits. A timer forces exit after 10 seconds so a stuck connection cannot block a deploy. `unhandledRejection` logs promises that nobody caught and exits, since the process may be in a bad state and the process manager will start a fresh one."),
    H("3. A health check that tells the truth"),
    S(37, 'server/app.js'),
    P("`/api/health` now answers `503` when the database is not connected, and `200` when it is, together with the uptime. Load balancers, uptime monitors and your own deploy script use it to decide whether to send traffic. A health check that always says “OK” is worse than none."),
    P("`compression()` gzips text responses (JSON, HTML, JavaScript), which are often a quarter of their original size. That matters on mobile connections. In many setups nginx does it instead; use one or the other."),
    H("4. Build indexes on purpose"),
    S(37, 'server/config/db.js'),
    P("Mongoose creates the indexes described in your schemas when the app starts (`autoIndex`). On a small database that is fine. On a large one, building an index can be slow and heavy, and you do not want it to happen every time a server restarts. So in production `autoIndex` is off, and you run the sync **deliberately** after a deploy that changed an index."),
    S(37, 'server/scripts/sync-indexes.js'),
    P("`syncIndexes()` creates missing indexes and removes ones that are no longer in the schema. It is the same function that fixed the test flakiness in lesson 24. Our `deploy.sh` in lesson 39 runs it for you."),
    N("Monitoring is the other half of production. Even a simple uptime check that calls `/api/health` every minute and emails you is far better than finding out from a visitor. Many free and paid services do this; check what suits your budget."),
    ...task(
      "Run `npm install` in `server` (adds `compression`). Start with `NODE_ENV=production` and a long `JWT_SECRET` and look at the JSON log lines.",
      "Press Ctrl + C while a request is running (add a one second delay to a route to test). Watch the shutdown messages.",
      "Stop MongoDB and call `/api/health`. You should get `503`.",
      "Run `npm run indexes` and read what it prints.",
    ),
    ...check("In production mode each log line is one JSON object with no passwords or tokens.", "Ctrl + C prints the shutdown messages and exits with code 0.", "The health check answers 503 without a database."),
    H("Summary"),
    L("Log JSON in production, only path, status and timing, never secrets.", "Handle `SIGTERM`: finish requests, close the database, then exit.", "Make health checks honest, compress text, and build indexes deliberately."),
  ], [
    { q: 'Why log JSON in production?', a: 'Log tools can search and filter structured fields such as status and duration, which is much harder with free text lines. Keep readable lines for development.' },
    { q: 'What is a graceful shutdown?', a: 'Stopping a server in a way that lets requests that are already being answered finish, closing database connections cleanly, and only then exiting. It avoids errors for people during a deploy.' },
    { q: 'Why turn autoIndex off in production?', a: 'Building indexes on a large collection can be slow and heavy, and it should not happen on every restart. Run syncIndexes yourself after a deploy that changes indexes.' },
  ], 'express production best practices, node js graceful shutdown, express logging json, mongoose autoindex production, express health check'),

  // ------------------------------------------------------------ 38
  lesson(S8, 'build-and-serve-the-react-app-from-express', 'Build for Production and Serve the React App from Express', 'Create the optimised React build, let Express serve it with correct caching, send index.html for client-side routes, and keep unknown API paths as JSON 404.', '', [
    P("In development you ran two servers: Vite for the screens and Express for the API. In production the simplest setup runs **one**. `npm run build` turns your React source into a small set of static files, and Express serves those files and the API from the same address. That removes CORS from the picture, needs only one process to manage, and means the token and the pages share an origin."),

    H("What the build does"),
    P("`vite build` bundles your JSX and CSS into plain JavaScript and CSS files in `client/dist`, minified, with a hash in each file name (`assets/index-BBRz7k9l.js`). The hash changes whenever the content changes. That detail drives the caching rules below."),
    H("Serving the build"),
    S(38, 'server/app.js'),
    L(
      "**The folder.** `client/dist` is found relative to this file, or from `CLIENT_DIST`. If it does not exist (for example in tests or in development), nothing is served and the API still works.",
      "**Caching.** Files in `/assets` have the hash in their name, so they can never change under the same name. They get `Cache-Control: public, max-age=31536000, immutable`, a year. `index.html` must **never** be cached: it points at the current hashed files, and an old cached copy would point at files you have deleted. It gets `no-cache`.",
      "**The fallback.** React Router draws pages like `/jobs/123` in the browser, but the server has no such file. `app.get(/^\\/(?!api\\/).*/, ...)` answers any GET that does not start with `/api/` with `index.html`, so reloading or sharing a deep link works.",
      "**API 404s.** `app.use('/api', notFound)` comes *before* the fallback. An unknown API path must be a JSON `404`, and not a copy of the home page, which would confuse scripts and hide bugs.",
    ),
    N("Order again: API routes, then `/api` 404, then static files, then the fallback, then the general 404 and the error handler. Reading the file top to bottom should match the order a request is tried."),
    H("Security headers and the build"),
    P("`helmet()` sets a Content Security Policy that only allows scripts from your own site. The Vite build loads its code from files, not inline scripts, so it works under that policy. If you later add something like an analytics script or fonts from another site, you will have to allow them in the policy on purpose. That is the policy doing its job."),
    H("Run it like production"),
    S(6, 'package.json'),
    P("From the project root: `npm run build` creates `client/dist`, and `npm start` starts the server. With `NODE_ENV=production` and a real `JWT_SECRET` set in `server/.env`, open `http://localhost:5000` and use the whole app from that single port. This is exactly what the server will do after deployment, so it is the best test before you deploy."),
    ...task(
      "Run `npm run build` at the project root. Look at the `client/dist/assets` folder and the file sizes.",
      "Start only the server (`npm start`) and open `http://localhost:5000`. Sign in and use the app.",
      "Reload on a deep link such as `/jobs/<an id>`. It should work.",
      "Open `/api/nothing` and `/nothing` and compare the answers.",
    ),
    ...check("The app works from port 5000 with no Vite running.", "Deep links survive a reload.", "`/api/nothing` is JSON 404, and `/nothing` shows the React 404 page."),
    H("Summary"),
    L("`vite build` creates hashed static files; Express serves them with year-long caching for `/assets` and none for `index.html`.", "Send `index.html` for every non-API GET so client-side routes work.", "Keep the order: API, API 404, static, fallback, error handler."),
  ], [
    { q: 'Why is index.html not cached but assets are?', a: 'Asset file names contain a hash of their content, so a new version has a new name and can be cached for a year. index.html has a fixed name and points at the current assets, so it must be fetched fresh or visitors could get stale pages.' },
    { q: 'Do I need nginx if Express serves the files?', a: 'Not strictly. nginx in front is still useful for HTTPS, large uploads, compression and serving many sites on one server, which is what lesson 39 sets up.' },
    { q: 'Why serve the API and the React app from one origin?', a: 'The browser then sees a single origin, so no CORS settings are needed, and there is one thing to deploy and monitor. Large teams sometimes split them for scaling reasons.' },
  ], 'serve react build with express, vite build production, express static files spa fallback, cache control immutable, mern production build'),

  // ------------------------------------------------------------ 39
  lesson(S8, 'deploy-a-mern-app-to-a-vps-with-pm2-nginx-and-https', 'Deploy a MERN App to a VPS with pm2, nginx and HTTPS (Let\'s Encrypt)', 'Put the Job Tracker on a Linux server: environment file, pm2 process manager, nginx reverse proxy, free HTTPS certificate, and a repeatable deploy script.', '', [
    P("Everything so far runs on your own computer. To let other people use it, the app needs a computer that is always on and reachable. This lesson uses a **VPS** (a small rented Linux server, offered by many hosting companies) with the classic setup that many production sites still use: **pm2** keeps Node.js running, **nginx** receives visitors and talks to it, and **Let's Encrypt** provides a free HTTPS certificate. The files in this lesson's zip are templates: replace the example domain and paths with yours."),
    P("Other options exist, such as platform services that deploy from Git for you. They are convenient, and prices and features change often, so check their sites. Knowing the manual way means you understand what those services do for you."),

    H("The pieces"),
    L(
      "**A domain name** pointing to the server's IP address (an `A` record in your DNS settings).",
      "**Node.js 20+, nginx, git and certbot** installed on the server, and **pm2** (`npm install -g pm2`).",
      "**MongoDB Atlas** for the database, with the server's IP address allowed in Network Access, and a database user limited to this one database.",
      "**A non-root user** for running the app, and a firewall that opens only SSH, HTTP and HTTPS.",
    ),
    H("The environment file"),
    S(39, 'server/.env.production.example'),
    P("On the server, copy it to `server/.env` and fill it in. `NODE_ENV=production` turns on the production behaviour from lesson 37 (JSON logs, indexes off). `TRUST_PROXY=1` is essential behind nginx (lesson 23). Create the secret with the command in the comment, and run `chmod 600 server/.env` so only your user can read it. The real file never goes into Git."),
    H("pm2: keep the app running"),
    S(39, 'deploy/ecosystem.config.cjs'),
    P("If the Node.js process crashes, nothing restarts it by default. **pm2** does: it starts the app, restarts it after a crash or when it uses too much memory, keeps the logs (`pm2 logs`), and with `pm2 startup` plus `pm2 save` starts it again after a server reboot. `kill_timeout` gives the graceful shutdown from lesson 37 time to finish. The file ends in `.cjs` because pm2 reads it as a classic module, even though the app itself uses ES modules."),
    H("nginx: the front door"),
    S(39, 'deploy/nginx.conf'),
    P("nginx listens on ports 80 and 443 and **proxies** requests to your app on port 5000. The `X-Forwarded-*` headers tell Express the real visitor IP address and whether the connection was HTTPS. `client_max_body_size 3m` matters for our resume uploads: nginx's default is 1 MB and it would answer `413` before your app saw the request. After changing nginx, always run `sudo nginx -t` to check the file, then `sudo systemctl reload nginx`."),
    P("For HTTPS, `sudo certbot --nginx -d your-domain` gets a free certificate from Let's Encrypt, edits the nginx file to use it, adds a redirect from HTTP to HTTPS, and sets up automatic renewal. Test that renewal works with `sudo certbot renew --dry-run`."),
    H("A repeatable deploy"),
    S(39, 'deploy/deploy.sh'),
    P("The script runs, in order: pull the latest code (`--ff-only` refuses to make an unexpected merge), install server packages without development tools, install client packages and build the React app, sync the database indexes, reload pm2, and finally call the health check. `set -euo pipefail` stops at the first error, so a failed build never reaches “reload”. `pm2 startOrReload` replaces the process without a long gap."),
    S(39, 'docs/DEPLOY.md'),
    P("The file above has the one-time steps and a troubleshooting table. The symptoms in it are the ones people actually meet: a `502` (the app is not running), a crash at start (usually a missing variable or Atlas refusing your IP), an upload `413` (nginx limit), and being signed out immediately (a missing `TRUST_PROXY` or a changed secret)."),
    N("Back up two things: the database (turn on Atlas backups, or run `mongodump` on a schedule) and the `server/uploads` folder. Uploaded files are not in MongoDB. A backup you have never restored is only a hope: try a restore once."),
    ...task(
      "Read `docs/DEPLOY.md` and tick off each one-time step for your own server (you can do this on any small test server).",
      "Replace `jobtracker.example.com` with your domain in `deploy/nginx.conf`.",
      "Run the deploy steps by hand once, then with `bash deploy/deploy.sh`.",
      "After deploying, stop the app with `pm2 stop job-tracker`, visit the site (what do you see?), and start it again.",
    ),
    ...check("`https://your-domain/api/health` answers `ok: true`.", "The site works over HTTPS, and HTTP redirects to it.", "After `sudo reboot`, the app comes back by itself."),
    H("Summary"),
    L("pm2 keeps Node.js running; nginx handles HTTPS and large uploads; Atlas holds the data.", "Set `NODE_ENV=production` and `TRUST_PROXY=1`; keep `.env` out of Git with strict permissions.", "Script the deploy and finish with a health check; back up the database and the uploads folder."),
  ], [
    { q: 'Do I need nginx and pm2, or can I use a hosting platform?', a: 'Hosting platforms that deploy from Git do the same jobs for you and are quicker to start with. Doing it by hand on a VPS teaches what those platforms automate and gives you full control. Compare current prices and limits on their sites.' },
    { q: 'Why do I get 502 Bad Gateway?', a: 'nginx could not reach your app. Check that it is running (pm2 status), that it listens on the port in the nginx file, and read pm2 logs for the first error, often a missing environment variable.' },
    { q: 'How do I renew the HTTPS certificate?', a: 'Certbot sets up automatic renewal when you install the certificate. Check it with certbot renew --dry-run, and make sure the nginx server name still matches your domain.' },
  ], 'deploy mern app vps, pm2 nginx node js, lets encrypt certbot nginx, deploy node js ubuntu, mern stack deployment'),

  // ------------------------------------------------------------ 40
  lesson(S8, 'mern-capstone-checklist-and-next-steps', 'MERN Capstone: Production Checklist, Common Mistakes and What to Build Next', 'A final checklist for security, quality and production, the mistakes that catch most beginners, and eight ideas to extend the Job Tracker using only what you learned.', '', [
    P("You have built and deployed a complete full stack application: a React front end, an Express API, a MongoDB database, sign-in, file uploads and a production server. This last lesson turns what you did into habits. It has a checklist you can reuse on every project, a list of the mistakes that most often catch people, and a plan for what to build next."),

    H("The checklist"),
    S(40, 'docs/CHECKLIST.md'),
    P("Run through it before you share any app. A few lines deserve a comment. “`.env` was never committed” must be checked in the Git **history**, not only in the current files, because a secret committed once stays in history even after you delete the file. If it ever was, change the secret. “Every query includes the signed-in user's id” is the single most valuable security habit in the course. And “you have restored a backup at least once” turns a hope into a plan."),
    H("Mistakes that catch almost everyone"),
    L(
      "**Forgetting `await`**, and then wondering why a value is `Promise { <pending> }` or why data is missing.",
      "**Mutating state** in React (changing an array or object in place) so the screen does not update.",
      "**Missing dependencies** in `useEffect`, which cause stale data, or **new functions in dependencies**, which cause endless loops.",
      "**Trusting the client**: no validation on the server, or taking the user id from the request body.",
      "**Route order** in Express: `/:id` before `/stats`.",
      "**Secrets in Git**, or a database open to the whole internet.",
      "**No loading, empty or error states**, so a slow connection looks like a broken app.",
      "**Testing only the happy path.** Bad input, no token and someone else's data are where the bugs are.",
    ),
    H("Where each lesson's idea shows up again"),
    P("It helps to see the course as a few ideas used repeatedly, rather than forty topics. **A request has a shape** (lessons 1, 5, 9). **Middleware is a pipeline** (10, 12, 22, 23, 36). **Never trust input** (12, 17, 18, 23, 36). **Data belongs to someone** (20, 22, 36). **State is replaced, not edited** (26, 31, 33). **Effects have cleanups** (28, 33, 35). **The URL is state** (29, 33). **Failure needs a design** (12, 28, 31, 37). When you meet a new library, look for these ideas and you will understand it quickly."),
    H("What to build next"),
    S(40, 'docs/NEXT-STEPS.md'),
    P("Each idea uses only skills from this course, in a sensible order. **Interview dates** add a field, a sort and a screen. **Delete my account** is a good lesson in cleaning up related data and files, and many places require it by law. **Cookies instead of localStorage**, **password reset by email**, **tests for React**, **TypeScript**, **Docker** and **CI** are the usual next steps in professional work."),
    N("A project you can show is worth more than a list of courses. Put the Job Tracker on your own domain, write a short README with screenshots and what you learned, and keep improving it. Employers and clients look at working projects."),
    ...task(
      "Run the checklist on your deployed app and tick every line honestly.",
      "Pick one item from `docs/NEXT-STEPS.md` and build it, with a test.",
      "Write a README for your repository: what it does, how to run it, and which parts you built yourself.",
      "Teach one lesson of this course to someone else. Explaining is the best test of understanding.",
    ),
    ...check("Every line of the checklist is ticked, or you have written down why not.", "You have a public, working version of the project and a short README."),
    H("Summary"),
    L("Use the checklist on every project, and check Git history for secrets.", "Most bugs are the same few mistakes: missing await, mutated state, missing effect dependencies and trusting input.", "Extend the project step by step, with tests, and show it."),
  ], [
    { q: 'What should I learn after the MERN stack?', a: 'Common next steps are TypeScript, automated tests for the front end, Docker, continuous integration, and a second framework such as Next.js. Choose by the jobs or projects you care about and look at real job adverts in your area.' },
    { q: 'How do I find out if a secret was ever committed to Git?', a: 'Search the history, for example with git log --all -- server/.env, or use a secret scanning tool. If a secret was committed, treat it as leaked: change it, even after removing the file.' },
    { q: 'Is the Job Tracker good enough to show in my portfolio?', a: 'Yes, if it is deployed, has a clear README with screenshots, and you can explain your choices (ownership checks, validation, indexes, uploads). Extend it with one feature of your own so it is clearly your work.' },
  ], 'mern project checklist, full stack developer next steps, mern stack common mistakes, production checklist node'),
];
