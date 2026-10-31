// Starter exercises for the code playground. Every one runs on its own, with no network. They are starting points to change, not model answers.
export const REACT_EXAMPLES = [
  { id: 'counter', name: 'Counter (start here)', code: `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h2>Counter</h2>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
` },
  { id: 'todo', name: 'Todo application', code: `import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setItems([...items, { id: Date.now(), text: text.trim(), done: false }]);
    setText('');
  };
  const toggle = (id) => setItems(items.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setItems(items.filter((t) => t.id !== id));
  return (
    <div>
      <h2>Todo list</h2>
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New task" />
        <button>Add</button>
      </form>
      {items.length === 0 && <p>Nothing to do yet.</p>}
      <ul>
        {items.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}> {t.text} </span>
            </label>
            <button onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
` },
  { id: 'debounce', name: 'Search box with debounce', code: `import { useState, useEffect } from 'react';

const NAMES = ['Aarav', 'Aisha', 'Amara', 'Ben', 'Chen', 'Diya', 'Elena', 'Farah', 'Grace', 'Hana', 'Ivan', 'Kofi'];

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function App() {
  const [q, setQ] = useState('');
  const term = useDebounce(q);
  const results = term ? NAMES.filter((n) => n.toLowerCase().includes(term.toLowerCase())) : [];
  useEffect(() => { if (term) console.log('Searching for', term); }, [term]);
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a name" />
      <p>Typed: {q} | Searched: {term}</p>
      <ul>{results.map((n) => <li key={n}>{n}</li>)}</ul>
    </div>
  );
}
` },
  { id: 'pagination', name: 'Pagination', code: `import { useState } from 'react';

const ITEMS = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, name: 'Item ' + (i + 1) }));

export default function App({ pageSize = 5 }) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(ITEMS.length / pageSize));
  const slice = ITEMS.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div>
      <ul>{slice.map((x) => <li key={x.id}>{x.name}</li>)}</ul>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
      <span> Page {page} of {pages} </span>
      <button disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
` },
  { id: 'login', name: 'Login form with validation', code: `import { useState } from 'react';

export default function App() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const validate = () => {
    const e = {};
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (form.password.length < 8) e.password = 'Use at least 8 characters.';
    return e;
  };
  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setDone(Object.keys(e).length === 0);
  };
  const set = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });
  return (
    <form onSubmit={submit} noValidate>
      <p><label>Email <input type="email" value={form.email} onChange={set('email')} /></label></p>
      {errors.email && <p style={{ color: 'crimson' }}>{errors.email}</p>}
      <p><label>Password <input type="password" value={form.password} onChange={set('password')} /></label></p>
      {errors.password && <p style={{ color: 'crimson' }}>{errors.password}</p>}
      <button>Log in</button>
      {done && <p style={{ color: 'green' }}>Looks good. (Nothing was sent anywhere.)</p>}
    </form>
  );
}
` },
  { id: 'parent-child', name: 'Parent and child communication', code: `import { useState } from 'react';

function Child({ label, onPress }) {
  return <button onClick={onPress}>{label}</button>;
}

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Parent count: {count}</p>
      <Child label="Add one" onPress={() => setCount((c) => c + 1)} />
      <Child label="Reset" onPress={() => setCount(0)} />
    </div>
  );
}
` },
  { id: 'sort-filter', name: 'Sorting and filtering', code: `import { useState, useMemo } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Notebook', price: 120 },
  { id: 2, name: 'Backpack', price: 950 },
  { id: 3, name: 'Pen set', price: 80 },
  { id: 4, name: 'Desk lamp', price: 640 },
];

export default function App() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('name');
  const visible = useMemo(() => {
    const list = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    return [...list].sort((a, b) => (sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name)));
  }, [q, sort]);
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter" />{' '}
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="name">Sort by name</option>
        <option value="price">Sort by price</option>
      </select>
      <ul>{visible.map((p) => <li key={p.id}>{p.name} - {p.price}</li>)}</ul>
    </div>
  );
}
` },
  { id: 'cart', name: 'Shopping cart', code: `import { useReducer } from 'react';

const CATALOG = [{ id: 1, name: 'Notebook', price: 120 }, { id: 2, name: 'Pen set', price: 80 }, { id: 3, name: 'Desk lamp', price: 640 }];

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const found = state.find((i) => i.id === action.item.id);
      return found ? state.map((i) => (i.id === found.id ? { ...i, qty: i.qty + 1 } : i)) : [...state, { ...action.item, qty: 1 }];
    }
    case 'remove': return state.filter((i) => i.id !== action.id);
    default: return state;
  }
}

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <div>
      {CATALOG.map((p) => <button key={p.id} onClick={() => dispatch({ type: 'add', item: p })}>Add {p.name}</button>)}
      <ul>
        {cart.map((i) => (
          <li key={i.id}>{i.name} x {i.qty} <button onClick={() => dispatch({ type: 'remove', id: i.id })}>Remove</button></li>
        ))}
      </ul>
      <p>Total: {total}</p>
    </div>
  );
}
` },
  { id: 'modal', name: 'Reusable modal', code: `import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'grid', placeItems: 'center' }}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
           style={{ background: 'white', padding: 20, borderRadius: 10, minWidth: 220 }}>
        <h3>{title}</h3>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete item?">
        <p>This cannot be undone. Press Escape or click outside to close.</p>
      </Modal>
    </div>
  );
}
` },
]

