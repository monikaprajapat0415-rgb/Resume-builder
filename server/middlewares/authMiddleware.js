import jwt from 'jsonwebtoken';

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

export default protect;