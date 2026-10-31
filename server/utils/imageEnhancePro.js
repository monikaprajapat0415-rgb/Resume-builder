// "Natural pro" helpers for the image enhancer. Everything here works on plain 8-bit RGB buffers (w * h * 3).
// Goals: remove noise and compression blocks, fix light and colour a little, enlarge, and change nothing else:
// no new objects, no reshaped faces, no changed text. So every step is mild, limited and measured on the picture itself.

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lumaOf = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

// Picture facts used to decide how much to do: noise level and brightness range.
export function analyze(rgb, w, h) {
    const step = Math.max(1, Math.floor(Math.sqrt((w * h) / 400000)));
    const hist = new Uint32Array(256);
    const lap = [];
    let n = 0, sr = 0, sg = 0, sb = 0;
    const L = (x, y) => { const i = (y * w + x) * 3; return lumaOf(rgb[i], rgb[i + 1], rgb[i + 2]); };
    for (let y = 1; y < h - 1; y += step) {
        for (let x = 1; x < w - 1; x += step) {
            const i = (y * w + x) * 3;
            const r = rgb[i], g = rgb[i + 1], b = rgb[i + 2];
            const l = lumaOf(r, g, b);
            hist[l | 0]++; n++; sr += r; sg += g; sb += b;
            const c = L(x, y);
            const gx = Math.abs(L(x + 1, y) - L(x - 1, y)), gy = Math.abs(L(x, y + 1) - L(x, y - 1));
            const lp = Math.abs(4 * c - 2 * (L(x - 1, y) + L(x + 1, y) + L(x, y - 1) + L(x, y + 1)) + (L(x - 1, y - 1) + L(x + 1, y - 1) + L(x - 1, y + 1) + L(x + 1, y + 1)) * 1 - 0) ;
            lap.push([gx + gy, lp]);
        }
    }
    // noise: Immerkaer's Laplacian estimate, taken only from the flattest half of the picture so edges do not count
    lap.sort((a, b) => a[0] - b[0]);
    const flat = lap.slice(0, Math.max(1, Math.floor(lap.length * 0.5))).map((p) => p[1]).sort((a, b) => a - b);
    const med = flat[Math.floor(flat.length / 2)] || 0;
    const sigma = (med / 0.6745) * Math.sqrt(Math.PI / 2) / 6 * 0.9;
    const pct = (p) => { let acc = 0; const t = n * p; for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc >= t) return i; } return 255; };
    return {
        noise: clamp(sigma, 0, 30),
        lo: pct(0.003), hi: pct(0.997), mean: (sr * 0.299 + sg * 0.587 + sb * 0.114) / n,
    };
}

// Gentle noise and blocking clean-up at the picture's own size.
//  - colour (chroma) noise and JPEG colour blocks: a blur that never crosses a brightness edge (joint bilateral)
//  - brightness noise: a small edge-keeping blur, only as strong as the measured noise, so skin and texture stay real
export function denoise(rgb, w, h, noise) {
    const N = w * h;
    const Y = new Float32Array(N), Cb = new Float32Array(N), Cr = new Float32Array(N);
    for (let i = 0, p = 0; i < N; i++, p += 3) {
        const r = rgb[p], g = rgb[p + 1], b = rgb[p + 2];
        Y[i] = 0.299 * r + 0.587 * g + 0.114 * b;
        Cb[i] = -0.168736 * r - 0.331264 * g + 0.5 * b;
        Cr[i] = 0.5 * r - 0.418688 * g - 0.081312 * b;
    }
    const chromaR = noise > 6 ? 3 : 2;
    const edge = 8 + noise * 2.2;               // brightness difference that counts as an edge
    const inv = 1 / (2 * edge * edge), sp = 1 / (2 * (chromaR * 0.8) ** 2);
    const Cb2 = new Float32Array(N), Cr2 = new Float32Array(N);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = y * w + x, y0 = Y[i];
            let wsum = 0, a = 0, b = 0;
            for (let dy = -chromaR; dy <= chromaR; dy++) {
                const yy = y + dy; if (yy < 0 || yy >= h) continue;
                for (let dx = -chromaR; dx <= chromaR; dx++) {
                    const xx = x + dx; if (xx < 0 || xx >= w) continue;
                    const j = yy * w + xx, d = Y[j] - y0;
                    const wt = Math.exp(-(dx * dx + dy * dy) * sp - d * d * inv);
                    wsum += wt; a += wt * Cb[j]; b += wt * Cr[j];
                }
            }
            Cb2[i] = a / wsum; Cr2[i] = b / wsum;
        }
    }
    // brightness: only when the picture is really noisy, and never more than 85 percent of the clean value
    const amount = clamp((noise - 1.2) / 7, 0, 0.85);
    let Y2 = Y;
    if (amount > 0.02) {
        Y2 = new Float32Array(N);
        const lr = 2, ledge = Math.max(6, noise * 2.4), linv = 1 / (2 * ledge * ledge), lsp = 1 / (2 * 1.1 * 1.1);
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = y * w + x, y0 = Y[i];
                let wsum = 0, a = 0;
                for (let dy = -lr; dy <= lr; dy++) {
                    const yy = y + dy; if (yy < 0 || yy >= h) continue;
                    for (let dx = -lr; dx <= lr; dx++) {
                        const xx = x + dx; if (xx < 0 || xx >= w) continue;
                        const j = yy * w + xx, d = Y[j] - y0;
                        const wt = Math.exp(-(dx * dx + dy * dy) * lsp - d * d * linv);
                        wsum += wt; a += wt * Y[j];
                    }
                }
                Y2[i] = y0 + amount * (a / wsum - y0);
            }
        }
    }
    for (let i = 0, p = 0; i < N; i++, p += 3) {
        const yv = Y2[i], cb = Cb2[i], cr = Cr2[i];
        rgb[p] = clamp(Math.round(yv + 1.402 * cr), 0, 255);
        rgb[p + 1] = clamp(Math.round(yv - 0.344136 * cb - 0.714136 * cr), 0, 255);
        rgb[p + 2] = clamp(Math.round(yv + 1.772 * cb), 0, 255);
    }
    return { chroma: true, luma: amount > 0.02 };
}

