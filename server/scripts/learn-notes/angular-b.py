N = [
# 42
["One service can cover every action your API supports.", "`HttpParams` or `{ params: { page: 2 } }` for query parameters. Headers for tokens and content type.", "PUT replaces a whole item. PATCH changes only some fields. DELETE removes an item by id.", "Each call returns an observable of the result."],
# 43
["An observable = a stream of values over time (clicks, HTTP results).", "Operators are small steps added with `pipe()`: `map` changes each value, `filter` keeps some.", "Nothing runs until you `subscribe`.", "Unsubscribe when done, or let the `async` pipe do it."],
# 44
["`of(1, 2, 3)` emits the values you give, then completes.", "`from([..])` turns an array, string or promise into a stream.", "`fromEvent(el, 'click')` turns browser events into a stream.", "Subscribe to receive the values."],
# 45
["`skip(n)` ignores the first values. `take(n)` stops after n values.", "`first()` and `last()` pick one value.", "`takeUntil` and `takeWhile` stop on a condition.", "`tap` looks at values, for logging, without changing them.", "`takeUntil(destroy$)` is a common way to clean up."],
# 46
["`debounceTime(400)` waits until typing stops: one API call instead of one per key.", "`scan` keeps a running result and emits it for every value, like a live total.", "`reduce` emits only the final result, when the stream completes.", "`delay` and `delayWhen` shift values later in time."],
# 47
["An error ends an observable unless you handle it.", "`retry(3)` tries again a set number of times.", "`catchError` lets you recover: return a fallback with `of(...)`, or `throwError` to pass on a clearer error.", "`finalize` runs at the end either way: a good place to hide a spinner."],
# 48
["A subject is an observable you can also push values into with `next()`.", "`BehaviorSubject` keeps the latest value, so new subscribers get it at once.", "`ReplaySubject` replays several past values.", "`AsyncSubject` gives only the last value, on completion.", "Prefer signals for simple shared state in new code."],
# 49
["A test: set up, do something, check the result.", "`TestBed` creates the component with the same setup the app uses.", "Change inputs or click a button, then let Angular update with `fixture.detectChanges()`.", "Use `expect` to check text or values. Vitest runs the file.", "For services, mock the HTTP calls."],
# 50
["Accessibility = people with different needs can use your app.", "Use the right HTML: real buttons, links, labels and headings.", "ARIA only where plain HTML cannot say it.", "Everything must work with the keyboard, with a visible focus.", "Manage focus when the page changes so screen reader users know where they are."],
# 51
["A production build minifies and removes unused code: `ng build`.", "Lazy loading keeps the first download small.", "Optimise images. Use `track` in lists.", "Check bundle sizes and measure with Lighthouse."],
# 52
["Task manager: add form, list, toggle and delete, filter (all, active, done).", "A service keeps all tasks in one signal.", "The list renders with `@for`.", "A computed signal gives the filtered list."],
# 53
["Employee dashboard: list, detail page and edit form.", "A service talks to the API for all employee data.", "The table page has search and sorting.", "A reactive form with validators adds or edits an employee.", "Routes connect the pages. A guard can protect the edit screens."],
# 54
["Capstone: login with a guard, token sent with requests.", "Courses load from an API on lazy routes.", "A lesson page reads its id from the route.", "Progress is kept in signals and saved back to the API."],
# 55
["`ng build` creates the production files in `dist`.", "Upload `dist` to Netlify, Firebase Hosting or your own Nginx server.", "The host must send `index.html` for unknown paths, or refreshing a deep link gives a 404.", "Nginx: `try_files $uri /index.html;`."],
# 56
["`linkedSignal` = a writable signal derived from another signal.", "When the source changes it resets to a new default. You can still `set` it yourself.", "`effect()` reruns when the signals it reads change.", "Use effect for side effects, such as saving to storage. Not for computing values."],
# 57
["`httpResource` loads data from an API and exposes it as signals.", "It watches a request signal, such as an id, and sends a new request when it changes.", "Results: `value()`, `isLoading()`, `error()`.", "`resource()` works the same way for any async source.", "Check the current docs, these APIs are newer and may change."],
# 58
["A directive adds behaviour to an existing element. It has no template.", "The selector is an attribute: `appHighlight`.", "The `host` property binds classes and styles and listens to events on that element.", "Reuse it on any element."],
# 59
["Content projection: a parent puts its own HTML inside a component.", "The component marks a spot with `<ng-content />`.", "The parent writes content between the component tags.", "`ng-template` holds markup that is drawn only when `ngTemplateOutlet` renders it."],
# 60
["Dynamic component = chosen at runtime, such as in a dialog.", "`ViewContainerRef.createComponent(MyComponent)` creates and places it.", "Host directives let a component apply a directive's behaviour to itself, with no extra template code."],
# 61
["`ElementRef` gives a handle on the element itself.", "Prefer `Renderer2` to change it: safer and portable.", "`@HostBinding` sets host properties. `@HostListener` listens for host events.", "These decorators are the older style. Newer code uses the `host` metadata."],
# 62
["An injection token names a value that is not a class, such as a URL: `new InjectionToken<string>('API_URL')`.", "A provider says which value the token gets: `{ provide: API_URL, useValue: '...' }`.", "A service does `inject(API_URL)`.", "In tests, provide a different value or a fake class. The code does not change."],
# 63
["An interceptor sits between `HttpClient` and the network and sees every request and response.", "Clone the request to add an auth token header.", "Handle errors in one place, such as sending the user to login on a 401.", "A counter in an interceptor can drive one global loading bar.", "Register with `provideHttpClient(withInterceptors([...]))`."],
# 64
["As an app grows, the folder layout matters more than any single file.", "Group code by feature: orders, users, each with its own components and services.", "`core` = app-wide services. `shared` = reusable components and pipes.", "Features should not reach into each other. Share through core or shared."],
# 65
["Settings that differ between development and production go in configuration.", "Provide them through `app.config.ts`, for example with an injection token.", "`provideAppInitializer` runs a function before the app starts, such as loading remote settings.", "Anything in a browser app is public. Never put secrets in it."],
# 66
["Provide a custom `ErrorHandler` to catch errors nobody else caught.", "Send details to a logging service so you can fix them.", "Show the user a short, friendly message, not a stack trace.", "Handle expected HTTP errors close to the request. Let the global handler catch the rest."],
# 67
["Older Angular apps group code into NgModules, with module routing and lazy modules.", "New code uses standalone components that list their own `imports`.", "Migration schematics convert modules to standalone step by step.", "Same job, less boilerplate."],
# 68
["`ControlValueAccessor` lets your component act like a form input, for example a star rating.", "`writeValue` receives the value from the form so the control can show it.", "Call `onChange` to send a new value back. Call `onTouched` when touched.", "Register it with the `NG_VALUE_ACCESSOR` provider.", "The form then treats it like any other control, with validation."],
# 69
["A `FormArray` holds a list of controls, such as several phone numbers. It lives inside a `FormGroup`.", "`push` adds a control. `removeAt(index)` removes one.", "The template loops over the controls with `@for`.", "Rows follow the array."],
# 70
["Signal forms = a newer way to build forms based on signals.", "Start with a signal holding your data as the model. The form is created from the model.", "Each field exposes its state as signals: value, valid, touched.", "This API is still evolving. Check the current docs before relying on it."],
# 71
["A store = a service that keeps state in a private signal.", "Components never change the state directly. They call methods on the store.", "The store exposes read-only `computed` signals as selectors.", "Views read the selectors and update automatically."],
# 72
["`combineLatest` emits when any stream changes, with the latest value of each.", "`switchMap` starts a request for that value and cancels the previous one if still running.", "`share` or `shareReplay` lets many subscribers use one request.", "`concatMap` keeps order. `mergeMap` runs in parallel."],
# 73
["Child routes appear inside a layout's `<router-outlet />`.", "A resolver fetches data before the page opens, so it never shows empty.", "Preloading downloads lazy routes in the background after the first load.", "View transitions can animate between pages when the browser supports it."],
# 74
["Change detection = how Angular finds out what to update on screen.", "With zone.js, Angular is told after any async task and then checks components.", "Signals tell Angular exactly which view depends on what, so less work is needed.", "Zoneless apps do not need zone.js: signals and events trigger updates.", "`OnPush` checks a component only when its inputs, events or signals change."],
# 75
["A normal Angular app sends an almost empty page and builds the content in the browser.", "SSR: the server runs Angular and sends full HTML, so people and search engines see content at once.", "Hydration attaches Angular to the existing HTML so it becomes interactive without redrawing.", "Add SSR with `ng add @angular/ssr`."],
# 76
["Set a unique title for every route with the `Title` service.", "Use the `Meta` service for the description, and a canonical link.", "SSR puts all of this in the HTML crawlers receive.", "Lazy-load images below the fold and give them sizes."],
# 77
["Test a guard with `runInInjectionContext` and check what it returns.", "Test an interceptor with `HttpTestingController`: see the request, send a fake response.", "The router testing harness navigates and lets you check which component showed.", "`fixture.componentRef.setInput('name', value)` tests component inputs."],
# 78
["An end-to-end test uses your app the way a user does.", "Playwright opens a real browser, clicks and types, finding things by role and label.", "Then it checks what appears on the screen.", "Keep a few tests for the most important journeys: sign-up, checkout."],
# 79
["Treat all input as untrusted.", "Angular escapes values in templates, which protects against XSS. Avoid `bypassSecurityTrust...` unless you really must.", "HttpOnly cookies are safer than local storage for tokens, but cookies need CSRF protection.", "Set security headers such as `Content-Security-Policy` on your server.", "The server must check every request."],
# 80
["CI/CD runs your checks and deployment for you, every time.", "A push starts the workflow: install, lint, test, build, deploy.", "If a step fails, the later steps do not run.", "Keep secrets in GitHub secrets, never in the repository."],
# 81
["404 on refresh: the server does not know Angular routes. Send `index.html` for unknown paths.", "`ExpressionChangedAfterItHasBeenChecked`: a value changed after Angular checked it. Move the change earlier or use signals.", "`EventTarget` typing errors: cast to the element you expect.", "SSL on localhost: create and trust a local certificate for the dev server.", "Read the error message, find the cause, fix that."],
# 82
["A bundler turns many source files into files a browser can load.", "Early Angular used SystemJS, then Webpack for many years.", "Modern Angular builds with esbuild, and the dev server uses Vite. Both are much faster.", "You still run `ng build` and `ng serve`."],
# 83
["Plan the architecture first: features, routes, clear boundaries.", "Add state with signals and load data over HTTP, with errors handled.", "Test it. Check accessibility and security.", "Add SSR and performance work. Let CI/CD ship it."],
]
