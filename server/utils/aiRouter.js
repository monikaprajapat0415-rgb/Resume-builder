// Multi-provider AI routing with automatic fallback.
//
// callAI(system, user) tries each configured provider in order. If one is busy, rate-limited, down,
// times out, or returns an empty / unusable answer, the next one is tried, so users rarely see
// "AI service is busy". A provider that just failed is skipped for a cool-down period so later
// requests do not waste time on it; if everything is cooling down they are still tried as a last resort.
//
// Providers (all optional except the first one you already have):
//   1. "primary"      - your existing client (Gemini via GEMINI_API_KEY, or OpenAI-style via OPENAI_*).
//   2. Extra Gemini models on the same key:  GENAI_FALLBACK_MODELS=gemini-2.5-flash-lite,gemini-2.0-flash
//   3. Any OpenAI-compatible service (Groq, OpenRouter, Cerebras, DeepSeek, Mistral, OpenAI...):
//        AI_FALLBACK_1_NAME=groq
//        AI_FALLBACK_1_BASE_URL=https://api.groq.com/openai/v1
//        AI_FALLBACK_1_KEY=...
//        AI_FALLBACK_1_MODEL=llama-3.3-70b-versatile
//      ...up to AI_FALLBACK_8_*.
import ai from '../configs/ai.js';

const GEMINI_OPENAI_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai';
const num = (v, d) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const withTimeout = (promise, ms, label) => new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(Object.assign(new Error(`${label} timed out after ${ms}ms`), { code: 'ETIMEDOUT', transient: true })), ms);
    promise.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
});

// ---- error classification ----
export const classify = (err) => {
    const status = Number(err?.status || err?.statusCode || err?.response?.status) || (/^\s*(\d{3})\b/.exec(err?.message || '') || [])[1] * 1 || 0;
    const msg = String(err?.message || err || '');
    if (err?.transient) return { kind: 'transient', cooldownMs: 30_000 };
    if (status === 429 || /RESOURCE_EXHAUSTED|rate.?limit|quota/i.test(msg)) {
        const daily = /per.?day|daily|billing|exceeded your current quota/i.test(msg);
        const ra = Number(err?.retryAfter);
        return { kind: 'rate_limited', cooldownMs: daily ? 30 * 60_000 : Math.min(Math.max((ra || 60) * 1000, 15_000), 5 * 60_000) };
    }
    if ([401, 403].includes(status) || /api key not valid|invalid api key|permission denied|unauthorized|PERMISSION_DENIED/i.test(msg)) return { kind: 'auth', cooldownMs: 10 * 60_000 };
    if (status === 404 || /model.*not found|not found.*model|NOT_FOUND/i.test(msg)) return { kind: 'bad_model', cooldownMs: 10 * 60_000 };
    if ([408, 409, 425, 500, 502, 503, 504, 529].includes(status) || /UNAVAILABLE|overloaded|high demand|temporar|timeout|timed out|ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed|socket|network|Connection error/i.test(msg)) return { kind: 'transient', cooldownMs: 45_000 };
    if (status === 400) return { kind: 'bad_request', cooldownMs: 0 }; // this prompt was refused; the provider itself is fine
    return { kind: 'unknown', cooldownMs: 20_000 };
};

// ---- provider adapters: each returns the answer text ----
const geminiText = (r) => r?.text ?? r?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('') ?? '';

const makePrimary = () => {
    if (ai?.models?.generateContent) {
        const model = process.env.GENAI_MODEL || process.env.OPENAI_MODEL;
        return { name: 'primary', model, call: async (system, user) => geminiText(await ai.models.generateContent({ model, contents: `${system}\n\n${user}` })) };
    }
    if (ai?.chat?.completions?.create) {
        const model = process.env.OPENAI_MODEL;
        return { name: 'primary', model, call: async (system, user) => (await ai.chat.completions.create({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }))?.choices?.[0]?.message?.content };
    }
    return null;
};

const makeOpenAICompat = ({ name, baseUrl, key, model }) => ({
    name, model,
    call: async (system, user, signal) => {
        const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
            method: 'POST', signal,
            headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
            body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
        });
        if (!res.ok) {
            const body = (await res.text().catch(() => '')).slice(0, 300);
            throw Object.assign(new Error(`${res.status} ${body}`), { status: res.status, retryAfter: Number(res.headers.get('retry-after')) || undefined });
        }
        const data = await res.json();
        return data?.choices?.[0]?.message?.content;
    },
});

export const buildProvidersFromEnv = (env = process.env) => {
    const list = [];
    const primary = makePrimary();
    if (primary) list.push(primary);
    const geminiKey = env.GEMINI_API_KEY || env.GENAI_API_KEY;
    (env.GENAI_FALLBACK_MODELS || '').split(',').map((m) => m.trim()).filter(Boolean).forEach((model) => {
        if (geminiKey) list.push(makeOpenAICompat({ name: `gemini:${model}`, baseUrl: GEMINI_OPENAI_BASE, key: geminiKey, model }));
    });
    for (let i = 1; i <= 8; i++) {
        const baseUrl = env[`AI_FALLBACK_${i}_BASE_URL`];
        const model = env[`AI_FALLBACK_${i}_MODEL`];
        let key = env[`AI_FALLBACK_${i}_KEY`];
        if (!key && /generativelanguage\.googleapis\.com/.test(baseUrl || '')) key = geminiKey;
        if (!baseUrl || !model || !key) { if (baseUrl || model || key) console.warn(`[ai] AI_FALLBACK_${i}_* is incomplete (needs BASE_URL, MODEL and KEY) - ignored`); continue; }
        try { new URL(baseUrl); } catch { console.warn(`[ai] AI_FALLBACK_${i}_BASE_URL is not a valid URL - ignored`); continue; }
        list.push(makeOpenAICompat({ name: env[`AI_FALLBACK_${i}_NAME`] || `fallback-${i}`, baseUrl, key, model }));
    }
    return list;
};

