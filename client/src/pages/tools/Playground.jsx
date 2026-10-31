import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LuPlay, LuRotateCcw, LuCopy, LuLoader, LuTerminal, LuTrash2 } from 'react-icons/lu'
import toast from 'react-hot-toast'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { compile, buildFrame } from '../../utils/playgroundCompile'
import { REACT_EXAMPLES, ANGULAR_EXAMPLES } from '../../content/playgroundExamples'

// The code playground: editor on the left, live preview on the right. Everything runs in the visitor's browser.
// The learner's code runs in an iframe with sandbox="allow-scripts allow-forms" (no cookies, no storage, no access to this page).
const EXAMPLES = { react: REACT_EXAMPLES, angular: ANGULAR_EXAMPLES }
const KEY = (fw) => `pg_code_${fw}`
const read = (k) => { try { return localStorage.getItem(k) } catch { return null } }
const write = (k, v) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } }

const Editor = ({ docKey, value, onChange, framework }) => {
  const host = useRef(null)
  const view = useRef(null)
  const cb = useRef(onChange)
  cb.current = onChange
  useEffect(() => {
    const v = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [basicSetup, javascript({ jsx: framework === 'react', typescript: framework === 'angular' }), oneDark, EditorView.lineWrapping,
          EditorView.contentAttributes.of({ 'aria-label': 'Code editor' }),
          EditorView.updateListener.of((u) => { if (u.docChanged) cb.current(u.state.doc.toString()) })],
      }),
    })
    view.current = v
    return () => v.destroy()
    // The editor is rebuilt only when the example or framework changes; typing never recreates it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docKey, framework])
  return <div ref={host} className='h-full [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto text-[13px]' />
}

