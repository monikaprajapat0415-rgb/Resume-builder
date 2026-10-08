import Message from "../models/Message.js";
import { sendEmail } from "../thirdPartyAPIs/userEmail.js";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// POST /api/contact - public. { name, email, message, website }
// `website` is a honeypot: real visitors never see or fill it, bots usually do. When
// it's filled we answer "success" but store nothing, so bots get no signal to adapt to.
export const submitMessage = async (req, res) => {
    try {
        const { name, email, message, website } = req.body || {};
        if (website) return res.status(201).json({ message: 'Message sent' });

        const n = typeof name === 'string' ? name.trim() : '';
        const e = typeof email === 'string' ? email.trim() : '';
        const m = typeof message === 'string' ? message.trim() : '';
        if (!n || !e || !m) return res.status(400).json({ message: 'Please fill in your name, email and message.' });
        if (!EMAIL_RX.test(e)) return res.status(400).json({ message: 'Please enter a valid email address.' });
        if (n.length > 100 || m.length > 5000) return res.status(400).json({ message: 'Your name or message is too long.' });

        await Message.create({ name: n, email: e, message: m });

        // Best-effort heads-up to the admin. The message is already saved, so an email
        // failure (bad SendGrid key, etc.) must never turn this into an error for the visitor.
        if (process.env.ADMIN_EMAIL && process.env.SENDGRID_API_KEY) {
            sendEmail(
                process.env.ADMIN_EMAIL, '',
                `New contact message from ${n}`,
                `<p><strong>${escapeHtml(n)}</strong> (${escapeHtml(e)}) wrote:</p><p style="white-space:pre-wrap">${escapeHtml(m)}</p><p>Read it in Admin &gt; Messages.</p>`
            ).catch((err) => console.warn('[contact] notification email failed:', err.message));
        }

        return res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        return res.status(500).json({ message: 'Could not send your message. Please try again.' });
    }
}

// ---------- Admin ----------

// GET /api/admin/messages?status=inbox|unread|archived|all&q=&page=
export const getMessages = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = 25;
        const status = req.query.status || 'inbox';
        const filter = {};
        if (status === 'inbox') filter.archived = false;
        else if (status === 'unread') { filter.archived = false; filter.read = false; }
        else if (status === 'archived') filter.archived = true;
        if (req.query.q) {
            const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i');
            filter.$or = [{ name: rx }, { email: rx }, { message: rx }];
        }
        const [messages, total, unread] = await Promise.all([
            Message.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            Message.countDocuments(filter),
            Message.countDocuments({ read: false, archived: false }),
        ]);
        return res.status(200).json({ messages, total, unread, page, pages: Math.max(1, Math.ceil(total / limit)) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUnreadCount = async (req, res) => {
    try {
        return res.status(200).json({ unread: await Message.countDocuments({ read: false, archived: false }) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// PATCH /api/admin/messages/:id { read?, archived? }
export const updateMessage = async (req, res) => {
    try {
        const change = {};
        if (req.body.read !== undefined) change.read = Boolean(req.body.read);
        if (req.body.archived !== undefined) change.archived = Boolean(req.body.archived);
        const message = await Message.findByIdAndUpdate(req.params.id, change, { returnDocument: 'after' });
        if (!message) return res.status(404).json({ message: 'Message not found' });
        return res.status(200).json({ message: 'Updated', item: message });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const markAllRead = async (req, res) => {
    try {
        const r = await Message.updateMany({ read: false }, { read: true });
        return res.status(200).json({ message: 'All marked as read', modified: r.modifiedCount });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        return res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
