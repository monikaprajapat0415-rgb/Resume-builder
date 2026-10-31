import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LuUpload, LuDownload, LuLoader, LuCheck, LuX, LuImage, LuArrowUp, LuArrowDown, LuTrash2, LuRotateCw, LuRotateCcw } from 'react-icons/lu'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import { ToolGate } from './tools/parts'
import C from '../content/imageConverter.json'
import { PAGES, QUALITY, LANGS, convert } from '../utils/imageConvert'

// Free tool that runs entirely in the browser: pictures -> PDF, Word or text, with optional text recognition (OCR).
// Copy lives in content/imageConverter.json and is also served as server-rendered HTML (utils/staticPages.js).
// The conversion code is in utils/imageConvert.js and is loaded only when the page is opened.
const ACCEPT = 'image/jpeg,image/png,image/webp'
const MAX_FILES = 40
const KINDS = [['pdf', 'PDF'], ['docx', 'Word (pictures)'], ['docx-text', 'Word (editable text)'], ['txt', 'Text (.txt)']]
const MARGINS = [['0', 'None'], ['10', 'Small'], ['20', 'Medium']]
const LOOKS = [['original', 'Original'], ['gray', 'Clean grey scan'], ['bw', 'Black and white']]

const structured = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: `Prime Resume AI ${C.name}`, url: `https://primeresumeai.com${C.path}`, applicationCategory: 'MultimediaApplication', operatingSystem: 'Web', description: C.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: C.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
]

