import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    // Read authorization header safely (clients may send 'Bearer <token>' or just the token)
    const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // support both 'Bearer <token>' and raw token
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

}

// Runs after `protect` (needs req.userId already set). Looks the user up fresh
// rather than trusting a role embedded in the JWT, so revoking admin access takes
// effect immediately instead of waiting for the 7-day token to expire.
import { editorMayUse } from '../utils/staffAccess.js';

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        req.adminUser = user; // used by the admin audit log
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// For /api/admin: admins can do everything; editors only what utils/staffAccess.js allows.
export const isStaff = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !['admin', 'editor'].includes(user.role)) {
            return res.status(403).json({ message: 'Admin access required' });
        }
        if (user.role === 'editor' && !editorMayUse(req.method, req.path, req.body)) {
            return res.status(403).json({ message: 'Your editor role cannot do this. Ask an admin.' });
        }
        req.adminUser = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default protect;