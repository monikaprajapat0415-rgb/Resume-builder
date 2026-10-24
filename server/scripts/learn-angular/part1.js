import { n, A } from './helpers.js';

// Angular course, lessons 1-25. Keys are lesson titles exactly as in the admin.
export const part1 = {
  'What is Angular? A Beginner\'s Introduction': A('What Angular does for you', [
    n('code', 'Your code', 'TypeScript + HTML', 0, 0, 'app'), n('ng', 'Angular', 'framework', 1, 0, 'model'),
    n('browser', 'Browser', 'runs the app', 2, 0, 'tool'), n('user', 'User', 'sees a fast page', 3, 0, 'user'),
    n('state', 'Data', 'changes over time', 1, 1, 'data'),
  ], [
    { say: 'Angular is a framework from Google for building web apps, written in TypeScript.', on: ['ng'] },
    { say: 'You build the screen from components: small pieces made of a class, a template and styles.', flow: ['code>ng:components'] },
    { say: 'Angular gives you routing, forms, HTTP and testing tools in one place, so you do not choose each one yourself.', on: ['ng'] },
    { say: 'When your data changes, Angular updates only the parts of the page that need it.', flow: ['state>ng:change'] },
    { say: 'The browser runs the finished app and the user sees a fast, interactive page.', flow: ['ng>browser:build', 'browser>user:page'] },
  ]),
  'TypeScript Basics for Angular': A('TypeScript catches mistakes early', [
    n('ts', 'TypeScript', 'types + JavaScript', 0, 0, 'app'), n('check', 'Type check', 'while you write', 1, 0, 'check'),
    n('err', 'Error shown', 'before you run', 1, 1, 'tool'), n('js', 'JavaScript', 'what the browser runs', 2, 0, 'out'),
  ], [
    { say: 'TypeScript is JavaScript with types. You say what kind of value a variable, input or function holds.', on: ['ts'] },
    { say: 'The compiler and your editor check those types while you type.', flow: ['ts>check:types'] },
    { say: 'If you pass a number where text is expected, you see the error at once, not later in the browser.', flow: ['check>err:mismatch'] },
    { say: 'Interfaces, classes and decorators are the parts of TypeScript you will use most in Angular.', on: ['ts'] },
    { say: 'When everything checks out, TypeScript is turned into plain JavaScript for the browser.', flow: ['check>js:compile'] },
  ]),
  'Install Node.js and the Angular CLI': A('Setting up your computer', [
    n('node', 'Node.js', 'runs tools', 0, 0, 'tool'), n('npm', 'npm', 'installs packages', 1, 0, 'store'),
    n('cli', 'Angular CLI', 'the ng command', 2, 0, 'model'), n('ver', 'ng version', 'check it works', 2, 1, 'check'),
    n('app', 'Your projects', 'ng new, ng serve', 3, 0, 'app'),
  ], [
    { say: 'Install Node.js first. Angular tools run on it.', on: ['node'] },
    { say: 'Node comes with npm, the package manager that downloads tools and libraries.', flow: ['node>npm:includes'] },
    { say: 'Use npm to install the Angular CLI, which gives you the ng command.', flow: ['npm>cli:install'] },
    { say: 'Run ng version to confirm that it is installed.', flow: ['cli>ver:check'] },
    { say: 'Now ng can create, run and build projects for you.', flow: ['cli>app:ng new'] },
  ]),
  'Angular Course Roadmap and Complete Topic Index (Beginner to Advanced)': A('The course path', [
    n('basics', 'Basics', 'components, templates', 0, 0, 'app'), n('state', 'State and forms', 'signals, services', 1, 0, 'tool'),
    n('data', 'Routing and HTTP', 'real apps', 2, 0, 'data'), n('adv', 'Advanced', 'RxJS, SSR, testing', 3, 0, 'model'),
    n('proj', 'Projects', 'build and deploy', 3, 1, 'out'),
  ], [
    { say: 'Start with the basics: your first app, components and templates.', on: ['basics'] },
    { say: 'Next you manage state with signals and services, and collect input with forms.', flow: ['basics>state:then'] },
    { say: 'Then connect real data: routing between pages and HTTP calls to an API.', flow: ['state>data:then'] },
    { say: 'Advanced topics follow: RxJS, change detection, server-side rendering, testing and security.', flow: ['data>adv:then'] },
    { say: 'Projects tie it together, and the last lessons show how to deploy.', flow: ['adv>proj:apply'] },
  ]),
  'Create Your First Angular App with the CLI': A('From ng new to the browser', [
    n('new', 'ng new', 'create project', 0, 0, 'tool'), n('files', 'Project files', 'src, angular.json', 1, 0, 'store'),
    n('serve', 'ng serve', 'dev server', 2, 0, 'app'), n('browser', 'Browser', 'localhost:4200', 3, 0, 'user'),
    n('edit', 'You edit code', 'saved', 2, 1, 'check'),
  ], [
    { say: 'Run ng new and answer the questions. The CLI creates a complete project.', flow: ['new>files:generates'] },
    { say: 'Move into the folder and run ng serve to start the development server.', flow: ['files>serve:ng serve'] },
    { say: 'Open localhost:4200 in the browser and your first app appears.', flow: ['serve>browser:page'] },
    { say: 'Change a file and save it. The browser reloads by itself.', flow: ['edit>serve:save', 'serve>browser:reload'] },
  ]),
  'Angular Project Structure Explained': A('Where things live in a project', [
    n('main', 'main.ts', 'starts the app', 0, 0, 'tool'), n('cfg', 'app.config.ts', 'providers', 1, 0, 'store'),
    n('root', 'App component', 'the root', 2, 0, 'app'), n('routes', 'app.routes.ts', 'pages', 2, 1, 'data'),
    n('page', 'index.html', 'one host page', 3, 0, 'out'),
  ], [
    { say: 'main.ts is the entry point. It starts the app.', on: ['main'] },
    { say: 'It passes in app.config.ts, where you list app-wide settings and services.', flow: ['main>cfg:config'] },
    { say: 'It then loads the root component, which holds the page layout.', flow: ['cfg>root:bootstrap'] },
    { say: 'app.routes.ts says which component shows for each URL.', flow: ['routes>root:routes'] },
    { say: 'The result is drawn inside index.html, the single page the browser loads.', flow: ['root>page:renders'] },
  ]),
  'Your First Angular Component': A('Inside a component', [
    n('ts', 'Class', 'data and methods', 0, 0, 'app'), n('html', 'Template', 'what you see', 1, 0, 'out'),
    n('css', 'Styles', 'how it looks', 2, 0, 'tool'), n('sel', 'Selector', '<app-hello>', 1, 1, 'data'),
    n('page', 'Parent page', 'uses the tag', 2, 1, 'user'),
  ], [
    { say: 'A component is a class with a decorator that tells Angular how to use it.', on: ['ts'] },
    { say: 'Its template is HTML that shows the data from the class.', flow: ['ts>html:data'] },
    { say: 'Its styles apply only to this component.', flow: ['html>css:styled by'] },
    { say: 'The selector gives it a custom tag name.', flow: ['ts>sel:selector'] },
    { say: 'Put that tag in another template, and Angular draws your component there.', flow: ['sel>page:use tag'] },
  ]),
  'Angular CLI Guide: ng new, ng update, Multiple Apps and Multiple Angular Versions': A('Common CLI commands', [
    n('cli', 'Angular CLI', 'ng', 1, 0, 'model'), n('new', 'ng new', 'start a project', 0, 0, 'app'),
    n('gen', 'ng generate', 'components, services', 2, 0, 'tool'), n('upd', 'ng update', 'upgrade versions', 0, 1, 'check'),
    n('build', 'ng build', 'production files', 2, 1, 'out'),
  ], [
    { say: 'The Angular CLI is one tool for the whole life of a project.', on: ['cli'] },
    { say: 'ng new creates a project. You can keep several apps side by side in separate folders.', flow: ['cli>new:create'] },
    { say: 'ng generate makes components, services and more with the right files and names.', flow: ['cli>gen:generate'] },
    { say: 'ng update upgrades Angular and runs migrations that change your code for you. Upgrade one major version at a time.', flow: ['cli>upd:upgrade'] },
    { say: 'ng build creates the optimised files you deploy.', flow: ['gen>build:build'] },
  ]),
  'Displaying Data in Angular with Interpolation': A('Interpolation', [
    n('cls', 'Component class', 'title = "Hello"', 0, 0, 'app'), n('tpl', 'Template', '{{ title }}', 1, 0, 'tool'),
    n('page', 'Page', 'shows Hello', 2, 0, 'out'), n('chg', 'Value changes', 'title = "Hi"', 1, 1, 'data'),
  ], [
    { say: 'A class property holds a value, for example title.', on: ['cls'] },
    { say: 'In the template, double curly braces read that value.', flow: ['cls>tpl:value'] },
    { say: 'Angular turns it into text on the page.', flow: ['tpl>page:renders'] },
    { say: 'When the property changes, the text on the page updates.', flow: ['chg>cls:update', 'cls>tpl:notify', 'tpl>page:new text'] },
    { say: 'You can also write small expressions inside the braces, such as a calculation.', on: ['tpl'] },
  ]),
  'Property Binding and Event Binding in Angular': A('Data in, events out', [
    n('cls', 'Component class', 'data and methods', 0, 0, 'app'), n('el', 'Element', 'button or input', 1, 0, 'tool'),
    n('user', 'User', 'clicks', 2, 0, 'user'), n('h', 'Handler method', 'runs on click', 1, 1, 'check'),
  ], [
    { say: 'Square brackets bind a class value to an element property, like [disabled]="isBusy".', flow: ['cls>el:[property]'] },
    { say: 'The element always shows the current value. Angular keeps it in sync.', on: ['el'] },
    { say: 'Round brackets listen to events, like (click)="save()".', flow: ['user>el:click'] },
    { say: 'The event calls your method in the component class.', flow: ['el>h:(event)'] },
    { say: 'The method changes the data, and property bindings update the screen.', flow: ['h>cls:change'] },
  ]),
  'Angular Two-Way Binding: ngModel, ngModelChange and Input Events': A('Two-way binding with ngModel', [
    n('cls', 'Property', 'name', 0, 0, 'app'), n('in', 'Input box', '[(ngModel)]', 1, 0, 'tool'),
    n('user', 'User types', 'Priya', 2, 0, 'user'), n('page', 'Text on page', '{{ name }}', 1, 1, 'out'),
  ], [
    { say: 'Two-way binding keeps a property and an input in sync in both directions.', on: ['in'] },
    { say: 'Property to input: the box shows the current value of name.', flow: ['cls>in:value'] },
    { say: 'Input to property: when the user types, name is updated.', flow: ['user>in:typing', 'in>cls:new value'] },
    { say: 'Anything else that shows name now shows the new value too.', flow: ['cls>page:updated'] },
    { say: 'The banana-in-a-box [(ngModel)] is shorthand for a property binding plus an event binding.', on: ['in'] },
  ]),
  'Angular Signals: Reactive State for Beginners': A('How a signal works', [
    n('sig', 'Signal', 'count = signal(0)', 0, 0, 'data'), n('tpl', 'Template', '{{ count() }}', 1, 0, 'tool'),
    n('set', 'set / update', 'change the value', 0, 1, 'app'), n('page', 'Page', 'updates itself', 2, 0, 'out'),
  ], [
    { say: 'A signal holds a value and tells Angular whenever that value changes.', on: ['sig'] },
    { say: 'You read it by calling it like a function: count().', flow: ['sig>tpl:count()'] },
    { say: 'The template now depends on the signal.', flow: ['tpl>page:shows 0'] },
    { say: 'Call set or update to change the value.', flow: ['set>sig'] },
    { say: 'Angular knows exactly which parts of the page used the signal, and refreshes only those.', flow: ['sig>tpl:notify', 'tpl>page:shows 1'] },
  ]),
  'Angular Styling: Global Styles, Component Styles, View Encapsulation, Bootstrap and Font Awesome': A('Where styles apply', [
    n('glob', 'styles.css', 'whole app', 0, 0, 'store'), n('comp', 'Component CSS', 'only this component', 1, 0, 'app'),
    n('enc', 'View encapsulation', 'keeps styles inside', 2, 0, 'check'), n('lib', 'Bootstrap, icons', 'libraries', 0, 1, 'tool'),
    n('page', 'Rendered page', 'combined result', 2, 1, 'out'),
  ], [
    { say: 'Global styles in styles.css apply to every page of the app.', on: ['glob'] },
    { say: 'Component styles apply only to that component.', on: ['comp'] },
    { say: 'View encapsulation is how Angular keeps a component\'s styles from leaking out.', flow: ['comp>enc:scoped'] },
    { say: 'Libraries such as Bootstrap and Font Awesome are added once and used through classes.', flow: ['lib>glob'] },
    { say: 'The browser combines all of them into the final look.', flow: ['enc>page:styles', 'glob>comp:inherit'] },
  ]),
  'Conditional Rendering in Angular with @if, @else and @switch': A('Showing the right block', [
    n('cond', 'Condition', 'loggedIn()', 0, 0, 'data'), n('if', '@if', 'true: show this', 1, 0, 'app'),
    n('else', '@else', 'false: show that', 1, 1, 'tool'), n('sw', '@switch', 'one of many cases', 2, 1, 'check'),
    n('page', 'Page', 'only one block', 2, 0, 'out'),
  ], [
    { say: 'Control flow decides which parts of the template exist at all.', on: ['cond'] },
    { say: '@if shows its block when the condition is true.', flow: ['cond>if:true'] },
    { say: '@else gives the block for when it is false.', flow: ['cond>else:false'] },
    { say: 'Only the matching block is added to the page. The other is not in the page at all.', flow: ['if>page:renders'] },
    { say: '@switch picks one block out of many cases, like the status of an order.', flow: ['else>sw:many cases'] },
  ]),
  'Rendering Lists in Angular with @for and track': A('A list with @for', [
    n('arr', 'Array', 'items', 0, 0, 'data'), n('for', '@for', 'repeat the block', 1, 0, 'app'),
    n('track', 'track item.id', 'identity of each', 1, 1, 'check'), n('dom', 'List items', 'one per item', 2, 0, 'out'),
  ], [
    { say: 'You have an array of items, such as products.', on: ['arr'] },
    { say: '@for repeats its block once for each item.', flow: ['arr>for:each item'] },
    { say: 'The track expression tells Angular which item is which, usually its id.', flow: ['for>track:track'] },
    { say: 'The page gets one element per item.', flow: ['for>dom:renders'] },
    { say: 'When the array changes, Angular uses the tracking to add, move or remove only what changed.', flow: ['track>dom:minimal updates'] },
  ]),
  'Angular ngIf, ngFor, ngSwitch and trackBy: Legacy Syntax and Migration': A('Old syntax to new syntax', [
    n('old', '*ngIf, *ngFor', 'older directives', 0, 0, 'store'), n('mig', 'Migration', 'ng generate migration', 1, 0, 'tool'),
    n('new', '@if, @for, @switch', 'built-in control flow', 2, 0, 'app'), n('app', 'Your app', 'still works', 3, 0, 'out'),
  ], [
    { say: 'Older Angular code uses *ngIf, *ngFor and *ngSwitch, which you still meet in many projects.', on: ['old'] },
    { say: 'trackBy was the old way to track list items. @for uses a track expression instead.', on: ['old'] },
    { say: 'Angular provides a migration that converts templates to the new control flow for you.', flow: ['old>mig:convert'] },
    { say: 'The result is the same behaviour with the built-in @if, @for and @switch blocks.', flow: ['mig>new:rewrites'] },
    { say: 'Review the changes and run your tests. Your app keeps working.', flow: ['new>app:check'] },
  ]),
  'Angular ngClass, ngStyle, Class Binding and Style Binding Explained': A('Changing classes and styles', [
    n('state', 'Component state', 'isActive, size', 0, 1, 'data'), n('cb', '[class.active]', 'one class', 1, 0, 'app'),
    n('ng', '[ngClass]', 'many classes', 1, 1, 'tool'), n('sb', '[style.width.px]', 'one style', 1, 2, 'check'),
    n('el', 'Element', 'updated live', 2, 1, 'out'),
  ], [
    { say: 'State in your component decides how an element looks.', on: ['state'] },
    { say: 'A class binding adds or removes a single class when the value is true or false.', flow: ['state>cb:true or false'] },
    { say: 'ngClass handles several classes at once, from an object or a list.', flow: ['state>ng:many'] },
    { say: 'A style binding sets one CSS property, with a unit if you need it.', flow: ['state>sb:value'] },
    { say: 'The element updates whenever the state changes.', flow: ['sb>el:applied', 'ng>el:applied'] },
  ]),
  'Computed Signals and Effects in Angular': A('Computed values and effects', [
    n('a', 'price signal', 'writable', 0, 0, 'data'), n('b', 'qty signal', 'writable', 0, 1, 'data'),
    n('c', 'total computed', 'price x qty', 1, 0, 'model'), n('e', 'effect', 'side effect', 2, 0, 'tool'),
    n('out', 'Log or save', 'outside the template', 3, 0, 'out'),
  ], [
    { say: 'Some values depend on others. A computed signal calculates one from other signals.', on: ['c'] },
    { say: 'total reads price and quantity.', flow: ['a>c:read', 'b>c:read'] },
    { say: 'When either changes, total is recalculated. It is also cached until then.', flow: ['b>c:changed'] },
    { say: 'An effect runs code whenever the signals it reads change.', flow: ['c>e:reads'] },
    { say: 'Use effects for things like logging or saving to storage, not to calculate values.', flow: ['e>out:side effect'] },
  ]),
  'Signals in Practice: Build a Shopping Cart': A('A cart built with signals', [
    n('items', 'items signal', 'cart lines', 0, 0, 'data'), n('add', 'Add button', 'update()', 0, 1, 'user'),
    n('count', 'count computed', 'number of items', 1, 0, 'model'), n('total', 'total computed', 'sum of prices', 2, 0, 'model'),
    n('ui', 'Cart view', 'updates itself', 3, 0, 'out'),
  ], [
    { say: 'The cart keeps its lines in one signal.', on: ['items'] },
    { say: 'Pressing Add updates the signal with a new line.', flow: ['add>items'] },
    { say: 'The item count is a computed signal that reads the lines.', flow: ['items>count:read'] },
    { say: 'The total is another computed signal, so it is always correct.', flow: ['count>total:also read'] },
    { say: 'The cart view shows both values and refreshes with no extra code.', flow: ['total>ui:render'] },
  ]),
  'Angular Component Inputs: Pass Data to Child Components': A('Passing data down with input()', [
    n('parent', 'Parent', 'has the data', 0, 0, 'app'), n('tpl', 'Parent template', '[product]="p"', 1, 0, 'tool'),
    n('child', 'Child component', 'product = input()', 2, 0, 'model'), n('view', 'Child view', 'shows it', 3, 0, 'out'),
  ], [
    { say: 'A parent often needs to give data to a child component.', on: ['parent'] },
    { say: 'In the parent template, bind the value to the child\'s input with square brackets.', flow: ['parent>tpl:value'] },
    { say: 'The child declares the input with input() or input.required().', flow: ['tpl>child:[product]'] },
    { say: 'Inside the child, read it by calling product().', flow: ['child>view:product()'] },
    { say: 'Data flows one way, from parent to child. When the parent value changes, the child updates.', on: ['parent', 'child'] },
  ]),
  'Angular Component Outputs and Two-Way Binding with model()': A('Sending events up', [
    n('child', 'Child', 'output() or model()', 0, 0, 'model'), n('ev', 'Event', 'saved', 1, 0, 'tool'),
    n('parent', 'Parent', 'handles it', 2, 0, 'app'), n('data', 'Parent data', 'updated', 1, 1, 'data'),
  ], [
    { say: 'A child tells its parent that something happened with an output.', on: ['child'] },
    { say: 'The child emits an event, optionally with a value.', flow: ['child>ev:emit'] },
    { say: 'The parent listens with round brackets and runs its own method.', flow: ['ev>parent:(saved)'] },
    { say: 'model() combines an input and an output, so the child can change a value the parent owns.', flow: ['parent>data:update'] },
    { say: 'With model(), the parent can use [(value)] for two-way binding with the child.', flow: ['data>child:new value'] },
  ]),
  'Angular Pipes: Format Dates, Currency and Text': A('A pipe formats a value', [
    n('val', 'Raw value', '1730000000000', 0, 0, 'data'), n('pipe', 'Pipe', '| date', 1, 0, 'tool'),
    n('out', 'Shown text', '24 Oct 2026', 2, 0, 'out'), n('cur', 'currency pipe', '| currency', 1, 1, 'check'),
  ], [
    { say: 'A pipe changes how a value is shown, without changing the value itself.', on: ['pipe'] },
    { say: 'Put the raw value in the template and add a pipe after the bar sign.', flow: ['val>pipe:value'] },
    { say: 'The date pipe turns a timestamp into readable text in the format you choose.', flow: ['pipe>out:formatted'] },
    { say: 'The currency pipe adds the symbol and decimals. Uppercase and lowercase pipes change text.', flow: ['val>cur:number'] },
    { say: 'Pipes can take options and can be chained one after another.', on: ['pipe', 'cur'] },
  ]),
  'Angular Built-in Pipes: Date, Async, KeyValue and Using Pipes in Code': A('More built-in pipes', [
    n('obs', 'Observable', 'data over time', 0, 0, 'data'), n('async', 'async pipe', 'subscribes for you', 1, 0, 'tool'),
    n('view', 'Template', 'shows the value', 2, 0, 'out'), n('kv', 'keyvalue pipe', 'object to list', 1, 1, 'check'),
    n('code', 'Pipe in code', 'new DatePipe()', 2, 1, 'app'),
  ], [
    { say: 'The async pipe subscribes to an observable or promise and shows its latest value.', flow: ['obs>async:subscribe'] },
    { say: 'It also unsubscribes when the component is destroyed, so you cannot forget to.', flow: ['async>view:value'] },
    { say: 'The keyvalue pipe lets you loop over the keys and values of an object.', flow: ['obs>kv:object'] },
    { say: 'You can also use a pipe in TypeScript, by injecting it or creating it and calling transform.', flow: ['kv>code:transform'] },
  ]),
  'Angular Lifecycle Hooks: OnInit, OnDestroy, OnChanges, DoCheck and More': A('Component life', [
    n('create', 'Created', 'constructor', 0, 0, 'app'), n('init', 'ngOnInit', 'start work', 1, 0, 'model'),
    n('chg', 'ngOnChanges', 'inputs changed', 2, 0, 'tool'), n('after', 'AfterViewInit', 'view is ready', 3, 0, 'check'),
    n('dest', 'ngOnDestroy', 'clean up', 3, 1, 'out'),
  ], [
    { say: 'A component has a life: it is created, it updates, then it is removed.', on: ['create'] },
    { say: 'ngOnInit runs once after the inputs are set. It is the place to load initial data.', flow: ['create>init:then'] },
    { say: 'ngOnChanges runs when an input value changes. DoCheck runs on every change detection.', flow: ['init>chg:inputs'] },
    { say: 'ngAfterViewInit runs once the view and child components exist.', flow: ['chg>after:view'] },
    { say: 'ngOnDestroy runs just before removal. Stop timers and subscriptions here.', flow: ['after>dest:removed'] },
  ]),
  'Template Reference Variables, ng-container, ViewChild and ContentChild in Angular': A('Reaching elements and content', [
    n('ref', '#box', 'template variable', 0, 0, 'tool'), n('vc', 'viewChild()', 'in your own view', 1, 0, 'app'),
    n('cc', 'contentChild()', 'content passed in', 2, 0, 'model'), n('ngc', 'ng-container', 'no extra element', 1, 1, 'check'),
    n('use', 'Your code', 'uses the element', 2, 1, 'out'),
  ], [
    { say: 'A template reference variable, like #box, gives a name to an element or component in the template.', on: ['ref'] },
    { say: 'viewChild() lets your class get hold of something inside its own template.', flow: ['ref>vc:find'] },
    { say: 'contentChild() gets something the parent projected into your component.', flow: ['vc>cc:vs content'] },
    { say: 'ng-container groups elements or holds an @if without adding an extra element to the page.', on: ['ngc'] },
    { say: 'Once you have the reference, you can call its methods or read its value.', flow: ['vc>use:use it'] },
  ]),
};