const Playground = () => {
  const [framework, setFramework] = useState('react')
  const [exampleId, setExampleId] = useState('counter')
  const [codes, setCodes] = useState({})
  const [frame, setFrame] = useState('')
  const [error, setError] = useState('')
  const [logs, setLogs] = useState([])
  const [busy, setBusy] = useState(true)
  const [auto, setAuto] = useState(true)
  const iframeRef = useRef(null)
  const runId = useRef(0)
  const [rev, setRev] = useState(0)

  const example = useMemo(() => EXAMPLES[framework].find((e) => e.id === exampleId) || EXAMPLES[framework][0], [framework, exampleId])
  const code = codes[`${framework}:${example.id}`] ?? read(KEY(framework) + ':' + example.id) ?? example.code
  const setCode = (v) => { setCodes((c) => ({ ...c, [`${framework}:${example.id}`]: v })); write(KEY(framework) + ':' + example.id, v) }

  const run = useCallback(async (src) => {
    const id = ++runId.current
    setBusy(true)
    setLogs([])
    setError('')
    try {
      const out = await compile(src, framework)
      if (id !== runId.current) return
      if (out.error) { setError(out.error); setBusy(false); return }
      setFrame(buildFrame(out.js, framework, window.location.origin))
    } catch {
      if (id === runId.current) setError('The editor engine could not start. Check your connection and reload the page.')
    }
    if (id === runId.current) setBusy(false)
  }, [framework])

  // Run a moment after typing stops.
  useEffect(() => {
    if (!auto) return undefined
    const t = setTimeout(() => run(code), 700)
    return () => clearTimeout(t)
  }, [code, auto, run])

  // Messages from the preview frame (console output and runtime errors).
  useEffect(() => {
    const on = (e) => {
      if (e.source !== iframeRef.current?.contentWindow || !e.data?.pg) return
      if (e.data.type === 'log') setLogs((l) => [...l.slice(-199), { level: e.data.level, text: String(e.data.text).slice(0, 2000) }])
      if (e.data.type === 'error') setError(String(e.data.text).slice(0, 2000))
    }
    window.addEventListener('message', on)
    return () => window.removeEventListener('message', on)
  }, [])

  const reset = () => { setCode(example.code); setRev((n) => n + 1) }
  const copy = async () => { try { await navigator.clipboard.writeText(code); toast.success('Code copied') } catch { toast.error('Could not copy. Select the code and copy it by hand.') } }
  const switchFw = (fw) => { setFramework(fw); setExampleId('counter') }

  return (
    <div>
      <div className='flex flex-wrap items-center gap-3 mb-4'>
        <div role='tablist' aria-label='Framework' className='inline-flex rounded-full border border-slate-300 bg-white p-1'>
          {['react', 'angular'].map((fw) => (
            <button key={fw} role='tab' aria-selected={framework === fw} onClick={() => switchFw(fw)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${framework === fw ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{fw === 'react' ? 'React' : 'Angular'}</button>
          ))}
        </div>
        <label className='flex items-center gap-2 text-sm text-slate-600'>
          <span>Start from</span>
          <select value={example.id} onChange={(e) => setExampleId(e.target.value)} className='rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800'>
            {EXAMPLES[framework].map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </label>
        <div className='flex items-center gap-2 ml-auto'>
          <label className='flex items-center gap-1.5 text-xs text-slate-600'><input type='checkbox' checked={auto} onChange={(e) => setAuto(e.target.checked)} />Run as I type</label>
          <button onClick={() => run(code)} className='inline-flex items-center gap-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2'>{busy ? <LuLoader className='size-4 animate-spin' /> : <LuPlay className='size-4' />}Run</button>
          <button onClick={copy} className='inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-sm text-slate-700 px-3 py-2' aria-label='Copy code'><LuCopy className='size-4' /><span className='hidden sm:inline'>Copy</span></button>
          <button onClick={reset} className='inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-sm text-slate-700 px-3 py-2' aria-label='Reset to the starter code'><LuRotateCcw className='size-4' /><span className='hidden sm:inline'>Reset</span></button>
        </div>
      </div>

      <div className='grid lg:grid-cols-2 gap-4'>
        <section aria-label='Code' className='rounded-2xl overflow-hidden border border-slate-700 bg-[#282c34] h-[26rem] lg:h-[34rem]'>
          <Editor docKey={`${framework}:${example.id}:${rev}`} framework={framework} value={code} onChange={setCode} />
        </section>
        <section aria-label='Preview' className='flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden h-[26rem] lg:h-[34rem]'>
          <div className='px-4 py-2 border-b border-slate-100 text-xs font-medium text-slate-500 flex items-center justify-between'>
            <span>Preview</span>{busy && <span className='inline-flex items-center gap-1'><LuLoader className='size-3 animate-spin' />Running…</span>}
          </div>
          {error && <p role='alert' className='m-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-xs font-mono whitespace-pre-wrap p-3 max-h-40 overflow-auto'>{error}</p>}
          <iframe ref={iframeRef} title='Code preview' sandbox='allow-scripts allow-forms' srcDoc={frame} className='flex-1 w-full bg-white' />
          <div className='border-t border-slate-100 bg-slate-50 max-h-36 overflow-auto'>
            <div className='sticky top-0 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-500 flex items-center justify-between'>
              <span className='inline-flex items-center gap-1.5'><LuTerminal className='size-3.5' />Console</span>
              {logs.length > 0 && <button onClick={() => setLogs([])} className='inline-flex items-center gap-1 text-slate-500 hover:text-slate-700'><LuTrash2 className='size-3' />Clear</button>}
            </div>
            {logs.length === 0 ? <p className='px-4 pb-2 text-xs text-slate-400'>console.log output appears here.</p>
              : <ul className='px-4 pb-2 font-mono text-xs space-y-0.5'>{logs.map((l, i) => <li key={i} className={l.level === 'error' ? 'text-red-700' : l.level === 'warn' ? 'text-amber-700' : 'text-slate-700'}>{l.text}</li>)}</ul>}
          </div>
        </section>
      </div>
      <p className='text-xs text-slate-500 mt-3'>{framework === 'react' ? 'React 19. You can import from react, react-dom and react-dom/client. Hooks are also available without an import.' : 'Angular 20 in the browser (JIT). Use @Input() and @Output() decorators and inject() for services. You can import from @angular/core, common, forms, platform-browser and rxjs.'} Your code stays in your browser.</p>
    </div>
  )
}

export default Playground