const kb = (n) => (n > 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB')
const base = (name) => (name || 'pictures').replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'pictures'

const Seg = ({ label, value, onChange, options, disabled = {} }) => (
  <fieldset className='min-w-0'>
    <legend className='text-xs font-medium text-slate-500 mb-1.5'>{label}</legend>
    <div className='inline-flex flex-wrap rounded-lg border border-slate-300 bg-white p-0.5 max-w-full'>
      {options.map(([v, t]) => (
        <button key={v} type='button' disabled={!!disabled[v]} title={disabled[v] || ''} onClick={() => onChange(v)} aria-pressed={value === v}
          className={`px-3 py-1.5 text-sm rounded-md transition ${value === v ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'} disabled:opacity-40 disabled:cursor-not-allowed`}>{t}</button>
      ))}
    </div>
  </fieldset>
)

const ImageConverter = () => {
  const [items, setItems] = useState([])
  const [kind, setKind] = useState('pdf')
  const [page, setPage] = useState('a4')
  const [margin, setMargin] = useState('10')
  const [quality, setQuality] = useState('balanced')
  const [look, setLook] = useState('original')
  const [lang, setLang] = useState('eng')
  const [numbers, setNumbers] = useState(false)
  const [searchable, setSearchable] = useState(false)
  const [password, setPassword] = useState('')
  const [fileName, setFileName] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState({ msg: '', f: 0 })
  const [drag, setDrag] = useState(false)
  const [done, setDone] = useState(null)
  const inputRef = useRef(null)
  const urls = useRef([])
  const doneUrl = useRef(null)

  useEffect(() => () => { urls.current.forEach((u) => URL.revokeObjectURL(u)); if (doneUrl.current) URL.revokeObjectURL(doneUrl.current) }, [])

  const clearDone = () => { if (doneUrl.current) { URL.revokeObjectURL(doneUrl.current); doneUrl.current = null } setDone(null) }
  const set = (fn) => (v) => { clearDone(); fn(v) }

  const isPdf = kind === 'pdf'
  const ocrKind = kind === 'docx-text' || kind === 'txt' || (isPdf && searchable)
  const pagedKind = kind === 'pdf' || kind === 'docx'
  const hindi = lang.includes('hin')

  const add = (list) => {
    const files = Array.from(list || []).filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type))
    const skipped = (list?.length || 0) - files.length
    if (skipped > 0) toast.error(`${skipped} file${skipped === 1 ? ' was' : 's were'} skipped. Use JPG, PNG or WebP.`)
    if (!files.length) return
    clearDone()
    setItems((cur) => {
      const room = MAX_FILES - cur.length
      if (files.length > room) toast.error(`You can convert up to ${MAX_FILES} pictures at a time.`)
      return [...cur, ...files.slice(0, Math.max(0, room)).map((file) => { const url = URL.createObjectURL(file); urls.current.push(url); return { id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`, file, url, rotate: 0 } })]
    })
  }
  const move = (i, dir) => { clearDone(); setItems((cur) => { const n = [...cur]; const j = i + dir; if (j < 0 || j >= n.length) return cur; [n[i], n[j]] = [n[j], n[i]]; return n }) }
  const remove = (id) => { clearDone(); setItems((cur) => cur.filter((x) => x.id !== id)) }
  const turn = (id, by) => { clearDone(); setItems((cur) => cur.map((x) => (x.id === id ? { ...x, rotate: (x.rotate + by + 360) % 360 } : x))) }

  const run = async () => {
    if (!items.length || busy) return
    setBusy(true); clearDone(); setProgress({ msg: 'Starting', f: 0 })
    try {
      const r = await convert(items, {
        kind, page: page === 'fit' && !pagedKind ? 'a4' : page, margin: Number(margin), quality, look, numbers, lang,
        searchable: isPdf && searchable && !hindi, password: isPdf ? password.trim() : '',
      }, (msg, f) => setProgress((p) => ({ msg, f: f == null ? p.f : f })))
      const stem = fileName.trim() ? base(fileName.trim()) : `${base(items[0].file.name)}${items.length > 1 ? `-and-${items.length - 1}-more` : ''}`
      const url = URL.createObjectURL(r.blob); doneUrl.current = url
      setDone({ url, name: `${stem}.${r.ext}`, size: r.blob.size, kind, chars: r.chars, confidence: r.confidence })
    } catch (e) {
      const m = String(e?.message || e)
      toast.error(m === 'encode' ? 'One picture could not be converted.' : /fetch|network|load|importScripts|Failed/i.test(m) && ocrKind ? 'The text reader could not be downloaded. Check your internet connection and try again.' : (m || 'Conversion failed. Try fewer or smaller pictures.'))
    } finally { setBusy(false) }
  }

  const label = KINDS.find((k) => k[0] === kind)[1]

  return (
    <>
      <SEO title={C.title} description={C.description} keywords={C.keywords} path={C.path} structuredData={structured} />
      <NavBar />
      <main>
        <section className='max-w-4xl mx-auto px-4 pt-14 pb-8 text-center'>
          <span className='inline-block text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-3 py-1'>Free tool · runs in your browser</span>
          <h1 className='text-3xl md:text-5xl font-semibold text-slate-800 mt-4 leading-tight'>{C.h1}</h1>
          <p className='text-slate-600 mt-4 max-w-2xl mx-auto'>{C.intro}</p>
        </section>

        <section className='max-w-4xl mx-auto px-4 pb-10' aria-label='Image converter tool'>
          <ToolGate path={C.path}>
          <div className='rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm'>
            <div onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files) }}
              className={`rounded-xl border-2 border-dashed px-4 ${items.length ? 'py-6' : 'py-12'} text-center transition ${drag ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-slate-50'}`}>
              <LuImage className='size-9 mx-auto text-slate-400' aria-hidden />
              <p className='mt-2 text-slate-700 font-medium'>{items.length ? 'Drop more pictures here' : 'Drop your pictures here'}</p>
              <p className='text-sm text-slate-500'>JPG, PNG or WebP, up to {MAX_FILES} pictures</p>
              <button type='button' onClick={() => inputRef.current?.click()} className='mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium'><LuUpload className='size-4' />Choose pictures</button>
            </div>
            <input ref={inputRef} type='file' multiple accept={ACCEPT} className='sr-only' aria-label='Choose pictures' onChange={(e) => { add(e.target.files); e.target.value = '' }} />

            {items.length > 0 && (
              <div className='mt-6'>
                <p className='text-sm font-medium text-slate-700 mb-3'>{items.length} {items.length === 1 ? 'picture' : 'pictures'}, one per page, in this order</p>
                <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                  {items.map((it, i) => (
                    <li key={it.id} className='rounded-lg border border-slate-200 bg-white overflow-hidden'>
                      <div className='relative aspect-[4/3] bg-slate-50 overflow-hidden'>
                        <img src={it.url} alt={`Page ${i + 1}: ${it.file.name}`} className='w-full h-full object-contain transition-transform' style={{ transform: `rotate(${it.rotate}deg)${it.rotate % 180 ? ' scale(0.75)' : ''}` }} />
                        <span className='absolute top-1.5 left-1.5 text-[11px] font-medium bg-slate-800/80 text-white rounded-full px-2 py-0.5'>{i + 1}</span>
                      </div>
                      <div className='p-2'>
                        <p className='text-xs text-slate-600 truncate' title={it.file.name}>{it.file.name}</p>
                        <p className='text-[11px] text-slate-400'>{kb(it.file.size)}</p>
                        <div className='mt-1.5 flex items-center gap-0.5'>
                          <button type='button' onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${it.file.name} earlier`} className='p-1.5 rounded hover:bg-slate-100 disabled:opacity-30'><LuArrowUp className='size-4' /></button>
                          <button type='button' onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${it.file.name} later`} className='p-1.5 rounded hover:bg-slate-100 disabled:opacity-30'><LuArrowDown className='size-4' /></button>
                          <button type='button' onClick={() => turn(it.id, -90)} aria-label={`Rotate ${it.file.name} left`} className='p-1.5 rounded hover:bg-slate-100'><LuRotateCcw className='size-4' /></button>
                          <button type='button' onClick={() => turn(it.id, 90)} aria-label={`Rotate ${it.file.name} right`} className='p-1.5 rounded hover:bg-slate-100'><LuRotateCw className='size-4' /></button>
                          <button type='button' onClick={() => remove(it.id)} aria-label={`Remove ${it.file.name}`} className='ml-auto p-1.5 rounded hover:bg-red-50 text-red-600'><LuTrash2 className='size-4' /></button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className='mt-6 flex flex-wrap gap-x-6 gap-y-4'>
                  <Seg label='Convert to' value={kind} onChange={set(setKind)} options={KINDS} />
                  {pagedKind && <Seg label='Page size' value={page} onChange={set(setPage)} options={Object.entries(PAGES).map(([k, v]) => [k, v[2]])} />}
                  {pagedKind && page !== 'fit' && <Seg label='Margin' value={margin} onChange={set(setMargin)} options={MARGINS} />}
                  {!pagedKind && kind === 'docx-text' && <Seg label='Page size' value={page === 'letter' ? 'letter' : 'a4'} onChange={set(setPage)} options={[['a4', 'A4'], ['letter', 'Letter']]} />}
                  <Seg label='Picture look' value={look} onChange={set(setLook)} options={LOOKS} />
                  {pagedKind && <Seg label='File size' value={quality} onChange={set(setQuality)} options={Object.entries(QUALITY).map(([k, v]) => [k, v.label])} />}
                  {ocrKind && <Seg label='Language in the pictures' value={lang} onChange={set(setLang)} options={Object.entries(LANGS)} />}
                </div>

                <div className='mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-700'>
                  {isPdf && <label className='inline-flex items-center gap-2'><input type='checkbox' checked={numbers} onChange={(e) => { clearDone(); setNumbers(e.target.checked) }} className='accent-brand-600' />Add page numbers</label>}
                  {isPdf && <label className={`inline-flex items-center gap-2 ${hindi ? 'opacity-50' : ''}`} title={hindi ? 'Searchable PDF works for English only' : ''}><input type='checkbox' checked={searchable && !hindi} disabled={hindi} onChange={(e) => { clearDone(); setSearchable(e.target.checked) }} className='accent-brand-600' />Make the PDF searchable (reads the text, English only)</label>}
                  {isPdf && <label className='inline-flex items-center gap-2'>Password <input type='password' autoComplete='new-password' value={password} onChange={(e) => { clearDone(); setPassword(e.target.value) }} placeholder='optional' className='w-36 rounded-md border border-slate-300 px-2 py-1 text-sm' /></label>}
                  <label className='inline-flex items-center gap-2'>File name <input value={fileName} maxLength={40} onChange={(e) => { clearDone(); setFileName(e.target.value) }} placeholder='automatic' className='w-40 rounded-md border border-slate-300 px-2 py-1 text-sm' /></label>
                </div>
                {ocrKind && <p className='text-xs text-slate-500 mt-3'>Text reading runs on your device. The first time, about 3 MB of reading files (more for Hindi) are downloaded and then kept by your browser. Your pictures are not uploaded. Expect 10 to 40 seconds per page.</p>}

                <div className='mt-6 flex flex-wrap items-center gap-3'>
                  <button type='button' onClick={run} disabled={busy} className='inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium'>
                    {busy && <LuLoader className='size-4 animate-spin' />}{busy ? 'Converting…' : `Convert to ${label}`}
                  </button>
                  <button type='button' onClick={() => { clearDone(); setItems([]) }} disabled={busy} className='text-sm text-slate-600 underline hover:text-slate-900 disabled:opacity-50'>Clear all</button>
                </div>
                {busy && (
                  <div className='mt-4' role='status' aria-live='polite'>
                    <div className='h-2 rounded-full bg-slate-100 overflow-hidden'><div className='h-full bg-brand-600 transition-all' style={{ width: `${Math.round(Math.max(0.03, progress.f) * 100)}%` }} /></div>
                    <p className='text-sm text-slate-500 mt-2'>{progress.msg}. Please keep this page open.</p>
                  </div>
                )}

                {done && (
                  <div className='mt-6 rounded-xl border border-green-200 bg-green-50 p-4' role='status'>
                    <div className='flex flex-wrap items-center gap-3'>
                      <LuCheck className='size-5 text-green-600' aria-hidden />
                      <p className='text-sm text-slate-700'>Your file is ready: {done.name} ({kb(done.size)}).</p>
                      <a href={done.url} download={done.name} className='ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium'><LuDownload className='size-4' />Download</a>
                    </div>
                    {done.chars !== null && (
                      <p className='text-xs text-slate-600 mt-3'>{done.chars === 0 ? 'No text was found. Try the Clean grey scan or Black and white look, rotate the picture upright, or pick the right language.' : `Read ${done.chars.toLocaleString()} characters with about ${done.confidence}% average confidence. Text reading can make mistakes, so check names, numbers and dates before you use it.`}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <p className='text-xs text-slate-500 mt-3 text-center'>{C.privacy}</p>
          </ToolGate>
        </section>

        <section className='max-w-4xl mx-auto px-4 py-8'>
          <h2 className='text-2xl font-semibold text-slate-800 text-center'>How it works</h2>
          <ol className='grid sm:grid-cols-2 gap-4 mt-6'>
            {C.how.map((t, i) => (
              <li key={t} className='bg-white rounded-xl border border-slate-200 p-5 flex gap-3'>
                <span className='shrink-0 size-8 rounded-full bg-brand-50 text-brand-700 font-semibold flex items-center justify-center'>{i + 1}</span>
                <p className='text-sm text-slate-700'>{t}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className='max-w-3xl mx-auto px-4 py-6'>
          <div className='rounded-2xl border border-slate-200 bg-white p-6 md:p-8'>
            <h2 className='text-xl font-semibold text-slate-800'>What to expect</h2>
            <p className='text-sm text-slate-700 mt-3'>{C.honest}</p>
            <div className='grid sm:grid-cols-2 gap-6 mt-5'>
              <div>
                <h3 className='font-medium text-slate-800'>Works well for</h3>
                <ul className='mt-2 space-y-1.5 text-sm text-slate-700'>{C.good.map((t) => <li key={t} className='flex gap-2'><LuCheck className='size-4 mt-0.5 shrink-0 text-green-600' aria-hidden />{t}</li>)}</ul>
              </div>
              <div>
                <h3 className='font-medium text-slate-800'>Not a fit for</h3>
                <ul className='mt-2 space-y-1.5 text-sm text-slate-700'>{C.limits.map((t) => <li key={t} className='flex gap-2'><LuX className='size-4 mt-0.5 shrink-0 text-slate-400' aria-hidden />{t}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        <section className='max-w-3xl mx-auto px-4 py-10'>
          <h2 className='text-2xl font-semibold text-slate-800 text-center'>Frequently asked questions</h2>
          <div className='mt-6 divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white'>
            {C.faqs.map((f) => (
              <details key={f.q} className='group p-4'>
                <summary className='cursor-pointer font-medium text-slate-800 list-none flex justify-between gap-3'>{f.q}<span className='text-slate-400 group-open:rotate-45 transition' aria-hidden>+</span></summary>
                <p className='text-sm text-slate-600 mt-2'>{f.a}</p>
              </details>
            ))}
          </div>
          <p className='text-sm text-slate-600 mt-6 text-center'>Also useful: <Link className='text-brand-700 underline' to='/app'>free resume builder</Link> · <Link className='text-brand-700 underline' to='/features/ats-checker'>ATS resume checker</Link> · <Link className='text-brand-700 underline' to='/products'>more products</Link></p>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ImageConverter
