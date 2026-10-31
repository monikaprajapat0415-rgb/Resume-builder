// Angular interview questions, part 4: performance, server-side rendering, testing, tooling and architecture.
const A = (category, level, question, modelAnswer, tips = []) => ({ category, level, question, modelAnswer, tips, tags: ['angular'] });
const P = 'Angular performance and SSR', T = 'Angular testing, tooling and architecture';

export const part4 = [
  A(P, 'fresher', 'Why is track important in @for (or trackBy in *ngFor)?',
`When a list changes, Angular needs to know which items are the same so it can reuse their DOM elements instead of destroying and recreating all of them. The track expression gives each item a stable identity, usually its id: @for (user of users; track user.id).

Without a good track value, a refreshed list can lose focus, scroll position and input state, and can be slow. Never track by index for lists that can be reordered or filtered, unless the items truly have no id.`),
  A(P, 'both', 'What are the main ways to improve Angular app performance?',
`Load less: lazy load routes, use @defer for heavy parts, remove unused imports and libraries, and optimise images (NgOptimizedImage, correct sizes, modern formats). Do less work: OnPush or signals, track in lists, pure pipes instead of methods called in templates, and avoid heavy calculations in templates.

Check the network: cache data, avoid duplicate requests. Measure first with the Angular DevTools profiler, Lighthouse and the build's bundle report, and fix the biggest problems rather than guessing.`),
  A(P, 'both', 'Why is calling a method in a template expression a performance problem?',
`Templates are checked often. A method call such as {{ getTotal() }} runs every time change detection checks that binding, even when nothing relevant changed, so an expensive method runs again and again.

Better options: compute the value once into a signal or computed, use a pure pipe, or store the result in a variable when the data changes. Simple getters of a signal, such as total(), are fine because signals cache computed results.`),
  A(P, 'both', 'What is NgOptimizedImage and what does it give you?',
`NgOptimizedImage is a directive (ngSrc) that applies image best practices: it warns when width and height are missing, which prevents layout shift, lazy loads images by default, supports a priority attribute for the main image (LCP), generates srcset for responsive sizes when you use an image loader, and checks that priority images have a preconnect hint.

It helps Core Web Vitals scores. Use priority only for the one or two images visible at the top of the page.`),
  A(P, 'both', 'What is server-side rendering (SSR), and why would you use it?',
`With SSR, a Node server renders the Angular app to HTML for the first request, so the browser and search engines receive real content immediately, and then Angular takes over in the browser (hydration). Benefits: faster first paint, better SEO and sharing previews. Costs: a server to run, more complexity, and code must not use browser-only objects such as window or localStorage on the server without checks.

Pages behind a login usually do not need SSR. Public content pages do.`,
    ['Mention that you guard browser-only code.']),
  A(P, 'both', 'What is hydration in Angular?',
`Hydration is the step where the browser reuses the HTML that the server rendered and attaches Angular to it, instead of throwing it away and rendering again. It avoids flicker and repeated work and improves load metrics.

It works only if the server and browser produce the same DOM. Problems usually come from direct DOM changes or invalid HTML. Event replay can capture user clicks that happen before hydration finishes.`),
  A(P, 'experienced', 'What is the difference between SSR, SSG (prerendering) and CSR, and how do you choose?',
`CSR renders everything in the browser: simplest to host, weaker for SEO and first load. SSR renders on the server for each request: fresh content, but needs a server and is slower per request. SSG, or prerendering, renders pages to HTML at build time: very fast and cheap to host, but content is only as fresh as the last build.

Choose per page: static prerendering for marketing and docs, SSR for frequently changing public pages, CSR for dashboards behind login. Angular lets you mix these per route in newer versions.`),
  A(P, 'experienced', 'How do you analyse and reduce the bundle size?',
`Build for production and look at the size report. Use a bundle analyser (for example source-map-explorer or the esbuild stats file) to see what takes space. Common wins: lazy load routes, import only what you use (specific lodash functions, not the whole library), replace heavy libraries with lighter ones, remove unused code, and use @defer for large widgets.

Set budgets in angular.json so the build warns or fails when bundles grow. Check again after each large dependency is added.`),
  A(P, 'experienced', 'How do you find and fix a slow Angular screen?',
`Reproduce it in a production-like build, then profile. The Angular DevTools profiler shows which components are checked and for how long. The browser Performance tab shows scripting, rendering and layout costs. Network tab shows slow or repeated calls.

Typical fixes: OnPush and signals, track in lists, virtual scrolling (CDK) for very long lists, debouncing input, moving heavy work out of templates, memoising calculations, and reducing request waterfalls. Measure again to confirm that the change helped.`),
  A(P, 'experienced', 'What is virtual scrolling and when should you use it?',
`Virtual scrolling (from the Angular CDK) renders only the items visible in the viewport plus a small buffer, and reuses elements as the user scrolls. This keeps the DOM small, so lists with thousands of rows stay fast.

Use it for very long lists or tables. Drawbacks: items usually need a known or estimated height, browser find-in-page cannot find rows that are not rendered, and accessibility needs care. For lists of a few hundred items, normal rendering with track is simpler.`),
  A(T, 'fresher', 'How do you write a unit test for a component or a service in Angular?',
`Angular projects use a test runner such as Karma with Jasmine in older setups, or Jest or Vitest in newer ones. For a service with no dependencies you can create it with new or through TestBed and call its methods. For a component, TestBed.configureTestingModule configures imports and providers, createComponent builds it, and you check the rendered DOM and the component state.

Replace real dependencies such as HttpClient with fakes: provideHttpClientTesting with HttpTestingController lets you control responses.`),
  A(T, 'fresher', 'What is the difference between unit, integration and end-to-end tests?',
`A unit test checks one small piece, such as a function or service, in isolation. An integration test checks that several parts work together, for example a component with its template and a fake service. An end-to-end (e2e) test drives the real app in a browser, clicking and typing like a user, with tools such as Playwright or Cypress.

Have many fast unit tests, fewer integration tests, and a small set of e2e tests for key journeys such as login and checkout.`),
  A(T, 'both', 'How do you test a component that calls an API?',
`Do not call the real API. Provide a fake service or use HttpTestingController: trigger the component, expect a request to the right URL with the right method, then flush a fake response and check that the template shows the data. Also test the loading and error states.

With signals, set inputs through the component ref and run change detection with fixture.detectChanges() (or await fixture.whenStable()) before you check the DOM.`),
  A(T, 'both', 'How do you test route guards, pipes and directives?',
`A pipe is a class with a transform method, so test it directly with different inputs. A functional guard can be run inside TestBed.runInInjectionContext with fake services, and you check the returned value or UrlTree. A directive is tested by creating a small host component that uses it and checking the DOM and events.

Small focused tests give clear failures and run fast.`),
  A(T, 'both', 'What does ng lint and a formatter give you, and what other tooling do Angular teams use?',
`A linter (ESLint with angular-eslint) finds mistakes and enforces rules, for example unused variables or missing track. A formatter such as Prettier keeps code style consistent. Teams add pre-commit hooks, CI pipelines that run lint, tests and build, and tools such as Compodoc or Storybook for documentation and component demos.

Consistent tooling reduces review arguments and catches problems before they reach production.`),
  A(T, 'both', 'How do you handle environment-specific settings in Angular?',
`Keep settings, such as the API base URL, out of components. Common approaches: environment files replaced at build time with fileReplacements, a configuration loaded at startup (for example from a JSON file fetched with provideAppInitializer), or an InjectionToken that holds the config.

Never put secrets such as API keys or private tokens in front-end code, because anything in the bundle can be read by users. Keep secrets on the server.`),
  A(T, 'experienced', 'How would you structure a large Angular application?',
`Group code by feature, not by type: each feature folder has its own components, services, routes and models, and is lazy loaded. Keep a small core area for app-wide services (auth, interceptors, config) and a shared area for reusable, dumb UI components, pipes and directives that have no feature knowledge.

Rules that scale: smart (container) components fetch data and dumb (presentational) components take inputs and emit outputs; features do not import from each other directly; and public APIs of a feature are exposed through an index file. For very large systems, tools such as Nx help enforce boundaries and speed builds.`),
  A(T, 'experienced', 'How do you handle security in an Angular app (XSS, tokens, CSRF)?',
`Angular escapes values in templates by default, which prevents most cross-site scripting. Avoid bypassSecurityTrustHtml and similar methods unless you sanitise the content yourself, and never build HTML strings from user input.

For authentication, prefer HttpOnly secure cookies where possible, or keep tokens in memory and short-lived, because tokens in local storage can be stolen by an XSS bug. Use HTTPS, validate everything on the server, and protect cookie-based sessions against CSRF (Angular supports an XSRF token header). Keep dependencies updated.`),
  A(T, 'experienced', 'How do you upgrade Angular to a new major version safely?',
`Read the update guide for your versions, and update one major version at a time with ng update, which runs automatic migrations: ng update @angular/core @angular/cli. Commit a clean state first, run the build and tests after each step, and check third-party libraries for compatible versions.

Fix deprecations when they appear, since removed features can cause failures in the next version. Keep a regular upgrade habit, because small, frequent upgrades are easier than one big jump.`),
  A(T, 'experienced', 'What is the difference between a micro frontend approach and a monolithic Angular app, and when would you use micro frontends?',
`A monolithic Angular app is one codebase built and deployed together. Micro frontends split a large product into independently built and deployed apps that are combined in the browser, for example with Module Federation or Native Federation.

They help when many teams need to release independently, but they bring cost: shared dependencies and versions, consistent design, routing and state between apps, and more build complexity. For most teams, a well-structured monolith with lazy-loaded features and clear boundaries is simpler and enough.`),
];
