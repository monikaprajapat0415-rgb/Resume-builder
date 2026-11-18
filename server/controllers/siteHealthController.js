import Blog from '../models/Blog.js';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import Roadmap from '../models/Roadmap.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import InterviewAnswer from '../models/InterviewAnswer.js';
import SalaryReport from '../models/SalaryReport.js';
import CompanyReview from '../models/CompanyReview.js';
import Job from '../models/Job.js';
import Message from '../models/Message.js';
import { getAdSettings } from './adsController.js';
import { getNudge } from './nudgeController.js';

// GET /api/admin/site-health: a short list of things that usually need a look. Each check is counted on its own; a check
// that fails shows as null instead of breaking the card.
const safe = async (fn) => { try { return await fn(); } catch { return null; } };

export const siteHealth = async (req, res) => {
    const [ads, nudge, blogs, lessons, courses, roadmaps, questions, pend, jobsOpen, jobsClosed, unread] = await Promise.all([
        safe(getAdSettings), safe(getNudge),
        safe(() => Blog.countDocuments({ published: false })), safe(() => Lesson.countDocuments({ published: false })),
        safe(() => Course.countDocuments({ published: false })), safe(() => Roadmap.countDocuments({ published: false })),
        safe(() => InterviewQuestion.countDocuments({ published: false })),
        safe(async () => (await Promise.all([InterviewAnswer.countDocuments({ status: 'pending' }), SalaryReport.countDocuments({ status: 'pending' }), CompanyReview.countDocuments({ status: 'pending' })])).reduce((a, b) => a + b, 0)),
        safe(() => Job.countDocuments({ active: true })), safe(() => Job.countDocuments({ active: false })),
        safe(() => Message.countDocuments({ read: false })),
    ]);
    return res.status(200).json({
        ads: ads && { enabled: ads.enabled, publisherSet: Boolean(ads.publisherId), banner: ads.cookieBanner },
        nudge: nudge && { enabled: nudge.enabled },
        drafts: { blogs, lessons, courses, roadmaps, questions },
        pendingModeration: pend,
        jobs: { open: jobsOpen, closed: jobsClosed },
        unreadMessages: unread,
    });
};
