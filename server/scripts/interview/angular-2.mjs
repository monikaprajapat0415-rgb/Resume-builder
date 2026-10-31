// Angular interview questions, part 2: directives, pipes, dependency injection, signals and change detection.
const A = (category, level, question, modelAnswer, tips = []) => ({ category, level, question, modelAnswer, tips, tags: ['angular'] });
const D = 'Angular directives, pipes and DI', S = 'Angular signals and change detection';

export const part2 = [
  A(D, 'fresher', 'What is a directive? What are the types?',
`A directive adds behaviour to an element in a template. There are three kinds. Components are directives with a template. Structural directives change the DOM structure by adding or removing elements, such as the older *ngIf and *ngFor. Attribute directives change how an element looks or behaves, such as ngClass, ngStyle or your own custom directive.

You create a custom one with the @Directive decorator and a selector, for example to highlight an element when the mouse is over it.`),
  A(D, 'fresher', 'What is the difference between ngClass and ngStyle, and how do they compare with class and style bindings?',
`ngClass adds or removes CSS classes based on a condition or an object, and ngStyle sets inline styles from an object. They still work, but for simple cases Angular's direct bindings are lighter: [class.active]="isActive" toggles one class, and [style.width.px]="width" sets one style.

Use class and style bindings for one or two values, and ngClass or ngStyle when you need several at once.`),
  A(D, 'fresher', 'What is a pipe? Name some built-in pipes.',
`A pipe transforms a value for display in a template, using the | symbol: {{ price | currency }}. Built-in pipes include date, currency, number, percent, uppercase, lowercase, titlecase, slice, json and async.

Pipes change only what is shown, not the original data. You can chain them: {{ name | lowercase | titlecase }}.`),
  A(D, 'both', 'How do you create a custom pipe? What is the difference between pure and impure pipes?',
`Create a class with the @Pipe decorator, a name, and a transform method that takes the input and returns the output. Add it to the imports of any standalone component that uses it.

A pure pipe, the default, runs only when its input value or reference changes, so it is fast. An impure pipe (pure: false) runs on every change detection cycle and can be expensive. Prefer pure pipes, and create a new array or object instead of mutating when the input changes.`,
    ['Mention the mutation trap with pure pipes.']),
  A(D, 'both', 'What does the async pipe do, and why is it recommended?',
`The async pipe subscribes to an Observable or a Promise in the template and shows its latest value. It also unsubscribes automatically when the component is destroyed, so you do not forget to clean up, and it marks the view for update when new values arrive.

Example: @if (users$ | async; as users) { ... }. It reduces manual subscribe code and prevents memory leaks. Remember that each use in a template creates its own subscription, so use "as" to share the value.`),
  A(D, 'both', 'How do you build a custom attribute directive?',
`Use @Directive with a selector in square brackets, such as [appHighlight]. Inject ElementRef to reach the host element, and use host bindings or listeners to react: in the decorator's host option, 'mouseenter' can call a method that changes the background colour.

Inputs let you configure it: [appHighlight]="'yellow'". Directives are good for reusable behaviour such as autofocus, click-outside, or tooltips, without changing the component.`),
  A(D, 'both', 'What is the difference between providedIn root and providing a service in a component?',
`providedIn: 'root' registers one shared instance for the whole application, created when first needed. Providing a service in a component's providers array creates a new instance for that component and its children, and it is destroyed with the component.

Use root for shared state and API services. Use component-level providers when each instance needs its own state, such as one form helper per page or a dialog.`),
  A(D, 'both', 'What is the inject() function, and how does it compare with constructor injection?',
`inject() gets a dependency from the current injection context, such as a field initialiser, a constructor, a factory or a functional guard: private http = inject(HttpClient). Constructor injection lists the dependencies as constructor parameters.

inject() is shorter, works in functions (route guards, interceptors) where there is no constructor, and plays well with class inheritance. Both give the same instance. It must be called in an injection context, not later inside a random method.`),
  A(D, 'both', 'What are injection tokens, and when would you use InjectionToken?',
`Dependency injection looks up a provider by a token, which is usually a class. For values that are not classes, such as a config object, a string or an interface, create an InjectionToken and provide a value for it: { provide: API_URL, useValue: 'https://api.example.com' }, then inject(API_URL).

This keeps settings out of the code that uses them and lets tests or different environments provide different values.`),
  A(D, 'experienced', 'Explain the hierarchical injector. How does Angular decide which instance to give?',
`Angular has a tree of injectors. A request for a dependency starts at the element injector of the component and moves up through its parents, and then to the environment injector (route level, then root), until a provider is found. The first match wins, so a provider closer to the component overrides one higher up.

Lazy-loaded routes can have their own environment injector. Modifiers such as optional, self, skipSelf and host change where the search starts or what happens if nothing is found.`,
    ['Draw the tree on paper if you get the chance.']),
  A(D, 'experienced', 'What are providers like useClass, useValue, useFactory and useExisting?',
`They are ways to tell Angular how to create a dependency. useClass supplies a different class, such as a mock or an alternative implementation. useValue supplies a fixed value. useFactory runs a function, which can read other dependencies, to build the value. useExisting makes one token an alias for another provider, so both give the same instance.

They are useful for swapping implementations by environment, configuration and testing.`),
  A(D, 'experienced', 'What are host directives and when are they useful?',
`The hostDirectives option in @Component or @Directive lets a component or directive apply other directives to its host element, and choose which of their inputs and outputs to expose. This is composition: you can combine small behaviours, such as a focus or tooltip directive, into a component without extending a base class.

It keeps behaviour reusable and avoids inheritance chains, and the consumer does not need to add the directives in the template.`),
  A(S, 'fresher', 'What are signals in Angular?',
`A signal is a wrapper around a value that tells Angular when the value changes. You create one with signal(0), read it by calling it, count(), and change it with set() or update(). Because Angular knows which templates and computed values read a signal, it can update just those parts.

Signals make state simpler to follow than manual change detection or large RxJS chains for local UI state.`),
  A(S, 'fresher', 'What is the difference between signal, computed and effect?',
`signal holds a writable value. computed derives a value from other signals, is read-only, lazy and cached: it recalculates only when a dependency changes. effect runs side-effect code, such as logging or saving to local storage, when the signals it reads change.

Rule of thumb: use computed for values you can calculate from other state, and avoid using effects to set other signals, because that makes data flow harder to follow.`,
    ['Say what you would not do in an effect.']),
  A(S, 'both', 'How do signal inputs, outputs and model() work?',
`input() declares a read-only signal input, with input.required() when the parent must supply it. output() declares an event emitter. model() creates a signal that supports two-way binding, so a parent can write [(value)]="parentSignal".

Because inputs are signals, you can use them in computed values and effects, and they work well with the new change detection model. They replace the @Input and @Output decorators for new code.`),
  A(S, 'both', 'What is change detection in Angular?',
`Change detection is how Angular finds out what changed in your data and updates the DOM. After events such as clicks, timers or HTTP responses, Angular checks the component tree and refreshes bindings that changed.

By default, with Zone.js, any async event can trigger a check of the whole tree. Strategies and signals let you narrow that so Angular only checks what needs it.`),
  A(S, 'both', 'What is the OnPush change detection strategy?',
`With ChangeDetectionStrategy.OnPush, a component is checked only when one of its inputs changes by reference, an event happens in the component or its template, an async pipe emits, a signal it reads changes, or you mark it for check. It skips the rest.

It reduces work in large apps, but you must treat data as immutable: replace objects and arrays instead of changing them in place, otherwise the view will not update.`,
    ['Mention immutability.']),
  A(S, 'both', 'What is Zone.js and what does it do?',
`Zone.js patches browser async APIs (events, timers, promises) so Angular is told when asynchronous work finishes. Angular then runs change detection. It makes updates feel automatic.

The downsides are extra bundle size, some overhead, and checks that may run when nothing changed. Angular is moving towards signals and zoneless operation, where updates are triggered by signals and explicit notifications rather than Zone.js.`),
  A(S, 'experienced', 'What is zoneless change detection, and what must you change in your code to use it?',
`In zoneless mode, Angular does not use Zone.js. Change detection is scheduled when something Angular knows about changes: a signal read in a template, an event listener in a template, the async pipe, markForCheck or a component being created or removed. You enable it with provideZonelessChangeDetection (check the Angular docs for the status in your version).

Code that changed plain fields from timers or third-party callbacks and relied on Zone.js will stop updating. Move that state to signals, and run libraries that need it carefully.`),
  A(S, 'experienced', 'What is linkedSignal, and when would you use it instead of computed?',
`linkedSignal creates a writable signal whose value is derived from another signal, but can also be overwritten. When the source changes, it resets to the derived value. A typical example: a selected item that defaults to the first option of a list, but the user can change it, and it resets when the list changes.

computed is read-only, so it cannot hold a user choice. Use linkedSignal when you need "derived default that can be edited".`),
  A(S, 'experienced', 'How do you avoid common problems with effects?',
`Do not use effects to copy one signal into another; use computed or linkedSignal. Avoid setting signals inside effects unless you really need to, because it can create confusing update chains and loops. Keep effects for side effects: logging, analytics, syncing with local storage or a non-Angular library, and DOM work.

Clean up with the onCleanup callback if the effect starts timers or listeners, and read signals you do not want to track with untracked().`),
  A(S, 'experienced', 'How do toSignal and toObservable help mix signals and RxJS?',
`toSignal turns an Observable into a signal, subscribing and unsubscribing for you, with an initial value or the requireSync option. toObservable turns a signal into an Observable that emits when it changes.

This lets you keep RxJS for streams, such as HTTP, debouncing or WebSockets, and use signals for the template and local state. A common pattern is a search box signal, toObservable, debounceTime and switchMap, then toSignal for the results.`),
  A(S, 'experienced', 'What does ExpressionChangedAfterItHasBeenCheckedError mean and how do you fix it?',
`In development mode, Angular runs a second check to be sure bindings did not change during change detection. This error means a value used in a template changed after Angular had already checked it, for example a child changing a parent's data in ngAfterViewInit.

Fix the data flow: set the value earlier (ngOnInit), use a signal or computed, move the logic to where it belongs, or schedule a deliberate update. Hiding it with a timeout is a last resort, because it covers up a design problem.`),
  A(S, 'experienced', 'What is the difference between markForCheck and detectChanges?',
`markForCheck marks the component and its parents as needing a check and lets Angular's normal change detection run it soon. It is the safe choice with OnPush when data changed from outside Angular's view of things. detectChanges runs change detection for that component and its children immediately, which is more direct and can be costly or cause errors if called too often or during a check.

Prefer signals and the async pipe so that you rarely need either. If you must choose, use markForCheck.`),
];
