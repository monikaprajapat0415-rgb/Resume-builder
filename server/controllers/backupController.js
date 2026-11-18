import Blog from '../models/Blog.js';
import Page from '../models/Page.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Roadmap from '../models/Roadmap.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import MenuItem from '../models/MenuItem.js';
import TrustItem from '../models/TrustItem.js';
import SiteContent from '../models/SiteContent.js';
import ToolSettings from '../models/ToolSettings.js';
import AdSettings from '../models/AdSettings.js';
import SignupNudge from '../models/SignupNudge.js';
import SeoIssue from '../models/SeoIssue.js';

// What the backup file holds: site settings and the content an admin writes. It does NOT hold users, resumes, messages,
// payments, community submissions or logs. It is a readable copy for safekeeping, not a full database backup.
const PARTS = [
    ['settings.ads', AdSettings], ['settings.signupNudge', SignupNudge], ['settings.siteContent', SiteContent], ['settings.tools', ToolSettings],
    ['menus', MenuItem], ['trust', TrustItem], ['categories', Category], ['pages', Page], ['products', Product],
    ['blogs', Blog], ['courses', Course], ['lessons', Lesson], ['roadmaps', Roadmap], ['interviewQuestions', InterviewQuestion], ['seoIssues', SeoIssue],
];

// GET /api/admin/backup: streams one JSON file, a collection at a time, so memory stays small.
export const downloadBackup = async (req, res) => {
    try {
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="prime-resume-backup-${stamp}.json"`);
        res.setHeader('Cache-Control', 'no-store');
        res.write(`{"exportedAt":${JSON.stringify(new Date().toISOString())},"note":"Settings and content only. No users, resumes, messages, payments or logs.","data":{`);
        let first = true;
        for (const [name, Model] of PARTS) {
            res.write(`${first ? '' : ','}${JSON.stringify(name)}:[`);
            first = false;
            let n = 0;
            for await (const doc of Model.find({}).lean().cursor()) {
                res.write(`${n++ ? ',' : ''}${JSON.stringify(doc)}`);
            }
            res.write(']');
        }
        res.write('}}');
        if (res.locals) res.locals.auditMeta = { action: 'backup' };
        return res.end();
    } catch (e) {
        if (!res.headersSent) return res.status(500).json({ message: e.message });
        return res.end();
    }
};
