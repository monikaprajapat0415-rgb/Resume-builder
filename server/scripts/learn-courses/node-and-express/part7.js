import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';
import { RAN, PARTLY, SETUP, run } from './kit2.js';

const S = 'Authentication and Security';

export const lessons = [
  // ---------------------------------------------------------------- 27
  les(S, 'access-and-refresh-tokens-logout-and-role-based-access-control', 'Access and Refresh Tokens, Logout and Role-Based Access Control', 'Refresh Tokens, Logout and Role Access',
    'Build login with short-lived access tokens and rotating refresh tokens, support real logout, and protect admin routes with role checks that clients cannot fake.', [
    P("An earlier lesson showed how to log a user in and give them a JSON Web Token (JWT). That works, but it leaves two problems. If the token lasts a week and someone steals it, the thief has a week. If the token lasts five minutes, the user must log in again every five minutes. Real systems solve this with **two tokens**. This lesson builds that system with a tested example, and then adds **roles**, so that normal users and admins are treated differently."),
    H("Access token and refresh token"),
    L("The **access token** is a short-lived JWT, for example 15 minutes. The client sends it with every request. If it leaks, the damage ends quickly.", "The **refresh token** lives longer, for example 7 days. It is used only to ask for a new access token, and it is never sent to normal routes.", "The server **stores a hash** of each refresh token, so it can see which ones are valid and can cancel one at any time.", "On every refresh, the server issues a **new** refresh token and cancels the old one. This is called **rotation**."),
    P("Why store anything on the server when JWTs are meant to be stateless? Because *logout* needs memory. A JWT alone cannot be cancelled before it expires. By keeping the refresh tokens in a database, you can delete one on logout, delete all of them when a user changes their password, and notice **reuse**: if a refresh token that was already rotated is used again, someone has a copy, and you can end the whole session family. The access token stays stateless and fast, and the refresh token is where you keep control."),
    SETUP('express jsonwebtoken bcryptjs', ['Save the code as `auth.js`. The test needs `npm install -D supertest`.']),
    C('js', code('a27-auth.js')),
    P("Walk through the routes. `/register` hashes the password with bcrypt, and the code never stores the plain password. `/login` compares the hash and returns both tokens. `/refresh` checks that the presented refresh token is on the list of valid hashed tokens, removes it, and returns a new pair. `/logout` removes the token. `/me` is protected by `requireAuth`, which verifies the access token. `/admin/stats` is protected twice, first by `requireAuth` and then by `requireRole('admin')`."),
    H("Roles: decide on the server"),
    P("**Authentication** asks *who are you?* **Authorization** asks *what may you do?* The simplest model is **role-based access control (RBAC)**: each user has a role such as `user`, `editor` or `admin`, and each route lists the roles that may use it. The rule that matters most is where the role comes from. It must come from your database, put into the token by your server, and **never from the request body**. In the code, `/register` ignores any `role` that the client sends. If it copied the field, anyone could register as an admin with one extra line of JSON."),
    C('js', code('a27.test.js')),
    P("The test registers a user, logs in, refreshes, shows that the old refresh token no longer works, logs out, and checks that a normal user gets 403 on the admin route. It passes."),
    H("Where should the client keep the tokens?"),
    P("There is no perfect answer. A refresh token in an **httpOnly cookie** cannot be read by JavaScript on the page, which protects it from XSS theft, but a cookie needs CSRF protection, which lesson 30 covers. A token in `localStorage` is easy to use but any injected script can read it. A common compromise is to keep the access token in memory and the refresh token in an httpOnly, secure, sameSite cookie."),
    N("This example keeps users and tokens in memory so that you can run it without a database. In a real app, store them in your database, and delete expired refresh tokens regularly."),
    RAN,
    ...task("Make the refresh token travel in an httpOnly cookie instead of the JSON body.", "Add an `editor` role and a route that both editors and admins can use.", "Add a `/logout-all` route that removes every refresh token for the user."),
    ...check("The old refresh token fails after it is used once.", "A user cannot make themselves admin by sending `role` in the body.", "You can explain why logout needs the server to remember something."),
  ], A('Two tokens, one session', [
    n('login', 'Login', 'password checked', 0, 0, 'user'), n('acc', 'Access token', '15 minutes', 1, 0, 'tool'),
    n('ref', 'Refresh token', 'hash stored, rotates', 2, 0, 'store'), n('role', 'Role check', 'from the database', 3, 0, 'check'),
  ], [
    { say: 'A correct password gives the client two tokens.', on: ['login'] },
    { say: 'The short-lived access token is sent with each request. If stolen, it soon expires.', flow: ['login>acc:JWT'] },
    { say: 'The refresh token is only used to get a new pair, and the server remembers its hash so it can cancel it.', flow: ['acc>ref:when expired'] },
    { say: 'Admin routes check the role that the server put in the token, never one sent by the client.', flow: ['ref>role:claims'] },
  ]), [
    faq('Why not make one long-lived access token?', 'If it leaks, the thief has access for the whole time, and you cannot cancel it. Short access tokens limit the damage.'),
    faq('What is refresh token rotation?', 'Each use of a refresh token returns a new one and cancels the old one. If an old token appears again, you know it was copied.'),
    faq('Where does the user role come from?', 'From your database, set by your server code. Never trust a role field sent by the client.'),
  ]),

  // ---------------------------------------------------------------- 28
  les(S, 'forgot-password-email-verification-and-otp-login-with-nodemailer', 'Forgot Password, Email Verification and OTP Login with Nodemailer', 'Password Reset, Email Verification and OTP',
    'Build email verification, a safe forgot and reset password flow, and one-time passcodes with expiry and attempt limits, sending mail through Nodemailer.', [
    P("Every account system needs the same three side features: confirm that an email address is real, let people recover a lost password, and sometimes log in with a one-time code. They look simple, and they are some of the most commonly attacked features, because an attacker who takes over the reset flow takes over the account. This lesson builds all three with a fake mailer, so you can run and test it without sending real email."),
    H("The pattern behind all three"),
    P("Each feature uses a **secret token that is sent by email**. The server generates a long random value, stores only its **hash** with an expiry time, and emails the plain value as a link or code. When the user comes back with it, the server hashes what it received, compares, checks that it has not expired, and **deletes it so it cannot be used twice**. Storing the hash means that someone who reads your database cannot use the tokens. Use `crypto.randomBytes(32)` for tokens, never `Math.random()`, which is predictable."),
    SETUP('express', ['Save the code as `account.js`. The test needs `npm install -D supertest`.']),
    C('js', code('a29-account.js')),
    H("Email verification"),
    P("When someone registers, the account starts as unverified, and the server emails a link that contains a token. `/verify` checks the token and marks the email as verified. This stops people from registering with someone else's address, and keeps fake accounts out of your email list. Decide what an unverified user may do. Most apps let them log in but block sensitive actions until they verify."),
    H("Forgot and reset password"),
    P("Look closely at `/forgot-password`. It answers with the **same message** whether or not the email exists: *If that address has an account, we have sent a link*. If it said *no such user*, an attacker could test thousands of addresses and learn which people use your site. The reset token expires after 15 minutes, works once, and, in a full system, should also cancel the user's refresh tokens when the password changes, so a thief who had a session is thrown out. The reset link should lead to a page on **your** domain. Never build it from the `Host` header of the request, because an attacker can send a fake one and get your server to email a link that points to their site."),
    H("One-time passcodes"),
    P("An **OTP** is a short code, usually six digits, that is sent by email or SMS and proves the user has access to that address or phone. Short codes are easy to guess, so three limits are required: a short life such as five minutes, one use, and a limit on wrong attempts. With six digits there are one million possibilities, so without a limit an attacker could simply try them all. The example locks the code after five wrong guesses. Generate it with `crypto.randomInt`, and store its hash."),
    C('js', code('a29.test.js')),
    P("The test uses a fake mailer that remembers the messages, and a fake clock that the test can move forward. That is why `createApp` takes `mailer` and `now` as arguments: two small pieces of dependency injection that make time-based rules testable in milliseconds, with no waiting."),
    H("Sending real email with Nodemailer"),
    P("**Nodemailer** is the usual Node package for sending mail. You create a transport with the details of an SMTP server, and call `sendMail` with `from`, `to`, `subject` and `html`. For development, use a service that catches mail without delivering it, such as Mailtrap or Ethereal. For production, use a proper provider such as Amazon SES, Brevo, Postmark or SendGrid, and set up **SPF, DKIM and DMARC** records on your domain, or your messages will land in spam. Send email in the background rather than inside the request, so a slow mail server does not slow your API."),
    C('js', `import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const mailer = {
  async send({ to, subject, html }) {
    await transport.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
  },
};`),
    PARTLY('sending real mail through Nodemailer, which needs an SMTP account,'),
    ...task("Add rate limiting to `/forgot-password`, three requests per hour per address.", "Cancel all refresh tokens from lesson 27 when a password is reset.", "Change the OTP length to 8 digits and write a test for the new lock behaviour."),
    ...check("Unknown and known emails get the identical reply.", "A reset token cannot be used twice or after 15 minutes.", "The OTP locks after five wrong tries."),
  ], A('A token sent by email', [
    n('ask', 'User asks', 'forgot or verify', 0, 0, 'user'), n('mk', 'Make token', 'random, hash stored', 1, 0, 'tool'),
    n('mail', 'Email', 'link or code', 2, 0, 'cloud'), n('use', 'Use once', 'checks, expiry, delete', 3, 0, 'check'),
  ], [
    { say: 'The user asks to verify, reset or log in with a code. The reply is the same for any address.', on: ['ask'] },
    { say: 'The server creates a random token and stores only its hash and an expiry.', flow: ['ask>mk:request'] },
    { say: 'The plain token goes to the email address, not back in the HTTP reply.', flow: ['mk>mail:send'] },
    { say: 'When it comes back, the hash matches, the time is checked and the token is deleted.', flow: ['mail>use:token'] },
  ]), [
    faq('Why show the same message for unknown emails?', 'Different messages let an attacker discover which email addresses have accounts. One identical message hides that.'),
    faq('Why store a hash of the reset token?', 'If someone reads your database, they still cannot use the tokens, the same way a hashed password is protected.'),
    faq('Is a six-digit OTP safe?', 'Only with a short expiry, one use and a limit on wrong tries. Without a limit, all one million codes can be tried.'),
  ]),

  // ---------------------------------------------------------------- 29
  les(S, 'cookies-sessions-and-sign-in-with-google-oauth', 'Cookies, Sessions and Sign In with Google (OAuth)', 'Cookies, Sessions and Google Sign-In',
    'Understand cookies and server sessions, set secure cookie flags, compare sessions with JWT, and add Sign in with Google by verifying the ID token on the server.', [
    P("JWTs are not the only way to remember a user. Many sites, including big ones, use **sessions**, which are older, simple and very solid. You also meet **cookies** everywhere, and nearly every product wants a **Sign in with Google** button. This lesson explains how these fit together, with a tested session example and the server side of Google sign-in."),
    H("Cookies in one minute"),
    P("A **cookie** is a small piece of text that the server asks the browser to keep and to send back with every later request to the same site. The server sets it with a `Set-Cookie` header. Four flags decide how safe it is. **httpOnly** hides it from JavaScript on the page, so a script injected by an attacker cannot read it. **secure** sends it only over HTTPS. **sameSite** (`lax` or `strict`) stops the browser from sending it along with requests that start on other sites, which blocks most CSRF attacks. **maxAge** or **expires** says how long it lives."),
    H("A session in practice"),
    P("With sessions, the cookie holds only a random **session id**, and the real data lives on the server. When a request arrives, the server looks up the id and knows who the user is. Logging out is easy, because you delete the record. The example below goes a little further and signs the cookie, so that a client that changes the value is detected."),
    SETUP('express cookie-parser', ['Save the code as `sessions.js`. The test needs `npm install -D supertest`.']),
    C('js', code('a30-sessions.js')),
    C('js', code('a30.test.js')),
    P("The test logs in, reads the protected `/me` route using the cookie, logs out, and shows that the same cookie no longer works. Notice that the cookie is `httpOnly` and `sameSite`, and in production it must also be `secure`."),
    H("Sessions or JWT?"),
    L("**Sessions** are simple, easy to cancel, and work well for a website where the front end and the back end share a domain. They need shared storage, such as Redis or a database, once you run more than one server.", "**JWT** is handy when many separate services or mobile apps must check the user without a shared store. It is harder to cancel, which is why lesson 27 adds refresh tokens.", "Many teams use sessions for websites and JWT with refresh tokens for mobile apps and public APIs. Neither is wrong. State why you chose one."),
    N("The default in-memory session storage of many libraries is only for development. It loses everything when the server restarts and cannot be shared between servers. Use Redis or a database in production."),
    H("Sign in with Google"),
    P("Sign in with Google uses **OAuth 2.0** and **OpenID Connect**. You never see the user's Google password. The browser shows Google's button, Google asks the user to agree, and then gives the browser a signed **ID token**. The front end sends that token to your server. Your server must **verify** it, not just decode it: check the signature against Google's public keys, check that the audience is your own client ID, check that it has not expired, and check that `email_verified` is true. The `google-auth-library` package does these steps for you."),
    C('js', code('a30-google.js')),
    P("After verification, you look for a user with that Google id or email. If one exists, log them in. If not, create an account without a password. Then issue your own session or tokens, exactly as for a password login, so the rest of your app does not need to know which method was used. Link accounts by the **verified** email carefully: if you trust an unverified email, an attacker can claim somebody else's account."),
    PARTLY('Google sign-in, which needs a Google Cloud OAuth client and a real token,'),
    ...task("Add `secure: process.env.NODE_ENV === 'production'` to the cookie options.", "Make the session expire after 30 minutes of no activity.", "Write the route that receives the Google token, calls `verifyGoogleToken` and starts a session."),
    ...check("A changed cookie value is refused.", "Logging out makes the old cookie useless.", "You can say what `httpOnly`, `secure` and `sameSite` each protect against."),
  ], A('Cookie plus server memory', [
    n('login', 'Login', 'password or Google', 0, 0, 'user'), n('sess', 'Session record', 'id on the server', 1, 0, 'store'),
    n('ck', 'Signed cookie', 'httpOnly, sameSite', 2, 0, 'data'), n('req', 'Next request', 'cookie sent back', 3, 0, 'app'),
  ], [
    { say: 'A successful login, by password or by a verified Google token, starts a session.', on: ['login'] },
    { say: 'The server stores the data and creates a random session id.', flow: ['login>sess:create'] },
    { say: 'Only the id travels in a signed, httpOnly, sameSite cookie.', flow: ['sess>ck:Set-Cookie'] },
    { say: 'The browser sends it back, and the server looks up the record. Deleting the record is logout.', flow: ['ck>req:Cookie'] },
  ]), [
    faq('Can I use a session and JWT in the same app?', 'Yes. Many teams use sessions for the website and JWT with refresh tokens for the mobile app.'),
    faq('Do I get the user\'s Google password?', 'No. Google gives you a signed ID token that says who the user is, and your server verifies it.'),
    faq('Why must I verify the Google token on the server?', 'The front end can be bypassed. Only a server-side check of the signature, audience and expiry proves the token is real.'),
  ]),

  // ---------------------------------------------------------------- 30
  les(S, 'web-attacks-xss-csrf-nosql-injection-sanitisation-and-brute-force', 'Web Attacks: XSS, CSRF, NoSQL Injection, Sanitisation and Brute Force', 'XSS, CSRF, NoSQL Injection and Brute Force',
    'Learn how XSS, CSRF, NoSQL injection and brute force work, and defend against each in Express with escaping, a CSRF token, key stripping and lockouts.', [
    P("Attackers do not need to be clever to break most web apps. They try the same few well-known tricks on thousands of sites, and the sites that did not prepare lose. The good news is that the defence against each trick is also well known. This lesson explains four common attacks in plain words, shows a small defence for each, and tests every one. It is for defence only: the examples show how to stop attacks on your own code."),
    H("1. Cross-site scripting (XSS)"),
    P("**XSS** happens when your site shows text that a user typed, and the browser treats it as code. If a comment contains a script tag and you place it into a page unchanged, the script runs in every visitor's browser, and it can steal sessions or perform actions as them. The defence is to **escape output**: turn the characters that have a special meaning in HTML, such as `<`, `>`, `&` and quotes, into harmless entities. Modern front-end frameworks such as React do this by default. The danger returns when you build HTML strings yourself, or when you use features with names like `dangerouslySetInnerHTML` or `innerHTML`. If you must show user HTML, clean it with a library such as DOMPurify."),
    H("2. Cross-site request forgery (CSRF)"),
    P("**CSRF** works because browsers attach cookies automatically. If you are logged in to your bank in one tab and visit a bad page in another, the bad page can make your browser send a request to the bank, and the cookie goes along. The defences are: `sameSite` cookies, which already stop most cases, and a **CSRF token**. In the *double-submit cookie* method the server sets a random value in a cookie and requires the same value in a header. A page on another site can make the browser send the cookie, but it cannot read it, so it cannot copy it into the header. APIs that use an `Authorization` header with a token instead of cookies are not exposed to CSRF in the same way."),
    H("3. NoSQL injection"),
    P("With MongoDB, an attacker does not need SQL. If your login code is `User.findOne({ email: req.body.email, password: req.body.password })` and the client sends JSON such as `{\"email\": \"a@b.com\", \"password\": {\"$ne\": null}}`, the query asks for a user whose password is *not null*, and the check passes without knowing the password. The defence is to never pass raw input into a query. Validate the type, since an email must be a string, with Zod from lesson 26, and strip keys that start with `$` or contain a dot."),
    H("4. Brute force"),
    P("Automated tools can try thousands of passwords per minute. Defences are: a slow password hash, bcrypt or Argon2, which makes every guess expensive; **rate limiting**, such as the `express-rate-limit` package; and a **lockout** that counts failures per account and per address, and pauses further tries for a time. Be careful with lockouts: an attacker can lock out a real user on purpose, so a temporary pause is kinder than a permanent block."),
    SETUP('express', ['Save the code as `defences.js`. The test needs `npm install -D supertest`.']),
    C('js', code('sec31-defences.js')),
    C('js', code('sec31.test.js')),
    C('text', `ok 1 - xss escaping
ok 2 - operator injection is removed
ok 3 - csrf double-submit cookie
ok 4 - brute force lock`),
    P("In the CSRF test, three requests are made. One carries the cookie but not the header, and gets **403**. One carries both, and passes. One comes from a client that has no cookie, as a hostile site would, and gets **403**. The brute-force test makes five failures, sees the lock, and then moves the fake clock past the lock time to see the account unlock."),
    N("These small helpers show the idea. For production, also use proven libraries: `helmet` for headers, `express-rate-limit` for limits, `csrf-csrf` or a similar maintained package for CSRF, and DOMPurify for user HTML. Check their current documentation."),
    L("Escape output, and validate input.", "Never put raw request data into a database query.", "Use `sameSite` cookies and a CSRF token wherever cookies authenticate.", "Slow down and limit login attempts."),
    RAN,
    ...task("Write a test that sends a body with `{ \"$gt\": \"\" }` as a password and confirm that it is cleaned.", "Add `express-rate-limit` to the login route, five attempts per 15 minutes.", "Try printing user text into an HTML string without escaping, and then fix it."),
    ...check("All four tests pass.", "You can describe each attack in one sentence.", "You can say why a CSRF token cannot be copied by another site."),
  ], A('Four attacks, four defences', [
    n('xss', 'XSS', 'escape output', 0, 0, 'check'), n('csrf', 'CSRF', 'sameSite + token', 1, 0, 'check'),
    n('inj', 'Injection', 'validate, strip $', 2, 0, 'check'), n('bf', 'Brute force', 'slow hash, lockout', 3, 0, 'check'),
  ], [
    { say: 'XSS: user text becomes code in the page. Escape it on the way out.', on: ['xss'] },
    { say: 'CSRF: the browser sends cookies for you. A secret header the attacker cannot read stops it.', flow: ['xss>csrf:next'] },
    { say: 'Injection: query operators hide in the JSON. Check the types and remove $ keys.', flow: ['csrf>inj:next'] },
    { say: 'Brute force: many guesses. Hash slowly, limit requests and pause after repeated failures.', flow: ['inj>bf:next'] },
  ]), [
    faq('Does React protect me from XSS?', 'It escapes text by default. You are exposed again if you use dangerouslySetInnerHTML or build HTML strings yourself.'),
    faq('Do I need CSRF protection for a token API?', 'If authentication uses an Authorization header that the browser does not attach by itself, CSRF is not the same problem. If it uses cookies, yes.'),
    faq('Is MongoDB safe from injection?', 'Not automatically. Raw request data in a query can carry operators such as $ne, so validate types and strip operator keys.'),
  ]),

  // ---------------------------------------------------------------- 31
  les(S, 'production-security-secrets-https-jwt-best-practices-helmet-and-audits', 'Production Security: Secrets, HTTPS, JWT Best Practices, Helmet and Audits', 'Production Security: Secrets, HTTPS, Helmet',
    'Harden an Express app: validate secrets at start, set secure headers with Helmet, use HTTPS, follow JWT best practices and audit your dependencies.', [
    P("The last lesson was about attacks on your logic. This lesson is about the **settings and habits** around your code that decide whether an attack succeeds: where secrets live, whether traffic is encrypted, which headers you send, and whether the packages you installed have known holes. None of it is difficult, and all of it is routinely skipped. A short checklist done once is worth more than any clever code."),
    H("Secrets and environment variables"),
    L("Keep secrets such as database passwords, JWT keys and API keys **out of Git**. Put them in environment variables, loaded from a `.env` file in development, and make sure `.env` is listed in `.gitignore`.", "If a secret is ever committed, treat it as stolen, even if you delete it afterwards, because Git keeps history. Change it at the provider.", "Use a different secret in each environment, and make them long and random.", "On a server, set them in the host's settings or a secrets manager rather than a file in the project."),
    P("Read your configuration **once, at start**, and check it. The example below uses Zod to require a `JWT_SECRET` of at least 32 characters, accepts only three values for `NODE_ENV`, and turns the port into a number. If something is wrong the app refuses to start with a clear message, which is far better than starting and failing at three in the morning."),
    SETUP('express helmet jsonwebtoken zod', ['Save the code as `hardening.js`. The test needs `npm install -D supertest`.']),
    C('js', code('sec32-hardening.js')),
    H("JWT best practices"),
    P("The two functions `signToken` and `verifyToken` hold the rules. Fix the **algorithm** in both places. Some older attacks worked because a library accepted whatever algorithm the token claimed, including `none`, which means no signature at all. Set an **issuer** and an **audience** so a token made for another service is not accepted by yours. Use a **short expiry**. Keep the payload small and never put secrets in it, because a JWT is signed but **not encrypted**; anyone can read it. The test proves that a token with the `none` algorithm, a token with the wrong audience and a token signed with another secret are all refused."),
    C('js', code('sec32.test.js')),
    C('text', `ok 1 - helmet headers and no x-powered-by
ok 2 - environment is checked at start
ok 3 - token checks: alg none, wrong audience and wrong secret are refused`),
    H("Helmet: security headers in one line"),
    P("**Helmet** is a middleware that sets a group of HTTP headers that tell browsers to behave more safely. Among them are `Strict-Transport-Security`, which asks browsers to use HTTPS only, `X-Content-Type-Options`, which stops a browser from guessing file types, and a basic `Content-Security-Policy`, which limits where scripts may load from. You add it with `app.use(helmet())`. If your front end loads scripts or images from other sites, you may need to adjust the policy, so test the pages after turning it on."),
    H("HTTPS and CORS"),
    P("**HTTPS** encrypts the traffic between the browser and your server, so passwords and tokens cannot be read on the way. Production sites must use it. Lesson 42 shows how to get a free certificate with Let's Encrypt. **CORS** is a different matter: it controls which *websites* may call your API from a browser. Do not use `origin: '*'` together with cookies. List the exact origins that you trust."),
    H("Dependencies"),
    P("Your app contains thousands of packages that you did not write. Run `npm audit` regularly to list known problems, update packages in small steps, commit `package-lock.json`, and use `npm ci` in builds so that exactly the locked versions are installed. Remove packages that you do not use. Turn on Dependabot or a similar service to receive update pull requests. A package that is no longer maintained is a risk even when it has no known bug today."),
    N("Treat this lesson as a starting checklist, not a complete security programme. Large or regulated systems need reviews, monitoring and testing by security specialists."),
    RAN,
    ...task("Start the app without `JWT_SECRET` and read the error.", "Run `npm audit` in your project and read the report.", "Add `helmet()` to an existing app and check the response headers in your browser's network tab."),
    ...check("The app refuses to start with a missing or short secret.", "A token with the wrong audience is refused.", "Your `.env` file is in `.gitignore`."),
  ], A('A production checklist', [
    n('env', 'Secrets', 'env vars, validated', 0, 0, 'store'), n('tok', 'JWT rules', 'alg, issuer, audience', 1, 0, 'check'),
    n('hdr', 'Helmet + HTTPS', 'safe headers, TLS', 2, 0, 'tool'), n('dep', 'Dependencies', 'npm audit, lockfile', 3, 0, 'app'),
  ], [
    { say: 'Secrets live in the environment, are never committed and are checked at start.', on: ['env'] },
    { say: 'Tokens are signed and verified with a fixed algorithm, issuer, audience and a short life.', flow: ['env>tok:keys'] },
    { say: 'Helmet sets safe headers and HTTPS encrypts everything in transit.', flow: ['tok>hdr:responses'] },
    { say: 'Packages are audited and locked, so known holes are fixed before an attacker finds them.', flow: ['hdr>dep:updates'] },
  ]), [
    faq('Is a JWT encrypted?', 'No. It is signed, so it cannot be changed, but anyone can read its contents. Never put secrets in it.'),
    faq('I committed a secret by mistake. What now?', 'Treat it as public. Change it at the provider first, then remove it from the code. Deleting it from Git history alone is not enough.'),
    faq('Does Helmet make my app secure?', 'It removes some easy risks by setting headers. It does not replace validation, authentication and updates.'),
  ]),
];
