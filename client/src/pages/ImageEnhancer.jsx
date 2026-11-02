import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuUpload, LuDownload, LuZoomIn, LuLoader, LuShieldCheck, LuCheck, LuX, LuImage } from 'react-icons/lu'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { useToolSettings } from '../utils/toolSettings'
import C from '../content/imageEnhancer.json'

// Product page + tool. The copy (title, FAQ, honesty note) lives in content/imageEnhancer.json and is also served as
// server-rendered HTML (utils/staticPages.js), so search and AI crawlers read the same words.
const SIZES = [['2k', '2K', '2560 px'], ['4k', '4K', '3840 px'], ['8k', '8K', '7680 px']]
const STRENGTHS = [['low', 'Light'], ['medium', 'Balanced'], ['high', 'Strong']]
const MODES = [['pro', 'Natural pro', 'Cleans noise and compression blocks, fixes light, keeps faces, colours and text'], ['standard', 'Standard sharpen', 'Stronger sharpening, no clean-up']]
const STEP_TEXT = {
  noise: 'Reduced grain and noise',
  'colour-noise': 'Cleaned colour noise',
  artifacts: 'Smoothed compression blocks',
  contrast: 'Improved contrast',
  brightness: 'Brightened dark areas',
  'enlarge-ai': 'Enlarged with AI, mixed with a plain enlargement so the picture stays true',
  enlarge: 'Enlarged',
}
const FORMATS = [['jpeg', 'JPG'], ['png', 'PNG'], ['webp', 'WebP']]
const ACCEPT = 'image/jpeg,image/png,image/webp'

const mb = (n) => (n / 1024 / 1024).toFixed(n > 10 * 1024 * 1024 ? 0 : 1) + ' MB'

const structured = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: `Prime Resume AI ${C.name}`, url: `https://primeresumeai.com${C.path}`, applicationCategory: 'MultimediaApplication', operatingSystem: 'Web', description: C.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: C.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
]

// Errors come back as a Blob because the request asks for an image, so read the JSON message out of it.
const readError = async (e) => {
  const d = e?.response?.data
  if (d instanceof Blob) { try { return JSON.parse(await d.text()) } catch { return {} } }
  return d || {}
}

const Seg = ({ label, value, onChange, options, disabled = {} }) => (
  <fieldset className='min-w-0'>
    <legend className='text-xs font-medium text-slate-500 mb-1.5'>{label}</legend>
    <div className='inline-flex rounded-lg border border-slate-300 bg-white p-0.5 max-w-full'>
      {options.map(([v, t, sub]) => (
        <button key={v} type='button' disabled={!!disabled[v]} onClick={() => onChange(v)} aria-pressed={value === v} title={disabled[v] || sub || ''}
          className={`px-3 py-1.5 text-sm rounded-md transition ${value === v ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'} disabled:opacity-40 disabled:cursor-not-allowed`}>{t}</button>
      ))}
    </div>
  </fieldset>
)