export const ANGULAR_EXAMPLES = [
  { id: 'counter', name: 'Counter (start here)', code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <h2>Counter</h2>
    <p>You clicked {{ count() }} times.</p>
    <button (click)="increment()">Click me</button>
  \`,
})
export class App {
  count = signal(0);
  increment() { this.count.update((c) => c + 1); }
}
` },
  { id: 'todo', name: 'Todo application', code: `import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: \`
    <h2>Todo list</h2>
    <form (ngSubmit)="add()">
      <input name="text" [(ngModel)]="text" placeholder="New task" />
      <button>Add</button>
    </form>
    <p>{{ remaining() }} left</p>
    <ul>
      @for (t of items(); track t.id) {
        <li>
          <input type="checkbox" [checked]="t.done" (change)="toggle(t.id)" />
          <span [style.text-decoration]="t.done ? 'line-through' : 'none'"> {{ t.text }} </span>
          <button type="button" (click)="remove(t.id)">Delete</button>
        </li>
      } @empty { <li>Nothing to do yet.</li> }
    </ul>
  \`,
})
export class App {
  text = '';
  items = signal<{ id: number; text: string; done: boolean }[]>([]);
  remaining = computed(() => this.items().filter((t) => !t.done).length);
  add() {
    if (!this.text.trim()) return;
    this.items.update((l) => [...l, { id: Date.now(), text: this.text.trim(), done: false }]);
    this.text = '';
  }
  toggle(id: number) { this.items.update((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); }
  remove(id: number) { this.items.update((l) => l.filter((t) => t.id !== id)); }
}
` },
  { id: 'debounce', name: 'Search box with debounce', code: `import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';

const NAMES = ['Aarav', 'Aisha', 'Amara', 'Ben', 'Chen', 'Diya', 'Elena', 'Farah', 'Grace', 'Hana', 'Ivan', 'Kofi'];

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="q" placeholder="Type a name" />
    <p>Searched: {{ term() }}</p>
    <ul>@for (n of results(); track n) { <li>{{ n }}</li> }</ul>
  \`,
})
export class App {
  q = new FormControl('', { nonNullable: true });
  term = toSignal(this.q.valueChanges.pipe(debounceTime(400), distinctUntilChanged(), tap((t) => t && console.log('Searching for', t))), { initialValue: '' });
  results = () => (this.term() ? NAMES.filter((n) => n.toLowerCase().includes(this.term().toLowerCase())) : []);
}
` },
  { id: 'pagination', name: 'Pagination', code: `import { Component, signal, computed } from '@angular/core';

const ITEMS = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, name: 'Item ' + (i + 1) }));

@Component({
  selector: 'app-root',
  template: \`
    <ul>@for (x of slice(); track x.id) { <li>{{ x.name }}</li> }</ul>
    <button (click)="page.set(page() - 1)" [disabled]="page() === 1">Previous</button>
    <span> Page {{ page() }} of {{ pages() }} </span>
    <button (click)="page.set(page() + 1)" [disabled]="page() === pages()">Next</button>
  \`,
})
export class App {
  size = 5;
  page = signal(1);
  pages = computed(() => Math.max(1, Math.ceil(ITEMS.length / this.size)));
  slice = computed(() => ITEMS.slice((this.page() - 1) * this.size, this.page() * this.size));
}
` },
  { id: 'login', name: 'Login form with validation', code: `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <p><label>Email <input type="email" formControlName="email" /></label></p>
      @if (email.touched && email.errors) { <p style="color: crimson">Enter a valid email.</p> }
      <p><label>Password <input type="password" formControlName="password" /></label></p>
      @if (password.touched && password.errors) { <p style="color: crimson">Use at least 8 characters.</p> }
      <button [disabled]="form.invalid">Log in</button>
      @if (done) { <p style="color: green">Looks good. (Nothing was sent anywhere.)</p> }
    </form>
  \`,
})
export class App {
  done = false;
  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });
  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  submit() { this.done = this.form.valid; }
}
` },
  { id: 'parent-child', name: 'Parent and child communication', code: `import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-child',
  template: \`<button (click)="pressed.emit(step)">Add {{ step }}</button>\`,
})
export class Child {
  @Input() step = 1;                          // data in
  @Output() pressed = new EventEmitter<number>(); // event out
}

@Component({
  selector: 'app-root',
  imports: [Child],
  template: \`
    <p>Total: {{ total() }}</p>
    <app-child [step]="1" (pressed)="add($event)" />
    <app-child [step]="5" (pressed)="add($event)" />
  \`,
})
export class App {
  total = signal(0);
  add(n: number) { this.total.update((t) => t + n); }
}
` },
  { id: 'sort-filter', name: 'Sorting and filtering', code: `import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

const PRODUCTS = [
  { id: 1, name: 'Notebook', price: 120 },
  { id: 2, name: 'Backpack', price: 950 },
  { id: 3, name: 'Pen set', price: 80 },
  { id: 4, name: 'Desk lamp', price: 640 },
];

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: \`
    <input [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Filter" />
    <select [ngModel]="sort()" (ngModelChange)="sort.set($event)">
      <option value="name">Sort by name</option>
      <option value="price">Sort by price</option>
    </select>
    <ul>@for (p of visible(); track p.id) { <li>{{ p.name }} - {{ p.price }}</li> }</ul>
  \`,
})
export class App {
  q = signal('');
  sort = signal<'name' | 'price'>('name');
  visible = computed(() => {
    const t = this.q().toLowerCase();
    const list = PRODUCTS.filter((p) => p.name.toLowerCase().includes(t));
    return [...list].sort((a, b) => (this.sort() === 'price' ? a.price - b.price : a.name.localeCompare(b.name)));
  });
}
` },
  { id: 'cart', name: 'Shopping cart (with a service)', code: `import { Component, Injectable, computed, inject, signal } from '@angular/core';

type Product = { id: number; name: string; price: number };

@Injectable({ providedIn: 'root' })
export class CartService {
  private lines = signal<(Product & { qty: number })[]>([]);
  items = this.lines.asReadonly();
  total = computed(() => this.lines().reduce((s, l) => s + l.price * l.qty, 0));
  add(p: Product) {
    this.lines.update((ls) => ls.some((l) => l.id === p.id)
      ? ls.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l))
      : [...ls, { ...p, qty: 1 }]);
  }
  remove(id: number) { this.lines.update((ls) => ls.filter((l) => l.id !== id)); }
}

@Component({
  selector: 'app-root',
  template: \`
    @for (p of catalog; track p.id) { <button (click)="cart.add(p)">Add {{ p.name }}</button> }
    <ul>
      @for (l of cart.items(); track l.id) {
        <li>{{ l.name }} x {{ l.qty }} <button (click)="cart.remove(l.id)">Remove</button></li>
      }
    </ul>
    <p>Total: {{ cart.total() }}</p>
  \`,
})
export class App {
  cart = inject(CartService);
  catalog: Product[] = [{ id: 1, name: 'Notebook', price: 120 }, { id: 2, name: 'Pen set', price: 80 }, { id: 3, name: 'Desk lamp', price: 640 }];
}
` },
]
