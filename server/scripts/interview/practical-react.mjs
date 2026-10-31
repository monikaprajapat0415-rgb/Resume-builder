// Practical coding exercises, React edition. Model answers contain ```code``` blocks (shown as code on the site).
import { mk } from './lib.mjs';
const A = mk('react');
const C = 'React practical coding';
const f = (code) => '```jsx\n' + code.trim() + '\n```';

export const reactPractical = [
  A(C, 'fresher', 'Coding exercise: build a Todo application in React.',
`Keep the list in state, add with a form, toggle and delete by id. Use a stable id as the key, never the array index, and never change the state array directly.

${f(`
function Todos() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setItems([...items, { id: crypto.randomUUID(), text: text.trim(), done: false }]);
    setText('');
  };
  const toggle = (id) => setItems(items.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setItems(items.filter((t) => t.id !== id));
  return (
    <form onSubmit={add}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New task" />
      <button>Add</button>
      <ul>{items.map((t) => (
        <li key={t.id}>
          <label><input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span></label>
          <button type="button" onClick={() => remove(t.id)}>Delete</button>
        </li>))}</ul>
    </form>
  );
}`)}

Extras that impress: save to localStorage, an empty-state message, and filters for all, active and done.`,
['Say out loud that you copy arrays and objects instead of mutating them.', 'Mention accessibility: a label for the input and real buttons.']),

  A(C, 'fresher', 'Coding exercise: create a search box with debounce in React.',
`Debounce means waiting until the user stops typing for a short time before doing the work. Put the delay in a small custom hook and clean up the timer so old values never fire.

${f(`
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function Search() {
  const [q, setQ] = useState('');
  const term = useDebounce(q);
  useEffect(() => {
    if (!term) return;
    const ctrl = new AbortController();
    fetch('/api/search?q=' + encodeURIComponent(term), { signal: ctrl.signal })
      .then((r) => r.json()).then(console.log).catch(() => {});
    return () => ctrl.abort();
  }, [term]);
  return <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />;
}`)}

The cleanup function clears the timer when the value changes, and AbortController cancels the older request so a slow response cannot overwrite a newer one.`,
['Explain debounce (wait until typing stops) versus throttle (at most once per interval).']),

  A(C, 'fresher', 'Coding exercise: fetch API data and display it in a table in React.',
`Track three states: loading, error and data. Fetch in an effect, cancel on unmount, and check response.ok because fetch does not throw on a 404 or 500.

${f(`
function UsersTable() {
  const [rows, setRows] = useState([]);
  const [state, setState] = useState('loading');
  useEffect(() => {
    const ctrl = new AbortController();
    fetch('https://jsonplaceholder.typicode.com/users', { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => { setRows(d); setState('ok'); })
      .catch((e) => { if (e.name !== 'AbortError') setState('error'); });
    return () => ctrl.abort();
  }, []);
  if (state === 'loading') return <p>Loading…</p>;
  if (state === 'error') return <p role="alert">Could not load users.</p>;
  return (
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>City</th></tr></thead>
      <tbody>{rows.map((u) => (
        <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address.city}</td></tr>))}</tbody>
    </table>
  );
}`)}

In a real project a library such as TanStack Query handles caching, retries and loading states for you. Mention it, but be ready to write the plain version.`,
['The public test API above is only an example; use your own endpoint in real work.']),

  A(C, 'fresher', 'Coding exercise: implement pagination in React.',
`For a small list, slice the array. Keep the page number in state and work out the page count. For a large dataset, ask the server for one page at a time (page and limit) instead.

${f(`
function PagedList({ items, pageSize = 5 }) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pages);
  const slice = items.slice((current - 1) * pageSize, current * pageSize);
  return (
    <>
      <ul>{slice.map((x) => <li key={x.id}>{x.name}</li>)}</ul>
      <button disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</button>
      <span> Page {current} of {pages} </span>
      <button disabled={current === pages} onClick={() => setPage(current + 1)}>Next</button>
    </>
  );
}`)}

For server pagination, put the page in the fetch effect's dependency list and keep the old rows on screen while the next page loads.`,
['Handle the edge cases: empty list, and the page number after items are deleted.']),

  A(C, 'fresher', 'Coding exercise: create a login form with validation in React.',
`Use controlled inputs, validate on submit (and on blur if you want), show one clear message per field, and never trust the browser alone: the server must validate again.

${f(`
function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
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
    if (Object.keys(e).length === 0) onLogin(form);
  };
  const set = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });
  return (
    <form onSubmit={submit} noValidate>
      <label>Email <input type="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} /></label>
      {errors.email && <p role="alert">{errors.email}</p>}
      <label>Password <input type="password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} /></label>
      {errors.password && <p role="alert">{errors.password}</p>}
      <button>Log in</button>
    </form>
  );
}`)}

For bigger forms, mention React Hook Form with a schema library such as Zod.`,
['Never log or store the password in state longer than needed.']),

  A(C, 'fresher', 'Coding exercise: build a parent-child communication example in React.',
`Data goes down through props, and events go up through callback props. The parent owns the state, the child only displays it and reports what the user did.

${f(`
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>Parent count: {count}</p>
      <Child label="Add one" onPress={() => setCount((c) => c + 1)} />
    </>
  );
}
function Child({ label, onPress }) {
  return <button onClick={onPress}>{label}</button>;
}`)}

If two siblings need the same data, lift the state up to their closest common parent. For data needed deep in the tree, use context instead of passing props through every level.`,
['Say "props down, events up" in the interview. It is the phrase they listen for.']),

  A(C, 'both', 'Coding exercise: implement sorting and filtering in React.',
`Keep the raw list, the search text and the sort choice in state. Work out the visible list during render, because it is derived data and does not need its own state. Copy before sorting, since sort changes the array it is called on.

${f(`
function Products({ products }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('name');
  const visible = useMemo(() => {
    const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    return [...list].sort((a, b) => (sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name)));
  }, [products, q, sort]);
  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter" />
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="name">Name</option><option value="price">Price</option>
      </select>
      <ul>{visible.map((p) => <li key={p.id}>{p.name} – {p.price}</li>)}</ul>
    </>
  );
}`)}

useMemo is optional for a short list; add it when the list is large and say why.`,
['Mention localeCompare for text so accents and capitals sort sensibly.']),

  A(C, 'both', 'Coding exercise: create a shopping cart in React.',
`A reducer suits a cart well because it has several actions on one piece of state. Store items by id with a quantity, and work out the total during render.

${f(`
function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const found = state.find((i) => i.id === action.item.id);
      return found
        ? state.map((i) => (i.id === found.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state, { ...action.item, qty: 1 }];
    }
    case 'remove': return state.filter((i) => i.id !== action.id);
    case 'qty': return state.map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i));
    default: return state;
  }
}
function Cart({ catalog }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <>
      {catalog.map((p) => <button key={p.id} onClick={() => dispatch({ type: 'add', item: p })}>Add {p.name}</button>)}
      <ul>{cart.map((i) => (
        <li key={i.id}>{i.name} × {i.qty}
          <button onClick={() => dispatch({ type: 'remove', id: i.id })}>Remove</button></li>))}</ul>
      <p>Total: {total.toFixed(2)}</p>
    </>
  );
}`)}

To share the cart across pages, put the reducer in a context provider and save it to localStorage. Prices must be checked again on the server at checkout.`,
['Money maths: use whole minor units (paise or cents) in real shops to avoid rounding errors.']),

  A(C, 'both', 'Coding exercise: implement JWT authentication in a React app.',
`The server checks the password and returns a signed token. The client sends it in the Authorization header. The safest storage is an httpOnly cookie set by the server, because JavaScript (and so an XSS attack) cannot read it. Many apps keep the token in memory or localStorage for simplicity; know the trade-off.

${f(`
// api.js: attach the token to every request
export async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api' + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }), ...options.headers },
  });
  if (res.status === 401) { localStorage.removeItem('token'); window.location.assign('/login'); }
  return res;
}

