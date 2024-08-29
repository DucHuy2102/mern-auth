import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied - No token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Acess denied' });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log('Error Verify Token:', error);
        return res.status(500).json({ success: false, message: 'Error Verify Token' });
    }
};
