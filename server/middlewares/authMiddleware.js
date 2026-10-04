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
export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default protect;