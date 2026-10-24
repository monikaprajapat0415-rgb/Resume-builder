import { n, A } from './helpers.js';

// Angular course, lessons 26-52 (35 has no known title yet).
export const part2 = {
  'Angular Services and Dependency Injection Explained': A('Dependency injection', [
    n('svc', 'Service class', '@Injectable', 0, 0, 'store'), n('inj', 'Injector', 'creates and shares', 1, 0, 'model'),
    n('c1', 'Component A', 'inject(Service)', 2, 0, 'app'), n('c2', 'Component B', 'inject(Service)', 2, 1, 'app'),
  ], [
    { say: 'A service is a class that holds logic or data you want to reuse, such as API calls.', on: ['svc'] },
    { say: 'Mark it with @Injectable and provide it, often with providedIn: root.', flow: ['svc>inj:provided'] },
    { say: 'A component asks for it with inject(). It does not create it with new.', flow: ['inj>c1:inject()'] },
    { say: 'Another component asks, and gets the same instance.', flow: ['inj>c2:same instance'] },
    { say: 'This keeps components small and makes services easy to replace in tests.', on: ['c1', 'c2'] },
  ]),
  'Share State Between Components with an Angular Service': A('Shared state in a service', [
    n('a', 'Component A', 'changes data', 0, 0, 'app'), n('svc', 'Cart service', 'holds a signal', 1, 0, 'store'),
    n('sig', 'Signal', 'items', 1, 1, 'data'), n('b', 'Component B', 'shows data', 2, 0, 'out'),
  ], [
    { say: 'Two components that are not parent and child still need the same data.', on: ['a', 'b'] },
    { say: 'Put the data in a service. It lives as one shared instance.', on: ['svc'] },
    { say: 'The service keeps the state in a signal.', flow: ['svc>sig:holds'] },
    { say: 'Component A calls a service method to change it.', flow: ['a>svc:add()'] },
    { say: 'Component B reads the signal and updates by itself.', flow: ['sig>b:read'] },
  ]),
  'Angular Hierarchical Dependency Injection: Providers, @Self, @SkipSelf, @Optional, @Host': A('Which injector answers?', [
    n('root', 'Root injector', 'app-wide', 0, 0, 'store'), n('par', 'Parent component', 'own provider', 1, 0, 'app'),
    n('child', 'Child component', 'asks for service', 2, 0, 'model'), n('opt', 'Flags', '@Self @SkipSelf', 2, 1, 'check'),
  ], [
    { say: 'Angular has a tree of injectors that follows your component tree.', on: ['root', 'par'] },
    { say: 'A component asks for a service. Angular looks in its own providers first.', on: ['child'] },
    { say: 'If it is not found, Angular moves up to the parent, and finally to the root.', flow: ['child>par:ask up', 'par>root:ask up'] },
    { say: 'A provider on a component gives that branch its own instance.', on: ['par'] },
    { say: 'Flags change the search: @Self only here, @SkipSelf starts at the parent, @Optional allows no result.', flow: ['child>opt:flags'] },
  ]),
  'Angular Reactive Forms for Beginners': A('A reactive form', [
    n('cls', 'FormGroup', 'in your class', 0, 0, 'app'), n('ctl', 'FormControl', 'email, name', 1, 0, 'data'),
    n('tpl', 'Template', '[formGroup]', 2, 0, 'tool'), n('sub', 'Submit', 'form.value', 2, 1, 'out'),
  ], [
    { say: 'In a reactive form you build the form model in your class.', on: ['cls'] },
    { say: 'It is a FormGroup holding a FormControl for each field.', flow: ['cls>ctl:contains'] },
    { say: 'The template connects to it with [formGroup] and formControlName.', flow: ['ctl>tpl:bind'] },
    { say: 'As the user types, the model always has the current values.', on: ['ctl'] },
    { say: 'On submit, read form.value and send it where it needs to go.', flow: ['tpl>sub:submit'] },
  ]),
  'Angular Form Validation: Built-in and Custom Validators': A('Validators', [
    n('ctl', 'FormControl', 'email', 0, 0, 'data'), n('val', 'Validators', 'required, email', 1, 0, 'check'),
    n('st', 'Status', 'valid or invalid', 2, 0, 'model'), n('msg', 'Error message', 'shown to user', 2, 1, 'out'),
  ], [
    { say: 'Validators are rules a control must satisfy.', on: ['val'] },
    { say: 'Attach built-in ones such as required, minLength and email.', flow: ['ctl>val:rules'] },
    { say: 'Angular checks them each time the value changes and sets the status.', flow: ['val>st:result'] },
    { say: 'Show an error message only when the control is invalid and touched.', flow: ['st>msg:if invalid'] },
    { say: 'A custom validator is a function that returns an error object or null.', on: ['val'] },
  ]),
  'Angular Template-Driven Forms with ngModel': A('Template-driven forms', [
    n('tpl', 'Template', 'ngModel, name', 0, 0, 'tool'), n('dir', 'NgForm', 'created by Angular', 1, 0, 'model'),
    n('val', 'HTML rules', 'required, pattern', 1, 1, 'check'), n('sub', 'ngSubmit', 'handler', 2, 0, 'out'),
  ], [
    { say: 'In a template-driven form, most of the setup is in the HTML.', on: ['tpl'] },
    { say: 'Add ngModel and a name to each input. Angular builds the form model for you.', flow: ['tpl>dir:ngModel'] },
    { say: 'Use HTML attributes like required for validation.', flow: ['val>dir:rules'] },
    { say: 'The form tracks values and validity.', on: ['dir'] },
    { say: 'The ngSubmit event gives your code the values. It suits small, simple forms.', flow: ['dir>sub:ngSubmit'] },
  ]),
  'FormControl, FormGroup, FormBuilder, setValue, patchValue, valueChanges and statusChanges': A('Form building blocks', [
    n('fb', 'FormBuilder', 'short syntax', 0, 0, 'tool'), n('grp', 'FormGroup', 'many controls', 1, 0, 'app'),
    n('set', 'set / patchValue', 'write values', 1, 1, 'data'), n('vc', 'valueChanges', 'stream of values', 2, 0, 'model'),
    n('sc', 'statusChanges', 'stream of status', 2, 1, 'check'),
  ], [
    { say: 'FormControl is one field. FormGroup groups fields into one form.', on: ['grp'] },
    { say: 'FormBuilder is a shorter way to create them.', flow: ['fb>grp:builds'] },
    { say: 'setValue needs every field. patchValue lets you update only some.', flow: ['set>grp:write'] },
    { say: 'valueChanges is an observable that emits each time a value changes.', flow: ['grp>vc:emits'] },
    { say: 'statusChanges emits when the form becomes valid or invalid.', flow: ['grp>sc:emits'] },
  ]),
  'Angular Forms: Select Dropdowns, Checkboxes, Radio Buttons, Typed Forms and FormRecord': A('More form inputs', [
    n('sel', 'Select', 'one option', 0, 0, 'tool'), n('chk', 'Checkbox', 'true or false', 0, 1, 'tool'),
    n('rad', 'Radio group', 'one of few', 1, 1, 'tool'), n('form', 'Typed form', 'known types', 1, 0, 'model'),
    n('rec', 'FormRecord', 'dynamic keys', 2, 0, 'data'),
  ], [
    { say: 'Selects, checkboxes and radio buttons work with form controls just like text inputs.', on: ['sel', 'chk', 'rad'] },
    { say: 'A select or radio group stores one chosen value.', flow: ['sel>form:value', 'rad>form:value'] },
    { say: 'A checkbox stores true or false.', flow: ['chk>form:boolean'] },
    { say: 'Typed forms know the type of each control, so mistakes show up in your editor.', on: ['form'] },
    { say: 'FormRecord is for groups where the keys are not known in advance.', flow: ['form>rec:dynamic'] },
  ]),
  'Angular Advanced Form Validation: Custom, Async, Cross-Field and setValidators': A('Advanced validation', [
    n('cus', 'Custom validator', 'your function', 0, 0, 'app'), n('asy', 'Async validator', 'asks a server', 1, 0, 'tool'),
    n('crs', 'Group validator', 'compares fields', 0, 1, 'check'), n('ctl', 'Form', 'status', 1, 1, 'model'),
    n('set', 'setValidators', 'change rules later', 2, 1, 'data'),
  ], [
    { say: 'Custom validators encode your own rules, such as a password policy.', flow: ['cus>ctl:error or null'] },
    { say: 'Async validators wait for a result, for example checking if a username is taken. The control shows pending meanwhile.', flow: ['asy>ctl:pending'] },
    { say: 'A cross-field validator sits on the group and compares fields, like password and confirm.', flow: ['crs>ctl:group error'] },
    { say: 'setValidators changes the rules at runtime. Call updateValueAndValidity afterwards.', flow: ['set>ctl:new rules'] },
  ]),
  'Angular Routing Basics: Pages, RouterLink and RouterOutlet': A('How routing shows a page', [
    n('url', 'URL', '/about', 0, 0, 'user'), n('rt', 'Routes', 'path to component', 1, 0, 'model'),
    n('cmp', 'About component', 'matched page', 2, 0, 'app'), n('out', 'router-outlet', 'the page slot', 2, 1, 'tool'),
    n('lnk', 'routerLink', 'links, no reload', 1, 1, 'check'),
  ], [
    { say: 'Routing lets one Angular app show different pages for different URLs, without a full reload.', on: ['rt'] },
    { say: 'You list routes in app.routes.ts. Each route pairs a path with a component.', flow: ['url>rt:path'] },
    { say: 'When the URL matches, the router picks that component.', flow: ['rt>cmp:match'] },
    { say: 'router-outlet marks the spot in the layout where the chosen page is drawn.', flow: ['cmp>out:renders in'] },
    { say: 'Use routerLink instead of plain links, so clicking changes the page without reloading.', flow: ['lnk>rt:navigate'] },
  ]),
  'Angular Route Parameters and Query Parameters': A('Parameters in a URL', [
    n('url', 'URL', '/products/42?sort=asc', 0, 0, 'user'), n('rt', 'Router', 'matches route', 1, 0, 'model'),
    n('par', 'Route param', 'id = 42', 2, 0, 'data'), n('q', 'Query param', 'sort = asc', 2, 1, 'data'),
    n('cmp', 'Component', 'loads that product', 3, 0, 'app'),
  ], [
    { say: 'Part of a URL can carry data. The router reads it for you.', on: ['url'] },
    { say: 'The route /products/:id matches the URL.', flow: ['url>rt:navigate'] },
    { say: 'Route parameters are required parts of the path, like the id.', flow: ['rt>par::id'] },
    { say: 'Query parameters come after the question mark and are optional, like sort or page.', flow: ['rt>q:?sort'] },
    { say: 'The component reads both, and loads the right data.', flow: ['par>cmp:read', 'q>cmp:read'] },
  ]),
  'Angular Router Navigation: ActivatedRoute, Query Params, Route Data and Router Events': A('Navigating in code', [
    n('rl', 'routerLink', 'in templates', 0, 0, 'tool'), n('nav', 'router.navigate', 'in code', 0, 1, 'app'),
    n('rt', 'Router', 'changes the URL', 1, 0, 'model'), n('ar', 'ActivatedRoute', 'params, data', 2, 0, 'data'),
    n('ev', 'Router events', 'start, end', 2, 1, 'check'),
  ], [
    { say: 'Use routerLink for links in a template.', flow: ['rl>rt:click'] },
    { say: 'Use router.navigate when code decides where to go, for example after saving.', flow: ['nav>rt:navigate'] },
    { say: 'The router updates the URL and shows the matching component.', on: ['rt'] },
    { say: 'ActivatedRoute gives that component its params, query params and route data.', flow: ['rt>ar:current route'] },
    { say: 'Router events tell you when navigation starts and ends, useful for loading bars.', flow: ['rt>ev:events'] },
  ]),
  'Angular Route Guards: Protect Pages with CanActivateFn': A('A guard protects a page', [
    n('user', 'User', 'opens /admin', 0, 0, 'user'), n('rt', 'Router', 'asks the guard', 1, 0, 'model'),
    n('g', 'CanActivateFn', 'logged in?', 2, 0, 'check'), n('pg', 'Admin page', 'allowed', 3, 0, 'out'),
    n('lg', 'Login page', 'redirect', 2, 1, 'tool'),
  ], [
    { say: 'A guard is a function that decides whether a route may open.', on: ['g'] },
    { say: 'The user tries to open a protected URL.', flow: ['user>rt:/admin'] },
    { say: 'Before showing the page, the router runs the guard.', flow: ['rt>g:canActivate'] },
    { say: 'If the guard returns true, the page opens.', flow: ['g>pg:true'] },
    { say: 'Otherwise it returns a redirect to the login page. Remember: the server must still check permissions.', flow: ['g>lg:false'] },
  ]),
  'Angular Guards: CanActivateChild, CanDeactivate, Resolve, canMatch and Preloading': A('Other guards', [
    n('rt', 'Router', 'navigation', 1, 1, 'model'), n('cac', 'CanActivateChild', 'child routes', 0, 0, 'check'),
    n('cd', 'CanDeactivate', 'leave a page', 0, 2, 'check'), n('res', 'Resolve', 'load data first', 2, 0, 'data'),
    n('cm', 'canMatch', 'choose a route', 2, 2, 'tool'),
  ], [
    { say: 'There are several guard types, each at a different moment.', on: ['rt'] },
    { say: 'CanActivateChild protects all the children of a route at once.', flow: ['rt>cac:children'] },
    { say: 'CanDeactivate runs before leaving, so you can warn about unsaved changes.', flow: ['rt>cd:leaving'] },
    { say: 'Resolve fetches data before the page shows.', flow: ['rt>res:prefetch'] },
    { say: 'canMatch decides whether a route definition applies at all, for example by role. Preloading can fetch lazy routes in the background.', flow: ['rt>cm:match'] },
  ]),
  'Angular Lazy Loading: Load Routes and Components on Demand': A('Lazy loading', [
    n('main', 'Main bundle', 'loads first', 0, 0, 'app'), n('user', 'User', 'opens /admin', 1, 0, 'user'),
    n('rt', 'Router', 'loadComponent', 2, 0, 'model'), n('chunk', 'Admin chunk', 'separate file', 2, 1, 'store'),
    n('pg', 'Admin page', 'shown', 3, 0, 'out'),
  ], [
    { say: 'Without lazy loading, the first download contains the whole app.', on: ['main'] },
    { say: 'With lazy loading, a page is split into its own file.', on: ['chunk'] },
    { say: 'The user opens a lazy route.', flow: ['user>rt:/admin'] },
    { say: 'Only then does the router download that file, using loadComponent or loadChildren.', flow: ['rt>chunk:download'] },
    { say: 'The page appears. The first load stays small and fast.', flow: ['chunk>pg:render'] },
  ]),
  'Angular HttpClient: Get Data from an API with a Service': A('Get data from an API', [
    n('cmp', 'Component', 'shows the list', 0, 0, 'app'), n('svc', 'Service', 'uses HttpClient', 1, 0, 'store'),
    n('http', 'HttpClient', 'get()', 2, 0, 'tool'), n('api', 'API', 'returns JSON', 3, 0, 'data'),
  ], [
    { say: 'Keep API calls in a service, not in the component.', on: ['svc'] },
    { say: 'Provide HttpClient with provideHttpClient(), then inject it into the service.', flow: ['svc>http:inject'] },
    { say: 'Calling get() returns an observable. Nothing is sent until someone subscribes.', flow: ['http>api:GET'] },
    { say: 'The API replies with JSON.', flow: ['api>http:JSON'] },
    { say: 'The component subscribes, or uses the async pipe, and shows the data.', flow: ['http>svc:data', 'svc>cmp:list'] },
  ]),
  'Angular HTTP: Loading State, Error Handling and POST Requests': A('Loading, errors and POST', [
    n('cmp', 'Component', 'form and list', 0, 0, 'app'), n('ld', 'Loading flag', 'show spinner', 0, 1, 'data'),
    n('http', 'HttpClient', 'post()', 1, 0, 'tool'), n('api', 'API', 'saves data', 2, 0, 'data'),
    n('err', 'Error state', 'friendly message', 1, 1, 'check'),
  ], [
    { say: 'Before a request, set a loading flag so the user sees something is happening.', flow: ['cmp>ld'] },
    { say: 'post() sends data to the API as the request body.', flow: ['cmp>http:body', 'http>api:POST'] },
    { say: 'On success, turn off loading and update the screen.', flow: ['api>http:ok', 'http>ld:done'] },
    { say: 'On failure, catch the error and show a clear message, instead of a blank screen.', flow: ['api>err:error'] },
  ]),
  'Angular HTTP: Query Parameters, Headers, PUT, PATCH and DELETE Requests': A('More HTTP requests', [
    n('svc', 'Service', 'API methods', 0, 0, 'store'), n('get', 'GET + params', 'filter, page', 1, 0, 'tool'),
    n('put', 'PUT or PATCH', 'update', 1, 1, 'app'), n('del', 'DELETE', 'remove', 2, 1, 'check'),
    n('api', 'API', 'your server', 2, 0, 'data'),
  ], [
    { say: 'The same service can cover all the actions your API supports.', on: ['svc'] },
    { say: 'Use HttpParams for query parameters such as page or search, and set headers when needed.', flow: ['svc>get:?page=2'] },
    { say: 'PUT replaces a whole item. PATCH changes only some fields.', flow: ['svc>put:update'] },
    { say: 'DELETE removes an item by id.', flow: ['put>del:remove'] },
    { say: 'The API processes each request and returns the result.', flow: ['get>api:request'] },
  ]),
  'RxJS Basics for Angular: Observables and Operators': A('Observable pipeline', [
    n('src', 'Observable', 'source of values', 0, 0, 'data'), n('map', 'map', 'change values', 1, 0, 'tool'),
    n('flt', 'filter', 'keep some', 2, 0, 'check'), n('sub', 'subscribe', 'receives them', 3, 0, 'out'),
  ], [
    { say: 'An observable is a stream of values over time, like clicks or HTTP results.', on: ['src'] },
    { say: 'Operators are small steps you add with pipe().', flow: ['src>map:pipe'] },
    { say: 'map changes each value. filter keeps only the ones you want.', flow: ['map>flt:next'] },
    { say: 'Nothing runs until you subscribe.', flow: ['flt>sub:value'] },
    { say: 'Unsubscribe when done, or let the async pipe do it for you.', on: ['sub'] },
  ]),
  'RxJS Observables Explained: Create from Arrays, Strings, Events with of, from and fromEvent': A('Creating observables', [
    n('of', 'of(1, 2, 3)', 'values you list', 0, 0, 'tool'), n('from', 'from(array)', 'array or promise', 0, 1, 'tool'),
    n('ev', 'fromEvent', 'clicks, keys', 0, 2, 'tool'), n('obs', 'Observable', 'emits values', 1, 1, 'data'),
    n('sub', 'subscribe', 'you receive', 2, 1, 'out'),
  ], [
    { say: 'There are helper functions to create observables.', on: ['obs'] },
    { say: 'of emits the values you give it, one after another, then completes.', flow: ['of>obs:1, 2, 3'] },
    { say: 'from turns an array, string or promise into a stream.', flow: ['from>obs:each item'] },
    { say: 'fromEvent turns browser events, like clicks, into a stream.', flow: ['ev>obs:events'] },
    { say: 'Subscribe to receive the values.', flow: ['obs>sub:next'] },
  ]),
  'RxJS take, takeUntil, takeWhile, first, last, single, skip and tap Operators': A('Limiting a stream', [
    n('src', 'Source', '1 2 3 4 5', 0, 0, 'data'), n('skip', 'skip(1)', 'ignore first', 1, 0, 'tool'),
    n('take', 'take(3)', 'then complete', 2, 0, 'check'), n('tap', 'tap', 'peek, no change', 2, 1, 'app'),
    n('sub', 'subscribe', '2 3 4', 3, 0, 'out'),
  ], [
    { say: 'These operators decide how many values you let through.', on: ['src'] },
    { say: 'skip ignores the first values.', flow: ['src>skip:1 2 3 4 5'] },
    { say: 'take stops after a number of values. first and last pick one value. takeUntil and takeWhile stop on a condition.', flow: ['skip>take:2 3 4 5'] },
    { say: 'tap lets you look at values, for logging, without changing them.', flow: ['take>tap:peek'] },
    { say: 'The subscriber gets only what is left, and the stream completes.', flow: ['take>sub:2 3 4'] },
  ]),
  'RxJS scan, reduce, debounceTime, debounce, delay and delayWhen Explained': A('Time and totals', [
    n('in', 'Search box', 'keystrokes', 0, 0, 'user'), n('deb', 'debounceTime', 'wait 300 ms', 1, 0, 'tool'),
    n('api', 'API call', 'only the last', 2, 0, 'data'), n('scan', 'scan', 'running total', 1, 1, 'model'),
    n('red', 'reduce', 'final total', 2, 1, 'check'),
  ], [
    { say: 'debounceTime waits until the user stops typing before it passes on a value.', flow: ['in>deb:keystrokes'] },
    { say: 'That means one API call instead of one per key press.', flow: ['deb>api:last value'] },
    { say: 'scan keeps a running result and emits it for every value, like a live total.', flow: ['in>scan:values'] },
    { say: 'reduce emits only the final result, when the stream completes.', flow: ['scan>red:on complete'] },
    { say: 'delay and delayWhen shift values later in time.', on: ['deb'] },
  ]),
  'RxJS Error Handling: throwError, catchError, retry, retryWhen and finalize': A('Handling errors', [
    n('src', 'Request', 'may fail', 0, 0, 'tool'), n('retry', 'retry(2)', 'try again', 1, 0, 'check'),
    n('catch', 'catchError', 'recover', 2, 0, 'model'), n('fb', 'Fallback value', 'empty list', 3, 0, 'out'),
    n('fin', 'finalize', 'always runs', 2, 1, 'app'),
  ], [
    { say: 'An error ends an observable unless you handle it.', on: ['src'] },
    { say: 'retry tries the request again a set number of times.', flow: ['src>retry:error'] },
    { say: 'If it still fails, catchError lets you recover instead of crashing.', flow: ['retry>catch:still fails'] },
    { say: 'Return a fallback value, or use throwError to pass a clearer error on.', flow: ['catch>fb:fallback'] },
    { say: 'finalize runs at the end either way, which is a good place to hide a spinner.', flow: ['catch>fin:always'] },
  ]),
  'RxJS Subjects in Angular: Subject, BehaviorSubject, ReplaySubject and AsyncSubject': A('Subjects share values', [
    n('send', 'Code calls next()', 'pushes a value', 0, 0, 'app'), n('sub', 'Subject', 'sends and listens', 1, 0, 'model'),
    n('l1', 'Listener 1', 'subscribed', 2, 0, 'out'), n('l2', 'Listener 2', 'subscribed', 2, 1, 'out'),
    n('beh', 'BehaviorSubject', 'remembers latest', 1, 1, 'store'),
  ], [
    { say: 'A subject is an observable you can also push values into.', on: ['sub'] },
    { say: 'Call next() and every current subscriber receives the value.', flow: ['send>sub:next(5)'] },
    { say: 'Both listeners get the same value.', flow: ['sub>l1:5', 'sub>l2:5'] },
    { say: 'A BehaviorSubject keeps the latest value, so new subscribers get it immediately.', flow: ['beh>l2:latest'] },
    { say: 'ReplaySubject replays several past values. AsyncSubject gives only the last, on completion.', on: ['beh'] },
  ]),
  'Test Angular Components and Services with Vitest': A('A test run', [
    n('test', 'Test file', '*.spec.ts', 0, 0, 'app'), n('tb', 'TestBed', 'builds the component', 1, 0, 'tool'),
    n('cmp', 'Component', 'under test', 2, 0, 'model'), n('exp', 'expect(...)', 'check result', 2, 1, 'check'),
    n('res', 'Pass or fail', 'in the terminal', 3, 0, 'out'),
  ], [
    { say: 'A test sets up a situation, does something, and checks the result.', on: ['test'] },
    { say: 'TestBed creates the component with the same setup the app uses.', flow: ['test>tb:configure'] },
    { say: 'You create it, change its inputs or click a button, then let Angular update.', flow: ['tb>cmp:create'] },
    { say: 'Use expect to check the text or value you get.', flow: ['cmp>exp:result'] },
    { say: 'Vitest runs the file and reports passes and failures. For services, mock the HTTP calls.', flow: ['exp>res:report'] },
  ]),
  'Angular Accessibility: Build Apps Everyone Can Use': A('Accessible by design', [
    n('html', 'Semantic HTML', 'button, nav, label', 0, 0, 'app'), n('aria', 'ARIA, labels', 'for gaps in HTML', 1, 0, 'tool'),
    n('kbd', 'Keyboard', 'tab and enter', 2, 0, 'user'), n('sr', 'Screen reader', 'reads the page', 2, 1, 'user'),
    n('foc', 'Focus', 'moves after routes', 1, 1, 'check'),
  ], [
    { say: 'Accessibility means people with different needs can use your app.', on: ['html'] },
    { say: 'Start with the right HTML elements: real buttons, links, labels and headings.', on: ['html'] },
    { say: 'Add ARIA attributes only where plain HTML cannot say it.', flow: ['html>aria:extra'] },
    { say: 'Everything must work with the keyboard, with a visible focus.', flow: ['aria>kbd:tab'] },
    { say: 'Manage focus when the page changes, so screen reader users know where they are.', flow: ['foc>sr:announce'] },
  ]),
  'Angular Performance and Production Build Checklist': A('Faster apps', [
    n('build', 'ng build', 'production mode', 0, 0, 'tool'), n('ts', 'Tree shaking', 'drops unused code', 1, 0, 'check'),
    n('lazy', 'Lazy loading', 'smaller first load', 2, 0, 'app'), n('img', 'Image optimisation', 'right size', 1, 1, 'data'),
    n('user', 'User', 'fast page', 3, 0, 'user'),
  ], [
    { say: 'A production build minifies and optimises your code.', on: ['build'] },
    { say: 'Unused code is removed, which makes bundles smaller.', flow: ['build>ts:optimise'] },
    { say: 'Lazy loading keeps the first download small.', flow: ['ts>lazy:split'] },
    { say: 'Optimise images and use track in lists so less work is done.', on: ['img'] },
    { say: 'Check bundle sizes and measure with Lighthouse. The user gets a faster page.', flow: ['lazy>user:fast'] },
  ]),
};
