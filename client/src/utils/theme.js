// Runtime theme: turns one chosen colour into the full --color-brand-* scale and applies it.
// The chosen colour becomes shade 600 (buttons, links); lighter/darker shades follow Tailwind's
// own lightness and chroma steps so the result looks like a built-in palette.

export const DEFAULT_PRIMARY = '#00a63e'
export const THEME_STORAGE_KEY = 'theme_vars'
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
// Lightness (%) and relative chroma of Tailwind's green scale.
const L = [98.2, 96.2, 92.5, 87.1, 79.2, 72.3, 62.7, 52.7, 44.8, 39.3, 26.6]
const C = [0.018, 0.044, 0.084, 0.15, 0.209, 0.219, 0.194, 0.154, 0.119, 0.095, 0.065]

export const isHex = (v) => /^#[0-9a-f]{6}$/i.test(String(v || '').trim())

const toLinear = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

export const hexToOklch = (hex) => {
  const [r, g, b] = parse(hex).map(toLinear)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const lab = [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]
  const h = (Math.atan2(lab[2], lab[1]) * 180) / Math.PI
  return { l: lab[0] * 100, c: Math.hypot(lab[1], lab[2]), h: (h + 360) % 360 }
}

// WCAG contrast of white text on this colour (buttons are white on brand-600).
export const contrastWithWhite = (hex) => {
  const [r, g, b] = parse(hex).map(toLinear)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return 1.05 / (lum + 0.05)
}

export const buildPalette = (hex) => {
  const { c, h } = hexToOklch(hex)
  const vars = {}
  SHADES.forEach((shade, i) => {
    if (shade === 600) { vars['--color-brand-600'] = hex.toLowerCase(); return }
    // very grey colours (slate) stay grey: scale chroma from the chosen colour, not from green
    const chroma = Math.min(C[i], c * (C[i] / C[6]))
    vars[`--color-brand-${shade}`] = `oklch(${L[i]}% ${chroma.toFixed(3)} ${h.toFixed(1)})`
  })
  return vars
}

const meta = () => document.querySelector('meta[name="theme-color"]')

export const clearTheme = () => {
  const root = document.documentElement.style
  SHADES.forEach((s) => root.removeProperty(`--color-brand-${s}`))
  meta()?.setAttribute('content', DEFAULT_PRIMARY)
  try { localStorage.removeItem(THEME_STORAGE_KEY) } catch { /* storage may be blocked */ }
}

export const applyTheme = (hex, { persist = true } = {}) => {
  if (!isHex(hex) || hex.toLowerCase() === DEFAULT_PRIMARY) { clearTheme(); return }
  const vars = buildPalette(hex)
  Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v))
  meta()?.setAttribute('content', hex)
  if (persist) { try { localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(vars)) } catch { /* ignore */ } }
}

export const PRESETS = [
  { name: 'Green (default)', value: DEFAULT_PRIMARY },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Teal', value: '#0f766e' },
  { name: 'Slate', value: '#475569' },
]