// ---- the router ----
export const createRouter = (providers, opts = {}) => {
    const perCallMs = opts.perCallMs ?? num(process.env.AI_TIMEOUT_MS, 25_000);
    const totalMs = opts.totalMs ?? num(process.env.AI_TOTAL_MS, 55_000);
    const retryDelay = opts.retryDelayMs ?? 400;
    const log = opts.log ?? ((...a) => console.log('[ai]', ...a));
    const state = new Map(providers.map((p) => [p.name, { until: 0, ok: 0, fail: 0, lastError: '', lastKind: '', lastOkAt: 0 }]));

    const call = async (system, user, { validate } = {}) => {
        if (!providers.length) throw new Error('No AI provider is configured');
        const started = Date.now();
        const now = Date.now();
        const ready = providers.filter((p) => state.get(p.name).until <= now);
        const cooling = providers.filter((p) => state.get(p.name).until > now).sort((a, b) => state.get(a.name).until - state.get(b.name).until);
        const order = [...ready, ...cooling]; // cooling ones only as a last resort
        const errors = [];

        for (const p of order) {
            if (Date.now() - started > totalMs) { errors.push('time budget used up'); break; }
            const st = state.get(p.name);
            for (let attempt = 1; attempt <= 2; attempt++) {
                const budgetLeft = totalMs - (Date.now() - started);
                if (budgetLeft < 3000) break;
                const ac = new AbortController();
                try {
                    const text = await withTimeout(Promise.resolve(p.call(system, user, ac.signal)), Math.min(perCallMs, budgetLeft), p.name);
                    const out = typeof text === 'string' ? text : text == null ? '' : JSON.stringify(text);
                    if (!out.trim()) throw Object.assign(new Error('empty response'), { transient: true });
                    if (validate && !validate(out)) throw Object.assign(new Error('response was not in the expected format'), { transient: true, softFail: true });
                    st.ok++; st.until = 0; st.lastOkAt = Date.now();
                    if (errors.length) log(`served by ${p.name} (${p.model}) after ${errors.length} failure(s): ${errors.join(' | ')}`);
                    return out;
                } catch (e) {
                    ac.abort();
                    const c = classify(e);
                    const reason = `${p.name}: ${c.kind} (${String(e?.message || e).replace(/\s+/g, ' ').slice(0, 120)})`;
                    st.fail++; st.lastError = reason; st.lastKind = c.kind;
                    const retryable = c.kind === 'transient' && attempt === 1 && !e.softFail && Date.now() - started < totalMs - 6000;
                    if (retryable) { await sleep(retryDelay); continue; }
                    if (!e.softFail) st.until = Date.now() + c.cooldownMs;
                    errors.push(reason);
                    if (['auth', 'bad_model'].includes(c.kind)) log(`WARNING ${p.name} is misconfigured (${c.kind}); skipping it for ${Math.round(c.cooldownMs / 60000)} min. Check its key/model.`);
                    break;
                }
            }
        }
        const err = new Error(`All AI providers failed: ${errors.join(' | ')}`);
        err.allFailed = true; err.errors = errors;
        log(err.message);
        throw err;
    };

    const status = () => providers.map((p) => { const s = state.get(p.name); return { name: p.name, model: p.model, state: s.until > Date.now() ? 'cooling_down' : 'ready', cooldown_seconds: Math.max(0, Math.round((s.until - Date.now()) / 1000)), successes: s.ok, failures: s.fail, last_error: s.lastError, last_success_at: s.lastOkAt ? new Date(s.lastOkAt).toISOString() : null }; });
    // Admin check: ask every provider a tiny question directly (ignores cool-downs) so keys/models can be verified.
    const probe = async () => Promise.all(providers.map(async (p) => {
        const t0 = Date.now();
        try {
            const out = await withTimeout(Promise.resolve(p.call('Reply with the single word OK.', 'Say OK.', undefined)), 15_000, p.name);
            return { name: p.name, model: p.model, ok: !!String(out || '').trim(), ms: Date.now() - t0, error: '' };
        } catch (e) { return { name: p.name, model: p.model, ok: false, ms: Date.now() - t0, error: `${classify(e).kind}: ${String(e?.message || e).slice(0, 160)}` }; }
    }));
    return { call, status, probe, providers };
};

let _default;
export const defaultRouter = () => {
    if (!_default) {
        _default = createRouter(buildProvidersFromEnv());
        console.log('[ai] providers in fallback order:', _default.providers.map((p) => `${p.name}(${p.model})`).join(' -> ') || '(none)');
    }
    return _default;
};
