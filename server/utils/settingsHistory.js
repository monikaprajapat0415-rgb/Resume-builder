import SettingsHistory from '../models/SettingsHistory.js';

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

// Keeps only the keys whose value really changed. Returns null when nothing changed.
export const diffSettings = (before = {}, after = {}, keys = null) => {
    const b = {}, a = {};
    for (const k of keys || [...new Set([...Object.keys(before), ...Object.keys(after)])]) {
        if (!same(before[k], after[k])) { b[k] = before[k] ?? ''; a[k] = after[k] ?? ''; }
    }
    return Object.keys(a).length ? { before: b, after: a } : null;
};

// Best effort: a history failure must never break a save.
export const recordChange = async (key, admin, before, after, { keys = null, restoredFrom = false } = {}) => {
    try {
        const d = diffSettings(before, after, keys);
        if (d) await SettingsHistory.create({ key, adminEmail: admin?.email || '', ...d, restoredFrom });
    } catch (e) { console.error('settings history failed:', e.message); }
};
