// "Publish at" scheduling for blog posts, lessons and interview questions.
// A scheduled item is a draft (published:false) with a future publishAt. A timer (startPublishScheduler)
// publishes it when the time comes and clears publishAt. Publishing by hand clears the schedule.
import Blog from '../models/Blog.js';
import Lesson from '../models/Lesson.js';
import InterviewQuestion from '../models/InterviewQuestion.js';

export const cleanPublishAt = (b = {}, now = new Date()) => {
    if (b.publishAt === undefined) return {};
    if (b.publishAt === null || b.publishAt === '') return { publishAt: null };
    if (b.published === true) return { publishAt: null }; // published now: nothing to wait for
    const d = new Date(b.publishAt);
    if (Number.isNaN(+d)) { const e = new Error('Publish at is not a valid date and time.'); e.code = 400; throw e; }
    if (d <= now) { const e = new Error('Publish at must be a time in the future.'); e.code = 400; throw e; }
    return { publishAt: d, published: false };
};

// Publishes everything that is due. Returns how many items changed (for tests and logs).
export const publishDue = async (now = new Date()) => {
    let n = 0;
    for (const M of [Blog, Lesson, InterviewQuestion]) {
        const r = await M.updateMany({ published: false, publishAt: { $ne: null, $lte: now } }, { $set: { published: true, publishAt: null } });
        n += r.modifiedCount ?? r.nModified ?? 0;
    }
    return n;
};

export const startPublishScheduler = (every = 60000) => {
    const tick = () => publishDue().then((n) => { if (n) console.log(`[schedule] published ${n} item(s)`); }).catch((e) => console.error('[schedule] failed:', e.message));
    tick();
    return setInterval(tick, every).unref();
};
