// One person = one key, so the free ATS check can't be repeated by re-registering with
// a trivial variation of the same address (Gmail dots, +tags, upper-case).
export const emailKey = (email) => {
    const e = String(email || '').trim().toLowerCase();
    const [local, domain] = e.split('@');
    if (!local || !domain) return e;
    let l = local.split('+')[0];
    let d = domain;
    if (d === 'gmail.com' || d === 'googlemail.com') { l = l.replace(/\./g, ''); d = 'gmail.com'; }
    return `${l}@${d}`;
};