// Protect pages
function RequireAuth({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}`)}

On the server, hash passwords with bcrypt, sign the token with jwt.sign using a secret from the environment and a short expiry, and verify it in middleware. The React check only hides pages; the server must enforce access.`,
['Mention refresh tokens and logout, and that a hidden button is not security.']),

  A(C, 'fresher', 'Coding exercise: build a reusable modal component in React.',
`Render it through a portal so it sits above everything, close on Escape and on a click outside, and keep it accessible with role="dialog" and aria-modal. Move focus into it when it opens.

${f(`
function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
           onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}`)}

Because the content comes in as children, the same component works for confirmations, forms and messages. A full answer also returns focus to the button that opened it and stops the page behind from scrolling.`,
['createPortal comes from react-dom.']),

  A(C, 'both', 'Coding exercise: implement lazy loading in React.',
`Lazy loading means downloading code or images only when needed. For components use React.lazy with Suspense, usually per route. For images use the native loading attribute.

${f(`
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Images below the fold
<img src={url} alt="Team photo" loading="lazy" width="400" height="300" />`)}

The Settings code is only downloaded when someone opens that route. Width and height stop the page jumping as images load. Do not lazy-load things visible at first paint, because that makes the page slower.`,
['The lazy component must be a default export.']),

  A(C, 'both', 'Coding exercise: create a file upload component in React.',
`Use a file input, check type and size in the browser for a quick message, send it as FormData (do not set Content-Type yourself, the browser adds the boundary), and show progress or a status. The server must check the file again.

${f(`
function Upload() {
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState('');
  const pick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return setStatus('Only PNG or JPG.');
    if (file.size > 2 * 1024 * 1024) return setStatus('Maximum size is 2 MB.');
    setPreview(URL.createObjectURL(file));
    const body = new FormData();
    body.append('file', file);
    setStatus('Uploading…');
    const res = await fetch('/api/upload', { method: 'POST', body });
    setStatus(res.ok ? 'Uploaded.' : 'Upload failed.');
  };
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);
  return (<>
    <input type="file" accept="image/png,image/jpeg" onChange={pick} />
    {preview && <img src={preview} alt="Selected" width="120" />}
    <p role="status">{status}</p>
  </>);
}`)}

For real progress bars use XMLHttpRequest or axios, which report upload progress; fetch does not.`,
['On the Node side, mention multer and checking the real file type, not just the extension.']),

  A(C, 'both', 'Coding exercise: build an autocomplete dropdown in React.',
`Combine a debounced input with a list of matches, keyboard control (arrows and Enter) and the right ARIA roles. Keep an "active index" in state.

${f(`
function Autocomplete({ options, onSelect }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const matches = q ? options.filter((o) => o.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
  const choose = (v) => { onSelect(v); setQ(v); setActive(0); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, matches.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && matches[active]) choose(matches[active]);
  };
  return (
    <div>
      <input role="combobox" aria-expanded={matches.length > 0} aria-controls="opts" value={q}
             onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey} />
      {matches.length > 0 && (
        <ul id="opts" role="listbox">{matches.map((m, i) => (
          <li key={m} role="option" aria-selected={i === active} onMouseDown={() => choose(m)}>{m}</li>))}</ul>)}
    </div>
  );
}`)}

onMouseDown is used so the choice happens before the input loses focus. For remote data, debounce the query and cancel old requests.`,
['Mention highlighting the matched text and closing the list on Escape.']),

  A(C, 'both', 'Coding exercise: implement infinite scrolling in React.',
`Put a small sentinel element at the end of the list and watch it with IntersectionObserver. When it comes into view, load the next page. Do not use a scroll listener that runs on every pixel.

${f(`
function Feed() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const end = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    fetch('/api/posts?page=' + page + '&limit=20').then((r) => r.json()).then((d) => {
      if (cancelled) return;
      setItems((old) => [...old, ...d.items]);
      if (d.items.length < 20) setDone(true);
      setBusy(false);
    });
    return () => { cancelled = true; };
  }, [page]);

  useEffect(() => {
    if (done || busy || !end.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setPage((p) => p + 1), { rootMargin: '200px' });
    io.observe(end.current);
    return () => io.disconnect();
  }, [done, busy]);

  return (<>
    <ul>{items.map((x) => <li key={x.id}>{x.title}</li>)}</ul>
    {!done && <div ref={end}>{busy ? 'Loading…' : ''}</div>}
  </>);
}`)}

Mention the trade-offs: keyboard users cannot reach the footer, so offer a "Load more" button as a fallback, and for very long lists use virtualisation.`,
['rootMargin starts loading a little before the user reaches the end.']),

  A(C, 'experienced', 'Coding exercise: debug unnecessary component rendering in React.',
`First prove there is a problem: open React DevTools Profiler, record, and see which components render and why (turn on "Record why each component rendered"). Then fix the cause, not the symptom.

Common causes and fixes: a new object, array or function created on every render passed to a memoised child, state kept too high in the tree, and context values that change on every render.

${f(`
// Problem: Child re-renders whenever Parent does, because onSave is a new function each time
function Parent() {
  const [text, setText] = useState('');
  const onSave = () => save(text);
  return (<>
    <input value={text} onChange={(e) => setText(e.target.value)} />
    <Child onSave={onSave} />
  </>);
}

// Fix 1: memoise the child and keep props stable
const Child = memo(function Child({ onSave }) { return <button onClick={onSave}>Save</button>; });
// (inside Parent)
const onSave = useCallback(() => save(text), [text]);

// Fix 2 (often better): move the typing state into its own small component,
// so keystrokes only re-render the input and nothing else.`)}

Do not wrap everything in memo by default: it costs memory and comparisons. Measure first, and also check that keys are stable and that you are not storing derived values in state. React Compiler can automate some of this where it is enabled.`,
['Strict Mode renders twice in development on purpose; that is not a bug.', 'Use the Profiler, not console.log, as the evidence.']),
];
