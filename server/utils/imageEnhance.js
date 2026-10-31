import sharp from 'sharp';
import { aiUpscale4x, isAiAvailable } from './aiUpscale.js';
import { analyze, denoise, lightAndColour, lockToReference } from './imageEnhancePro.js';

// Image enhancer: upscales a photo to a 2K / 4K / 8K long edge and sharpens it, using the sharp library on this server.
// Two engines: "ai" (Real-ESRGAN small model, 4x, on the CPU: rebuilds edges and texture in soft or small pictures; it
// invents plausible detail, it does not recover the true original) and "classic" (Lanczos + unsharp masking, the fallback).
// The page says so.
// Nothing is written to disk: the upload and the result only live in memory for the length of the request.

export const TARGETS = { '2k': 2560, '4k': 3840, '8k': 7680 };       // long edge in pixels
export const STRENGTHS = {
    low: { sigma: 0.7, m1: 0.4, m2: 1.6, clarity: 0 },
    medium: { sigma: 1.0, m1: 0.7, m2: 2.4, clarity: 0.5 },
    high: { sigma: 1.5, m1: 1.3, m2: 3.5, clarity: 1.0 },
};
// "Natural pro" mode: how much of the AI result is kept (the rest is a plain enlargement) and how firm the final sharpening is.
export const PRO = {
    low: { alpha: 0.4, m2: 0.5 },
    medium: { alpha: 0.55, m2: 0.8 },
    high: { alpha: 0.75, m2: 1.2 },
};
export const MODES = ['pro', 'standard'];
export const FORMATS = { jpeg: { mime: 'image/jpeg', ext: 'jpg' }, png: { mime: 'image/png', ext: 'png' }, webp: { mime: 'image/webp', ext: 'webp' } };
export const MAX_INPUT_PIXELS = 50_000_000;   // about 50 megapixels in
export const MAX_OUTPUT_PIXELS = 50_000_000;  // about 50 megapixels out (8K is 33 MP in 16:9)

sharp.cache(false);
sharp.concurrency(2);

const rawOf = (data, info) => ({ raw: { width: info.width, height: info.height, channels: info.channels } });

// Returns { buffer, mime, ext, width, height, inWidth, inHeight, scale, upscaled }
export async function enhanceImage(input, opts = {}) {
    if (opts.mode !== 'standard') return enhancePro(input, opts);
    return enhanceStandard(input, opts);
}

