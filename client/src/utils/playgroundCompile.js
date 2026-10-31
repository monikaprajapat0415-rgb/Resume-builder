// Turns the learner's React (JSX) or Angular (TypeScript) code into plain JavaScript in the browser, using esbuild's WebAssembly build.
// It loads only when the playground page is opened. Nothing is sent to a server.
let ready = null
const init = () => (ready ||= (async () => {
  const esbuild = await import('esbuild-wasm')
  const wasmURL = (await import('esbuild-wasm/esbuild.wasm?url')).default
  await esbuild.initialize({ wasmURL, worker: true })
  return esbuild
})().catch((e) => { ready = null; throw e }))

const prettyError = (e) => {
  const m = e?.errors?.[0]
  if (!m) return String(e?.message || e)
  const where = m.location ? ` (line ${m.location.line}, column ${m.location.column + 1})` : ''
  return `${m.text}${where}`
}

export async function compile(code, framework) {
  const esbuild = await init()
  try {
    const out = await esbuild.transform(code, framework === 'react'
      ? { loader: 'jsx', format: 'cjs', target: 'es2020', jsx: 'automatic' }
      : { loader: 'ts', format: 'cjs', target: 'es2022', tsconfigRaw: { compilerOptions: { experimentalDecorators: true, useDefineForClassFields: false } } })
    return { js: out.code }
  } catch (e) {
    return { error: prettyError(e) }
  }
}

// The page that runs inside the sandboxed frame. The learner's code is passed as a JSON string and never touches our page.
export function buildFrame(js, framework, origin) {
  const runtime = `${origin}/playground/${framework === 'react' ? 'react' : 'angular'}-runtime.js`
  const harness = framework === 'react' ? REACT_HARNESS : ANGULAR_HARNESS
  const safe = (s) => s.replace(/<\/(script)/gi, '<\\/$1')
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:12px;color:#1e293b}button,input,select,textarea{font:inherit}#pg-error{white-space:pre-wrap;background:#fef2f2;color:#991b1b;border:1px solid #fecaca;border-radius:8px;padding:10px;font:13px ui-monospace,monospace}</style></head>
<body><div id="root"></div><script src="${runtime}"></script>
<script>${safe(PRELUDE)}</script>
<script>window.__code = ${safe(JSON.stringify(js))};</script>
<script>${safe(harness)}</script></body></html>`
}

const PRELUDE = `
const send = (m) => parent.postMessage(Object.assign({ pg: true }, m), '*');
const fmt = (a) => { try { return typeof a === 'string' ? a : (a instanceof Error ? a.message : JSON.stringify(a, null, 2)); } catch (e) { return String(a); } };
['log','info','warn','error'].forEach((k) => { const o = console[k].bind(console); console[k] = (...a) => { send({ type: 'log', level: k, text: a.map(fmt).join(' ') }); o(...a); }; });
const showError = (e) => { const t = (e && (e.message || e)) + ''; send({ type: 'error', text: t }); let box = document.getElementById('pg-error'); if (!box) { box = document.createElement('div'); box.id = 'pg-error'; document.body.prepend(box); } box.textContent = t; };
window.addEventListener('error', (e) => showError(e.error || e.message));
window.addEventListener('unhandledrejection', (e) => showError(e.reason));
const requireFor = (mods) => (n) => { if (mods[n]) return mods[n]; throw new Error('The module "' + n + '" is not available in the playground. You can import: ' + Object.keys(mods).join(', ')); };
`

const REACT_HARNESS = `
try {
  const mods = window.__pg, R = mods['react'];
  const hooks = Object.keys(R).filter((k) => /^use[A-Z]/.test(k) || ['memo','lazy','Suspense','Fragment','createContext','forwardRef','StrictMode','startTransition'].includes(k));
  const mod = { exports: {} };
  const body = window.__code + '\\n;typeof App !== "undefined" && (module.exports.__app = App);';
  new Function('module', 'exports', 'require', 'React', ...hooks, body)(mod, mod.exports, requireFor(mods), R, ...hooks.map((k) => R[k]));
  const App = mod.exports.default || mod.exports.__app || mod.exports.App;
  if (App) {
    class Boundary extends R.Component { constructor(p) { super(p); this.state = { e: null }; } static getDerivedStateFromError(e) { return { e }; } componentDidCatch(e) { showError(e); } render() { return this.state.e ? null : this.props.children; } }
    mods['react-dom/client'].createRoot(document.getElementById('root')).render(R.createElement(Boundary, null, R.createElement(App)));
  } else if (!document.getElementById('root').hasChildNodes()) {
    showError('Nothing to show yet. Export a component, for example: export default function App() { return <h1>Hello</h1>; }');
  }
} catch (e) { showError(e); }
`

const ANGULAR_HARNESS = `
try {
  const mods = window.__pg, core = mods['@angular/core'];
  const mod = { exports: {} };
  const body = window.__code + '\\n;typeof App !== "undefined" && (module.exports.__app = App);';
  new Function('module', 'exports', 'require', body)(mod, mod.exports, requireFor(mods));
  const all = Object.assign({}, mod.exports);
  const Comp = all.default && all.default.ɵcmp ? all.default : (all.__app && all.__app.ɵcmp ? all.__app : Object.values(all).find((v) => typeof v === 'function' && v.ɵcmp));
  if (!Comp) throw new Error('No component found. Export one, for example: @Component({ selector: "app-root", template: "<h1>Hello</h1>" }) export class App {}');
  const sel = (Comp.ɵcmp.selectors && Comp.ɵcmp.selectors[0] && Comp.ɵcmp.selectors[0][0]) || 'app-root';
  document.getElementById('root').appendChild(document.createElement(sel));
  mods['@angular/platform-browser'].bootstrapApplication(Comp, { providers: [core.provideZonelessChangeDetection()] }).catch(showError);
} catch (e) { showError(e); }
`
