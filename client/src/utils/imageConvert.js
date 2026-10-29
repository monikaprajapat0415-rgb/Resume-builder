// Browser-side conversion of pictures to PDF / Word / text, with optional text recognition (OCR).
// Nothing here talks to our server. OCR files (engine and language data, about 3 MB for English) come from a public
// CDN the first time OCR is used and are then cached by the browser; the pictures themselves are never uploaded.

export const PAGES = { a4: [210, 297, 'A4'], letter: [215.9, 279.4, 'Letter'], fit: [0, 0, 'Fit to picture'] }
export const QUALITY = { small: { edge: 1600, q: 0.72, label: 'Small file' }, balanced: { edge: 2400, q: 0.86, label: 'Balanced' }, high: { edge: 3600, q: 0.93, label: 'High quality' } }
export const LANGS = { eng: 'English', hin: 'Hindi', 'eng+hin': 'English + Hindi' }

const PX_MM = 0.2646 // one CSS pixel at 96 dpi, in millimetres

// OCR base paths can be overridden at build time (VITE_OCR_LANG_PATH, VITE_OCR_CORE_PATH, VITE_OCR_WORKER_PATH).
const OCR_OPTS = () => {
  const e = import.meta.env || {}
  const o = {}
  if (e.VITE_OCR_LANG_PATH) o.langPath = e.VITE_OCR_LANG_PATH
  if (e.VITE_OCR_CORE_PATH) o.corePath = e.VITE_OCR_CORE_PATH
  if (e.VITE_OCR_WORKER_PATH) o.workerPath = e.VITE_OCR_WORKER_PATH
  return o
}

const loadImage = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`${file.name} could not be read`)) }
  img.src = url
})

// Otsu threshold on a 256-bin histogram of grey values.
const otsu = (hist, total) => {
  let sum = 0; for (let i = 0; i < 256; i++) sum += i * hist[i]
  let sB = 0, wB = 0, best = 0, t = 128
  for (let i = 0; i < 256; i++) {
    wB += hist[i]; if (!wB) continue
    const wF = total - wB; if (!wF) break
    sB += i * hist[i]
    const mB = sB / wB, mF = (sum - sB) / wF
    const v = wB * wF * (mB - mF) * (mB - mF)
    if (v > best) { best = v; t = i }
  }
  return t
}

// Look: 'original', 'gray' (grey and auto-contrast) or 'bw' (black and white document).
const applyLook = (canvas, look) => {
  if (look === 'original') return
  const g = canvas.getContext('2d')
  const im = g.getImageData(0, 0, canvas.width, canvas.height), d = im.data
  const n = d.length / 4, hist = new Uint32Array(256)
  for (let i = 0; i < d.length; i += 4) { const y = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0; d[i] = y; hist[y]++ }
  if (look === 'bw') {
    const t = otsu(hist, n)
    for (let i = 0; i < d.length; i += 4) { const v = d[i] > t ? 255 : 0; d[i] = d[i + 1] = d[i + 2] = v }
  } else {
    let lo = 0, hi = 255, c = 0
    while (lo < 255 && (c += hist[lo]) < n * 0.01) lo++
    c = 0; while (hi > 0 && (c += hist[hi]) < n * 0.01) hi--
    const span = Math.max(1, hi - lo)
    for (let i = 0; i < d.length; i += 4) { const v = Math.max(0, Math.min(255, ((d[i] - lo) * 255) / span)); d[i] = d[i + 1] = d[i + 2] = v }
  }
  g.putImageData(im, 0, 0)
}

// Draws a picture on a white canvas: rotated, shrunk to the quality's long edge, with the chosen look.
export const renderPage = async (file, { rotate = 0, look = 'original', edge = 2400 } = {}) => {
  const img = await loadImage(file)
  const turn = ((rotate % 360) + 360) % 360
  const sw = img.naturalWidth, sh = img.naturalHeight
  const k = Math.min(1, edge / Math.max(sw, sh))
  const w = Math.max(1, Math.round(sw * k)), h = Math.max(1, Math.round(sh * k))
  const swap = turn === 90 || turn === 270
  const c = document.createElement('canvas'); c.width = swap ? h : w; c.height = swap ? w : h
  const g = c.getContext('2d')
  g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height)
  g.translate(c.width / 2, c.height / 2); g.rotate((turn * Math.PI) / 180)
  g.drawImage(img, -w / 2, -h / 2, w, h)
  g.setTransform(1, 0, 0, 1, 0, 0)
  applyLook(c, look)
  return c
}