async function enhanceStandard(input, opts = {}) {
    const target = TARGETS[opts.target] ? opts.target : '4k';
    const st = STRENGTHS[opts.strength] || STRENGTHS.medium;
    const format = FORMATS[opts.format] ? opts.format : 'jpeg';

    // Decode once, apply the camera's rotation, work in sRGB. Animated files use their first frame.
    let { data, info } = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error' })
        .rotate().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
    const inWidth = info.width, inHeight = info.height;
    const hasAlpha = info.channels === 4;

    if (opts.denoise) {
        ({ data, info } = await sharp(data, rawOf(data, info)).median(3).raw().toBuffer({ resolveWithObject: true }));
    }

    const longEdge = Math.max(inWidth, inHeight);
    let scale = TARGETS[target] / longEdge;
    // Already as big as the target (or bigger): keep the size, still sharpen.
    const upscaled = scale > 1.05;
    if (!upscaled) scale = 1;
    let outW = Math.round(inWidth * scale), outH = Math.round(inHeight * scale);
    if (outW * outH > MAX_OUTPUT_PIXELS) { const k = Math.sqrt(MAX_OUTPUT_PIXELS / (outW * outH)); outW = Math.floor(outW * k); outH = Math.floor(outH * k); }

    // AI pass: the model makes 4x. Feed it a picture whose 4x result is about the target size (never bigger than the
    // input needs), so time stays reasonable, then the classic code below finishes the size and sharpening.
    let engine = 'classic';
    if (opts.engine !== 'classic' && !hasAlpha && upscaled && (await isAiAvailable())) {
        const cap = Math.ceil(TARGETS[target] / 4);
        let ai = { data, w: info.width, h: info.height };
        const long = Math.max(info.width, info.height);
        if (long > cap) {
            const r = await sharp(data, rawOf(data, info)).resize(cap, cap, { fit: 'inside', kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true });
            ai = { data: r.data, w: r.info.width, h: r.info.height };
        }
        try {
            const up = await aiUpscale4x(ai.data, ai.w, ai.h);
            data = up.data; info = { width: up.width, height: up.height, channels: 3 };
            engine = 'ai';
        } catch (e) { console.error('AI upscale failed, using classic:', e.message); }
    }

    // Grow in steps of at most 2x with a light sharpen between steps; big jumps in one go look softer.
    let curW = info.width, curH = info.height;
    while (upscaled && outW / curW > 2.0001) {
        const nw = curW * 2, nh = curH * 2;
        const r = await sharp(data, rawOf(data, info)).resize(nw, nh, { kernel: 'lanczos3' }).sharpen({ sigma: 0.6, m1: 0.5, m2: 1.5 }).raw().toBuffer({ resolveWithObject: true });
        data = r.data; info = r.info; curW = info.width; curH = info.height;
    }

    // The final sharpen grows a little with the enlargement, because enlarged pictures look softer.
    const grow = engine === 'ai' ? 1 : Math.min(2.2, Math.max(1, Math.sqrt(scale)));
    let p = sharp(data, rawOf(data, info));
    if (upscaled || outW !== curW || outH !== curH) p = p.resize(outW, outH, { kernel: 'lanczos3', fit: 'fill' });
    p = engine === 'ai' ? p.sharpen({ sigma: 0.8, m1: st.m1 * 0.5, m2: st.m2 * 0.5 }) : p.sharpen({ sigma: st.sigma * grow, m1: st.m1, m2: st.m2 });
    if (st.clarity > 0 && engine !== 'ai') p = p.sharpen({ sigma: 3.5 * grow, m1: st.clarity * 0.5, m2: st.clarity * 0.5 }); // local contrast ("clarity")
    if (opts.contrast) p = p.normalise({ lower: 1, upper: 99 }).modulate({ saturation: 1.05 });

    if (format === 'jpeg') p = p.flatten({ background: '#ffffff' }).jpeg({ quality: 92, chromaSubsampling: '4:4:4', mozjpeg: true });
    else if (format === 'png') p = p.png({ compressionLevel: 6 });
    else p = p.webp({ quality: 92, effort: 3 });

    const out = await p.toBuffer({ resolveWithObject: true });
    return { buffer: out.data, mime: FORMATS[format].mime, ext: FORMATS[format].ext, width: out.info.width, height: out.info.height, inWidth, inHeight, scale: out.info.width / inWidth, upscaled, hasAlpha, engine };
}


