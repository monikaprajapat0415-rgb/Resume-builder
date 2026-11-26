import PageVideo from "../models/PageVideo.js";

const str = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

// Accepts a full YouTube address (watch, youtu.be, embed, shorts, live) or the bare 11-character id.
export const youtubeIdFrom = (input) => {
    const s = String(input ?? '').trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    try {
        const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
        const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '');
        let id = '';
        if (host === 'youtu.be') id = u.pathname.split('/')[1] || '';
        else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
            if (u.pathname === '/watch') id = u.searchParams.get('v') || '';
            else { const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/); id = m ? m[1] : ''; }
        }
        return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
    } catch { return ''; }
};

// "/CV-Builder/" -> "/cv-builder". Query strings and hashes are dropped. The home page is "/".
export const normalizePath = (v) => {
    let p = String(v ?? '').trim().split(/[?#]/)[0];
    p = p.replace(/^https?:\/\/[^/]+/i, '');
    if (!p.startsWith('/')) p = `/${p}`;
    p = p.replace(/\/{2,}/g, '/').toLowerCase();
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p.slice(0, 200);
};

const clean = (b) => {
    const out = {};
    out.youtubeId = youtubeIdFrom(b.youtubeId ?? b.url);
    if (!out.youtubeId) throw new Error('Paste a YouTube link such as https://youtu.be/xxxxxxxxxxx.');
    out.path = normalizePath(b.path);
    if (out.path.length < 1) throw new Error('Enter the page address, for example /cv-builder.');
    out.title = str(b.title, 100);
    if (!out.title) throw new Error('The video title is required.');
    out.description = str(b.description, 300);
    if (out.description.length < 20) throw new Error('Write a short description of the video (at least 20 characters). Google needs it.');
    const d = new Date(b.uploadDate);
    if (Number.isNaN(d.getTime())) throw new Error('Enter the date the video was uploaded.');
    if (d.getTime() > Date.now() + 86400000) throw new Error('The upload date cannot be in the future.');
    out.uploadDate = d;
    const dur = Math.round(Number(b.durationSec) || 0);
    out.durationSec = dur >= 0 && dur <= 86400 ? dur : 0;
    out.order = Number.isFinite(Number(b.order)) ? Number(b.order) : 0;
    out.visible = !!b.visible;
    return out;
};

// ---- public: GET /api/videos?path=/cv-builder ----
export const getPageVideos = async (req, res) => {
    try {
        const path = normalizePath(req.query.path);
        res.set('Cache-Control', 'public, max-age=0, s-maxage=60, must-revalidate');
        const items = await PageVideo.find({ path, visible: true }).sort({ order: 1, createdAt: 1 }).limit(3).lean();
        return res.status(200).json({
            videos: items.map((v) => ({ id: String(v._id), youtubeId: v.youtubeId, title: v.title, description: v.description, uploadDate: v.uploadDate, durationSec: v.durationSec })),
        });
    } catch (error) { return res.status(200).json({ videos: [] }); }   // a video is never worth breaking a page for
};

// ---- admin ----
export const adminListVideos = async (req, res) => {
    try {
        const items = await PageVideo.find({}).sort({ path: 1, order: 1, createdAt: 1 }).lean();
        return res.status(200).json({ items });
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const adminCreateVideo = async (req, res) => {
    try { return res.status(201).json({ item: await PageVideo.create(clean(req.body || {})) }); }
    catch (error) { return res.status(400).json({ message: error.message }); }
};

export const adminUpdateVideo = async (req, res) => {
    try {
        const current = await PageVideo.findById(req.params.id);
        if (!current) return res.status(404).json({ message: 'Not found' });
        const merged = { ...current.toObject(), ...(req.body || {}) };
        merged.youtubeId = req.body?.youtubeId ?? req.body?.url ?? current.youtubeId;
        Object.assign(current, clean(merged));
        await current.save();
        return res.status(200).json({ item: current });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

export const adminDeleteVideo = async (req, res) => {
    try {
        const gone = await PageVideo.findByIdAndDelete(req.params.id);
        if (!gone) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json({ message: 'Deleted' });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};
