// Angular interview questions, part 3: routing, forms, HTTP, RxJS and state.
const A = (category, level, question, modelAnswer, tips = []) => ({ category, level, question, modelAnswer, tips, tags: ['angular'] });
const R = 'Angular routing', F = 'Angular forms', H = 'Angular HTTP, RxJS and state';

export const part3 = [
  A(R, 'fresher', 'How does routing work in Angular?',
`The router maps URL paths to components. You define a routes array, for example { path: 'users', component: UsersPage }, give it to the app with provideRouter(routes), and put <router-outlet /> in a template where the matched component should appear. Links use routerLink, and code can navigate with the Router service.

When the URL changes, Angular finds the matching route and shows its component without reloading the page.`),
  A(R, 'fresher', 'What is the difference between routerLink and href?',
`A normal href makes the browser load a new page from the server, which restarts the app. routerLink tells the Angular router to change the route inside the running app, so it is fast and keeps state. routerLinkActive adds a class to the link of the current page, which is useful for menus.

Use routerLink for links inside your app, and href for external sites.`),
  A(R, 'fresher', 'How do you read route parameters and query parameters?',
`For a route like users/:id, you can read the id from ActivatedRoute (paramMap) or, with withComponentInputBinding enabled, receive it directly as a component input. Query parameters (?page=2) are read from queryParamMap in the same way.

Remember that if the user goes from users/1 to users/2, Angular reuses the component, so react to changes through the observable or input instead of reading the value only once.`,
    ['Mention the reuse trap.']),
  A(R, 'both', 'What is lazy loading, and how do you do it with routes?',
`Lazy loading means a part of the app is downloaded only when the user first needs it. Use loadComponent: () => import('./admin').then(m => m.AdminPage) for a single standalone component, or loadChildren for a group of routes.

The benefit is a smaller first bundle and faster start. Keep the home and main screens in the initial bundle, and lazy load rarely used areas such as admin screens or reports.`),
  A(R, 'both', 'What are route guards? Give examples.',
`A guard decides whether navigation is allowed. Common types: canActivate (can the user enter this route?), canActivateChild, canDeactivate (warn about unsaved changes when leaving) and canMatch (should this route be considered at all, useful for role-based lazy routes).

In current Angular they are plain functions, using inject() to reach services: an auth guard returns true, or a UrlTree that redirects to the login page. Remember that guards protect the screen only. The server must still check permissions.`,
    ['Say that the real security is on the server.']),
  A(R, 'both', 'What is a resolver, and when would you use one?',
`A resolver is a function that fetches data before a route is activated, so the component starts with the data ready. It is configured in the route's resolve property and the result is available through route data or input binding.

It avoids showing a half-empty page, but it also delays navigation until the data arrives. For slow calls, it is often better to show the page at once with a loading state. Use resolvers when the page is meaningless without the data or when you want to redirect on a missing item.`),
  A(R, 'both', 'How do child routes and nested router outlets work?',
`A route can have a children array. The parent component contains its own <router-outlet />, and the matched child component is shown inside it. This is how you build layouts: a dashboard component with a menu and an outlet, and child routes for each section.

Paths of children are relative to the parent path, so the final URL is parent plus child.`),
  A(R, 'both', 'How do you handle 404 pages and redirects?',
`Add a wildcard route at the end: { path: '**', component: NotFoundPage }. Routes are matched in order, so it must be last. For redirects use { path: '', redirectTo: 'home', pathMatch: 'full' }, where pathMatch full makes the redirect apply only to the empty path.

For missing data (such as a user id that does not exist), show a not-found state, and for server-rendered apps make sure the server also returns a real 404 status.`),
  A(R, 'experienced', 'What are the preloading strategies for lazy routes?',
`Lazy routes load on demand, which can cause a delay at the moment of navigation. Preloading downloads them in the background after the app starts. PreloadAllModules loads all lazy routes; a custom strategy can preload only the routes you mark, for example with data: { preload: true }.

It balances a small first load with fast navigation later. On slow or metered networks, preloading everything can waste data, so be selective.`),
  A(R, 'experienced', 'How would you implement role-based access in an Angular app?',
`Store the user's roles after login (from the server response or token) in an auth service, ideally with a signal. Use a guard with canActivate or canMatch that checks the required roles in route data and redirects when missing. Hide menu items and buttons the user cannot use.

All of this is for user experience only. Every API request must be authorised on the server, because anyone can change front-end code. Handle expiry and refresh: when the server answers 401, send the user to login.`,
    ['Always separate UX checks from real security.']),
  A(F, 'fresher', 'What is the difference between template-driven and reactive forms?',
`Template-driven forms are built mostly in the template with ngModel and are simple for small forms. Reactive forms are built in the component class with FormGroup, FormControl and FormBuilder, and the template binds to them. They are more explicit, easier to test and better for complex or dynamic forms.

Most teams choose reactive forms for real applications. Both give validation and state such as touched, dirty and valid.`),
  A(F, 'fresher', 'How do you add validation to a reactive form?',
`Give each control validators when you create it: new FormControl('', [Validators.required, Validators.email]). Built-in validators include required, minLength, maxLength, min, max, pattern and email. In the template, check the control's state, for example show the error only when it is invalid and touched.

You can also disable the submit button while the form is invalid, but always validate again on the server.`),
  A(F, 'both', 'How do you write a custom validator?',
`A validator is a function that receives a control and returns null when the value is valid, or an object describing the error when it is not: (control) => control.value.includes(' ') ? { noSpaces: true } : null. Add it to the control's validator list and show a message when control.hasError('noSpaces').

For rules involving two fields, such as password and confirm password, put the validator on the FormGroup so it can compare them.`),
  A(F, 'both', 'What are async validators and when do you need one?',
`An async validator returns an Observable or Promise, and is used for checks that need the server, such as "is this username taken?". While it runs the control status is pending.

To avoid a request on every key press, debounce with a timer and switchMap, or update only on blur (updateOn: 'blur'). Also handle errors: if the check fails because of the network, do not block the user forever.`),
  A(F, 'both', 'What are FormArray and dynamic forms?',
`A FormArray holds a list of controls or groups that can grow or shrink, such as several phone numbers or order lines. You add and remove items with push() and removeAt(), and loop over controls in the template with @for.

For forms built from configuration, you can create controls in code from a JSON-like definition. Keep keys stable and use track so Angular does not recreate every row when one changes.`),
  A(F, 'both', 'What is the difference between valueChanges and statusChanges, and how do you use them safely?',
`valueChanges is an Observable that emits whenever a control's value changes. statusChanges emits when validity status changes. They are useful for reacting to input, such as calling a search API as the user types.

Add debounceTime and distinctUntilChanged to avoid too many requests, and unsubscribe when the component is destroyed (takeUntilDestroyed is a convenient way). Forget this and you get leaks and duplicate calls.`),
  A(F, 'both', 'What do touched, dirty and pristine mean?',
`touched means the user has focused and left the control (blur). untouched is the opposite. dirty means the value has been changed by the user, and pristine means it has not.

Use them to decide when to show errors: showing "required" on a field before the user has touched it is annoying. A common rule is to show errors when the control is invalid and (touched or the form was submitted).`),
  A(F, 'experienced', 'How would you build a reusable custom form control?',
`Implement ControlValueAccessor in a component and register it with NG_VALUE_ACCESSOR. The interface has writeValue (the form gives your component a value), registerOnChange (you call it when the user changes the value), registerOnTouched and setDisabledState.

After that, your component works with ngModel, formControl and formControlName like a native input. Good examples: a star rating, a date picker wrapper or a tag input. Keep the component's inner state simple and make sure the touched state is reported on blur.`),
  A(F, 'experienced', 'What are typed forms, and why do they matter?',
`Since Angular 14, reactive forms are strongly typed: new FormControl<string>('') knows its value is a string (or null unless you use nonNullable). FormGroup values are typed from their controls, so form.value.email is checked by the compiler.

This catches mistakes such as misspelled control names, and makes code safer when refactoring. Use nonNullable controls or fb.nonNullable to avoid null in values, and use getRawValue() when disabled controls must be included.`),
  A(H, 'fresher', 'How do you call an API in Angular?',
`Provide the HTTP client with provideHttpClient() in the app configuration, inject HttpClient into a service, and call methods such as http.get<User[]>('/api/users'). It returns an Observable, so nothing is sent until someone subscribes (or the async pipe or toSignal does).

Put API calls in services, not in components, so they are reusable and testable. Handle loading and error states in the UI.`),
  A(H, 'fresher', 'What is an Observable, and how is it different from a Promise?',
`An Observable is a stream of values over time that you subscribe to. A Promise gives one value, once, and starts immediately. An Observable can emit many values, is lazy (nothing happens until you subscribe), can be cancelled by unsubscribing, and has many operators to transform streams.

HTTP calls in Angular return Observables that emit one value and complete, which is why they are easy to use with the async pipe.`),
  A(H, 'fresher', 'What is the difference between subscribe and the async pipe?',
`With subscribe, you receive values in code and must store them and unsubscribe yourself when the component is destroyed (unless the stream completes). With the async pipe in the template, Angular subscribes, shows the latest value and unsubscribes automatically.

Prefer the async pipe or toSignal for data shown on screen. Use subscribe only for side effects, and then use takeUntilDestroyed to clean up.`),
  A(H, 'both', 'What are common RxJS operators you use, and what do they do?',
`map transforms each value, filter drops values, tap runs a side effect without changing values, debounceTime waits for a pause, distinctUntilChanged skips repeated values, catchError handles errors, combineLatest and forkJoin combine streams, and switchMap, mergeMap, concatMap and exhaustMap map a value to another Observable in different ways.

Show that you know when to use each rather than listing them: for example switchMap for search as you type, because it cancels the previous request.`),
  A(H, 'both', 'Explain the difference between switchMap, mergeMap, concatMap and exhaustMap.',
`All four turn each incoming value into an inner Observable, but they differ in how they handle overlap. switchMap cancels the previous inner stream when a new value arrives (search as you type). mergeMap runs all inner streams at once (independent parallel requests). concatMap queues them and runs one after the other in order (saving edits in sequence). exhaustMap ignores new values while one is running (a login button that should not fire twice).`,
    ['Give one real use case for each.']),
  A(H, 'both', 'What are HTTP interceptors, and what are they used for?',
`An interceptor sits between your code and the network. It can change every outgoing request or incoming response. Typical uses: adding an authorization header, showing a global loading indicator, handling 401 errors by redirecting to login, retrying, and logging.

In current Angular, interceptors are functions registered with provideHttpClient(withInterceptors([authInterceptor])). Be careful not to send tokens to third-party domains, and avoid refresh-token loops by handling the refresh call separately.`),
  A(H, 'both', 'How do you handle errors from HTTP calls?',
`Use catchError in the stream to turn an error into a value or a friendly message, and set an error state that the template shows. Distinguish cases: 401 (send to login), 403 (not allowed), 404 (not found), 5xx or no network (try again later). For temporary failures, retry with a limited count and a delay.

A global error handler or interceptor can log problems, while components decide what the user sees. Never show raw server error text to users.`),
  A(H, 'both', 'How do you prevent memory leaks from subscriptions?',
`Prefer the async pipe and toSignal, which clean up themselves. For manual subscriptions, use takeUntilDestroyed() (it works with DestroyRef) or the older takeUntil with a subject triggered in ngOnDestroy. Streams that complete on their own, such as a single HTTP call, do not leak, but long-lived ones (valueChanges, timers, router events, WebSockets) do.

Mention that leaks show up as duplicated calls and rising memory when you navigate back and forth.`),
  A(H, 'experienced', 'How would you manage state in a large Angular application?',
`Start simple: local component state with signals, and shared state in services that expose signals or read-only Observables. Keep server data separate from UI state. When state is shared by many parts of the app and changes in complicated ways, a store such as NgRx (with actions, reducers, selectors and effects) or the signal-based NgRx SignalStore can give structure, tooling and predictability.

Choose by need: a store adds code and a learning curve, so do not use it for a small app. Whatever you choose, keep state immutable and have a single source of truth.`),
  A(H, 'experienced', 'What is the difference between hot and cold Observables, and what does shareReplay do?',
`A cold Observable starts a new execution for each subscriber, like an HTTP call: two subscribers make two requests. A hot Observable shares one source among subscribers, like mouse events or a WebSocket.

shareReplay turns a cold stream into a shared one and replays the latest values to late subscribers, so several parts of the app can use one HTTP result. Be careful with its refCount option and cache invalidation, or you can keep stale data or leak a subscription.`),
  A(H, 'experienced', 'What is the resource API (and httpResource) in Angular, and how does it compare with using HttpClient and RxJS?',
`The resource APIs bring async data into the signal world: a resource has a request that depends on signals and a loader, and it exposes signals such as value, status, error and isLoading, and reloads when its inputs change. httpResource does the same for HTTP calls.

They aim to make loading data and showing its state simpler than hand-written RxJS. They are newer and their stability has changed between versions, so check the Angular documentation for your version before relying on them, and keep HttpClient with RxJS for complex streams.`,
    ['Say that you check version status in the docs.']),
  A(F, 'fresher', 'How do you submit a reactive form and reset it afterwards?',
`Bind (ngSubmit)="save()" on the form element and [formGroup]="form". In save(), check form.valid, read form.getRawValue() or form.value, and send it to a service. If it is invalid, call form.markAllAsTouched() so all errors become visible.

After a successful save, call form.reset() to clear it (pass default values if needed). Disable the submit button while the request is running to stop double submissions, and show a clear success or error message.`),
  A(H, 'both', 'What are Subject, BehaviorSubject and ReplaySubject, and when would you use each?',
`A Subject is both an Observable and an observer: you can call next() on it and many subscribers receive the values. BehaviorSubject needs an initial value, keeps the latest one and gives it to new subscribers immediately, which suits "current state" such as the logged-in user. ReplaySubject remembers a set number of past values for late subscribers.

Expose them to other classes as read-only Observables (asObservable()) so only the owner can call next(). For simple state, signals are often easier now.`),
];