// ---------- Natural pro ----------
// decode -> measure -> (shrink for the AI if needed) -> clean noise and blocks -> light and colour -> AI 4x ->
// mix with a plain enlargement and lock the colours -> exact size (same aspect ratio) -> light sharpening -> encode.
// Nothing is added or taken away from the scene: every step is mild and limited. Transparent pictures use the standard path.
async function enhancePro(input, opts = {}) {
    const target = TARGETS[opts.target] ? opts.target : '4k';
    const pro = { ...(PRO[opts.strength] || PRO.medium), ...(Number.isFinite(opts._alpha) ? { alpha: opts._alpha } : {}) };
    const format = FORMATS[opts.format] ? opts.format : 'jpeg';
    const clean = opts.denoise !== false && opts.denoise !== 'false';     // default on in this mode
    const tone = opts.contrast !== false && opts.contrast !== 'false';    // default on in this mode

    const meta = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error' }).metadata();
    if (meta.hasAlpha) return enhanceStandard(input, { ...opts, denoise: false, contrast: false });

    let { data, info } = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error' })
        .rotate().removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
    const inWidth = info.width, inHeight = info.height;
    const steps = [];

    const longEdge = Math.max(inWidth, inHeight);
    let scale = TARGETS[target] / longEdge;
    const upscaled = scale > 1.05;
    if (!upscaled) scale = 1;
    // exact output size: long edge = target, the other side keeps the original proportions
    let outW = Math.round(inWidth * scale), outH = Math.round(inHeight * scale);
    if (outW * outH > MAX_OUTPUT_PIXELS) { const k = Math.sqrt(MAX_OUTPUT_PIXELS / (outW * outH)); outW = Math.floor(outW * k); outH = Math.floor(outH * k); }

    // the AI works on a picture whose 4x result is about the target size
    const useAi = opts.engine !== 'classic' && upscaled && (await isAiAvailable());
    if (useAi) {
        const cap = Math.ceil(TARGETS[target] / 4);
        if (Math.max(info.width, info.height) > cap) {
            const r = await sharp(data, rawOf(data, info)).resize(cap, cap, { fit: 'inside', kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true });
            data = r.data; info = r.info;
        }
    }

    const stats = analyze(data, info.width, info.height);
    if (clean && info.width * info.height <= 12_000_000) {
        const d = denoise(data, info.width, info.height, stats.noise);
        steps.push(d.luma ? 'noise' : 'colour-noise', 'artifacts');
    }
    if (tone) steps.push(...lightAndColour(data, stats));

    let engine = 'classic';
    if (useAi) {
        try {
            const w0 = info.width, h0 = info.height;
            const up = await aiUpscale4x(data, w0, h0);
            const ref = await sharp(data, rawOf(data, info)).resize(up.width, up.height, { kernel: 'lanczos3', fit: 'fill' }).raw().toBuffer();
            lockToReference(up.data, ref, up.width, up.height, pro.alpha);
            data = up.data; info = { width: up.width, height: up.height, channels: 3 };
            engine = 'ai';
        } catch (e) { console.error('AI upscale failed, using classic:', e.message); }
    }

    // Classic growth in steps of at most 2x (only when the AI did not run)
    let curW = info.width, curH = info.height;
    while (engine !== 'ai' && upscaled && outW / curW > 2.0001) {
        const r = await sharp(data, rawOf(data, info)).resize(curW * 2, curH * 2, { kernel: 'lanczos3' }).sharpen({ sigma: 0.6, m1: 0.3, m2: 1.0 }).raw().toBuffer({ resolveWithObject: true });
        data = r.data; info = r.info; curW = info.width; curH = info.height;
    }

    let p = sharp(data, rawOf(data, info));
    if (upscaled || outW !== curW || outH !== curH) p = p.resize(outW, outH, { kernel: 'lanczos3', fit: 'fill' });
    // finishing: brightness-only sharpening, flat areas left alone (m1 0) so no grain or halo is added
    p = p.sharpen({ sigma: engine === 'ai' ? 0.8 : 1.0, m1: 0, m2: pro.m2, x1: 2, y2: 10, y3: 20 });
    if (format === 'jpeg') p = p.jpeg({ quality: 93, chromaSubsampling: '4:4:4', mozjpeg: true });
    else if (format === 'png') p = p.png({ compressionLevel: 6 });
    else p = p.webp({ quality: 93, effort: 3 });
    const out = await p.toBuffer({ resolveWithObject: true });
    steps.push(engine === 'ai' ? 'enlarge-ai' : 'enlarge');
    return { buffer: out.data, mime: FORMATS[format].mime, ext: FORMATS[format].ext, width: out.info.width, height: out.info.height, inWidth, inHeight, scale: out.info.width / inWidth, upscaled, hasAlpha: false, engine, mode: 'pro', steps };
}
