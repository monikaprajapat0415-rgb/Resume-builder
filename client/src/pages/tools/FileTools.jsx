import React, { useRef, useState } from 'react'
import { LuUpload, LuTrash2, LuArrowUp, LuArrowDown, LuDownload, LuLoader, LuShieldCheck, LuTriangleAlert } from 'react-icons/lu'
import { formatBytes, parseRanges, fitRect, pickQuality, safeName } from '../../utils/fileToolsLib'

// Free file tools that run fully in the browser: merge PDF, split PDF, reduce PDF size, photo and signature resizer.
// Files are read and written on the visitor's own device. Nothing is uploaded, so there is no sign-in and no daily limit.
// Admin > Free tools has one switch per tool. The PDF libraries load only when a tool is used.
const MAX_FILE = 60 * 1024 * 1024
const btn = 'inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 shadow-sm transition'
const ghost = 'inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 px-3 py-1.5'
const box = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400'

const saveBlob = (blob, name) => {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}
const readBytes = async (file) => new Uint8Array(await file.arrayBuffer())
const pdfError = (e) => /encrypt|password/i.test(e?.message || '') ? 'This PDF is password-protected. Remove the password first, then try again.' : 'This file could not be read as a PDF. It may be damaged.'

const Notice = ({ children, tone = 'info' }) => (
  <p role='status' className={`mt-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${tone === 'warn' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
    {tone === 'warn' ? <LuTriangleAlert className='size-4 mt-0.5 shrink-0' aria-hidden /> : <LuShieldCheck className='size-4 mt-0.5 shrink-0 text-brand-600' aria-hidden />}<span>{children}</span>
  </p>
)

const Drop = ({ accept, multiple, onFiles, label }) => {
  const input = useRef(null)
  const [over, setOver] = useState(false)
  const take = (list) => {
    const files = [...list]
    const big = files.find((f) => f.size > MAX_FILE)
    if (big) { onFiles([], `${big.name} is larger than ${formatBytes(MAX_FILE)}. Pick a smaller file.`); return }
    onFiles(files, '')
  }
  return (
    <div onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files) }}
      className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${over ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-white'}`}>
      <LuUpload className='mx-auto size-7 text-slate-400' aria-hidden />
      <p className='mt-3 text-sm text-slate-600'>Drop {label} here, or</p>
      <button type='button' onClick={() => input.current?.click()} className={`${btn} mt-3`}>Choose {multiple ? 'files' : 'a file'}</button>
      <input ref={input} type='file' accept={accept} multiple={multiple} className='hidden' aria-label={`Choose ${label}`} onChange={(e) => { take(e.target.files); e.target.value = '' }} />
      <p className='mt-3 text-xs text-slate-500'>Stays on your device. Up to {formatBytes(MAX_FILE)} per file.</p>
    </div>
  )
}

const isPdf = (f) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name)

