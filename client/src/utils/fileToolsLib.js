// Small pure helpers for the free file tools (merge, split, reduce size, photo resizer). No browser APIs here, so they can be tested in Node.

export const formatBytes = (n) => {
  if (!Number.isFinite(n) || n < 0) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

// "1-3, 5, 8-10" -> [0,1,2,4,7,8,9] (zero-based, sorted, no repeats). Returns { error } for anything unclear.
export const parseRanges = (text, pageCount) => {
  const s = String(text ?? '').trim()
  if (!s) return { error: 'Type the pages you want, for example 1-3, 5.' }
  const set = new Set()
  for (const raw of s.split(',')) {
    const part = raw.trim()
    if (!part) continue
    const m = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/)
    if (!m) return { error: `"${part}" is not a page or a range. Use numbers like 3 or 2-6, separated by commas.` }
    const a = Number(m[1]), b = m[2] === undefined ? a : Number(m[2])
    if (a < 1 || b < 1) return { error: 'Page numbers start at 1.' }
    if (a > b) return { error: `"${part}" goes backwards. Write it as ${b}-${a}.` }
    if (b > pageCount) return { error: `This file has ${pageCount} page${pageCount === 1 ? '' : 's'}, so ${b} is too high.` }
    for (let i = a; i <= b; i++) set.add(i - 1)
  }
  if (!set.size) return { error: 'Type the pages you want, for example 1-3, 5.' }
  return { pages: [...set].sort((x, y) => x - y) }
}

// Size of a picture after fitting it into a target box.
//  'crop'    fills the whole box and cuts what sticks out (centred), nothing is stretched
//  'contain' keeps the whole picture and fills the rest of the box with white
//  'stretch' squeezes the picture to the box exactly (can look distorted)
export const fitRect = (srcW, srcH, boxW, boxH, mode = 'crop') => {
  if (mode === 'stretch') return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: 0, dw: boxW, dh: boxH }
  if (mode === 'contain') {
    const k = Math.min(boxW / srcW, boxH / srcH)
    const dw = Math.round(srcW * k), dh = Math.round(srcH * k)
    return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: Math.round((boxW - dw) / 2), dy: Math.round((boxH - dh) / 2), dw, dh }
  }
  const k = Math.max(boxW / srcW, boxH / srcH)
  const sw = Math.round(boxW / k), sh = Math.round(boxH / k)
  return { sx: Math.round((srcW - sw) / 2), sy: Math.round((srcH - sh) / 2), sw, sh, dx: 0, dy: 0, dw: boxW, dh: boxH }
}

// Finds the best JPEG quality (0.05 to 0.95) whose file is at most maxBytes. `sizeAt(q)` returns the byte size at quality q.
// Returns { quality, size, fits }. When even the lowest quality is too big, fits is false and the smallest result is returned.
export const pickQuality = (sizeAt, maxBytes) => {
  let lo = 0.05, hi = 0.95
  const top = sizeAt(hi)
  if (top <= maxBytes) return { quality: hi, size: top, fits: true }
  const bottom = sizeAt(lo)
  if (bottom > maxBytes) return { quality: lo, size: bottom, fits: false }
  let best = { quality: lo, size: bottom, fits: true }
  for (let i = 0; i < 9; i++) {
    const mid = (lo + hi) / 2
    const sz = sizeAt(mid)
    if (sz <= maxBytes) { best = { quality: mid, size: sz, fits: true }; lo = mid } else hi = mid
  }
  return best
}

export const safeName = (name, fallback = 'file') => String(name || fallback).replace(/\.[^.]+$/, '').replace(/[^\w\- ]+/g, '').trim().slice(0, 60) || fallback
