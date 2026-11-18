// Draft preview: `?preview=1` plus a valid admin (or editor) token lets that person read an unpublished
// item through the normal public endpoint. Anyone else gets the usual published-only answer.
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const canPreview = async (req) => {
    try {
        if (req.query?.preview !== '1') return false;
        const token = req.headers.authorization;
        if (!token) return false;
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const u = await User.findById(userId).select('role');
        return Boolean(u && ['admin', 'editor'].includes(u.role));
    } catch { return false; }
};