/* ------------------------------ Merge PDF ------------------------------ */
export const MergePdf = () => {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const add = (list, err) => {
    if (err) return setMsg(err)
    const pdfs = list.filter(isPdf)
    setMsg(pdfs.length < list.length ? 'Only PDF files were added.' : '')
    setFiles((cur) => [...cur, ...pdfs.map((f) => ({ id: `${f.name}-${f.size}-${Math.random()}`, file: f }))].slice(0, 30))
  }
  const move = (i, d) => setFiles((c) => { const n = [...c]; const j = i + d; if (j < 0 || j >= n.length) return c; [n[i], n[j]] = [n[j], n[i]]; return n })
  const run = async () => {
    setBusy(true); setMsg('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const out = await PDFDocument.create()
      for (const { file } of files) {
        let src
        try { src = await PDFDocument.load(await readBytes(file)) } catch (e) { throw new Error(`${file.name}: ${pdfError(e)}`) }
        const pages = await out.copyPages(src, src.getPageIndices())
        pages.forEach((p) => out.addPage(p))
      }
      const bytes = await out.save()
      saveBlob(new Blob([bytes], { type: 'application/pdf' }), 'merged.pdf')
      setMsg(`Done. merged.pdf has ${out.getPageCount()} pages (${formatBytes(bytes.length)}).`)
    } catch (e) { setMsg(e.message || 'Could not merge these files.') }
    setBusy(false)
  }
  return (
    <div className='max-w-3xl mx-auto'>
      <Drop accept='application/pdf,.pdf' multiple onFiles={add} label='your PDF files' />
      {files.length > 0 && (
        <ol className='mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white'>
          {files.map((f, i) => (
            <li key={f.id} className='flex items-center gap-3 px-4 py-3'>
              <span className='size-6 shrink-0 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 flex items-center justify-center'>{i + 1}</span>
              <span className='min-w-0 flex-1 truncate text-sm text-slate-800'>{f.file.name}</span>
              <span className='text-xs text-slate-500'>{formatBytes(f.file.size)}</span>
              <button type='button' className={ghost} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${f.file.name} up`}><LuArrowUp className='size-3.5' /></button>
              <button type='button' className={ghost} onClick={() => move(i, 1)} disabled={i === files.length - 1} aria-label={`Move ${f.file.name} down`}><LuArrowDown className='size-3.5' /></button>
              <button type='button' className={ghost} onClick={() => setFiles((c) => c.filter((x) => x.id !== f.id))} aria-label={`Remove ${f.file.name}`}><LuTrash2 className='size-3.5' /></button>
            </li>
          ))}
        </ol>
      )}
      <div className='mt-5 flex items-center gap-4'>
        <button type='button' className={btn} onClick={run} disabled={busy || files.length < 2}>{busy ? <LuLoader className='size-4 animate-spin' /> : <LuDownload className='size-4' />}{busy ? 'Merging…' : 'Merge and download'}</button>
        {files.length < 2 && <span className='text-xs text-slate-500'>Add at least two PDF files. They are joined in the order shown.</span>}
      </div>
      {msg && <Notice tone={/^Done/.test(msg) ? 'info' : 'warn'}>{msg}</Notice>}
    </div>
  )
}

/* ------------------------------ Split PDF ------------------------------ */
export const SplitPdf = () => {
  const [pdf, setPdf] = useState(null)       // { file, bytes, count }
  const [mode, setMode] = useState('keep')   // keep: only these pages, remove: all except these
  const [ranges, setRanges] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const pick = async (list, err) => {
    if (err) return setMsg(err)
    const f = list[0]; if (!f) return
    if (!isPdf(f)) return setMsg('Please choose a PDF file.')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await readBytes(f)
      const doc = await PDFDocument.load(bytes)
      setPdf({ file: f, bytes, count: doc.getPageCount() }); setMsg(''); setRanges('')
    } catch (e) { setPdf(null); setMsg(pdfError(e)) }
  }
  const run = async () => {
    const r = parseRanges(ranges, pdf.count)
    if (r.error) return setMsg(r.error)
    let keep = r.pages
    if (mode === 'remove') { const drop = new Set(r.pages); keep = [...Array(pdf.count).keys()].filter((i) => !drop.has(i)) }
    if (!keep.length) return setMsg('That would remove every page. Leave at least one page.')
    setBusy(true); setMsg('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const src = await PDFDocument.load(pdf.bytes)
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, keep)
      pages.forEach((p) => out.addPage(p))
      const bytes = await out.save()
      saveBlob(new Blob([bytes], { type: 'application/pdf' }), `${safeName(pdf.file.name)}-pages.pdf`)
      setMsg(`Done. The new file has ${keep.length} of ${pdf.count} pages (${formatBytes(bytes.length)}).`)
    } catch (e) { setMsg('Could not make the new file.') }
    setBusy(false)
  }
  return (
    <div className='max-w-3xl mx-auto'>
      {!pdf ? <Drop accept='application/pdf,.pdf' onFiles={pick} label='your PDF file' /> : (
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <p className='text-sm text-slate-800'><strong>{pdf.file.name}</strong> · {pdf.count} page{pdf.count === 1 ? '' : 's'} · {formatBytes(pdf.file.size)} <button type='button' className='ml-2 text-xs text-brand-700 underline' onClick={() => { setPdf(null); setMsg('') }}>Choose another file</button></p>
          <fieldset className='mt-5'>
            <legend className='text-sm font-semibold text-slate-700'>What should the new file contain?</legend>
            <div className='mt-2 flex flex-wrap gap-4 text-sm text-slate-700'>
              <label className='flex items-center gap-2'><input type='radio' name='split-mode' checked={mode === 'keep'} onChange={() => setMode('keep')} />Only the pages I type</label>
              <label className='flex items-center gap-2'><input type='radio' name='split-mode' checked={mode === 'remove'} onChange={() => setMode('remove')} />Everything except the pages I type</label>
            </div>
          </fieldset>
          <label className='block mt-5'>
            <span className='text-sm font-semibold text-slate-700'>Pages</span>
            <span className='block text-xs text-slate-500 mt-0.5'>For example 1-3, 5, 8-10. This file has pages 1 to {pdf.count}.</span>
            <input className={`${box} mt-1.5`} value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder='1-3, 5' inputMode='text' />
          </label>
          <button type='button' className={`${btn} mt-5`} onClick={run} disabled={busy}>{busy ? <LuLoader className='size-4 animate-spin' /> : <LuDownload className='size-4' />}{busy ? 'Working…' : 'Make the new PDF'}</button>
        </div>
      )}
      {msg && <Notice tone={/^Done/.test(msg) ? 'info' : 'warn'}>{msg}</Notice>}
    </div>
  )
}

/* ---------------------------- Reduce PDF size ---------------------------- */
const LEVELS = {
  smaller: { label: 'Smallest file', scale: 1.0, q: 0.5 },
  balanced: { label: 'Balanced', scale: 1.5, q: 0.65 },
  sharper: { label: 'Sharper', scale: 2.0, q: 0.8 },
}
export const ReducePdf = () => {
  const [file, setFile] = useState(null)
  const [level, setLevel] = useState('balanced')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [msg, setMsg] = useState('')
  const [tone, setTone] = useState('info')
  const say = (t, m) => { setTone(t); setMsg(m) }
  const pick = (list, err) => { if (err) return say('warn', err); const f = list[0]; if (!f) return; if (!isPdf(f)) return say('warn', 'Please choose a PDF file.'); setFile(f); setMsg('') }
  const run = async () => {
    setBusy(true); setMsg('')
    try {
      const [pdfjs, worker, { PDFDocument }] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url'), import('pdf-lib')])
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default
      let doc
      try { doc = await pdfjs.getDocument({ data: await readBytes(file) }).promise } catch (e) { throw new Error(pdfError(e)) }
      if (doc.numPages > 150) throw new Error('This file has more than 150 pages. Split it first, then reduce each part.')
      const { scale, q } = LEVELS[level]
      const out = await PDFDocument.create()
      for (let i = 1; i <= doc.numPages; i++) {
        setProgress(`Page ${i} of ${doc.numPages}`)
        const page = await doc.getPage(i)
        const base = page.getViewport({ scale: 1 })
        const k = Math.min(scale, 3000 / Math.max(base.width, base.height))
        const vp = page.getViewport({ scale: k })
        const canvas = document.createElement('canvas'); canvas.width = Math.round(vp.width); canvas.height = Math.round(vp.height)
        const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height)
        await page.render({ canvasContext: ctx, viewport: vp }).promise
        const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', q))
        const img = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()))
        const p = out.addPage([base.width, base.height]); p.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height })
        canvas.width = canvas.height = 0; page.cleanup()
      }
      const bytes = await out.save()
      if (bytes.length >= file.size) say('warn', `The result (${formatBytes(bytes.length)}) is not smaller than your original (${formatBytes(file.size)}), so nothing was downloaded. Try "Smallest file". Files that are already small, or mostly pictures, may not shrink.`)
      else { saveBlob(new Blob([bytes], { type: 'application/pdf' }), `${safeName(file.name)}-smaller.pdf`); say('info', `Done. ${formatBytes(file.size)} became ${formatBytes(bytes.length)}.`) }
    } catch (e) { say('warn', e.message || 'Could not reduce this file.') }
    setProgress(''); setBusy(false)
  }
  return (
    <div className='max-w-3xl mx-auto'>
      {!file ? <Drop accept='application/pdf,.pdf' onFiles={pick} label='your PDF file' /> : (
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <p className='text-sm text-slate-800'><strong>{file.name}</strong> · {formatBytes(file.size)} <button type='button' className='ml-2 text-xs text-brand-700 underline' onClick={() => { setFile(null); setMsg('') }}>Choose another file</button></p>
          <fieldset className='mt-5'>
            <legend className='text-sm font-semibold text-slate-700'>Quality</legend>
            <div className='mt-2 inline-flex rounded-lg border border-slate-300 bg-white p-0.5'>
              {Object.entries(LEVELS).map(([k, v]) => <button key={k} type='button' aria-pressed={level === k} onClick={() => setLevel(k)} className={`px-3 py-1.5 text-sm rounded-md ${level === k ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>{v.label}</button>)}
            </div>
          </fieldset>
          <Notice tone='warn'>This works by turning each page into a picture. The file gets smaller, but the text can no longer be selected or searched, and links and form fields stop working. Do not use it on a resume you will upload to a job site that reads text. Keep your original.</Notice>
          <button type='button' className={`${btn} mt-5`} onClick={run} disabled={busy}>{busy ? <LuLoader className='size-4 animate-spin' /> : <LuDownload className='size-4' />}{busy ? (progress || 'Working…') : 'Reduce and download'}</button>
        </div>
      )}
      {msg && <Notice tone={tone}>{msg}</Notice>}
    </div>
  )
}

/* ------------------------ Photo and signature resizer ------------------------ */
// Example sizes only. Every form states its own rules; the person must type what their form asks for.
const PRESETS = [
  { name: 'Photo example', w: 200, h: 230, max: 50, min: 0 },
  { name: 'Signature example', w: 140, h: 60, max: 20, min: 0 },
  { name: 'Square profile picture', w: 400, h: 400, max: 100, min: 0 },
]
export const PhotoResizer = () => {
  const [src, setSrc] = useState(null)   // { file, img, url }
  const [w, setW] = useState(200)
  const [h, setH] = useState(230)
  const [max, setMax] = useState(50)
  const [min, setMin] = useState(0)
  const [fit, setFit] = useState('crop')
  const [res, setRes] = useState(null)   // { url, blob, quality, fits, w, h }
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const pick = (list, err) => {
    if (err) return setMsg(err)
    const f = list[0]; if (!f) return
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return setMsg('Please choose a JPG, PNG or WebP picture.')
    const url = URL.createObjectURL(f); const img = new Image()
    img.onload = () => { setSrc({ file: f, img, url }); setRes(null); setMsg('') }
    img.onerror = () => setMsg('This picture could not be opened.')
    img.src = url
  }
  const run = async () => {
    const W = Math.round(Number(w)), H = Math.round(Number(h)), MAX = Number(max) * 1024, MIN = Number(min) * 1024
    if (!(W >= 20 && W <= 4000 && H >= 20 && H <= 4000)) return setMsg('Width and height must be between 20 and 4000 pixels.')
    if (!(MAX >= 2048)) return setMsg('The largest size must be at least 2 KB.')
    if (MIN && MIN > MAX) return setMsg('The smallest size cannot be bigger than the largest size.')
    setBusy(true); setMsg('')
    try {
      const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.imageSmoothingQuality = 'high'
      const r = fitRect(src.img.naturalWidth, src.img.naturalHeight, W, H, fit)
      ctx.drawImage(src.img, r.sx, r.sy, r.sw, r.sh, r.dx, r.dy, r.dw, r.dh)
      // data URL length gives the byte size of each quality quickly (base64 is 4/3 of the bytes)
      const sizeAt = (q) => { const d = canvas.toDataURL('image/jpeg', q); return Math.floor(((d.length - 23) * 3) / 4) }
      const best = pickQuality(sizeAt, MAX)
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', best.quality))
      if (res?.url) URL.revokeObjectURL(res.url)
      setRes({ url: URL.createObjectURL(blob), blob, quality: best.quality, fits: blob.size <= MAX, w: W, h: H, under: MIN > 0 && blob.size < MIN })
    } catch { setMsg('Could not make the picture.') }
    setBusy(false)
  }
  const num = (v, set, label, unit) => (
    <label className='block'><span className='text-sm font-semibold text-slate-700'>{label}</span>
      <div className='mt-1.5 flex items-center gap-2'><input type='number' min='0' className={box} value={v} onChange={(e) => set(e.target.value)} /><span className='text-xs text-slate-500'>{unit}</span></div></label>
  )
  return (
    <div className='max-w-3xl mx-auto'>
      {!src ? <Drop accept='image/jpeg,image/png,image/webp' onFiles={pick} label='your photo or signature' /> : (
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <div className='flex flex-wrap items-start gap-5'>
            <img src={src.url} alt='Your original picture' className='h-28 w-auto max-w-[10rem] rounded border border-slate-200 object-contain bg-slate-50' />
            <p className='text-sm text-slate-800'><strong>{src.file.name}</strong><br />{src.img.naturalWidth} × {src.img.naturalHeight} px · {formatBytes(src.file.size)}<br /><button type='button' className='mt-1 text-xs text-brand-700 underline' onClick={() => { setSrc(null); setRes(null); setMsg('') }}>Choose another picture</button></p>
          </div>
          <p className='mt-5 text-sm font-semibold text-slate-700'>Start from an example</p>
          <div className='mt-1.5 flex flex-wrap gap-2'>
            {PRESETS.map((p) => <button key={p.name} type='button' className={ghost} onClick={() => { setW(p.w); setH(p.h); setMax(p.max); setMin(p.min) }}>{p.name}: {p.w}×{p.h} px, under {p.max} KB</button>)}
          </div>
          <p className='mt-1.5 text-xs text-slate-500'>These are only examples. Forms differ, so type the size your form or exam notice asks for.</p>
          <div className='mt-5 grid gap-4 sm:grid-cols-2'>
            {num(w, setW, 'Width', 'pixels')}{num(h, setH, 'Height', 'pixels')}
            {num(max, setMax, 'Largest file size', 'KB')}{num(min, setMin, 'Smallest file size (optional)', 'KB')}
          </div>
          <fieldset className='mt-5'>
            <legend className='text-sm font-semibold text-slate-700'>When the shape is different</legend>
            <div className='mt-2 flex flex-wrap gap-4 text-sm text-slate-700'>
              <label className='flex items-center gap-2'><input type='radio' name='fit' checked={fit === 'crop'} onChange={() => setFit('crop')} />Crop the edges</label>
              <label className='flex items-center gap-2'><input type='radio' name='fit' checked={fit === 'contain'} onChange={() => setFit('contain')} />Keep everything, add white space</label>
              <label className='flex items-center gap-2'><input type='radio' name='fit' checked={fit === 'stretch'} onChange={() => setFit('stretch')} />Stretch to fit</label>
            </div>
          </fieldset>
          <button type='button' className={`${btn} mt-5`} onClick={run} disabled={busy}>{busy ? <LuLoader className='size-4 animate-spin' /> : null}Resize picture</button>
        </div>
      )}
      {msg && <Notice tone='warn'>{msg}</Notice>}
      {res && (
        <div className='mt-5 rounded-2xl border border-slate-200 bg-white p-6'>
          <div className='flex flex-wrap items-start gap-5'>
            <img src={res.url} alt='Your resized picture' width={res.w} height={res.h} style={{ maxWidth: '12rem', height: 'auto' }} className='rounded border border-slate-200' />
            <div className='text-sm text-slate-800'>
              <p><strong>{res.w} × {res.h} px · {formatBytes(res.blob.size)}</strong> · JPG</p>
              {!res.fits && <p className='mt-2 text-amber-800'>Even at the lowest quality this is bigger than {max} KB. Make the width and height smaller, then try again.</p>}
              {res.under && <p className='mt-2 text-amber-800'>This is smaller than your {min} KB minimum. Use a larger width and height to get a bigger file.</p>}
              <button type='button' className={`${btn} mt-3`} onClick={() => saveBlob(res.blob, `${safeName(src.file.name)}-${res.w}x${res.h}.jpg`)}><LuDownload className='size-4' />Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