const Compare = ({ before, after }) => {
  const [pos, setPos] = useState(50)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const move = (e) => {
    if (!zoom) return
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }
  const img = { transform: zoom ? 'scale(2.5)' : 'none', transformOrigin: origin, transition: 'transform .15s' }
  return (
    <div>
      <div className='relative w-full overflow-hidden rounded-xl border border-slate-200 bg-[conic-gradient(#e2e8f0_25%,#f8fafc_0_50%,#e2e8f0_0_75%,#f8fafc_0)] bg-[length:20px_20px] select-none touch-pan-y' onPointerMove={move}>
        <img src={before} alt='Original picture' className='block w-full h-auto max-h-[70vh] object-contain mx-auto' style={img} draggable={false} />
        <img src={after} alt='Enhanced picture' className='absolute inset-0 w-full h-full object-contain' style={{ ...img, clipPath: `inset(0 0 0 ${pos}%)` }} draggable={false} />
        <div className='absolute inset-y-0 w-0.5 bg-white shadow pointer-events-none' style={{ left: `${pos}%` }} />
        <span className='absolute top-2 left-2 text-xs bg-slate-900/70 text-white rounded px-2 py-0.5'>Before</span>
        <span className='absolute top-2 right-2 text-xs bg-brand-600/90 text-white rounded px-2 py-0.5'>After</span>
      </div>
      <div className='flex items-center gap-3 mt-3'>
        <input type='range' min='0' max='100' value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label='Slide to compare before and after' className='flex-1 accent-brand-600' />
        <button type='button' onClick={() => setZoom((z) => !z)} aria-pressed={zoom} className={`inline-flex items-center gap-1.5 text-sm rounded-lg border px-3 py-1.5 ${zoom ? 'border-brand-600 text-brand-700 bg-brand-50' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}><LuZoomIn className='size-4' />Zoom</button>
      </div>
      {zoom && <p className='text-xs text-slate-500 mt-1'>Move the pointer over the picture to look closely at any part.</p>}
    </div>
  )
}

const ImageEnhancer = () => {
  const { token, user, loading } = useSelector((s) => s.auth)
  const tools = useToolSettings()
  const [file, setFile] = useState(null)
  const [orig, setOrig] = useState(null)         // { url, w, h }
  const [status, setStatus] = useState(null)
  const [target, setTarget] = useState('4k')
  const [strength, setStrength] = useState('medium')
  const [format, setFormat] = useState('jpeg')
  const [mode, setMode] = useState('pro')
  const [denoise, setDenoise] = useState(true)
  const [contrast, setContrast] = useState(true)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)     // { url, name, w, h, size, upscaled }
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)
  const origUrl = useRef(null), resUrl = useRef(null)

  const loadStatus = useCallback(() => {
    if (!token) return
    api.get('/api/tools/image-enhance/status', { headers: { Authorization: token } }).then(({ data }) => setStatus(data)).catch(() => {})
  }, [token])
  useEffect(() => { loadStatus() }, [loadStatus])
  const modeSet = useRef(false)
  useEffect(() => {   // start on the mode the admin chose, once
    if (status?.defaultMode && !modeSet.current) { modeSet.current = true; pickMode(status.defaultMode) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])
  useEffect(() => () => { if (origUrl.current) URL.revokeObjectURL(origUrl.current); if (resUrl.current) URL.revokeObjectURL(resUrl.current) }, [])
  useEffect(() => { if (status && !status.eightK && target === '8k') setTarget('4k') }, [status, target])
  useEffect(() => { if (target === '8k' && format === 'png') setFormat('jpeg') }, [target, format])

  const pickMode = (m) => { setMode(m); setDenoise(m === 'pro'); setContrast(m === 'pro') }
  const clearResult = () => { if (resUrl.current) URL.revokeObjectURL(resUrl.current); resUrl.current = null; setResult(null) }

  const choose = (f) => {
    if (!f) return
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return toast.error('Please choose a JPG, PNG or WebP image.')
    const limit = (status?.maxFileMb || 15) * 1024 * 1024
    if (f.size > limit) return toast.error(`That file is ${mb(f.size)}. The limit is ${mb(limit)}.`)
    clearResult()
    if (origUrl.current) URL.revokeObjectURL(origUrl.current)
    const url = URL.createObjectURL(f); origUrl.current = url
    const im = new Image()
    im.onload = () => setOrig({ url, w: im.naturalWidth, h: im.naturalHeight })
    im.onerror = () => { toast.error('That file could not be opened as a picture.'); setFile(null); setOrig(null) }
    im.src = url
    setFile(f)
  }

  const onDrop = (e) => { e.preventDefault(); setDrag(false); choose(e.dataTransfer.files?.[0]) }

  const enhance = async () => {
    if (!file || busy) return
    setBusy(true); setProgress(0); clearResult()
    try {
      const fd = new FormData()
      fd.append('image', file); fd.append('target', target); fd.append('strength', strength); fd.append('format', format); fd.append('mode', mode)
      fd.append('denoise', denoise ? 'true' : 'false'); fd.append('contrast', contrast ? 'true' : 'false')
      const res = await api.post('/api/tools/image-enhance', fd, { headers: { Authorization: token }, responseType: 'blob', timeout: 180000, onUploadProgress: (p) => p.total && setProgress(Math.round((p.loaded / p.total) * 100)) })
      const cd = res.headers['content-disposition'] || ''
      const name = (cd.match(/filename="([^"]+)"/) || [])[1] || `enhanced-${target}.${format === 'jpeg' ? 'jpg' : format}`
      const url = URL.createObjectURL(res.data); resUrl.current = url
      setResult({ url, name, w: Number(res.headers['x-image-width']), h: Number(res.headers['x-image-height']), size: res.data.size, upscaled: res.headers['x-image-upscaled'] === '1', steps: (res.headers['x-image-steps'] || '').split(',').filter(Boolean) })
      loadStatus()
    } catch (e) {
      const d = await readError(e)
      if (e.response?.status === 402) toast.error((t) => <span>{d.message} <Link to='/pricing' className='underline font-medium' onClick={() => toast.dismiss(t.id)}>See the plan</Link></span>, { duration: 7000 })
      else if (e.code === 'ECONNABORTED') toast.error('That took too long. Try a smaller picture or a smaller size.')
      else toast.error(d.message || 'Could not enhance the image. Please try again.')
      loadStatus()
    }
    setBusy(false)
  }

  const hidden = tools.loaded && !tools.imageEnhancer
  const isAdmin = user?.role === 'admin'
  const left = status?.remaining
  const disabled8k = status && !status.eightK ? '8K is part of the paid plan' : ''
  const nextUrl = `/app?state=login&next=${encodeURIComponent(C.path)}`

  if (hidden && !isAdmin && !loading) {
    return (
      <>
        <SEO title='Image Enhancer is not available' description='This tool is switched off right now.' path={C.path} noindex />
        <NavBar />
        <main className='max-w-xl mx-auto px-4 py-24 text-center'>
          <h1 className='text-2xl font-semibold text-slate-800'>The Image Enhancer is not available right now</h1>
          <p className='text-slate-600 mt-3'>Please check back later. Meanwhile you can build a resume or check one for free.</p>
          <p className='mt-6 flex flex-wrap justify-center gap-3'>
            <Link to='/app' className='px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium'>Free resume builder</Link>
            <Link to='/features/ats-checker' className='px-5 py-2.5 rounded-full border border-slate-300 text-sm text-slate-700 hover:bg-slate-50'>ATS resume checker</Link>
          </p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SEO title={C.title} description={C.description} keywords={C.keywords} path={C.path} structuredData={structured} noindex={hidden} />
      <NavBar />
      <main>
        {hidden && isAdmin && <p className='bg-amber-100 text-amber-900 text-sm text-center px-4 py-2' role='status'>This tool is hidden from visitors. You can see and try it because you are an admin. <Link to='/admin/tools' className='underline font-medium'>Show it</Link></p>}
        <section className='bg-gradient-to-b from-brand-50/60 to-white'>
          <div className='site-w pt-12 pb-8 text-center'>
            <span className='inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-100 rounded-full px-3 py-1'><LuShieldCheck className='size-3.5' />Not saved on our servers</span>
            <h1 className='text-3xl md:text-5xl font-semibold text-slate-800 mt-4 leading-tight'>{C.h1}</h1>
            <p className='text-slate-600 mt-4 max-w-2xl mx-auto'>{C.intro}</p>
          </div>
        </section>

        <section className='site-w pb-10' aria-label='Image enhancer tool'>
          <div className='rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm'>
            {!file && (
              <div onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
                className={`rounded-xl border-2 border-dashed px-4 py-12 text-center transition ${drag ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-slate-50'}`}>
                <LuImage className='size-10 mx-auto text-slate-400' aria-hidden />
                <p className='mt-3 text-slate-700 font-medium'>Drop a picture here</p>
                <p className='text-sm text-slate-500'>JPG, PNG or WebP, up to {status?.maxFileMb || 15} MB</p>
                <button type='button' onClick={() => inputRef.current?.click()} className='mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium'><LuUpload className='size-4' />Choose a picture</button>
              </div>
            )}
            <input ref={inputRef} type='file' accept={ACCEPT} className='sr-only' aria-label='Choose a picture' onChange={(e) => { choose(e.target.files?.[0]); e.target.value = '' }} />

            {file && (
              <div>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='font-medium text-slate-800 truncate'>{file.name}</p>
                    <p className='text-sm text-slate-500'>{orig ? `${orig.w} × ${orig.h} px · ` : ''}{mb(file.size)}</p>
                  </div>
                  <button type='button' onClick={() => { clearResult(); setFile(null); setOrig(null) }} className='shrink-0 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900'><LuX className='size-4' />Change</button>
                </div>

                {!result && orig && <img src={orig.url} alt='Your picture' className='mt-4 mx-auto max-h-72 w-auto max-w-full rounded-lg border border-slate-200 object-contain' />}

                <div className='mt-5 flex flex-wrap gap-x-6 gap-y-4'>
                  <Seg label='Mode' value={mode} onChange={pickMode} options={MODES} />
                  <Seg label='Size (long edge)' value={target} onChange={setTarget} options={SIZES} disabled={{ '8k': disabled8k }} />
                  <Seg label={mode === 'pro' ? 'Strength' : 'Sharpening'} value={strength} onChange={setStrength} options={STRENGTHS} />
                  <Seg label='Save as' value={format} onChange={setFormat} options={FORMATS} disabled={{ png: target === '8k' ? 'PNG is too large at 8K' : '' }} />
                </div>
                <div className='mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700'>
                  <label className='inline-flex items-center gap-2'><input type='checkbox' checked={denoise} onChange={(e) => setDenoise(e.target.checked)} className='accent-brand-600' />{mode === 'pro' ? 'Remove noise and compression blocks' : 'Reduce noise (grainy photos)'}</label>
                  <label className='inline-flex items-center gap-2'><input type='checkbox' checked={contrast} onChange={(e) => setContrast(e.target.checked)} className='accent-brand-600' />{mode === 'pro' ? 'Improve light and contrast' : 'Improve contrast and colour'}</label>
                </div>

                <div className='mt-6 flex flex-wrap items-center gap-3'>
                  {user ? (
                    <button type='button' onClick={enhance} disabled={busy || !orig || left === 0} className='inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium'>
                      {busy ? <LuLoader className='size-4 animate-spin' /> : null}{busy ? (progress < 100 ? `Uploading ${progress}%` : 'Enhancing…') : 'Enhance picture'}
                    </button>
                  ) : (
                    <Link to={nextUrl} className='inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium'>{loading ? 'Please wait' : 'Sign in to enhance (free)'}</Link>
                  )}
                  {user && status && (left === null
                    ? <span className='text-sm text-slate-500'>No daily limit for your account</span>
                    : <span className='text-sm text-slate-500'>{left} of {status.limit} free enhancements left today</span>)}
                </div>
                {mode === 'pro' && !busy && <p className='text-xs text-slate-500 mt-3'>Natural pro keeps your picture as it is: same faces, objects, background, colours and text, and the same shape. Output is {target === '8k' ? '8K' : target === '2k' ? '2K' : '4K'} on the long edge.</p>}
                {busy && <p className='text-sm text-slate-500 mt-3' role='status'>{target === '8k' ? '8K pictures can take 30 to 60 seconds. ' : 'AI enhancing takes about 10 to 20 seconds. '}Please keep this page open.</p>}
              </div>
            )}

            {result && orig && (
              <div className='mt-8 border-t border-slate-200 pt-6'>
                <h2 className='text-lg font-semibold text-slate-800'>Your enhanced picture</h2>
                <p className='text-sm text-slate-600 mt-1'>{orig.w} × {orig.h} px <span aria-hidden>→</span> <strong>{result.w} × {result.h} px</strong> · {mb(result.size)}</p>
                {result.steps?.length > 0 && <ul className='mt-2 text-sm text-slate-600 list-disc pl-5'>{result.steps.map((t) => STEP_TEXT[t] && <li key={t}>{STEP_TEXT[t]}</li>)}</ul>}
                {!result.upscaled && <p className='text-sm text-amber-700 mt-1'>Your picture was already as large as the size you chose, so it keeps its size and was only sharpened.</p>}
                <div className='mt-4'><Compare before={orig.url} after={result.url} /></div>
                <div className='mt-5 flex flex-wrap items-center gap-3'>
                  <a href={result.url} download={result.name} className='inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium'><LuDownload className='size-4' />Download</a>
                  <button type='button' onClick={clearResult} className='text-sm text-slate-600 underline hover:text-slate-900'>Try other settings</button>
                </div>
              </div>
            )}
          </div>
          <p className='text-xs text-slate-500 mt-3 text-center'>{C.privacy}</p>
        </section>

        <section className='site-w py-8'>
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

        <section className='site-w py-6'>
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

        <section className='site-w py-10'>
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

export default ImageEnhancer
