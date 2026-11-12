import AdminLog from "../models/AdminLog.js";

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/admin/activity?page=&q=&admin=&kind=  (kind: all | deletes | plans)
export const getActivity = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = 30;
        const f = {};
        if (req.query.q) f.$or = [{ action: new RegExp(esc(String(req.query.q).slice(0, 60)), 'i') }, { path: new RegExp(esc(String(req.query.q).slice(0, 60)), 'i') }];
        if (req.query.admin) f.adminEmail = String(req.query.admin).slice(0, 120);
        if (req.query.kind === 'deletes') f.$and = [{ $or: [{ method: 'DELETE' }, { action: /^Deleted/ }, { 'meta.action': 'delete' }] }];
        if (req.query.kind === 'plans') f.action = /plan|Payment/i;
        const [rows, total, admins] = await Promise.all([
            AdminLog.find(f).sort({ at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            AdminLog.countDocuments(f),
            AdminLog.distinct('adminEmail'),
        ]);
        return res.status(200).json({ rows, total, page, pages: Math.max(1, Math.ceil(total / limit)), admins: admins.filter(Boolean).sort() });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
