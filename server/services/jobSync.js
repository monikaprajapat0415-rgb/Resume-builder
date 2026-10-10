import crypto from 'crypto';
import Job from '../models/Job.js';
import JobSource from '../models/JobSource.js';
import { fetchSourceJobs } from '../utils/jobFeeds.js';
import { slugify } from '../utils/slugify.js';

let running = false;
export const isSyncRunning = () => running;

const makeSlug = (job, sourceId) => {
    const base = slugify(`${job.title} at ${job.company}`).slice(0, 80) || 'job';
    const suffix = crypto.createHash('sha1').update(`${sourceId}:${job.externalId}`).digest('hex').slice(0, 8);
    return `${base}-${suffix}`;
};

// Pulls one source, upserts its listings and deactivates the ones the employer removed.
export const syncSource = async (source) => {
    const started = new Date();
    try {
        const jobs = await fetchSourceJobs(source);
        if (jobs.length) {
            await Job.bulkWrite(jobs.map((j) => ({
                updateOne: {
                    filter: { sourceId: source._id, externalId: j.externalId },
                    update: {
                        $set: { ...j, sourceType: source.type, lastSeenAt: started, active: true },
                        $setOnInsert: { slug: makeSlug(j, source._id) },
                    },
                    upsert: true,
                },
            })), { ordered: false });
        }
        // anything this source no longer lists is closed (kept 30 days, then deleted)
        const closed = await Job.updateMany({ sourceId: source._id, active: true, lastSeenAt: { $lt: started } }, { $set: { active: false } });
        await JobSource.updateOne({ _id: source._id }, { $set: { lastRunAt: new Date(), lastStatus: 'ok', lastError: '', lastCount: jobs.length } });
        return { ok: true, count: jobs.length, closed: closed.modifiedCount ?? 0 };
    } catch (e) {
        // a failed fetch never closes jobs: we just keep what we had and report the error
        await JobSource.updateOne({ _id: source._id }, { $set: { lastRunAt: new Date(), lastStatus: 'error', lastError: String(e.message || e).slice(0, 300) } });
        return { ok: false, error: String(e.message || e) };
    }
};

export const syncAll = async () => {
    if (running) return { skipped: true };
    running = true;
    try {
        const sources = await JobSource.find({ enabled: true });
        const results = [];
        for (const s of sources) {
            results.push({ id: String(s._id), ...(await syncSource(s)) });
            await new Promise((r) => setTimeout(r, 400));   // be polite to the feeds
        }
        const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000);
        await Job.deleteMany({ active: false, updatedAt: { $lt: cutoff } });
        return { skipped: false, results };
    } finally { running = false; }
};

// Refreshes every enabled source every JOBS_SYNC_HOURS (default 12). Set JOBS_AUTO_SYNC=false to disable.
export const startJobScheduler = () => {
    if (process.env.JOBS_AUTO_SYNC === 'false') return;
    const hours = Math.max(1, Number(process.env.JOBS_SYNC_HOURS) || 12);
    const run = () => syncAll().catch((e) => console.error('[jobs] scheduled sync failed:', e.message));
    setTimeout(run, 90 * 1000).unref?.();
    setInterval(run, hours * 3600 * 1000).unref?.();
    console.log(`[jobs] auto sync every ${hours}h`);
};