const canvasJpeg = (c, q) => new Promise((resolve, reject) => c.toBlob(async (b) => (b ? resolve({ dataUrl: c.toDataURL('image/jpeg', q), bytes: new Uint8Array(await b.arrayBuffer()) }) : reject(new Error('encode'))), 'image/jpeg', q))

// Page size in mm for one picture. 'auto' orientation: wide pictures get a landscape page.
const pageSize = (page, w, h) => {
  if (page === 'fit') return [Math.min(Math.max(w * PX_MM, 50), 500), Math.min(Math.max(h * PX_MM, 50), 500)]
  const [pw, ph] = PAGES[page]
  return w > h ? [ph, pw] : [pw, ph]
}

// ---- OCR ----
export const recognizePages = async (canvases, lang, onProgress) => {
  const { createWorker } = await import('tesseract.js')
  let page = 0
  const worker = await createWorker(lang.split('+'), 1, {
    ...OCR_OPTS(),
    logger: (m) => {
      if (m.status === 'recognizing text') onProgress?.(`Reading text on picture ${page + 1} of ${canvases.length}`, (page + m.progress) / canvases.length)
      else if (/loading|initializing/.test(m.status)) onProgress?.(`Getting the text reader ready (first time only): ${m.status}`, null)
    },
  })
  const out = []
  try {
    for (page = 0; page < canvases.length; page++) {
      const { data } = await worker.recognize(canvases[page], {}, { text: true, blocks: true })
      const paragraphs = []
      const words = []
      for (const b of data.blocks || []) for (const p of b.paragraphs || []) {
        const t = (p.text || '').replace(/\s*\n\s*/g, ' ').trim()
        if (t) paragraphs.push(t)
        for (const l of p.lines || []) for (const w of l.words || []) if (w.text && w.text.trim()) words.push({ text: w.text, x0: w.bbox.x0, y0: w.bbox.y0, x1: w.bbox.x1, y1: w.bbox.y1 })
      }
      out.push({ text: (data.text || '').trim(), paragraphs, words, confidence: data.confidence })
    }
  } finally { await worker.terminate() }
  return out
}

// ---- Builders. `pages` = [{ canvas, w, h, jpeg:{dataUrl,bytes}, ocr? }] ----
export const buildPdf = async (pages, { page, margin, numbers, password, searchable }) => {
  const { default: jsPDF } = await import('jspdf')
  let doc = null
  pages.forEach((p, i) => {
    const [pw, ph] = pageSize(page, p.w, p.h)
    const o = pw > ph ? 'l' : 'p'
    if (!doc) doc = new jsPDF({ orientation: o, unit: 'mm', format: [pw, ph], compress: true, ...(password ? { encryption: { userPassword: password, ownerPassword: password + '-owner', userPermissions: ['print', 'copy'] } } : {}) })
    else doc.addPage([pw, ph], o)
    const m = page === 'fit' ? 0 : margin
    const bw = pw - 2 * m, bh = ph - 2 * m, k = Math.min(bw / p.w, bh / p.h)
    const w = p.w * k, h = p.h * k, x = (pw - w) / 2, y = (ph - h) / 2
    doc.addImage(p.jpeg.dataUrl, 'JPEG', x, y, w, h, undefined, 'FAST')
    if (searchable && p.ocr) {
      // invisible text on top of each word, so the PDF can be searched and copied
      doc.setFont('helvetica', 'normal')
      for (const wd of p.ocr.words) {
        const hh = (wd.y1 - wd.y0) * k
        if (hh <= 0) continue
        doc.setFontSize(Math.max(1, (hh * 0.8) / 0.3528))
        doc.text(wd.text.replace(/[^\x20-\xFF]/g, ''), x + wd.x0 * k, y + wd.y1 * k - hh * 0.2, { renderingMode: 'invisible' })
      }
    }
    if (numbers) { doc.setFontSize(9); doc.setTextColor(120); doc.text(String(i + 1), pw / 2, ph - Math.max(3, m / 3), { align: 'center' }) }
  })
  return doc.output('blob')
}

