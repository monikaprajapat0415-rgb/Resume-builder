// Angular interview questions, part 1: basics, components and templates.
// A(category, level, question, answer, tips): level is fresher (basic), both (intermediate) or experienced (advanced).
// Answers are plain text; a blank line starts a new paragraph. Written for Angular 20 style (standalone components, signals, new control flow).
const A = (category, level, question, modelAnswer, tips = []) => ({ category, level, question, modelAnswer, tips, tags: ['angular'] });
const B = 'Angular basics', C = 'Angular components and templates';

export const part1 = [
  A(B, 'fresher', 'What is Angular, and how is it different from AngularJS?',
`Angular is a TypeScript framework from Google for building single-page web applications. It gives you components, templates, dependency injection, routing, forms and an HTTP client in one package, plus a command-line tool (Angular CLI) to create, build and test projects.

AngularJS (version 1.x) was a different, older framework written in JavaScript, built around controllers and scopes, and it is no longer supported. Angular (version 2 and later) was a full rewrite using components and TypeScript. When someone says "Angular" today, they mean the modern one.`,
    ['Say clearly that the two are different frameworks.', 'Name one thing you have built or practised with Angular.']),
  A(B, 'fresher', 'What is a single-page application (SPA)?',
`A single-page application loads one HTML page and then updates the content in the browser with JavaScript as the user moves around, instead of asking the server for a full new page each time. Angular does this with its router: changing the URL swaps the components shown on screen.

The benefits are a faster, app-like feel after the first load. The costs are a heavier first download and extra work for search engines, which is why server-side rendering is often added for public pages.`,
    ['Mention the trade-off, not only the benefit.']),
  A(B, 'fresher', 'What does the Angular CLI do? Name some common commands.',
`The Angular CLI is a command-line tool that creates and manages Angular projects so you do not set up the build by hand. Common commands: ng new creates a project, ng serve runs a development server with live reload, ng generate (or ng g) creates components, services and more, ng build makes a production build, and ng test runs unit tests.

It also handles updates: ng update helps move a project to a newer Angular version.`,
    ['Practise ng generate component and ng build before the interview.']),
  A(B, 'fresher', 'What is a standalone component, and why did Angular move away from NgModules?',
`A standalone component declares its own dependencies in its imports array (other components, directives, pipes) and does not need to belong to an NgModule. In current Angular, components are standalone by default.

NgModules were an extra layer: you had to declare a component in a module and keep module imports in sync. Standalone removes that step, makes code easier to learn and to lazy load, and reduces boilerplate. NgModules still exist in older code, and you may meet them in existing projects.`,
    ['Be ready to say you can read NgModule code even if new code is standalone.']),
  A(B, 'fresher', 'What is TypeScript, and why does Angular use it?',
`TypeScript is JavaScript with types added. The compiler checks your code before it runs and turns it into plain JavaScript. For example, it warns you if you pass a string where a number is expected.

Angular uses it because types catch mistakes early, give better editor help (autocomplete, safe refactoring) and make large codebases easier to maintain. Decorators, which Angular uses to mark classes as components or services, are also part of TypeScript.`),
  A(B, 'fresher', 'Describe the structure of a basic Angular project.',
`A new project has a src folder with main.ts (the entry point that starts the app), index.html (the single page), styles.css (global styles) and an app folder. In the app folder you will find the root component (app.ts or app.component.ts with its template and styles), app.config.ts (providers such as the router and HTTP client) and app.routes.ts (the route list).

Outside src are angular.json (build settings), package.json (dependencies and scripts) and tsconfig files (TypeScript options).`,
    ['Mention that angular.json controls build and serve options.']),
  A(B, 'fresher', 'What happens when an Angular application starts?',
`The browser loads index.html, which contains the root element (for example app-root) and the built JavaScript bundles. main.ts calls bootstrapApplication with the root component and the app configuration. Angular creates the root component, renders its template into the root element, sets up the router, and the first route's component appears.

From then on Angular reacts to events and data changes and updates the screen.`),
  A(B, 'fresher', 'What is the difference between a component and a service?',
`A component controls part of the screen: it has a template (HTML), styles and a class with data and event handlers. A service is a plain class for logic that is not tied to one screen, such as calling an API, keeping shared state or logging.

Keeping this logic in services means several components can share it and it is easy to test. Components get services through dependency injection.`,
    ['Give a real example, such as a UserService used by two components.']),
  A(B, 'fresher', 'What is a decorator in Angular? Name a few.',
`A decorator is a function written with @ above a class, property or method that adds metadata or behaviour. Angular uses them to tell the framework what a class is. Examples: @Component marks a component, @Directive a directive, @Pipe a pipe, @Injectable a service, and @Input and @Output mark inputs and outputs in the classic style.

In newer Angular, signal-based functions such as input(), output() and viewChild() replace some property decorators, but the class decorators are still used.`),
  A(B, 'fresher', 'What is dependency injection, and why is it useful?',
`Dependency injection (DI) means a class does not create the things it needs. It asks for them and Angular provides them. A component that needs an HttpClient or a UserService gets an instance through the constructor or through the inject() function.

It is useful because classes are loosely coupled and easy to test (you can pass a fake service), and Angular can share one instance across the app when you want that.`),
  A(B, 'fresher', 'How do you create and use a service?',
`Create a class with the @Injectable decorator, usually with providedIn: 'root' so Angular creates one shared instance for the whole app. Put the logic in methods. In a component, get it with inject(UserService) or a constructor parameter, then call its methods.

Example: a UserService with a getUsers() method that returns an HTTP call. Two components can both inject it and use the same code.`,
    ['Mention providedIn root and what singleton means.']),
  A(B, 'fresher', 'What is the difference between ng serve and ng build?',
`ng serve starts a local development server with live reload: it rebuilds in memory when you save a file and is meant for development only. ng build writes the finished files to the dist folder, optimised and minified when you use the production configuration, ready to be deployed to a web server.

You never deploy the output of ng serve. You deploy the dist folder produced by ng build.`),
  A(C, 'fresher', 'What are the parts of a component?',
`A component has a class with the data and methods, a template with the HTML the user sees, optional styles scoped to that component, and metadata in the @Component decorator: selector (the tag name), imports (what the template uses), templateUrl or template, and styleUrl or styles.

The class and template are connected: the template can show class data with interpolation and call class methods in response to events.`),
  A(C, 'fresher', 'What is data binding? Explain the four types.',
`Data binding connects the component class and the template. The types are:

Interpolation, {{ value }}, shows a value as text. Property binding, [property]="value", sets an element or component property. Event binding, (event)="handler()", runs a method when something happens, such as a click. Two-way binding, [(ngModel)]="value", keeps a field and a variable in sync in both directions.

Signal-based model() inputs also support two-way binding between a parent and a child component.`,
    ['Give a one-line example of each.']),
  A(C, 'fresher', 'What is the difference between interpolation and property binding?',
`Interpolation puts a value into text: <p>Hello {{ name }}</p>. Property binding sets a DOM or component property: <img [src]="imageUrl">. Interpolation always turns the value into a string. Property binding keeps the real type, so you can pass objects, numbers or booleans, such as [disabled]="isBusy".

Use interpolation for text and property binding when setting properties and inputs.`),
  A(C, 'fresher', 'How do you pass data from a parent component to a child component?',
`Mark a property in the child as an input and bind it in the parent's template. In current Angular you write name = input<string>() in the child, and in the parent <app-child [name]="userName" />. The child reads it as name() because inputs created with input() are signals. In the classic style you use the @Input() decorator on a property.

Data flows down through inputs. The child sends information up with outputs.`),
  A(C, 'fresher', 'How does a child component send data to its parent?',
`The child declares an output and emits events. In current Angular: saved = output<string>() and then this.saved.emit(value). In the parent template you listen with (saved)="onSaved($event)". The classic style uses @Output() with an EventEmitter.

Keep the pattern simple: data down with inputs, events up with outputs. For siblings or distant components, use a shared service.`),
  A(C, 'both', 'What is the component lifecycle? Describe the main hooks.',
`Angular creates, updates and destroys components and lets you run code at key moments. The main hooks are: ngOnChanges (when an input changes), ngOnInit (once, after the first inputs are set, the usual place for setup), ngDoCheck (each change detection run), ngAfterViewInit (after the view and child views exist), and ngOnDestroy (just before the component is removed, to clean up).

There are also afterNextRender and afterRender functions for code that must run after the DOM is updated, which is useful for browser-only work.`,
    ['Say what you use ngOnDestroy for: subscriptions, timers, listeners.']),
  A(C, 'both', 'What is the difference between the constructor and ngOnInit?',
`The constructor is a TypeScript feature that runs when the class is created. In Angular it is best used only for injecting dependencies and simple field setup. At that time the inputs have not been set yet.

ngOnInit is an Angular hook that runs once after the first inputs are set. Put initial logic there, such as loading data based on an input. With inject() and signal inputs, you can often avoid ngOnInit for simple cases, but the rule is the same: do not rely on inputs in the constructor.`),
  A(C, 'both', 'What is ViewEncapsulation?',
`It controls how a component's styles apply. The default, Emulated, makes styles apply only to that component's template by adding special attributes, so styles do not leak out and global styles still apply in. None makes the styles global. ShadowDom uses the browser's native shadow DOM for real isolation.

Most apps keep Emulated. To style a child component from outside, prefer inputs or CSS variables over breaking encapsulation.`),
  A(C, 'both', 'What are template reference variables?',
`A template reference variable, written with a hash such as #nameInput on an element, gives you a handle to that element or component inside the same template. You can then read its value or call its methods: <input #nameInput> <button (click)="save(nameInput.value)">.

For a component or directive, the variable gives access to the instance. They are handy for small interactions and avoid extra class properties.`),
  A(C, 'both', 'How does content projection (ng-content) work?',
`Content projection lets a parent place its own markup inside a child component. The child template has <ng-content></ng-content> where the content should appear. For example, a card component can wrap any text or elements in a styled box.

You can have several slots with a select attribute, such as <ng-content select="[card-title]">, and the parent marks elements to go in each one. It makes reusable layout components like cards, dialogs and tabs.`),
  A(C, 'both', 'What do @if, @for and @switch do, and why was this syntax added?',
`They are the built-in control flow in templates. @if shows a block when a condition is true (with @else), @for repeats a block for each item in a collection, and @switch chooses between cases. @for requires a track expression, such as track item.id, which helps Angular reuse DOM elements efficiently, and it has an @empty block.

They replaced *ngIf, *ngFor and *ngSwitch for new code. The new syntax is easier to read, needs no imports, and is faster because the compiler knows more about it.`,
    ['Mention track and @empty to show real use.']),
  A(C, 'experienced', 'What is @defer, and when would you use it?',
`@defer delays loading part of a template and its dependencies until a condition is met, for example when it enters the viewport, on interaction, on idle time or on a timer. The content is split into a separate JavaScript chunk and loaded only then. You can add @placeholder, @loading and @error blocks for the states.

Use it for heavy components below the fold, charts or editors, to improve the first load. Do not defer content visible at first paint, and always test that the placeholder does not cause layout shift.`),
];
