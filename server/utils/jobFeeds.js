// Fetches and normalises job listings from public feeds. Every fetcher returns an array of
//   { externalId, title, company, location, country, remote, employmentType, department,
//     salary, description (plain text), applyUrl, postedAt }
// Only public, documented endpoints are used and each request identifies itself.

const HOSTS = () => ({
    greenhouse: process.env.JOBS_GREENHOUSE_BASE || 'https://boards-api.greenhouse.io',
    lever: process.env.JOBS_LEVER_BASE || 'https://api.lever.co',
    ashby: process.env.JOBS_ASHBY_BASE || 'https://api.ashbyhq.com',
    arbeitnow: process.env.JOBS_ARBEITNOW_BASE || 'https://www.arbeitnow.com',
    adzuna: process.env.JOBS_ADZUNA_BASE || 'https://api.adzuna.com',
});

const MAX_JOBS_PER_SOURCE = 2000;
export const TOKEN_RX = /^[A-Za-z0-9_.-]{1,80}$/;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…', bull: '•' };
export const decodeEntities = (s) => String(s || '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
        const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
});

// HTML -> readable plain text. Lists become "- " lines, block tags become line breaks.
// The result is only ever rendered as text (React) or escaped again (server HTML).
export const htmlToText = (html) => {
    let t = String(html || '');
    t = t.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '');
    t = t.replace(/<li[^>]*>/gi, '\n- ').replace(/<\/li>/gi, '');
    t = t.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|h[1-6]|ul|ol|tr|section|article)>/gi, '\n\n');
    t = t.replace(/<[^>]+>/g, '');
    t = decodeEntities(t);
    return t.replace(/[ \t ]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
};

const cut = (s, n) => String(s ?? '').trim().slice(0, n);
const toDate = (v) => { if (v == null || v === '') return undefined; const d = new Date(typeof v === 'number' && v < 1e11 ? v * 1000 : v); return Number.isNaN(+d) ? undefined : d; };
const httpUrl = (u) => (/^https?:\/\//i.test(String(u || '')) ? String(u).trim() : '');
const TYPE_MAP = { fulltime: 'Full-time', 'full-time': 'Full-time', 'full time': 'Full-time', parttime: 'Part-time', 'part-time': 'Part-time', 'part time': 'Part-time', contract: 'Contract', contractor: 'Contract', intern: 'Internship', internship: 'Internship', temporary: 'Temporary', permanent: 'Full-time' };
const normType = (v) => { const k = String(v || '').trim().toLowerCase(); return TYPE_MAP[k] || cut(v, 40); };

export const getJson = async (url, { headers = {}, timeoutMs = 25000 } = {}) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json', 'User-Agent': 'PrimeResumeAI-JobsBot/1.0 (+https://primeresumeai.com)', ...headers } });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText || 'error'} from ${new URL(url).host}`);
        return await res.json();
    } catch (e) {
        if (e.name === 'AbortError') throw new Error(`Timed out fetching ${new URL(url).host}`);
        throw e;
    } finally { clearTimeout(timer); }
};

