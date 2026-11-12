import crypto from "node:crypto";

// Lesson translations are stored on the lesson as translations[lang]. Every translation mirrors the
// English structure exactly (same blocks, same code, same quiz answers), and only text "units" differ,
// so a translation can never lose a code block or change which quiz answer is right.
export const LESSON_LANGS = { es: 'Spanish', fr: 'French', pt: 'Portuguese', ar: 'Arabic' };

const plain = (l) => (l && typeof l.toObject === 'function' ? l.toObject() : l) || {};
const isStr = (v) => typeof v === 'string' && v.trim() !== '';

// Every translatable string, with a stable key. Code blocks, image URLs, animation and slugs are not units.
export const unitsOf = (lesson) => {
    const l = plain(lesson);
    const u = [];
    const add = (k, en) => { if (isStr(en)) u.push({ k, en }); };
    add('title', l.title);
    add('description', l.description);
    (l.content || []).forEach((b, i) => {
        if (b.type === 'code') return;
        if (b.type === 'list' || b.type === 'olist') (b.items || []).forEach((t, j) => add(`c.${i}.items.${j}`, t));
        else if (b.type === 'image') { add(`c.${i}.alt`, b.alt); add(`c.${i}.caption`, b.caption); }
        else add(`c.${i}.text`, b.text);
    });
    (l.faqs || []).forEach((f, i) => { add(`f.${i}.q`, f.q); add(`f.${i}.a`, f.a); });
    (Array.isArray(l.quiz) ? l.quiz : []).forEach((q, i) => {
        add(`z.${i}.q`, q.q);
        (q.options || []).forEach((o, j) => add(`z.${i}.options.${j}`, o));
        add(`z.${i}.explain`, q.explain);
    });
    (Array.isArray(l.notes) ? l.notes : []).forEach((t, i) => add(`n.${i}`, t));
    return u;
};

export const hashOf = (lesson) => crypto.createHash('sha1').update(JSON.stringify(unitsOf(lesson).map((x) => x.en))).digest('hex').slice(0, 16);

const spans = (s) => [...String(s).matchAll(/`([^`]*)`/g)].map((m) => m[1]);
const urls = (s) => String(s).match(/https?:\/\/[^\s)\]]+/g) || [];

// '' when the translation is acceptable, otherwise a plain reason. The rules protect what must not change.
export const checkUnit = (en, tr) => {
    if (typeof tr !== 'string') return 'not text';
    if (tr.length > Math.max(60, en.length * 4)) return 'much longer than the original';
    if (tr.length > 6000) return 'too long';
    const a = spans(en), b = spans(tr);
    if (a.length !== b.length || a.some((x, i) => x !== b[i])) return 'inline code in `backticks` must stay exactly the same';
    if (((en.match(/\*\*/g) || []).length) !== ((tr.match(/\*\*/g) || []).length)) return 'the ** bold markers must match the original';
    const ue = urls(en), ut = urls(tr);
    if (ue.some((x) => !ut.includes(x))) return 'links must stay the same';
    return '';
};

const setPath = (obj, key, value) => {
    const p = key.split('.');
    const root = { c: 'content', f: 'faqs', z: 'quiz', n: 'notes' }[p[0]];
    if (!root) { obj[key] = value; return; }
    let cur = obj[root];
    const last = p.slice(1);
    for (let i = 0; i < last.length - 1; i++) cur = cur[last[i]];
    cur[last[last.length - 1]] = value;
};

// Builds the stored object from the English lesson plus { key: translatedText }. Unknown keys and
// empty values are ignored (the English text stays), invalid ones are returned in `rejected`.
export const applyUnits = (lesson, map) => {
    const l = plain(lesson);
    const out = {
        title: l.title, description: l.description || '',
        content: JSON.parse(JSON.stringify(l.content || [])), faqs: JSON.parse(JSON.stringify(l.faqs || [])),
        quiz: Array.isArray(l.quiz) ? JSON.parse(JSON.stringify(l.quiz)) : undefined,
        notes: Array.isArray(l.notes) ? [...l.notes] : undefined,
    };
    const rejected = [];
    let done = 0;
    for (const { k, en } of unitsOf(l)) {
        const tr = map?.[k];
        if (!isStr(tr)) continue;
        const why = checkUnit(en, tr.trim());
        if (why) { rejected.push({ k, why }); continue; }
        setPath(out, k, tr.trim());
        done++;
    }
    return { value: out, rejected, done };
};

// What is currently translated, for the admin editor: [{ k, en, tr }] where tr is '' while untranslated.
export const rowsFor = (lesson, lang) => {
    const l = plain(lesson);
    const t = l.translations?.[lang];
    const at = (k) => {
        if (!t) return '';
        const p = k.split('.');
        const root = { c: 'content', f: 'faqs', z: 'quiz', n: 'notes' }[p[0]];
        let cur = root ? t[root] : t;
        const rest = root ? p.slice(1) : [k];
        for (const x of rest) cur = cur?.[x];
        return typeof cur === 'string' ? cur : '';
    };
    return unitsOf(l).map(({ k, en }) => { const tr = at(k); return { k, en, tr: tr === en ? '' : tr }; });
};

export const isStale = (lesson, lang) => {
    const t = plain(lesson).translations?.[lang];
    return Boolean(t && t.sourceHash && t.sourceHash !== hashOf(lesson));
};

// Which languages a reader may see: published translations only.
export const publishedLangs = (lesson) => Object.entries(plain(lesson).translations || {}).filter(([, t]) => t?.published).map(([k]) => k);

// ---- AI draft ----
const SYSTEM = (language) => `You translate text from a technical course (DevOps, programming, cloud) from English into ${language}.
Rules:
- Use clear, simple, natural ${language}. Short sentences.
- Keep anything inside \`backticks\` EXACTLY as written (commands, file names, code). Do not translate it.
- Keep ** bold markers in the same places.
- Keep URLs, numbers, product and tool names (Docker, Kubernetes, AWS, Git, Linux...) as they are.
- Do not add or remove anything. Do not explain.
- Reply with ONLY a JSON array of strings, the same length and order as the input array.`;

const batches = (units, maxItems = 25, maxChars = 6000) => {
    const out = []; let cur = []; let n = 0;
    for (const u of units) {
        if (cur.length && (cur.length >= maxItems || n + u.en.length > maxChars)) { out.push(cur); cur = []; n = 0; }
        cur.push(u); n += u.en.length;
    }
    if (cur.length) out.push(cur);
    return out;
};

// call(system, user, { validate }) is the AI router. Returns { map, translated, skipped:[{k,why}] }.
export const draftWithAi = async (lesson, lang, call) => {
    const language = LESSON_LANGS[lang];
    if (!language) throw new Error('Unsupported language');
    const map = {}; const skipped = [];
    for (const group of batches(unitsOf(lesson))) {
        const parse = (text) => { try { const m = text.match(/\[[\s\S]*\]/); const a = JSON.parse(m ? m[0] : text); return Array.isArray(a) && a.length === group.length && a.every((x) => typeof x === 'string') ? a : null; } catch { return null; } };
        const raw = await call(SYSTEM(language), JSON.stringify(group.map((g) => g.en)), { validate: (t) => Boolean(parse(t)) });
        const arr = parse(raw);
        group.forEach((g, i) => {
            const why = checkUnit(g.en, arr[i]);
            if (why) skipped.push({ k: g.k, why }); else map[g.k] = arr[i];
        });
    }
    return { map, translated: Object.keys(map).length, skipped };
};
