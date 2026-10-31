// Practical coding exercises, Angular edition (standalone components, signals, @if/@for; Angular 20 style).
import { mk } from './lib.mjs';
const A = mk('angular');
const C = 'Angular practical coding';
const f = (code, lang = 'ts') => '```' + lang + '\n' + code.trim() + '\n```';

export const angularPractical = [
  A(C, 'fresher', 'Coding exercise: build a Todo application in Angular.',
`Use a signal for the list, a computed value for the remaining count, and @for with a track expression. Update signals immutably.

${f(`
@Component({
  selector: 'app-todos',
  imports: [FormsModule],
  template: \`
    <form (ngSubmit)="add()">
      <input name="text" [(ngModel)]="text" placeholder="New task" />
      <button>Add</button>
    </form>
    <p>{{ remaining() }} left</p>
    <ul>
      @for (t of items(); track t.id) {
        <li>
          <input type="checkbox" [checked]="t.done" (change)="toggle(t.id)" />
          <span [style.text-decoration]="t.done ? 'line-through' : 'none'">{{ t.text }}</span>
          <button type="button" (click)="remove(t.id)">Delete</button>
        </li>
      } @empty { <li>Nothing to do.</li> }
    </ul>\`,
})
export class Todos {
  text = '';
  items = signal<{ id: string; text: string; done: boolean }[]>([]);
  remaining = computed(() => this.items().filter((t) => !t.done).length);
  add() {
    if (!this.text.trim()) return;
    this.items.update((l) => [...l, { id: crypto.randomUUID(), text: this.text.trim(), done: false }]);
    this.text = '';
  }
  toggle(id: string) { this.items.update((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); }
  remove(id: string) { this.items.update((l) => l.filter((t) => t.id !== id)); }
}`)}

Extras: move the list into an injectable service so other components can share it, and save to localStorage.`,
['Mention that track is required in @for and should be a stable id.']),

  A(C, 'fresher', 'Coding exercise: create a search box with debounce in Angular.',
`Reactive forms expose valueChanges as an observable, so RxJS operators fit naturally: debounceTime waits, distinctUntilChanged skips repeats, and switchMap cancels the older request.

${f(`
@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="q" placeholder="Search" />
    <ul>@for (r of results(); track r.id) { <li>{{ r.name }}</li> }</ul>\`,
})
export class Search {
  private http = inject(HttpClient);
  q = new FormControl('', { nonNullable: true });
  results = toSignal(
    this.q.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => (term ? this.http.get<{ id: number; name: string }[]>('/api/search', { params: { q: term } }) : of([]))),
    ),
    { initialValue: [] },
  );
}`)}

toSignal subscribes and unsubscribes for you, so there is no manual cleanup. switchMap is the key part: when a new term arrives, the previous request is cancelled.`,
['HttpClient needs provideHttpClient() in the app config.']),

  A(C, 'fresher', 'Coding exercise: fetch API data and display it in a table in Angular.',
`Use HttpClient in a service or component. With the newer resource API you get value, loading and error signals; the classic way is an observable with the async pipe or toSignal. Handle loading and error states.

${f(`
@Component({
  selector: 'app-users',
  template: \`
    @if (loading()) { <p>Loading…</p> }
    @else if (failed()) { <p role="alert">Could not load users.</p> }
    @else {
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>City</th></tr></thead>
        <tbody>
          @for (u of users(); track u.id) {
            <tr><td>{{ u.name }}</td><td>{{ u.email }}</td><td>{{ u.address.city }}</td></tr>
          }
        </tbody>
      </table>
    }\`,
})
export class Users {
  private http = inject(HttpClient);
  users = signal<User[]>([]);
  loading = signal(true);
  failed = signal(false);
  constructor() {
    this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').subscribe({
      next: (d) => { this.users.set(d); this.loading.set(false); },
      error: () => { this.failed.set(true); this.loading.set(false); },
    });
  }
}
interface User { id: number; name: string; email: string; address: { city: string } }`)}

HttpClient observables complete by themselves after one response, so no unsubscribe is needed here. The public test API is only an example. Add provideHttpClient() in the app config.`,
['Putting the HTTP call in a service makes it easy to test and reuse.']),

  A(C, 'fresher', 'Coding exercise: implement pagination in Angular.',
`Keep the page number in a signal and compute the visible slice and page count. For big data, send page and limit to the server and show only what it returns.

${f(`
@Component({
  selector: 'app-paged',
  template: \`
    <ul>@for (x of slice(); track x.id) { <li>{{ x.name }}</li> }</ul>
    <button (click)="page.set(page() - 1)" [disabled]="page() === 1">Previous</button>
    <span> Page {{ page() }} of {{ pages() }} </span>
    <button (click)="page.set(page() + 1)" [disabled]="page() === pages()">Next</button>\`,
})
export class Paged {
  items = input.required<{ id: number; name: string }[]>();
  size = 5;
  page = signal(1);
  pages = computed(() => Math.max(1, Math.ceil(this.items().length / this.size)));
  slice = computed(() => {
    const p = Math.min(this.page(), this.pages());
    return this.items().slice((p - 1) * this.size, p * this.size);
  });
}`)}

computed values recalculate only when the signals they read change. For server paging, put the page in the request params and use switchMap or an httpResource.`,
['Show the edge case: page number after the list gets shorter.']),

  A(C, 'fresher', 'Coding exercise: create a login form with validation in Angular.',
`Use a reactive form with built-in validators, show a message only after the field is touched, and disable the button while the form is invalid. The server must validate again.

${f(`
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Email <input type="email" formControlName="email" /></label>
      @if (email.touched && email.errors) {
        <p role="alert">@if (email.errors['required']) { Email is required. } @else { Enter a valid email. }</p>
      }
      <label>Password <input type="password" formControlName="password" /></label>
      @if (password.touched && password.errors) { <p role="alert">Use at least 8 characters.</p> }
      <button [disabled]="form.invalid">Log in</button>
    </form>\`,
})
export class Login {
  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });
  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  submit() { if (this.form.valid) console.log(this.form.getRawValue()); }
}`)}

Mention custom validators (for example confirm password) and typed forms, which give you typed values.`,
['Template-driven forms also work, but reactive forms are easier to test.']),

  A(C, 'fresher', 'Coding exercise: build a parent-child communication example in Angular.',
`Data goes down with input(), and events go up with output(). The parent owns the state, the child displays it and reports what happened.

${f(`
@Component({
  selector: 'app-child',
  template: \`<button (click)="pressed.emit(step())">Add {{ step() }}</button>\`,
})
export class Child {
  step = input(1);          // data in
  pressed = output<number>(); // event out
}

@Component({
  selector: 'app-parent',
  imports: [Child],
  template: \`
    <p>Total: {{ total() }}</p>
    <app-child [step]="5" (pressed)="total.update(t => t + $event)" />\`,
})
export class Parent {
  total = signal(0);
}`)}

Other ways to share data are a shared service (for unrelated components), model() for two-way binding, and viewChild to call a child from the parent. Prefer the simple input and output pair.`,
['Older code uses the @Input() and @Output() decorators with EventEmitter; know both.']),

  A(C, 'both', 'Coding exercise: implement sorting and filtering in Angular.',
`Keep the filter text and sort key as signals and derive the visible list with computed. Copy before sorting so the original list is not changed.

${f(`
@Component({
  selector: 'app-products',
  imports: [FormsModule],
  template: \`
    <input [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Filter" />
    <select [ngModel]="sort()" (ngModelChange)="sort.set($event)">
      <option value="name">Name</option><option value="price">Price</option>
    </select>
    <ul>@for (p of visible(); track p.id) { <li>{{ p.name }} – {{ p.price }}</li> }</ul>\`,
})
export class Products {
  products = input.required<{ id: number; name: string; price: number }[]>();
  q = signal('');
  sort = signal<'name' | 'price'>('name');
  visible = computed(() => {
    const term = this.q().toLowerCase();
    const list = this.products().filter((p) => p.name.toLowerCase().includes(term));
    return [...list].sort((a, b) => (this.sort() === 'price' ? a.price - b.price : a.name.localeCompare(b.name)));
  });
}`)}

The old way is a pipe, but a computed signal is clearer and only recalculates when its inputs change.`,
['Do not put heavy sorting in a method called from the template without a signal; it runs on every check.']),

  A(C, 'both', 'Coding exercise: create a shopping cart in Angular.',
`Put the cart in an injectable service so every component sees the same state. Store it in a signal and derive the count and total with computed.

${f(`
@Injectable({ providedIn: 'root' })
export class CartService {
  private lines = signal<{ id: number; name: string; price: number; qty: number }[]>([]);
  items = this.lines.asReadonly();
  count = computed(() => this.lines().reduce((n, l) => n + l.qty, 0));
  total = computed(() => this.lines().reduce((s, l) => s + l.price * l.qty, 0));
  add(p: { id: number; name: string; price: number }) {
    this.lines.update((ls) =>
      ls.some((l) => l.id === p.id) ? ls.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { ...p, qty: 1 }]);
  }
  remove(id: number) { this.lines.update((ls) => ls.filter((l) => l.id !== id)); }
}

@Component({
  selector: 'app-cart',
  template: \`
    <ul>@for (l of cart.items(); track l.id) {
      <li>{{ l.name }} × {{ l.qty }} <button (click)="cart.remove(l.id)">Remove</button></li>
    }</ul>
    <p>Total: {{ cart.total() }}</p>\`,
})
export class CartView { cart = inject(CartService); }`)}

Exposing asReadonly stops components changing the list directly. Save the cart to localStorage with an effect, and always recheck prices on the server at checkout.`,
['Mention NgRx or the signal store when the state gets large.']),

  A(C, 'both', 'Coding exercise: implement JWT authentication in an Angular app.',
`The login call returns a signed token. An HTTP interceptor adds it to each request, and a route guard blocks pages when there is no token. An httpOnly cookie set by the server is safer than localStorage because scripts cannot read it. Know that trade-off.

${f(`
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const authed = token ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } }) : req;
  return next(authed).pipe(
    catchError((err) => {
      if (err.status === 401) { localStorage.removeItem('token'); inject(Router).navigateByUrl('/login'); }
      return throwError(() => err);
    }),
  );
};

// auth.guard.ts
export const authGuard: CanActivateFn = () =>
  localStorage.getItem('token') ? true : inject(Router).parseUrl('/login');

// app.config.ts
provideHttpClient(withInterceptors([authInterceptor]));

// routes
export const routes: Routes = [
  { path: 'account', canActivate: [authGuard], loadComponent: () => import('./account').then((m) => m.Account) },
];`)}

On the server, hash passwords with bcrypt, sign with a secret from the environment and a short expiry, and verify the token in middleware. A guard only hides pages; the API must enforce access.`,
['Mention refresh tokens, logout and expiry handling.']),

  A(C, 'both', 'Coding exercise: build a reusable modal component in Angular.',
`Make a standalone component that gets its title and open state from inputs, emits a close event, and projects its body with ng-content so any content can go inside. Close on Escape and on the backdrop click.

${f(`
@Component({
  selector: 'app-modal',
  host: { '(document:keydown.escape)': 'closed.emit()' },
  template: \`
    @if (open()) {
      <div class="backdrop" (click)="closed.emit()">
        <div class="box" role="dialog" aria-modal="true" [attr.aria-label]="title()" (click)="$event.stopPropagation()">
          <h2>{{ title() }}</h2>
          <ng-content />
          <button (click)="closed.emit()">Close</button>
        </div>
      </div>
    }\`,
})
export class Modal {
  open = input(false);
  title = input('');
  closed = output<void>();
}

// Use it
// <app-modal [open]="show()" title="Delete item?" (closed)="show.set(false)">
//   <p>This cannot be undone.</p>
// </app-modal>`)}

For a complete answer, add focus handling (the Angular CDK Dialog does focus trapping for you) and stop the page behind from scrolling.`,
['The CDK Dialog is a good production answer; the hand-built one shows you understand the pieces.']),

  A(C, 'both', 'Coding exercise: implement lazy loading in Angular.',
`Lazy load routes with loadComponent or loadChildren so their code is a separate file downloaded on first visit. For parts of a template use @defer, and for images use the native loading attribute or NgOptimizedImage.

${f(`
// app.routes.ts
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin', loadComponent: () => import('./admin/admin').then((m) => m.Admin) },
  { path: 'shop', loadChildren: () => import('./shop/shop.routes').then((m) => m.SHOP_ROUTES) },
];`)}

In a template, @defer loads a heavy part only when it scrolls into view:

${f(`
@defer (on viewport) {
  <app-big-chart />
} @placeholder {
  <p>Chart will load…</p>
} @loading {
  <p>Loading…</p>
}`, 'html')}

Check the result in the build output: lazy chunks appear as separate files. Do not defer anything visible at first paint.`,
['Preloading strategies can fetch lazy routes in the background after the first load.']),

  A(C, 'both', 'Coding exercise: create a file upload component in Angular.',
`Use a file input, check type and size for a quick message, send FormData with HttpClient (leave Content-Type alone), and use reportProgress to show progress. The server checks the file again.

${f(`
@Component({
  selector: 'app-upload',
  template: \`
    <input type="file" accept="image/png,image/jpeg" (change)="pick($event)" />
    @if (progress() > 0 && progress() < 100) { <progress [value]="progress()" max="100"></progress> }
    <p role="status">{{ status() }}</p>\`,
})
export class Upload {
  private http = inject(HttpClient);
  progress = signal(0);
  status = signal('');
  pick(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return this.status.set('Only PNG or JPG.');
    if (file.size > 2 * 1024 * 1024) return this.status.set('Maximum size is 2 MB.');
    const body = new FormData();
    body.append('file', file);
    this.http.post('/api/upload', body, { reportProgress: true, observe: 'events' }).subscribe({
      next: (ev) => {
        if (ev.type === HttpEventType.UploadProgress && ev.total) this.progress.set(Math.round((100 * ev.loaded) / ev.total));
        if (ev.type === HttpEventType.Response) this.status.set('Uploaded.');
      },
      error: () => this.status.set('Upload failed.'),
    });
  }
}`)}

Unlike fetch, HttpClient can report upload progress, which is a good point to mention.`,
['Mention drag and drop, and checking the real file type on the server.']),

  A(C, 'both', 'Coding exercise: build an autocomplete dropdown in Angular.',
`Combine a form control, debounced valueChanges, a list of matches and keyboard control. Angular Material has an autocomplete, but be ready to build a simple one.

${f(`
@Component({
  selector: 'app-autocomplete',
  imports: [ReactiveFormsModule],
  template: \`
    <input role="combobox" [attr.aria-expanded]="matches().length > 0" [formControl]="q"
           (keydown.arrowdown)="move(1, $event)" (keydown.arrowup)="move(-1, $event)" (keydown.enter)="choose(matches()[active()])" />
    @if (matches().length) {
      <ul role="listbox">
        @for (m of matches(); track m; let i = $index) {
          <li role="option" [attr.aria-selected]="i === active()" (mousedown)="choose(m)">{{ m }}</li>
        }
      </ul>
    }\`,
})
export class Autocomplete {
  options = input.required<string[]>();
  picked = output<string>();
  q = new FormControl('', { nonNullable: true });
  active = signal(0);
  private term = toSignal(this.q.valueChanges.pipe(debounceTime(200)), { initialValue: '' });
  matches = computed(() => {
    const t = this.term().toLowerCase();
    return t ? this.options().filter((o) => o.toLowerCase().includes(t)).slice(0, 6) : [];
  });
  move(d: number, e: Event) { e.preventDefault(); this.active.update((a) => Math.max(0, Math.min(a + d, this.matches().length - 1))); }
  choose(v?: string) { if (v) { this.q.setValue(v, { emitEvent: false }); this.picked.emit(v); this.active.set(0); } }
}`)}

For remote data, replace the computed with a switchMap to the API so older requests are cancelled.`,
['mousedown fires before the input loses focus, so the click is not lost.']),

  A(C, 'both', 'Coding exercise: implement infinite scrolling in Angular.',
`Watch a sentinel element at the end of the list with IntersectionObserver and load the next page when it appears. Clean up the observer when the component is destroyed.

${f(`
@Component({
  selector: 'app-feed',
  template: \`
    <ul>@for (x of items(); track x.id) { <li>{{ x.title }}</li> }</ul>
    <div #end>{{ busy() ? 'Loading…' : done() ? 'No more items.' : '' }}</div>\`,
})
export class Feed implements AfterViewInit, OnDestroy {
  private http = inject(HttpClient);
  items = signal<{ id: number; title: string }[]>([]);
  busy = signal(false);
  done = signal(false);
  private page = 0;
  private io?: IntersectionObserver;
  end = viewChild<ElementRef<HTMLElement>>('end');

  ngAfterViewInit() {
    this.load();
    this.io = new IntersectionObserver(([e]) => e.isIntersecting && this.load(), { rootMargin: '200px' });
    this.io.observe(this.end()!.nativeElement);
  }
  load() {
    if (this.busy() || this.done()) return;
    this.busy.set(true);
    this.http.get<{ items: { id: number; title: string }[] }>('/api/posts', { params: { page: ++this.page, limit: 20 } }).subscribe({
      next: (d) => { this.items.update((l) => [...l, ...d.items]); if (d.items.length < 20) this.done.set(true); this.busy.set(false); },
      error: () => this.busy.set(false),
    });
  }
  ngOnDestroy() { this.io?.disconnect(); }
}`)}

Trade-offs to mention: offer a "Load more" button for keyboard users, and use the CDK virtual scroll for very long lists.`,
['The busy flag stops the same page being requested twice.']),

  A(C, 'experienced', 'Coding exercise: debug unnecessary component rendering in Angular.',
`First measure. Angular DevTools has a Profiler that shows which components ran change detection and how long it took. Then fix the cause.

The usual fixes: use ChangeDetectionStrategy.OnPush so a component is checked only when its inputs change, an event fires inside it, or a signal it reads changes; do not call functions or build new arrays in the template (they run on every check); use track in @for so rows are reused; and move heavy work into computed signals.

${f(`
// Before: the method runs on every change detection, and the list is rebuilt each time
// <li *ngFor="let u of getActive()">{{ u.name }}</li>
class Before { getActive() { return this.users.filter((u) => u.active); } }

// After: OnPush, a computed signal and a track expression
@Component({
  selector: 'app-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<ul>@for (u of active(); track u.id) { <li>{{ u.name }}</li> }</ul>\`,
})
export class Users {
  users = input.required<{ id: number; name: string; active: boolean }[]>();
  active = computed(() => this.users().filter((u) => u.active));
}`)}

With OnPush, change objects instead of mutating them, or the view will not update. Zoneless change detection (provideZonelessChangeDetection) goes further by running checks only when signals or events say so; check the Angular documentation for its status in your version.`,
['Show the evidence from the Profiler before and after.', 'Avoid subscribing manually in components; async pipe and toSignal clean up for you.']),
];