export const buildDocxPictures = async (pages, { page, margin }) => {
  const d = await import('docx')
  const PX_PER_MM = 96 / 25.4, TW = 56.693
  const sections = pages.map((p, i) => {
    const [pw, ph] = pageSize(page, p.w, p.h)
    const m = page === 'fit' ? 0 : margin
    const k = Math.min((pw - 2 * m) * PX_PER_MM / p.w, (ph - 2 * m) * PX_PER_MM / p.h)
    const w = Math.floor(p.w * k * 0.98), h = Math.floor(p.h * k * 0.98) // a little smaller, otherwise Word adds a blank page
    const mm = Math.round(m * TW)
    return {
      properties: { page: { size: { width: Math.round(pw * TW), height: Math.round(ph * TW) }, margin: { top: mm, bottom: mm, left: mm, right: mm } } },
      children: [new d.Paragraph({ alignment: d.AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new d.ImageRun({ type: 'jpg', data: p.jpeg.bytes, transformation: { width: w, height: h }, altText: { title: p.name, description: p.name, name: p.name } })] })],
    }
  })
  return d.Packer.toBlob(new d.Document({ creator: 'Prime Resume AI', title: 'Pictures', sections }))
}

export const buildDocxText = async (pages, { page }) => {
  const d = await import('docx')
  const TW = 56.693
  const [pw, ph] = PAGES[page === 'letter' ? 'letter' : 'a4']
  const children = []
  pages.forEach((p, i) => {
    const paras = p.ocr?.paragraphs?.length ? p.ocr.paragraphs : (p.ocr?.text ? p.ocr.text.split(/\n{2,}/) : [])
    if (!paras.length) children.push(new d.Paragraph({ pageBreakBefore: i > 0, children: [new d.TextRun({ text: '(no text found on this picture)', italics: true, color: '888888' })] }))
    paras.forEach((t, j) => children.push(new d.Paragraph({ pageBreakBefore: i > 0 && j === 0, spacing: { after: 160 }, children: [new d.TextRun({ text: t, size: 24 })] })))
  })
  return d.Packer.toBlob(new d.Document({
    creator: 'Prime Resume AI', title: 'Recognized text',
    sections: [{ properties: { page: { size: { width: Math.round(pw * TW), height: Math.round(ph * TW) }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, children }],
  }))
}

export const buildTxt = (pages) => new Blob([pages.map((p, i) => `${pages.length > 1 ? `--- Picture ${i + 1} ---\n` : ''}${p.ocr?.text || ''}`).join('\n\n') + '\n'], { type: 'text/plain;charset=utf-8' })

// Full run. `opts`: { kind: 'pdf'|'docx'|'docx-text'|'txt', page, margin, quality, look, numbers, password, searchable, lang }
export const convert = async (items, opts, onProgress = () => {}) => {
  const Q = QUALITY[opts.quality] || QUALITY.balanced
  const needsOcr = opts.kind === 'docx-text' || opts.kind === 'txt' || (opts.kind === 'pdf' && opts.searchable)
  const pages = []
  for (let i = 0; i < items.length; i++) {
    onProgress(`Preparing picture ${i + 1} of ${items.length}`, i / items.length / (needsOcr ? 3 : 1))
    const canvas = await renderPage(items[i].file, { rotate: items[i].rotate, look: opts.look, edge: needsOcr ? Math.max(Q.edge, 2000) : Q.edge })
    const needsImage = opts.kind === 'pdf' || opts.kind === 'docx'
    pages.push({ canvas, w: canvas.width, h: canvas.height, name: items[i].file.name, jpeg: needsImage ? await canvasJpeg(canvas, Q.q) : null })
  }
  if (needsOcr) {
    const res = await recognizePages(pages.map((p) => p.canvas), opts.lang, (msg, f) => onProgress(msg, f == null ? null : 0.33 + f * 0.6))
    res.forEach((r, i) => { pages[i].ocr = r })
  }
  onProgress('Building your file', 0.95)
  let blob, ext
  if (opts.kind === 'pdf') { blob = await buildPdf(pages, opts); ext = 'pdf' }
  else if (opts.kind === 'docx') { blob = await buildDocxPictures(pages, opts); ext = 'docx' }
  else if (opts.kind === 'docx-text') { blob = await buildDocxText(pages, opts); ext = 'docx' }
  else { blob = buildTxt(pages); ext = 'txt' }
  const chars = needsOcr ? pages.reduce((n, p) => n + (p.ocr?.text?.length || 0), 0) : null
  return { blob, ext, chars, confidence: needsOcr ? Math.round(pages.reduce((n, p) => n + (p.ocr?.confidence || 0), 0) / pages.length) : null }
}