const fetchers = {
    // https://developers.greenhouse.io/job-board.html  (public Job Board API)
    async greenhouse(src) {
        const data = await getJson(`${HOSTS().greenhouse}/v1/boards/${encodeURIComponent(src.token)}/jobs?content=true`);
        return (data.jobs || []).map((j) => ({
            externalId: String(j.id),
            title: j.title,
            company: j.company_name || src.company,
            location: j.location?.name || '',
            remote: /remote/i.test(j.location?.name || ''),
            department: j.departments?.[0]?.name || '',
            // content is HTML that was escaped once more, so decode first, then convert to text
            description: htmlToText(decodeEntities(j.content || '')),
            applyUrl: j.absolute_url,
            postedAt: toDate(j.first_published || j.updated_at),
        }));
    },
    // https://github.com/lever/postings-api
    async lever(src) {
        const data = await getJson(`${HOSTS().lever}/v0/postings/${encodeURIComponent(src.token)}?mode=json`);
        return (Array.isArray(data) ? data : []).map((j) => {
            const parts = [j.descriptionPlain || htmlToText(j.description)];
            for (const l of j.lists || []) parts.push(`${l.text || ''}\n${htmlToText(l.content)}`.trim());
            parts.push(j.additionalPlain || htmlToText(j.additional));
            return {
                externalId: String(j.id),
                title: j.text,
                company: src.company,
                location: j.categories?.location || (j.categories?.allLocations || [])[0] || '',
                country: j.country || '',
                remote: String(j.workplaceType || '').toLowerCase() === 'remote',
                employmentType: normType(j.categories?.commitment),
                department: j.categories?.team || '',
                description: parts.filter(Boolean).join('\n\n'),
                applyUrl: j.hostedUrl || j.applyUrl,
                postedAt: toDate(j.createdAt),
            };
        });
    },
    // https://developers.ashbyhq.com/docs/public-job-posting-api
    async ashby(src) {
        const data = await getJson(`${HOSTS().ashby}/posting-api/job-board/${encodeURIComponent(src.token)}?includeCompensation=true`);
        return (data.jobs || []).filter((j) => j.isListed !== false).map((j) => ({
            externalId: String(j.id),
            title: j.title,
            company: src.company,
            location: j.location || '',
            country: j.address?.postalAddress?.addressCountry || '',
            remote: Boolean(j.isRemote) || String(j.workplaceType || '').toLowerCase() === 'remote',
            employmentType: normType(j.employmentType),
            department: j.department || '',
            salary: cut(j.compensation?.scrapeableCompensationSalarySummary || j.compensation?.compensationTierSummary, 120),
            description: j.descriptionPlain || htmlToText(j.descriptionHtml),
            applyUrl: j.jobUrl || j.applyUrl,
            postedAt: toDate(j.publishedAt),
        }));
    },
    // https://www.arbeitnow.com/api/job-board-api  (free, no key; please credit Arbeitnow)
    async arbeitnow(src) {
        const data = await getJson(`${HOSTS().arbeitnow}/api/job-board-api`);
        const q = src.query ? src.query.toLowerCase() : '';
        return (data.data || []).filter((j) => !q || `${j.title} ${j.company_name} ${(j.tags || []).join(' ')}`.toLowerCase().includes(q)).map((j) => ({
            externalId: String(j.slug),
            title: j.title,
            company: j.company_name,
            location: j.location || '',
            remote: Boolean(j.remote),
            employmentType: normType((j.job_types || [])[0]),
            department: (j.tags || [])[0] || '',
            description: htmlToText(j.description),
            applyUrl: j.url,
            postedAt: toDate(j.created_at),
        }));
    },
    // https://developer.adzuna.com/  - needs a free app id/key (ADZUNA_APP_ID, ADZUNA_APP_KEY).
    // Adzuna returns a short description and a redirect link; credit "Jobs by Adzuna" next to the listing.
    async adzuna(src) {
        const id = process.env.ADZUNA_APP_ID, key = process.env.ADZUNA_APP_KEY;
        if (!id || !key) throw new Error('Set ADZUNA_APP_ID and ADZUNA_APP_KEY in server/.env to use Adzuna.');
        const country = (src.token || 'in').toLowerCase();
        if (!/^[a-z]{2}$/.test(country)) throw new Error('Adzuna country must be a 2-letter code, e.g. "in".');
        const out = [];
        for (let page = 1; page <= 4; page++) {
            const url = `${HOSTS().adzuna}/v1/api/jobs/${country}/search/${page}?app_id=${encodeURIComponent(id)}&app_key=${encodeURIComponent(key)}&results_per_page=50&sort_by=date&content-type=application/json${src.query ? `&what=${encodeURIComponent(src.query)}` : ''}`;
            const data = await getJson(url);
            const rows = data.results || [];
            for (const j of rows) {
                out.push({
                    externalId: String(j.id),
                    title: j.title,
                    company: j.company?.display_name || 'Company',
                    location: j.location?.display_name || '',
                    country: country.toUpperCase(),
                    remote: /remote/i.test(`${j.title} ${j.location?.display_name || ''}`),
                    employmentType: normType(j.contract_time),
                    department: j.category?.label || '',
                    salary: j.salary_min ? cut(`${Math.round(j.salary_min)}${j.salary_max ? ' - ' + Math.round(j.salary_max) : ''}`, 120) : '',
                    description: htmlToText(j.description),
                    applyUrl: j.redirect_url,
                    postedAt: toDate(j.created),
                });
            }
            if (rows.length < 50) break;
        }
        return out;
    },
};

// Returns clean, validated listings for one JobSource document.
export const fetchSourceJobs = async (src) => {
    const fn = fetchers[src.type];
    if (!fn) throw new Error(`Unknown source type "${src.type}"`);
    if (['greenhouse', 'lever', 'ashby'].includes(src.type) && !TOKEN_RX.test(src.token || '')) throw new Error('Invalid board name.');
    const rows = await fn(src);
    const jobs = [];
    for (const r of rows) {
        const applyUrl = httpUrl(r.applyUrl);
        const title = cut(r.title, 200), company = cut(r.company || src.company, 150), externalId = cut(r.externalId, 200);
        if (!applyUrl || !title || !company || !externalId) continue;   // skip anything we cannot link to
        jobs.push({
            externalId, title, company,
            location: cut(r.location, 200), country: cut(r.country, 60), remote: Boolean(r.remote),
            employmentType: cut(r.employmentType, 40), department: cut(r.department, 120), salary: cut(r.salary, 120),
            description: cut(r.description, 20000), applyUrl: cut(applyUrl, 1000), postedAt: r.postedAt,
        });
        if (jobs.length >= MAX_JOBS_PER_SOURCE) break;
    }
    return jobs;
};

// Sources the admin can add with one click. Each board name was checked against the live public API.
export const STARTER_SOURCES = [
    { type: 'greenhouse', company: 'Groww', token: 'groww' },
    { type: 'lever', company: 'CRED', token: 'cred' },
    { type: 'lever', company: 'Meesho', token: 'meesho' },
    { type: 'greenhouse', company: 'Cloudflare', token: 'cloudflare' },
    { type: 'greenhouse', company: 'Stripe', token: 'stripe' },
    { type: 'lever', company: 'Palantir', token: 'palantir' },
    { type: 'ashby', company: 'Ashby', token: 'ashby' },
];