// Light: limited on purpose, and it never changes hue. Dull or flat pictures get their black and white points moved
// part of the way to the full range, and a dark picture gets a small lift. Colours are NOT rebalanced: a warm sunset,
// a red shirt or a green wall is real colour, and guessing a "cast" from a photo would change it.
export function lightAndColour(rgb, st) {
    const did = [];
    const black = st.lo > 6 && st.lo < 70 ? Math.min(st.lo, 22) * 0.7 : 0;
    const white = st.hi < 244 && st.hi > 170 ? st.hi + (255 - st.hi) * 0.35 : 255;
    if (black > 0 || white < 255) did.push('contrast');
    let gamma = 1;
    const mean = (st.mean - black) / Math.max(1, white - black);
    if (st.mean < 85) gamma = clamp(Math.log(0.4) / Math.log(clamp(mean, 0.05, 0.95)), 0.88, 1);
    if (gamma < 0.99) did.push('brightness'); else gamma = 1;
    if (!did.length) return did;
    const lut = new Uint8Array(256);
    for (let v = 0; v < 256; v++) lut[v] = clamp(Math.round(255 * Math.pow(clamp((v - black) / (white - black), 0, 1), gamma)), 0, 255);
    for (let p = 0; p < rgb.length; p++) rgb[p] = lut[rgb[p]];
    return did;
}

// Keeps the AI result honest: mixes it with a plain enlargement of the same picture (so invented texture is limited)
// and then puts the plain version's overall colours back (so the model cannot shift tones). Changes `ai` in place.
export function lockToReference(ai, ref, w, h, alpha) {
    const B = 16, gw = Math.ceil(w / B), gh = Math.ceil(h / B);
    const dA = new Float32Array(gw * gh * 3), dR = new Float32Array(gw * gh * 3), cnt = new Float32Array(gw * gh);
    for (let y = 0; y < h; y++) {
        const gy = (y / B) | 0;
        for (let x = 0; x < w; x++) {
            const g = gy * gw + ((x / B) | 0), p = (y * w + x) * 3;
            const a0 = ai[p], a1 = ai[p + 1], a2 = ai[p + 2];
            const r0 = ref[p], r1 = ref[p + 1], r2 = ref[p + 2];
            // mix
            const m0 = r0 + alpha * (a0 - r0), m1 = r1 + alpha * (a1 - r1), m2 = r2 + alpha * (a2 - r2);
            ai[p] = m0 < 0 ? 0 : m0 > 255 ? 255 : m0; ai[p + 1] = m1 < 0 ? 0 : m1 > 255 ? 255 : m1; ai[p + 2] = m2 < 0 ? 0 : m2 > 255 ? 255 : m2;
            const q = g * 3; dA[q] += ai[p]; dA[q + 1] += ai[p + 1]; dA[q + 2] += ai[p + 2]; dR[q] += r0; dR[q + 1] += r1; dR[q + 2] += r2; cnt[g]++;
        }
    }
    for (let g = 0; g < gw * gh; g++) { const c = cnt[g] || 1; for (let k = 0; k < 3; k++) dA[g * 3 + k] = (dR[g * 3 + k] - dA[g * 3 + k]) / c; } // grid of colour corrections
    for (let y = 0; y < h; y++) {
        const fy = clamp((y + 0.5) / B - 0.5, 0, gh - 1), y0 = Math.floor(fy), y1 = Math.min(gh - 1, y0 + 1), ty = fy - y0;
        for (let x = 0; x < w; x++) {
            const fx = clamp((x + 0.5) / B - 0.5, 0, gw - 1), x0 = Math.floor(fx), x1 = Math.min(gw - 1, x0 + 1), tx = fx - x0;
            const p = (y * w + x) * 3;
            for (let k = 0; k < 3; k++) {
                const c = (dA[(y0 * gw + x0) * 3 + k] * (1 - tx) + dA[(y0 * gw + x1) * 3 + k] * tx) * (1 - ty) + (dA[(y1 * gw + x0) * 3 + k] * (1 - tx) + dA[(y1 * gw + x1) * 3 + k] * tx) * ty;
                const v = ai[p + k] + c;
                ai[p + k] = v < 0 ? 0 : v > 255 ? 255 : v;
            }
        }
    }
}
