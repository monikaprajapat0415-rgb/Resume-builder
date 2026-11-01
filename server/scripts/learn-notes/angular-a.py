N = [
# 0
["Angular = a framework from Google for building web apps in TypeScript.", "You build the screen from components: a class, a template and styles.", "Routing, forms, HTTP and testing tools come in one place.", "When data changes, Angular updates only the parts of the page that need it."],
# 1
["TypeScript = JavaScript with types. You say what kind of value a variable or function holds.", "The editor and compiler check types while you type, so mistakes show up early.", "Most used in Angular: interfaces, classes and decorators.", "It is turned into plain JavaScript for the browser."],
# 2
["Install Node.js first. Angular tools run on it.", "npm comes with Node and installs packages.", "`npm install -g @angular/cli` gives the `ng` command.", "Check with `ng version`."],
# 3
["Path: basics, then state and forms, then routing and HTTP, then advanced topics, then projects and deploy.", "Basics = first app, components, templates.", "State = signals and services. Real data = routing and HTTP.", "Advanced = RxJS, change detection, SSR, testing, security."],
# 4
["`ng new my-app` creates a complete project.", "`cd my-app` then `ng serve` starts the dev server.", "Open `localhost:4200` to see the app.", "Save a file and the browser reloads by itself."],
# 5
["`main.ts` is the entry point and starts the app.", "`app.config.ts` holds app-wide settings and services (providers).", "The root component holds the page layout.", "`app.routes.ts` says which component shows for each URL.", "Everything is drawn inside `index.html`, the one page the browser loads."],
# 6
["A component = a class with a `@Component` decorator.", "The template is HTML that shows data from the class. Styles apply only to this component.", "`selector` is the custom tag name, for example `<app-card>`.", "Put the tag in another template and Angular draws the component there.", "Make one with `ng generate component name`."],
# 7
["The Angular CLI is one tool for the whole life of a project.", "`ng new` creates, `ng serve` runs, `ng build` makes the files to deploy.", "`ng generate` makes components, services and more with the right files.", "`ng update` upgrades Angular and runs migrations on your code.", "Upgrade one major version at a time."],
# 8
["Interpolation: `{{ title }}` shows a class property in the template.", "When the property changes, the text updates.", "Small expressions work inside the braces, such as `{{ price * 2 }}`.", "Keep logic short in templates. Move bigger logic to the class."],
# 9
["Property binding: `[disabled]=\"isBusy\"` sets an element property from the class.", "Event binding: `(click)=\"save()\"` runs a method when the event happens.", "Square brackets = data in. Round brackets = events out.", "The method changes the data and the bindings update the screen."],
# 10
["Two-way binding keeps a property and an input in sync in both directions.", "`[(ngModel)]=\"name\"` is shorthand for `[ngModel]` plus `(ngModelChange)`.", "Import `FormsModule` to use `ngModel`.", "Anything else that shows `name` updates as the user types."],
# 11
["A signal holds a value and tells Angular when it changes.", "Create: `count = signal(0)`. Read: `count()`.", "Change: `count.set(5)` or `count.update(c => c + 1)`.", "Angular knows which parts of the page read the signal and refreshes only those.", "Update signals with new objects and arrays, not by changing them in place."],
# 12
["`styles.css` = global styles for the whole app.", "Component styles apply only to that component.", "View encapsulation is how Angular stops a component's styles leaking out.", "Libraries such as Bootstrap and Font Awesome are added once and used through classes."],
# 13
["`@if (cond) { ... } @else { ... }` decides which blocks exist on the page.", "Only the matching block is added. The other is not in the page at all.", "`@switch (status) { @case ('paid') { ... } @default { ... } }` picks one of many.", "Control flow is built in. No import is needed."],
# 14
["`@for (item of items; track item.id) { ... }` repeats a block for each item.", "`track` tells Angular which item is which. Use a unique id.", "Angular then adds, moves or removes only what changed.", "`@empty { ... }` shows something when the list is empty."],
# 15
["Older code uses `*ngIf`, `*ngFor`, `*ngSwitch` and `trackBy`. You will still meet them.", "The new `@if`, `@for` and `@switch` do the same job with less code.", "A built-in migration converts templates for you: `ng generate @angular/core:control-flow`.", "Review the changes and run your tests."],
# 16
["A class binding adds or removes one class: `[class.active]=\"isActive\"`.", "`ngClass` handles several classes from an object or a list.", "A style binding sets one property: `[style.width.px]=\"size\"`.", "The element updates whenever the state changes."],
# 17
["`computed(() => price() * qty())` calculates a value from other signals.", "It recalculates only when those signals change, and is cached until then.", "`effect(() => ...)` runs code when the signals it reads change.", "Use effects for logging or saving to storage, not to calculate values."],
# 18
["The cart keeps its lines in one signal.", "Add = `lines.update(l => [...l, newLine])`.", "Item count and total are `computed` signals that read the lines.", "The cart view refreshes with no extra code."],
# 19
["A parent gives data to a child with an input: `[product]=\"item\"`.", "In the child: `product = input.required<Product>()`. Read it with `product()`.", "Data flows one way, from parent to child.", "When the parent value changes, the child updates."],
# 20
["A child tells its parent with an output: `saved = output<string>()`, then `saved.emit(value)`.", "The parent listens: `(saved)=\"onSaved($event)\"`.", "`model()` combines an input and an output, so the child can change a value the parent owns.", "With `model()` the parent can use `[(value)]`."],
# 21
["A pipe changes how a value is shown, not the value itself.", "`{{ value | pipeName }}`. Add options with a colon: `date:'dd MMM yyyy'`.", "Common: `date`, `currency`, `uppercase`, `lowercase`, `percent`.", "Pipes can be chained."],
# 22
["The `async` pipe subscribes to an observable or promise and shows its latest value.", "It unsubscribes when the component is destroyed, so you cannot forget.", "`keyvalue` loops over the keys and values of an object.", "In TypeScript, inject the pipe or create it and call `transform`."],
# 23
["A component is created, updates, then is removed. Hooks let you run code at each stage.", "`ngOnInit` runs once after inputs are set: load initial data here.", "`ngOnChanges` runs when an input changes.", "`ngAfterViewInit` runs once the view and children exist.", "`ngOnDestroy` runs just before removal: stop timers and subscriptions."],
# 24
["`#box` gives a name to an element in the template.", "`viewChild()` gets something inside the component's own template.", "`contentChild()` gets something the parent projected in.", "`ng-container` groups elements or holds an `@if` without adding an extra element."],
# 25
["A service = a class that holds logic or data you want to reuse, such as API calls.", "Mark it `@Injectable({ providedIn: 'root' })`.", "A component asks for it with `inject(MyService)`. It does not use `new`.", "Every component gets the same instance.", "Components stay small and services are easy to replace in tests."],
# 26
["Two unrelated components that need the same data: put the data in a service.", "The service is one shared instance and keeps the state in a signal.", "Component A calls a service method to change it.", "Component B reads the signal and updates by itself."],
# 27
["Angular has a tree of injectors that follows the component tree.", "A request looks in the component's own providers, then the parent, then the root.", "A provider on a component gives that branch its own instance.", "`@Self` = only here. `@SkipSelf` = start at the parent. `@Optional` = no error if missing. `@Host` = stop at the host."],
# 28
["Reactive form: you build the model in the class. `FormGroup` holds a `FormControl` per field.", "Template: `[formGroup]=\"form\"` and `formControlName=\"email\"`.", "The model always has the current values.", "On submit read `form.value` and send it.", "Import `ReactiveFormsModule`."],
# 29
["Validators are rules a control must satisfy: `required`, `minLength`, `email`.", "Angular checks them on each change and sets the status.", "Show an error only when the control is invalid and touched.", "A custom validator is a function that returns an error object, or `null` when valid."],
# 30
["Template-driven form: most of the setup is in the HTML.", "Add `ngModel` and a `name` to each input.", "Use HTML attributes like `required` for validation.", "`(ngSubmit)` gives your code the values.", "Good for small, simple forms."],
# 31
["`FormControl` = one field. `FormGroup` = a group of fields. `FormBuilder` = shorter way to create them.", "`setValue` needs every field. `patchValue` updates only some.", "`valueChanges` emits on each change. `statusChanges` emits when valid or invalid changes.", "Unsubscribe or use `takeUntilDestroyed` when you listen manually."],
# 32
["Select and radio groups store one chosen value. A checkbox stores `true` or `false`.", "Typed forms know the type of each control, so mistakes show in the editor.", "`FormRecord` is for groups where the keys are not known in advance.", "`nonNullable` stops reset from giving `null`."],
# 33
["Custom validators encode your rules, such as a password policy.", "Async validators wait for a result (is the username taken?). The control is `pending` meanwhile.", "A cross-field validator sits on the group and compares fields, like password and confirm.", "`setValidators` changes rules at runtime. Then call `updateValueAndValidity()`."],
# 34
["Routing shows different pages for different URLs without a full reload.", "Routes are listed in `app.routes.ts`: a `path` and a `component`.", "`<router-outlet />` marks where the page is drawn.", "Use `routerLink` instead of plain links."],
# 35
["Route parameter: required part of the path, `/products/:id`.", "Query parameter: optional, after the `?`, like `?sort=price&page=2`.", "The component reads both and loads the right data.", "`withComponentInputBinding()` lets route params arrive as inputs."],
# 36
["`routerLink` for links in a template. `router.navigate([...])` when code decides, for example after saving.", "`ActivatedRoute` gives params, query params and route data.", "Router events tell you when navigation starts and ends. Use them for loading bars."],
# 37
["A guard is a function that decides whether a route may open: `canActivate: [authGuard]`.", "Return `true` to open, or a redirect (`router.parseUrl('/login')`).", "The server must still check permissions. A guard only hides pages."],
# 38
["`canActivateChild` protects all children of a route.", "`canDeactivate` runs before leaving: warn about unsaved changes.", "`resolve` fetches data before the page shows.", "`canMatch` decides whether a route applies at all, for example by role.", "Preloading can fetch lazy routes in the background."],
# 39
["Without lazy loading the first download holds the whole app.", "A lazy route is split into its own file: `loadComponent: () => import('./page').then(m => m.Page)`.", "The file downloads only when the user opens the route. `loadChildren` does it for a group of routes.", "The first load stays small and fast."],
# 40
["Keep API calls in a service, not in the component.", "Add `provideHttpClient()` in the app config. Then `inject(HttpClient)`.", "`http.get<T>(url)` returns an observable. Nothing is sent until someone subscribes.", "Subscribe, or use the `async` pipe, and show the data."],
# 41
["Set a loading flag before the request so the user sees something is happening.", "`http.post(url, body)` sends data as the request body.", "On success turn off loading and update the screen.", "On failure catch the error and show a clear message, not a blank screen."],
]
