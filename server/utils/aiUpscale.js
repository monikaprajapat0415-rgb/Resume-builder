import path from 'path';
import { fileURLToPath } from 'url';

// AI 4x upscaler: Real-ESRGAN "general x4 v3" (a small 5 MB model, BSD-3 licence) run on the CPU through onnxruntime.
// The picture is processed in small tiles so memory stays modest. If the runtime or model cannot load, callers fall back
// to the classic engine (isAiAvailable() -> false).
const MODEL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'ai', 'esrgan_x4.onnx');
const TILE = 192, PAD = 16, SCALE = 4;

let ort = null, sessionP = null, failed = false;
async function getSession() {
    if (failed) return null;
    if (!sessionP) {
        sessionP = (async () => {
            ort = await import('onnxruntime-node');
            return ort.InferenceSession.create(MODEL, { intraOpNumThreads: 2, graphOptimizationLevel: 'all' });
        })().catch((e) => { failed = true; console.error('AI upscaler unavailable:', e.message); return null; });
    }
    return sessionP;
}
export async function isAiAvailable() { return !!(await getSession()); }

// rgb: Buffer of width*height*3 (8-bit). Returns { data: Buffer (4w x 4h x 3), width, height }.
export async function aiUpscale4x(rgb, w, h) {
    const session = await getSession();
    if (!session) throw new Error('AI engine not available');
    const OW = w * SCALE, OH = h * SCALE;
    const out = Buffer.allocUnsafe(OW * OH * 3);
    for (let ty = 0; ty < h; ty += TILE) {
        for (let tx = 0; tx < w; tx += TILE) {
            const x0 = Math.max(0, tx - PAD), y0 = Math.max(0, ty - PAD);
            const x1 = Math.min(w, tx + TILE + PAD), y1 = Math.min(h, ty + TILE + PAD);
            const tw = x1 - x0, th = y1 - y0;
            const f = new Float32Array(3 * tw * th);
            for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
                const s = ((y0 + y) * w + x0 + x) * 3, d = y * tw + x;
                f[d] = rgb[s] / 255; f[tw * th + d] = rgb[s + 1] / 255; f[2 * tw * th + d] = rgb[s + 2] / 255;
            }
            const res = await session.run({ input: new ort.Tensor('float32', f, [1, 3, th, tw]) });
            const o = res.output.data, ow = tw * SCALE, oh = th * SCALE;
            const cx0 = (tx - x0) * SCALE, cy0 = (ty - y0) * SCALE;
            const cw = Math.min(TILE, w - tx) * SCALE, ch = Math.min(TILE, h - ty) * SCALE;
            for (let y = 0; y < ch; y++) {
                let d = ((ty * SCALE + y) * OW + tx * SCALE) * 3;
                for (let x = 0; x < cw; x++) {
                    const i = (cy0 + y) * ow + cx0 + x;
                    for (let c = 0; c < 3; c++) {
                        const v = Math.round(o[c * ow * oh + i] * 255);
                        out[d++] = v < 0 ? 0 : v > 255 ? 255 : v;
                    }
                }
            }
            res.output.dispose?.();
        }
    }
    return { data: out, width: OW, height: OH };
}
